import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const OrganizationWebhookProfile = React.lazy(() => import('./OrganizationWebhookProfile'));

function OrganizationWebhookProfileLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <OrganizationWebhookProfile {...props}/>
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('OrganizationWebhookProfile', OrganizationWebhookProfileLazy);

angular.module('onboarding').controller('organizationWebhookProfileCtrl', function ($scope, $rootScope, $state) {
    $scope.props = {
        ngStateRouter: $state
    }
    $scope.$on("NavigateTolist", function (evt, propData) {
        if(propData?.stepName === 'WEBHOOKSPROFILE_ORGANIZATION'){
            $scope.props = propData;
        }
    });
})