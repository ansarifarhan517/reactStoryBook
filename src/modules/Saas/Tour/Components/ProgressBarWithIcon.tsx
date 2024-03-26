import React from "react";
import { StyledProgressBarWithIcon } from "../Layouts/StyledOnboardingView";
import productTourIcon from '../../../../../images/onboardingClient/ProductTourHelpIcon.svg'

function TourProgressBar({ percentage }) {
  const leftValue = percentage > 23 ? percentage - 23 : 1;
  return (
    <StyledProgressBarWithIcon
      style={{ position: "absolute", left: `${leftValue}%` }}
    >
      <img
        src={productTourIcon}
        style={{ margin: "-0.3rem 0 0 0" }}
      ></img>
      <span
        style={{
          padding: "0 0 0 8px",
          fontWeight: 700,
          fontSize: "14px",
          verticalAlign: "top",
        }}
      >
        {percentage} %
      </span>
    </StyledProgressBarWithIcon>
  );
}

export default TourProgressBar;
