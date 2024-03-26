import angular from 'angular'
import React, { Suspense } from 'react'
import { Loader, Position } from 'ui-library'

const TrackerForm = React.lazy(() => import('./TrackerForm'))

function TrackerFormLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center fullScreen />
                </Position>}>
                <TrackerForm {...props}/>
            </Suspense>
        </div>
    )
}

angular.module('contract').value('TrackerForm',TrackerFormLazy)

angular.module('contract').controller('TrackerFormCtrl',function($rootScope){
$rootScope.currentPageName = 'trackerForm'
})