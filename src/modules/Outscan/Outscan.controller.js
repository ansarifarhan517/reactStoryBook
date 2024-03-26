import OutscanEntry from './OutscanEntry'

angular.module('shipmentScan').value('OutscanEntry', OutscanEntry);

angular.module('shipmentScan').controller('outscanCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'order';
  $scope.props = {
    ngStateRouter: $state
  }
})