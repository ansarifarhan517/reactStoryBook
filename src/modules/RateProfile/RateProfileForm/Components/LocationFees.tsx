import React from "react"; 
import {
  Accordion,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  AccordionContent,
  Grid,
  TextInput,
  Card,
  Box,
  Modal,
  ModalHeader,
  IconButton,
  SectionHeader,
} from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { UseFormMethods } from "react-hook-form";
import SurchargeMinimumCost from "./SurchargeMinimumCost";
import { SectionHeaderContainer } from "../../../../utils/components/Form/Form.styles";

interface ILocationFeesProps {
  structure: any;
  formInstance: UseFormMethods<Record<string, any>>;
  dynamicLabels?: Record<string, string>;
  parentObjectName: string;
  data2?: any;
  currencySymbol?:any,
  data?:any
}
const LocationFees = (props: ILocationFeesProps) => {
  const { structure, formInstance, parentObjectName, dynamicLabels, data2, currencySymbol, data } =
    props;


  const [expanded, setExpanded] = React.useState<string | null>();
  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : "");
  };
  const { getValues } = formInstance;

  const values = getValues(parentObjectName);

  const [surgeTimingModal, setSurgeTimingModal] = React.useState(false);

  return (
    <div>
      {structure &&
        Object.keys(structure.childNodes).length > 0 &&
        Object.keys(structure.childNodes).map((row: any, index: number) => {
          const child = structure.childNodes[row];
        
          return (
            <Accordion
              id={index.toString()}
              key={child?.fieldName}
              expanded={expanded === index.toString()}
              onToggle={handleToggle}
            >
              {{
                header: (
                  <>
                    <AccordionHeaderTitle className="AccordionHeaderTitle">
                      {child?.label}
                    </AccordionHeaderTitle>
                    <AccordionHeaderSubTitle>
                      {child?.descLabel}
                    </AccordionHeaderSubTitle>
                  </>
                ),
                content: (
                  <AccordionContent>
                    <Grid container spacing="15px" style={{width:'100%', margin: '0px'} }>
                      <>
                        {child?.fieldName === "surchargeFuel" ? (
                          <SurchargeMinimumCost
                            structure={child}
                            formInstance={formInstance}
                            dynamicLabels={dynamicLabels}
                            currencySymbol={currencySymbol}
                            ogData={data}
                          />
                        ) : child?.fieldName === "surchargeArea" ? (
                          <SurchargeMinimumCost
                            structure={child}
                            formInstance={formInstance}
                            dynamicLabels={dynamicLabels}
                            currencySymbol={currencySymbol}
                            ogData={data}
                          />
                        ) : child?.fieldName === "surchargeSurgeTime" ? (
                          <SurchargeMinimumCost
                            structure={child}
                            formInstance={formInstance}
                            dynamicLabels={dynamicLabels}
                            currencySymbol={currencySymbol}
                            ogData={data}
                            data={data2}
                          />
                        ) : (
                          child?.childNodes &&
                          Object.keys(child?.childNodes).map(
                            (subRow: any) => {
                              const grandChild =
                                child?.childNodes[subRow];

                                if(grandChild.id === 'limitExceedsCharge' && !grandChild.label.includes(`(${currencySymbol})`) ){
                                  grandChild.label = grandChild?.label + `(${currencySymbol})`
                                }
                              

                              return grandChild?.fieldName ===
                                "surgeTimings" ? (
                                <div className="SurgeTimingWrapper">
                                  <div>
                                    <TextInput
                                      fullWidth
                                      name={grandChild.name}
                                      className={`formFieldWrapper-${grandChild.name}`}
                                      placeholder={grandChild.label}
                                      label={grandChild.label}
                                      required={grandChild.required}
                                      id={grandChild.name}
                                      value={0}
                                      onClick={() => setSurgeTimingModal(true)}
                                      variant="withIcon"
                                      iconVariant={"add"}
                                      iconSize={15}
                                      onIconClick={() =>
                                        setSurgeTimingModal(true)
                                      }
                                    />
                                    <Modal
                                      open={!!surgeTimingModal}
                                      onToggle={() => {}}
                                      size="lg"
                                      width="900px"
                                    >
                                      {{
                                        header: (
                                          <ModalHeader
                                            width="100%"
                                            headerTitle={
                                              "Surge Timings Component"
                                            }
                                            imageVariant="icomoon-close"
                                            handleClose={() => {
                                              setSurgeTimingModal(false);
                                            }}
                                          />
                                        ),

                                        content: (
                                          <Card>
                                            <Box
                                              horizontalSpacing="10px"
                                              display="flex"
                                              justifyContent="flex-start"
                                              p="15px"
                                            >
                                              <SectionHeaderContainer>
                                                <SectionHeader
                                                  headerTitle={
                                                    grandChild.label
                                                  }
                                                />
                                              </SectionHeaderContainer>
                                              {Object.values(
                                                data["surgeTimings"]
                                              ).map((meta: any) => {
                                                return (
                                                  <Grid
                                                    item
                                                    key={meta.fieldName}
                                                    xs={12}
                                                    sm={6}
                                                    md={3}
                                                    className="grid-item vehicleForm"
                                                  >
                                                    <FormField
                                                      name={meta.fieldName}
                                                      meta={meta}
                                                      formInstance={
                                                        formInstance
                                                      }
                                                    />
                                                  </Grid>
                                                );
                                              })}
                                            </Box>
                                          </Card>
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
                                                  setSurgeTimingModal(false);
                                              }}
                                            >
                                              OK
                                            </IconButton>
                                            <IconButton
                                              iconVariant="icomoon-close"
                                              iconSize={11}
                                              onClick={() => {
                                                setSurgeTimingModal(false);
                                              }}
                                            >
                                              Cancel
                                            </IconButton>
                                          </Box>
                                        ),
                                      }}
                                    </Modal>
                                  </div>
                                </div>
                              ) : (
                                <Grid
                                  item
                                  xs={12}
                                  md={3}
                                  sm={3}
                                  key={`${parentObjectName}.${child.fieldName}.${grandChild.fieldName}`}
                                >
                                  {grandChild?.fieldType === "select" ? (
                                    <>
                                      <FormField
                                        key={`${parentObjectName}.${child.fieldName}.${grandChild.fieldName}`}
                                        name={`${parentObjectName}.${child.fieldName}.${grandChild.fieldName}`}
                                        meta={grandChild}
                                        formInstance={formInstance}
                                        defaultValue={
                                          values?.[
                                            `${child?.fieldName}`
                                          ]?.[`${grandChild.fieldName}`]
                                        }
                                      />
                                    </>
                                  ) : (
                                    <FormField
                                      key={`${parentObjectName}.${child.fieldName}.${grandChild.fieldName}`}
                                      name={`${parentObjectName}.${child.fieldName}.${grandChild.fieldName}`}
                                      meta={grandChild}
                                      formInstance={formInstance}
                                    />
                                  )}
                                </Grid>
                              );
                            }
                          )
                        )}
                      </>
                    </Grid>
                  </AccordionContent>
                ),
              }}
            </Accordion>
          );
        })}
    </div>
  );
};

export default LocationFees;
