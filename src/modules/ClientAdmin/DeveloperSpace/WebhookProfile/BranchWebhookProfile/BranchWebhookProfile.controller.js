import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const BranchWebhookProfile = React.lazy(() => import('./BranchWebhookProfile'));

function BranchWebhookProfileLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <BranchWebhookProfile {...props}/>
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('BranchWebhookProfile', BranchWebhookProfileLazy);

angular.module('onboarding').controller('branchWebhookProfileCtrl', function ($scope, $rootScope) {
    $scope.$on("NavigateTolist", function (evt, propData) {
        if(propData?.stepName === 'WEBHOOKSPROFILE_BRANCH'){
            $scope.props = propData;
        }
    });
})