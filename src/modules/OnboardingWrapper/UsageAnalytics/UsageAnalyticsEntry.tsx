// In this file there are routes. 
// Based on 2 API calls we will decide on which page should we route our user. Either Subscription/Client

import React, { useEffect, Dispatch } from "react";
import { withReactOptimized } from "../../../utils/components/withReact";
import { MemoryRouter, Switch, Route, useHistory } from "react-router-dom";
import { SubscriptionUsageAnalytics } from "./Pages/SubscriptionUsageAnalytics";
import ClientUsageAnalytics from "./Pages//ClientUsageAnalytics";
import { useDispatch } from "react-redux";
import { IUsageAnalyticsActions } from "./Services/UsageAnalytics.actions";
import axios from "../../../utils/axios";
import { useToast } from "ui-library";
import apiMappings from "../../../utils/apiMapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { tPageKey } from "./Services/UsageAnalytics.models";

const UsageAnalyticsEntry = () => {

  // General Hooks
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.settings.usageAnalytics}`);

  // Local States
  let localSubscriptionOptions = [];
  let localClientOptions = [];

  // Utils
  const fetchSubcriptionOptions = async () => {
    try {
      const { data: response } = await axios.post(
        apiMappings.usageAnalytics.subscriptionOptions
      );

      localSubscriptionOptions = response;

      dispatch({
        type: "@@usageAnalytics/SET_SUBSCRIPTION_OPTIONS",
        payload: { subscriptionOptions: response },
      });
    } catch (error) {
      toast.add(dynamicLabels.somethingWentWrong, 'warning', false)
      console.log(error);
    }
  };


  const fetchClientOptions = async () => {
    try {
      const { data: response } = await axios.post(
        apiMappings.usageAnalytics.clientOptions
      );

      localClientOptions = response;

      dispatch({
        type: "@@usageAnalytics/SET_CLIENT_OPTIONS",
        payload: { clientOptions: response },
      });
    } catch (error) {
      toast.add(dynamicLabels.somethingWentWrong, 'warning', false)
      console.log(error);
    }
  }

  // Effects
  useEffect(() => {
    (async () => {
      await fetchSubcriptionOptions();
      await fetchClientOptions();
      if(localSubscriptionOptions?.length) {
        dispatch({ type: "@@usageAnalytics/SET_PAGE_TYPE", payload: 'SUBSCRIPTION' as tPageKey })
        history.push({ pathname: "/subscriptionUsage", state: { subscriptionOptions: localSubscriptionOptions } });
      }else{
        dispatch({ type: "@@usageAnalytics/SET_PAGE_TYPE", payload: 'CLIENT' as tPageKey });
        history.push({ pathname: "/clientUsage", state: { clientOptions: localClientOptions } }) 
      }
    })();
  }, [])

  return (
    <>
      <Switch>
        <Route path="/subscriptionUsage">
          <SubscriptionUsageAnalytics dynamicLabels={dynamicLabels} />
        </Route>
        <Route path="/clientUsage">
          <ClientUsageAnalytics dynamicLabels={dynamicLabels} />
        </Route>
      </Switch>
    </>
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

export default withReactOptimized(withMemoryRouter(UsageAnalyticsEntry));

