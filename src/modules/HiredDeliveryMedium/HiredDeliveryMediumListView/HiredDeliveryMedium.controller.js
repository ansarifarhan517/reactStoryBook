import HiredDeliveryMediumListView from './HiredDeliveryMediumListView.tsx';

angular.module('vehicle').value('HiredDeliveryMediumListView', HiredDeliveryMediumListView);

angular.module('vehicle').controller('hiredDeliveryMediumCtrl', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Resource';
  $scope.props = {
    ngStateRouter: $state
  }
});
