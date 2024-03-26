import VehicleListView from './VehicleListView.tsx';

angular.module('vehicle').value('VehicleListView', VehicleListView);

angular.module('vehicle').controller('VehicleListViewCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Resource';
  $scope.props = {
    ngStateRouter: $state
  }
});
