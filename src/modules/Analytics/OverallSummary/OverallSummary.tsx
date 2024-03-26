import React, { Dispatch, useEffect, useState } from 'react';
import withRedux from '../../../utils/redux/withRedux';
import { withThemeProvider } from '../../../utils/theme';
import { withToastProvider, withPopup, Box, DateRangePicker, BreadCrumb, Tooltip, TextInput, IconButton, useToast } from 'ui-library';
import TripSummarySection from './subComponents/subPages/tripSummarySection';
import moment from 'moment'
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import OverallSummaryListView from './subComponents/ListView/OverallSummaryListView';
import { OverallSummaryListViewActions } from './OverallSummary.actions'
import { useDispatch } from 'react-redux';
import AveragePerformanceSection from './subComponents/subPages/AveragePerformanceSection';
import OrderSummarySection from './subComponents/subPages/OrderSummarySection';
import DaSummarySection from './subComponents/subPages/DaSummarySection';
import { AdvancedFilterButton, RelativePosition, RowFlexContainer } from './OverallSummary.styles';
import AdvancedFilterComponent from '../../common/AdvancedFilterComponent';
import apiMappings from '../../../utils/apiMapping';
import { AdvancedFilterComponentActions } from '../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions';
import axios from '../../../utils/axios';
import DynamicLabelsReducer from '../../common/DynamicLabels/dynamicLabels.reducer';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { NoDataWrapper } from './subComponents/ListView/OverallSummaryList.styled';



