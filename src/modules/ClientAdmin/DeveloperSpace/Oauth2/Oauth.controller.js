import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const OauthWebhookProfile = React.lazy(() => import('./OauthWebhookProfile'));

function Oauthlazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <OauthWebhookProfile {...props}/>
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('oauthCtrlWebhookProfile', Oauthlazy);

angular.module('onboarding').controller('oauthCtrl', function ($scope, $rootScope, $state) {
    $scope.props = {
        ngStateRouter: $state
    }
   
})