import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const PdpaManagement = React.lazy(() => import(  /* webpackChunkName: "ProtectionMangementAct" */  './PdpaManagement'));

function PdpaManagementLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <PdpaManagement />
            </Suspense>
        </div>
    );     
}

angular.module('onboarding').value('PdpaManagement', PdpaManagementLazy);

angular.module('onboarding').controller('PdpaManagementCtrl', function ($scope, $rootScope) {
    $rootScope.menuActive = 'PdpaManagement';
    
}) 