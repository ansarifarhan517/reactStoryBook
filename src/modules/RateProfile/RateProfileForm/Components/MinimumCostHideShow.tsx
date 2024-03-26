import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";
import FormField from "../../../../utils/components/Form/FormField";
import { Grid, Box } from "ui-library";

interface IMinimumCostHideShowProps {
  structure: any;
  formInstance: UseFormMethods<Record<string, any>>;
  dynamicLabels?: Record<string, string>;
  currencySymbol?:string
}

const MinimumCostHideShow = ({
  structure,
  formInstance,
  currencySymbol
}: //   dynamicLabels,
IMinimumCostHideShowProps) => {
  const { watch, getValues } = formInstance;
  const values = getValues('additionalServiceCharges')

  const watchCancellationFeesType = watch(
    "additionalServiceCharges.cancellation.rateType"
  );
  const watchReAttemptFeesType = watch(
    "additionalServiceCharges.reattempt.rateType"
  );


  console.log(watchCancellationFeesType, watchReAttemptFeesType)

  const [struct, newStruct] = useState(structure);

  useEffect(() => {
    newStruct(structure);
  }, [structure]);

  return (
    <Box display="flex">
      <Grid container spacing='10px'>
      {Object.values(struct.childNodes).map((meta: any, index: number) => {
        
        if(meta.fieldName === 'rate' ) {
          if(struct.fieldName === "cancellation") {
            meta.label =  watchCancellationFeesType?.name === "Percentage" ? `Cancellation Fees (%)`: `Cancellation Fees (${currencySymbol})`
          } else if(struct.fieldName === "reattempt") {
            meta.label =  watchReAttemptFeesType?.name === "Percentage" ? `Re-attempt Fees (%)`: `Re-attempt Fees (${currencySymbol})`
          }
         
        } else if (meta?.id === "minimumCost" && !meta.label.includes(`(${currencySymbol})`)  )  {
            meta.label = `${meta.label} (${currencySymbol})`
        }

        return (
          <Grid
            item
            xs={12}
            md={3}
            sm={3}
            key={`${meta.fieldName}`}
          >
            {meta?.id === "minimumCost" &&
            struct.fieldName === "cancellation" &&
            watchCancellationFeesType?.name === "Percentage" ? (
              <FormField
                key={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}.${index}`}
                name={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}`}
                meta={meta}
                formInstance={formInstance}
              />
            ) : meta?.id === "minimumCost" &&
              struct.fieldName === "reattempt" &&
              watchReAttemptFeesType?.name === "Percentage" ? (
              <FormField
                key={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}.${index}`}
                name={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}`}
                meta={meta}
                formInstance={formInstance}
              />
            ) : (
              <></>
            )}
            {meta.fieldType === "select" ? (
              <FormField
                key={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}.${index}`}
                name={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}`}
                meta={meta}
                formInstance={formInstance}
                defaultValue={values?.[`${struct.fieldName}`]?.[`${meta.fieldName}`]}
              />
            ) : 
              meta.id !== "minimumCost" && (
                <FormField
                  key={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}.${index}`}
                  name={`additionalServiceCharges.${struct.fieldName}.${meta.fieldName}`}
                  // meta={watchCancellationFeesType?.name === "Percentage" || watchReAttemptFeesType?.name === "Percentage" ? selectMeta : meta}
                  meta={meta}
                  formInstance={formInstance}
                  // options={options}
                />
              )
            }
          </Grid>
        );
      })}
      </Grid>
    </Box>
  );
};

export default MinimumCostHideShow;
