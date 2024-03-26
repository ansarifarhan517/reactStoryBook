import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";
import FormField from "../../../../utils/components/Form/FormField";
import { Grid, Box } from "ui-library";
import SurgeTimings from "./SurgeTimings";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";

interface ISurchargeMinimumCost {
  structure: any;
  formInstance: UseFormMethods<Record<string, any>>;
  dynamicLabels?: Record<string, string>;
  data?:any;
  currencySymbol?:string
  ogData?:any
}

const SurchargeMinimumCost = ({
  structure,
  formInstance,
  data,
  currencySymbol,
  ogData
}: //   dynamicLabels,
ISurchargeMinimumCost) => {
  const { watch, getValues } = formInstance;

  const values = getValues("surchargeMappings");

  const watchSurchargeAreaFeesType = watch(
    "surchargeMappings.surchargeArea.rateType"
  );
  const watchSurchargeFuelFeesType = watch(
    "surchargeMappings.surchargeFuel.rateType"
  );
  const watchSurchargeTimingsFeesType = watch(
    "surchargeMappings.surchargeSurgeTime.rateType"
  );

  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.rateProfile}`
  );

  const [struct, newStruct] = useState(structure);


  useEffect(() => {
    newStruct(structure);
  }, [structure]);

  return (
    <>
    <Box display="block" style={{width:'100%',padding: '0px'}} >
      <Grid container spacing="10px">
        {Object.values(struct.childNodes).map((meta: any, index: number) => {

          if(meta.fieldName === 'rate') {
          if(struct.fieldName === "surchargeArea") {
            meta.label =  watchSurchargeAreaFeesType?.name === "Percentage" ? `Rate (%)`: `Rate (${currencySymbol})`
          } else if(struct.fieldName === "surchargeFuel") {
            meta.label =  watchSurchargeFuelFeesType?.name === "Percentage" ? `Rate (%)`: `Rate (${currencySymbol})`
          } else if(struct.fieldName === "surchargeSurgeTime") {
            meta.label =  watchSurchargeTimingsFeesType?.name === "Percentage" ? `Rate (%)`: `Rate (${currencySymbol})`

          }
         
        } else if (meta?.id === "minimumRate" && !meta.label.includes(`(${currencySymbol})`)  )  {
          meta.label = `${meta.label} (${currencySymbol})`
        }

          return (
              <>
              {meta?.id === "minimumRate" &&
              struct.fieldName === "surchargeArea" &&
              watchSurchargeAreaFeesType?.name === "Percentage" ? (
                <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">
                <FormField
                  key={`surchargeMappings.${struct.fieldName}.${meta.fieldName}.${index}`}
                  name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                  meta={meta}
                  formInstance={formInstance}
                />
                </Grid>
              ) : meta?.id === "minimumRate" &&
                struct.fieldName === "surchargeFuel" &&
                watchSurchargeFuelFeesType?.name === "Percentage" ? (
                  <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">
                <FormField
                  key={`surchargeMappings.${struct.fieldName}.${meta.fieldName}.${index}`}
                  name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                  meta={meta}
                  formInstance={formInstance}
                />
                </Grid>
              ) : meta?.id === "minimumRate" &&
                struct.fieldName === "surchargeSurgeTime" &&
                watchSurchargeTimingsFeesType?.name === "Percentage" ? (
                <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">
                <FormField
                  key={`surchargeMappings.${struct.fieldName}.${meta.fieldName}.${index}`}
                  name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                  meta={meta}
                  formInstance={formInstance}
                />
                </Grid>
              ) : meta.fieldType === "select" ? (
                <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">
                  <FormField
                    key={`surchargeMappings.${struct.fieldName}.${meta.fieldName}.${index}`}
                    name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                    meta={meta}
                    formInstance={formInstance}
                    defaultValue={
                      values?.[`${struct.fieldName}`]?.[`${meta.fieldName}`]
                    }
                  />
                  </Grid>
                ) : (
                  meta.id === "surgeTimings" ? 
                  <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">

                    <SurgeTimings 
                      formInstance={formInstance}
                      structure={struct}
                      name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                      data={data}
                      ogData={ogData}
                    />
                    </Grid>
                  : meta.id !== "minimumRate" && (
                    <Grid item xs={12} md={3} sm={3} key={`${meta.fieldName}`} className="SurchargeMinimumCost">

                    <FormField
                      key={`surchargeMappings.${struct.fieldName}.${meta.fieldName}.${index}`}
                      name={`surchargeMappings.${struct.fieldName}.${meta.fieldName}`}
                      meta={meta}
                      formInstance={formInstance}
                    />
                    </Grid>
                  )
                )}
            </>
          );
        })}
      </Grid>
    </Box>
    <div style={{width: '100%',padding: '5px 0px',display: 'block',fontSize:' 12px',textTransform: 'initial'}}>
     Note: {dynamicLabels?.[`${struct.fieldName}Note`]}
   </div>
   </>
  )
};

export default SurchargeMinimumCost;
