import React, { useEffect, Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import FormField from "../../../../../utils/components/Form/FormField";
import { Grid, useToast } from "ui-library";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { getGoogleAPIKey } from "../../../../../utils/components/Map/MapHelper";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormLoader from "../../../../../utils/components/FormLoader";
import AddressGeocodingComponent from "../../../../../utils/components/Form/AddressGeocodingComponent";
import SectionImageContainer from "../../../../OnboardingWrapper/OrganizationConfiguration/OrganizationProfile/SectionImageComponent";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import {
  IOrganizationProfileFormActions,
  IOrganizationData,
} from "../../../../OnboardingWrapper/OrganizationConfiguration/OrganizationProfile/OrganizationProfile.model";
import { tSearchFieldAddressInfo } from "../../../../../utils/components/Map/interface";
import { ILocalStorageEntries } from "../../../../OnboardingWrapper/BranchConfiguration/BranchConfiguration.models";
import AddressFieldWatchers from "../../../../OnboardingWrapper/OrganizationConfiguration/AddressFieldWatchers";
import {
  resetAddressFieldOnCountryChange,
  generateOrganizationProfileFormData,
  convertClientProperty,
} from "../../onboardingUtils";
import { useForm } from "react-hook-form";
import { deepCopy } from "../../../../../utils/helper";

const subTitleMapping = {
  "general details": {
    title: "General Details",
    subTitle: "Provide the logo and the legal name of your company.",
  },
  "admin details": {
    title: "Admin Details",
    subTitle:
      "Provide your details to explore the product features as an Admin user with all the permissions.",
  },
  "address details": {
    title: "Address Billing Details",
    subTitle:
      " Provide address details for billing/invoicing related communication.",
  },
  "system preferences": {
    title: "System Preferences",
    subTitle:
      "Specify the system settings to set up the product per your preferences.",
  },
};

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const OrgProfile = ({
  config,
  totalSteps,
  currentValues,
  // clientId,
  formInstance,
}: ISubComponentProps) => {
  const userAccessInfo: ILocalStorageEntries = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const [_currentValues, setCurrentValues] = useState<any>(currentValues)
  const _center =
    userAccessInfo?.["countryLatLng"]?.split(",") || FALLBACK_CENTER;
  const [isAddressFieldsTouched, setAddressFieldsTouched] =
    useState<boolean>(false);
  const [isMapSearched, setMapSearched] = useState<boolean>(false);
  const googleApiKey = getGoogleAPIKey();
  const [searchText, setSearchText] = useState<string>("");
  // const [selectedCountryId, setSelectedCountryId] = useState<any>();
  // const [googleCountryCodeData, setGoogleCountryCodeData] = useState<any>(null);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const [position, setPosition] = useState<Array<number>>([
    _center[0],
    _center[1],
  ]);
  const { setValue, reset, watch } = formInstance;
  console.log(formInstance.formState.isDirty); // make sure formState is read before render to enable the Proxy

  // Watchers
  const watchCountry = watch("countryId");

  /* Reducer State */
  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.settings.organizationProfile}`
  );
  const resetData = useTypedSelector(
    (state) => state.settings.organizationProfileForm.resetData
  );
  const profileData = useTypedSelector(
    (state) => state.settings.organizationProfileForm.organizationProfileData
  );
  const structure = useTypedSelector(
    (state) => state.settings.organizationProfileForm.structure
  );
  const loading = useTypedSelector(
    (state) => state.settings.organizationProfileForm.loading
  );
  const countryList = useTypedSelector(
    (state) => state.settings.organizationProfileForm.localeData
  );
  const sectionKeys = Object.keys(structure);
  const [imageURL, setImageURL] = useState<string>();

  /* Dispatch Actions here */
  const dispatch = useDispatch<Dispatch<IOrganizationProfileFormActions>>();

  /* Update address fields on geogle text search */
  const updateAddressFields = async (address: tSearchFieldAddressInfo) => {
   
    const selectedCountry = countryList?.find((o) => {
      return o["name"] === address.country?.toUpperCase();
    });
    await resetAddressFieldOnCountryChange(
      selectedCountry,
      structure,
      setValue,
      dispatch
    );
    formInstance.clearErrors(['countryId','stateId','apartment','streetName','landmark','locality','city','zipCode']);
    setValue("countryId", {
      id: selectedCountry && selectedCountry?.["id"],
      name: address?.country,
    });
    setValue("stateId", { id: 1, name: address?.state });
    setValue("apartment", address?.apartment);
    setValue("streetName", address?.streetName);
    setValue("landmark", address?.landMark);
    setValue("locality", address?.locality);
    setValue("city", address?.city);
    setValue("zipCode", {
      id: selectedCountry && selectedCountry?.["id"],
      pincode: address?.pincode,
      name: address?.pincode,
    });
  };

  const populateMapAddress = (address: tSearchFieldAddressInfo) => {
    setMapSearched(address?.isPropSearch);
    if (Object.keys(address).length > 0 && address?.isPropSearch) {
      updateAddressFields(address);
      setPosition(address.position);
    }
  };

  /**
   * Reset form 
   */
   const resetFormData = (data) => {
    dispatch({
      type: "@@organizationProfileForm/SET_LOADING",
      payload: true,
    });
    const _resetData = {
      ...resetData,
      ...generateOrganizationProfileFormData(data, countryList),
    };
    reset({..._resetData});
    dispatch({
      type: "@@organizationProfileForm/SET_FORM_RESET_DATA",
      payload: {..._resetData},
    });
    dispatch({
      type: "@@organizationProfileForm/SET_LOADING",
      payload: false,
    });
  }

  /**
   * Set Prevoius Data
   */
  const setExistingData = () => {
    let data;
    if(currentValues && currentValues?.answerData) {
      const formData = JSON.parse(currentValues?.answerData);
      const clientPropertiesMapping = convertClientProperty(
        formData.clientProperties
      );
      data = {
        ...formData.clientMaster,
        uploadLogo: formData.clientMaster.logoImagePath,
        ...clientPropertiesMapping,
      };
      
    }
    resetFormData(data)
  }

  /**
   * Fetch client profile data
   */
  const fetchClientData = async () => {
    dispatch({
      type: "@@organizationProfileForm/SET_LOADING",
      payload: true,
    });
    try {
      let response: IOrganizationData;
      let userToken = localStorage.getItem("guid");
      const { data }: any = await axios.get<any>(
        `${apiMappings.saas.clientOnboarding.getProfile}?guid=${userToken}`
      );
      response = {
        ...data,
        uploadLogo:
          JSON.parse(localStorage.getItem("userAccessInfo") || "")[
            "clientLogo"
          ] || "",
      };
      dispatch({
        type: "@@organizationProfileForm/SET_PROFILE_DATA",
        payload: response,
      });
      if (response) {
        resetFormData(response)
      }
    } catch (error: any) {
      dispatch({
        type: "@@organizationProfileForm/SET_LOADING",
        payload: false,
      });
      // setIsDataLoading(false);
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  /**
   * Set Image
   */
  const onImageChange = (data) => {
    data && setImageURL(data)
    setValue('uploadLogo', data)
    if(data) localStorage.setItem('uploadLogo', data)
  }

  // Onload
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({
        type: "@@organizationProfileForm/FETCH_STRUCTURE",
        payload: { config },
      });
    }
    if(!countryList){
      dispatch({ type: "@@organizationProfileForm/FETCH_LOCALE" });
    }
    if(currentValues && currentValues?.answerData){
      setExistingData();
    }
    if(!(currentValues && currentValues?.answerData)){
      fetchClientData();
    }
  }, [countryList, currentValues]);

  useEffect(() => {
    (async function () {
    if (Object.values(structure).length && watchCountry && !isMapSearched) {
      await resetAddressFieldOnCountryChange(
        watchCountry,
        structure,
        setValue,
        dispatch
      );
      formInstance.clearErrors(['stateId','apartment','streetName','landmark','locality','city','zipCode']);
      if(_currentValues && _currentValues.answerData && JSON.parse(_currentValues.answerData).clientMaster.country === watchCountry.name){
        let currentData = JSON.parse(_currentValues.answerData).clientMaster
        setValue("stateId", { id: 1, name: currentData?.state });
        setValue("apartment", currentData?.apartment);
        setValue("streetName", currentData?.streetName);
        setValue("landmark", currentData?.landmark);
        setValue("locality", currentData?.locality);
        setValue("city", currentData?.city);
        setValue("zipCode", {
          id: currentData && currentData?.countryId,
          pincode: currentData?.zipCode || currentData?.pincode,
          name: currentData?.zipCode || currentData?.pincode,
        });
        setCurrentValues('')
      }else if(profileData && profileData.countryName === watchCountry.name){
        setValue("stateId", { id: 1, name: profileData?.stateName });
        setValue("apartment", profileData?.apartment);
        setValue("streetName", profileData?.streetName);
        setValue("landmark", profileData?.landmark || '');
        setValue("locality", profileData?.locality || '');
        setValue("city", profileData?.city || '');
        setValue("zipCode", {
          id: profileData && profileData?.countryId,
          pincode: profileData?.zipCode || profileData?.pincode || '',
          name: profileData?.zipCode || profileData?.pincode || '',
        });
        dispatch({
          type: "@@organizationProfileForm/SET_PROFILE_DATA",
          payload: undefined,
        });
      }
    }
    })()
   
  }, [watchCountry]);

  return (
    <>
      <AddressFieldWatchers
        formInstance={formInstance}
        structure={structure}
        setSearchText={setSearchText}
        isMapSearched={isMapSearched}
        isAddressFieldsTouched={isAddressFieldsTouched}
      />
      <div className="card__selection__block">
        <div className="step__text">
          Step {config?.stepId - 1} of {totalSteps - 1}
        </div>
        <div className="form__control">
          {loading && (
            <div ref={loaderRef}>
              <FormLoader />
            </div>
          )}
          {!loading &&
            Object.keys(structure) &&
            Object.keys(structure).map((sectionName) => {
              if (sectionName === "general details") {
                if (userAccessInfo.planType !== "TRIAL") {
                  structure[sectionName].name["editable"] = false;
                }
                return (
                  <div key={sectionName}>
                    <h4>{subTitleMapping[sectionName]?.title}</h4>
                    <p>{subTitleMapping[sectionName]?.subTitle}</p>
                    <Grid
                      container
                      spacing="0px"
                      style={{ marginBottom: "15px" }}
                    >
                      <SectionImageContainer
                        fieldNames={structure[sectionName]}
                        formInstance={formInstance}
                        clientName={resetData?.name}
                        setImageURL={onImageChange}
                        isClientOnboarding={true}
                        imageCaption={`<span>Best fit : 160px x 35px</span><span> Maximum file size : 100 kb.</span><span>Supported Formats : JPEG & PNG</span>`}
                      />
                    </Grid>
                  </div>
                );
              } else {
                return (
                  <div key={sectionName} className={sectionName}>
                    <h4>{subTitleMapping[sectionName]?.title}</h4>
                    <p>{subTitleMapping[sectionName]?.subTitle}</p>
                    <Grid
                      container
                      spacing="0px"
                      style={{ marginBottom: "15px" }}
                    >
                      {Object.keys(structure[sectionName]).map((fieldName) => {
                        const meta = structure[sectionName][fieldName];
                        meta.multipleFiles = false;

                        const { permission, fieldType, childNodes } = meta;
                        if (!permission) {
                          return undefined;
                        }

                        if (fieldName === "emailAddress") {
                          meta.editable = false;
                        }
                        if (fieldName === "name") {
                          meta.editable = false;
                        }
                        if (fieldName === "timezone") {
                          meta.lookupType = "getTimezoneList";
                        }

                        if (fieldType === "address" && childNodes) {
                          return (
                            <AddressGeocodingComponent
                              childNodes={childNodes}
                              setMapSearched={setMapSearched}
                              setAddressFieldsTouched={setAddressFieldsTouched}
                              countryKey="countryId"
                             // getCountryChange={getCountry}
                              formInstance={formInstance}
                              setPosition={setPosition}
                              position={position}
                              searchText={searchText}
                              sx={{ marginTop: "2rem" }}
                              googleApiKey={googleApiKey}
                              populateMapAddress={populateMapAddress}
                              type="organizationProfile"
                              settingAPIParam="organisationProfileGeocodeMap"
                              legendConfig={{ rulerControl: false }}
                              isVisibleSetting={false}
                            />
                          );
                        }
                        if (sectionName === "billingDetails") {
                          meta.editable = false;
                          meta.required = false;
                        }

                        const metricSystemOptions = [
                          {
                            id: "IMPERIALSYSTEM",
                            label:
                              "Imperial System (ml, mph, lb, cubic inches, inches)",
                            value: "IMPERIALSYSTEM",
                            title:
                              "Imperial System (ml, mph, lb, cubic inches, inches)",
                            description:
                              "Imperial System (ml, mph, lb, cubic inches, inches)",
                          },
                          {
                            id: "METRICSYSTEM",
                            label: "Metric System (km, kmph, kg, cc, cm)",
                            value: "METRICSYSTEM",
                            title: "Metric System (km, kmph, kg, cc, cm)",
                            description: "Metric System (km, kmph, kg, cc, cm)",
                          },
                          {
                            id: "USCUSTOMARYSYSTEM",
                            label:
                              "US Customary System (ml, mph, lb, cubic inches, inches)",
                            value: "USCUSTOMARYSYSTEM",
                            title:
                              "US Customary System (ml, mph, lb, cubic inches, inches)",
                            description:
                              "US Customary System (ml, mph, lb, cubic inches, inches)",
                          },
                        ];

                        return (
                          <Grid
                            item
                            key={fieldName}
                            xs={12}
                            sm={6}
                            md={3}
                            className="grid-item"
                          >
                            <FormField
                              name={fieldName}
                              meta={meta}
                              options={
                                fieldName === "metricSystem" &&
                                metricSystemOptions
                              }
                              formInstance={formInstance}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </>
  );
};

export default OrgProfile;
