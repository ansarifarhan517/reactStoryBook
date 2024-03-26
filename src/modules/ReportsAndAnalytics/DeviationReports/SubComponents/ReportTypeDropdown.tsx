import React, { useMemo } from 'react'
import { Grid } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { routeContains } from '../../../../utils/hybridRouting';
import { DEVIATION_REPORTS_MAPPING, IReportTypeDropdownProps, ReportType } from '../DeviationReports.models';

const ReportTypeDropdown = ({ structure, formInstance, dynamicLabels }: IReportTypeDropdownProps) => {

  const route = routeContains("deviationReports") ? "deviationReport" : "vehicleReport";

  const dropdownValues = useMemo(() => Object.keys(DEVIATION_REPORTS_MAPPING).reduce((deviationReportTypes, reportType) => {
    if (DEVIATION_REPORTS_MAPPING[reportType].typeOfReport === route) {
      const reportConfig = DEVIATION_REPORTS_MAPPING[reportType as ReportType];
      const reportTitle: string = typeof reportConfig?.title === 'string' ? reportConfig?.title : reportConfig?.title(dynamicLabels);
      deviationReportTypes[reportType] = reportTitle;
    }
    return deviationReportTypes;
  }, {}), [dynamicLabels]);
 
  const meta = structure['general details']['reportType'];
  meta['dropdownValues'] = dropdownValues;
  
  return (
      <Grid item xs={12} sm={6} md={3} className='input-grid grid-item'>
        <FormField
          name={meta.fieldName}
					meta={meta}
					formInstance={formInstance}
        />
      </Grid>
  )
}

export default ReportTypeDropdown