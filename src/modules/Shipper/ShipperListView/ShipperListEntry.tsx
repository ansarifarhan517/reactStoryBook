import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { Box, ListView, Tooltip, IconButton, IListViewColumn, useToast, IFetchDataOptions, ISelectedRows, Grid, BreadCrumb, IFilterOptions } from 'ui-library'
import { ColumnInstance, SortingRule } from 'react-table'
import WhiteCard from '../../../utils/layouts/WhiteCard'
import PageActionButtons from './SubComponent/PageActionButtons'
import withReact from '../../../utils/components/withReact'
import ShipperModals from './ShipperModals'
import { StyledGrid } from './StyledShipperListView'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { useDispatch } from 'react-redux'
import { tShipperListViewAcions } from './ShipperListView.actions'
import { getQueryParams, hybridRouteTo } from '../../../utils/hybridRouting'
import { IShipperListViewRowData, IStatusList, tShipperStatus } from './ShipperListView.models'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import { sendGA } from '../../../utils/ga'
import NoDataView from './SubComponent/NoDataView'
import DownloadModal from './SubComponent/DownloadModal'
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import { dummyData, dummyResult } from './ShipperListView.reducer'
import { IStateService } from 'angular-ui-router'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit'
import { handleCustomColumnSort } from '../../../utils/helper'
interface IShipperListProps {
  ngStateRouter: IStateService
}

