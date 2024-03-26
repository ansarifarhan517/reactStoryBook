import angular from "angular";
import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";
import { userAccessInfo } from "../../../../utils/axios";

const MilestoneNotificationEntry = React.lazy(() =>
  import("../CustomerNotificationConfiguration/CustomerNotificationEntry")
);

function MilestoneNotificationEntryLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <MilestoneNotificationEntry {...props} />
      </Suspense>
    </div>
  );
}

angular
  .module("onboarding")
  .value("MilestoneNotificationEntry", MilestoneNotificationEntryLazy);

angular
  .module("onboarding")
  .controller("MilestoneNotificationEntryCtrl", function ($rootScope, $scope) {
    $rootScope.currentPage = "milestoneNotification";
    $scope.props = {
      currentStep: $scope.currentStep,
      currentNotification: "MILESTONE",
    };
  });
