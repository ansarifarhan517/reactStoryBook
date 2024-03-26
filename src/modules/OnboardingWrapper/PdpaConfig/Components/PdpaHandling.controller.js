import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'
const PdpaConfig = React.lazy(() => import(  /* webpackChunkName: "ProtectionAct" */  './PdpaConifg'));

function PdpaConfigLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <PdpaConfig />
            </Suspense>
        </div>
    );
}

angular.module('onboarding').value('PdpaConfig', PdpaConfigLazy);

angular.module('onboarding').controller('PdpaHandlingCtrl', function ($scope, $rootScope) {
    $rootScope.menuActive = 'PDPA CONFIGRATION';

})