const ShipperListViewEntry = ({ ngStateRouter }: IShipperListProps) => {
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
  //const shipper = useTypedSelector(state => state.shipper.listView)
  const columnsSelector = useTypedSelector(state => state.shipper.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.shipper.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.shipper.listView.data.totalCount)
  const structure = useTypedSelector(state => state.shipper.listView.structure)
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
  const editDetails = useTypedSelector(state => state.shipper.listView.editDetails)
  const selectedRows = useTypedSelector(state => state.shipper.listView.selectedRows)
  const fetchOptions = useTypedSelector(state => state.shipper.listView.fetchOptions)
  const isEditMode = useTypedSelector(state => state.shipper.listView.isEditMode)
  const actionBarButtons = useTypedSelector(state => state.shipper.listView.structure.buttons)
  const loading = useTypedSelector(state => state.shipper.listView.loading.listView)
  const breadcrumbFilter = useTypedSelector(state => state.shipper.listView.breadcrumbFilter)
  const isSaveClicked = useTypedSelector(state => state.shipper.listView.isSaveClicked);
  const emptyData = useTypedSelector(state => state.shipper.listView.emptyData);
  const statusList = useTypedSelector(state => state.shipper.listView.statusList);

  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  

  const toast = useToast()
  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [updateConfirmationModal, setUpdateConfirmationModal] = useState<boolean>(false);

  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)

  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [filters, setFilters] = useState<Record<string, string>>()

  const handleQueryParams = () => {
    const filterData = getQueryParams()
    let breadcrumb: tShipperStatus = filterData.page as tShipperStatus
    dispatch({
      type: '@@shipperListView/SET_BREADCRUMB_FILTER',
      payload: breadcrumb || 'ALL',
    });

    // ---------------------
    // const filterData: Record<string, string> = getQueryParams();
    // if no current filter then dont apply filter
    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split('#@#')
    let sortOrder = filterData?.sortOrder?.split('#@#')

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === 'DESC'
      }
      sort.push(temp)
    });
    sort && setSort(sort)
    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s: string | number, index: string | number) => {
        temp[s] = searchText[index]
      })
    if (localStorage.getItem('globalSearchText')) {
      temp["shipperdata"] = localStorage.getItem('globalSearchText') || ""
    }
    setFilters(temp)
    // ---------------------------------------
    return breadcrumb
  }

  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {

    if (!filterListPayload) {
      let existingParams = getQueryParams()

      /** Do not push to history when there is no change. */
      if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
        return
      }
      const newParams = {
        page: existingParams.page || "ALL",
        ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
        ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
      }
      if (!localStorage.getItem("globalSearchText")) {
        setTimeout(() => {
          ngStateRouter.go('shipper', newParams, { notify: false, reload: false, inherit: false, location: true })
        }, 100)
      }
    }
  }

  /** Watchers */
  useEffect(() => {
    handleQueryParams()
    setShowColumnShimmer(true)
    dispatch({ type: '@@shipperListView/FETCH_STRUCTURE' })
    dispatch({ type: '@@shipperListView/INITIAL_LOAD' })
    return (() => {
      dispatch({
        type: '@@shipperListView/RESET_INITIAL_STATE'
      })
      dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
    })
  }, [])

  useEffect(() => {
    //whenevr brd crumb change give structure call
    setShowColumnShimmer(true)
    //dispatch({ type: '@@shipperListView/FETCH_STRUCTURE' })
  }, [breadcrumbFilter])

  useEffect(() => {
    const firstEntry: any = Object.values(columnsSelector)?.[0]
    if (columnsSelector && firstEntry?.id) {
      const mongoStructure = columnsSelector
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(mongoStructure, 'shipper', cellCallbackMapping, "shipperDetailsId")
        setColumns(newColumns)
      }

      // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data

      if (firstEntry?.id) {
        setTimeout(() => { setShowColumnShimmer(false) }, 100)
      }
    }

  }, [columnsSelector])

  const handleActiveFlChange = (isChecked: boolean, { subClientId }: IShipperListViewRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    const shipperDetails = {
      [subClientId]: true
    }
    dispatch({ type: '@@shipperListView/SET_SHIPPER_ACTIVATION', payload: { activeRequest: isChecked, showModal: true, shipperDetailsId: shipperDetails, failureCallback } });
  }

  const cellCallbackMapping = {
    noOfUsers: (_value: number, row: IShipperListViewRowData) => {
      dispatch({ type: '@@shipperListView/SET_NO_OF_USERS_MODAL', payload: { activeRequest: true, customClientId: row.subClientId } })
    },
    isActiveFl: handleActiveFlChange
  }


  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columns = { ...columnsSelector }
    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })
    const payload = {
      ...structure,
      columns
    }
    try {
      const { data: { message } } = await axios.put(apiMappings.shipper.listView.structure, payload, {
        params: {
          modelName: 'SHIPPER',
          pageName: 'SHIPPER',
          sectionName: breadcrumbFilter === 'ALL' ? 'SHIPPER_LIST_VIEW' : `${breadcrumbFilter}_SHIPPER_LIST_VIEW`
        }
      })
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }

  }, [columnsSelector])
  const getBreadCrumbOptions = () => {
    const shipperFilterList: any = []
    statusList?.forEach((shipper: IStatusList) => {
      shipperFilterList.push({
        label: dynamicLabels?.[shipper.name],
        value: shipper?.clientRefMasterCd,
        tooltipText: dynamicLabels?.[shipper.clientRefMasterDesc],
        clientRefMasterCd: shipper?.clientRefMasterCd,
        id: shipper?.clientRefMasterCd,
      })
    })
    shipperFilterList.splice(0, 0, {
      label: dynamicLabels?.shippers ? ( 'All '+dynamicLabels?.shippers) : 'All Shippers',
      value: 'ALL',
      id: 'ALL',
      clientRefMasterCd: 'ALL',
      tooltipText:dynamicLabels?.shippers ? ( 'All '+dynamicLabels?.shippers) : 'All Shippers'
    })
    return shipperFilterList
  }
  const breadCrumbOptionList = React.useMemo(
    () => getBreadCrumbOptions(),
    [dynamicLabels, statusList]
  );
  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      { id: 'customers', label: dynamicLabels.customer || 'Customer', disabled: true },
      // { id: 'shippers', label: dynamicLabels?.shippers || 'Shippers', disabled: true },
    ]
    const dynamicBreadcrumbHeader = breadCrumbOptionList.find(
      (option: any) => option.clientRefMasterCd === breadcrumbFilter
    );

    dynamicBreadcrumbHeader && list.push({
      label: dynamicBreadcrumbHeader?.label,
      value: dynamicBreadcrumbHeader?.clientRefMasterCd,
      tooltipText: dynamicBreadcrumbHeader?.tooltipText,
      clientRefMasterCd: dynamicBreadcrumbHeader?.clientRefMasterCd,
      id: dynamicBreadcrumbHeader?.clientRefMasterCd,
      disabled: false
    });
    return list
  }, [dynamicLabels, breadcrumbFilter, statusList])


  const handleClick = useCallback((id: string) => {

    if (id !== breadcrumbFilter && !emptyData) {
      dispatch({
        type: '@@shipperListView/FETCH_STRUCTURE_SUCCESS', payload: {
          columns: dummyData,
          buttons: {},
        }
      });
      dispatch({
        type: '@@shipperListView/FETCH_DATA_SUCCESS',
        payload: {
          totalCount: 0,
          results: dummyResult
        }
      })
      handleCancelRows()
      breadCrumbOptionList.forEach((shipper: IStatusList) => {
        if (status === 'ALL' && shipper.value === 'ALL') {
          hybridRouteTo('shipper')
        } else if (shipper.value === id) {
          hybridRouteTo(`shipper?page=${shipper?.clientRefMasterCd}`)
        }

      })
    }
    // /** Clear other filters & sorts when Breadcrumb Filter changes */
    // ngStateRouter.go('shipper', { page: status?.searchText || 'ALL' },  { ...ngStateRouterOptions, inherit: false, notify: true, reload: true })

  }, [breadCrumbOptionList, breadcrumbFilter, emptyData])

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector

    try {
      validateRows(editDetails,columnStructure);
    } catch (error) {
      console.log('Inline Edit Validation Failed.', error?.message)
      dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: false });
      dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: true });
      throwError(error);

      if (error.message) {
        toast.add(error.message, '', false)
      }
      return false
    }

    return true
  }

  const handleSaveRows = async () => {
    dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: true });
    const isValid = validateSelectedRows()
    if (isValid) {
      const payload: Partial<IShipperListViewRowData>[] = []
      Object.values(selectedRows as ISelectedRows).forEach((row) => {
        if (editDetails[row.shipperDetailsId]) {
          const obj: any = {
            shipperDetailsId: row.shipperDetailsId
          }
          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              if (editDetails?.[row.shipperDetailsId]?.[columnId]) {
                obj[columnId] = editDetails?.[row.shipperDetailsId]?.[columnId]?.value || row[columnId]
              }
            }
          })
          payload.push(obj)
        }
      })

      if (!payload.length) {
        handleCancelRows()
        return
      }

      try {
        const { data: { message, status } } = await axios.put(apiMappings.shipper.listView.inlineUpdate, payload)
        if (status === 200) {
          dispatch({
            type: '@@shipperListView/FETCH_DATA',
            payload: {
              pageNumber: fetchOptions?.pageNumber,
              pageSize: fetchOptions?.pageSize,
              searchBy: fetchOptions?.filterOptions?.searchBy,
              searchText: fetchOptions?.filterOptions?.searchText,
              sortBy: fetchOptions?.sortOptions?.sortBy,
              sortOrder: fetchOptions?.sortOptions?.sortOrder,
              page: breadcrumbFilter,
              isLoading: true
            }
          })
          dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: false });
          dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: false });
          fetchOptions.apis?.resetSelection()
          dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
          // setShipperUpdateRequest({ activeRequest: false, shipperDetailsId: {} })
          dispatch({ type: '@@shipperListView/CLEAR_EDIT_DETAILS' })
          toast.add(message, 'check-round', false)
          return
        }
        throw message
      } catch (errorMessage) {
        dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: false });
        dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: true });
        const message = errorMessage?.response?.data?.message
        // setShipperUpdateRequest({ activeRequest: false, shipperDetailsId: {} })
        toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
      }
    }
  }

  const handleSave = () => {
    handleSaveRows();
  };

  const handleCancelRows = React.useCallback(() => {
    dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
    dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: false });
    dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: false });
    setUpdateConfirmationModal(false)
    dispatch({ type: '@@shipperListView/CLEAR_EDIT_DETAILS' });
    fetchOptions.apis?.resetSelection();
    dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
    dispatch({ type: '@@shipperListView/SET_EDIT_CONFIRMATION_MODAL', payload: false })

  }, [fetchOptions, editDetails]);

  const handleActionBarButtonClick = (id: string) => {
    switch (id) {
      case 'update':
        sendGA('Event New','Shipper List View - Inline Edit')
        dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: true });
        break;
      case 'approve':
        sendGA('Event New','Shipper List View - Approve Action Clicked')
        dispatch({ type: '@@shipperListView/SET_APPROVAL_MODAL', payload: true });
        break;
      case 'reject':
        sendGA('Event New','Shipper List View - Reject Action Clicked')
        dispatch({ type: '@@shipperListView/SET_REJECT_MODAL', payload: true });
        break;
    }
  }


  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    const page = handleQueryParams()
    sortOptions = handleCustomColumnSort(sortOptions)
    dispatch({ type: '@@shipperListView/SET_FETCH_OPTIONS', payload: { pageSize, pageNumber, sortOptions, filterOptions, apis } })
    dispatch({
      type: '@@shipperListView/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        page: page || 'ALL',
        isLoading: true
      }
    })
  }, [])

  const isRejectedIncluded = !!Object.values(selectedRows as ISelectedRows).find((row: any) => row.status === 'REJECTED')
  const isEmailVerificationPendingIncluded = !!Object.values(selectedRows as ISelectedRows).find((row: any) => row.status === 'EMAIL_VERIFICATION_PENDING')
  const isApprovedIncluded = !!Object.values(selectedRows as ISelectedRows).find((row: any) => row.status === 'APPROVED')
  // enable only for approval pending status and only 1 should be selected
  const isApproveEnable = Object.values(selectedRows as ISelectedRows).length === 1 && Object.values(selectedRows as ISelectedRows)[0]?.status === 'APPROVAL_PENDING'

  // some selection should be there with only approved and approval pending type
  const isUpdateEnable = !isRejectedIncluded && !isEmailVerificationPendingIncluded && Object.values(selectedRows as ISelectedRows).length !== 0
  // for  approval pending status show enable
  const isRejectEnable = Object.values(selectedRows as ISelectedRows).length !== 0 && !isApprovedIncluded && !isEmailVerificationPendingIncluded && !isRejectedIncluded

  const enableStatus = {
    update: isUpdateEnable,
    approve: isApproveEnable,
    reject: isRejectEnable
  }
  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: s });
  }, [])

  const handleCancelRowsChange = React.useCallback(() => {
    const propertyLength = Object.keys(editDetails)?.length
    // anything newly edited then this flag will become true
    if (propertyLength !== 0) {
      setUpdateConfirmationModal(true)
      //dispatch({ type: '@@shipperListView/SET_EDIT_CONFIRMATION_MODAL', payload: true })
    } else {
      // nothing edited just clear all the selection.
      dispatch({ type: '@@shipperListView/SET_IS_SAVE_CLICKED', payload: false });
      dispatch({ type: '@@shipperListView/SET_IS_EDITABLE', payload: false });
      dispatch({ type: '@@shipperListView/CLEAR_EDIT_DETAILS' });
      fetchOptions.apis?.resetSelection();
      dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
      dispatch({ type: '@@shipperListView/SET_EDIT_CONFIRMATION_MODAL', payload: false })

    }
  }, [fetchOptions, editDetails, selectedRows]);
  const buttonList = React.useMemo(() => {
    const buttonArray: any = []
    actionBarButtons && Object.keys?.(actionBarButtons)?.forEach(buttonKey => {
      if (actionBarButtons?.[buttonKey]?.permission) {
        buttonArray.push(buttonKey)
      }
    })
    return buttonArray

  }, [actionBarButtons])

  const buttonToolTipTextList = {
    update: dynamicLabels?.tooltip_shipper_update || `Click here to update the selected ${dynamicLabels?.shipper_p}.`,
    reject: dynamicLabels?.tooltip_shipper_reject || `Click here to reject the selected ${dynamicLabels?.shipper_p}.`,
    approve: dynamicLabels?.tooltip_shipper_approve || `Click here to approve the selected ${dynamicLabels?.shipper_s}.`,
  };


  return <><Box display='flex' mt='64px' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }} px='15px' pb='15px'>
    <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
      <BreadCrumb
        options={breadCrumbOptions}
        optionList={breadCrumbOptionList}
        width='260px'
        onClick={handleClick}
      />
      <PageActionButtons />
    </Box>
    <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
      <Grid
        className='grid-customised-scroll-bar'
        item
        md={12}
        style={{ display: 'flex', overflow: 'hidden' }}
      >
        <WhiteCard>
          {
            emptyData ? <NoDataView
              image='images/ShipperListView/shipper.png'
              message={dynamicLabels?.noShipperAddedYet || `No ${dynamicLabels?.shipper_s} added yet. Click on the button below to add ${dynamicLabels?.shipper_s}.`}
              buttonList={[{
                name: `Add ${dynamicLabels?.shipper_s}`,
                icon: 'icomoon-add',
                href: 'shipper/settings/profile'
              },
              {
                name: `Add Service Area Profile`,
                icon: 'icomoon-add',
                href: 'serviceAreaMaster'
              },
              {
                name: `Add Shipper Rate Chart`,
                icon: 'icomoon-add',
                href: 'shipperRateChart'
              }
              ]}

            /> : (<ListView
              rowIdentifier='shipperDetailsId'
              style={{ height: '100%', overflow: 'visible', boxShadow: '0px 2px 20px -10px #000 !important' }}
              columns={columns}
              data={rowsSelector}
              onFetchData={handleFetchData}
              // hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
              hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
              onRowSelect={onRowSelect}
              onSaveColumnPreferences={onSaveColumnPreferences}
              totalRows={totalRowsSelector}
              loading={showColumnShimmer || loading}
              hideRefresh={showColumnShimmer || loading}
              isColumnLoading={showColumnShimmer}
              isEditMode={isEditMode}
              paginationPageSize={50}
              onFilterChange={handleFilterChange}
              sorts={sort}
              filters={filters}
              permanentColumns={{
                shipperName: true,
                status: true,
                address: true,
                isActiveFl: true
              }}
              //onSortChange={handleSortChange}
              onRowEditClick={(row) => {
                const params = {
                  token: row.token,
                  shipperDetails: row,
                  subClientId: row.subClientId
                }
                hybridRouteTo(`shipper/settings/profile?token=${row?.token}`)
                ngStateRouter.go('shipperSettings.profile', params);
              }}
            >{{
              IconBar:
                <Box>
                  <DownloadModal
                  />

                </Box>,
              ActionBar: (
                <Box display='flex' horizontalSpacing='10px'>
                  {isEditMode ? (
                    <>
                      <Tooltip message={dynamicLabels?.tooltip_shipper_save || `Click here to save the selected ${dynamicLabels.shipper_p}.`} hover={true} messagePlacement='start'>
                        <IconButton
                          intent='table'
                          id='listView-actionBar-save'
                          iconVariant='icomoon-save'
                          onClick={handleSave}
                          disabled={!Object.keys(selectedRows as ISelectedRows).length || isSaveClicked}
                        >
                          {dynamicLabels?.save}
                        </IconButton>
                      </Tooltip>
                      <Tooltip message={dynamicLabels?.tooltip_shipper_cancel || `Click here to cancel the selected ${dynamicLabels.shipper_p}.`} hover={true}>
                        <IconButton
                          intent='table'
                          id='listView-actionBar-cancel'
                          iconVariant='icomoon-close'
                          onClick={handleCancelRowsChange}
                          disabled={!Object.keys(selectedRows as ISelectedRows).length || isSaveClicked}
                        >
                          {dynamicLabels?.cancel}
                        </IconButton>
                      </Tooltip>
                    </>
                  ) :
                    Object.keys(actionBarButtons).map(
                      buttonKey => actionBarButtons[buttonKey].permission &&
                        (buttonKey !== 'InlineEdit' && <Tooltip
                          messagePlacement={(((buttonList[0] === buttonKey)) || buttonKey === 'update') ? 'start' : 'center'}
                          hover={true}
                          message={`${buttonToolTipTextList[buttonKey]
                            ? buttonToolTipTextList[buttonKey]
                            : buttonKey
                            }`}
                          key={buttonKey}
                        >
                          <IconButton
                            key={buttonKey}
                            disabled={!enableStatus[buttonKey]}
                            intent='table'
                            iconVariant={iconsMapping[buttonKey]}
                            id={`listView-actionBar-${buttonKey}`}
                            onClick={() => handleActionBarButtonClick(buttonKey)}
                          >
                            <TextOverflowEllipsis>{actionBarButtons[buttonKey].label}</TextOverflowEllipsis>
                          </IconButton>
                        </Tooltip>))}
                </Box>
              )
            }}
            </ListView>)
          }

        </WhiteCard>
      </Grid>
    </StyledGrid>
  </Box>
        {updateConfirmationModal &&   <InlineEditConfirmationModal
                showCancelConfirmationModal={updateConfirmationModal}
                setShowCancelConfirmationModal={(value: boolean) => setUpdateConfirmationModal(value)}
                handleCancelRows={handleCancelRows} 
        />}
    <ShipperModals />

  </>
}

export default withReact(ShipperListViewEntry)