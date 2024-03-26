import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { deepCopy } from "../../../utils/helper";
import { IOrganizationData } from "../../OnboardingWrapper/OrganizationConfiguration/OrganizationProfile/OrganizationProfile.model";

const dateFormatMapping = {
  "dd/MM/yyyy": "DD/MM/YYYY",
  "MM/dd/yyyy": "MM/DD/YYYY",
  "dd, MMM yyyy": "DD, MMM YYYY",
  "yyyy-MM-dd": "YYYY-MM-DD",
};

export const setDataLayer = () => {
  window?.dataLayer = window?.dataLayer || [];
  let userLocalData = localStorage.getItem("userAccessInfo");

  if (userLocalData !== null) {
    let parsedUserData = JSON.parse(userLocalData);
    let userId = parsedUserData.userId ? parsedUserData.userId : "anonymous";
    let userName = parsedUserData.userName
      ? parsedUserData.userName
      : "anonymous";
    let clentid = parsedUserData.clientId
      ? parsedUserData.clientId
      : "anonymous";
    let plantype = parsedUserData.planType
      ? parsedUserData.planType
      : "anonymous";
    let persona = parsedUserData.persona ? parsedUserData.persona : "anonymous";
    let cliientBranchId = parsedUserData.clientBranchId
      ? parsedUserData.clientBranchId
      : "anonymous";
    let baseCountry = parsedUserData.baseCountry
      ? parsedUserData.baseCountry
      : "anonymous";
    let locale = parsedUserData.locale ? parsedUserData.locale : "anonymous";
    let modalType = parsedUserData.superType
      ? parsedUserData.superType
      : parsedUserData.modelType;

    dataLayer.push({
      event: "Pageview",
      userName: userName,
      userId: userId,
      clientId: clentid,
      plantype: plantype,
      persona: persona,
      cliientBranchId: cliientBranchId,
      baseCountry: baseCountry,
      locale: locale,
      modalType: modalType,
    });
  }
};

export const convertClientProperty = (property) => {
  let properObj = property.reduce((a, v) => ({ ...a, [v.propertyKey]: v }), {});
  let properties = {
    dateFormat: {
      id: properObj["DATEFORMAT"].propertyValue,
      label: dateFormatMapping[properObj["DATEFORMAT"].propertyValue],
      value: dateFormatMapping[properObj["DATEFORMAT"].propertyValue],
    },
    baseCountry: {
      id: properObj["BASECOUNTRY"].propertyValue,
      label: properObj["BASECOUNTRY"].displayValue,
      value: properObj["BASECOUNTRY"].displayValue,
    },
    baseCurrency: {
      id: properObj["BASECURRENCY"].propertyValue,
      label: properObj["BASECURRENCY"].displayValue,
      value: properObj["BASECURRENCY"].displayValue,
    },
    timezone: {
      id: properObj["TIMEZONE"].propertyValue,
      label: properObj["TIMEZONE"]?.displayValue || "",
      value: properObj["TIMEZONE"]?.displayValue || "",
    },
    language: {
      id: properObj["BASELANGUAGE"].propertyValue,
      label: properObj["BASELANGUAGE"]?.displayValue || "",
      value: properObj["BASELANGUAGE"]?.displayValue || "",
    },
    metricSystem: {
      id: properObj["UNITSYSTEM"].propertyValue,
      label: properObj["UNITSYSTEM"].propertyValue,
      value: properObj["UNITSYSTEM"].propertyValue,
    },
  };
  return properties;
};

