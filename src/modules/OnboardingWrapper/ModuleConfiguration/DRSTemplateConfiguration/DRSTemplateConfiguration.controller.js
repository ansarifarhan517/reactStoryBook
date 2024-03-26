import React, { Suspense } from 'react'
import { Loader, Position } from 'ui-library'
import angular from 'angular'


const DRSTemplateConfiguration = React.lazy(() => import('./DRSTemplateConfiguration'))

function DRSTemplateConfigurationLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>
            }>
                <DRSTemplateConfiguration {...props} />
            </Suspense>
        </div>
    )
}
angular.module('onboarding').value('DRSTemplateConfiguration', DRSTemplateConfigurationLazy)

angular.module('onboarding').controller('drsTemplateConfigurationCtrl',
    function ($scope, $rootScope) {
        $rootScope.menuActive = 'Settings'
        $scope.$on('NavigateTolist', function (event, propData) {
            if (propData?.stepName === 'DRS_TEMPLATE_CONFIGURATION') {
                $scope.props = propData;
            }
        }

        )
    }
)