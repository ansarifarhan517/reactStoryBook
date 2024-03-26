import moment from 'moment';
import { useDispatch } from 'react-redux';
import React, { Dispatch, useEffect, useMemo, useState } from 'react'
import { Box, Grid, DateRangePicker, TextInput } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { getFormattedDateBySlash } from '../../../../utils/components/Form/utils';
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IReportFiltersProps, REPORT_TYPES } from '../DeviationReports.models';
import { ReactTooltipCustom as ReactTooltip } from '../DeviationReportsStyledComponents';
import { DeviationReportsActions } from '../DeviationReports.actions';

const ReportFiltersComponent = ({ structure, formInstance,selectedDateRange, setSelectedDateRange }: IReportFiltersProps) => {
  const { setValue, watch } = formInstance;
  const reportType = watch("reportType");

  const dispatch = useDispatch<Dispatch<DeviationReportsActions>>();
  const clientProperties = useTypedSelector((state) => state.clientProperties);
  const initialMinDate = useMemo(() => moment(new Date()).subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),[]);
  const initialMaxDate = useMemo(() => moment(new Date()).endOf('day').format('YYYY-MM-DD HH:mm:ss'),[]);
  const [minDate, setMinDate] = useState(initialMinDate);
  const [maxDate, setMaxDate] = useState(initialMaxDate);
  const branchLevelLookups = ['getBranchVehiclesList', 'getBranchDAList', 'getBranchDriversList'];

  useEffect(() => {
    // reset dates 
    setMinDate(initialMinDate);
    setMaxDate(initialMaxDate);
  }, [reportType]);

  const handleChange = (date: Date | null | [Date, Date]) => {
    if (date && Object.keys(date).length !== 0) {
      let startDate = moment(date[0]).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
      let endDate = moment(date[1]).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
      const pickerMinDt = moment(date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const pickerMaxDt = moment(date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      if (minDate !== pickerMinDt || maxDate !== pickerMaxDt) {
        // Reset Trip dropdown of Vehicle Trip Journey
        if (reportType === REPORT_TYPES.VEHICLE_TRIP_JOURNEY_REPORT) {
          dispatch({ type: "@@deviationReports/SAVE_DATE_RANGE", payload: { startDate: startDate, endDate: endDate } })
          setValue("tripSingle", undefined);
        }
        setMinDate(pickerMinDt);
        setMaxDate(pickerMaxDt);
        setSelectedDateRange({ startDate: startDate, endDate: endDate });
      }
    }
  };

  return (
    <>
      {Object.keys(structure['general details']).map((fieldName) => {
        const meta = structure['general details'][fieldName]
        const { permission } = meta;
        if (!permission || fieldName === "reportType") { return undefined }
        if (fieldName == 'date') {
          return (
            <Grid item key={fieldName} xs={12} sm={6} md={3} className='input-grid grid-item' style={{margin:"auto 0"}}>
                <DateRangePicker
                  showTime={false}
                  onFromChange={handleChange}
                  onToChange={handleChange}
                  onApply={handleChange}
                  label={'Date Range'}
                  variant='daterange'
                  style={{ position: 'absolute', right: '10px', width: '100%' }}
                  tillMaxDate={new Date()}
                  startDate={new Date(minDate)}
                  endDate={new Date(maxDate)}
                  fromDateFormatter={getFormattedDateBySlash}
                  toDateFormatter={getFormattedDateBySlash}
                >
                  {({ value, open, setOpen }: any) => (
                    <>
                      <div onClick={() => setOpen(!open)} data-tip data-for='deviation-date-range'>
                        <TextInput
                          id='text_field_deviationreport_date_range'
                          fullWidth
                          style={{
                            fontSize: '14px', 
                            height: '30px',
                            cursor: 'pointer',
                            border: '1px solid #979797'
                          }}
                          variant='withIcon'
                          iconVariant='calendar'
                          iconSize='xs'
                          iconStyle={{padding: "7px", height: "30px", margin: '0' }}
                          labelColor='grey.250'
                          color="primary.main"
                          border={false}
                          placeholder='Please Click Here'
                          value={`${moment(value[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(value[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`}
                          onChange={() => 'On change clicked'}
                        />
                      </div>
                      <ReactTooltip id="deviation-date-range" type="info" effect="solid" place="bottom">
                        <Box style={{ maxWidth: '300px', lineHeight: '16px', fontSize:"12px", textAlign: 'center' }}>
                          Choose the Trip Start Date Range
                        </Box>
                      </ReactTooltip>
                    </>
                   )}
                </DateRangePicker> 
            </Grid>
          )
        }
        else {
          if (["getEndedTrips", "getTripsBetweenDates"].includes(meta.lookupType as string)) { meta.lookUpOptionParam = selectedDateRange }
          
          const httpMethod = ["getDriversList", "getDistributionCenter", "getDateSource", "getAttachedTrackerIds"].includes(meta.lookupType as string) ?  "GET" :  "POST";
          meta.httpMethod = httpMethod;
          return (
            <Grid item key={fieldName} xs={12} sm={6} md={3} className='input-grid grid-item'>
              <FormField 
                name={fieldName} 
                meta={meta} 
                isSetSearchValue={!branchLevelLookups.includes(meta.lookupType as string)}
                formInstance={formInstance} 
              />
            </Grid>
          )
        }
      })}
    </>
  )
}

export default ReportFiltersComponent
