import React from "react";
import LeftSidebar from "./LeftSideBar";
import { Grid } from "ui-library";
import { StyledGrid } from "./StyledOnboardingView";
import { AnimatePresence } from "framer-motion";

const Layout = ({ iconUrl, title, description, islaunchLoader=false, stepName, children }) => {
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <StyledGrid container style={{}}>
        <Grid
          className="grid-customised-scroll-bar"
          item
          md={12}
          style={{ display: "flex", overflow: "hidden" }}
        >
          <div className="wrapper-layout-onboarding">
            <LeftSidebar
              iconUrl={iconUrl}
              stepName={stepName}
              title={title}
              description={description}
              islaunchLoader={islaunchLoader}
            />
            <div className="content-wrapper-onboarding">{children}</div>
          </div>
        </Grid>
      </StyledGrid>
    </AnimatePresence>
  );
};

export default Layout;
