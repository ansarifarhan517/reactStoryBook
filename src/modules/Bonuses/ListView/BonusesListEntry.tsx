import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { withReactOptimized } from "../../../utils/components/withReact";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import BonusesList from "./BonusesList";

export const basename = ''

const BonusesEntry = (props: any) => {
  const commonDynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.payments.bonuses.common);
  return (
    <div>
      <Switch>
        <Route exact path={`${basename}/`}>
          <BonusesList ngStateRouter={props.ngStateRouter} commonDynamicLabels={commonDynamicLabels}/>
        </Route>
        <Route exact path={"/"}>
          <BonusesList ngStateRouter={props.ngStateRouter} commonDynamicLabels={commonDynamicLabels}/>
        </Route>
      </Switch>
    </div>
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

export default withReactOptimized(withMemoryRouter(BonusesEntry));
