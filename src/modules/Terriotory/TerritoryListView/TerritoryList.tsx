import React, {Dispatch, useEffect, useState}from 'react';
import withRedux from "../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../utils/theme";
import { withToastProvider, withPopup, Box, Grid, Card, IListViewColumn, useToast, ISelectedRows, IconButton, IFetchDataOptions, IFilterOptions, ISortOptions , Tooltip} from 'ui-library';
import PageActionButton from './SubComponents/PageActionButton';
import { sendGA } from '../../../utils/ga';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { IRowData, IDAOptionsData, IDeliveryMediumData } from './TerritoryList.models';
import { tTerritoryListActions } from './TerritoryList.actions';
import { useDispatch } from 'react-redux';
import { StyledGrid } from './StyledTerritoryList';
import { ColumnInstance } from 'react-table'
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import BreadCrumbComponent from './SubComponents/BreadCrumbComponent';
import ListViewComponent from './SubComponents/ListViewComponent';
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal';
import { handleActionBarButtonClick, handleQueryParams} from './TerritoryListHelperMethods';
import { IStateService } from 'angular-ui-router';
import { getQueryParams } from '../../../utils/hybridRouting';
import { SortingRule } from 'react-table'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import FileSaver from 'file-saver';
import TerritoryListMap from './SubComponents/TerritoryListMap';
import InlineEditConfirmationModal from '../../../utils/components/InlineEditConfirmationModal';
import ActivateDeactivateModal from './SubComponents/Popups/ActivateDeactivateModal';
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import {
    AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper,
    FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
  } from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { throwError, validateRows } from '../../common/InlineEdit/InlineEdit';
