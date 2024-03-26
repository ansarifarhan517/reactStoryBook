import TripsListViewEntry from "./TripsListViewEntry";
import WebWorker from "../../../../utils/webWorkerSetup";
import worker from "./subComponents/Worker";
import { deepCopy } from "../../../../utils/helper";
import store from "../../../../utils/redux/store";
angular.module("trips").value("TripsListView", TripsListViewEntry);

angular
  .module("trips")
  .controller(
    "tripsListViewCtrl",
    function (
      $scope,
      $rootScope,
      $state,
      logiConversionService,
      logiHttpService,
      logiConstants,
      dynamicLabelsMapping,
      logiUiGridTableService,
      logiFormService,
      $q,
      logiSearchSortService,
      $timeout,
      loginService,
      $http
    ) {
      $rootScope.menuActive = "Trip Planning";
      var _ = require("underscore");
      // let ApiWorker = new WebWorker(worker);

      $scope.props = {
        ngStateRouter: {
          ...$state,
        },
        printDRS: function (selectedRow, filters) {
          $scope.printMultiDrs(selectedRow, filters);
        },
        downloadStartedTripsReport: function (filters, filterListPayload) {
          $scope.downloadStartedTripsReport(filters, filterListPayload, 'Excel');
        },
      };
      $scope.additionalTripData = {};
      $scope.outletData = {};
      $scope.getTripAdditionalData = function (tripId) {
        var thisFuncPromise = $q.defer();
        logiHttpService
          .post(logiConstants.drs.getAdditionalTripDetails, [tripId], "")
          .success(function (data) {
            $scope.additionalTripData[tripId] = data[0];
            thisFuncPromise.resolve();
          });
        return thisFuncPromise.promise;
      };

      logiHttpService
        .get(
          "/LoginApp/framework/structure?modelName=DRS&pageName=DRS&sectionName=DRS_PRINT_VIEW"
        )
        .success(function (data) {
          $scope.drsPrintView = data;
        });
      var param = {
        pageName: "DRS",
        modelName: "DRS",
        sectionName: "DRS_ORDER_SUMMARY_LIST_VIEW",
      };

      logiUiGridTableService.getAndGenerateTableColumns(param).then(function (response) {
        $scope.columnData_drsOrderSummaryListView = response;
      });


      //GET DOT COMPLIANCE PROPERTY VALUE
      loginService.get('/ClientApp/client/property/list?propertyKey=CONSIDER_DOT_COMPLIANCE,SHOW_DOT_COMPLIANCE_RESULT,CONSIDERBACKTOHUB').success(function (response) {
        $scope.dotComplianceProperty = {};
        response.data.forEach(function (key) {
          $scope.dotComplianceProperty[key.propertyKey] = key.propertyValue;
        })
        $scope.considerDotCompliace = $scope.dotComplianceProperty['CONSIDER_DOT_COMPLIANCE'] == "Y" ? true : false;
        $scope.showDotCompliaceResult = $scope.dotComplianceProperty['SHOW_DOT_COMPLIANCE_RESULT'] == "Y" ? true : false;
        $scope.props.considerDotCompliace = $scope.considerDotCompliace;
        $scope.props.showDotCompliaceResult = $scope.showDotCompliaceResult;
        $scope.props.considerBackToHub = $scope.dotComplianceProperty['CONSIDERBACKTOHUB'] === 'Y' ? true : false;
      });


      $scope.createOutletTableData = function (tripId) {
        var thisFuncPromise = $q.defer();

        var data = {};
        data["tripId"] = tripId;
        data["status"] = "DRS";
        if (logiSearchSortService.pageParam["searchBy"]) {
        }
        data["searchBy"] = logiSearchSortService.pageParam["searchBy"];
        data["searchText"] = logiSearchSortService.pageParam["searchText"];
        var url =
          logiConstants.drs.getData + "?pageNumber=1&pageSize=10000&status=DRS";
        logiHttpService.get(url, "", data).success(function (data) {


          // Bug #41658: On click, Print DRS Button on Trip List View, while printing DRS columns can be Show/Hide from MongoDB
          angular.forEach($scope.columnData_drsOrderSummaryListView.parentColumns, function (rowData) {
            if (rowData.id == "serialNo") {
              $scope.drsOrderSummary_serialNo_listView = rowData.permission;
            } else if (rowData.id == "customerDetail") {
              $scope.drsOrderSummary_customerDetail_listView =
                rowData.permission;
            } else if (rowData.id == "customerAddress") {
              $scope.drsOrderSummary_customerAddress_listView =
                rowData.permission;
            }
          });


          var drsTableData = data.data.results;
          var outletData = [];
          angular.forEach(drsTableData, function (row, key) {
            var weight =
              row.packageWeight == undefined
                ? 0
                : parseFloat(
                  logiConversionService.convertToConfig(
                    row.packageWeight,
                    "capacityInWeight",
                    "GET",
                    "weight"
                  )
                );
            var volume =
              row.packageVolume == undefined
                ? 0
                : parseFloat(
                  logiConversionService.convertToConfig(
                    row.packageVolume,
                    "capacityInVolume",
                    "GET",
                    "volume"
                  )
                );
            var index = checkIfOutletExist(
              row.destClientNodeId,
              outletData,
              row.orderType
            );
            var serviceTimeInMins = row.serviceTimeInMins
              ? row.serviceTimeInMins
              : 0;
            var customerServiceTime = row.customerServiceTime
              ? row.customerServiceTime
              : 0;
            if (index == -1) {
              //add new customer object row.itemCount
              if (row.paymentType == "COD") {
                outletData.push({
                  orderType: row.orderType,
                  customerCd: row.destClientNodeId,
                  customerName: row.destClientNodeName,
                  customerPh: row.destClientNodePhone,
                  customerAddress: row.address,
                  addressId: row.addressId,
                  totalOrder: 1,
                  totalCrates: row.itemCount == undefined ? 0 : row.itemCount,
                  totalServiceTime: row.serviceTimeInMins,
                  totalPackageWeight: weight,
                  totalPackageVolume: volume,
                  totalAmount: row.packageValue,
                  calculatedEta: row.calculatedEndDt
                    ? row.calculatedEndDt -
                    (serviceTimeInMins + customerServiceTime) * 60000
                    : "",
                  shipmentIds: [row.shipmentId],
                  totalItems: 0,
                });
              } else {
                outletData.push({
                  orderType: row.orderType,
                  customerCd: row.destClientNodeId,
                  customerName: row.destClientNodeName,
                  customerPh: row.destClientNodePhone,
                  customerAddress: row.address,
                  addressId: row.addressId,
                  totalOrder: 1,
                  totalCrates: row.itemCount == undefined ? 0 : row.itemCount,
                  totalServiceTime: row.serviceTimeInMins,
                  totalPackageWeight: weight,
                  totalPackageVolume: volume,
                  totalAmount: 0,
                  calculatedEta: row.calculatedEndDt
                    ? row.calculatedEndDt -
                    (serviceTimeInMins + customerServiceTime) * 60000
                    : "",
                  shipmentIds: [row.shipmentId],
                  totalItems: 0,
                });
              }
            } else {
              //update values
              outletData[index].shipmentIds.push(row.shipmentId);
              outletData[index].totalOrder += 1;
              outletData[index].totalCrates +=
                row.itemCount == undefined ? 0 : row.itemCount;
              outletData[index].totalServiceTime += row.serviceTimeInMins;
              outletData[index].totalPackageWeight += weight;
              outletData[index].totalPackageVolume += volume;
              if (row.paymentType == "COD") {
                outletData[index].totalAmount += row.packageValue;
              }
            }
          });
          var shipmentIds = [];
          for (var i = 0; i < drsTableData.length; i++) {
            shipmentIds.push(drsTableData[i].shipmentId);
          }

          if (shipmentIds && shipmentIds.length) {
            const fetchEvent = "DRS";
            var url =
              logiConstants.order.orderCrate + "?shipment_ids=" + shipmentIds+ "&fetchEvent="+fetchEvent;
            logiHttpService.get(url).then(
              function (data) {
                var crateItems = data.data.data;
                angular.forEach(crateItems, function (crate) {
                  var index = checkIfOutletExistForShipmentId(
                    crate.shipmentDetailsId,
                    outletData
                  );
                  if (index != -1) {
                    outletData[index].totalItems +=
                      crate.shipmentlineitems.length;
                  }
                });

                $scope.outletData[tripId] = outletData;
                thisFuncPromise.resolve(crateItems);
              },
              function errorCallback(response) {
                $scope.outletData[tripId] = null;
                thisFuncPromise.resolve();
              }
            );
          } else {
            $scope.outletData[tripId] = outletData;
            thisFuncPromise.resolve();
          }
        });

        return thisFuncPromise.promise;
      };

      var checkIfOutletExist = function (
        destClientNodeId,
        outletData,
        orderType
      ) {
        var index = 0;
        var foundIndex = -1;
        angular.forEach(outletData, function (row) {
          if (
            destClientNodeId == row.customerCd &&
            orderType == row.orderType
          ) {
            foundIndex = index;
          }
          index++;
        });
        return foundIndex;
      };

      var checkIfOutletExistForShipmentId = function (shipmentId, outletData) {
        var index = 0;
        var foundIndex = -1;
        angular.forEach(outletData, function (row) {
          angular.forEach(row.shipmentIds, function (ship) {
            if (shipmentId == ship) {
              foundIndex = index;
            }
          });
          index++;
        });
        return foundIndex;
      };

      var fillValueInStructureDRSSummary = function (
        aditional,
        printdata,
        structure
      ) {
        angular.forEach(structure, function (column, key) {
          if (key == "routeName") {
            column.value = printdata.routeName;
          } else if (key == "selectedTripName") {
            column.value = printdata.tripName;
          } else if (key == "custCount") {
            column.value = printdata.uniqueCustomerCount;
          } else if (key == "currVehicleNumber") {
            column.value = printdata.currVehicleNumber;
          } else if (key == "currDeliveryBoy") {
            column.value = printdata.deliveryMediumName;
          } else if (key === "totalPackageWeight" && aditional) {
            column.value = logiConversionService.convertToConfig(
              aditional[key],
              "",
              "GET",
              "weight"
            );
          } else if (key === "plannedDistance" && aditional) {
            column.value = logiConversionService.convertToConfig(
              aditional[key],
              "",
              "GET",
              "distance"
            );
          } else if (key === "totalPackageVolume" && aditional) {
            column.value = logiConversionService.convertToConfig(
              aditional[key],
              "",
              "GET",
              "volume"
            );
          } else if (key === "plannedTripTimeInMins" && aditional) {
            column.value =
              Math.floor(aditional[key] / 60) +
              " Hrs : " +
              (aditional[key] % 60) +
              " Min";
          } else {
            column.value = aditional && aditional[key];
          }
        });
        if (aditional) {
          aditional.drsSummaryStructure = angular.copy(structure);
        } else {
          aditional = {};
          aditional.drsSummaryStructure = angular.copy(structure);
        }
      };

      function printDiv(style, data) {
        var newWin = open("");
        var is_chrome = Boolean(newWin.chrome);
        newWin.document.open("text/html");
        newWin.document.write("<html><head>");
        newWin.document.write(style);
        newWin.document.write("</head><body>");
        newWin.document.write(data);
        newWin.document.write("</body></html>");
        var ctlTd = jQ("#printTable td");
        if (ctlTd.length > 0) {

          ctlTd.wrapInner('<div class="avoidBreak" />');
        }

        if (is_chrome) {
          setTimeout(function () {
            // wait until all resources loaded
            newWin.document.close(); // necessary for IE >= 10
            newWin.focus(); // necessary for IE >= 10
            newWin.print(); // change window to winPrint
            newWin.close(); // change window to winPrint
          }, 250);
        } else {
          newWin.document.close(); // necessary for IE >= 10
          newWin.focus(); // necessary for IE >= 10
          newWin.print();
          newWin.close();
        }

        return true;
      }
      $scope.getDrsDotData = function (tripIds) {
        if (logiSearchSortService.pageParam) {
          logiSearchSortService.pageParam['tripIds'] = tripIds;
          logiHttpService.get(logiConstants.drs.getDotData, '', logiSearchSortService.pageParam, "tableLoader").success(function (data) {
            setTimeout(function () {
              logiFormService.loadCustomFieldsTableData(data.data, $scope.tableColumnData);
              $scope.dotTableData = data.data;
              if ($scope.gridOptionsSuggestedModal) {
                $scope.gridOptionsSuggestedModal.data = $scope.dotTableData;
              } else {
                $scope.gridOptionsSuggestedModal = {};
                $scope.gridOptionsSuggestedModal.data = $scope.dotTableData;
              }
              $scope.dataFetched = true;
              if ($scope.selectedTripStatus == 'ENDED') {
                angular.element('#js-addBtn').addClass('hide-overlay');
              } else {
                angular.element('#js-addBtn').removeClass('hide-overlay');
              }
              if (data.data.totalCount > 0) {
                angular.element('#js-printBtn').removeClass('hide-overlay');
              } else {
                angular.element('#js-printBtn').addClass('hide-overlay');
              }
              $scope.$apply();
            }, 500);
            // $scope.pagination.total = data.data.totalCount;
            // $scope.$parent.pagination.total = data.data.totalCount;
            jQ(".loaderContainer").fadeOut(500);
          });
        }
      };

      $scope.printCallback = function (page) {
        var divToPrint = document.getElementById("printTable");

        var style =
          "" +
          '<style type="text/css">' +
          "table{" +
          " border: 1px solid gray;" +
          " border-collapse: collapse;" +
          " border-spacing: 0;" +
          " page-break-inside:auto;" +
          "}" +
          "tr, td { page-break-inside:avoid; page-break-after:auto }" +
          "table td{" +
          " border: 1px solid gray;" +
          " font-family: OpenSans !important;" +
          " font-size: 11px;" +
          " font-weight: normal;" +
          "}" +
          "table th{" +
          " font-family: OpenSans-Bold !important;" +
          " font-size: 11px;" +
          "}" +
          "table .drsHeader {" +
          "  background-color: #fff !important;" +
          "  border: solid 1px;" +
          "  color: #000;" +
          "  height: 50px;" +
          "  font-family: OpenSans-Semibold !important;" +
          "  font-size: 12px;" +
          "  -webkit-print-color-adjust: exact;" +
          "}" +
          "th.borderwhite{" +
          "  border-left: 1px solid black;" +
          "  border-right: 1px solid black;" +
          "}" +
          "th.bordergray{" +
          "  border: 1px solid gray;" +
          "}" +
          ".colmd1{" +
          " width: 8.33%; float:left;" +
          "}" +
          ".colmd2{" +
          " width: 16.66666667%; float:left;" +
          "}" +
          ".colmd3{" +
          "width: 25%; float:left;" +
          "}" +
          ".colmd4{" +
          " width: 33.32%; float:left;" +
          "}" +
          ".colmd5{" +
          " width: 41.66666667%; float:left;" +
          "}" +
          ".colmd6{" +
          "width: 49.98%; float:left;" +
          "}" +
          ".colmd7{" +
          " width: 58.31%; float:left;" +
          "}" +
          ".colmd8{" +
          " width: 66.64%; float:left;" +
          "}" +
          ".colmd9{" +
          "width: 74.97%; float:left;" +
          "}" +
          ".colmd10{" +
          " width: 83.3%; float:left;" +
          "}" +
          ".colmd11{" +
          " width: 91.63%; float:left;" +
          "}" +
          ".colmd12{" +
          "width: 100%;" +
          "}" +
          "</style>";
        store.dispatch({ type: '@@tripsListViewMile/SET_LOADING', payload: { listViewWrapper: false } })
        printDiv(style, divToPrint.outerHTML);
      };
      let counter = 0;
      const printMultiDrs = function (selectedRow, dynamicLabels) {
        $scope.distanceFactor = logiConversionService.conversionFactor.LOGISYSTEM.distance.factor;
        store.dispatch({ type: '@@tripsListViewMile/SET_LOADING', payload: { listViewWrapper: true } });
        var tripIds = [];
        $scope.selectedRows = selectedRow;

        if (!$scope.crateType) {
          logiHttpService
            .get(logiConstants.order["getCrateType"])
            .success(function (data) {
              if (data.propertyValue == "CRATE") {
                $scope.crateType = "b";
              } else {
                $scope.crateType = "a";
              }
            });
        }

        // Exclusively for print drs table
        $scope.currencySymboleKey =
          "cur_symbol_" +
          JSON.parse(localStorage.getItem("userAccessInfo"))["baseCurrency"];
        // logiHttpService.get(logiConstants.getDynamicLabels + dynamicLabelsMapping.drsHeaderMile.paramString + "," + $scope.currencySymboleKey + ",customerList").success(function (data) {
        $scope.dynamicLabels_printDrs = dynamicLabels;
        logiHttpService
          .get(
            logiConstants.getDynamicLabels +
            dynamicLabelsMapping.statusMappings.paramString
          )
          .success(function (statusLabelsData) {
            $scope.statusLabels = statusLabelsData;
            $scope.notDispatched = $scope.dynamicLabels_printDrs.notDispatched;
            $scope.order = $scope.dynamicLabels_printDrs.order;
            // Bug #25973: Multiprint DRS - While printing DRS, an threshold limit is set to avoid page break
            if (
              $scope.selectedRows &&
              Object.keys($scope.selectedRows) &&
              Object.keys($scope.selectedRows).length &&
              Object.keys($scope.selectedRows).length <= 100
            ) {
              angular.forEach($scope.selectedRows, function (row, tripId) {
                tripIds.push(row["tripId"]);
              });
              var url =
                logiConstants.mileTrip.multipleTripRoute + "&tripId=" + tripIds;

              if ($scope.considerDotCompliace && $scope.showDotCompliaceResult) {
                $scope.getDrsDotData(tripIds);

              }

              logiHttpService
                .get(
                  "/LoginApp/framework/structure?modelName=DRS&pageName=DRS&sectionName=DRS_SUMMARY_LIST_VIEW"
                )
                .success(function (responseSummary) {
                  $scope.columnData_SummaryDrs = responseSummary.columns;

                  var param = {
                    pageName: "DRS",
                    modelName: "DRS",
                    sectionName: "DRS_LIST_VIEW",
                  };
                  // const startNow = performance.now();
                  logiUiGridTableService
                    .getAndGenerateTableColumns(param)
                    .then(function (response) {
                      $scope.columnsData_drs = response;
                      logiHttpService
                        .get(url, "", null, "mileTrip")
                        .success(function (response) {
                          // $scope.wayPoints = {}
                          $scope.drsData = response.data.results;
                          var params = {
                            pageName: "DRS",
                            modelName: "DRS",
                            sectionName: "DRS_LIST_VIEW",
                          };
                          logiHttpService
                            .get("/LoginApp/framework/structure", "", params)
                            .success(function (response) {
                              $scope.columnStructure = response.columns;
                              // logiFormService.loadCustomFieldsTableData($scope.drsData[0]['deliveryRunSheet'], $scope.columnStructure);
                              $scope.printTableData = $scope.drsData;

                              // Bug #25973: Multiprint DRS - While printing DRS, these structure calls were in a for loop which were making unnecessary repeated API calls
                              var param = {
                                pageName: "DRS_CRATE",
                                modelName: "DRS_CRATE",
                                sectionName: "DRS_CRATE_LIST_VIEW",
                              };
                              logiUiGridTableService
                                .getAndGenerateTableColumns(param)
                                .then(function (response) {
                                  $scope.columnData_CrateDrs = response;
                                });

                              $scope.columnData_CrateDrs = response;
                              var dotParam = {
                                pageName: "DRS",
                                modelName: "DRS",
                                sectionName: "DRS_DOT_LIST_VIEW",
                              };
                              logiUiGridTableService
                                .getAndGenerateTableColumns(dotParam)
                                .then(function (response) {
                                  $scope.columnData_DOT = response;
                                });

                              $scope.crateItems = [];
                              var shipmentIds = [];
                              angular.forEach(
                                $scope.printTableData,
                                function (tripDTO, tripIndex) {
                                  shipmentIds[tripIndex] = [];
                                  $scope.crateItems[tripIndex] = [];

                                  $scope.printTableData[tripIndex][
                                    "deliveryMediumName"
                                  ] =
                                    $scope.selectedRows[tripDTO["tripId"]][
                                    "deliveryMediumName"
                                    ];
                                  $scope.printTableData[tripIndex][
                                    "routeName"
                                  ] =
                                    $scope.selectedRows[tripDTO["tripId"]][
                                    "routeName"
                                    ];
                                  $scope.printTableData[tripIndex]["tripName"] =
                                    $scope.selectedRows[tripDTO["tripId"]][
                                    "tripName"
                                    ];
                                  $scope.printTableData[tripIndex][
                                    "uniqueCustomerCount"
                                  ] =
                                    $scope.selectedRows[tripDTO["tripId"]][
                                    "uniqueCustomerCount"
                                    ];
                                  $scope.printTableData[tripIndex][
                                    "currVehicleNumber"
                                  ] =
                                    $scope.selectedRows[tripDTO["tripId"]][
                                    "vehicleNo"
                                    ];
                                  var shipmentIdsArray = [];
                                  $scope
                                    .getTripAdditionalData(tripDTO["tripId"])
                                    .then(function () {
                                      if (
                                        $scope.additionalTripData[
                                        tripDTO["tripId"]
                                        ]
                                      ) {
                                        $scope.additionalTripData[
                                          tripDTO["tripId"]
                                        ].totalPackageWeight = 0;
                                        $scope.additionalTripData[
                                          tripDTO["tripId"]
                                        ].totalPackageVolume = 0;
                                      }
                                      // const workerInput = JSON.stringify({
                                      //   tripDTO,
                                      //   additionalTripData:
                                      //     $scope.additionalTripData,
                                      //   shipmentIdsArray,
                                      //   shipmentIds,
                                      //   tripIndex,
                                      // });
                                      // let isWebworkerReceived = false;
                                      // ApiWorker.postMessage(workerInput);
                                      // ApiWorker.onmessage = (e) => {
                                      //   $scope
                                      //     .createOutletTableData(e.data);
                                      // }
                                      angular.forEach(tripDTO.deliveryRunSheet, function (shipmentDTO, shipmentIndex) {
                                        shipmentIds[tripIndex].push(shipmentDTO.shipmentId);
                                        if (!shipmentIdsArray.includes(shipmentDTO.shipmentId)) {
                                          if ($scope.additionalTripData[tripDTO['tripId']]) {
                                            $scope.additionalTripData[tripDTO['tripId']].totalPackageWeight += shipmentDTO.packageWeight == undefined ? 0 : shipmentDTO.packageWeight;
                                            $scope.additionalTripData[tripDTO['tripId']].totalPackageVolume += shipmentDTO.packageVolume == undefined ? 0 : shipmentDTO.packageVolume;
                                            shipmentIdsArray.push(shipmentDTO.shipmentId);
                                          }
                                        }
                                      })

                                      $timeout(() => {
                                        let isCallInProgress = false;
                                        $scope
                                          .createOutletTableData(
                                            tripDTO["tripId"]
                                          )
                                          .then(function (crateItems) {
                                            if (!isCallInProgress) {
                                              var url2 =
                                                logiConstants.order
                                                  .orderCrate +
                                                "?shipment_ids=" +
                                                shipmentIds[tripIndex];
                                              isCallInProgress = true;
                                              if (
                                                shipmentIds[tripIndex] &&
                                                shipmentIds[tripIndex].length
                                              ) {
                                                $scope.crateItems[
                                                  tripIndex
                                                ] = crateItems;
                                                if (
                                                  tripIndex ==
                                                  $scope.printTableData
                                                    .length -
                                                  1
                                                ) {
                                                  $timeout(function () {
                                                    isCallInProgress = false;
                                                    jQ(
                                                      ".loaderContainer"
                                                    ).hide();
                                                    // var tableScope = angular.element('#logiUiGrid').scope().$parent;
                                                    $scope.printCallback(
                                                      "multiDrs"
                                                    );
                                                  }, 3000);
                                                }
                                              } else {
                                                $scope.crateItems[
                                                  tripIndex
                                                ] = [];
                                                if (
                                                  tripIndex ==
                                                  $scope.printTableData
                                                    .length -
                                                  1
                                                ) {
                                                  $timeout(function () {
                                                    isCallInProgress = false;
                                                    jQ(
                                                      ".loaderContainer"
                                                    ).hide();
                                                    var tableDiv = angular.element(
                                                      ".rows-container"
                                                    );
                                                    $scope.printCallback();
                                                  }, 3000);
                                                }
                                              }
                                            }
                                          });

                                        fillValueInStructureDRSSummary(
                                          $scope.additionalTripData[
                                          tripDTO["tripId"]
                                          ],
                                          $scope.printTableData[tripIndex],
                                          $scope.columnData_SummaryDrs
                                        );
                                      }, 0);
                                      // };

                                      // angular.forEach(, function (shipmentDTO, shipmentIndex) {
                                      //   shipmentIds[tripIndex].push(shipmentDTO.shipmentId);
                                      //   if (!shipmentIdsArray.includes(shipmentDTO.shipmentId)) {
                                      //     if ($scope.additionalTripData[tripDTO['tripId']]) {
                                      //       $scope.additionalTripData[tripDTO['tripId']].totalPackageWeight += shipmentDTO.packageWeight == undefined ? 0 : shipmentDTO.packageWeight;
                                      //       $scope.additionalTripData[tripDTO['tripId']].totalPackageVolume += shipmentDTO.packageVolume == undefined ? 0 : shipmentDTO.packageVolume;
                                      //       shipmentIdsArray.push(shipmentDTO.shipmentId);
                                      //     }
                                      //   }
                                      // })

                                      // $timeout(function() {
                                      //     jQ(".loaderContainer").hide();
                                      //     var tableScope = angular.element('#logiUiGrid').scope().$parent;
                                      //     tableScope.printCallback('multiDrs');
                                      // }, 3000)
                                    });
                                }
                              );
                            });
                        });
                    });
                });
            }
            // Bug #25973: Multiprint DRS - While printing DRS, an threshold limit is set to avoid page break
            if (!(Object.keys($scope.selectedRows).length <= 100)) {
              logiConversionService.showPrompt(
                $scope.dynamicLabels_printDrs.drsThresholdMsg,
                "error"
              );
            }
          });
        // })
      };

      const downloadStartedTripsReport = function (filters, filterListPayload, file) {
        var url = '',
          data = {},
          shipmentData = [];


        var resourceUrl = '';


        if (filters) {
          if (filters['searchBy']) {
            data['searchBy'] = filters['searchBy'];
          }
          if (filters['searchText']) {
            data['searchText'] = filters['searchText'];
          }
          if (filters['startDateFilter'] && filters['endDateFilter']) {
            data['startDateFilter'] = filters['startDateFilter'];
            data['endDateFilter'] = filters['endDateFilter'];
          }
        }

        if (file == 'Excel') {
          var config = {};
          resourceUrl = logiConstants.mileTrip.downloadTrips + '?status=STARTED';
          url = resourceUrl;
          if (location.hostname.indexOf('localhost') >= 0) {
            url = $rootScope.environment + resourceUrl;
          }
          if (JSON.parse(localStorage.getItem('userAccessInfo'))['modelType'] != "OD") {
            config = {
              method: "POST",
              url: url,
              data: logiConversionService.filterParam,
              params: data,
              headers: {
                'Content-Type': 'application/json'
              },
              withCredentials: false,
              responseType: 'arraybuffer'
            };
          }
          if (location.hostname.indexOf('localhost') >= 0) {
            config.params['access_token'] = JSON.parse(localStorage.getItem('userAccessInfo'))['accessToken'].split('BASIC ')[1].trim();
            config.params['CLIENT_SECRET_KEY'] = JSON.parse(localStorage.getItem('userAccessInfo'))['CLIENT_SECRET_KEY']
          }
          $http(config).success(function (data, status, headers) {

            $rootScope.showDownloadSDLR = false;
            if (JSON.parse(localStorage.getItem('userAccessInfo'))['modelType'] != "OD") {
              saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), 'Started Trips Report' + ".xlsx");
            }
          }).error(function () {

          });
        }

      };

      $scope.printMultiDrs = _.debounce(printMultiDrs, 3000);
      $scope.downloadStartedTripsReport = _.debounce(downloadStartedTripsReport, 3000);

    }
  );
