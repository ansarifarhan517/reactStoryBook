import CashTransactionList from './CashTransactionList'

angular.module('wallet').value('CashTransactionList', CashTransactionList);

angular.module('wallet').controller('cashTransactionCtrl', function ($rootScope) {
  $rootScope.menuActive = 'payments';
})