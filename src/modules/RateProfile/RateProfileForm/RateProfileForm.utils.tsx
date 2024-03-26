import React, {
  Dispatch,
  // useEffect, useState
} from "react";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useDispatch } from "react-redux";
import { hybridRouteTo, routeContains } from "../../../utils/hybridRouting";
import { UseFormMethods } from "react-hook-form";
import { IconButton } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
// import { IVehicleData } from './VehicleForm.model';
import { sendGA } from "../../../utils/ga";
import moment from "moment";
import { getConvertedData } from "./utils";


const modifyDropdowns = (input: any, checkString: string) => {
  let majorObj = {};
  Object.keys(input)?.forEach((key: any) => {
    let obj = input[key];

    let subObj = {};

    Object.keys(obj)?.forEach((k: any) => {
      subObj = {
        ...subObj,
        [k]:
          k === checkString
            ? { label: obj[k], value: obj[k], id: obj[k], name: obj[k] }
            : obj[k],
      };
    });

    majorObj = {
      ...majorObj,
      [key]: subObj,
    };
  });
  return majorObj;
};

export const generateVehicleFormData = (data: any, clientMetric: any, systemMetric:any) => {
  const {
    isActiveFl,
    name,
    description,
    baseRate,
    multiStoppedFlatRate,
    multiStoppedPerUnitRate,
    baseRateMappings,
    surchargeMappings,
    additionalServiceCharges,
    taxMappings,
    locationFees,
    handlingFees,
    codHandlingFees,
    // profileType
    // ...rest
  } = data;

  const handlingFeesSkillset: any[] = [];
  const handlingFeesValues = handlingFees?.map((obj: any) => {
    const array = obj?.skillSet?.split(",")?.map((m: any) => {
      return {
        id: m,
        label: m,
        value: m,
      };
    });
    handlingFeesSkillset.push({ skillSet: array });
    return {
      ...obj,
      skillSet: array,
    };
  });
  console.log(handlingFeesValues)

  const locationFeesValue = {
    ...modifyDropdowns(locationFees, "waitTimeChargeType"),
  };

  const additionalServiceChargesValues = {
    ...modifyDropdowns(additionalServiceCharges, "rateType"),
  };

  const surchargeMappingsValues = {
    ...modifyDropdowns(surchargeMappings, "rateType"),
  };

  const surchargeMappingsTimings =
    surchargeMappings?.surchargeSurgeTime?.surgeTimings;

  const newSurgeTimings =
    !!surchargeMappingsTimings &&
    surchargeMappingsTimings !== "" &&
    surchargeMappingsTimings?.map((obj: any) => {
      return {
        ...obj,
        startTime:
          moment(obj?.startTime).local().format("YYYY-MM-DDTHH:mm:ss") + "Z",
        endTime:
          moment(obj?.endTime).local().format("YYYY-MM-DDTHH:mm:ss") + "Z",
      };
    });

  if (!!surchargeMappingsTimings) {
    surchargeMappings.surchargeSurgeTime.surgeTimings = [...newSurgeTimings];
  }
  const baseRateMappingsValues = getConvertedData(
    baseRateMappings,
    clientMetric,
    "GET",
    systemMetric
  );

  return {
    isActiveFl,
    name,
    description,
    baseRate,
    multiStoppedFlatRate,
    multiStoppedPerUnitRate,
    baseRateMappings: baseRateMappingsValues,
    surchargeMappings: surchargeMappingsValues,
    additionalServiceCharges: additionalServiceChargesValues,
    taxMappings,
    locationFees: locationFeesValue,
    handlingFees:
      handlingFees?.length === 1 && handlingFees[0].skillSet === ""
        ? undefined
        : handlingFees,
    handlingFeesSkillset:
      handlingFees?.length === 1 && handlingFees[0].skillSet === ""
        ? undefined
        : handlingFeesSkillset,
    CODhandlingFees: codHandlingFees,
    // profileType: {id: profileType, name: profileTypeOptions.find((element) => element.id === profileType)?.name}
    // handlingFees
  };
};

export const useGoogleAnalytics = () => {
  const isEditMode = useTypedSelector((state) => state.vehicle.form.isEditMode);
  const gaOnSubmit = () => {
    sendGA(
      "Form Actions",
      ` Vehicle Form Button Click - ${isEditMode ? "Update" : "Save"}`
    );
  };

  const gaOnCancel = () => {
    sendGA("Form Actions", ` Vehicle Form Button Click - Cancel`);
  };

  return { gaOnSubmit, gaOnCancel };
};

export const useBreadCrumbs = (
  formInstance: UseFormMethods<Record<string, any>>
) => {
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const isEditMode = useTypedSelector(
    (state) => state.rateProfile.form.isEditMode
  );
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: "Payments", label: dynamicLabels.Payments, disabled: true },
      {
        id: routeContains("carrier") ? "CARRIER" : "DA",
        label: routeContains("carrier")
          ? dynamicLabels.vendorMaster
          : dynamicLabels.deliveryboy_s,
        disabled: false,
      },
      {
        id: "rateProfile",
        label: `${dynamicLabels.rate_profile_p}`,
        disabled: false,
      },
      {
        id: "addRateProfile",
        label: `${isEditMode ? dynamicLabels.update : dynamicLabels.add} ${
          dynamicLabels?.rateProfile || "Rate Profile"
        }`,
        disabled: true,
      },
    ],
    [dynamicLabels, isEditMode]
  );

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case "rateProfile":
        if (!formInstance.formState.isDirty) {
          if (routeContains("da_")) {
            hybridRouteTo("deliveryAssociateRateProfile");
          } else {
            hybridRouteTo("carrierRateProfile");
          }
        } else {
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
                      globalPopupDispatch({
                        type: "@@globalPopup/CLOSE_POPUP",
                      });
                      
                      routeContains("da_") ? hybridRouteTo("deliveryAssociateRateProfile") : hybridRouteTo("carrierRateProfile");
                    }}
                  >
                    {dynamicLabels.ok}
                  </IconButton>
                  <IconButton
                    iconVariant="icomoon-close"
                    onClick={() =>
                      globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
                    }
                  >
                    {dynamicLabels.cancel}
                  </IconButton>
                </>
              ),
            },
          });
        }
        break;
    }
  };

  return { breadCrumbOptions, handleBreadCrumbClick };
};

// export const Capacityconverter = (value, )
