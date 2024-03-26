import React, { Dispatch, useEffect, useState } from 'react';
import withRedux from '../../../utils/redux/withRedux';
import { withThemeProvider } from '../../../utils/theme';
import { withToastProvider, withPopup, Box, IconButton, BreadCrumb, DateRangePicker, TextInput, Grid, Card, ListView, IListViewColumn, useToast, IFetchDataOptions,
    Tooltip, Modal, ModalHeader, ISelectedRows, IFilterOptions, ISortOptions} from 'ui-library'
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import moment from "moment";
import { ManifestListActions } from './ManifestList.actions';
import { useDispatch } from 'react-redux';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { ColumnInstance } from 'react-table'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import FileSaver from 'file-saver';
import { sendGA } from '../../../utils/ga'
// import PrintManifest from './printManifest/printManifest';
// import { handlePrint } from './printManifest/printTable';
import {  StyledGrid } from './ManifestListStyledComponents';
import { hybridRouteTo, getQueryParams } from '../../../utils/hybridRouting';
// import { IManifestListDataPayload } from './ManifestList.models';
import { IStateService } from 'angular-ui-router';
import { SortingRule } from 'react-table'
// import usePrintManifest from './PrintManifest/UsePrintManifest'
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import {
    AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper,
    FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
  } from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import RaiseExceptionModal from '../../Order/SubComponent/RaiseExceptionModal';
import PrintAWBModal from './PrintManifestLabel/PrintAWBModal';
import PrintManifestModal from './PrintManifest/PrintManifestModal';

