import React from "react";
import LeftSidebar from "./LeftSideBar";
import { Grid } from "ui-library";
import { AnimatePresence } from "framer-motion";
import { StyledGrid, StyledAccordionWrapper } from "./StyledOnboardingView";

const Layout = ({ component, title, children, percentageProgress }) => {
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
            <LeftSidebar>
              <h3>{title}</h3>
              {percentageProgress}
              <StyledAccordionWrapper>{component}</StyledAccordionWrapper>
            </LeftSidebar>
            <div className="content-wrapper-onboarding">{children}</div>
          </div>
        </Grid>
      </StyledGrid>
    </AnimatePresence>
  );
};

export default Layout;
