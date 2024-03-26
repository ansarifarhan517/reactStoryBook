import AlertMessage from './AlertMessage';

angular.module('onboarding').value('AlertMessage', AlertMessage);

angular.module('onboarding').controller('AlertMessageCtrl', function ($rootScope) {
    $rootScope.menuActive = 'Settings';
})