import { handleCustomColumnSort } from '../../../utils/helper';
interface ITerritoryListProps {
    ngStateRouter: IStateService
}
/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const TerritoryList = ({ ngStateRouter }: ITerritoryListProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence)
    const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
    const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();

    const toast = useToast();

    const breadcrumbState = useTypedSelector(state => state.territory.listView.breadcrumbState);
    const viewMode = useTypedSelector(state => state.territory.listView.viewMode)
    const structure = useTypedSelector(state => state.territory.listView.structure)
    const columnsSelector = useTypedSelector(state => state.territory.listView.structure.columns)
    const editDetails = useTypedSelector(state => state.territory.listView.editDetails);
    const deliveryTypes = useTypedSelector(state => state.territory.listView.deliveryMediumList);
    const emptyData = useTypedSelector(state => state.territory.listView.emptyData)
    const metricObj = useTypedSelector(state=>state.globals.metrics);

    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [isEditMode, setEditMode] = useState<boolean>(false)
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false)
    const [updateConfirmationModal, setUpdateConfirmationModal] = useState<boolean>(false);
    const [filters, setFilters] = useState<Record<string, string>>()
    const [sort, setSort] = useState<SortingRule<object>[]>()
    const [territoryActivationRequest, setTerritoryActivationRequest] = useState<
    | { activeRequest: boolean; geofenceIds: Record<number, boolean>;message?:string | undefined, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
    | undefined
  >();
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
    const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
    const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
    const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
    const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)


    useEffect(() => {
        handleQueryParams(setSort, setFilters);
        handleFetchFilters();
        dispatch({ type: '@@territoryList/SET_COLUMNS_LOADING', payload: { columns: true }})
        dispatch({ type: '@@territoryList/FETCH_STRUCTURE' })
        dispatch({ type: '@@territoryList/FETCH_BREADCRUMBDATA' })
        dispatch({ type: '@@territoryList/INITIAL_LOAD' })
        dispatch({ type: '@@territoryList/SET_VIEW_MODE', payload: 'listview' })
        advanceFilterdispatch({
            type: "@@advanceFilter/UPDATE_FIRST_LOAD",
            payload: false,
          });
        if (emptyData) {
            setTimeout(() => {
                handleFetchData(fetchOptions)
            }, 100)
        }
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    },[])

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'territory', cellCallbackMapping);
            setColumns(newColumns);
        }
        advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
    }, [columnsSelector]);

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('Column Preference Action','Territory List - Save & Apply column preferences')
        const columns = { ...columnsSelector }
        let columnChanges = false;
        Object.keys(columns).forEach((columnKey) => {
            if((columns[columnKey].permission && !visibleColumns[columnKey]) || !columns[columnKey].permission && visibleColumns[columnKey]){
                columns[columnKey].permission = !!visibleColumns[columnKey]
                columnChanges = true
            }
        })
        const payload = {...structure,columns}
        if(columnChanges){
            try {
                let request = {
                    modelName: 'GEOFENCEMASTER',
                    pageName: 'GEOFENCEMASTER',
                    sectionName: viewMode === 'listview' ? 'GEOFENCEMASTER_LIST_VIEW' : 'GEOFENCEMASTER_MAP_VIEW'
                }
                const { data: { message }} = await axios.put(apiMappings.geofenceMaster.listView.structure, payload, {params: request});
                  message && toast.add(message, 'check-round', false);
            } catch (error) {
              console.log(error, error?.response)
            }
        }
    }, [columnsSelector])

    const handleActiveFlChange = (
        isChecked: boolean,
        { geofenceId }: IRowData,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
      ) => {
        const geofenceIds = { [geofenceId]: true };
        setTerritoryActivationRequest({ activeRequest: isChecked, geofenceIds, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    };

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, []);

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis}) => {
        sortOptions = handleCustomColumnSort(sortOptions)
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis})
        let searchtext = filterOptions?.searchText;
        if(filterOptions?.searchBy == "radiusInKms"){
            if(isNaN(filterOptions?.searchText)){
                searchtext = filterOptions?.searchText
            } else {
                let distanceMetric = metricObj.distance.conversionFactor != undefined ? metricObj.distance.conversionFactor : 1;
                var distanceInNum= + filterOptions?.searchText;
                distanceInNum=distanceInNum/distanceMetric;
                searchtext = ''+Math.floor(distanceInNum);
            }
        }
        dispatch({
            type: '@@territoryList/FETCH_DATA',
            payload: {
                params: {
                    pageNumber: pageNumber,
                    pageSize: viewMode === 'mapview' ? 1000 : pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: searchtext,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder
                }
            }
        })
    },[breadcrumbState, filterListPayload])
    /** Inline Edit */
    const validateSelectedRows = () => {
        const columnStructure = columnsSelector;

        try {
            validateRows(editDetails,columnStructure);
        } catch (error) {
            throwError(error);
            if (error.message) {
                toast.add(error.message, '', false);
            }
            return false;
        }

        return true;
    };
    const handleCancelRows = React.useCallback(() => {
        sendGA('ListView ActionBar','Territory List - Cancel - Inline Edit')
        resetSelctedRows()
      }, [fetchOptions]);

    const handleSaveRows = async () => {
        // this flag is to tell list view that save is clicked so hisable save and cancel btn and dont get out of edit mode
        dispatch({ type: '@@territoryList/SET_SAVE_CLICK', payload: true})
        const isValid = validateSelectedRows();
        sendGA('ListView ActionBar','Territory List - Save - Inline Edit')
        if (isValid) {
            const payload: Partial<IRowData>[] = [];
            Object.values(selectedRows).forEach((row) => {
                if (editDetails[row.geofenceId]) {
                    const obj: object = {
                        geofenceId: row.geofenceId,
                    };
                    Object.keys(columnsSelector).forEach(columnId => {
                        if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
                            if(columnId === 'deliveryMediumMasterId'){
                                const selectedDA = selectedRows[row.geofenceId]?.deliveryMediumMasterId?.map((obj: IDeliveryMediumData) => {
                                    return {
                                        deliveryMediumMasterId: obj.deliveryMediumMasterId,
                                        deliveryMediumName: obj.deliveryMediumName,
                                        employeeId: '',
                                        mobileNumber: ''
                                    }
                                })
                                if(editDetails?.[row.geofenceId]?.[columnId]){
                                    var deliveryMediumMasterIdArray = editDetails?.[row.geofenceId]?.[columnId]?.value ? (editDetails?.[row.geofenceId]?.[columnId]?.value).split(','): []
                                    obj[columnId] = [];
                                    deliveryMediumMasterIdArray?.length && deliveryMediumMasterIdArray.map((type : string) => {
                                        obj[columnId].push(deliveryTypes.find((option: IDAOptionsData) => option.deliveryMediumName === type) || selectedDA.find((o: IDAOptionsData) => o.deliveryMediumName === type));
                                    })
                                }
                                else{
                                    obj[columnId] = row[columnId];
                                }
                            }
                            else {
                                obj[columnId] = editDetails?.[row.geofenceId]?.[columnId]?.value || row[columnId];
                            }
                        }
                    });
                    payload.push(obj);
                }
            });

        const propertyLength = Object.keys(editDetails)?.length
        // all 3 properties branchname, dm type and weekly are same and prop length matching then show toast
        if (propertyLength === 0) {
            dispatch({ type: '@@territoryList/SET_SAVE_CLICK', payload: false})
            setEditMode(false);
            return
        }

        if (!payload.length) {
            handleCancelRows();
            return;
        }

        try {
            const {
            data: { message, status },
            } = await axios.put(`${apiMappings.geofenceMaster.listView.updateGeofence}?geofenceProfileId=${breadcrumbState}`, payload);
            if (status === 200) {
            interface IUpdateDataPayload extends Partial<IRowData> {
                geofenceId: number
            }
            payload.map((payloadRow) => {
                dispatch({ type: '@@territoryList/UPDATE_DATA', payload: (payloadRow as IUpdateDataPayload) })
            });
            handleFetchData(fetchOptions)
            setEditMode(false)
            //once it gets save correctly first remove call selection and set isSaveCliked to false and then remove edit mode so that whenevr you switch to normal list view all btns will be in disable state.
            dispatch({ type: '@@territoryList/CLEAR_EDIT_DETAILS' });
            fetchOptions.apis?.resetSelection();
            setSelectedRows({});
            dispatch({ type: '@@territoryList/SET_SAVE_CLICK', payload: false})
            toast.add(message, 'check-round', false);
            // when click on save we are disabling it.once get 200 remove disable

            return;
            }
            throw message;
            } catch (errorMessage) {
                setEditMode(true)
                dispatch({ type: '@@territoryList/SET_LOADING', payload: { listView: false } })
                const error = errorMessage.response?.data?.error?.[0]?.message?.[0]
                dispatch({ type: '@@territoryList/SET_SAVE_CLICK', payload: false})
                toast.add(error || dynamicLabels.somethingWendWrong, 'warning', false);
            }
        }
    };

    const handleCancelRowsChange = React.useCallback(() => {
        const propertyLength = Object.keys(editDetails)?.length
        // anything newly edited then this flag will become true
        if (propertyLength !== 0) {
          setUpdateConfirmationModal(true)
        } else {
          // nothing edited just clear all the selection.
          resetSelctedRows()
        }
    }, [fetchOptions, editDetails, selectedRows]);


    const handleActionClick = (id: string) => {
        handleActionBarButtonClick(id, setShowDeletionConfirmation, setEditMode)
    }
    const resetSelctedRows = () => {
        dispatch({ type: '@@territoryList/SET_SAVE_CLICK', payload: false})
        setEditMode(false);
        dispatch({ type: '@@territoryList/CLEAR_EDIT_DETAILS' });
        fetchOptions.apis?.resetSelection();
        setSelectedRows({});
    }
    const handleMoreOptions = (id: string) => {
        sendGA('ListView ActionBar',`Territory List Button Click - geofenceMaster - ${id}-record`)
        const selectedRowValues = Object.values(selectedRows)
        const invalidInputsArray = [];
        const dataList = [];
        const geofenceIds = {};
        let msg;
        selectedRowValues.forEach(row => {
            if (id === 'active' && row.isActiveFl) {
                invalidInputsArray.push(row.geofenceId);
            } else if (id === 'inActive' && !row.isActiveFl) {
                invalidInputsArray.push(row.geofenceId);
            }
            else {
                const data = {};
                data['geofenceId'] = row.geofenceId;
                dataList.push(data);
                geofenceIds[row.geofenceId] = true
            }
        });
        if (invalidInputsArray.length > 0) {
            msg = (id === 'active' ? (invalidInputsArray.length + ' ' + dynamicLabels.geofenceAlreadyActive) : (invalidInputsArray.length + ' ' + dynamicLabels.geofenceAlreadyInActive))
        }
        if (id === 'active') {
            if (dataList.length === 0) {
                toast.add(dynamicLabels.territoriesAlreadyActive  ? dynamicLabels.territoriesAlreadyActive : "Territories are already in Active mode.", 'warning', false);
                return;
            }
        } else {
            if (dataList.length === 0) {
                toast.add(dynamicLabels.territoriesAlreadyInActive ? dynamicLabels.territoriesAlreadyInActive : "Territories are already in Inactive mode.", 'warning', false);
                return;
            }
        }
        setTerritoryActivationRequest({
            activeRequest: id === 'active',
            geofenceIds,
            message : msg
        })
    };


    /** Delete Request */
    const deleteSelectedRows = async () => {
        setShowDeletionConfirmation(false);
        dispatch({ type: '@@territoryList/SET_LOADING', payload: { listView: true } })
        try {
        const {
            data: data,
        } = await axios.delete(apiMappings.geofenceMaster.listView.deleteGeofence, {
            data: Object.values(selectedRows).map(rowId => rowId.geofenceId),
        });

        if (data.status === 200) {
            toast.add(`${dynamicLabels.territoryDeletedSuccess}`, 'check-round', false);
            setSelectedRows({});
            dispatch({ type: '@@territoryList/SET_LOADING', payload: { listView: false } })
            fetchOptions.apis?.resetSelection();
            handleFetchData(fetchOptions);
            return;
        }
        throw data?.message;
        } catch (errorMessage) {
            dispatch({ type: '@@territoryList/SET_LOADING', payload: { listView: false } })
            toast.add(dynamicLabels.territoryDeletedFailure, 'warning', false);
        }
    };


    /* Retain Search Params */
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
        setTimeout (() => {
            ngStateRouter.go('GeofenceMaster', newParams, ngStateRouterOptions)
        }, 100)
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
        setTimeout (() => {
            ngStateRouter.go('GeofenceMaster', newParams, ngStateRouterOptions)
        }, 100)
    }

    /* Advance Filter */
      // Handle fetch Filters
    const handleFetchFilters = async (callBackAdvanceFilter=false) => {
        if(( !isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'GEOFENCEMASTER_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
            setIsFilterDataCalled(true)
        try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
            params: { pageName: "GEOFENCEMASTER", sectionName: viewMode === 'listview' ? 'GEOFENCEMASTER_LIST_VIEW' : 'GEOFENCEMASTER_MAP_VIEW' }
        });
        if (data) {
            setIsFilterDataCalled(false)
            const isFavouriteFilter = data.find((filter: { isFavourite: boolean; }) => filter?.isFavourite);
            if (isFavouriteFilter) {
                advanceFilterdispatch({ type: '@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA', payload: isFavouriteFilter?.filters });
            }
            advanceFilterdispatch({ type: '@@advanceFilter/SET_ADV_FILTER_DATA', payload: data });
        }
        return;
        } catch (errorMessage) {
        toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
        }
    }

    }

    // Handle Remove filters
    const handleRemoveFilter = (showToast: boolean) => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
        showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
    };

    const handleOpenAdvancedFilter = () => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
    }

    const handleDownloadReport = async () => {
        sendGA('ListView ActionBar',`Territory List - Download Report`)
        setShowInfoModal(true)
        const payload = {
            params: {
                pageNumber: fetchOptions.pageNumber,
                pageSize: fetchOptions.pageSize,
                searchBy: fetchOptions.filterOptions?.searchBy,
                searchText: fetchOptions.filterOptions?.searchText,
                sortBy: fetchOptions.sortOptions?.sortBy,
                sortOrder: fetchOptions.sortOptions?.sortOrder
            }
        }
        const searchString = fetchOptions.filterOptions?.searchBy && fetchOptions.filterOptions?.searchText ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}` : '';
        const sortString = fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}` : '';
        try {
            const { data } = await axios.post(`${apiMappings.geofenceMaster.listView.excelReportDownload}?pageNumber=${fetchOptions.pageNumber}&pageSize=${fetchOptions.pageSize}${searchString}${sortString}`, payload, {responseType: 'arraybuffer'});
            FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels?.geofence} List.xlsx`)
        } catch {
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }
    return (
        <>
        <Box display='flex' mt='64px' flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }} px='15px' pb='15px'>
            {/* Header */}
            <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
                <div style={{ display: 'flex' }}>
                    <BreadCrumbComponent></BreadCrumbComponent>
                    {filterListPayload &&
                    <Tooltip maxWidth={600} tooltipDirection='bottom' messagePlacement='center' hover message={
                    <div style={{ textAlign: 'left', fontSize: 12}}>
                        <Box mb='10px'>Filters are applied on {filterListPayload.operationLogic === 'AND' ? 'ALL' : 'ANY'} of the the following conditions:</Box>
                        {currentFilter && currentFilter?.filters && currentFilter?.filters.map((f: any, i) => {
                        return <Box mb='5px'>{`${i + 1}. ${f.fieldLabelKey} ${f?.labelValue || f?.operationSymbol} ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
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
                            onClick={() => handleRemoveFilter()}
                            onlyIcon
                            iconVariant='close'
                            iconSize={10}
                            color='error.main'
                        />
                        </FilterAppliedTagButtonWrapper>
                    </FilterAppliedTag>
                    </Tooltip>
                }

                </div>

                <PageActionButton fetchOptions={fetchOptions}></PageActionButton>
            </Box>

            {/* LIST VIEW CONTAINER */}
            <StyledGrid container spacing={15} style={{ boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}>
                <Grid className='grid-customised-scroll-bar' item md={viewMode === 'listview' ? 12 : 4} style={{ display: 'flex', overflow: 'hidden' }}>
                        {filterListPayload &&
                        <AppliedFilterStrip>
                            <AdvancedFilterLabel>Advanced Filter Applied</AdvancedFilterLabel>
                            <ButtonWrapper onClick={() => handleRemoveFilter()}>
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
                    <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, boxShadow: '0px 2px 20px -10px #000 !important' }}>
                        { columns.length > 0 && filters &&
                            <ListViewComponent
                                columns={columns}
                                handleFetchData={handleFetchData}
                                onRowSelect={onRowSelect}
                                onSaveColumnPreferences={onSaveColumnPreferences}
                                handleFetchFilters={handleFetchFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                isEditMode={isEditMode}
                                handleSaveRows={handleSaveRows}
                                selectedRows={selectedRows}
                                handleCancelRowsChange={handleCancelRowsChange}
                                handleMoreOptions={handleMoreOptions}
                                handleActionClick={handleActionClick}
                                filters={filters}
                                handleFilterChange={handleFilterChange}
                                sort={sort}
                                handleSortChange={handleSortChange}
                                handleDownloadReport={handleDownloadReport}
                            ></ListViewComponent>
                        }
                    </Card>
                </Grid>
                {viewMode === 'mapview' && (
                    <TerritoryListMap selectedRows={selectedRows} setSelectedRows={setSelectedRows} handleFetchData={handleFetchData}/>
                )}
            </StyledGrid>
        </Box>

        {/* DELETE CONFIRMATION MODAL */}
        {showDeletionConfirmation && (
            <DeleteConfirmationModal
            showDeletionConfirmation={showDeletionConfirmation}
            setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
            deleteSelectedRows={deleteSelectedRows}
          />
        )}
        { updateConfirmationModal &&
            <InlineEditConfirmationModal
            showCancelConfirmationModal={updateConfirmationModal}
            setShowCancelConfirmationModal={(value: boolean) => setUpdateConfirmationModal(value)}
            handleCancelRows={handleCancelRows}
          />
        }
        {showInfoModal && (
            <DownloadMessage
            showInfoModal={showInfoModal}
            onToggle={setShowInfoModal}
        />
        )}
        {territoryActivationRequest && (
            <ActivateDeactivateModal territoryActivationRequest={territoryActivationRequest} setTerritoryActivationRequest={setTerritoryActivationRequest} fetchOptions={fetchOptions} handleFetchData={handleFetchData} setSelectedRows={setSelectedRows}
            setEditMode={setEditMode}/>
        )}
        </>
    )
}
export default withThemeProvider(withToastProvider(withRedux(withPopup(TerritoryList)), 'toast-inject-here'));