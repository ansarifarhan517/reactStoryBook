import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AddBranchWebhookProfile = React.lazy(() => import('./AddBranchWebhookProfile'));

function AddBranchWebhookProfileLazy() {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <AddBranchWebhookProfile />
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('AddBranchWebhookProfile', AddBranchWebhookProfileLazy);

angular.module('onboarding').controller('addBranchWebhookProfileCtrl', function ($scope, $rootScope) {
    console.log("webhookProfileCtrl", $scope);
})