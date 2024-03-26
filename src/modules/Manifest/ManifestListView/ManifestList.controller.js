import ManifestList from './ManifestList'

angular.module('shipmentScan').value('ManifestList', ManifestList);

angular.module('shipmentScan').controller('manifestListCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'order';
  $scope.props = {
    ngStateRouter: $state
  }
})