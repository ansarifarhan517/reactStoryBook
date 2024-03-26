import TerritoryList from './TerritoryList'

angular.module('geofenceMaster').value('TerritoryList', TerritoryList);

angular.module('geofenceMaster').controller('territoryListCtrl', function ($rootScope, $scope, $state) {
  $rootScope.menuActive = 'Routes';
  $scope.props = {
    ngStateRouter: $state
  }
})