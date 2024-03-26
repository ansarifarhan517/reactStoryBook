import React, { useState, Dispatch, useEffect } from 'react'
import { withThemeProvider } from '../../../utils/theme';
import {
  withToastProvider, withPopup, Box, IconButton, BreadCrumb, DateRangePicker, TextInput, Grid, Card, ListView, IListViewColumn, useToast, Tooltip,
  IFetchDataOptions, Modal, ModalHeader,
  IFilterOptions, ISortOptions
} from 'ui-library';
import withRedux from '../../../utils/redux/withRedux';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { InscanListActions } from './InscanList.acions';
import { useDispatch } from 'react-redux';
import moment from "moment";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { ColumnInstance } from 'react-table'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import FileSaver from 'file-saver';
import {   StyledGrid, } from './InscanLiistStyledComponents';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import {
  AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper,
  FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel,
} from '../../OrderRequest/OrderRequestListView/StyledOrderRequestListView'
import { hybridRouteTo, getQueryParams } from '../../../utils/hybridRouting';
import { IStateService } from 'angular-ui-router';
import { SortingRule } from 'react-table'
import { tBreadcrumbState } from './InscanList.models';
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent'
import { sendGA } from '../../../utils/ga';
interface IInscanListProps {
  ngStateRouter: IStateService
}

export interface IBreadcrumbOptionsProps {
  id: string
  label: string
}

