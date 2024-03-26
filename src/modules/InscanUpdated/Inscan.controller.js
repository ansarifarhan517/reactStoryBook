import InscanEntry from './InscanEntry'

angular.module('shipmentScan').value('InscanEntry', InscanEntry);

angular.module('shipmentScan').controller('controllerInscan', function ($scope, $rootScope, $state) {
  // $rootScope.menuActive = 'order';
  $scope.props = {
    ngStateRouter: { ...$state }
  }
})
