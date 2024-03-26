import React from "react";
import { Grid } from "ui-library";
import FormField from "../../../../../../../utils/components/Form/FormField";
import './style.css'


const AddressesFormFields = ({
  formInstance,
  addressFields,
}) => {
  return (
    <>
      {Object.entries(addressFields?.childNodes)?.map(([key, value]: any) => {
        return (
          <Grid
            key={key}
            container
            xs={3}
            className="address-fields all-addresses__address-fields"
            spacing="0px 15px 0px 0px"
          >
            <Grid spacing="15px" item key={key} xs={12} className="grid-item">
              <FormField
                name={key}
                meta={value}
                formInstance={formInstance}
              />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

export default AddressesFormFields;