export const generateOrganizationProfileFormData = (
  data: IOrganizationData,
  countryListData
) => {
  const {
    countryName,
    countryId,
    stateName,
    zipCode,
    googleCountryCode,
    baseCountry,
  } = data;
  if (googleCountryCode) {
    // && !currentValues
    const selectedCountry = countryListData?.find((o) => {
      return o["googleCountryCode"] === googleCountryCode;
    });
    return {
      ...data,
      baseCountry: selectedCountry
        ? {
            id: selectedCountry && selectedCountry?.["id"],
            name: selectedCountry && selectedCountry?.["name"],
            googleCountryCode:
              selectedCountry && selectedCountry?.["googleCountryCode"],
          }
        : undefined,
      countryId: selectedCountry
        ? {
            id: selectedCountry && selectedCountry?.["id"],
            name: selectedCountry && selectedCountry?.["name"],
            displayName: selectedCountry && selectedCountry?.["displayName"],
            code: selectedCountry && selectedCountry?.["code"],
            googleCountryCode:
              selectedCountry && selectedCountry?.["googleCountryCode"],
          }
        : undefined,
      stateId: stateName
        ? {
            id: 1,
            name: stateName,
          }
        : undefined,
      zipCode: zipCode
        ? {
            id: countryId,
            name: zipCode,
            pincode: zipCode,
          }
        : undefined,
    };
  } else {
    return {
      ...data,
      stateId: stateName
        ? {
            id: 1,
            name: stateName,
          }
        : undefined,
      countryId: countryName
        ? {
            id: countryId,
            name: countryName,
          }
        : undefined,
      zipCode: zipCode
        ? {
            id: countryId,
            name: zipCode,
            pincode: zipCode,
          }
        : undefined,
      baseCountry: baseCountry
        ? {
            id: baseCountry && baseCountry?.["id"],
            name: baseCountry && baseCountry?.["value"],
          }
        : undefined,
    };
  }
};

export const getAddressMandatoryFields = async (countryName: string) => {
  try {
    var fieldName = [
      "apartment",
      "streetName",
      "landmark",
      "locality",
      "stateId",
      "city",
      "zipCode",
    ];
    const { data: response } = await axios.post(
      `${apiMappings.saas.plans.addressFields}${countryName}`,
      fieldName
    );
    return response.addressFields;
  } catch (error) {
    console.log(error);
  }
};

export const resetAddressFieldOnCountryChange = async (
  country: any,
  structure: any,
  setValue: (key: string, value: any) => void,
  dispatch: Function
) => {
  const countryValidationStructure = await getAddressMandatoryFields(
    country.name
  );
  // let addressStructure = structure['address details']
  Object.keys(structure["address details"]["addressFields"]["childNodes"]).map(
    (field) => {
      if (field !== "countryId") {
        setValue(field, "");
        let fieldName =
          structure["address details"]["addressFields"]["childNodes"][field]
            .fieldName;
        if (
          Object.keys(countryValidationStructure).length &&
          fieldName &&
          countryValidationStructure[field]
        ) {
          if (field === "stateId") {
            fieldName = "stateId";
          }
          structure["address details"]["addressFields"]["childNodes"][
            field
          ].required = countryValidationStructure[field].required;
          structure["address details"]["addressFields"]["childNodes"][
            field
          ].validation = countryValidationStructure[field].validation;
        }
      }
    }
  );
  // return structure
  dispatch({
    type: "@@organizationProfileForm/SET_STRUCTURE",
    payload: deepCopy(structure),
  });
};

export const resetAddressFieldOnHubCountryChange = async (
  country: any,
  structure: any,
  setValue: (key: string, value: any) => void,
  dispatch: Function
) => {
  const countryValidationStructure = await getAddressMandatoryFields(
    country.name
  );
  Object.keys(structure["address"]["addressFields"]["childNodes"]).map(
    (field) => {
      if (field !== "country") {
        setValue(field, "");
        let fieldName =
          structure["address"]["addressFields"]["childNodes"][field].fieldName;
        if (
          Object.keys(countryValidationStructure).length &&
          fieldName &&
          countryValidationStructure[field]
        ) {
          if (field === "state") {
            fieldName = "state";
          }
          structure["address"]["addressFields"]["childNodes"][field].required =
            countryValidationStructure[field].required;
          structure["address"]["addressFields"]["childNodes"][
            field
          ].validation = countryValidationStructure[field].validation;
        }
      }
    }
  );
  dispatch({
    type: "@@hubSetupForm/SET_STRUCTURE",
    payload: deepCopy(structure),
  });
  return structure;
};

