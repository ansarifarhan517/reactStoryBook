import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";

const UsageAnalyticsEntry = React.lazy(() => import("./UsageAnalyticsEntry"));

function UsageAnalyticsEntryLazy(props) {
  return (
    <div>
      <Suspense fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <UsageAnalyticsEntry {...props} />
      </Suspense>
    </div>
  );
}

angular
  .module("onboarding")
  .value("UsageAnalyticsEntry", UsageAnalyticsEntryLazy);

angular
  .module("onboarding")
  .controller("UsageAnalyticsEntryCtrlReact", function ($rootScope, $scope) {
    $rootScope.menuActive = "settings";
    $rootScope.currentPageName = "usageAnalytics";
    // $scope.props = {
    //   ngStateRouter: $state
    // }
  });