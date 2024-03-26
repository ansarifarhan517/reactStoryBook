import ContractListView from './ContractListView.tsx'

angular.module('contract').value('ContractMasterListView', ContractListView);

angular.module('contract').controller('rateContractMaster', function($scope, $rootScope, $state) {
    $rootScope.menuActive = 'payments';
    $scope.props = {
        ngStateRouter: {...$state}
      }
})