export const hubDataMapping = (data) => {
  return {
    lat: data?.latlng ? data?.latlng[0] : 37.09024,
    lng: data?.latlng ? data?.latlng[1] : -95.71289100000001,
    adminContactName: data.adminContactName,
    apartment: data.apartment,
    city: data.city,
    country: data.country?.name,
    emailAddress: data.emailAddress,
    landmark: data.landmark,
    locality: data.locality,
    mobileNumber: data.mobileNumber,
    name: data.name,
    state: data.stateId?.name || "",
    streetName: data.streetName,
    zipCode: data.zipCode?.pincode || data.zipCode?.id,
  };
};

export function getSystemMetricOptions(metrix) {
  const metrixObject = {
    IMPERIALSYSTEM: [
      {
        propertyKey: "DISTANCE",
        propertyValue: "ML",
        defaults: "ML",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Distance",
        name: "DISTANCE",
      },
      {
        propertyKey: "SPEED",
        propertyValue: "MPH",
        defaults: "MPH",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Speed",
        name: "SPEED",
      },
      {
        propertyKey: "WEIGHT",
        propertyValue: "LB",
        defaults: "LB",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Weight",
        name: "WEIGHT",
      },
      {
        propertyKey: "VOLUME",
        propertyValue: "CUBIC_INCHES",
        defaults: "CUBIC INCHES",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Volume",
        name: "VOLUME",
      },
      {
        propertyKey: "DIMENSION",
        propertyValue: "INCHES",
        defaults: "INCHES",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Dimension",
        name: "DIMENSION",
      },
    ],
    METRICSYSTEM: [
      {
        propertyKey: "DISTANCE",
        propertyValue: "KM",
        defaults: "KM",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Distance",
        name: "DISTANCE",
      },
      {
        propertyKey: "SPEED",
        propertyValue: "KMPH",
        defaults: "KMPH",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Speed",
        name: "SPEED",
      },
      {
        propertyKey: "WEIGHT",
        propertyValue: "KG",
        defaults: "KG",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Weight",
        name: "WEIGHT",
      },
      {
        propertyKey: "VOLUME",
        propertyValue: "CC",
        defaults: "CUBIC INCHES",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Volume",
        name: "VOLUME",
      },
      {
        propertyKey: "DIMENSION",
        propertyValue: "CM",
        defaults: "CM",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Dimension",
        name: "DIMENSION",
      },
    ],
    USCUSTOMARYSYSTEM: [
      {
        defaults: "ML",
        description: "Distance",
        modelType: "LM",
        name: "DISTANCE",
        displayValue: "",
        propertyKey: "DISTANCE",
        propertyValue: "ML",
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "MPH",
        description: "Speed",
        modelType: "LM",
        displayValue: "",
        name: "SPEED",
        propertyKey: "SPEED",
        propertyValue: "MPH",
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "LB",
        description: "Weight",
        modelType: "LM",
        displayValue: "",
        name: "WEIGHT",
        propertyKey: "WEIGHT",
        propertyValue: "LB",
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "CUBICINCHES",
        description: "Volume",
        modelType: "LM",
        displayValue: "",
        name: "VOLUME",
        propertyKey: "VOLUME",
        propertyValue: "CC",
        showProperty: "Y",
        templateType: "select",
      },
      {
        propertyKey: "DIMENSION",
        propertyValue: "INCHES",
        defaults: "INCHES",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Dimension",
        name: "DIMENSION",
      },
    ],
  };
  return metrixObject[metrix];
}

