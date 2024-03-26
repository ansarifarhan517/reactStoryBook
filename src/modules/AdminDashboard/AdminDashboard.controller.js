import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const AdminDashboard = React.lazy(() => import('./AdminDashboard'));


function AdminDashboardLazy(props) {
    return (
      <div>
        <Suspense fallback={
          <Position type='relative'>
            <Loader center fullScreen />
          </Position>}>
          <AdminDashboard {...props}/>
        </Suspense>
      </div>
    );
  }

angular.module('admindashboard').value('AdminDashboard',AdminDashboardLazy);
angular.module('admindashboard').controller('adminControlTower', function($scope,$rootScope,
    logiHttpService,
    logiConstants,
    logiApiAuditMapService,
    logiConversionService,
    logiGoogleAnalyticsService,
    $state,
    $timeout
    ){


        $scope.logiConversionService= logiConversionService;
    $scope.props = {
        impersonateUser: function(username){
            $scope.impersonateUser(username);
        }
    }
    $scope.impersonateUser = function (username) {
        // Bug #45223: Impersonification- User id incorrect
        var adminUserName = JSON.parse(localStorage.getItem('userAccessInfo')).userName;
        localStorage.setItem("impersonateUserName", username);
        // const clientRegion = localStorage.getItem('clientRegion');
        // logiHttpService.get(logiConstants.clientMetrics.impersonate + '?region=' + clientRegion + '&userName=' + encodeURIComponent(username)).then(function (response) {
        logiHttpService.get(logiConstants.clientMetrics.impersonate + '?userName=' + encodeURIComponent(username)).then(function (response) {
            $scope.sendGAOnSuccessfullLogin(response?.data?.data?.clientId,response?.data?.data?.userName,response?.data?.data?.userId);
            $scope.loginDisabled = false;
            var userAccessInfo = Object.assign(response.data.data, {
                accessToken: response.headers()['www-authenticate'],
                userName: adminUserName,
                userId: response.data.data.userId,
                subClients: [response.data.data.subClients[0]],
                modelType: response.data.data.modelType,
                // clientBranches: response.data.data.clientBranches,
                CLIENT_SECRET_KEY: response.headers()['client_secret_key'],
                isSuperClient: response.data.data.isSuperClient,
                isClientExpire: response.data.data.isClientExpire,
                clientLogo: response.data.data.logoImagePath,
                countryCode: response.data.data.countryCode,
                clientLocale: response.data.data.locale,
                countryId : response.data.data.countryId ? response.data.data.countryId : response.data.data.baseCountyId,
                superType: response.data.data.superType,
                baseCurrency: response.data.data.baseCurrency,
                planType: response.data.data.planType,
                baseCountry: response.data.data.baseCountry,
                userImagePath: response.data.data.userImagePath,
                baseCountryId: response.data.data.baseCountyId,
                timezone: response.data.data.timezone,
                timezoneMode: response.data.data.timezoneMode,
                region:response.data.data.region,
                productDomain:response.data.data.productDomain,
                firebaseConfigKey:response.data.data.firebaseConfig ? response.data.data.firebaseConfig.key : null,
                firebaseConfigProjectId:response.data.data.firebaseConfig ? response.data.data.firebaseConfig.projectId : null,
                clientExpiryDt: response.data.data.clientExpiryDt
            });
            sessionStorage.clear();
            
            if (response.data.data.accountexpireRemainPeriod && null != response.data.data.accountexpireRemainPeriod && response.data.data.accountexpireRemainPeriod <= 10 && response.data.data.accountexpireRemainPeriod >= 0) {
                userAccessInfo['accountexpireRemainPeriod'] = response.data.data.accountexpireRemainPeriod;
            }

            if (response.data.data.timezone && response.data.data.timezone != moment.tz.guess()) {
                logiConversionService.showPrompt("Configured timezone is not same as system's timezone", 'error');
            }

            localStorage.setItem("landingPage", response.data.data.landingPage);
            localStorage.setItem("justLoggedIn", true);

            $rootScope.userName = response.data.data.userName;
            $rootScope.subClients = response.data.data.subClients;
            localStorage.setItem("isImpersonate", true);
            localStorage.removeItem("userAccessInfo");
            // localStorage.setItem("userAccessInfo", JSON.stringify(userAccessInfo));
            if (typeof $rootScope.stateChangeStartHook != "undefined") {
                $rootScope.stateChangeStartHook();
            }

            if (localStorage.getItem('isImpersonate') && (localStorage.getItem('isImpersonate') == "true" || localStorage.getItem('isImpersonate') == true)) {
                $rootScope.isImpersonate = true;
                $scope.impersonateUserName = localStorage.getItem('impersonateUserName');
            }


            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: response.data.data.baseCountry ? response.data.data.baseCountry : "" }, function (results, status) {

                logiApiAuditMapService.send({
                    "apiKey": "GEOCODING",
                    "apiSubKey": "GEOCODING",
                    "metadata": { "feature": "Client Metrics Dashboard" }
                });

                if (status == "OK") {
                    userAccessInfo['countryLatLng'] = results[0].geometry.location.lat() + "," + results[0].geometry.location.lng();
                }
                localStorage.setItem("userAccessInfo", JSON.stringify(userAccessInfo));
                $rootScope.login = true;
                $scope.logiConversionService.initFunc();
                // $location.path('/' + response.data.data.landingPage);
                $scope.redirectUser();
                $timeout(function () {
                    location.reload();
                }, 500);

            }, function (result, status) {

                logiApiAuditMapService.send({
                    "apiKey": "GEOCODING",
                    "apiSubKey": "GEOCODING",
                    "metadata": { "feature": "Client Metrics Dashboard" }
                });


                localStorage.setItem("userAccessInfo", JSON.stringify(userAccessInfo));
                $rootScope.login = true;
                $scope.logiConversionService.initFunc();
                $scope.redirectUser();
                $timeout(function () {
                    location.reload();
                }, 500);
            });
        }, function (response) {
            $scope.loginDisabled = false;
            $rootScope.loginError = (null !== response.data) ? response.data.message : '';
            $scope.isInvalidUser = true;
            console.log('Login failed!');
        });
    };

    $scope.sendGAOnSuccessfullLogin = (clientId,userName,userId) => {
        ga('send', {
            "hitType": 'event',
            "eventCategory": "Event New",
            "eventAction": "Logged In",
            "eventLabel": clientId + ' ' + userName,
            "userId": userId
        });
    }

    $scope.redirectUser = function () {
        if (JSON.parse(localStorage.getItem('userAccessInfo'))) {
            var modelType = JSON.parse(localStorage.getItem('userAccessInfo'))['modelType'];
            var superType = JSON.parse(localStorage.getItem('userAccessInfo'))['superType'];
        }

        if (localStorage.getItem('landingPage') == 'home') {
            if (modelType == "LH") {
                $state.go('LHhome');
            } else if (modelType == "OD") {
                $state.go('ondemandhome');
            } else if (superType == "FORCE") {
                $state.go('Forcehome');
            } else {
                $state.go('Milehome');
            }
            $rootScope.menuActive = 'home';
        } else if (localStorage.getItem('landingPage') == 'dashboardWrapper') {
            if (modelType == "LH") {
                $state.go('LHdashboardWrapper');
            } else if (modelType == "OD") {
                $state.go('ODdashboardWrapper');
            }
        } else {
            var menuObj = {
                "admindashboard": "adminDashboard",
                "home/force": "Forcehome",
                "home/haul": "LHhome",
                "home/mile": "Milehome",
                "ondemandhome": "ondemandhome",
                "order": "order",
                "setup": "saas Configuration",
                "tracker": "Tracker",
                "trip": "tripTracking"
            };
            if (menuObj[localStorage.getItem('landingPage')]) {
                $state.go(menuObj[localStorage.getItem('landingPage')]);
            } else {
                $state.go(localStorage.getItem('landingPage'));
            }
        }
    }


})