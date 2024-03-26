import CustomFields from './CustomFields'

angular.module('onboarding').value('CustomFields', CustomFields);

angular.module('onboarding').controller('customFieldsCtrl', function ($rootScope) {
    $rootScope.menuActive = 'Settings';
})