export function orgProfileDataMapping(data, fn) {
  //TODO: when the metric value will be fetching from the api
  // const metricSubValues = await fn({name: data.metricSystem.label})
  return {
    clientMaster: {
      logoImagePath:
        localStorage.getItem("uploadLogo") || data.uploadLogo || "",
      name: data.name,
      adminContactName: data.adminContactName,
      officeNumber: data.officeNumber,
      mobileNumber: data.mobileNumber,
      emailAddress: data.emailAddress,
      countryId: data.countryId.id,
      country: data.countryId.name,
      countryName: data.countryId.name,
      stateId: data?.stateId?.id || "",
      stateName: data?.stateId?.name || "",
      state: data?.stateId?.name || "",
      googleCountryCode: data?.googleCountryCode,
      apartment: data?.apartment,
      streetName: data?.streetName,
      landmark: data?.landmark || "",
      locality: data?.locality || "",
      city: data?.city || "",
      zipCode: data?.zipCode?.name || "",
    },
    clientProperties: [
      {
        defaults: "UNITEDSTATES",
        description: "BaseCountry",
        displayValue: data.baseCountry.name || data.baseCountry.label,
        // "modelType": "LM",
        name: "BASECOUNTRY",
        propertyKey: "BASECOUNTRY",
        propertyValue: data.baseCountry.name || data.baseCountry.label,
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "US",
        description: "BaseCountryCode",
        displayValue: "SA",
        // "modelType": "LM",
        propertyKey: "BASECOUNTRYCODE",
        propertyValue: data.baseCountry.googleCountryCode,
        showProperty: "Y",
      },
      {
        defaults: "(GMT-05:00)UnitedStates(Eastern)",
        description: "DefineTimezonefortheclient",
        // "modelType": "LM",
        name: "TIMEZONE",
        placeHolder: data.timezone.gmtoffset || data.timezone.label,
        displayValue: data.timezone.gmtoffset || data.timezone.label,
        propertyKey: "TIMEZONE",
        propertyValue: data.timezone.canonicalId || data.timezone.id,
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "USD",
        description: "BaseCurrency",
        displayValue: data.baseCurrency.name || data.baseCurrency.label,
        // "modelType": "LM",
        name: "BASECURRENCY",
        propertyKey: "BASECURRENCY",
        propertyValue: data.baseCurrency.code || data.baseCurrency.id,
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "MM/dd/yyyy",
        description: "DateFormat",
        // "modelType": "LM",
        displayValue: data.dateFormat.label,
        name: "DATEFORMAT",
        propertyKey: "DATEFORMAT",
        propertyValue: data.dateFormat.name || data.dateFormat.id,
        showProperty: "Y",
        templateType: "select",
      },
      {
        defaults: "en-GB",
        description: "DefaultLanguageforNewUserCreation",
        // "modelType": "LM",
        displayValue: data.language.clientRefMasterDesc || data.language.label,
        name: "BASELANGUAGE",
        placeHolder: data.language.clientRefMasterCd,
        propertyKey: "BASELANGUAGE",
        propertyValue: data.language.clientRefMasterCd || data.language.id,
        showProperty: "Y",
        templateType: "select",
      },
      {
        propertyKey: "UNITSYSTEM",
        propertyValue: data.metricSystem.value,
        defaults: "USCUSTOMARYSYSTEM",
        modelType: "LM",
        showProperty: "Y",
        templateType: "select",
        description: "Unit System",
        name: "UNITSYSTEM",
      },
      ...getSystemMetricOptions(data.metricSystem.value),
    ],
  };
}

function formatInviteUserPayload(data) {
  let objectArray: {
    name: string;
    userName: string;
  }[] = [];
  for (let i = 1; i <= 5; i++) {
    let user = data["User" + i];
    let email = data["Email" + i];
    let objElement = {
      name: user,
      userName: email,
    };
    if (user !== "" && email !== "") {
      objectArray.push(objElement);
    }
  }
  return objectArray;
}

export function inviteUserMapping(data) {
  formatInviteUserPayload(data);
  return formatInviteUserPayload(data);
}

export function prepareFormStructure(formName, payload, fn) {
  switch (formName) {
    case "ORG_PROFILE":
      payload = orgProfileDataMapping(payload, fn);
      break;
    case "ADD_MAIN_HUB":
      payload = hubDataMapping(payload);
      break;
    case "INVITEUSERS":
      payload = inviteUserMapping(payload);
      break;
    default:
      payload;
  }
  return payload;
}

export const fetchDomain = (email) => {
  var res = email?.split("@");
  return res[1];
};
