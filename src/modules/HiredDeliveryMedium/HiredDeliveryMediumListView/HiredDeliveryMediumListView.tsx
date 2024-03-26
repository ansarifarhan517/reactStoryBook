import React, { useEffect, Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ColumnInstance } from 'react-table';
import {
  Card,
  Box,
  ListView,
  IListViewColumn,
  IFetchDataOptions,
  withPopup,
  IconButton,
  withToastProvider,
  useToast,
  ISelectedRows,
  ButtonGroup,
  Grid,
  BreadCrumb,
  Tooltip,
  DateRangePicker,
  TextInput
} from 'ui-library';
import { SortingRule } from 'react-table'
import { ListViewWrapper, StyledGrid, NoDataWrapper } from './HiredDeliveryMediumListView.styled'
import { HiredDeliveryMediumListViewActions, ISetViewMode } from './HiredDeliveryMediumListView.actions';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import withRedux from '../../../utils/redux/withRedux';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { withThemeProvider } from '../../../utils/theme';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { hybridRouteTo} from '../../../utils/hybridRouting';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { IStateService } from 'angular-ui-router';
import { sendGA } from '../../../utils/ga';
import DownloadMessage from '../../../utils/components/DownloadMessage'
import {AdvancedFilterComponentActions} from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions'
import { handleCustomColumnSort } from '../../../utils/helper';
import CreateActionBarButton from './utils/HiredDMCreateActionBarButton';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import moment from "moment";
import firebaseRef from '../../../utils/firebase';
import { IHiredDMRouteFlagAction } from '../../common/GlobalRouteFlags/HiredDeliveryMediumRouteFlag.reducer';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IHiredDeliveryMediumListViewDataPayload } from './HiredDeliveryMediumListView.models';

interface IHiredDeliveryMediumListViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
// const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const HiredDeliveryMediumListView = ({ ngStateRouter }: IHiredDeliveryMediumListViewProps) => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.hiredDeliveryMedium + ',Resources');
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
  // const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.driver)
  const toast = useToast();

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<HiredDeliveryMediumListViewActions>>();
  const globalRouteFlagDispatch = useDispatch<Dispatch<IHiredDMRouteFlagAction>>();
  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const pageLabels = useTypedSelector(state => state.pageLabels.hiredDeliveryAssociate);
  const viewMode = useTypedSelector(state => state.hiredDeliveryAssociate.listView.viewMode);
  const emptyData = useTypedSelector(state => state.hiredDeliveryAssociate.listView.emptyData);
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)

  const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

  const [columns, setColumns] = useState<IListViewColumn[]>([]);

  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [isDownloadReportDisabled, setDownloadReportDisabled] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
  const [filters, setFilters] = useState<Record<string, string>>()
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const [selectedDate, setSelectedDates] = useState<any>({
    startDate: moment.utc(moment(Date()).subtract(7, 'days').startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
    endDate: moment.utc(moment(Date()).endOf('day')).format('YYYY-MM-DD HH:mm:ss'),
  });
  const [structure, setStructure] = useState<IMongoListViewStructure>({
    columns: {},
    buttons: {},
  })
  const [listData, setListData] = useState<IHiredDeliveryMediumListViewDataPayload>({
    totalCount: 0,
    results: dummyResult,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const columnsSelector = structure?.columns
  const actionBarButtons = structure?.buttons
  const rowsSelector = listData?.results
  const totalRowsSelector = listData?.totalCount
 

  const [minDate, setMinDate] = useState<any>(moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
  const [maxDate, setMaxDate] = useState<any>(moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'));



  /** Variables */
  const ButtonGroupData = React.useMemo(
    () =>
      pageLabels?.viewOptions
        ? Object.keys(pageLabels?.viewOptions).map((key: string) => ({
          id: key,
          label: pageLabels?.viewOptions[key].toUpperCase(),
          selectecd: key === viewMode,
          icon: key === 'mapview' ? 'default-marker' : 'menu',
          tooltipText:
            key === 'mapview'
              ? `${dynamicLabels.showsTheCurrentLocationOfThe} ${dynamicLabels.Resources} ${dynamicLabels.onAMap}`
              : `${dynamicLabels.showsTheListViewOfAllThe} ${dynamicLabels.Resources}`,
        }))
        : [],
    [pageLabels, viewMode, dynamicLabels],
  );

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: 'fleet', label: dynamicLabels.Resources, disabled: true },
      { id: 'hiredDeliveryMedium', label: dynamicLabels.HiredDA, disabled: true },
    ],
    [pageLabels, dynamicLabels],
  );

  const getListStructure = async() => {
    const { data: payload, status } = await axios.get(apiMappings.hiredDeliveryMedium.listView.structure.All)
    if(status == 200){
        setStructure(payload)
        setLoading(false)
    }
  }

  const getListData = async(queryParams) => {
    setLoading(true)
    const data = filterListPayload || undefined

    const { data: { data: payload } } = await axios.post(apiMappings.hiredDeliveryMedium.listView.data, data,
      {
        params: queryParams,
      }
    )

   setListData(payload)
   setLoading(false)

  }

  /** Watchers */
  useEffect(() => {
    fetchBranchName()
    handleFetchFilters()
    getListStructure()
    handleFetchData(fetchOptions);

  }, []);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'hiredDeliveryMedium', cellCallbackMapping);
      const transformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        return newcolumn;
      });
     
      setColumns(transformedColumn);
    }
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: columnsSelector });
  }, [columnsSelector]);

  const fetchBranchName = async () => {

    try {
      const data = await axios.get(
        apiMappings.hiredDeliveryMedium.listView.clientBranchName, {
        data: {},
        params: {
          //  ...getParams()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (data.status === 200) {
        dispatch({ type: '@@hiredDeliveryMediumListView/SET_BRANCH_NAME', payload: data.data });
        return;
      }
    } catch (errorMessage) {
      const message = errorMessage?.response?.data?.message;
      toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false);
    }
  }


  const cellCallbackMapping = {
    isActiveFl: true
  };

  

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

  

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    sortOptions = handleCustomColumnSort(sortOptions)
    setLoading(true)
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        startDateFilter: selectedDate.startDate, 
        endDateFilter: selectedDate.endDate,
      }
      getListData(payload)
  }, [selectedDate]);

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);


  const handleActionBarButtonClick = React.useCallback((id: string, rowSelected: any) => {
    switch (id) {

      case 'approveDeliveryAssociate':
        
        globalRouteFlagDispatch({
          type: '@@hiredDMRouteFlag/SET_HIREDDM_ROUTEFLAG',
          payload: {
            isThroughHiredDA : true
          }})
        dispatch({ type: '@@hiredDeliveryMediumListView/SEND_DA_DATA', payload: rowSelected })
        if(rowSelected[Object.keys(rowSelected)[0]].deliveryMediumId){
          hybridRouteTo(`deliverymedium/updatedeliverymedium/?deliverymediumid=${rowSelected[Object.keys(rowSelected)[0]].deliveryMediumId}`);
        }else{
          hybridRouteTo(`adddeliverymedium`);
        }
        
        break;

      case 'more':
        break;
    }
  }, []);

  console.log('Hired DA ListView')

  const hitStampNow = Date.now().toString()

  const getSocketConnection = (timestamp: any) => {
    let timeStampString = timestamp.toString();
    let accessToken = localStorage.getItem('userAccessInfo');
    accessToken = accessToken ? JSON.parse(accessToken).token : null;
    const driverCreateRef = firebaseRef.database().ref(`sockets/deliverymediumrequestreport/${accessToken}/${timeStampString}`)

    driverCreateRef.on('value', function (snapshot) {
        if (snapshot.val()) {
            var reportURL = snapshot.val().value;
            if (reportURL && reportURL == "dynamicreport_FAILED") {
                toast.add(dynamicLabels["internal.server.error"] != null ? dynamicLabels["internal.server.error"] : "Internal Server Error", 'error', false);
            } else if (reportURL && reportURL.length > 0) {
                console.log('Download Hired Delivery Medium Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                window.location.href = reportURL;

            }
            driverCreateRef.off('value');
        }
    });
}



 
  const handleDownloadReport = async () => {
    setShowDownloadModal(true)
    sendGA('Hired Delivery Medium action button' ,`Hired Helivery medium List View -  Download Report`)
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
        hitStamp : hitStampNow
      }
    }

    const searchString = fetchOptions.filterOptions?.searchBy && fetchOptions.filterOptions?.searchText ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}` : '';
    const sortString = fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}` : '';

    try {
      console.log('Download Hired Delivery Medium Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.post(`${apiMappings.hiredDeliveryMedium.listView.reportDownload}?&pageSize=${fetchOptions.pageSize}&pageNumber=${fetchOptions.pageNumber}&endDateFilter=${selectedDate.endDate}&startDateFilter=${selectedDate.startDate}&hitStamp=${hitStampNow}${searchString}${sortString}`, payload, { responseType: 'arraybuffer' })

    getSocketConnection(hitStampNow);
    
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const onSaveColumnPreferences = React.useCallback(

    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

      sendGA('Column Preference Action','Hired Delivery Medium List View Save & Apply column')

      const columns = { ...columnsSelector };
      Object.keys(columns).forEach(columnKey => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns,
      };

      try {
        const {
          data: { message },
        } = await axios.put(apiMappings.hiredDeliveryMedium.listView.structure.All, payload);
        message && toast.add(`${dynamicLabels.columnPreferenceSuccess}`, 'check-round', false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector],
  );


  // handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter=false) => {

    if(( !isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'HIRED_DELIVERY_MEDIUM_LIST_VIEW') || advancedFilterData?.length == 0)) || callBackAdvanceFilter){
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            modelName: 'HIRED_DELIVERY_MEDIUM',
            pageName: 'HIRED_DELIVERY_MEDIUM',
            sectionName: `HIRED_DELIVERY_MEDIUM_LIST_VIEW`
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
        toast.add(dynamicLabels.updateFilterFailed, 'warning', false);
      }
    }
  }
 

  
  
  return (
    <>
      <div id='toast-inject-here'></div>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100vh', paddingTop: '64px' }} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
         
          <div>
            <BreadCrumb
              options={breadCrumbOptions}
              width='100px'

            />
            
          </div>




          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>

            {ButtonGroupData.length > 0 && (
              <ButtonGroup
                data={ButtonGroupData}
                onChange={id => dispatch({ type: '@@hiredDeliveryMediumListView/SET_VIEW_MODE', payload: id } as ISetViewMode)}
              />
            )}
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
                      <Tooltip message={dynamicLabels.hiredDADateRange} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                        <TextInput
                          id='deliveryMediumRequestId'
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
        <StyledGrid
          container
          spacing={5}
          style={{ boxShadow: viewMode === 'listview' ? '0 2px 20px -10px #000' : '' }}
        >
          {!emptyData ?
            <> 
              <Grid className='grid-customised-scroll-bar' item md={viewMode === 'listview' ? 12 : 4} style={{ display: 'flex', overflow: 'hidden' }}>

                

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
                    <ListViewWrapper className='HiredDeliveryMediumListViewWrapper'>
                      <ListView
                        rowIdentifier='deliveryMediumRequestId'
                        style={{ height: '100%', overflow: 'visible' }}
                        columns={columns}
                        data={rowsSelector}
                        onFetchData={handleFetchData}
                        totalRows={totalRowsSelector}
                        hasRowSelection={viewMode === 'listview' && !actionBarButtons?.['InlineEdit']?.permission}
                        hasRowSelectionWithEdit={viewMode === 'listview' && actionBarButtons?.['InlineEdit']?.permission}
                        onRowSelect={onRowSelect}
                        onSaveColumnPreferences={onSaveColumnPreferences}
                        hasSelectAllRows={false}
                        loading={loading}
                        hideRefresh={loading}
                        isEditMode={isEditMode}
                        permanentColumns={{
          
                          branchName: true
                        }}
                        filters={filters}
                        sorts={sort}
                        isColumnLoading={loading}
                      >
                        {viewMode === 'listview'
                          ? {
                            IconBar: (
                              <Box display='flex' style={{ position: 'relative' }}>
                                <Tooltip message={dynamicLabels.hiredDAReport} hover messagePlacement='end'>
                                  <IconButton
                                    id='HiredDA-actionBar-download'
                                    key={'tt_DownloadHiredDA'}
                                    disabled={isDownloadReportDisabled}
                                    iconVariant='icomoon-download'
                                    iconSize={16}
                                    onlyIcon
                                    style={{ color: 'inherit' }}
                                    onClick={handleDownloadReport}
                                  />
                                </Tooltip>
                              </Box>
                            ),
                            ActionBar: (
                              <Box display='flex' horizontalSpacing='10px'>
                                {isEditMode ? (
                                  <>
                                    
                                  </>
                                ) : (
                                    Object.keys(actionBarButtons).map(
                                      (buttonKey, index) => {

                                        switch (buttonKey) {
                                          default: {
                                            return <CreateActionBarButton
                                              buttonKey={buttonKey}
                                              actionBarButton={actionBarButtons[buttonKey]}
                                              buttonIndex={index}
                                              selectedRows={selectedRows}
                                              handleActionBarButtonClick={handleActionBarButtonClick}
                                              isButtonDisabled={selectedRows[Object.keys(selectedRows)[0]]?.status === 'ONBOARDED' || Object.keys(selectedRows).length !== 1}
                                              iconVariant={'icon-icomoon-ribbon-tick'}
                                              buttonToolTipTextList={buttonKey === 'approveDeliveryAssociate' ? `${dynamicLabels.approveDeliveryAssociate}`: 'not Found'} />
                                          }

                                         

                                        }

                                      }

                                    ))}
                              </Box>
                            ),
                          }
                          : undefined}
                      </ListView>
                    </ListViewWrapper>
                  )}
                </Card>
              </Grid>
              {viewMode === 'mapview' &&
                <Grid item md={8} style={{ paddingLeft: '15px' }}>
                </Grid>}
            </> :
            <NoDataWrapper>
              
            </NoDataWrapper>}
        </StyledGrid>
      </Box>

     

      {/* DOWNLOAD RESPONSE MODAL */}
       <DownloadMessage
            showInfoModal={showDownloadModal}
            onToggle={setShowDownloadModal}
        />

    </>
  );
};


export default withThemeProvider(withToastProvider(withRedux(withPopup(HiredDeliveryMediumListView)), 'toast-inject-here'));
