import React from 'react'
import { Grid } from "ui-library";
import FormField from "../../../../../utils/components/Form/FormField";


const AddTrackerConfigView = ({ fieldName, meta, formInstance }) => {
  return (
    <Grid item key={fieldName} xs={12} sm={3} md={3} className='grid-item'>
      <FormField name={fieldName} meta={meta} formInstance={formInstance} />
    </Grid>
  )
}

export default AddTrackerConfigView
