import React from "react";

//common component
import Logo from "../SubComponent/Logo";
import IconImage from "../SubComponent/IconImage";
import logoUrl from "../../../../images/onboardingClient/LN-Logo-white-red.svg";
import { motion } from "framer-motion";

const animationConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

const LeftSidebar = ({
  iconUrl,
  title,
  description,
  stepName,
  islaunchLoader = false,
}) => {
  return (
    <div className="sidebarWrapper">
      <motion.div
        key={title}
        transition={animationConfig}
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 10, opacity: 0 }}
      >
        <Logo src={logoUrl} styles={{ marginBottom: "2rem" }} />
        <div className={islaunchLoader ? "launch-container" : ""}>
          <IconImage src={iconUrl} styles={{ width: "100%" }} />
          <h4>{title}</h4>
          <p dangerouslySetInnerHTML={{ __html: description }}></p>
        </div>
        {stepName === "PRIMARY_OPERATIONS" && (
          <div className="sidebar-footer">
            <p>Could not find your type of operation? </p>
            <a href="/model-type-Info" target="_blank">Click here to know more</a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LeftSidebar;
