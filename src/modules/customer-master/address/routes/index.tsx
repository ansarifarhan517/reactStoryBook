import React, { useState } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import { Box } from "ui-library";

import { withReactOptimized } from "../../../../utils/components/withReact";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import AddressList from "../pages/list-view";
import { AddressHeader } from "../components";
import AddressMapView from "../pages/map-view";

const withHashRouter =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <HashRouter>
        <Component {...(props as P)} />
      </HashRouter>
    );
  };

const AddressRouting = (props) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.customer.all_addresses
  );

  const [isUpdateForm, setIsUpdateForm] = useState(false);

  return (
    <Box
      display="flex"
      mt="64px"
      flexDirection="column"
      px="15px"
      pb="15px"
      className="address-page"
    >
      <AddressHeader dynamicLabels={dynamicLabels} isUpdateForm={isUpdateForm} />
      <Switch>
        <Route path="/address/map">
          <AddressMapView
            dynamicLabels={dynamicLabels}
            ngStateRouter={props.ngStateRouter}
            setIsUpdateForm={setIsUpdateForm}
            isUpdateForm={isUpdateForm}
            currentPage={props.currentPage}
          />
        </Route>
        <Route exact path="/address">
          <AddressList
            dynamicLabels={dynamicLabels}
            ngStateRouter={props.ngStateRouter}
          />
        </Route>
      </Switch>
    </Box>
  );
};

export default withReactOptimized(withHashRouter(AddressRouting));
