import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";

const ImportSettingsEntry = React.lazy(() => import("./ImportSettingsEntry"));

function ImportSettingsEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <ImportSettingsEntry {...props} />
      </Suspense>
    </div>
  );
}

angular
  .module("onboarding")
  .value("ImportSettingsEntry", ImportSettingsEntryLazy);

angular
  .module("onboarding")
  .controller("ImportSettingsEntryCtrlReact", function ($rootScope, $scope) {
    $rootScope.menuActive = "settings";
    $rootScope.currentPageName = "importSettings";
    // $scope.props = {
    //   ngStateRouter: $state
    // }
  });
