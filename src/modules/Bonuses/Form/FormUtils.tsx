import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { UseFormMethods } from "react-hook-form";
import { IconButton } from "ui-library";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { hybridRouteTo, routeContains } from "../../../utils/hybridRouting";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { sendGA } from "../../../utils/ga";
import moment from "moment";
import store from "../../../utils/redux/store";
import { tMetrics } from "../../common/Globals/globals.actions";

const convertMetricsForDisplay = (value: number = 0, type: tMetrics): string => {
  const metrics = store?.getState().globals.metrics;
  return (value * metrics[type].conversionFactor).toFixed(2)
}

const convertMetricsForSave = (value: number, type: tMetrics): number => {
  const metrics = store?.getState().globals.metrics;
  return Number((value * 1.0 / metrics[type].conversionFactor).toFixed(4))
};

export const useBreadCrumbs = (
  formInstance: UseFormMethods<Record<string, any>>,
  commonDynamicLabels
) => {
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  const formStateLabel = routeContains("updateBonus")
    ? commonDynamicLabels.update || "Update"
    : routeContains("copyBonus")
    ? commonDynamicLabels.copy || "Copy"
    : commonDynamicLabels.add || "Add";
  console.log("abc", formStateLabel);
  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "payments",
        label: commonDynamicLabels.Payments || "Payments",
        disabled: true,
      },
      {
        id: "deliveryAssociate",
        label: commonDynamicLabels.deliveryboy_s || "Delivery Associate",
        disabled: true,
      },
      {
        id: "BONUS_CONFIGURATION",
        label: commonDynamicLabels.bonus_p || "Bonuses",
        disabled: false,
      },
      {
        id: "ADD/UPDATE_BONUS",
        label: `${formStateLabel} ${commonDynamicLabels?.bonus_s || "Bonus"}`,
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  const onBreadCrumbClick = () => {
    sendGA(
      "Bonus Configuration",
      `Cancel - ${routeContains("updateBonus") ? "Update" : "Add"} Bonus Form`
    );
    if (formInstance.formState.isDirty) {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={() => {
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
                  hybridRouteTo("bonuses");
                }}
              >
                {dynamicLabels.ok || "Ok"}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                onClick={() =>
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
                }
              >
                {dynamicLabels.cancel || "Cancel"}
              </IconButton>
            </>
          ),
        },
      });
    } else {
      hybridRouteTo("bonuses");
    }
  };

  return { breadCrumbOptions, onBreadCrumbClick };
};

export const typeFieldMappings = (
  typeValue: string,
  frequencyValue: string,
  eventStartTime: string
) => {
  // All Fields -> frequency, eventDay, eventStartTime, eventEndTime, everyTime, period
  if (typeValue === "EVENT") {
    const eventAndStarttimeMappings = {
      exists: frequencyValue === "Custom" ? {
        show: ["eventDay", "eventStartTime", "eventEndTime", "everyTime", "period", "frequency"],
        hide: [],
      } : {
        show: ["eventDay", "eventStartTime", "eventEndTime", "frequency"],
        hide: ["everyTime", "period"],
      },
      reset: frequencyValue === "Custom" ? {
        show: ["eventDay", "eventStartTime", "everyTime", "period", "frequency"],
        hide: ["eventEndTime"],
      } : {
        show: ["eventDay", "eventStartTime", "frequency"],
        hide: ["everyTime", "period", "eventEndTime"],
      },
    };
    return eventAndStarttimeMappings[eventStartTime];
  } else if (typeValue === "TIME_BOUND" || typeValue === "GUARANTEED") {
    return frequencyValue === "Custom"
      ? {
          show: ["frequency", "everyTime", "period"],
          hide: ["eventDay", "eventStartTime", "eventEndTime"],
        }
      : {
          show: ["frequency"],
          hide: [
            "everyTime",
            "period",
            "eventDay",
            "eventStartTime",
            "eventEndTime",
          ],
        };
  } else {
    // for typeValue === "reset" || typeValue === "ACHIEVEMENT"
    return {
      show: [],
      hide: [
        "frequency",
        "eventDay",
        "eventStartTime",
        "eventEndTime",
        "everyTime",
        "period",
      ],
    };
  }
};

