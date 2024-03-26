import PopupRedirectModule from './ProductTour.tsx';

angular.module('vehicle').value('ProductTour', PopupRedirectModule);

angular.module('vehicle').controller('ProductTourCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Resource';
  $scope.props = {
    ngStateRouter: $state
  }
});