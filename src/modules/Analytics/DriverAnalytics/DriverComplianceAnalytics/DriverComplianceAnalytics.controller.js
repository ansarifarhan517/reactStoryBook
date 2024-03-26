import DriverComplianceAnalytics from './DriverComplianceAnalytics';

angular.module('analytics').value('DriverComplianceAnalytics', DriverComplianceAnalytics);

angular.module('analytics').controller('DriverComplianceAnalyticsCtrl', function ($rootScope) {
    $rootScope.menuActive = 'report';
})