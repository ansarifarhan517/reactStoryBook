import OrderRequestListView from './OrderRequestListView'

angular.module('booking').value('OrderRequestListView', OrderRequestListView);

angular.module('booking').controller('OrderRequestListViewCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'order';
  $scope.props = {
    ngStateRouter: {...$state}
  }
})