export const metricFieldMappings = (
  metricValue: string,
  categoryValue: string
) => {
  // All Fields -> "metric", "category", "paymentMode", "orderType", "skillSet", "weight", "volume", "orderValue",

  const categoryMappings = {
    reset: {
      show: ["metric", "category"],
      hide: [
        "paymentMode",
        "orderType",
        "skillSet",
        "weight",
        "volume",
        "orderValue",
      ],
    },
    skillSet: {
      show: ["skillSet", "metric", "category"],
      hide: ["paymentMode", "orderType", "weight", "volume", "orderValue"],
    },
    paymentMode: {
      show: ["metric", "category", "paymentMode"],
      hide: ["orderType", "skillSet", "weight", "volume", "orderValue"],
    },
    orderType: {
      show: ["metric", "category", "orderType"],
      hide: ["paymentMode", "skillSet", "weight", "volume", "orderValue"],
    },
    weight: {
      show: ["metric", "category", "weight"],
      hide: ["paymentMode", "orderType", "skillSet", "volume", "orderValue"],
    },
    volume: {
      show: ["metric", "category", "volume"],
      hide: ["paymentMode", "orderType", "skillSet", "weight", "orderValue"],
    },
    orderValue: {
      show: ["metric", "category", "orderValue"],
      hide: ["paymentMode", "orderType", "skillSet", "weight", "volume"],
    },
  };

  return metricValue === "ORDER_COUNT"
    ? categoryMappings[categoryValue]
    : {
        show: ["metric"],
        hide: [
          "category",
          "paymentMode",
          "orderType",
          "skillSet",
          "weight",
          "volume",
          "orderValue",
        ],
      };
};

