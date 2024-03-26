import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import  React ,{ Dispatch } from "react";
import { UseFormMethods } from "react-hook-form";
import { IconButton } from "ui-library";


export const useBreadCrumbs = (
    formInstance: UseFormMethods<Record<string, any>>,
    commonDynamicLabels,
    setPageType
  ) => {
    const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
    const isFormEditable = useTypedSelector((state)=>state.oAuth.isFormEditable)
  
 
    const breadCrumbOptions = React.useMemo(
      () => [
        {
          id: "webhookTokenConfiguration",
          label: commonDynamicLabels.webhookTokenConfiguration || "Webhook Token Configuration",
          disabled: false,
        },
    
        {
          id: "ADD/UPDATE_WEBHOOKTOKENCONFIGURATION",
          label: ` ${ isFormEditable ? commonDynamicLabels?.update ||'UPDATE'  :commonDynamicLabels?.add || "ADD"} ${commonDynamicLabels?.webhookToken || "Webhook Token"}`,
          disabled: true,
        },
      ],
      [dynamicLabels]
    );
  
    const onBreadCrumbClick = () => {
    
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
                    setPageType("List")
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
        setPageType('List')
      }
    };
  
    return { breadCrumbOptions, onBreadCrumbClick };
  };
  