const OverallSummary = () => {
  const pageLabels = useTypedSelector(state => state.pageLabels.hiredDeliveryAssociate);
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const dispatch = useDispatch<Dispatch<OverallSummaryListViewActions>>();
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const advancedFilterData = useTypedSelector(state => state.advanceFilter.advancedFilterData)
  const currentFilter = useTypedSelector(state => state.advanceFilter.currentFilter)
  const openAdvFilter = useTypedSelector(state => state.advanceFilter.openAdvFilter)
  const filterColumns = useTypedSelector( state => state.overallSummaryListView.filterOptions.columns)
  const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload)
  const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : 'DD-MM-YYYY'



  const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();


  const toast = useToast();

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
  const [selectedDate, setSelectedDate] = useState<any>({
    startDate: moment.utc(moment(Date()).subtract(7, 'days').startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
    endDate: moment.utc(moment(Date()).endOf('day')).format('YYYY-MM-DD HH:mm:ss'),
  })

  const [minDate, setMinDate] = useState<any>(moment(Date()).subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
  const [maxDate, setMaxDate] = useState<any>(moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'));

  const AdvanceFilterData = {
    sectionName: 'tripSummary'
  }


  useEffect(() => {
    dispatch({
      type: "@@OverallSummaryListAction/SET_DATES",
      payload: {
        minDate: selectedDate.startDate,
        maxDate: selectedDate.endDate
      }
    })
  }, [selectedDate])

  useEffect(() => {
    if (selectedDate) {
      handleFetchData()
    }
  }, [selectedDate, filterListPayload])

  useEffect(() => {
    if(filterColumns.branchName){
    advanceFilterdispatch({ type: '@@advanceFilter/SET_COLUMNS_SELECTOR', payload: filterColumns});
    }
  }, [filterColumns])

  useEffect(() => {
    dispatch({type: '@@OverallSummaryListAction/FETCH_ADVANCED_FILTER_STRUCTURE'});
    handleFetchFilters();
    return () => {
      advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
      advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
      advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    }
  }, [])

  const handleFetchData = React.useCallback(() => {

    dispatch({
      type: '@@OverallSummaryListAction/FETCH_TRIP_DATA',
      payload: {
        endTimeWindow: selectedDate.endDate,
        startTimeWindow: selectedDate.startDate
      },
    });

    dispatch({
      type: '@@OverallSummaryListAction/FETCH_ORDER_DATA',
      payload: {
        endTimeWindow: selectedDate.endDate,
        startTimeWindow: selectedDate.startDate
      },
    });

    dispatch({
      type: '@@OverallSummaryListAction/FETCH_DA_DATA',
      payload: {
        endTimeWindow: selectedDate.endDate,
        startTimeWindow: selectedDate.startDate
      },
    });

  }, [selectedDate])


  const breadCrumbOptions = React.useMemo(
    () => [
      { id: 'report', label: 'Report', disabled: true },
      { id: 'overallSummary', label: dynamicLabels.overallSummaryTitle, disabled: true },
    ],
    [pageLabels, dynamicLabels],
  );


  const getFormattedDate = (date: Date) => {
    return moment(date).format(`${format} hh:mm A`);
}
  const handleChange = (date: Date | null | [Date, Date]) => {
    if (date && Object.keys(date).length !== 0) {
      let startDate = moment.utc(moment(date[0])).format('YYYY-MM-DD HH:mm:ss')
      let endDate = moment.utc(moment(date[1])).format('YYYY-MM-DD HH:mm:ss')
      if (moment(endDate).diff(moment(startDate), 'days') > 90) {
      toast.add(dynamicLabels.dateRange90ValidationMsg, 'warning', false);
    }else{
      const pickerMinDt = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      const pickerMaxDt = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
      if (minDate !== pickerMinDt || maxDate !== pickerMaxDt) {
        setMinDate(pickerMinDt)
        setMaxDate(pickerMaxDt)
        setSelectedDate({ startDate: startDate, endDate: endDate });
      }
    }
    }
  }

  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
   
    if ((!isFilterDataCalled && ((advancedFilterData.length > 0 && advancedFilterData[0].sectionName != 'OVERALL_SUMMARY') || advancedFilterData?.length == 0)) || callBackAdvanceFilter) {
  
      setIsFilterDataCalled(true)
      try {
        const { data } = await axios.get(apiMappings.advancedSearch.getFilters, {
          params: {
            pageName: 'OVERALL_SUMMARY',
            sectionName: 'OVERALL_SUMMARY_ADVANCED_FILTER_COLUMNS'
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
        toast.add('Error', 'warning', false);
      }
    }
  }

  const handleRemoveFilters = (showToast: boolean) => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_FILTERLIST_PAYLOAD', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_CURRENT_FILTERS', payload: undefined });
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false });
    showToast && toast.add('Filter Removed Successfully', 'check-round', false);
  }

  const handleToggleAdvancedFilter = () => {
    advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: !openAdvFilter });
  }
  return (
    <>

      {selectedDate ? (
        <Box style={{ width: '100%', height: '100vh', paddingTop: '64px' }} px='10px' pb='10px'>
          <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px' px='12px'>
            <div>
              <BreadCrumb
                options={breadCrumbOptions}
                width='100px'
              />

            </div>
            <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>

              <AdvancedFilterComponent
                handleFetchFilters={handleFetchFilters}
                handleRemoveFilter={handleRemoveFilters}
                handleFetchData={handleFetchData}
                data={AdvanceFilterData}
                needsFetchDataCall={false}
                labelButton={true}
                label={dynamicLabels.advancedFilters}
              />


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
                        <Tooltip message={dynamicLabels.overallDateRangeTooltip} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                          <TextInput
                            id='tripId'
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
                            placeholder={dynamicLabels.pleaseClickHere}
                            fullWidth
                            value={`${moment(value[0]).format(`${format} hh:mm A`)} - ${moment(value[1]).format(`${format} hh:mm A`)}`}
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

          <TripSummarySection selectedDate={selectedDate} />
          <RelativePosition>
            <AveragePerformanceSection />
            <OrderSummarySection />
            <DaSummarySection />
            <OverallSummaryListView
              selectedDate={selectedDate} 
              handleRemoveFilters={handleRemoveFilters}/>
          </RelativePosition>
        </Box>
      ) : (
        <NoDataWrapper></NoDataWrapper>
      )}
    </>
  )
}

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(OverallSummary)))
)


