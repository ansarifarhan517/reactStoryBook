import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AddShipperWebhookProfile = React.lazy(() => import('./AddShipperWebhookProfile'));

function AddShipperWebhookProfileLazy() {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <AddShipperWebhookProfile />
            </Suspense>
        </div>
    );
}

angular.module('customermaster').value('AddShipperWebhookProfile', AddShipperWebhookProfileLazy);

angular.module('customermaster').controller('addShipperWebhookProfileCtrl', function ($scope, $rootScope) {
})