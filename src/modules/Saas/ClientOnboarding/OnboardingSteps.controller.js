import React, { Suspense } from "react";
import { Loader, Position } from "ui-library";

const OnboardingSteps = React.lazy(() => import("./OnboardingSteps"));

function OnboardingStepsLazy(props) {
  return (
    <div>
      <Suspense
        fallback={
          <Position type="relative">
            <Loader center fullScreen />
          </Position>
        }
      >
        <OnboardingSteps {...props} />
      </Suspense>
    </div>
  );
}

angular.module("saas").value("OnboardingSteps", OnboardingStepsLazy);

angular
  .module("saas")
  .controller("onboardingStepsCtrl", function ($scope,logiConversionService,logiApiAuditMapService, $rootScope, $state, logiConstants, logiHttpService, logiFormService) {
    $scope.currentPage = "onboarding steps";
    $scope.props = {
      launchClient: (data) => {
        $scope.launchCallback(data);
      },
      setSystemProperty : (unit) => {
        $scope.addSystemProperty(unit)
      }
    };

    let sysPropertyMapping = {
      "Imperial System (ml, mph, lb, cubic inches, inches)": "IMPERIALSYSTEM",
      "Metric System (km, kmph, kg, cc, cm)": "METRICSYSTEM",
      "US Customary System (ml, mph, lb, cubic inches, inches)": "USCUSTOMARYSYSTEM"
  };

    $scope.addSystemProperty = function (unitSystem) {
      var prefix = sysPropertyMapping[unitSystem.name];
      var param = prefix + "VOLUME," + prefix + "WEIGHT," + prefix + "DISTANCE," + prefix + "SPEED," + prefix + "DIMENSION";
      var url = logiConstants.client.unitSystemLookup + "?unitSystemMetrices=" + param;
      logiFormService.volumeLookup = [];
      logiFormService.weightLookup = [];
      logiFormService.distanceLookup = [];
      logiFormService.speedLookup = [];
      logiFormService.dimensionLookup = [];
      logiHttpService.get(url, '').success(function (data) {
          angular.forEach(data, function (lookupData) {
              var unitSystem = prefix;
              if (unitSystem + "DISTANCE" == lookupData.lookupType) {
                  logiFormService.distanceLookup.push({ 'name': lookupData.lookupCd, 'id': lookupData.lookupType });
              } else if (unitSystem + "VOLUME" == lookupData.lookupType) {
                  logiFormService.volumeLookup.push({ 'name': lookupData.lookupCd, 'id': lookupData.lookupType });
              } else if (unitSystem + "SPEED" == lookupData.lookupType) {
                  logiFormService.speedLookup.push({ 'name': lookupData.lookupCd, 'id': lookupData.lookupType });
              } else if (unitSystem + "WEIGHT" == lookupData.lookupType) {
                  logiFormService.weightLookup.push({ 'name': lookupData.lookupCd, 'id': lookupData.lookupType });
              } else if (unitSystem + "DIMENSION" == lookupData.lookupType) {
                  logiFormService.dimensionLookup.push({ 'name': lookupData.lookupCd, 'id': lookupData.lookupType });
              }

          })
          return(
            {
              DISTANCE: logiFormService.distanceLookup,
              VOLUME: logiFormService.volumeLookup,
              SPEED: logiFormService.speedLookup,
              WEIGHT: logiFormService.weightLookup,
              DIMENSION: logiFormService.dimensionLookup
            }
          )
          
      });
  }

    $scope.launchCallback = function (response) {
      localStorage.clear();
      sessionStorage.clear();
      $scope.loginDisabled = false;

      var userAccessInfo = Object.assign(response.data.data, {
        accessToken: response.headers["www-authenticate"],
        userName: response.data.data.userName,
        userId: response.data.data.userId,
        subClients: response.data.data.subClients,
        modelType: response.data.data.modelType,
        clientBranches: response.data.data.clientBranches,
        CLIENT_SECRET_KEY: response.headers["client_secret_key"],
        isSuperClient: response.data.data.isSuperClient,
        isClientExpire: response.data.data.isClientExpire,
        clientLogo: response.data.data.logoImagePath,
        countryCode: response.data.data.countryCode,
        clientLocale: response.data.data.locale,
        superType: response.data.data.superType,
        baseCurrency: response.data.data.baseCurrency,
        planType: response.data.data.planType,
        baseCountry: response.data.data.baseCountry,
        userImagePath: response.data.data.userImagePath,
        baseCountryId: response.data.data.baseCountyId,
        timezone: response.data.data.timezone,
        timezoneMode: response.data.data.timezoneMode,
        region: response.data.data.region,
        productDomain: response.data.data.productDomain,
        firebaseConfigKey: response.data.data.firebaseConfig["DEFAULT"]
          ? response.data.data.firebaseConfig["DEFAULT"].key
          : null,
        firebaseConfigProjectId: response.data.data.firebaseConfig["DEFAULT"]
          ? response.data.data.firebaseConfig["DEFAULT"].database
          : null,
        firebaseConfigKeySocket: response.data.data.firebaseConfig["SOCKET"]
          ? response.data.data.firebaseConfig["SOCKET"].key
          : null,
        firebaseConfigProjectIdSocket: response.data.data.firebaseConfig[
          "SOCKET"
        ]
          ? response.data.data.firebaseConfig["SOCKET"].database
          : null,
      });

      localStorage.setItem("landingPage", response.data.data.landingPage);
      localStorage.setItem("justLoggedIn", true);

      $rootScope.userName = response.data.data.userName;
      $rootScope.subClients = response.data.data.subClients;
      localStorage.setItem("userAccessInfo", JSON.stringify(userAccessInfo));
      if (typeof $rootScope.stateChangeStartHook != "undefined") {
        $rootScope.stateChangeStartHook();
      }

      $rootScope.userName = response.data.data.userName;
      $rootScope.subClients = response.data.data.subClients;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address: response.data.data.baseCountry
            ? response.data.data.baseCountry
            : "",
        },
        function (results, status) {
          logiApiAuditMapService.send({
            apiKey: "GEOCODING",
            apiSubKey: "GEOCODING",
          });

          if (status == "OK") {
            userAccessInfo["countryLatLng"] =
              results[0].geometry.location.lat() +
              "," +
              results[0].geometry.location.lng();
            localStorage.setItem(
              "userAccessInfo",
              JSON.stringify(userAccessInfo)
            );
          }
          $rootScope.login = true;
          logiConversionService.initFunc();
          logiConversionService.redirectToLandingPage();
          setTimeout(function () {
            location.reload();
          }, 500);
        },
        function (result, status) {
          logiApiAuditMapService.send({
            apiKey: "GEOCODING",
            apiSubKey: "GEOCODING",
          });

          $rootScope.login = true;
          $scope.logiConversionService.initFunc();
          logiConversionService.redirectToLandingPage();
          setTimeout(function () {
            location.reload();
          }, 500);
        }
      );
    };
  });
