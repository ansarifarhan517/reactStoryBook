import React, { Dispatch, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  SectionHeader,
  Grid,
  useToast,
  IconButton,
  Box,
  // BreadCrumb,
} from "ui-library";
import AddressGeocodingComponent from "../../../../utils/components/Form/AddressGeocodingComponent";
import { SectionHeaderContainer } from "../Organizationconfiguration.style";
import FormField from "../../../../utils/components/Form/FormField";
import { getGoogleAPIKey } from "../../../../utils/components/Map/MapHelper";
import withReact from "../../../../utils/components/withReact";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import {
  IOrganizationData,
  IOrganizationProfileFormActions,
} from "./OrganizationProfile.model";
import { FormContainer } from "../Organizationconfiguration.style";
import { tSearchFieldAddressInfo } from "../../../../utils/components/Map/interface";
import AddressFieldWatchers from "../AddressFieldWatchers";
import axios from "../../../../utils/axios";
import {
  buildContactPayload,
  generateOrganizationProfileFormData,
} from "./OrganizationProfile.utilis";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import apiMappings from "../../../../utils/apiMapping";
import { ILocalStorageEntries } from "../../BranchConfiguration/BranchConfiguration.models";
import FormLoader from "../../../../utils/components/FormLoader";
import { tGlobalToastActions } from "../../../common/GlobalToasts/globalToast.reducer";
import SectionImageContainer from "./SectionImageComponent";
import { AdditionalContactDetails } from "./AdditionalContactDetails";

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const OrganizationProfile = (props: any) => {
  const { clientId } = props;

  const userAccessInfo: ILocalStorageEntries = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.settings.organizationProfile}`
  );
  const _center =
    userAccessInfo?.["countryLatLng"]?.split(",") || FALLBACK_CENTER;

  const structure = useTypedSelector(
    (state) => state.settings.organizationProfileForm.structure
  );
  const resetData = useTypedSelector(
    (state) => state.settings.organizationProfileForm.resetData
  );
  const countryList = useTypedSelector(
    (state) => state.settings.organizationProfileForm.localeData
  );
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });
  const { setValue, reset, handleSubmit, getValues } = formInstance;
  // const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)

  const dispatch = useDispatch<Dispatch<IOrganizationProfileFormActions>>();

  const [position, setPosition] = useState<Array<number>>([
    _center[0],
    _center[1],
  ]);
  const [isAddressFieldsTouched, setAddressFieldsTouched] =
    useState<boolean>(false);
  const [isMapSearched, setMapSearched] = useState<boolean>(false);
  const googleApiKey = getGoogleAPIKey();
  const [searchText, setSearchText] = useState<string>("");
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();

  useEffect(() => {
    if (props.config) {
      dispatch({
        type: "@@organizationProfileForm/FETCH_STRUCTURE",
        payload: { ...props.config },
      });
    }
    dispatch({ type: "@@organizationProfileForm/FETCH_STRUCTURE" });
    dispatch({ type: "@@organizationProfileForm/FETCH_LOCALE" });
    fetchClientData(clientId, true);
  }, []);

  const fetchClientData = async (clientId: number, loading: boolean) => {
    dispatch({
      type: "@@organizationProfileForm/SET_LOADING",
      payload: loading,
    });
    setIsDataLoading(loading);
    try {
      const { data }: any = await axios.get<any>(
        `${apiMappings.settings.organizationProfile.getDetails}?clientId=${clientId}`
      );
      const response: IOrganizationData = { ...data };
      if (response) {
        dispatch({
          type: "@@organizationProfileForm/SET_PROFILE_DATA",
          payload: response,
        });
        const _resetData = {
          ...resetData,
          ...generateOrganizationProfileFormData(response),
        };
        if (data?.latitude && data?.longitude) {
          setPosition([data?.latitude, data?.longitude]);
        }
        reset({ ..._resetData });
        dispatch({
          type: "@@organizationProfileForm/SET_FORM_RESET_DATA",
          payload: _resetData,
        });
        dispatch({
          type: "@@organizationProfileForm/SET_LOADING",
          payload: false,
        });
        setIsDataLoading(false);
      }
    } catch (error) {
      dispatch({
        type: "@@organizationProfileForm/SET_LOADING",
        payload: false,
      });
      setIsDataLoading(false);
      toast.add(
        error?.response?.data?.message || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    }
  };

  const updateAddressFields = (address: tSearchFieldAddressInfo) => {
    const selectedCountry = countryList?.find((o) => {
      return o["name"] === address.country?.toUpperCase();
    });
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

  const onSubmit = async (data: any) => {
    setIsDataLoading(true);
    const { countryId, stateId, zipCode } = data;
    const contactDetails = buildContactPayload(
      getValues,
      userAccessInfo?.["clientId"]
    );
    const payload = {
      ...data,
      id: userAccessInfo?.["id"],
      clientId: userAccessInfo?.["clientId"],
      superClientId: userAccessInfo?.["superClientId"],
      isSuperFl: "Y",
      countryName: countryId?.name,
      countryId: countryId?.id,
      stateName: stateId?.name,
      stateId: stateId?.id,
      zipCode: zipCode?.name,
      latitude: position?.[0],
      longitude: position?.[1],
      clientpropertyDTO: null,
      contactDetailsList: contactDetails,
    };

    try {
      const { data: response } = await axios["put"](
        apiMappings.settings.organizationProfile.updateDetails,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsDataLoading(false);
        dispatch({
          type: "@@organizationProfileForm/SET_LOADING",
          payload: false,
        });
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "check-round",
          },
        });
        fetchClientData(clientId, false);
      } else {
        dispatch({
          type: "@@organizationProfileForm/SET_LOADING",
          payload: false,
        });
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response.message,
            icon: "warning",
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "@@organizationProfileForm/SET_LOADING",
        payload: false,
      });
      toast.add(
        error?.response?.data?.error?.message?.[0] ||
          error?.response?.data?.message ||
          dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <>
      <AddressFieldWatchers
        formInstance={formInstance}
        structure={structure}
        setSearchText={setSearchText}
        isMapSearched={isMapSearched}
        isAddressFieldsTouched={isAddressFieldsTouched}
      />
      <FormContainer>
        <div id="toast-inject-here"></div>
        {/* <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} /> */}
        {isDataLoading && (
          <div ref={loaderRef}>
            <FormLoader />
          </div>
        )}
        {!isDataLoading &&
          Object.keys(structure) &&
          Object.keys(structure).map((sectionName) => {
            if (sectionName === "ORG_PROFILE" || sectionName === "general details") {
              return (
                <div key={sectionName}>
                  <SectionHeaderContainer>
                    <SectionHeader headerTitle={dynamicLabels[sectionName]} />
                  </SectionHeaderContainer>
                  <Grid
                    container
                    spacing="0px"
                    style={{ marginBottom: "15px" }}
                  >
                    <SectionImageContainer
                      fieldNames={structure[sectionName]}
                      formInstance={formInstance}
                      clientName={resetData?.name}
                      isClientOnboarding={props?.clientOnboarding ? true : false}
                    />
                  </Grid>
                </div>
              );
            } else if (sectionName == "additionalContactDetails") {
              return (
                <div key={sectionName}>
                  <SectionHeaderContainer>
                    <SectionHeader headerTitle={dynamicLabels[sectionName]} />
                  </SectionHeaderContainer>
                  <AdditionalContactDetails
                    formInstance={formInstance}
                    contactStructure={structure[sectionName]}
                  />
                </div>
              );
            } else {
              return (
                <div key={sectionName}>
                  <SectionHeaderContainer>
                    <SectionHeader
                      headerTitle={
                        sectionName === "addressDetails"
                          ? dynamicLabels.billingAddressDetails
                          : dynamicLabels[sectionName]
                      }
                    />
                  </SectionHeaderContainer>
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
                      if (fieldType === "address" && childNodes) {
                        return (
                          <AddressGeocodingComponent
                            childNodes={childNodes}
                            setMapSearched={setMapSearched}
                            setAddressFieldsTouched={setAddressFieldsTouched}
                            formInstance={formInstance}
                            setPosition={setPosition}
                            position={position}
                            searchText={searchText}
                            googleApiKey={googleApiKey}
                            populateMapAddress={populateMapAddress}
                            type="organizationProfile"
                            settingAPIParam="organisationProfileGeocodeMap"
                          />
                        );
                      }
                      if (sectionName === "billingDetails") {
                        meta.editable = false;
                        meta.required = false;
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
            }
          })}
        {!props.config && (
          <Box
            horizontalSpacing="15px"
            display="flex"
            mt="30px"
            style={{ padding: "0px 15px" }}
          >
            <IconButton
              iconVariant="icomoon-save"
              style={{ padding: "0px 15px" }}
              disabled={isDataLoading}
              onClick={handleSubmit((data) => onSubmit(data))}
              primary
              id='organization_profile-actionBar-save'
            >
              {dynamicLabels.save}
            </IconButton>
          </Box>
        )}
      </FormContainer>
    </>
  );
};

export default withReact(OrganizationProfile);
