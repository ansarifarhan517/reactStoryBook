import WebHookListView from './WebHookListView';

angular.module('onboarding').value('WebHookListView', WebHookListView);

angular.module('onboarding').controller('WebHookListViewCtrl', function ($scope, $rootScope, $state) {
  $scope.props = {
    ngStateRouter: { ...$state }
  }
});

