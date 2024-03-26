import React, { useState, Dispatch, useEffect, useMemo } from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import {
  AdvancedFieldIcon,
  FormFieldWapper,
  SectionHeaderContainer,
} from "../../BranchConfigurationStyledComponents";
import {
  Grid,
  SectionHeader,
  FontIcon,
  Box,
  // TextInput,
  // Modal,
  // ModalHeader,
} from "ui-library";
import AddBranchFormManagerDetails from "./AddBranchFormManagerDetails";
import FormField from "../../../../../utils/components/Form/FormField";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { UseFormMethods, useWatch } from "react-hook-form";
import { generateRankList } from "../../utils";
import { deepCopy } from "../../../../../utils/helper";
import { useDispatch } from "react-redux";
import { BranchConfigurationActions } from "../../BranchConfiguration.actions";
import AddressGeocodingComponent from "../../../../../utils/components/Form/AddressGeocodingComponent";
import LoadMultiplierPopup from './LoadMultiplierPopup'
import useDebounce from "../../../../../utils/useDebounce";
import { ICircle } from "../../../../../utils/components/Map/interface";
import useClientProperties from "../../../../common/ClientProperties/useClientProperties";
import { Map } from "leaflet"
import { isValidLatitude, isValidLongitude, getCircleBounds } from "../../../../../utils/components/Map/MapHelper";


// const ServiceArea = React.lazy(() => import(/* webpackChunkName: "CarrierServiceAreaProfile" */ './ServiceArea'));
interface IAddBranchFormFieldsProps {
  formInstance: UseFormMethods<Record<string, any>>;
  handleShiftTimings: Function;
  handleRemoveBranchManager: Function;
  searchText: string;
  handleOperationTimings: Function;
  handleAddBranchManager: Function;
  dispatchBranchManagerStructure: Function;
  dispatchShiftTimingsStructure: Function;
  setBranchManagerTouched: Function;
  setManagerDetails: Function;
  handleAddShiftTimings: Function;
  populateMapAddress: Function;
  position: Array<number>;
  setPosition: (latLogObj: any) => any;
  setAddressFieldsTouched: Function;
  setMapSearched: (value: boolean) => void;
  isEditMode: boolean;
  loadMultiplierRequiredError?:boolean;
  vendorData: any;
  currentCordinates?: Array<number>
  setCurrentCordinates?: (value: Array<number>) => void;
}

