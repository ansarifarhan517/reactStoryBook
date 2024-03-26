import React from "react";
import { Typography } from "ui-library";
import {
  ContentWrapper,
  ContentComponent,
} from "../Services/SubscriptionAndBilling.styles";
import { abbreviateAmount } from "../Services/Utils/HelperFunctions";

interface IPricingComponentParams {
  label: string;
  quantity: number;
  price: number;
  type?: string;
  currencySymbol: string;
  addonCode:string;
  addonType:string;
}

const PricingComponent = ({
  label,
  quantity,
  price,
  type = "units",
  currencySymbol,
  addonCode,
  addonType,
}: IPricingComponentParams) => {
  let renderElem, addonTotalPrice;
  if (addonType.toLowerCase() === "recurring") {
    if (
      addonCode.toLowerCase().includes("quarterly") ||
      addonCode.toLowerCase().includes("quartely")
    ) {
      renderElem = (
        <Typography
          useStyle={false}
          fontSize="10px"
          color="grey.900"
          lineHeight="14px"
        >
          {currencySymbol}
          {`${price}x${quantity} ${type}x3`}
        </Typography>
      );
      addonTotalPrice = abbreviateAmount(price * quantity * 3);
    }
    if (addonCode.toLowerCase().includes("halfyearly")) {
      renderElem = (
        <Typography
          useStyle={false}
          fontSize="10px"
          color="grey.900"
          lineHeight="14px"
        >
          {currencySymbol}
          {`${price}x${quantity} ${type}x6`}
        </Typography>
      );
      addonTotalPrice = abbreviateAmount(price * quantity * 6);
    }
    if (addonCode.toLowerCase().includes("annual")) {
        renderElem = (
          <Typography
            useStyle={false}
            fontSize="10px"
            color="grey.900"
            lineHeight="14px"
          >
            {currencySymbol}
            {`${price}x${quantity} ${type}`}
          </Typography>
        );
        addonTotalPrice = abbreviateAmount(price * quantity);
    }
  } else {
    renderElem = (
      <Typography
        useStyle={false}
        fontSize="10px"
        color="grey.900"
        lineHeight="14px"
      >
        {currencySymbol}
        {`${price}x${quantity} ${type}`}
      </Typography>
    );
    addonTotalPrice = abbreviateAmount(price * quantity);
  }
  return (
    <ContentWrapper padding="7px 0">
      <ContentComponent>
        <div style={{ maxWidth: "200px" }}>
          <Typography  useStyle={false} fontSize="13px" color="grey.900">
            {label}
          </Typography>
        </div>
        {renderElem}
      </ContentComponent>
      <ContentComponent shiftRight={true}>
        <Typography useStyle={false} fontSize="13px" color="grey.900" fontWeight={530}>
          {currencySymbol}
          {addonTotalPrice}
        </Typography>
      </ContentComponent>
    </ContentWrapper>
  );
};

export default PricingComponent;
