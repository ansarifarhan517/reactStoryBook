import React, { useState, Suspense } from "react";
import FormField from "../../../utils/components/Form/FormField";
import {
  Position,
  Grid,
  IconButton,
  Modal,
  ModalHeader,
  Box,
  TextInput,
  Loader,
  SectionHeader,
} from "ui-library";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";


const getMetric = ( clientMetrics:any,dynamicLabels:any, moduleName:any) => {
  const obj = clientMetrics?.find((obj:any) => obj?.propertyKey?.toLowerCase() === moduleName?.toLowerCase())
  return dynamicLabels[obj?.propertyValue] ?  dynamicLabels[obj?.propertyValue] : obj?.propertyValue.toLowerCase()
}
import { SectionHeaderContainer } from "../../../utils/components/Form/Form.styles";

const BasicCost = React.lazy(
  () => import("../../../utils/components/GroupRepeat/BasicCostInput")
);

function BasicCostLazy(props: any) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center />
          </Position>
        }
      >
        <BasicCost {...props} />
      </Suspense>
    </div>
  );
}

const RateProfileFormFieldWrapper = ({
  meta,
  formInstance,
  currencySymbol,
  clientMetrics,
  dropdownOptions,
  data
}: any) => {
  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.rateProfile},${currencySymbol}`
  );

  const { setValue, getValues } = formInstance;

  const [distanceBasedRateChartModal, setDistanceBasedRateChartModal] =
    useState<boolean>(false);

  const [count, setCount] = useState(0);
  const fieldName = 
    meta.fieldName === "CODhandlingFees" ? "codHandlingFees" : meta.fieldName;
  const [mulitStopCount, setMultiStopCount] = useState(0);

  const handleData = (obj: any) => {
    const baseRateMap = getValues("baseRateMappings");

    let data = {
      ...baseRateMap,
      [fieldName]: obj,
    };

    setValue("baseRateMappings", data);
    setCount(obj?.length || 0);
  };

  const getBasedRates = () => {
    const baseRate = getValues(`baseRateMappings`);
    setCount(baseRate?.[fieldName]?.length || 0);
    return baseRate?.[fieldName];
  };

  React.useEffect(() => {
    const baseRateMap = getValues("baseRateMappings");
    // const fielName = meta?.fieldName === 'codHandlingFees'
    setCount(baseRateMap ? baseRateMap[fieldName]?.length : 0);

    const values = getValues();
    if(meta.id === 'baseRate') {
        meta.label = `Base Rate ( ${currencySymbol} )`
    }
    

    if (
      (values?.multiStoppedFlatRate && values?.multiStoppedFlatRate !== "") ||
      (values?.multiStoppedPerUnitRate &&
        values?.multiStoppedPerUnitRate !== "")
    ) {
      setMultiStopCount(1);
    } else {
      setMultiStopCount(0);
    }
  }, [meta, formInstance]);

  const handleMultiStopSave = () => {
    const values = getValues();

    if (
      (values?.multiStoppedFlatRate && values?.multiStoppedFlatRate !== "") ||
      (values?.multiStoppedPerUnitRate &&
        values?.multiStoppedPerUnitRate !== "")
    ) {
      setMultiStopCount(1);
    } else {
      setMultiStopCount(0);
    }
  };

  


  if (meta.fieldType === "baseCostInput") {
    return (
      <div>
        <TextInput
          fullWidth
          name={meta.name}
          className={`formFieldWrapper-${meta.name}`}
          placeholder={meta.label}
          label={meta.label}
          required={meta.required}
          id={meta.name}
          value={`${count ? count : 0} Slab(s)`}
          onClick={() => setDistanceBasedRateChartModal(true)}
          variant="withIcon"
          iconVariant={"add"}
          iconSize={15}
          onIconClick={() => setDistanceBasedRateChartModal(true)}
          //   title={toolTipText}
        />
        <Modal
          open={!!distanceBasedRateChartModal}
          onToggle={() => {}}
          size="lg"
          width="90vw"
        >
          {{
            header: (
              <ModalHeader
                width="100%"
                headerTitle={`${meta.label}`}
                imageVariant="icomoon-close"
                handleClose={() => {
                  setDistanceBasedRateChartModal(false);
                }}
              />
            ),

            content: (
              <div className="modal-body-wrap">
                <SectionHeaderContainer>
                  <SectionHeader headerTitle={`${meta.label}  Details`} />
                </SectionHeaderContainer>

                <BasicCostLazy
                  // defaultValue={defaultValue}
                  data={data[meta?.fieldName]}
                  handleModalShow={setDistanceBasedRateChartModal}
                  handleData={handleData}
                  getBasedRates={getBasedRates}
                  moduleName={meta?.fieldName}
                  currencySymbol={currencySymbol}
                  clientMetrics={clientMetrics}
                  dynamicLabels={dynamicLabels}
                  dropdownOptions={dropdownOptions}
                  // defaultValue={defaultValue}
                />
              </div>
            ),
           
          }}
        </Modal>
      </div>
    );
  } else if (meta.fieldType === "multiStopOrder") {
    return (
      <div>
        <TextInput
          fullWidth
          name={meta.name}
          className={`formFieldWrapper-${meta.name}`}
          placeholder={meta.label}
          label={meta.label}
          required={meta.required}
          id={meta.name}
          value={mulitStopCount}
          onClick={() => setDistanceBasedRateChartModal(true)}
          variant="withIcon"
          iconVariant={"add"}
          iconSize={15}
          onIconClick={() => setDistanceBasedRateChartModal(true)}
          //   title={toolTipText}
        />
        <Modal
          open={!!distanceBasedRateChartModal}
          onToggle={() => {}}
          size="lg"
          width="900px"
        >
          {{
            header: (
              <ModalHeader
                width="100%"
                headerTitle={meta.label}
                imageVariant="icomoon-close"
                handleClose={() => {
                  // customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                  setDistanceBasedRateChartModal(false);
                  //   setIsRateProfileDataLoading(false);
                }}
              />
            ),

            content: (
                <>
                  <div>
                    <SectionHeaderContainer>
                      <SectionHeader headerTitle={`${meta.label} Details`} />
                    </SectionHeaderContainer>
                  </div>
                  <Grid
                    container
                    spacing="5px"
                  >
                    {Object.values(data["multiStopOrder"]).map((meta: any) => {
                      const metric = getMetric(clientMetrics,dynamicLabels, 'distance')

                      if(meta.fieldName === 'multiStoppedPerUnitRate' && !meta.label.includes(`${metric}`)) {
                        meta.label = `Per ${metric} Rate` 
                      } 
                    

                     return (
                        <Grid
                          item
                          key={meta.fieldName}
                          xs={12}
                          sm={6}
                          md={3}
                        >
                          <FormField
                            name={meta.fieldName}
                            meta={meta}
                            formInstance={formInstance}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <div style={{width: "100%",display: "block",fontSize: "12px",textTransform: 'initial'}}>
                  Note: {dynamicLabels?.pooledOrderNote}
                  </div>
                  
                </>
            
            ),
            footer: (
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                  iconVariant="icomoon-tick-circled"
                  primary
                  onClick={() => {
                    console.log("OK"), setDistanceBasedRateChartModal(false);
                    handleMultiStopSave();
                  }}
                >
                  Save
                </IconButton>
                <IconButton
                  iconVariant="icomoon-close"
                  iconSize={11}
                  onClick={() => {
                    // customerActivationRequest?.failureCallback && customerActivationRequest?.failureCallback(!customerActivationRequest.activeRequest)
                    setDistanceBasedRateChartModal(false);
                  }}
                >
                  Cancel
                </IconButton>
              </Box>
            ),
          }}
        </Modal>
      </div>
    );
  } else {
    return (
      <FormField
        name={meta.fieldName}
        meta={meta}
        formInstance={formInstance}
      />
    );
  }
};

export default RateProfileFormFieldWrapper;
