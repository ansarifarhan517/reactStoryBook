import InscanList from './InscanList'

angular.module('order').value('InscanList', InscanList);

angular.module('order').controller('inscanListCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'order';
  $scope.props = {
    ngStateRouter: $state
  }

})