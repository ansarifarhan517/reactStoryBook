import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";

const Tour = React.lazy(() => import("./Tour"));

function TourLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <Tour {...props} />
      </Suspense>
    </div>
  );
}

angular.module("saas").value("Tour", TourLazy);

angular
  .module("saas")
  .controller("tourCtrl", function ( $scope, $rootScope, $state, logiConstants, logiHttpService ) {
    $rootScope.isHeaderVisible = false;
    $scope.props = {
      redirectSupportLink: (url) => {
        $scope.redirectToLink(url);
      }
    };
    $scope.redirectToLink = function (url) {
      var encodeString = encodeURIComponent(url);
      logiHttpService.get(logiConstants.knowledgePortal + '?url=' + encodeString).success(function (response) {
        open('https://support.loginextsolutions.com/auto-login.php?token=' + response.token, '_blank');
      });
    };
});
