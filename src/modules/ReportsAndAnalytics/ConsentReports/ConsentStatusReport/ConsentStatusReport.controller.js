import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";
const ConsentStausReport = React.lazy(() => import("./ConsentStatusReport"));

function ConsentStausReportLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <ConsentStausReport {...props} />
      </Suspense>
    </div>
  );
}

angular.module("reports").value("ConsentStatusReport", ConsentStausReportLazy);

angular
  .module("reports")
  .controller("ConsentStatusReportCtrl", function ($scope, $rootScope, $state) {
    $rootScope.menuActive = "reports";
    $scope.props = {
      ngStateRouter: $state,
      pageName :'consentStatusReport'
    };
  });
