import React from "react";
import { StyledProgressBar } from "../Layouts/StyledOnboardingView";
import ProgressBarWithIcon from "./ProgressBarWithIcon";

function getColorPercentage(percentage) {
  let color = "#fff";
  if (percentage < 25) {
    color = "RGB(245, 201, 133)";
  } else if (percentage < 50) {
    color = "RGB(253, 189, 69)";
  } else if (percentage < 75) {
    color = "RGB(138, 231, 148)";
  } else {
    color = "RGB(153, 209, 97)";
  }
  return color;
}

function BarProgress({ percentage }) {
  const color = getColorPercentage(percentage);
  return (
    <span
      className="progress--bar"
      style={{ width: percentage + "%", backgroundColor: color }}
    ></span>
  );
}

function TourProgressBar({ weightage, totalWeightage }) {
  let percentage = Math.trunc((100 / totalWeightage) * weightage);
  return (
    <StyledProgressBar>
      <BarProgress percentage={percentage} />
      <ProgressBarWithIcon percentage={percentage} />
    </StyledProgressBar>
  );
}

export default TourProgressBar;
