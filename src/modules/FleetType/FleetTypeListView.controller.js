import FleetTypeListView from './FleetTypeListView'

angular.module('contract').value('FleetTypeListView', FleetTypeListView);

angular.module('contract').controller('FleetTypeListViewCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Resource';
  $scope.props = {
    ngStateRouter: {...$state}
  }
})