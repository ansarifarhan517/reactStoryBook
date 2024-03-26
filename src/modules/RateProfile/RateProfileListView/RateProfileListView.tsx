import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Card, Box, Grid, useToast, IListViewColumn, ISelectedRows, IFetchDataOptions, ListView, IconButton, Tooltip,  ModalHeader, Modal, BreadCrumb, IFilterOptions,
  ISortOptions, withToastProvider, withPopup,


} from 'ui-library'
import { ColumnInstance } from 'react-table'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import { RateProfileListViewActions } from './RateProfileListView.actions'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo, getQueryParams, routeContains, } from '../../../utils/hybridRouting';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import { sendGA } from '../../../utils/ga'
import withRedux from '../../../utils/redux/withRedux';
import { IStateService } from 'angular-ui-router';
import { StyledGrid, ListViewWrapper } from './styled'
import { IRowData } from './RateProfileListView.models'
import UploadExcel from '../../../utils/wrapper/uploadExcel';
// import withReact from '../../../utils/components/withReact'
import { SortingRule } from 'react-table'
import { withThemeProvider } from '../../../utils/theme'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal'
interface ICustomerListViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const RateProfileListView = ({ ngStateRouter }: ICustomerListViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.rateProfile)
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<RateProfileListViewActions>>()
  const structure = useTypedSelector(state => state.rateProfile.listView.structure)
  const columnsSelector = useTypedSelector(state => state.rateProfile.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.rateProfile.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.rateProfile.listView.data.totalCount)
  const pageLabels = useTypedSelector(state => routeContains("deliveryAssociateRateProfile") ? state.pageLabels.daRateProfile : state.pageLabels.carrierRateProfile)
  const actionBarButtons = useTypedSelector(state => state.rateProfile.listView.structure.buttons)
  const columnsLoading = useTypedSelector(state => state.rateProfile.listView.loading.columns);
  const editDetails = useTypedSelector(state => state.rateProfile.listView.editDetails)
  const loading = useTypedSelector(state => state.rateProfile.listView.loading.listView)

  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [customerActivationRequest, setCustomerActivationRequest] = useState<
    { activeRequest: boolean, rateProfileId: number, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState<boolean>(false)
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)

  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()
 

  /** Watchers */
  useEffect(() => {
    dispatch({ type: '@@rateProfileListView/FETCH_STRUCTURE' })
    handleQueryParams()

    return () => {
      dispatch({ type: '@@rateProfileListView/RESET_STATE' })
    }
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'rateProfile', cellCallbackMapping)
      setColumns(newColumns)
    }
  }, [columnsSelector])

  /** Cell Callbacks */
  const handleCustomerActiavtion = async () => {
    if (!customerActivationRequest) {
      return
    }
    setCustomerActivationRequest(undefined)
    const rateProfileId = Number(customerActivationRequest.rateProfileId)
    let params = {
      rateProfileId: rateProfileId,
      isActive: customerActivationRequest.activeRequest
    }
    dispatch({
      type: '@@rateProfileListView/UPDATE_DATA',
      payload: params
    })

    try {
      const { data: { message, status } } = await axios.put(apiMappings.rateProfile.listView.update, {},
        {
          params: {
            rateProfileId: customerActivationRequest.rateProfileId,
            isActive: customerActivationRequest.activeRequest
          }
        }
      )

      if (status === 200) {
        toast.add(message, 'check-round', false)
        setSelectedRows({})
        setEditMode(false)

        handleFetchData(fetchOptions)

        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      customerActivationRequest.failureCallback && customerActivationRequest.failureCallback(!customerActivationRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }

  }

  const handleActiveFlChange = (isChecked: boolean, { rateProfileId }: IRowData, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!Object.keys(editDetails).length) {
      setCustomerActivationRequest({ activeRequest: isChecked, rateProfileId: rateProfileId, failureCallback })
    } else {
      setCustomerActivationRequest({ activeRequest: isChecked, rateProfileId: rateProfileId, failureCallback })
    }
  }

  // cell callback mapping
  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange

  }


  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@rateProfileListView/SET_LOADING',
      payload: { listView: true }
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    dispatch({
      type: '@@rateProfileListView/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
      }
    })
  }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  // const onSortChange = React.useCallback(() => { }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'copy': {
        sendGA('ListView ActionBar', 'Rate Profile List View Update - Inline Edit')
        setEditMode(true)
        handleCopy()
        break
      }
      case 'more':
        break

    }
  }, [])

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector

    try {
      Object.keys(editDetails).forEach(rowId => {
        Object.keys(editDetails[rowId]).forEach(columnId => {
          const validations = columnStructure?.[columnId]?.validation
          const value = editDetails[rowId][columnId].value

          if (validations?.required && !value) {
            throw {
              rowId,
              columnId,
              message: validations?.required?.message ||
                `${columnStructure[columnId].label} is required.`
            }
          }

          if (validations?.minlength && String(value).length < Number(validations?.minlength?.args)) {
            throw {
              rowId,
              columnId,
              message: validations?.minlength?.message ||
                `${columnStructure[columnId].label} length must be more than ${validations?.minlength?.args} character(s).`
            }
          }

          if (validations?.maxlength && String(value).length > Number(validations?.maxlength?.args)) {
            throw {
              rowId,
              columnId,
              message: validations?.maxlength?.message ||
                `${columnStructure[columnId].label} length cannot be more than ${validations?.maxlength?.args} character(s).`
            }
          }
        })
      })
    } catch (error: any) {

      dispatch({
        type: '@@rateProfileListView/SET_EDIT_DETAILS',
        payload: {
          rowId: error.rowId,
          columnId: error.columnId,
          value: editDetails?.[error.rowId]?.[error.columnId],
          hasError: true
        }
      })

      if (error.message) {
        toast.add(error.message, '', false)
      }
      return false
    }

    return true
  }

  const handleSaveRows = async () => {

    sendGA('ListView ActionBar', 'Customer List View Save - Inline Edit')
    const isValid = validateSelectedRows()

    if (isValid) {
      const payload: Partial<IRowData>[] = []
      let flag = true
      Object.values(selectedRows).forEach((row) => {

        if (editDetails[row.customerId]) {
          const obj: any = {
            customerId: row.customerId
          }

          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              if (editDetails?.[row.customerId]?.[columnId]?.hasError) {
                toast.add(`Please Enter Valid ${columnId}`, 'warning', false)
                flag = false

              } else {
                obj[columnId] = editDetails?.[row.customerId]?.[columnId]?.value || row[columnId]
              }
            }
          })

          payload.push(obj)
        }
      })

      if (!payload.length) {
        handleCancel()

      }
      if (flag) {
        try {
          const { data: { message, status } } = await axios.put(apiMappings.rateProfile.listView.update, payload)
          if (status === 200) {
            handleFetchData(fetchOptions)
            setEditMode(false)
            fetchOptions.apis?.resetSelection()
            setSelectedRows({})
            dispatch({ type: '@@rateProfileListView/CLEAR_EDIT_DETAILS' })
            toast.add(message, 'check-round', false)
            return
          }
          throw message
        } catch (errorMessage: any) {
          const message = errorMessage?.response?.data?.message
          toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
      } else {
        return
      }

    }
  }

  const handleCancel = () => {
    if (!Object.keys(editDetails).length) {
      setEditMode(false);
      fetchOptions.apis?.resetSelection();
      setSelectedRows({});
    } else {
      setShowCancelConfirmationModal(true)
    }

  }

  const handleCancelRows = React.useCallback(() => {
    setShowCancelConfirmationModal(false)
    dispatch({ type: '@@rateProfileListView/CLEAR_EDIT_DETAILS' });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }, [fetchOptions]);


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
      const { data: { message } } = await axios.put(apiMappings.customer.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error: any) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])


  const handleAddCustomer = () => {
    // customer - Add button
    sendGA("Navigation", "Rate Profile List View - Add button");
    routeContains("deliveryAssociateRateProfile")
      ? hybridRouteTo("da_rateProfileForm")
      : hybridRouteTo("carrier_rateProfileForm");
  };


  const breadCrumbOptions = React.useMemo(
    () => [
      { id: 'Payment', label: dynamicLabels.Payments },
      {
        id: ngStateRouter?.current?.name === 'deliveryAssociateRateProfile' ? 'DA' : 'Carrier', label: ngStateRouter?.current?.name === 'deliveryAssociateRateProfile' ? dynamicLabels.deliveryboy_s : dynamicLabels.vendorMaster
      },
      { id: 'Rate Profile', label: `${dynamicLabels.rate_profile_p}` }
    ],
    [pageLabels, dynamicLabels],
  );

  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    let existingParams = getQueryParams()
    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }
    const newParams = {
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go(routeContains('deliveryAssociateRateProfile') ? 'deliveryAssociateRateProfile' : 'carrierRateProfile', newParams, ngStateRouterOptions)
    })
  }

  /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go(routeContains('deliveryAssociateRateProfile') ? 'deliveryAssociateRateProfile' : 'carrierRateProfile', newParams, ngStateRouterOptions)
    })
  }

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();

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
    let searchBy =  filterData?.searchBy ? filterData?.searchBy?.split('#@#') : ['profileType'];
    let searchText = filterData?.searchText ? filterData?.searchText?.split('#@#') : [routeContains('deliveryAssociateRateProfile') ? 'OWNFLEET': 'CARRIER' ];

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })
    setFilters(temp)
  }

  // handle copy functionality

  const handleCopy = () => {
    if(Object.keys(selectedRows)?.length === 1){
      Object.keys(selectedRows).forEach((key:any) => {
        if (selectedRows?.[key].rateProfileId) {
          if(routeContains('deliveryAssociateRateProfile')){
            hybridRouteTo(
              `da_rateProfileForm?dupid=${selectedRows?.[key].rateProfileId}`
            );
          }else{
            hybridRouteTo(
              `carrier_rateProfileForm?dupid=${selectedRows?.[key].rateProfileId}`
            );
          }
          
        }
      })
    } else {
      Object.keys(selectedRows).length > 1 && toast.add('Cannot duplicate more than one', 'warning', false)
    }
  }

  const routeToUpdateForm = (profileId: any) => {
    if(routeContains('deliveryAssociateRateProfile')){
      hybridRouteTo(`da_updateRateProfile?rpid=${profileId}`);
    }else{
      hybridRouteTo(`carrier_updateRateProfile?rpid=${profileId}`);
    }
  }

  return (
    <>
      <div id='toast-inject-here'></div>
      <Box display='flex' justifyContent='space-between' style={{ width: '100%', paddingTop: '74px' }} px='15px' pb='15px'>
        <div>
          <BreadCrumb
            options={breadCrumbOptions}
            width='100px'
          />

          
        </div>

        {/* Page Action Buttons */}
        <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
          {pageLabels?.buttons.add && (
            <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.rate_profile}.`} hover={true}>
              <IconButton
                intent='page'
                iconVariant='icomoon-add'
                onClick={handleAddCustomer}
                id={'rate_profile-actionbar-add'}
              >
                {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
              </IconButton>
            </Tooltip>
          )}

        </Box>

      </Box>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh' }} px='15px' pb='15px'>
        {/* Header */}

        {/* LIST VIEW CONTAINER */}
        <StyledGrid
          container
          spacing={5}
          style={{ boxShadow: '0 2px 20px -10px #000' }}
        >
            <>
              <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                
                <Card
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    width: '100%',
                    paddingRight: 0,
                    paddingBottom: 0,
                  }}
                >
                  {columns.length > 0 && (
                    <ListViewWrapper className='RateProfileListViewWrapper'>
                      <ListView
                        rowIdentifier='rateProfileId'
                        style={{ height: '100%', overflow: 'visible' }}
                        columns={columns}
                        data={rowsSelector}
                        onFetchData={handleFetchData}
                        hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
                        hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
                        onRowSelect={onRowSelect}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        totalRows={totalRowsSelector}
                        loading={loading}
                        hideRefresh={loading}
                        isEditMode={isEditMode}
                        onRowEditClick={row => routeToUpdateForm(row.rateProfileId)}
                        permanentColumns={{
                          accountCode: true,
                          accountName: true,
                          branchName: true

                        }}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sorts={sort}
                        onSortChange={handleSortChange}
                        isColumnLoading={columnsLoading}
                      // moreResultsExists={moreResultsExists}
                      >
                        {{
                          
                          ActionBar: (
                            <Box display='flex' horizontalSpacing='10px'>
                              {isEditMode ? (
                                <>
                                  <Tooltip message={`${dynamicLabels.save}`} hover>
                                    <IconButton
                                      intent='table'
                                      id='listView-actionBar-save'
                                      iconVariant='icomoon-save'
                                      onClick={handleSaveRows}
                                      disabled={!Object.keys(selectedRows).length}
                                    >
                                      {dynamicLabels.save}
                                    </IconButton>

                                  </Tooltip>
                                  <Tooltip message={`${dynamicLabels.cancel}`} hover>
                                    <IconButton
                                      intent='table'
                                      id='listView-actionBar-cancel'
                                      iconVariant='icomoon-close'
                                      onClick={handleCancel}
                                      disabled={!Object.keys(selectedRows).length}
                                    >
                                      {dynamicLabels.cancel}
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                  Object.keys(actionBarButtons).map(
                                    (buttonKey) =>
                                      actionBarButtons[buttonKey].permission &&
                                      (buttonKey === 'Copy' ? (
                                        <Tooltip message={`${actionBarButtons[buttonKey].label}`}
                                            hover
                                            messagePlacement={'start'}
                                          >

                                          <IconButton
                                              key={buttonKey}
                                              disabled={Object.keys(selectedRows).length !== 1}
                                              intent='table'
                                              iconVariant={iconsMapping[buttonKey]}
                                              id={`listView-actionBar-${buttonKey}`}
                                              onClick={() => {
                                                // sendGA('customer action button', 'Rate Profile List View ' + `customer - ${actionBarButtons[buttonKey].label}`)
                                                handleCopy()
                                              }}
                                            >
                                              {actionBarButtons[buttonKey].label}
                                            </IconButton>
                                            </Tooltip>
                                      ) :
                                        (
                                          buttonKey !== 'InlineEdit' && <Tooltip message={buttonKey === 'update' ? `${dynamicLabels.customerUpdate} ${dynamicLabels.customer_p}.` : `${actionBarButtons[buttonKey].label} `}
                                            hover
                                            messagePlacement={'start'}
                                          >

                                            <IconButton
                                              key={buttonKey}
                                              disabled={!Object.keys(selectedRows).length}
                                              intent='table'
                                              iconVariant={iconsMapping[buttonKey]}
                                              id={`listView-actionBar-${buttonKey}`}
                                              onClick={() => {
                                                sendGA('customer action button', 'Customer List View ' + `customer - ${actionBarButtons[buttonKey].label}`)
                                                handleActionBarButtonClick(buttonKey)
                                              }}
                                            >
                                              {actionBarButtons[buttonKey].label}
                                            </IconButton>

                                          </Tooltip>
                                        )
                                      )
                                  ))
                              }
                            </Box>
                          ),
                        }
                        }
                      </ListView>
                    </ListViewWrapper>
                  )}
                </Card>
              </Grid>
            </>
            
        </StyledGrid>


        {/* ACTIVATION CONFIRMATION MODAL */}
        <Modal open={!!customerActivationRequest} onToggle={() => { }} size='md'>
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels?.statusConfirmation}
              imageVariant='icomoon-close'
              handleClose={() => {
                customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                setCustomerActivationRequest(undefined)
              }}
            />,

            content: (
              <>
                <div style={{ fontSize: '14px' }}>{customerActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div><br></br>
                <div style={{ fontSize: '14px' }}><span style={{ fontSize: '14px', fontWeight: 800 }}>{dynamicLabels.note}:</span> {dynamicLabels.thisWillNotImpactExistingOrdersCreatedForThisAddress}</div>
              </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleCustomerActiavtion}>{dynamicLabels.ok}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11}
                  onClick={() => {
                    customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                    setCustomerActivationRequest(undefined)
                  }}>
                  {dynamicLabels.cancel}
                </IconButton>
              </Box>
            )
          }}
        </Modal>


        {/* INLINE EDIT CANCEL CONFIRMATION MODAL */}
        <InlineEditConfirmationModal
          showCancelConfirmationModal={showCancelConfirmationModal}
          setShowCancelConfirmationModal={(value: boolean) => setShowCancelConfirmationModal(value)}
          handleCancelRows={handleCancelRows}
        />

        {/* DOWNLOAD RESPONSE MODAL */}
        <DownloadMessage
          showInfoModal={showDownloadModal}
          onToggle={setShowDownloadModal}
        />

        {/* UPLOAD CUSTOMER MODAL */}
        <UploadExcel
          isOpen={showUploadPopup}
          featureName='customer'
          onSuccess={() => {
            setShowUploadPopup(false);
            handleFetchData(fetchOptions);
          }}
          onClose={() => setShowUploadPopup(false)}
        />


      </Box>


    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(RateProfileListView)), 'toast-inject-here'));
