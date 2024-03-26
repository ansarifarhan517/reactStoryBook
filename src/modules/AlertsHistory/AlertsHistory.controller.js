import AlertsHistory from './AlertsHistory';

angular.module('alertsHistory').value('AlertsHistory', AlertsHistory);

angular.module('alertsHistory').controller('AlertsHistoryCtrl', function ($rootScope) {
    $rootScope.menuActive = null;
    $rootScope.currentPage = 'alertsHistory';
})