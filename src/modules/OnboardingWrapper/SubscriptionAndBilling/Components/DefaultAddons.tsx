import React from "react";
import { Typography, Box } from "ui-library";
import { withReactOptimized } from "../../../../utils/components/withReact";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import Addon from "../Containers/Addons/Addon";

const DefaultAddons = () => {
  const addons = useTypedSelector((state) => state.subscriptionBilling.addons);
  const recurringAddonObject = addons?.recurringAddons;

  const currencySym = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata.currencySymbol
  );

  const planType = useTypedSelector((state) => state.subscriptionBilling?.currentplandata?.planType)

  // Dynamic Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  const tryNewAddons = dynamicLabels.tryNewAddons || "Try New Add-ons";
  const addonLabel = dynamicLabels.addons || "Add-on";

  const addonsDesc = {
    SMS: dynamicLabels.smsAddonDesc || "Include this add-on to send real-time SMS alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    EMAIL: dynamicLabels.emailAddonDesc || "Include this add-on to send real-time email alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    IVR: dynamicLabels.ivrAddonDesc || "Include this add-on to send real-time IVR call alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    SUPPORTCHANGE: dynamicLabels.supportAddonDesc || "Include this add-on to use our dedicated training and change management support services."
  }

  const addonsHeading = {
    SMS: "SMS",
    IVR: "IVR Calls",
    EMAIL: "Email",
    SUPPORTCHANGE: "Training Support and Change Management",
  }

  return (
    <>
      {Object.keys(recurringAddonObject).length ? (
        <Box
          bgColor="white"
          mt="1em"
          p="1em"
          style={{
            padding: "20px",
            boxShadow: "0 2px 20px -10px #000",
            borderRadius: "3px",
          }}
        >
          <Typography useStyle={false} fontSize="13px" color="grey.A100">
            {planType === "TRIAL" ? addonLabel : tryNewAddons}
          </Typography>
          {Object.keys(recurringAddonObject).map((subAddOn: any) => {
            return (
              recurringAddonObject[subAddOn] ?
                <Addon
                  key={subAddOn}
                  id={subAddOn}
                  recurringtitleText={addonsHeading[subAddOn]}
                  recurringDescription={
                    addonsDesc[subAddOn]
                  }
                  recurringPrice={recurringAddonObject[subAddOn]?.price}
                  recurringUnit={recurringAddonObject[subAddOn]?.pricingScheme}
                  recurringAddonCode={recurringAddonObject[subAddOn]?.addonCode}
                  currencySym={currencySym} // This is missing in the API
                  recurringIntervalUnit={
                    recurringAddonObject[subAddOn]?.addonCode
                  }
                  recurringAddonIdentifier={
                    recurringAddonObject[subAddOn]?.identifier
                  }
                  recurringAddonTypeLabel={recurringAddonObject[subAddOn]?.addonType}
                  recurringAddonBillingCycle={recurringAddonObject[subAddOn]?.billingCycle}
                /> : null
            );
          })}
        </Box>
      ) : null}
    </>
  );
};

export default withReactOptimized(DefaultAddons, false);
