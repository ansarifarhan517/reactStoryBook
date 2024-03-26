import React  from "react";
//import { FormWrapper } from "../../../../utils/components/Form/Form.styles";
import { Grid } from 'ui-library';
import FormField from "../../../../utils/components/Form/FormField";
import { EventCount, EventIndex } from "../Organizationconfiguration.style";

export const AdditionalContactDetails = (props: any) => {
    const { contactStructure, formInstance } = props
    let index = 0;
    return(
        <div>
          {contactStructure && Object.keys(contactStructure).map((sectionName) => {
            index = index + 1
            return (
              <div key = {sectionName}>
              <Grid container spacing='0px' style={{ marginBottom: '2px' }}>
                <EventIndex>
                  <EventCount>{index}</EventCount>
                </EventIndex>
                {Object.keys(contactStructure[sectionName].childNodes).map(fieldName => {
                  if (fieldName.includes('contactId') || fieldName.includes("zohoContactId")) {
                    return;
                  }
                  const meta = contactStructure[sectionName].childNodes[fieldName]
                  meta.multipleFiles = false
                  return (
                    <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                          <FormField
                                name={fieldName}
                                meta={meta}
                                formInstance={formInstance} />
                        </Grid>)
                })}
                </Grid>
                </div>
            )
          })}
        </div>
    )
    
}