import React, { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withReactOptimized } from "../../../utils/components/withReact";
import { MemoryRouter } from 'react-router-dom'
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import {
  Box, BreadCrumb, ListView, IconButton, Grid, Card, Tooltip, IFetchDataOptions,
  IListViewColumn, ISelectedRows, useToast, IconDropdown
} from "ui-library";
import { TrackersListViewActions } from "./TrackersListView.actions";
import { ITrackerFormActions } from '../TrackerForm/TrackerForm.actions'
import { sendGA } from "../../../utils/ga";
import PageActionButton from '../SubComponents/PageActionButton';
import { BreadCrumbTagWrapper, StyledGrid } from "./TrackersListViewStyledComponents";
import { AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper, FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel } from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { ColumnInstance } from "react-table"
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { IStateService } from 'angular-ui-router';
import { IRowData } from '../TrackerForm/TrackerForm.models';
import { hybridRouteTo, getQueryParams } from '../../../utils/hybridRouting';
import UploadExcel from '../../../utils/wrapper/uploadExcel'
import DownloadTrackersModal from '../SubComponents/DownloadTrackersModal';
import { SortingRule } from 'react-table';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal';
import ActivateDeactivateModal from '../SubComponents/ActivateDeactivateModal';
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent';
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import TrackerMap from './TrackerMap';


export interface ITrackerConfigurationProp {

