import BrandProfileList from './BrandProfileList'

angular.module('onboarding').value('BrandProfileList', BrandProfileList);

angular.module('onboarding').controller('BrandProfileListCtrl', function ($scope, $rootScope, $state, $stateParams) {
    $rootScope.menuActive = 'Settings';
    $scope.props = {
       stateParams: $stateParams
    }
})