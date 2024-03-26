import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const BeatListView = React.lazy(() => import(/* webpackChunkName: "BeatListView" */'./BeatListView'));

function BeatListViewLazy(props) {
    return (
        <div>
            <Suspense fallback={
                <Position type='relative'>
                    <Loader center />
                </Position>}>
                <BeatListView {...props} />
            </Suspense>
        </div>
    );
}

angular.module("outlet").value("BeatListView", BeatListViewLazy);


angular.module('outlet').controller('BeatListViewCtrl', function ($scope, $rootScope, $state) {
    // $rootScope.menuActive = 'payments';
    // $rootScope.currentPageName = 'bonusModule'
    // $scope.props = {
    //     ngStateRouter: $state
    // }
});

