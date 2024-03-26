import React, { useEffect, useState, useRef } from "react";
import launch_bg from "../../../../../../images/onboardingClient/ic-buildings.svg";
import trolly_man from "../../../../../../images/onboardingClient/ic-man-trolley.svg";
import cloud_icon from "../../../../../../images/onboardingClient/ic-cloud.svg";
import location_icon from "../../../../../../images/onboardingClient/ic-location.svg";
import ProgressBar from "../ProgessBar";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
// import launchLoaderSVG from '../../SVG/launchLoaderSVG'

const OnboardingLoader = () => {
  const [percentage, setPercentage] = useState(0);
  const [leftPosition, setLeftPosition] = useState(-33);

  const isClientLaunchLoading = useTypedSelector(
    (state) => state.saas.onboarding.launchLoading
  );

  useEffect(() => {
    if (percentage < 90) {
      setTimeout(() => {
        setLeftPosition(leftPosition + 1)
        setPercentage(percentage + 1);
      }, 200);
    }
  }, [percentage]);

  useEffect(() => {
    if (!isClientLaunchLoading) {
      setPercentage(100);
    }
  }, [isClientLaunchLoading]);

  return (
    <div className="launch__container">
      <div className="launch__wrapper">
        <div className="launch__loader__icon">
          <div className="trolly-moving-icon" style={{left: `${leftPosition}%`}}>
            <img src={trolly_man}></img>  
          </div>
          <div className="clouds-bg-icon">
           <img src={cloud_icon}></img>  
          </div>
          <div className="clouds-bg-icon cloud2">
           <img src={cloud_icon}></img>  
          </div>
          <div className="location-icon bounce2">
           <img src={location_icon}></img>  
          </div>
          <img src={launch_bg}></img>
        </div>
        <ProgressBar
          percentage={percentage}
          isCompleted={!isClientLaunchLoading}
        />
        <span className='percentage-text'>{percentage}%</span>
      </div>
    </div>
  );
};

export default OnboardingLoader;
