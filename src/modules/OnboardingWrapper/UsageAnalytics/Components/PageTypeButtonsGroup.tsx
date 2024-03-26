import React, { Dispatch, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { ButtonGroup } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IUsageAnalyticsActions } from "../Services/UsageAnalytics.actions";
import { tPageKey } from "../Services/UsageAnalytics.models";

const PageTypeButtonsGroup = ({ dynamicLabels }) => {
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();
  const history = useHistory();

  // Getting Data from Redux
  const pageKey = useTypedSelector((state) => state.usageAnalytics.pageKey);
  const subscriptionOptions = useTypedSelector(state => state.usageAnalytics?.subscriptionOptions);
  const clientOptions = useTypedSelector(state => state.usageAnalytics?.clientOptions);

  // Local States
  const pageKeys = useMemo(
    () => {
      let temp: Array<any> = [];
      if (subscriptionOptions.length && clientOptions.length > 1) {
        temp.push({
          id: "SUBSCRIPTION",
          label: dynamicLabels.subscription || "Subscription",
          selected: pageKey === "SUBSCRIPTION",
        }, {
          id: "CLIENT",
          label: dynamicLabels.Client || "Client",
          selected: pageKey === "CLIENT"
        });
      };

      return temp;
    },
    [subscriptionOptions, clientOptions]
  );

  const changeRoute = (page: string) => {
    page === 'SUBSCRIPTION' ?
      history.push({ pathname: "/subscriptionUsage", state: { subscriptionOptions: subscriptionOptions } })
      :
      history.push({ pathname: "/clientUsage", state: { clientOptions: clientOptions } })
  };

  const handleChange = (page: string) => {
    dispatch({ type: "@@usageAnalytics/SET_PAGE_TYPE", payload: page as tPageKey })
    changeRoute(page);
  };

  return (
    <ButtonGroup
      width="100px"
      height="30px"
      data={pageKeys}
      onChange={handleChange}
    />
  );
};

export default PageTypeButtonsGroup;