  ngStateRouter: IStateService;
}
export const basename = '';
const TrackersListView = ({ ngStateRouter }: ITrackerConfigurationProp) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.trackers);
  const dispatch = useDispatch<Dispatch<TrackersListViewActions>>();
  const formDispatch = useDispatch<Dispatch<ITrackerFormActions>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const toast = useToast()
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const structure = useTypedSelector(state => state.tracker.trackers.listView.structure)
  const columnsSelector = useTypedSelector(state => state.tracker.trackers.listView.structure.columns)
  const rowCount = useTypedSelector(state => state.tracker.trackers.listView.data.totalCount)
  const rowsSelector = useTypedSelector(state => state.tracker.trackers.listView.data.results)
  const loading = useTypedSelector(state => state.tracker.trackers.listView.loading.listView)
  const columnsLoading = useTypedSelector(state => state.tracker.trackers.listView.loading.columns);
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [filters, setFilters] = useState<Record<string, string>>()
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const actionBarButtons = useTypedSelector(state => state.tracker.trackers.listView.structure.buttons)
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false)
  const filterListPayload = useTypedSelector((state) => state.advanceFilter.filterListPayload);
  const currentFilter = useTypedSelector((state) => state.advanceFilter.currentFilter);
  const openAdvFilter = useTypedSelector((state) => state.advanceFilter.openAdvFilter);
  const advancedFilterData = useTypedSelector((state) => state.advanceFilter.advancedFilterData);

  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const uploadModal = useTypedSelector(state => state.tracker.trackers.listView.uploadModal)
  const viewMode = useTypedSelector(state => state.tracker.trackers.listView.viewMode)
  const AdvanceFilterData = {
    sectionName: 'trackers'
  }
  const [trackerActivationRequest, setTrackerActivationRequest] = useState<
    | { activeRequest: boolean; trackerIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
    | undefined
  >();

  const breadCrumbOptions = React.useMemo(() => {
    return [
      {
        id: "fleet",
        label: dynamicLabels?.Resources || "Fleets",
        disabled: true,
      },
      {
        id: 'allTrackers',
        label: dynamicLabels.tracker_p || 'Tracker',
        disabled: true,
      }
    ]
  }, [dynamicLabels]);

  useEffect(() => {
    dispatch({ type: "@@trackersListView/RESET_TRACKER_DROPDOWN_DATA" })
    dispatch({ type: '@@trackersListView/SET_VIEW_MODE', payload: 'listview' })
    dispatch({ type: '@@trackersListView/FETCH_CLIENT_METRIC_SYSTEM' })
  }, []);

  useEffect(() => {
    setShowColumnShimmer(true)
    dispatch({ type: '@@trackersListView/FETCH_DROPDOWN_OPTIONS' })
    dispatch({ type: '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE' });
    handleQueryParams()
    handleFetchFilters();
    advanceFilterdispatch({ type: "@@advanceFilter/SET_FILTERLIST_PAYLOAD", payload: undefined });
    advanceFilterdispatch({ type: "@@advanceFilter/SET_CURRENT_FILTERS", payload: undefined });
    advanceFilterdispatch({ type: "@@advanceFilter/SET_OPEN_ADV_FILTER", payload: false });
  }, [viewMode]);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'trackers', cellCallbackMapping)
      const statusTransformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if (column.accessor === 'lastTrackedDt') {
          newcolumn.hrefdata = "`#/trackerHistory/?trackeeId=${row?.original?.trackeeId}&lastTrackedDt=${row?.original?.lastTrackedDt}&trackeeName=${row?.original?.trackerModel}&deviceId=${row?.original?.deviceId}`"
          newcolumn['cellType'] = 'DATE';
        }
        return newcolumn;
      });
      setColumns(statusTransformedColumn);
    }
    advanceFilterdispatch({ type: "@@advanceFilter/SET_COLUMNS_SELECTOR", payload: columnsSelector });
    const firstEntry: any = Object.values(columnsSelector)?.[0]
    if (firstEntry?.id) {
      setTimeout(() => { setShowColumnShimmer(false) }, 0)
    }
  }, [columnsSelector]);
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
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })
    setFilters(temp)
  }
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    sendGA('All Tracker', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    dispatch({
      type: '@@trackersListView/FETCH_TRACKERS_LIST',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
      }
    })
  }, [filterListPayload])

  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    try {
      if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'TRACKER_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
        setIsFilterDataCalled(true);
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: 'TRACKER',
            sectionName: 'TRACKER_LIST_VIEW'
          }
        });
        if (data) {
          const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
          if (isFavouriteFilter) {
            advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
          }
          advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });
        }
      }

      return;
    } catch (errorMessage) {
      toast.add('Failed to Make Changes to Filter. ', 'warning', false);
    }
  };

  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({ type: "@@advanceFilter/SET_FILTERLIST_PAYLOAD", payload: undefined });
    advanceFilterdispatch({ type: "@@advanceFilter/SET_CURRENT_FILTERS", payload: undefined });
    advanceFilterdispatch({ type: "@@advanceFilter/SET_OPEN_ADV_FILTER", payload: false });
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
  };

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: !openAdvFilter,
    });
  };

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    sendGA('All Trackers', `Click - Save and Apply Column Selector`);
    const columns = { ...columnsSelector }
    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })
    const payload = { ...structure, columns }
    try {
      const { data: { message } } = await axios.put(apiMappings.tracker.trackers.listView.structure + `${viewMode === 'mapview' ? 'TRACKER_MAP_VIEW' : 'TRACKER_LIST_VIEW'}`, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error: any) {
      toast.add(error, 'warning', false)
    }
  }, [columnsSelector])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, []);

  /** Delete Request */
  const deleteSelectedRows = async () => {
    sendGA('Tracker Configuration', `Delete Tracker`);
    setShowDeletionConfirmation(false);
    try {
      const trackerIDs = Object.keys(selectedRows);
      const {
        data: data,
      } = await axios.delete(apiMappings.tracker.trackers.listView.deleteTracker, { data: trackerIDs });

      if (data.status === 200) {
        toast.add(data?.message, 'check-round', false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw toast.add(`${data?.message}`, 'warning', false);
    } catch (error: any) {
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
    }
  };
  const handleStatusChange = (
    isChecked: boolean,
    { deviceId }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const trackerIds = []
    trackerIds.push(deviceId)
    setTrackerActivationRequest({ activeRequest: isChecked, trackerIds, failureCallback });
  };

  const handleLastTracking = (row: any) => {
    hybridRouteTo(
      `/trackerHistory/?trackeeId${row.trackeeId}&lastTrackedDt=${row.lastTrackedDt}&trackeeName=${row.trackerModel}&deviceId=${row.deviceId}`,
    );
  }
  const cellCallbackMapping = {
    isActiveFl: handleStatusChange,
    lastTrackedDt: handleLastTracking
  };

  const handleEditTracker = (row: IRowData) => {
    formDispatch({ type: '@@trackerForm/SET_FORM_EDITABLE', payload: true })
    hybridRouteTo(`trackerUpdate/?deviceId=${row?.deviceId}`)
  }
  const MoreButtonOptionList = React.useMemo(() => {
    const moreButtonsArray: any = []
    actionBarButtons && actionBarButtons?.['more']?.['childNodes'] && Object.keys?.(actionBarButtons['more']['childNodes'])?.forEach(buttonKey => {
      moreButtonsArray.push({ value: buttonKey, label: actionBarButtons['more']?.['childNodes']?.[buttonKey].label, tooltipText: actionBarButtons['more']?.['childNodes']?.[buttonKey]?.label })
    })
    return moreButtonsArray
  }, [dynamicLabels, actionBarButtons])

  const handleMoreOptions = React.useCallback(async (id: string) => {
    const selectedRowValues = Object.values(selectedRows)
    switch (id) {
      case 'inActive':
      case 'active':
        {
          /** Validate for marking already Active or Inactive tracker */
          const hasInvalidRequest = selectedRowValues.some(row => {
            if ((id === 'inActive' && !row.isActiveFl) || (id === 'active' && row.isActiveFl)) {
              return true
            }
            return false
          })

          if (hasInvalidRequest) {
            toast.add(dynamicLabels?.[id === 'active' ? 'trackerAlreadyActive' : 'trackerAlreadyInActive'], 'warning', false)
            return
          }

          let trackerIds: any = [];
          selectedRowValues.forEach(row => trackerIds.push(row.deviceId))
          setTrackerActivationRequest({
            activeRequest: id === 'active',
            trackerIds,
          });
        }
        break
    }
  }, [selectedRows, dynamicLabels])

  return (
    <>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '60px' }}>
          <div>
            <BreadCrumbTagWrapper>
              <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
              {filterListPayload &&
                <Tooltip maxWidth={600} tooltipDirection='bottom' messagePlacement='center' hover message={
                  <div style={{ textAlign: 'left', fontSize: 12 }}>
                    <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                    {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                      return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationSymbol} ${(f.fieldId === "deliveryMediumMasterTypeCd" && (f.operationLabelKey === "filterOpEquals" || f.operationLabelKey === "filterNotOpEquals" || f.operationLabelKey === "contains") && f.filterData.value) ? f.filterData.value : f.filterDataLabel ? f.filterDataLabel : f.filterData}`}</Box>
                    })}
                    <div>{currentFilter?.sortCriteria && currentFilter?.sortCriteria[0] && (
                      <Box mb='5px'>{currentFilter?.sortCriteria[0]?.fieldLabelKey + ' ' + currentFilter?.sortCriteria[0]?.operationSymbol}</Box>
                    )}</div>
                  </div>
                }>
                  <FilterAppliedTag >
                    <FilterAppliedTagLabel onClick={handleOpenAdvancedFilter}>{(currentFilter?.filterName?.trim()) || 'Filter Applied'}</FilterAppliedTagLabel>
                    <FilterAppliedTagButtonWrapper>
                      <IconButton
                        onClick={() => handleRemoveFilter(true)}
                        onlyIcon
                        iconVariant='close'
                        iconSize={10}
                        color='error.main'
                      />
                    </FilterAppliedTagButtonWrapper>
                  </FilterAppliedTag>
                </Tooltip>
              }
            </BreadCrumbTagWrapper>
          </div>
          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px' style={{ margin: '18px 0' }}>
            <PageActionButton fetchOptions={fetchOptions} ngStateRouter={ngStateRouter}></PageActionButton>
          </Box>
        </Box>

        {/* LIST VIEW CONTAINER */}
        <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000' }}>
          <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
            <StyledGrid container spacing={15} style={{ boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}>
              <Grid
                className='grid-customised-scroll-bar'
                item
                md={viewMode === 'listview' ? 12 : 4}
                style={{ display: 'flex', overflow: 'hidden' }}
              >
                {filterListPayload &&
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                    <ButtonWrapper onClick={() => handleRemoveFilter(true)}>
                      <IconButton
                        onlyIcon
                        iconVariant='close'
                        iconSize={8}
                        color='grey'
                      />
                      <span>Clear Filter</span>
                    </ButtonWrapper>
                  </AppliedFilterStrip>
                }

                <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                  {columns.length > 0 &&
                    <ListView
                      rowIdentifier='deviceId'
                      columns={columns}
                      data={rowsSelector}
                      totalRows={rowCount}
                      onRowEditClick={(row) => {
                        sendGA('Tracker', 'Update Tracker');
                        handleEditTracker(row as IRowData)
                      }}
                      onFetchData={handleFetchData}
                      onRowSelect={onRowSelect}
                      loading={columnsLoading}
                      isColumnLoading={showColumnShimmer}
                      hasRowSelection={false}
                      sorts={sort}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      style={{ height: '90vh' }}
                      filters={filters}
                      hasRowSelectionWithEdit={actionBarButtons?.['update']?.permission}
                    >
                      {{
                        IconBar: (
                          <>
                            <DownloadTrackersModal fetchOptions={fetchOptions} />
                            <AdvancedFilterComponent
                              handleFetchFilters={handleFetchFilters}
                              handleRemoveFilter={handleRemoveFilter}
                              handleFetchData={handleFetchData}
                              data={AdvanceFilterData}
                            />
                          </>),
                        ActionBar: (
                          <Box display='flex' horizontalSpacing='10px'>
                            {actionBarButtons && Object.keys(actionBarButtons).map(
                              (buttonKey, index) =>
                                buttonKey === 'more' ?
                                  <div title={actionBarButtons[buttonKey].label}>
                                    <IconDropdown
                                      key={buttonKey}
                                      variant={'button-dropdown'}
                                      optionList={MoreButtonOptionList}
                                      width='120px'
                                      iconButtonDetails={[
                                        'icomoon-funnel-options',
                                        actionBarButtons[buttonKey].label,
                                        'icomoon-angle-bottom'
                                      ]}
                                      disabled={!Object.keys(selectedRows).length}
                                      intent='table'
                                      onChange={handleMoreOptions}
                                      isSingleClickOption

                                    />
                                  </div>
                                  :
                                  actionBarButtons[buttonKey].permission && buttonKey === 'delete' &&
                                  <Tooltip key={buttonKey} message={`Click here to ${actionBarButtons[buttonKey].labelKey} the selected ${dynamicLabels.tracker_p}`} hover messagePlacement={index === 0 ? 'start' : 'center'}>
                                    <IconButton
                                      key={buttonKey}
                                      disabled={!Object.keys(selectedRows).length}
                                      intent='table'
                                      iconVariant={iconsMapping[buttonKey]}
                                      id={`listView-actionBar-${buttonKey}`}
                                      onClick={() => {
                                        setShowDeletionConfirmation(true);
                                      }}
                                    >
                                      {actionBarButtons[buttonKey].label}
                                    </IconButton>
                                  </Tooltip>
                            )}
                          </Box>
                        ),
                      }}
                    </ListView>
                  }
                </Card>
              </Grid>
              {viewMode === 'mapview' && (
                <TrackerMap selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
              )}
            </StyledGrid>
          </Grid>
        </Grid>
      </Box>
      {!!trackerActivationRequest && (
        <ActivateDeactivateModal fetchOptions={fetchOptions} handleFetchData={handleFetchData} trackerActivationRequest={trackerActivationRequest} setTrackerActivationRequest={setTrackerActivationRequest} setSelectedRows={setSelectedRows}
        />
      )}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />
      <UploadExcel
        isOpen={uploadModal}
        featureName='tracker'
        onSuccess={() => {
          dispatch({ type: '@@trackerListView/SET_UPLOAD_MODAL', payload: false })
          handleFetchData(fetchOptions);
        }}
        onClose={() => {
          dispatch({ type: '@@trackerListView/SET_UPLOAD_MODAL', payload: false })
        }} />
    </>
  )
}
const withMemoryRouter = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return <MemoryRouter><Component {...props as P} /></MemoryRouter>
  }
export default withReactOptimized(withMemoryRouter(TrackersListView))