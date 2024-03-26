import RateProfileListView from './RateProfileListView'

angular.module('customermaster').value('RateProfileListView', RateProfileListView);

angular.module('customermaster').controller('rateProfileCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'payments';
  $scope.props = {
    ngStateRouter: { ...$state }
  }

})
