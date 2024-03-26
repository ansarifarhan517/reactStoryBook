import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const ShipperWebhookProfile = React.lazy(() => import('./ShipperWebhookProfile'));

function ShipperWebhookProfileLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <ShipperWebhookProfile {...props} />
            </Suspense>
        </div>
    );
}

angular.module('customermaster').value('ShipperWebhookProfile', ShipperWebhookProfileLazy);

angular.module('customermaster').controller('shipperWebhookProfileCtrl', function ($scope, $rootScope, $stateParams) {
    $rootScope.menuActive = 'Customer Master';
    $scope.props = {
        params: $stateParams,
        navigateToList: false
    }

    $scope.$on("navigateTolist", function (evt, propData) {
        $scope.props.navigateToList = propData.navigateToList;
    });

})