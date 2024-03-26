import React from "react";
import {
  Accordion,
  AccordionHeaderTitle,
  AccordionContent,
} from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { getTotalQuantity, getUsedQuantity } from "../../Services/Utils/HelperFunctions";
import ProgressBarPlanCard from "../ProgressBarPlanCard";
import styled from "styled-components";

interface IAddOnAccordionBoxProps {
  accordianAddons: any;
  defaultOpen?: boolean;
}

export const AccordianAddonsWrapper = styled.div`
  border-bottom: solid 0.5px #c9c9c9;
  :last-child {
    border-bottom: none;
  }
`

const AccordianAddons = ({
  accordianAddons,
  defaultOpen = false,
}: IAddOnAccordionBoxProps) => {
  const [isAddonExpanded, setIsExpanded] = React.useState(defaultOpen);

  const handleToggle = () => {
    setIsExpanded(!isAddonExpanded);
  };

  const clientUsageObject = useTypedSelector(
    (state) => state.subscriptionBilling.clientUsage
  );

  const currencySymbol = useTypedSelector(
    (state) => state.subscriptionBilling.currentplandata.currencySymbol
  );


  // Labels
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.billing}`);
  let addonDetails = dynamicLabels.addonDetails || "Add-on Details";

  const addonsDesc = {
    SMS: dynamicLabels.smsAddonDesc || "Include this add-on to send real-time SMS alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    EMAIL: dynamicLabels.emailAddonDesc || "Include this add-on to send real-time email alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    IVR: dynamicLabels.ivrAddonDesc || "Include this add-on to send real-time IVR call alerts and notifications to your customers, shippers, and branch managers about various order updates.",
    SUPPORTCHANGE: dynamicLabels.supportAddonDesc || "Include this add-on to use our dedicated training and change management support services."
  }

  return (
    <Accordion
      expanded={isAddonExpanded}
      onToggle={() => handleToggle()}
      id={accordianAddons.length}
      children={{
        header: (
          <AccordionHeaderTitle>
            {addonDetails}
          </AccordionHeaderTitle>
        ),
        content: (
          <AccordionContent>
            {Object.keys(accordianAddons).length ? (
              Object.keys(accordianAddons).map((addonSubtype, index) => {
                let usedQuantity = getUsedQuantity(
                  addonSubtype,
                  clientUsageObject
                );
                let totalQuantity = getTotalQuantity(
                  addonSubtype,
                  clientUsageObject
                );
                return (
                  <AccordianAddonsWrapper key={addonSubtype + index}>
                    <ProgressBarPlanCard
                      type={addonSubtype}
                      borderBottom={false}
                      titleFontSize={"15px"}
                      titleText={addonSubtype}
                      description={addonsDesc[addonSubtype]}
                      unitPrice={accordianAddons[addonSubtype]?.price}
                      usedQuantity={usedQuantity?.toString()}
                      totalQuantity={totalQuantity}
                      subscriptionType={accordianAddons[addonSubtype].identifier ? (accordianAddons[addonSubtype]?.identifier) : "unit(s)"}
                      currencySym={currencySymbol}
                      addonObject={accordianAddons[addonSubtype]}
                    />
                  </AccordianAddonsWrapper>
                )
              })
            ) : null}
          </AccordionContent>
        )
      }}
    />
  );
};

export default AccordianAddons;
