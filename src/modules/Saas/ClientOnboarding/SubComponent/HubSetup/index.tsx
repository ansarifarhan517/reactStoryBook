import React, { useEffect, useState, Dispatch } from "react";
import { useDispatch } from "react-redux";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import { IHubSetupFormActions, IHubSetupData } from "./HubSetup.model";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormLoader from "../../../../../utils/components/FormLoader";
import FormField from "../../../../../utils/components/Form/FormField";
import { ILocalStorageEntries } from "../../../../OnboardingWrapper/BranchConfiguration/BranchConfiguration.models";
import { getGoogleAPIKey } from "../../../../../utils/components/Map/MapHelper";
import AddressGeocodingComponent from "../../../../../utils/components/Form/AddressGeocodingComponent";
import { tSearchFieldAddressInfo } from "../../../../../utils/components/Map/interface";
import { Grid } from "ui-library";
import AddressFieldWatchers from "../../../../OnboardingWrapper/OrganizationConfiguration/AddressFieldWatchers";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import { resetAddressFieldOnHubCountryChange } from "../../onboardingUtils";

const subTitleMapping = {
  "general details": {
    title: "General Details",
    subTitle:
      "Provide the name of your Main Branch. This can't be changed later.",
  },
  address: {
    title: "Address",
    subTitle:
      "Provide the postal address of your Main Branch. This information is critical for the allocation, processing and distribution of orders.",
  },
  "hub manager": {
    title: "Branch Admin Details",
    subTitle:
      "Provide the details of the key person in charge of managing the day-to-day logistics operations at your Main Branch. Specific order updates can be sent as alerts at the contact details you provide here.",
  },
};

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const HubSetup = ({
  config,
  totalSteps,
  currentValues,
  formInstance,
}: ISubComponentProps) => {
  const userAccessInfo: ILocalStorageEntries = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const _center =
    userAccessInfo?.["countryLatLng"]?.split(",") || FALLBACK_CENTER;

  const [isAddressFieldsTouched, setAddressFieldsTouched] =
    useState<boolean>(false);
  const [isMapSearched, setMapSearched] = useState<boolean>(false);
  const [_currentValues, setCurrentValues] = useState<any>(currentValues);
  const googleApiKey = getGoogleAPIKey();
  const [searchText, setSearchText] = useState<string>("");
  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  // const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<Array<number>>([
    _center[0],
    _center[1],
  ]);

  const structure = useTypedSelector(
    (state) => state.saas.hubSetupForm.structure
  );
  const loading = useTypedSelector((state) => state.saas.hubSetupForm.loading);

  const resetData = useTypedSelector(
    (state) => state.saas.hubSetupForm.resetData
  );

  const countryList = useTypedSelector(
    (state) => state.saas.hubSetupForm.localeData
  );

  const sectionKeys = Object.keys(structure);

  const { setValue, reset, watch, register } = formInstance;

  // register latitude and longitude
  register("latlng", position);

  // Watchers
  const watchCountry = watch("country");

  const dispatch = useDispatch<Dispatch<IHubSetupFormActions>>();

  const generateHubProfileFormData = (data: IHubSetupData, countryListData) => {
    const { country, state, zipCode = "" } = data;
    const selectedCountry = countryListData?.find((o) => {
      return o["name"] === country?.toLocaleUpperCase();
    });
    return {
      ...data,
      stateId: state
        ? {
            id: 1,
            name: state,
          }
        : undefined,
      country: country
        ? {
            id: selectedCountry && selectedCountry?.["id"],
            name: selectedCountry && selectedCountry?.["name"],
            displayName: selectedCountry && selectedCountry?.["displayName"],
            code: selectedCountry && selectedCountry?.["code"],
            googleCountryCode:
              selectedCountry && selectedCountry?.["googleCountryCode"],
          }
        : undefined,
      zipCode: zipCode
        ? {
            id: zipCode,
            name: zipCode,
            pincode: zipCode,
          }
        : undefined,
    };
  };

  const updateAddressFields = async (address: tSearchFieldAddressInfo) => {
    const selectedCountry = countryList?.find((o) => {
      return o["name"] === address.country?.toUpperCase();
    });
    await resetAddressFieldOnHubCountryChange(
      selectedCountry,
      structure,
      setValue,
      dispatch
    );
    formInstance.clearErrors([
      "country",
      "stateId",
      "apartment",
      "streetName",
      "landmark",
      "locality",
      "city",
      "zipCode",
    ]);
    setValue("country", {
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
      setValue('latlng', address.position)
    }else if(Object.keys(address).length > 0){
      setPosition(address.position);
      setValue('latlng', address.position)
    }
  };

  /**
   * Set Prevoius Data
   */
  const setExistingData = () => {
    let data;
    if (currentValues && currentValues?.answerData) {
      const formData = JSON.parse(currentValues?.answerData);
      data = formData;
    }
    if(data && data.lat && data.lng){
      setPosition([data.lat, data.lng])
    }
    resetFormData(data);
  };

  /**
   * Reset form
   */
  const resetFormData = (data) => {
    dispatch({
      type: "@@hubSetupForm/SET_LOADING",
      payload: true,
    });
    const _resetData = {
      ...resetData,
      ...data,
      ...generateHubProfileFormData(data, countryList),
    };
    reset(_resetData);
    dispatch({
      type: "@@hubSetupForm/SET_FORM_RESET_DATA",
      payload: _resetData,
    });
    dispatch({
      type: "@@hubSetupForm/SET_LOADING",
      payload: false,
    });
  };

  /**
   * Fetch client profile data
   */
  const fetchData = async () => {
    dispatch({
      type: "@@hubSetupForm/SET_LOADING",
      payload: true,
    });
    try {
      let response: IHubSetupData;
      let userToken = localStorage.getItem("guid");
      const { data }: any = await axios.get<any>(
        `${apiMappings.saas.clientOnboarding.getProfile}?guid=${userToken}`
      );
      response = { ...data, name: "" };
      dispatch({
        type: "@@hubSetupForm/SET_PROFILE_DATA",
        payload: response,
      });
      if (response) {
        const _resetData = {
          ...resetData,
          ...response,
        };
        reset(_resetData);
        setValue("adminContactName", response.adminContactName);
        setValue("mobileNumber", response.mobileNumber);
        setValue("emailAddress", response.emailAddress);
        setValue("stateId", "");
        setValue("apartment", "");
        setValue("country", "");
        setValue("streetName", "");
        setValue("landmark", "");
        setValue("locality", "");
        setValue("city", "");
        setValue("zipCode", "");
        setValue("name", "");
        dispatch({
          type: "@@hubSetupForm/SET_LOADING",
          payload: false,
        });
      }
    } catch (error) {
      dispatch({
        type: "@@hubSetupForm/SET_LOADING",
        payload: false,
      });
    }
  };

  // Onload
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({
        type: "@@hubSetupForm/FETCH_STRUCTURE",
      });
    }
    if (!countryList) {
      dispatch({ type: "@@hubSetupForm/FETCH_LOCALE" });
    }
    if (currentValues && currentValues?.answerData) {
      setExistingData();
    }
    if (!(currentValues && currentValues?.answerData)) {
      fetchData();
    }
    // return(()=>{
    //   formInstance.reset()
    // })
  }, [countryList, currentValues]);

  useEffect(() => {
    (async function () {
      let countryName = "";
      if (Object.values(structure).length && watchCountry && !isMapSearched) {
        await resetAddressFieldOnHubCountryChange(
          watchCountry,
          structure,
          setValue,
          dispatch
        );
        // check if the watch country from different object
        if (watchCountry && typeof watchCountry === "string") {
          countryName = watchCountry.toLocaleUpperCase();
        } else if (watchCountry && watchCountry.name) {
          countryName = watchCountry?.name?.toLocaleUpperCase();
        } else {
          countryName = "";
        }
        // check if the current values matches the country data then append the address
        if (
          _currentValues &&
          _currentValues.answerData &&
          JSON.parse(_currentValues.answerData).country &&
          JSON.parse(_currentValues.answerData).country.toLocaleUpperCase() ===
            countryName
        ) {
          let currentData = JSON.parse(_currentValues.answerData);
          setValue("stateId", { id: 1, name: currentData?.state });
          setValue("apartment", currentData?.apartment);
          setValue("streetName", currentData?.streetName);
          setValue("landmark", currentData?.landmark);
          setValue("locality", currentData?.locality);
          formInstance.setValue('latlng',position)
          setValue("city", currentData?.city);
          setValue("zipCode", {
            id: (currentData && currentData?.zipCode) || "",
            pincode: currentData?.zipCode || currentData?.pincode,
            name: currentData?.zipCode || currentData?.pincode,
          });
          setCurrentValues("");
        }
      }
    })();
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
              return (
                <div key={sectionName} className={sectionName}>
                  <h4>{subTitleMapping[sectionName].title}</h4>
                  <p>{subTitleMapping[sectionName].subTitle}</p>
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
                        meta.editable = true;
                      }
                      if (fieldType === "address" && childNodes) {
                        return (
                          <AddressGeocodingComponent
                            childNodes={childNodes}
                            setMapSearched={setMapSearched}
                            sx={{ marginTop: "2rem" }}
                            countryKey="country"
                            setAddressFieldsTouched={setAddressFieldsTouched}
                            formInstance={formInstance}
                            setPosition={setPosition}
                            position={position}
                            searchText={searchText}
                            googleApiKey={googleApiKey}
                            populateMapAddress={populateMapAddress}
                            type="branch"
                            settingAPIParam="addClientBranchMap"
                            legendConfig={{ rulerControl: false }}
                            isVisibleSetting={false}
                          />
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
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default HubSetup;
