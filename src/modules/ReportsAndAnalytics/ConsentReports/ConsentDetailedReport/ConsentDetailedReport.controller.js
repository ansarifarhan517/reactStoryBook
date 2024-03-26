import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";
const ConsentDetailedReport = React.lazy(() => import("./../ConsentStatusReport/ConsentStatusReport"));

function ConsentDetailedReportLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <ConsentDetailedReport {...props} />
      </Suspense>
    </div>
  );
}

angular.module("reports").value("ConsentDetailedReport", ConsentDetailedReportLazy);

angular
  .module("reports")
  .controller("ConsentDetailedReportCtrl", function ($scope, $rootScope, $state) {
    $rootScope.menuActive = "reports";
    $scope.props = {
      ngStateRouter: $state,
      pageName :"consentDetailedReport"
    };
  });