interface IManifestListProps {
    ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const ManifestList = ({ ngStateRouter }: IManifestListProps) => {
    const dispatch = useDispatch<Dispatch<ManifestListActions>>()
    const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
    const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
    const pageLabels = useTypedSelector(state => state.pageLabels.manifest)
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.manifest},${DYNAMIC_LABELS_MAPPING.statusLabels}`)
    const structure = useTypedSelector(state => state.manifest.structure)
    const columnsSelector = useTypedSelector(state => state.manifest.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.manifest.structure.buttons)
    const rowCount = useTypedSelector(state => state.manifest.data.totalCount)
    const rowsSelector = useTypedSelector(state => state.manifest.data.results)
    const loading = useTypedSelector(state => state.manifest.loading.listView)
    const columnsLoading = useTypedSelector(state => state.manifest.loading.columns);

    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    // const { handlePrintManifest, handlePrintManifestLabel} = usePrintManifest(selectedRows)
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
    const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
    const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
    const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
    const [isShowRaiseExceptionModal, setIsShowRaiseExceptionModal] = useState<boolean>(false);
    const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
    const printAWBData = useTypedSelector(state => state.manifest.printAWB)
    const printManifestData = useTypedSelector(state => state.manifest.printManifest)

    // const [isPrint, setIsPrint] = useState<boolean>(false);
    // const [printData, setPrintData] = useState<IManifestListDataPayload[]>([])
    // const [printTableStructure, setPrintTableStructure] = useState<object>({})
    const [filters, setFilters] = useState<Record<string, string>>()
    const [sort, setSort] = useState<SortingRule<object>[]>()
    const AdvanceFilterData = {
        sectionName : 'manifest'
    }

    const pageName="manifest"
    const toast = useToast()

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'Scan Orders', label: dynamicLabels['Scan Orders'] },
        { id: 'manifest', label: dynamicLabels.manifest, disabled: false },
    ], [pageLabels, dynamicLabels])

    const [selectedDate, setSelectedDates] = useState<any>({
        startDate: moment.utc(moment(Date()).subtract(7, 'days').startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment.utc(moment(Date()).endOf('day')).format('YYYY-MM-DD HH:mm:ss'),
    });

    const [minDate, setMinDate] = useState<any>(moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
    const [maxDate, setMaxDate] = useState<any>( moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'));

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

    useEffect(() => {
        handleQueryParams()
        dispatch({
          type: '@@manifestList/SET_COLUMNS_LOADING',
          payload: { columns: true }
        })
        dispatch({ type: '@@manifestList/FETCH_STRUCTURE'})
        dispatch({ type: '@@manifestList/FETCH_PRINT_MANIFEST_TEMPLATE' })
        dispatch({ type: '@@manifestList/FETCH_PRINT_MANIFEST_LABEL_TEMPLATE' })
        handleFetchFilters();
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    }, [])

    const handleChange = (date: Date | null | [Date, Date]) => {
        if (date && Object.keys(date).length !== 0) {
          let startDate = moment.utc(moment(date[0])).format('YYYY-MM-DD HH:mm:ss')
          let endDate = moment.utc(moment(date[1])).format('YYYY-MM-DD HH:mm:ss')
          const pickerMinDt = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
          const pickerMaxDt = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
          if (minDate!==pickerMinDt || maxDate!==pickerMaxDt) {
            setMinDate(pickerMinDt)
            setMaxDate(pickerMaxDt)
            setSelectedDates({ startDate: startDate, endDate: endDate });
          }
        }
    };

    const getFormattedDate = (date: Date) => {
        const todayTime = date
        const month = todayTime.getMonth() + 1
        const day = todayTime.getDate()
        const year = todayTime.getFullYear()
        return month + '/' + day + '/' + year
    }

    const handleActionBarButtonClick = React.useCallback((id: string) => {
        switch (id) {
          case 'markAsHandover':
            markAsHandover()
            break

          case 'printManifest':
            //   console.log('Print Manifest....')
            //   handlePrintManifest()
            if (printManifestData?.templates?.length > 0) {
                dispatch({ type: '@@manifestList/SET_PRINT_MANIFEST_MODAL_OPEN', payload: true })
    
                dispatch({ type: '@@manifestList/SET_CURRENT_SELECTED_IDS', payload: [...Object.values(selectedRows).map(row => row.manifestNo)] })
            } else {
                toast.add(dynamicLabels.printManifestConfigTemplate, "warning", false);
            }            
            // printOrder()
            break

            case 'printManifestLabel':
                // console.log('Print Manifest Label...')
                   //printAwb(selectedRows, fetchOptions, dynamicLabels);
          if (printAWBData?.templates?.length > 0) {
            dispatch({ type: '@@manifestList/SET_AWB_MODAL_OPEN', payload: true })

            dispatch({ type: '@@manifestList/SET_CURRENT_SELECTED_IDS', payload: [...Object.values(selectedRows).map(row => row.manifestNo)] })
          } else {
            toast.add(dynamicLabels.printManifestTemplate, "warning", false);
          }
          break;
            case 'raiseException':
                setIsShowRaiseExceptionModal(true);
                break; 

        }
    }, [selectedRows])

    const markAsHandover = async () => {
        try{
            if (Object.keys(selectedRows).length) {
                const {data : data} = await axios.put(apiMappings.manifest.listView.markAsHandover, Object.values(selectedRows).map(row => row.manifestId));

                if (data.status === 200) {
                    toast.add(`${data.message}`, 'check-round', false);
                    setSelectedRows({});
                    // fetchOptions.apis?.resetSelection();
                    handleFetchData(fetchOptions);
                    return;
                }
                throw data?.message;
            } else {
                toast.add(dynamicLabels.selectOneNotHandoverManifests, 'warning', false)
            }
        } catch (errorMessage) {
          toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }

    // const  printOrder = async () => {
    //     try{
    //         if (Object.keys(selectedRows).length) {

    //             const structureData = await axios.get(apiMappings.manifest.listView.printManifestStructure);
    //             if (structureData.status === 200) {
    //                 setPrintTableStructure(structureData.data)
    //                 const request = {
    //                     manifestId : Object.values(selectedRows).map(row => row.manifestNo)
    //                 }
    //                 const {data : data} = await axios.post(apiMappings.manifest.listView.data, request);
    //                 if (data.status === 200) {
    //                     setPrintData(data.data.results)
    //                     setIsPrint(true)
    //                     return;
    //                 }
    //                 throw data?.message;
    //             }

    //         } else {
    //             toast.add(dynamicLabels.selectOneNotHandoverManifests, 'warning', false)
    //         }
    //     } catch (errorMessage) {
    //       toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
    //     }
    // }

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'manifest');
            setColumns(newColumns);
        }
        advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
    }, [columnsSelector]);

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s)
    }, [])

    const selectedManifestIds = React.useMemo(() => Object.keys(selectedRows), [selectedRows])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

        sendGA('Column Preference Action' ,`Manifest List View -  Save & Apply column`)

          const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })
        const payload = {
          ...structure,
          columns
        }
        try {
          const { data: { message } } = await axios.put(apiMappings.manifest.listView.structure, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
          console.log(error, error?.response)
        }

    }, [columnsSelector])


    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }) => {
        dispatch({
          type: '@@manifestList/SET_LOADING',
          payload: { listView: true }
        })
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions })
        if (filterOptions.searchText != undefined) {
            Object.keys(dynamicLabels).map(function(k){ 
                if(dynamicLabels[k] == filterOptions.searchText){
                    filterOptions.searchText = k             
                }
            })
        } 
        dispatch({
          type: '@@manifestList/FETCH_DATA',
          payload: {
              params : {
                  pageNumber: pageNumber,
                  pageSize: pageSize,
                  searchBy: filterOptions?.searchBy,
                  searchText: filterOptions?.searchText,
                  sortBy: sortOptions?.sortBy,
                  sortOrder: sortOptions?.sortOrder,
                  startDateFilter: selectedDate.startDate,
                  endDateFilter: selectedDate.endDate
              }
          }
        })
    }, [selectedDate, filterListPayload])

    const handleDownloadReport = async () => {
        sendGA('manifest action button' ,`Manifest List View -  Download Report`)
        if (moment(selectedDate?.endDate).diff(moment(selectedDate?.startDate), 'days') > 30) {
            toast.add(dynamicLabels.dateRange31DayValidationMsg, 'warning', false);
          }else{
        setShowInfoModal(true)
        const payload = {
            params: {
                pageNumber: fetchOptions.pageNumber,
                pageSize: fetchOptions.pageSize,
                searchBy: fetchOptions.filterOptions?.searchBy,
                searchText: fetchOptions.filterOptions?.searchText,
                sortBy: fetchOptions.sortOptions?.sortBy,
                sortOrder: fetchOptions.sortOptions?.sortOrder,
                startDateFilter: selectedDate.startDate,
                endDateFilter: selectedDate.endDate
            }
        }

        const searchString = fetchOptions.filterOptions?.searchBy && fetchOptions.filterOptions?.searchText ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}` : '';
        const sortString = fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}` : '';
        console.log('Download  OutscanOrders Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
        try {
            const { data } = await axios.post(`${apiMappings.manifest.listView.excelReportDownload}&endDateFilter=${selectedDate.endDate}&pageNumber=${fetchOptions.pageNumber}&pageSize=${fetchOptions.pageNumber}&startDateFilter=${selectedDate.startDate}${searchString}${sortString}`, payload, {responseType: 'arraybuffer'})
            FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels?.outscan_s} ${dynamicLabels?.manifest} List.xlsx`)
            console.log('Download  OutscanOrders Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
        } catch {
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }
    }

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
            ngStateRouter.go('manifest', newParams, ngStateRouterOptions)
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
            ngStateRouter.go('manifest', newParams, ngStateRouterOptions)
        }, 100)
    }


    // Handle fetch Filters
    const handleFetchFilters = async (callBackAdvanceFilter=false) => {
        if(( !isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'MANIFEST_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
            setIsFilterDataCalled(true)
        try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
            params: {
            pageName: "MANIFEST",
            sectionName: "MANIFEST_LIST_VIEW"
            }
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
        console.log(dynamicLabels.updateFilterFailed, errorMessage);
        toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
        }
    }

    }

    // Handle Remove filters
    const handleRemoveFilter = (showToast: boolean) => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
        handleFetchData(fetchOptions)
        showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, 'check-round', false);
    };

    const handleOpenAdvancedFilter = () => {
        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
      }

    const handleAddManifest = () => {
        sendGA('Navigation' ,`Manifest List View -  Add button`)
        hybridRouteTo('manifestform');
        dispatch({type: "@@manifestList/SET_VIEW_TYPE", payload: 'outscan'});
        ngStateRouter.go('createManifest')
    }

    return(

        <>
            <div id="toast-inject-here"></div>
            <PrintAWBModal orderIds={selectedManifestIds} />
            <PrintManifestModal orderIds ={selectedManifestIds}/>
            <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
                {/* Header */}
                <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '60px' }}>
                    <div>
                        <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
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
                  <FilterAppliedTag>
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
                    {/* Page Action Buttons */}
                    <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px' style={{margin: '18px 0'}}>
                        {pageLabels?.buttons.add &&
                            <>
                                <IconButton
                                id="manifest--actionbar--outscan_manifest_id"
                                intent='page'
                                data-tip
                                data-for='add_vehicle_cm'
                                iconVariant='outscan'
                                onClick={handleAddManifest}>
                                {dynamicLabels.outscan || dynamicLabels.add}
                                </IconButton>
                                <ReactTooltip id='add_vehicle_cm' type='info' effect='solid' place='bottom'>
                                {`Click here to add ${dynamicLabels.outscan}`}
                                </ReactTooltip>
                            </>
                        }

                        <div style={{minWidth: '238px'}}>
                            <DateRangePicker
                                onFromChange={handleChange}
                                onToChange={handleChange}
                                onApply={handleChange}
                                label={'Date Range'}
                                variant='daterange'
                                style={{
                                    position: 'absolute',
                                    right : '10px'
                                }}
                                startDate={new Date(minDate)}
                                endDate={new Date(maxDate)}
                                fromDateFormatter={getFormattedDate}
                                toDateFormatter={getFormattedDate}
                            >
                                {({ value, open, setOpen }: any) => (
                                    <div>
                                        <div onClick={() => setOpen(!open)}>
                                            <Tooltip message={`${dynamicLabels?.chooseADateRangeToDisplay} ${dynamicLabels?.outscan_s} ${dynamicLabels?.manifest} ${dynamicLabels?.duringThatTime}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                                                <TextInput
                                                id='manifestDates'
                                                // name={name}
                                                style={{
                                                    margin: '0',
                                                    fontSize: '14px',
                                                    minHeight: '30px',
                                                    boxShadow: '0 2px 11px -5px #000',
                                                    height: '30px',
                                                    marginTop: '5px',
                                                    minWidth: "200px",
                                                    cursor: 'pointer'
                                                }}
                                                className='someClassname'
                                                variant='withIcon'
                                                iconVariant='calendar'
                                                iconSize='xs'
                                                iconStyle={{
                                                    padding: "7px",
                                                    minHeight: "30px",
                                                    height: "30px",
                                                    margin: '0',
                                                    marginTop: '5px'
                                                }}
                                                labelColor='grey.250'
                                                color="primary.main"
                                                border={false}
                                                placeholder='Please Click Here'
                                                fullWidth
                                                value={`${moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`}
                                                onChange={() => 'On change clicked'}
                                                />
                                            </Tooltip>
                                      </div>
                                  </div>
                                )}
                            </DateRangePicker>
                        </div>
                    </Box>
                </Box>

                {/* LIST VIEW CONTAINER */}
                <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000'}}>
                    <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                        <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
                            <Grid
                                className='grid-customised-scroll-bar'
                                item
                                style={{ display: 'flex', overflow: 'hidden' }}
                            >
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

                                <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                    {columns.length > 0 && filters &&
                                        <ListView
                                            rowIdentifier='manifestId'
                                            hasRowSelectionWithEdit={true}
                                            columns={columns}
                                            data={rowsSelector}
                                            totalRows={rowCount}
                                            onFetchData={handleFetchData}
                                            onRowSelect={onRowSelect}
                                            loading={loading || false}
                                            hideRefresh={loading}
                                            isColumnLoading={columnsLoading}
                                            onSaveColumnPreferences={onSaveColumnPreferences}
                                            onRowEditClick={row => {
                                                
                                                hybridRouteTo(`manifestform?id=${row.manifestNo}`);
                                            }}
                                            style={{ height: '90vh' }}
                                            filters={filters}
                                            onFilterChange={handleFilterChange}
                                            sorts={sort}
                                            onSortChange={handleSortChange}
                                        >
                                            {{
                                                IconBar:
                                                <>
                                                    <Tooltip message={`${dynamicLabels.download} ${dynamicLabels?.outscan_s} ${dynamicLabels?.manifest} ${dynamicLabels.report}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                                                        <IconButton
                                                            id="manifest--actionbar--download"
                                                            intent="page"
                                                            onlyIcon
                                                            primary={false}
                                                            iconVariant="icomoon-download"
                                                            onClick={handleDownloadReport}
                                                            iconSize={16}
                                                            style={{ color: 'inherit' }}
                                                            className="inscanReportDownload"
                                                        />
                                                    </Tooltip>
                                                    <AdvancedFilterComponent
                                                        pageName={pageName}
                                                        handleFetchFilters={handleFetchFilters}
                                                        handleRemoveFilter={handleRemoveFilter}
                                                        handleFetchData={handleFetchData}
                                                        data={AdvanceFilterData}
                                                        needsFetchDataCall={false}
                                                    />

                                                </>,
                                                ActionBar:
                                                <Box display='flex' horizontalSpacing='10px'>
                                                    { Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                                                        <div title={actionBarButtons[buttonKey].label}>
                                                        <IconButton
                                                        key={buttonKey}
                                                        // disabled={buttonKey === 'printManifest' ?  Object.keys(selectedRows).length !== 1 : !Object.keys(selectedRows).length}
                                                        disabled={!Object.keys(selectedRows).length}
                                                        intent='table'
                                                        iconVariant={iconsMapping[buttonKey]}
                                                        id={`listView-actionBar-${buttonKey}`}
                                                        onClick={() => {
                                                            sendGA('ListView ActionBar' ,'Manifest ListView Button Click - ' + actionBarButtons[buttonKey].label)
                                                            handleActionBarButtonClick(buttonKey)
                                                        }}
                                                        // title={actionBarButtons[buttonKey].label}
                                                        >
                                                        {actionBarButtons[buttonKey].label}
                                                        </IconButton>
                                                    </div>)
                                                    }
                                                </Box>
                                            }}
                                        </ListView>
                                    }
                                </Card>
                            </Grid>
                        </StyledGrid>
                    </Grid>
                </Grid>
            </Box>
            <Modal
                open={showInfoModal}
                onToggle={() => { setShowInfoModal(false) }}
                children={{
                header: (
                    <ModalHeader
                    headerTitle='Information'
                    handleClose={() => { setShowInfoModal(false) }}
                    imageVariant='close'
                    />
                ),
                content: (
                    <div style={{ fontSize: '14px'}}>
                    <div>Thank You! Your report is being generated and will be  downloaded soon.</div>
                    <br />
                    <br />
                    <div>You may continue to use the app.</div>
                    </div>
                )
                }}
                width='600px'
            />
            <RaiseExceptionModal setSelectedRows={setSelectedRows} handleFetchData={handleFetchData} fetchOptions={fetchOptions} selectedRows={selectedRows} isShowRaiseExceptionModal={isShowRaiseExceptionModal} setIsShowRaiseExceptionModal={setIsShowRaiseExceptionModal} listViewType='Manifest'></RaiseExceptionModal>
            {/* {isPrint && <PrintManifest printData={printData} printTableStructure={printTableStructure} handlePrint={() => handlePrint(setIsPrint)} isPrint={isPrint}></PrintManifest>} */}
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(ManifestList)), 'toast-inject-here'))