export interface IMenuOptionData {
  id: string,
  label: string,
  value: string
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const InscanList = ({ ngStateRouter }: IInscanListProps) => {

  const dispatch = useDispatch<Dispatch<InscanListActions>>()
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const pageLabels = useTypedSelector(state => state.pageLabels.orderScane)
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.inscanList},${DYNAMIC_LABELS_MAPPING.statusLabels}`)
  const structure = useTypedSelector(state => state.inscan.structure)
  const columnsSelector = useTypedSelector(state => state.inscan.structure.columns)
  const rowCount = useTypedSelector(state => state.inscan.totalRows)
  const rowsSelector = useTypedSelector(state => state.inscan.data.results)
  const loading = useTypedSelector(state => state.inscan.loading.listView)
  const columnsLoading = useTypedSelector(state => state.inscan.loading.columns);
  const breadcrumbState = useTypedSelector(state => state.inscan.breadcrumbState);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const moreResultsExists = useTypedSelector(state => state.inscan.moreResultsExists)
  const setDisableNext = useTypedSelector(state => state.inscan.setDisableNext);

  const pageName="scanned_orders"
  const toast = useToast()

  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>(breadcrumbState.split("Orders")[0].toUpperCase())
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const [selectedDate, setSelectedDates] = useState<any>({
    startDate: moment.utc(moment(Date()).subtract(7, 'days').startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
    endDate: moment.utc(moment(Date()).endOf('day')).format('YYYY-MM-DD HH:mm:ss'),
  });

  const [minDate, setMinDate] = useState<any>(moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
  const [maxDate, setMaxDate] = useState<any>(moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'));

  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'Scan Orders', label: dynamicLabels['Scan Orders'] },
    { id: breadcrumbState, label: pageLabels?.dropdownValues?.[breadcrumbState], disabled: false },
  ], [pageLabels, dynamicLabels, breadcrumbState])

  const menuOptionList = React.useMemo(() =>
    pageLabels?.dropdownValues ?
      Object.keys(pageLabels.dropdownValues).map((key: string) => ({
        value: key,
        label: pageLabels?.dropdownValues?.[key],
        id: key
      })) : [],
    [pageLabels])

    const AdvanceFilterData = {
      sectionName : 'inscan'
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
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })
    setFilters(temp)

    let breadcrumb: tBreadcrumbState = filterData?.page as tBreadcrumbState

    dispatch({
      type: '@@inscanList/SET_BREADCRUMB_STATE',
      payload: breadcrumb || 'allOrders',
    });
  }

  useEffect(() => {
    handleQueryParams()
    dispatch({
      type: '@@inscanList/SET_COLUMNS_LOADING',
      payload: { columns: true }
    })
    dispatch({ type: '@@inscanList/FETCH_STRUCTURE', payload: { selectedOption: selectedStatus === 'ALL' ? `${selectedStatus}_SCANNED` : selectedStatus } })
    handleFetchFilters();
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'inscan');
      setColumns(newColumns);
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
  }, [columnsSelector]);

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

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    sendGA('Column Preference Action' ,`Inscan List View -  Save & Apply column`)

    const columns = { ...columnsSelector }
    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columns
    }

    try {
      const { data: { message } } = await axios.put(apiMappings.inscan.listView.structure + `${selectedStatus === 'ALL' ? `${selectedStatus}_SCANNED` : selectedStatus}_ORDERS_LIST_VIEW`, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])

  // const onSortChange = React.useCallback(() => { }, [])

  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }) => {
    dispatch({
      type: '@@inscanList/SET_LOADING',
      payload: { listView: true }
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions })
   { pageNumber === 1 && (
    dispatch
    ({
      type: '@@inscanList/FETCH_DATA_COUNT',
      payload: {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          startDateFilter: selectedDate.startDate, // '2018-03-31T18:30:00.000Z'
          endDateFilter: selectedDate.endDate, //'2018-05-31T18:29:00.000Z'
          hubScanStatus: selectedStatus
        }
      }
    })
   )
  }
  
    dispatch({
      type: '@@inscanList/FETCH_DATA',
      payload: {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          startDateFilter: selectedDate.startDate,
          endDateFilter: selectedDate.endDate,
          hubScanStatus: selectedStatus
        }
      }
    })
  }, [selectedDate])

  const changeListView = (selectedOption: string) => {
    const status = selectedOption.split("Orders")[0].toUpperCase();
    // const statusKey = status === 'ALL' ? `${status}_SCANNED` : status;
    const _breadCrumbState = selectedOption as tBreadcrumbState
    setSelectedStatus(status);

    dispatch({
      type: '@@inscanList/SET_BREADCRUMB_STATE',
      payload: _breadCrumbState || 'allOrders',
    })

    setTimeout(() => {
      ngStateRouter.go('scannedOrders', { page: selectedOption || 'allOrders' },
        { ...ngStateRouterOptions, inherit: false, notify: false, reload: false })
    }, 100),

      dispatch({
        type: '@@inscanList/SET_LOADING',
        payload: { listView: true }
      })
    dispatch({
      type: '@@inscanList/SET_COLUMNS_LOADING',
      payload: { columns: true }
    })
    dispatch({ type: '@@inscanList/FETCH_STRUCTURE', payload: { selectedOption: status === 'ALL' ? `${status}_SCANNED` : status } })
    dispatch({
      type: '@@inscanList/FETCH_DATA_COUNT',
      payload: {
        params: {
          startDateFilter: selectedDate.startDate,
          endDateFilter: selectedDate.endDate,
          hubScanStatus: status
        }
      }
    })
    dispatch({
      type: '@@inscanList/FETCH_DATA',
      payload: {
        params: {
          startDateFilter: selectedDate.startDate,
          endDateFilter: selectedDate.endDate,
          hubScanStatus: status
        }
      }
    })
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

    setTimeout(() => {
      ngStateRouter.go('scannedOrders', newParams, ngStateRouterOptions)
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

    setTimeout(() => {
      ngStateRouter.go('scannedOrders', newParams, ngStateRouterOptions)
    }, 100)
  }

  const handleDownloadReport = async () => {
    sendGA('inscan action button' ,`Inscan List View -  Download Report`)
    if (moment(selectedDate?.endDate).diff(moment(selectedDate?.startDate), 'days') > 30) {
      toast.add(dynamicLabels.dateRange31DayValidationMsg, 'warning', false);
    }
else{
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
        endDateFilter: selectedDate.endDate,
        hubScanStatus: selectedStatus
      }
    }

    const searchString = fetchOptions.filterOptions?.searchBy && fetchOptions.filterOptions?.searchText ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}` : '';
    const sortString = fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}` : '';

    try {
      console.log('Download  InscanReports Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.post(`${apiMappings.inscan.listView.excelReportDownload}&endDateFilter=${selectedDate.endDate}&hubScanStatus=${selectedStatus}&pageNumber=${fetchOptions.pageNumber}&pageSize=${fetchOptions.pageNumber}&startDateFilter=${selectedDate.startDate}${searchString}${sortString}`, payload, { responseType: 'arraybuffer' })

      FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.inscan}  ${dynamicLabels?.manifest} List.xlsx`)
      console.log('Download InscanReports Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))

    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }
  }


  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {

    if(( !isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'ALL_SCANNED_ORDERS_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: "SCANNEDORDERS",
            sectionName: "ALL_SCANNED_ORDERS_LIST_VIEW"
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

  const handleAddInscan = () => {
    sendGA('Navigation' ,`Inscan List View -  Add button`)
    hybridRouteTo('inscanorders');
    ngStateRouter.go('inscanForm')
  }

  return (
    <>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '60px' }}>
         <div> <BreadCrumb
            options={(breadCrumbOptions as unknown) as IBreadcrumbOptionsProps[]}
            optionList={menuOptionList}
            onClick={changeListView}
            width='260px'
          />
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
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px' style={{ margin: '18px 0' }}>
            {pageLabels?.buttons.inscan &&
              <>
                <IconButton
                id="scanned_orders--actionbar--inscan"
                  intent='page'
                  data-tip
                  data-for='tt_AddDriver'
                  iconVariant='inscan'
                  onClick={handleAddInscan}>
                  {dynamicLabels[pageLabels?.buttons.inscan] || dynamicLabels.add}
                </IconButton>
                <ReactTooltip id='tt_AddDriver' type='info' effect='solid' place='bottom'>
                  {`Click here to add ${dynamicLabels.inscan}`}
                </ReactTooltip>
              </>
            }
            <div style={{ minWidth: '238px' }}>
              <DateRangePicker
                onFromChange={handleChange}
                onToChange={handleChange}
                onApply={handleChange}
                label={'Date Range'}
                variant='daterange'
                style={{
                  position: 'absolute',
                  right: '10px'
                }}
                startDate={new Date(minDate)}
                endDate={new Date(maxDate)}
                fromDateFormatter={getFormattedDate}
                toDateFormatter={getFormattedDate}
              >
                {({ value, open, setOpen }: any) => (
                  <div>
                    <div onClick={() => setOpen(!open)}>
                      <Tooltip message={`${dynamicLabels?.chooseADateRangeToDisplay} ${dynamicLabels?.inscan} ${dynamicLabels?.manifest} ${dynamicLabels?.duringThatTime}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                        <TextInput
                          id='inscanDates'
                          //name={name}
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
        <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000' }}>
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
                      rowIdentifier='shipmentId'
                      columns={columns}
                      data={rowsSelector}
                      totalRows={rowCount}
                      onRowEditClick={() => { }}
                      onFetchData={handleFetchData}
                      onRowSelect={() => { }}
                      loading={loading}
                      hideRefresh={loading}
                      isColumnLoading={columnsLoading}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      style={{ height: '90vh' }}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      sorts={sort}
                      onSortChange={handleSortChange}
                     moreResultsExists={moreResultsExists}
                     disableNext={setDisableNext}
                    >
                      {{
                        IconBar:
                          <>
                            <Tooltip message={`${dynamicLabels.download} ${dynamicLabels?.inscan} ${dynamicLabels?.manifest} ${dynamicLabels.report}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                              <IconButton
                                intent="page"
                                id="scanned_orders--actionbar--download"
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
                              />
                          </>
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
            <div style={{ fontSize: '14px' }}>
              <div>Thank You! Your report is being generated and will be  downloaded soon.</div>
              <br />
              <br />
              <div>You may continue to use the app.</div>
            </div>
          )
        }}
        width='600px'
      />
    </>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(InscanList)), 'toast-inject-here'))