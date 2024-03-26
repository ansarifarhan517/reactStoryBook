import angular from 'angular'
import React, { Suspense } from 'react'
import { Loader, Position } from 'ui-library'

const CheckpointsForm = React.lazy(() => import('./CheckpointsForm'))

function CheckpointsFormLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <CheckpointsForm {...props}/>
            </Suspense>
        </div>
    )
}

angular.module('contract').value('CheckpointsForm',CheckpointsFormLazy)

angular.module('contract').controller('CheckpointsFormCtrl',function($rootScope){
$rootScope.currentPageName = 'checkpointsForm'
})