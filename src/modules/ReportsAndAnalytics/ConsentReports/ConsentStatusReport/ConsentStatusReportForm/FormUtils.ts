import moment from "moment";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { IFetchedDropdownOptions } from "../../../../../utils/components/Form/interface";
import store from "../../../../../utils/redux/store";

export const fetchDropdownOptions = async (
  lookupType: string,
  dynamicValue: string,
  payload: any,
  consentNamePayload : any
): Promise<IFetchedDropdownOptions> => {
  

  const { data, status } = await axios.post(
    `${apiMappings.common.lookup[lookupType || ""]}`,
    {
      consentTypesLst: payload,
      consentNamesLst : consentNamePayload
    }
  );
  
  if (status == 200) {
    switch (lookupType) {
      case "getConsentType": {
        const mapping = {};
        return {
          options: data?.map((option: any) => {
            mapping[`${option.id}`] = option;
            return {
              label: option.consentType,
              value: option.id,
            };
          }),
          mapping,
        };
      }
      case "getConsentVersion": {
        const mapping = {};
        return {
          options: data?.map((option: any) => {
            mapping[`${option.id}`] = option;
            return {
              label: option.version,
              value: option.id,
            };
          }),
          mapping,
        };
      }
      case "getDa": {
        const mapping = {};
        return {
          options: data?.map((option: any) => {
            mapping[`${option.id}`] = option;
            return {
              label: option.delivAssocName,
              value: option.id,
            };
          }),
          mapping,
        };
      }

      default: {
        const mapping = {};
        return {
          options: data.map((option: any) => {
            mapping[`${option.id}`] = option;
            return { label: option.name, value: option.id };
          }),
          mapping,
        };
      }
    }
  } else {
    const mapping = {};
    return {
      options: [],
      mapping,
    };
  }
};

export const createRequestPayload = (data) => {
  const pageName = store.getState().consentStatusReport.form.pageName
  let payload = {
    hitStamp: Date.now().toString(),
    consentVersionStatus: data?.isActiveFl ? data?.isActiveFl?.name : "",
    consentTypesLst :  data?.consentType ? pageName=='consentStatusReport'? data?.consentType.map((consent)=>consent?.consentType):[data?.consentType?.consentType] :[],
    consentNamesLst :  data?.consentName ? pageName=='consentStatusReport'? data?.consentName.map((consent)=>consent?.name):[data?.consentName?.name] :[],
    consentVersionsLst : data?.consentVersion ? pageName=='consentStatusReport'?  data?.consentVersion.map((consent)=>consent?.version): [data?.consentVersion?.version]:[],
    daNamesLst : data?.da ? data?.da.map((da)=>da?.delivAssocName):[],

  };

  return payload
};
