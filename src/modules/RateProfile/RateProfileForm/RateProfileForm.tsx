import React, { Dispatch, useEffect, useState } from "react";
import {
  FormWrapper,
  SectionHeaderContainer,
} from "../../../utils/components/Form/Form.styles";
import {
  Grid,
  Card,
  Box,
  IconButton,
  withToastProvider,
  withPopup,
  SectionHeader,
  Accordion,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  AccordionContent,
  BreadCrumb,
  useToast,
} from "ui-library";
import { withThemeProvider } from "../../../utils/theme";
import withRedux from "../../../utils/redux/withRedux";
import { useDispatch } from "react-redux";
import { IRateProfileFormActions } from "./RateProfileForm.actions";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import FormLoader from "../../../utils/components/FormLoader";
import FormField from "../../../utils/components/Form/FormField";
import { useForm } from "react-hook-form";
import { RateProfileWrapper } from "./styled";
import RateProfileFormFieldWrapper from "./RateProfileFormFieldWrapper";
import GroupRepeatable from "../../../utils/components/GroupRepeat";
import LocationFees from "./Components/LocationFees";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import MinimumCostHideShow from "./Components/MinimumCostHideShow";
import {
  getQueryParams,
  hybridRouteTo,
  routeContains,
} from "../../../utils/hybridRouting";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import {
  generateVehicleFormData,
  useBreadCrumbs,
} from "./RateProfileForm.utils";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import { IRateProfileData } from "./RateProfileForm.models";
import { ILogiAPIResponse } from "../../../utils/api.interfaces";
import { getBaseCurrency } from "../../../utils/core";
import moment from 'moment'
import { getConvertedData, ConvertDropdownValues } from "./utils";



const Togglemapping = {
  basicCost: "actualBasicCostFl",
  handlingFees: "actualAdditionalHandlingCostFl",
  locationFees: "locationCostFl",
  surchargeMappings: "actualSurchargeCostFl",
  insurance: "actualInsuranceCostFl",
  cancellation: "cancellationCostFl",
  reattempt: "reattemptCostFl",
  CODhandlingFees: "actualCODHandlingCostFl",
  taxMappings: "taxCostFl",
};



const timezone = moment.tz.guess()

const convertToUTC = (arr:any[]) => {
  const localTimezone = arr?.map((obj:any) => {
    let stTime, etTime
    if(typeof obj?.startTime === 'number') {
      stTime = moment(obj?.startTime).utc().format('YYYY-MM-DDTHH:mm:ss')
      
    } else {
      stTime = obj?.startTime.replace('Z','')
      stTime = moment.tz(moment(stTime).format(`YYYY-MM-DDTHH:mm:ss`),timezone).utc().format('YYYY-MM-DDTHH:mm:ss')
  
    }
    if(typeof obj?.endTime === 'number') {
      etTime = moment(obj?.endTime).utc().format('YYYY-MM-DDTHH:mm:ss')
      
    } else {
      etTime = obj?.endTime.replace('Z','')
      etTime = moment.tz(moment(etTime).format(`YYYY-MM-DDTHH:mm:ss`),timezone).utc().format('YYYY-MM-DDTHH:mm:ss')
  
    }
    

    return {
      dayOfWeek: obj?.dayOfWeek,
      startTime: stTime+'Z',
      endTime : etTime+'Z'
    }
  })


  return localTimezone

}

const currencySymbol = "cur_symbol_" + getBaseCurrency();