export const BONUSES_FORM_ADVANCED_FILTER_DROPDOWNOPTIONS_MAPPING = {
  branchName: async () => {
    const { data } = await axios.get(
      apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
      {
        url: apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
        data: {},
        params: {},
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );

    const returnBranchList = data?.map((branches: any) => ({
      label: branches?.name,
      value: branches?.name,
      id: branches?.branchId,
      title: branches?.name,
    }));

    return returnBranchList?.length ? returnBranchList : [];
  },
  deliveryMediumMasterTypeCd: async () => {
    const { data } = await axios.get(
      apiMappings.deliveryMedium.listView.delMedType
    );
    const deliveryTypes = data?.map((type: any) => ({
      label: type?.name,
      value: type?.name,
      id: type?.id,
      title: type?.name,
    }));

    return deliveryTypes?.length ? deliveryTypes : [];
  },
};

export const isBeforeToday = (dateToCheck: Date) =>
  moment().isAfter(dateToCheck, "day");

export const getParsedDAFilter = (DAFilter: any) => {
  let DAFilterObject = {};
  const DAFiltersParsed = JSON.parse(DAFilter);
  DAFiltersParsed?.filters?.forEach((filter: any) => {
    const id = (Math.random() * 10000).toFixed(0);
    DAFilterObject[id] = {
      id: id,
      firstValue: {
        id: filter.fieldId,
        label: filter.fieldLabelKey,
        value: filter.fieldId,
      },
      fieldOperation: [],
      showSecondField: true,
      fieldType: "",
      thirdElement: {
        type: undefined,
        value: "",
      },
      fieldId: filter.fieldId,
      operationSymbol: filter.operationSymbol,
      operationLabelKey: filter.operationLabelKey,
      fieldLabelKey: filter.fieldLabelKey,
      labelValue: filter.labelValue,
      filterData: filter.filterData,
      editMode: false,
    };
  });

  return DAFilterObject;
};

const compareDays = (day1Object: any, day2Object: any) => {
    return day1Object.sequence - day2Object.sequence;
}


const getValueForField = (fieldName: string, value: any) => {
  if (fieldName === "skillSet" || fieldName === "paymentMode") {
    return value?.[fieldName].clientRefMasterCd;
  } else if (fieldName === "eventDay") {
    return value?.eventDay?.sort(compareDays)?.map(dayObj => dayObj.name)?.join(",");
  } else if (fieldName === "eventStartTime" || fieldName === "eventEndTime") {
    return moment( value?.[fieldName])
      // .tz(value?.[fieldName], clientProperties?.TIMEZONE?.propertyValue)
      // .utc()
      .format("HH:mm:ss");
  } 
  else if (fieldName === 'volume' || fieldName === 'weight') {
    // volume, weight
    return convertMetricsForSave(parseFloat(value?.[fieldName]), fieldName)
  } else {
    // orderValue, eventStartTime, eventEndTime, orderType
    return value?.[fieldName];
  }
};

export const prepareBonusCriteriaPayload = (userFilledData: any) => {
  const {
    category,
    eventDay,
    eventStartTime: fromValue,
    eventEndTime: toValue,
  } = userFilledData;
  const bonusCriteriaPayload = [
    category ? category.clientRefMasterCd : undefined,
    eventDay ? "eventDay" : undefined,
    fromValue ? "eventStartTime" : undefined,
    toValue ? "eventEndTime" : undefined,
  ]
    ?.filter((fieldName) => fieldName)
    ?.map((filledField) => {
      return {
        fieldKey: filledField,
        value: getValueForField(filledField, userFilledData),
      };
    });

  return bonusCriteriaPayload;
};

export const manipulateStructure = (structure: any) => {
  Object.entries(structure)?.forEach(([sectionKey, fieldsObj]: any) => {
    if (sectionKey === "generalDetails") {
      const nonEditableFieldKeys = Object.keys(fieldsObj)?.filter(
        (fieldKey: string) =>
          fieldKey !== "endDate" &&
          fieldKey !== "name" &&
          fieldKey !== "description"
      );
      nonEditableFieldKeys?.forEach(
        (fieldKey) => (structure[sectionKey][fieldKey].editable = false)
      );
    } else {
      Object.keys(fieldsObj)?.forEach((keyToDisable: string) => {
        const slabFieldStructure =
          structure[sectionKey][keyToDisable]?.childNodes;
        if (keyToDisable === "bonusSlabs" && slabFieldStructure) {
          Object.keys(slabFieldStructure)?.forEach((childFieldKey: string) => {
            slabFieldStructure[childFieldKey].editable = false;
          });
        } else if (
          keyToDisable === "eventStartTime" ||
          keyToDisable === "eventEndTime"
        ) {
          structure[sectionKey][keyToDisable]["ShiftStartEndTimeVisiblity"] =
            true; // TODO: This is a generic Logic change this
        } else {
          structure[sectionKey][keyToDisable].editable = false;
        }
      });
    }
  });
  return structure;
};

export const setValueForFieldDependentOnCategory = (
  dependentFieldKey: string,
  value: string,
  paymentModeLookup: any,
  skillSetLookup: any,
  orderTypeOptions: any
) => {
  let valueToSet;
  if (dependentFieldKey === "paymentMode") {
    valueToSet = paymentModeLookup?.find(
      (optionObj) => optionObj.clientRefMasterCd === value
    );
  } else if (dependentFieldKey === "skillSet") {
    valueToSet = skillSetLookup?.find(
      (optionObj) => optionObj.clientRefMasterCd === value
    );
  } else if (dependentFieldKey === "orderType") {
    valueToSet = Object.keys(orderTypeOptions)?.find(
      (optionKey) => optionKey === value
    );
  } else if (dependentFieldKey === "weight" || dependentFieldKey === "volume") {
    valueToSet = convertMetricsForDisplay(parseFloat(value), dependentFieldKey)
  } else {
    valueToSet = value;
  }
  return [dependentFieldKey, valueToSet];
};

export const preparePayload = (data: any, DAFilterData: any, slabData: any) => {
  const bonusCriteriaPayload = prepareBonusCriteriaPayload(data);
  const tempPayload = {
    ...data,
    daFilter: {
      filters: Object.values(DAFilterData),
    },
    metric: data?.metric.clientRefMasterCd,
    type: data?.type.clientRefMasterCd,

    // Changing date formats
    startDate: data?.startDate
      ? moment(data?.startDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss")
      : undefined,
    endDate: data?.endDate ? moment(data?.endDate).endOf("day").format("YYYY-MM-DDTHH:mm:ss") : undefined,

    // addSlabs/bonusSlabs field's data will be sent to backend as bonusRateDTOs
    bonusRateDTOs: slabData,

    // Anything selected in the category dropdown, eventDay dropdown, eventStartTime field and to field would be sent as bonusCriteria array.
    bonusCriteria: bonusCriteriaPayload,
  };

  const removeFormFieldIds = [
    "category", // because its value is utilized in bonusCriteria

    // All the below fields should be removed because their value
    "paymentMode",
    "orderType",
    "skillSet",
    "weight",
    "volume",
    "orderValue",

    // removing this because alias is shared with backend
    "eventDay",
    "eventStartTime",
    "eventEndTime",

    // slabs
    "slabFilledData",
    "bonusSlabs",
  ];

  removeFormFieldIds?.forEach(
    (fieldToRemove) =>
      tempPayload[fieldToRemove] && delete tempPayload[fieldToRemove]
  );

  return tempPayload;
};


export const getDateWithoutOffset = (givenDate: Date) => {
  const dateOffsetInMinutes = moment(givenDate).utcOffset();
  return moment(givenDate).utc().subtract(dateOffsetInMinutes, 'minutes').toDate();
};

