import React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import { withReactOptimized } from "../../../utils/components/withReact";

import { SubscriptionAndBillingMasterContainer } from "./Services/SubscriptionAndBilling.styles";

import PageShuffler from "./Containers/PageShuffler";
import Paycontainer from "./Pages/Paycontainer";
import Thankyou from "./Pages/Thankyou";
import SubscriptionPage from "./Pages/SubscriptionPage";
import TicketingToolListView from "../../TicketingTool/TicketingToolListView/TicketingToolListView";

// export const basename = '/settings/alertProfiles'
export const basename = "";
/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
// const ngStateRouterOptions = {
//   notify: false,
//   reload: false,
//   inherit: false,
//   location: true,
// };


const SubscriptionAndBillingMasterEntry = () => {
  // Getting from local storage to correct the CSS.
  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || ""
  );

  const isClientExpired = userAccessInfo?.isClientExpire;

  return (
    <SubscriptionAndBillingMasterContainer
      clientExpired={isClientExpired}
      className="grid-customised-scroll-bar"
    >
      <Switch>
        <Route path={`${basename}/subscriptionBilling`}>
          <SubscriptionPage/>
        </Route>
        <Route path={`${basename}/modifySubscription`}>
          <SubscriptionPage/>
        </Route>
        <Route path={`${basename}/paynow`}>
          <Paycontainer />
        </Route>
        <Route path={`${basename}/confirmSubscription`}>
          <Thankyou />
        </Route>
        <Route path={`${basename}/TicketingToolListView`}>
        <TicketingToolListView />
        </Route>
        <Route path="/">
          <PageShuffler/>
        </Route>
      </Switch>
    </SubscriptionAndBillingMasterContainer>
  );
};

const withMemoryRouter =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <MemoryRouter>
        <Component {...(props as P)} />
      </MemoryRouter>
    );
  };

export default withReactOptimized(
  withMemoryRouter(SubscriptionAndBillingMasterEntry),
  false
);