const AddBranchFormFields = (props: IAddBranchFormFieldsProps) => {
  const {
    formInstance,
    handleShiftTimings,
    handleRemoveBranchManager,
    searchText,
    handleAddBranchManager,
    handleOperationTimings,
    dispatchBranchManagerStructure,
    dispatchShiftTimingsStructure,
    setBranchManagerTouched,
    setManagerDetails,
    handleAddShiftTimings,
    populateMapAddress,
    position,
    setPosition,
    setAddressFieldsTouched,
    setMapSearched,
    isEditMode,
    loadMultiplierRequiredError,
    vendorData,
    currentCordinates,
    setCurrentCordinates
  } = props;

  const structure = useTypedSelector(
    (state) => state.branchConfiguration.form.structure
  );
  const sectionKeys = Object.keys(structure);
  // const clientBranchDetails = useTypedSelector((state) => state.branchConfiguration.clientBranchDetails);

  const [advancedFields, setAdvanceFieldsVisible] = useState<boolean>(false);
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.branchConfiguration
  );
  const googleApiKey = useTypedSelector(
    (state) => state.branchConfiguration.googleApiKey
  );
  const clientBranchDetails = useTypedSelector(
    (state) => state.branchConfiguration.clientBranchDetails
  );

  const dispatch = useDispatch<Dispatch<BranchConfigurationActions>>();

  // const [showLoadMultiplierModal, setShowLoadMultiplierModal] = useState(false);

  const { watch ,getValues ,errors , clearErrors, control, setValue} = formInstance;

  const watchPhoneNumber: string | undefined = useWatch({control, name: 'mobileNumber'});
  const { radiusInKms } = watch();
  const debouncedRadius = useDebounce(radiusInKms, 400);
  const initialCircleData: ICircle = {
    permission: true,
    popupRef: "",
    toolTipKey: "tooltipValue",
    radiusKey: "radiusInKms",
    center: ["latitude", "longitude"],
    data: [],
  }

  const [mapProps, setMapProps] = useState<Map>({} as Map);
  const [circleData, setCirleData] = useState<ICircle>(initialCircleData);
  const clientProperties = useClientProperties(["DISTANCE"]);
  let preferredUnit = clientProperties?.DISTANCE?.propertyValue;

  useEffect(() => {
    if (currentCordinates?.[0] && isValidLatitude(currentCordinates?.[0]) && currentCordinates?.[1] && isValidLongitude(currentCordinates?.[1])) {
      setTimeout(() => {
        setCirleData({
          ...circleData, data: debouncedRadius > 0 ? [{
            centerCords: `POINT(${currentCordinates?.[0]} ${currentCordinates?.[1]})`,
            shapeTypeCode: "CIRCLE",
            tooltipValue: `Radius: ${debouncedRadius} ${preferredUnit?.toLowerCase()}`,
            radiusInKms: preferredUnit === "KM" ? debouncedRadius : debouncedRadius * 1.60934,
            latitude: Number(currentCordinates?.[0]),
            longitude: Number(currentCordinates?.[1]),
          }] : []
        });
        if (debouncedRadius > 0) handleChangeCirclePosition(currentCordinates);
      }, 300);
    }
  }, [debouncedRadius, currentCordinates]);

  useEffect(() => {
    if(isEditMode) return;
    if (structure && Object.keys(structure).length > 0 && structure['hub manager']?.['whatsappOptin']?.permission) {
      setValue('whatsappOptin', 'N');
    }
  }, [structure])

  const handleChangeCirclePosition = (position: Array<number>) => {
    const radiusInMtrs = debouncedRadius * 1000;
    const bounds = getCircleBounds(radiusInMtrs, Number(position[0]), Number(position[1]));
    mapProps?.fitBounds(bounds, { padding: [100, 100] });
  }

  const updateAdvancedFormStructure = () => {
    if (
      isEditMode &&
      clientBranchDetails &&
      clientBranchDetails?.clientBranchAccountDTO &&
      Object.keys(clientBranchDetails?.clientBranchAccountDTO)?.includes(
        "walletEnabled"
      )
    ) {
      const newStructure = deepCopy(structure);
      if (Object.keys(newStructure).length > 0) {
        setTimeout(() => {
          newStructure["wallet details"]["walletId"].permission =
            clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
          newStructure["wallet details"]["minBalance"].permission =
            clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
          newStructure["wallet details"]["minWithdrawableAmount"].permission =
            clientBranchDetails?.clientBranchAccountDTO?.walletEnabled;
          dispatch({
            type: "@@branchConfiguration/FETCH_BRANCH_FORM_STRUCTURE_SUCCESS",
            payload: newStructure,
          });
        }, 100);
      }
    }
  };

  const showSection = (obj:any) => {
     const flag = Object.values(obj)?.some((element:any) => element?.permission)
      return flag
  }
     const cashTransactionFlWatcher = watch("cashTransactionFl");
     const signatureVerificationFlWatcher = watch("signatureVerificationFl");
    //Uber integration Start Here
 
    
  const validate = () => {
    if (getValues('minOrderValue') && getValues('maxOrderValue')) {
      if (parseInt(getValues('minOrderValue')) >= parseInt(getValues('maxOrderValue'))) {
        return  dynamicLabels.minOrderValue_customBranchValidation || "The minimum order value cannot exceed or be equal to the maximum order value"
      } else{
        clearErrors("minOrderValue");
      }
    
     
     if(parseInt(getValues('maxOrderValue')) <= parseInt(getValues('minOrderValue'))){
        return  dynamicLabels.maxOrderValue_customBranchValidation || "The maximum order value cannot be lesser than or equal to the minimum order value" 
         } else{
          clearErrors("maxOrderValue");
         }
      

      
      if ((getValues('discardValue') && getValues('maxOrderValue')  && parseInt(getValues('discardValue')) > parseInt(getValues('maxOrderValue'))) || (getValues('discardValue') &&   getValues('minOrderValue') && parseInt(getValues('discardValue')) < parseInt(getValues('minOrderValue')))
      ) {
        return dynamicLabels.discardValue_customBranchValidation || "The Rejectable Order Limit must be a value between the values defined in Minimum Order Value and Maximum Order Value fields"
      } else{
        clearErrors("discardValue");
      }

    }
    return true
  }

  console.log(errors,'errorserrors')
  //Uber integration end Here

  const whatsappOptinDetails = useMemo(() => {
    return structure?.['hub manager']?.['whatsappOptin'] ?? null;
  }, [structure]);

  const editable = (watchPhoneNumber && watchPhoneNumber?.length > 0) as boolean;
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranchManagerTouched(true); 
    const { value } = e.target;
    if (value?.length === 0) {
      setValue('whatsappOptin', 'N')
    }
  }

  
  return (
    <>
      {sectionKeys.length > 0 &&
        sectionKeys.map((sectionName) => (
          <div key={sectionName}>
            {sectionName === "wallet details" ||
              (sectionName === "bank details" && (
                <AdvancedFieldIcon
                  onClick={() => {
                    if (
                      isEditMode &&
                      clientBranchDetails?.clientBranchAccountDTO?.walletEnabled
                    ) {
                      updateAdvancedFormStructure();
                    }
                    setAdvanceFieldsVisible(!advancedFields);
                  }}
                >
                  <FontIcon
                    variant={advancedFields ? "icomoon-minus" : "icomoon-add"}
                    size={13}
                  />
                  <span>{dynamicLabels.advanced}</span>
                </AdvancedFieldIcon>
              ))}

            {sectionName === "wallet details" ||
              sectionName === "bank details" || sectionName === "ETA details" ? (
              advancedFields && (
                sectionName === "ETA details" &&
                !showSection(structure[sectionName]) ? 
                  <></>
                 : <SectionHeaderContainer>
                  <SectionHeader headerTitle={dynamicLabels[sectionName]} />
                </SectionHeaderContainer>
              )
            ) : (
              Object.keys(structure?.[sectionName])?.filter(fieldKey => structure[sectionName][fieldKey]?.permission)?.length > 0 && <SectionHeaderContainer>
                <SectionHeader headerTitle={dynamicLabels[sectionName]} />
              </SectionHeaderContainer>
            )}

            <Grid container spacing="15px" style={{ marginBottom: "15px" }}>
              {sectionName === "branchManagerDetails" && (
                <>
                  <AddBranchFormManagerDetails
                    formInstance={formInstance}
                    handleShiftTimings={handleShiftTimings}
                    handleRemoveBranchManager={handleRemoveBranchManager}
                    handleAddBranchManager={handleAddBranchManager}
                    dispatchBranchManagerStructure={
                      dispatchBranchManagerStructure
                    }
                    dispatchShiftTimingsStructure={
                      dispatchShiftTimingsStructure
                    }
                    setBranchManagerTouched={setBranchManagerTouched}
                    setManagerDetails={setManagerDetails}
                    handleAddShiftTimings={handleAddShiftTimings}
                  />
                </>
              )}

              {Object.keys(structure[sectionName]).map((fieldName, index:number) => {
                const meta = structure[sectionName][fieldName];
                meta.multipleFiles = false;
                const { permission, fieldType, childNodes, id } = meta;


                if (!permission || fieldName === 'whatsappOptin') {
                  return undefined;
                }

                if(fieldName === "discardValue" ){
                  meta.icon = "icomoon-warning-circled";
                  meta.message = "Orders with values lower than or equal to this threshold can be discarded by drivers (instead of initiating returns) if not fulfilled"
                }
                if (sectionName === "branchManagerDetails") {
                  return;
                } else {
                  if (fieldType === "address" && childNodes) {
                    return (
                      <AddressGeocodingComponent
                        key="AddressGeocoding"
                        childNodes={childNodes}
                        setMapSearched={setMapSearched}
                        setAddressFieldsTouched={setAddressFieldsTouched}
                        formInstance={formInstance}
                        setPosition={setPosition}
                        position={position}
                        searchText={searchText}
                        googleApiKey={googleApiKey}
                        populateMapAddress={populateMapAddress}
                        type="branch"
                        settingAPIParam="addClientBranchMap"
                        isEditMode={isEditMode}
                        setCurrentCordinates={setCurrentCordinates}
                        setMapProps={setMapProps}
                        circle={circleData}
                        updateShapeBasedOnPosition={true}
                      />
                    );
                  }

                  if (fieldName === "operationsTiming") {
                    meta["fieldType"] = "textWithIcon";
                    meta["iconVariant"] = "icomoon-add";
                    meta["iconSize"] = 13;
                    return (
                      <Grid
                        spacing="15px"
                        item
                        key={fieldName}
                        xs={12}
                        sm={3}
                        md={3}
                        className="grid-item"
                      >
                       
                        <FormField
                          name={fieldName}
                          meta={meta}
                          formInstance={formInstance}
                          handler={handleOperationTimings}
                         
                        />
                      </Grid>
                    );
                  }

                  if (fieldName === "rank") {
                    meta["dropdownValues"] = generateRankList();
                    meta["customField"] = true;
                    return (
                      <Grid
                        spacing="15px"
                        item
                        key={fieldName}
                        xs={12}
                        sm={3}
                        md={3}
                        className="grid-item"
                      >
                        <FormField
                          name={fieldName}
                          meta={meta}
                          formInstance={formInstance}
                        />
                      </Grid>
                    );
                  }

                if (
                  fieldName === 'minOrderValue' ||
                  fieldName === 'maxOrderValue' ||
                  fieldName === "discardValue"
                ) {
                  return cashTransactionFlWatcher === 'Y' &&
                    meta['permission'] && (
                    <Grid
                      spacing="15px"
                      item
                      key={fieldName}
                      xs={12}
                      sm={3}
                      md={3}
                      className="grid-item"
                    >
                      <FormFieldWapper>
                        <FormField
                          name={fieldName}
                          meta={meta}
                          timeInterval={15}
                          formInstance={formInstance}
                          validate={validate}
                        />
                      </FormFieldWapper>
                    </Grid>
                  )
                }

                if (fieldName === 'signerInfo' ){
                  return signatureVerificationFlWatcher === 'Y' &&
                    meta['permission'] && (
                    <Grid
                      spacing="15px"
                      item
                      key={fieldName}
                      xs={12}
                      sm={3}
                      md={3}
                      className="grid-item"
                    >
                      <FormFieldWapper>
                        <FormField
                          name={fieldName}
                          meta={meta}
                          timeInterval={15}
                          formInstance={formInstance}
                          validate={validate}
                        />
                      </FormFieldWapper>
                    </Grid>
                  )
                }


                  if (id === "clientid") {
                    return (
                      <Grid
                        spacing="15px"
                        item
                        key={fieldName}
                        xs={12}
                        sm={3}
                        md={3}
                        className="grid-item"
                      >
                        <FormField
                          name={fieldName}
                          meta={meta}
                          formInstance={formInstance}
                        />
                      </Grid>
                    );
                  }

                  if (
                    sectionName === "wallet details" ||
                    sectionName === "bank details" ||
                    sectionName === "ETA details"
                  ) {
                    if (advancedFields) {
                      if (fieldType === "loadMultipliersTextInput") {
                        return (
                          <Grid
                          spacing={10}
                          item
                          xs={4}
                          sm={4}
                          md={4}
                          className="grid-item"
                        >
                          <LoadMultiplierPopup
                            formInstance={formInstance}
                            structure={meta}
                            name={meta.fieldName}
                            clientData={clientBranchDetails}
                            messagePlacement={index === 0 ? "start" : "center"}
                            loadMultiplierRequiredError={loadMultiplierRequiredError}
                          />
                          </Grid>
                        );
                      } else {
                        let metaObj = meta
                        if(sectionName === "ETA details") {
                          metaObj.removeDecimal = true
                  
                        }
                        if (fieldName === "walletEnabled") {
                          const metaObj = {...meta}
                          metaObj["options"] = ["Yes", "No"];
                          return (
                            <Grid
                              spacing="15px"
                              item
                              key={fieldName}
                              xs={12}
                              sm={3}
                              md={3}
                              className="grid-item"
                            >
                              <FormField
                                name={fieldName}
                                meta={metaObj}
                                formInstance={formInstance}
                              />
                            </Grid>
                          );
                        }
                        return (
                          <Grid
                            spacing={10}
                            item
                            xs={4}
                            sm={4}
                            md={4}
                            className="grid-item"
                          >
                            <FormField
                              name={fieldName}
                              meta={metaObj}
                              formInstance={formInstance}
                              messagePlacement={index === 0 ? "start" : "center"}
                            />
                          </Grid>
                       )
                      }


                    } else {
                      return;
                    }
                  }
                  if (sectionName === "additional information") {
                    if (fieldType === "radio") {
                      meta["options"] = ["Yes", "No"];
                    }
                    return (
                      <Grid
                        spacing="15px"
                        item
                        key={fieldName}
                        xs={12}
                        sm={3}
                        md={3}
                        className="grid-item"
                        style={{ width: "100%" }}
                      >
                        <FormField
                          name={fieldName}
                          meta={meta}
                          formInstance={formInstance}
                        />
                      </Grid>
                    );
                  }
                   
                  
                
                  if (fieldType === "toggleBox" || fieldType === "checkbox") {
                    return (
                      <Grid
                        item
                        key={fieldName}
                        xs={12}
                        sm={6}
                        md={3}
                        className="grid-item toggle-item"
                        style={{ display: "flex" }}
                      >
                        <FormFieldWapper>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance}
                          />
                        </FormFieldWapper>
                      </Grid>
                    );
                  }
                  if(meta.id === "vendorName" && vendorData?.name){
                    const defVal = {label : vendorData?.name, value : vendorData?.name, id: vendorData?.clientCoLoaderId}
                    return (
                      <Grid
                        item
                        key={fieldName}
                        xs={12}
                        sm={6}
                        md={3}
                        className="grid-item"
                      >
                        <FormFieldWapper>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            timeInterval={15}
                            formInstance={formInstance}
                            defaultValue={defVal}
                          />
                        </FormFieldWapper>
                      </Grid>
                    );
                  }
                  return (
                    <Grid
                      item
                      key={fieldName}
                      xs={12}
                      sm={6}
                      md={3}
                      className="grid-item"
                    >
                      <FormFieldWapper>
                        {
                          fieldName === 'mobileNumber' ? (
                            <>
                              <FormField
                                name={fieldName}
                                meta={meta}
                                timeInterval={15}
                                formInstance={formInstance}
                                onChange={handlePhoneNumberChange}
                              />
                              {'whatsappOptin' && whatsappOptinDetails?.permission ? (
                                <Box mt='-5px' mb='8px' className='whatsapp-checkbox-wrapper'>
                                  <FormField
                                    name={whatsappOptinDetails.id}
                                    meta={{ ...whatsappOptinDetails,editable }}
                                    formInstance={formInstance}
                                  />
                                </Box>
                              ) : null}
                            </>
                          ) : (
                            <FormField
                              name={fieldName}
                              meta={meta}
                              timeInterval={15}
                              formInstance={formInstance}
                            />
                          )
                        }
                      </FormFieldWapper>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </div>
        ))}
    </>
  );
};

export default AddBranchFormFields;
