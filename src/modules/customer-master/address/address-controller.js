import React, { lazy, Suspense } from "react";
import { Loader, Position } from 'ui-library'



const AllAddressModuleLazy = lazy(() => import(/* webpackChunkName: "AllAddressModule" */'./routes'))


const AddressEntry = (props) => (
  <Suspense fallback={
    <Position type='relative'>
      <Loader center /> 
    </Position>}>
    <AllAddressModuleLazy {...props}/>
  </Suspense>
);


angular.module('customermaster').value('address', AddressEntry)

angular.module('customermaster').controller('address-controller', function ($scope, $rootScope, $state) {
  $rootScope.menuActive = 'Customer Master';
  $scope.props = {
    ngStateRouter: $state,
    currentPage: 'alladdress'
  }
});

