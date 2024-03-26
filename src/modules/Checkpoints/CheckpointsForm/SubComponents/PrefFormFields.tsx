import React from "react";
import FormField from "../../../../utils/components/Form/FormField";
import { FormFieldsWrapper, StyledGrid } from "../CheckpointsFormStyledComponent";

const PrefFormFields = ({ prefStructure, prefId, formInstance }) => {
  return (
    <FormFieldsWrapper>
      {Object.keys(prefStructure)?.map((fieldName) => {
        const meta = prefStructure[fieldName];

        if (
          fieldName == "fleetType" ||
          fieldName == "vehicleType" 
        ) {
          return (
            <>
              <StyledGrid
                item
                key={fieldName}
                xs={6}
                sm={6}
                md={6}
              >
                <FormField
                  name={fieldName + prefId}
                  meta={meta}
                  formInstance={formInstance}
                />
              </StyledGrid>
            </>
          );
        } else {
          return <></>;
        }
      })}
    </FormFieldsWrapper>
  );
};

export default PrefFormFields;
