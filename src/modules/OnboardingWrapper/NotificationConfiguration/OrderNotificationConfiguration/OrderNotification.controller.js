import angular from "angular";
import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";
import { userAccessInfo } from "../../../../utils/axios";

const OrderNotificationEntry = React.lazy(() =>
  import("../CustomerNotificationConfiguration/CustomerNotificationEntry")
);

function OrderNotificationEntryLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <OrderNotificationEntry {...props} />
      </Suspense>
    </div>
  );
}

angular
  .module("onboarding")
  .value("OrderNotificationEntry", OrderNotificationEntryLazy);

angular
  .module("onboarding")
  .controller("OrderNotificationEntryCtrl", function ($rootScope, $scope) {
    $rootScope.currentPage = "orderNotification";
    $scope.userAccessInfo = localStorage.getItem('userAccessInfo')
    $scope.notificationType = userAccessInfo.superType === "MIDDLEMILE" ? "ORDER_ALLMILE" : "ORDER";
    $scope.props = {
      currentStep: $scope.currentStep,
      currentNotification: $scope.notificationType,
    };
  });
