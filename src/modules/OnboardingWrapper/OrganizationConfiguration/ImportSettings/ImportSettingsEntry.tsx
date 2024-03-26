import React, { Suspense } from "react";
import { withReactOptimized } from "../../../../utils/components/withReact";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import ImportSettings from "./ImportSettings";
import { Loader, Position } from "ui-library";
import ModuleConfiguration from "./SubComponents/ModuleConfiguration";

function ModuleConfigurationLazy() {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center />
        </Position>}>
        <ModuleConfiguration />
      </Suspense>
    </div>
  );
}

const ImportSettingsEntry = () => {
  return (
    <div>
      <Switch>
        <Route path="/moduleConfiguration">
          <ModuleConfigurationLazy />
        </Route>
        <Route path="/">
          <ImportSettings />
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

export default withReactOptimized(withMemoryRouter(ImportSettingsEntry));