const RateProfileForm = () => {
  const toast = useToast();


  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.rateProfile},${currencySymbol}`
  );
  

  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {
      handlingFees: [{ rate: "", skillSet: [] }],
      taxMappings: [{ taxName: "", taxRate: "" }],
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    // watch,
    // unregister
  } = formInstance;

  const { breadCrumbOptions, handleBreadCrumbClick } =
    useBreadCrumbs(formInstance);
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IRateProfileFormActions>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  const structure = useTypedSelector(
    (state) => state.rateProfile.form.structure
  );
  const isEditMode = useTypedSelector(
    (state) => state.rateProfile.form.isEditMode
  );
  const isStructureLoading = useTypedSelector(
    (state) => state.rateProfile.form.loading
  );

  const rateProfileData = useTypedSelector(
    (state) => state.rateProfile.form.rateProfileData
  );

  const systemMetrics = useTypedSelector(
    (state) => state.rateProfile.form.systemMetric
  );
  const clientMetric = useTypedSelector(
    (state) => state.rateProfile.form.clientMetric
  );
  const distance = useTypedSelector(
    (state) => state.rateProfile.form.distance
  );
  const weight = useTypedSelector(
    (state) => state.rateProfile.form.weight
  );
  const volume = useTypedSelector(
    (state) => state.rateProfile.form.volume
  );
  const piece = useTypedSelector(
    (state) => state.rateProfile.form.piece
  );
  const normal = useTypedSelector(
    (state) => state.rateProfile.form.rateNormal
  );
  const data = useTypedSelector(
    (state) => state.rateProfile.form.basicElementsStructure
  );


  const [expanded, setExpanded] = useState<string>("");
  const [isRateProfileDataLoading, setIsRateProfileLoading] =
    useState<boolean>(false);

  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  const [originalData, setOriginalData] = useState({});

  const isLoading = React.useMemo(
    () => isStructureLoading || isRateProfileDataLoading,
    [isStructureLoading, isRateProfileDataLoading]
  );

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : "");
  };

  const handleToggleChange = (
    value: any,
    _index: string,
    _isExpanded?: boolean,
    accordionKey?: string
  ) => {
 
    const key = accordionKey && Togglemapping[accordionKey];
    if (key) {
      setValue(key, value ? "Y" : "N");
    }

  };

  const [sectionKeys, setSectionKeys] = useState<string[]>([]);

  const [systemMetric, setSystemMetric] = useState<any[]>(systemMetrics)

  useEffect(() => {
    const sectKeys = Object.keys(structure);
    setSectionKeys([...sectKeys]);
    setSystemMetric(systemMetrics)

  }, [dynamicLabels[`${currencySymbol}`], structure, systemMetrics]);


  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: "@@rateProfileForm/FETCH_STRUCTURE" });
    }

    const { rpid, dupid } = getQueryParams();
    if(clientMetric) {
      if (routeContains("rateProfileForm") && dupid) {
        fetchRateProfileData(dupid, true);
        dispatch({ type: "@@rateProfileForm/SET_EDIT_MODE", payload: false });
      } else if (routeContains("updateRateProfile") && rpid) {
        dispatch({ type: "@@rateProfileForm/SET_EDIT_MODE", payload: true });
  
        fetchRateProfileData(rpid, false);
      } else {
        dispatch({ type: "@@rateProfileForm/SET_EDIT_MODE", payload: false });
      }
    }
   
  }, [clientMetric, systemMetric]);

  const [dropdownOptions, setDropdownOptions] = useState<any | null>(null)


  React.useEffect(() => {
    if(!!distance && !!weight && !!volume && !!piece && !!normal && !!clientMetric) {
      const option =  {
        rateTypeLookupDistance: distance,
        rateTypeLookupWeight: weight,
        rateTypeLookupVolume: volume,
        rateTypeLookupPiece: piece,
        rateTypeLookupNormal: normal,
      };
      const dropdownOptions = ConvertDropdownValues(option, systemMetric)
      setDropdownOptions({...dropdownOptions})
    }
  },[distance,weight, volume,piece, normal, systemMetric, data])

  console.log(formInstance?.formState?.isDirty);

  // handle Save and Update API
  const onSubmit = async (data: any) => {
    if (!formInstance.formState.isDirty) {
    }
    const {
      name,
      description,
      baseRate,
      baseRateMappings,
      handlingFees,
      handlingFeesSkillset,
      surchargeMappings,
      additionalServiceCharges,
      locationFees,
      taxMappings,
      multiStoppedFlatRate,
      multiStoppedPerUnitRate,
      actualBasicCostFl,
      actualSurchargeCostFl,
      actualInsuranceCostFl,
      cancellationCostFl,
      updateAddressCostFl,
      reattemptCostFl,
      locationCostFl,
      taxCostFl,
      actualCODHandlingCostFl,
      actualAdditionalHandlingCostFl,
    } = data;

    const baseRateMappingsValues = getConvertedData(baseRateMappings, clientMetric,"POST", systemMetric)
    
    let handlingFeesValue = handlingFees?.map((obj: any, index: number) => {
      return {
        ...obj,
        skillSet: handlingFeesSkillset?.[index]?.skillSet
          ? Object.values(handlingFeesSkillset?.[index]?.skillSet)
              ?.map((d: any) => d?.label)
              ?.join(",")
          : "",
      };
    });
    let additionalServiceChargesValue = {};
    Object.keys(additionalServiceCharges)?.forEach((key: any) => {
      let obj = additionalServiceCharges[key];

      additionalServiceChargesValue = {
        ...additionalServiceChargesValue,
        [key]: { ...obj, rateType: obj?.rateType?.name || "" },
      };
    });

    

    let surchargeTimings =
      surchargeMappings["surchargeSurgeTime"]?.surgeTimings == ""
        ? undefined
        : surchargeMappings["surchargeSurgeTime"]?.surgeTimings;

    if (!surchargeTimings) {

      delete surchargeMappings["surchargeSurgeTime"].surgeTimings;
    } else 
    {
      surchargeMappings["surchargeSurgeTime"].surgeTimings = convertToUTC( surchargeMappings["surchargeSurgeTime"]?.surgeTimings)
    }



    let surchargeMappingsValue = {
      surchargeFuel: {
        ...surchargeMappings["surchargeFuel"],
        rateType: surchargeMappings["surchargeFuel"]?.rateType?.name || "",
      },
      surchargeArea: {
        ...surchargeMappings["surchargeArea"],
        rateType: surchargeMappings["surchargeArea"]?.rateType?.name || "",
      },
      surchargeSurgeTime: {
        ...surchargeMappings["surchargeSurgeTime"],
        rateType: surchargeMappings["surchargeSurgeTime"]?.rateType?.name || "",
      },
    };

   

    let locationFeesValue = {};
    Object.keys(locationFees)?.forEach((key: any) => {
      let obj = locationFees[key];

      locationFeesValue = {
        ...locationFeesValue,
        [key]: { ...obj, waitTimeChargeType: obj?.waitTimeChargeType?.name },
      };
    });

    const payload = {
      name,
      description,
      baseRate,
      baseRateMappings: baseRateMappingsValues,
      handlingFees: handlingFeesValue,
      surchargeMappings: surchargeMappingsValue,
      additionalServiceCharges: additionalServiceChargesValue,
      locationFees: locationFeesValue,
      taxMappings,
      multiStoppedFlatRate,
      multiStoppedPerUnitRate,
      actualBasicCostFl,
      actualSurchargeCostFl,
      actualInsuranceCostFl,
      cancellationCostFl,
      updateAddressCostFl,
      reattemptCostFl,
      locationCostFl,
      taxCostFl,
      actualCODHandlingCostFl,
      actualAdditionalHandlingCostFl,
      profileType: routeContains('carrier') ? 'CARRIER' : 'OWNFLEET'
    };

    if (isEditMode) {
      payload["rateProfileId"] = rateProfileData?.rateProfileId;
    }

    dispatch({ type: "@@rateProfileForm/SET_LOADING", payload: true });

    try {
      const contructURL = isEditMode
        ? apiMappings.rateProfile.form.update
        : apiMappings.rateProfile.form.create;

      const { data: response } = isEditMode
        ? await axios.put(contructURL, payload)
        : await axios.post(contructURL, payload);

      if (!response.hasError) {
        dispatch({ type: "@@rateProfileForm/SET_LOADING", payload: false });
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "check-round",
          },
        });
        routeContains('carrier') ? hybridRouteTo('carrierRateProfile') : hybridRouteTo('deliveryAssociateRateProfile')
      }
    } catch (error: any) {
      dispatch({ type: "@@rateProfileForm/SET_LOADING", payload: false });
      if (error?.response?.data?.status === 428) {
        return;
      }

      toast.add(
        error?.response?.data?.error?.message?.[0] ||
          error?.response?.data?.message ||
          dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  const fetchRateProfileData = async (
    rateProfileId: string | number,
    duplicate: boolean
  ) => {
    setIsRateProfileLoading(true);
    try {
      const {
        data: { data, status },
      } = await axios.get<ILogiAPIResponse<IRateProfileData>>(
        `${apiMappings.rateProfile.form.getRateProfile}?profileId=${rateProfileId}`
      );

      if (status === 200) {
        dispatch({
          type: "@@rateProfileForm/SET_RATEPROFILE_DATA",
          payload: data,
        });

        const _resetData = {
          ...data,
          ...generateVehicleFormData(data, clientMetric, systemMetric),
          name: duplicate ? `${data?.name}_copy` : `${data?.name}`,
        };

        reset({ ..._resetData });
        dispatch({
          type: "@@rateProfileForm/SET_FORM_RESET_DATA",
          payload: _resetData,
        });
        setIsRateProfileLoading(false);
        setOriginalData({ ..._resetData });
      }
    } catch (error: any) {
      setIsRateProfileLoading(false);
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };


  return (
    <RateProfileWrapper>
      <FormWrapper formName="RateProfileChart">
        <div id="toast-inject-here"></div>

        <Box py="15px">
          <BreadCrumb
            options={breadCrumbOptions}
            onClick={handleBreadCrumbClick}
          />
        </Box>

        <Card
          style={{
            minHeight: "80vh",
            position: "relative",
            background: "white",
          }}
        >
          {isLoading && (
            <div ref={loaderRef}>
              <FormLoader />
            </div>
          )}

          {!isLoading && originalData &&
            sectionKeys.length > 0 &&
            sectionKeys.map((sectionName) => (
              <div key={sectionName}>
                <SectionHeaderContainer>
                  <SectionHeader headerTitle={sectionName} />
                </SectionHeaderContainer>
                {/* {sectionName == 'General Details' && 

                } */}
                <Grid container style={{ marginBottom: "15px" }}>
                  {Object.keys(structure[sectionName]).map(
                    (structureKey: any, index: number) => {
                      const meta = structure[sectionName][structureKey];

                      const {
                        // permission,
                        childLength,
                        childNodes,
                      } = meta;

                      if (childLength && childLength > 0) {
                        const formValues = getValues();
                        const toggleName =
                          Togglemapping?.[
                            structure[sectionName][structureKey].fieldName
                          ];

                        return (
                          <div style={{ width: "100%", display: "block" }}>
                            <Accordion
                              id={index.toString()}
                              expanded={expanded === index.toString()}
                              onToggle={handleToggle}
                              showToggleSwitch
                              isToggleChecked={formValues[toggleName] === "Y"}
                              onToggleSwitch={(e: any) =>
                                handleToggleChange(
                                  e,
                                  index.toString(),
                                  expanded === index.toString(),
                                  structure[sectionName][structureKey].fieldName
                                )
                              }
                            >
                              {{
                                header: (
                                  <>
                                    <AccordionHeaderTitle>
                                      {
                                        structure[sectionName][structureKey]
                                          .label
                                      }
                                    </AccordionHeaderTitle>
                                    <AccordionHeaderSubTitle>
                                      {
                                        structure[sectionName][structureKey]
                                          .descLabel
                                      }
                                    </AccordionHeaderSubTitle>
                                  </>
                                ),
                                content: (
                                  <AccordionContent
                                    className={
                                      formValues?.[toggleName] === "Y"
                                        ? ""
                                        : "AccordionContentDisable"
                                    }
                                  >
                                    {meta.fieldType === "groupRepeatable" ? (
                                      <GroupRepeatable
                                        data={childNodes}
                                        moduleName={meta.fieldName}
                                        formInstance={formInstance}
                                        originalData={originalData}
                                        currencySymbol={
                                          dynamicLabels[
                                            `${currencySymbol}`
                                          ]
                                        }
                                      />
                                    ) : meta.fieldType ===
                                      "childAsAccordion" ? (
                                      <LocationFees
                                        structure={
                                          structure[sectionName][structureKey]
                                        }
                                        formInstance={formInstance}
                                        dynamicLabels={dynamicLabels}
                                        parentObjectName={meta.fieldName}
                                        data2={originalData}
                                        currencySymbol={
                                          dynamicLabels[
                                            `${currencySymbol}`
                                          ]
                                        }
                                        data={data}
                                      ></LocationFees>
                                    ) : meta.id === "cancellation" ||
                                      meta.id === "reAttemptFee" ? (
                                      <MinimumCostHideShow
                                        structure={
                                          structure[sectionName][structureKey]
                                        }
                                        formInstance={formInstance}
                                        dynamicLabels={dynamicLabels}
                                        currencySymbol={dynamicLabels[
                                          `${currencySymbol}`
                                        ]}
                                      />
                                    ) : (
                                      childNodes &&
                                      Object.values(childNodes).map(
                                        (meta: any) => {
                                          return (
                                            <Grid
                                              item
                                              key={meta.fieldName}
                                              xs={12}
                                              sm={3}
                                              md={3}
                                              className="grid-item rateProfileForm"
                                              style={{ width: "inline-flex" }}
                                            >
                                              <RateProfileFormFieldWrapper
                                                meta={meta}
                                                formInstance={formInstance}
                                                currencySymbol={
                                                  dynamicLabels[
                                                    `${currencySymbol}`
                                                  ]
                                                }
                                                clientMetrics={systemMetric}
                                                dropdownOptions={dropdownOptions}
                                                data={data}
                                              />
                                            </Grid>
                                          );
                                        }
                                      )
                                    )}
                                    {meta?.fieldName === "basicCost" ? (
                                      <div
                                        style={{
                                          width: "100%",
                                          display: "block",
                                          fontSize: "12px",
                                          textTransform: 'initial'
                                        }}
                                      >
                                        Note: {dynamicLabels?.basicCostNote}
                                      </div>
                                    ) : meta?.fieldName === "taxMappings" && (
                                      <div
                                        style={{
                                          width: "100%",
                                          display: "block",
                                          fontSize: "12px",
                                          textTransform: 'initial'
                                        }}
                                      >
                                        Note: {dynamicLabels?.taxMappingsNote}
                                      </div>
                                    )}
                                  </AccordionContent>
                                ),
                              }}
                            </Accordion>
                            {/* {childNodes && Object.values(childNodes).map((fieldName) => {
                            return <div>{fieldName.fieldName}</div>
                          })} */}
                          </div>
                        );
                      } else {
                        return (
                          <Grid
                            item
                            key={structureKey}
                            xs={12}
                            sm={6}
                            md={3}
                            className="grid-item vehicleForm"
                          >
                            <FormField
                              name={structureKey}
                              meta={meta}
                              formInstance={formInstance}
                            />
                          </Grid>
                        );
                      }
                    }
                  )}
                </Grid>
              </div>
            ))}
          <Box horizontalSpacing="15px" display="flex" mt="30px">
            <IconButton
              iconVariant="icomoon-save"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              id='updateCarrierRateProfile--actionbar--save'
              primary
            >
              {isEditMode ? dynamicLabels.update : dynamicLabels.save}
            </IconButton>
            <IconButton
              iconVariant="icomoon-close"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              id='updateCarrierRateProfile--actionbar--cancel'
              onClick={() => {
                // gaOnCancel();
                handleBreadCrumbClick("rateProfile");
              }}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        </Card>
      </FormWrapper>
    </RateProfileWrapper>
  );
};

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(RateProfileForm)), "toast-inject-here")
);
