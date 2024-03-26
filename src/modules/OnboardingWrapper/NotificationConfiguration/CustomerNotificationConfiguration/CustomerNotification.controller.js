import angular from "angular";
import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";

const CustomerNotificationEntry = React.lazy(() =>
  import("./CustomerNotificationEntry")
);

function CustomerNotificationEntryLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <CustomerNotificationEntry {...props} />
      </Suspense>
    </div>
  );
}

angular
  .module("onboarding")
  .value("CustomerNotificationEntry", CustomerNotificationEntryLazy);

angular
  .module("onboarding")
  .controller("CustomerNotificationEntryCtrl", function ($rootScope, $scope) {
    $rootScope.currentPage = "customerNotification";
    $scope.props = {
      currentStep: $scope.currentStep,
      currentNotification: "CUSTOMER",
    };
  });
