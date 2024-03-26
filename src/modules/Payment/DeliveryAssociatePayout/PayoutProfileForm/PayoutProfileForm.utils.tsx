import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { UseFormMethods } from "react-hook-form";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { tGlobalPopupAction } from "../../../common/GlobalPopup/GlobalPopup.reducer";
import { IconButton } from "ui-library";
import { hybridRouteTo, routeContains } from "../../../../utils/hybridRouting";

export const useBreadCrumbs = (
  formInstance: UseFormMethods<Record<string, any>>
) => {
  const {
    payment_p,
    payout_p,
    deliveryboy_s,
    update,
    add,
    payout_s,
    navigationConfirmation,
    cancel,
    ok,
    dataLostWarningMsg,
  } = useTypedSelector((state) => state.dynamicLabels);
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const isUpdateForm = routeContains("updatePayout");

  const breadCrumbOptions = React.useMemo(
    () => [
      {
        id: "payments",
        label: payment_p || "Payments",
        disabled: true,
      },
      {
        id: "deliveryAssociate",
        label: deliveryboy_s || "Delivery Associate",
        disabled: true,
      },
      {
        id: "payouts",
        label: payout_p || "Payouts",
        disabled: false,
      },
      {
        id: "add/update payout",
        label: `${isUpdateForm ? update || "Update" : add || "Add"} ${
          payout_s || "Payout"
        }`,
        disabled: true,
      },
    ],
    []
  );

  const onBreadCrumbClick = () => {
    if (formInstance?.formState?.isDirty) {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: navigationConfirmation,
          content: dataLostWarningMsg,
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={() => {
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
                  hybridRouteTo("payouts");
                }}
              >
                {ok || "Ok"}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                onClick={() =>
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
                }
              >
                {cancel || "Cancel"}
              </IconButton>
            </>
          ),
        },
      });
    } else {
      hybridRouteTo("payouts");
    }
  };

  return { breadCrumbOptions, onBreadCrumbClick };
};

export const showHideFieldMappings = (
  frequencyValue: string,
  periodValue: string
) => {
  const mapping = {
    Custom: {
      reset: {
        show: ["every", "period"],
        hide: ["time", "day", "date"],
      },
      Daily: {
        show: ["every", "period", "time"],
        hide: ["day", "date"],
      },
      Weekly: {
        show: ["every", "period", "day"],
        hide: ["time", "date"],
      },
      Monthly: {
        show: ["every", "period", "date"],
        hide: ["time", "day"],
      },
    },
    Daily: {
      show: ["time"],
      hide: ["day", "date", "every", "period"],
    },
    Weekly: {
      show: ["day"],
      hide: ["time", "date", "every", "period"],
    },
    Monthly: {
      show: ["date"],
      hide: ["day", "every", "period", "time"],
    },
    reset: {
      show: [],
      hide: ["every", "period", "day", "time", "date"],
    },
  };

  return frequencyValue === "Custom"
    ? mapping.Custom[periodValue]
    : mapping[frequencyValue];
};

export const getDropDownOptions = {
  frequency: {
    Daily: "Daily",
    Weekly: "Weekly",
    Monthly: "Monthly",
    Custom: "Custom",
  },
  period: {
    Daily: "Day(s)",
    Weekly: "Week(s)",
    Monthly: "Month(s)",
  },
};
