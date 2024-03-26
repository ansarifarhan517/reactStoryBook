import CustomerListView from './CustomerListView'

angular.module('customermaster').value('CustomerListView', CustomerListView);

angular.module('customermaster').controller('customerTableCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Customer Master';
  $scope.props = {
    ngStateRouter: { ...$state }
  }

})
