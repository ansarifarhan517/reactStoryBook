var _ = require('underscore');
import { func } from 'prop-types';

import React, { Suspense } from 'react';
import { Loader, Position } from 'ui-library'

const OrderListView = React.lazy(() => import(/* webpackChunkName: "OrderListView" */ './OrderListView'));

function OrderListViewLazy(props) {
  return (
    <div>
      <Suspense fallback={
        <Position type='relative'>
          <Loader center fullScreen />
        </Position>}>
        <OrderListView {...props} />
      </Suspense>
    </div>
  );
}

angular.module('order').value('OrderListView', OrderListViewLazy);

angular.module('order').controller('OrderListViewCtrl', function ($q,$rootScope, $scope, $state, $timeout,logiConstants,logiHttpService,orderService,logiConversionService,dlcService,logiFormService,crateService) {
  $rootScope.menuActive = 'Order';
  $scope.currentPage = "order"
  $scope.orderService = orderService;
  $scope.dlcService = dlcService;
  $scope.logiConversionService = logiConversionService;
  // var pageParams = (params['mode'] ? params['pageParams'] : angular.copy(logiSearchSortService.pageParam));
  $scope.manualAssignmentPopupFl = false;
  $scope.props = {
    ngStateRouter: $state,
    manualAssignmentCallBack: function (selectedRow) {
      $scope.showManualAssignmentPopup(selectedRow)
    },
    renderOrderCrateModal: function(shipmentId,selectedRow){
      $scope.renderOrderCrateModal(shipmentId,selectedRow)
    },
    optimizeCrates: function(value) {
        $scope.optimizeCrates(value)
    },
    changeModeOfCrate: function(value) {
        $scope.changeModeOfCrate(value)
    },
    printAwb: function(selectedRow,filters){
      $scope.printAwb(selectedRow,filters)
    },
    toggle_DLC_modal: function(selectedRows){
        $scope.toggle_DLC_modal(selectedRows)
    },
    openShippingCostPopup: function(shipmentId){
        $scope.openShippingCostPopup("ACTUAL",shipmentId)
    }
  }

  
  $scope.showManualAssignmentPopup = function (selectedRow) {
    $scope.delaySuggestTripsForSmoothAnimation = false;
    $rootScope.FilterExists = true;
    $timeout(function () {
      if (selectedRow && Object.keys(selectedRow).length > 1) {
        logiConversionService.showPrompt(($rootScope.dynamicLabelsNavbar && $rootScope.dynamicLabelsNavbar.live_suggestTripsSingleOrderWarning) ? $rootScope.dynamicLabelsNavbar.live_suggestTripsSingleOrderWarning : "Please select only one Order for this action", "error");
        return false;
      }


      if (selectedRow[Object.keys(selectedRow)[0]] && !selectedRow[Object.keys(selectedRow)[0]]['isGeocoded']) {
        logiConversionService.showPrompt(($rootScope.dynamicLabelsNavbar && $rootScope.dynamicLabelsNavbar.live_suggestTripsGeocodingWarning) ? $rootScope.dynamicLabelsNavbar.live_suggestTripsGeocodingWarning : "Suggest Trips works for Geocoded Orders only. Please geocode the Order to continue.", "error");
        return false;
      }

      $scope.modalHeader = 'Suggested Trips';

      $scope.liveCustomParams = {
        "customLogic": "suggestTrips",
        "skipOrdersCall": true,
        "skipDbsCall": true,
        "skipTripsCall": true,
        "skipDbMapPlotCall": true,
        "lnlLiveInsideModal": true,
        "selectedOrders": selectedRow,
        "mode": "suggestTrips",
      }

      $scope.listenToLiveFlowCompletedEvent = $rootScope.$on('liveFlowCompleted', function (event, data) {
        console.log('Event caught : ', data);
        $scope.handleLiveFlowCompletedEvent_callback(data);
      });

      $timeout(function () {
        $scope.manualAssignmentPopupFl = true;
        $timeout(function () {
          $scope.delaySuggestTripsForSmoothAnimation = true;
        }, 900)
      }, 0)
    }, 0)

  }


  $scope.renderOrderCrateModal = function (shipmentId,row) {
    if (shipmentId) {
        $scope.crateType = "a";
        $scope.isCrateOptimized = false;
        $scope.crateShipmentId = shipmentId.toString()
        $scope.defaultCrateIndex = -1;
        // var id = event.target.getAttribute('id');
        var url = logiConstants.order.orderCrate;
        $scope.showReasonModal = false;
        logiHttpService.get(url, {}, { 'shipment_ids': $scope.crateShipmentId }).success(function (response) {
            // angular.element('#orderWrapper .modal-dialog').width(1172)
            $scope.crateItems = response.data;
            angular.forEach($scope.crateItems, function (value) {
                // value.id = value.crateCd;
                // value['noOfUnits']=value.crateQuantity ?  value.crateQuantity :'';
                value.noOfPackedItems = value.shipmentlineitems.length;
                value.shipmentlineitems.forEach(function (lineItem) {
                    lineItem.id = lineItem.id;
                })
                if (value.isOptimizedCrate) {
                    $scope.isCrateOptimized = true;
                    $scope.isAllDefaults = false;
                    crateService.allCrates = angular.copy($scope.crateItems);
                    return;
                }
            })
            $scope.orderDetails = row
            $scope.modalHeader = $scope?.dynamicLabels?.viewItemDetails;
            $scope.showCrateModal = true;
            $scope.crateModal = true;
            // $scope.resizePopup()
        });
    }
};

    $scope.defaultCrateIndex = -1;
    $scope.optimizeCrates = function (value) {
        jQ('.loaderContainer').show();
        $scope.defaultCrateIndex = -1;
        $scope.isCrateOptimized = false;
        var url = logiConstants.order.optimizeCrate;
        logiHttpService.post(url, value).success(function (response) {
            $timeout(function () {
                $scope.crateItems = response.data;
                for (var key = 0; key < $scope.crateItems.length; key++) {
                    var value = $scope.crateItems[key];
                    value.id = value.crateCd;
                    // value['noOfUnits']=value.crateQuantity ?  value.crateQuantity :'';
                    value.noOfPackedItems = value.shipmentlineitems.length;
                    value.shipmentlineitems.forEach(function (lineItem) {
                        lineItem.id = lineItem.itemCd;
                    })
                    if (value.crateName == "Default Crate") {
                        value.crateId = crateService.generateRandomID()
                        $scope.defaultCrateIndex = key;
                    }
                    if (value.isOptimizedCrate) {
                        if (!$scope.isCrateOptimized) {
                            $scope.isCrateOptimized = true;
                        }
                    }
                }
                crateService.allCrates = _.map($scope.crateItems, _.clone);
                jQ('.loaderContainer').hide();
            }, 0);
            if (response) {
                logiConversionService.showPrompt(response.message);
            }
        });
    }

    $scope.changeModeOfCrate = function (value) {
        $scope.crateItems = _.map(value, _.clone);
    }

  $scope.cancelReasonPopup = function () {
    $scope.manualAssignmentPopupFl = false;
    $scope.delaySuggestTripsForSmoothAnimation = false;
    $scope.crateModal = false;

  }

  $scope.printAwb = function (selectedRows,filters,dynamicLabels) {
    $scope.selectedRows = selectedRows;
    $scope.dynamicLabels = dynamicLabels;
    if (Object.keys($scope.selectedRows).length < 1) {
        logiConversionService.showPrompt($scope.dynamicLabels.pleaseSelectAtLeastAnOrder, 'failure');
        return;
    }
    $scope.shippedBy = JSON.parse(localStorage.getItem('userAccessInfo'))['subClients'][0].name;
    if (null != logiConversionService.propertiesMapping['AWBGENERATIONMETHOD']) {
        var divName = logiConversionService.propertiesMapping['AWBGENERATIONMETHOD'];
        var divToPrint = document.getElementById(divName);
        var shipmentIds = Object.keys($scope.selectedRows);
        if (divName === 'HUNGRYHARVEST') {
            var selectedRows = {};
            filters.dataFetchMode= "DATA"
            filters.enabledColumn="STATECODE"
            logiHttpService.loadData("/ShipmentApp/shipment/fmlm", filters, "", "").success(function (data) {
                var response = data.data.results;
                angular.forEach($scope.selectedRows, function (value, key) {
                    if (response.length)
                        selectedRows[key] = (_.filter(response, { 'id': parseInt(key) }))[0];
                })
                $scope.awbData = $scope.selectedOrders = [];
                $scope.selectedOrders = angular.copy(selectedRows);
                angular.forEach($scope.selectedOrders, function (value, key) {
                    if (value && value.customFields) {
                        var ordersCustomFieldArray = JSON.parse(value.customFields)
                        if (ordersCustomFieldArray && ordersCustomFieldArray.length) {
                            angular.forEach(ordersCustomFieldArray, function (cField) {
                                if (cField.value) {
                                    if (cField.field === 'cf_customizedHarvest')
                                        value[cField.field] = (((cField.value).toLowerCase()) === 'y') ? 'Custom' : '';
                                    else
                                        value[cField.field] = cField.value;
                                }
                            });
                        }
                    }
                    if (value && value.deliverStartTimeWindow) {
                        value.deliverStartTimeWindow = moment.utc(value.deliverStartTimeWindow).local().format('MM/DD/YY')
                    }
                    if (value && value.addressDetails) {
                        value.addressDetails = value.addressDetails.replace(/,/g, ", ");
                        var lastIndex = value.addressDetails.lastIndexOf(",");
                        if (value.deliverPinCode) {
                            var splitedAdd = value.addressDetails.split(',');
                            var newSplitedAdd = splitedAdd.splice(splitedAdd.length - 2, 1);
                            value.addressDetails = (_.difference(splitedAdd, newSplitedAdd).toString());
                        }
                        else
                            value.addressDetails = value.addressDetails.substring(0, lastIndex);
                    }
                });
                var selectedShipmentIds = (_.map($scope.selectedOrders, 'shipmentId')).toString();
                var url = logiConstants.order.orderCrate;
                var crateItems = [];
                logiHttpService.get(url, {}, { 'shipment_ids': selectedShipmentIds }).success(function (response) {
                    var crateItems = response.data;
                    angular.forEach(crateItems, function (value) {
                        var order = {};
                        order = _.find($scope.selectedOrders, { shipmentId: value.shipmentDetailsId })
                        if (order.shipmentCrateDetails) {
                            order.shipmentCrateDetails.push(value)
                        } else {
                            order.shipmentCrateDetails = [];
                            order.shipmentCrateDetails.push(value)
                        }
                    });
                    angular.forEach($scope.selectedOrders, function (value, key) {
                        if (value.shipmentCrateDetails && value.shipmentCrateDetails.length) {
                            angular.forEach(value.shipmentCrateDetails, function (item) {
                                item.capitalizedCrateType = logiConversionService.toCapitalized(item.crateType)
                            });
                            value.shipmentCrateDetails = _.uniq(value.shipmentCrateDetails, 'capitalizedCrateType');
                            value.shipmentCrateDetails = _.sortBy(value.shipmentCrateDetails, ['capitalizedCrateType']);
                            angular.forEach(value.shipmentCrateDetails, function (item) {
                                if (item.capitalizedCrateType === $scope.dynamicLabels.hungryHarvestNeverList || item.capitalizedCrateType === $scope.dynamicLabels.hungryHarvestRemoveItem) {
                                    item.shipmentChunkedlineitems = chunk(item.shipmentlineitems, 3);
                                }
                            });
                            value.foundAddOnContents = _.some(value.shipmentCrateDetails, { 'capitalizedCrateType': $scope.dynamicLabels.hungryHarvestAddOn });
                            value.foundHarvestContents = _.some(value.shipmentCrateDetails, { 'capitalizedCrateType': $scope.dynamicLabels.hungryHarvestContents });
                            value.foundNeverList = _.some(value.shipmentCrateDetails, { 'capitalizedCrateType': $scope.dynamicLabels.hungryHarvestNeverList });
                        }
                    });
                });
                $scope.awbData = $scope.selectedOrders;
                var style = '' +
                    '<style type="text/css">' +
                    'qr img{' +
                    ' width: 100px;' +
                    '}' +
                    '</style>';
                $timeout(function () { // wait until all resources loaded
                    printAwbDiv(style, divToPrint.outerHTML);
                }, 1500);
            }).error(function () {
                logiConversionService.showPrompt($rootScope.buttonLabels.somethingWendWrong, "error");
            });
        }
        else {
            logiHttpService.get(logiConstants.order.getAwbData + '?shipmentIds=' + shipmentIds).success(function (awbResponse) {
                $scope.awbData = awbResponse.data;

                angular.forEach($scope.awbData[0].clientNodeDTOs, function (locationObject) {
                    while (locationObject.address.indexOf(",,") >= 0 || locationObject.address.indexOf(", ,") >= 0) {
                        locationObject.address = locationObject.address.replace(/,,/g, ",");
                        locationObject.address = locationObject.address.replace(/, ,/g, ",");
                    }
                });
                if (divName == "NOONEXPRESS" || divName == 'TRANSGUARD') {
                    $scope.fillCityCode(null, null, divName);

                    $timeout(function () { // wait until all resources loaded
                        printAwbDiv(style, divToPrint.outerHTML);
                    }, 1500);
                } else {
                    var style = '' +
                        '<style type="text/css">' +
                        'qr img{' +
                        ' width: 100px;' +
                        '}' +
                        '</style>';
                    $timeout(function () { // wait until all resources loaded
                        printAwbDiv(style, divToPrint.outerHTML);
                    }, 500);

                }
                // if("HONESTBEE" ==divName){
                //     angular.element('#awbNoBarcode').css({'width':'200px!important','height':'65px!important'});
                // }
                // angular.forEach($scope.awbData, function(rowData) {
                //     var address = '';
                //     // var address = rowData.awbNumber + ' ';
                //     address += (rowData.clientNodeDTOs[0].clientNodeType == 'to') ? (rowData.clientNodeDTOs[0].name !== null) ? rowData.clientNodeDTOs[0].name : '' : (rowData.clientNodeDTOs[1].name !== null) ? rowData.clientNodeDTOs[1].name : '';
                //     if (address.length > 0)
                //         address += ' ';
                //     address += (rowData.clientNodeDTOs[0].clientNodeType == 'to') ? (rowData.clientNodeDTOs[0].apartment !== null) ? rowData.clientNodeDTOs[0].apartment : '' : (rowData.clientNodeDTOs[1].apartment !== null) ? rowData.clientNodeDTOs[1].apartment + ' ' : '';
                //     address += (rowData.clientNodeDTOs[0].clientNodeType == 'to') ? (rowData.clientNodeDTOs[0].streetName !== null) ? rowData.clientNodeDTOs[0].streetName : '' : (rowData.clientNodeDTOs[1].streetName !== null) ? rowData.clientNodeDTOs[1].streetName : '';
                //     if (address.length > 0)
                //         address += ' ';
                //     address += (rowData.clientNodeDTOs[0].clientNodeType == 'to') ? (rowData.clientNodeDTOs[0].pincode !== null) ? rowData.clientNodeDTOs[0].pincode : '' : (rowData.clientNodeDTOs[1].pincode !== null) ? rowData.clientNodeDTOs[1].pincode : '';
                //     rowData['awbString'] = address;
                // });

            });
        }

    }

}
    //function to print awb numbers
    function printAwbDiv(style, data) {
      var newWin = open("");
      var is_chrome = Boolean(newWin.chrome);
      newWin.document.open("text/html");
      newWin.document.write("<html><head>");
      // newWin.document.write(style);
      newWin.document.write("</head><body>");
      newWin.document.write(data);
      newWin.document.write('</body></html>');

      if (is_chrome) {
          setTimeout(function () { // wait until all resources loaded
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
  $scope.fillCityCode = function (style, divToPrintOuterHtml, divName) {
    var cityList = [];
    var city = {};
    var awb = {};
    angular.forEach($scope.awbData, function (row) {
        row['ret_City_Code'] = null;
        row['to_City_Code'] = null;
        angular.forEach(row.clientNodeDTOs, function (node) {
            if (null != node.city && cityList.indexOf(node.city) < 0) {
                cityList.push(node.city);
            }
        });
        // LN-1492: For TRANSGUARD, shipper address was Branch Address which is being replaced with Rows originAddress
        if (divName == 'TRANSGUARD') {
            angular.forEach($scope.awbData, function (eachAwbData) {
                angular.forEach($scope.selectedRows, function (eachSelectedRow) {
                    if (((eachSelectedRow.isP2POrder && eachSelectedRow.isP2POrder == true) || eachSelectedRow.orderType == 'PICKUP')  && eachAwbData.shipmentId == eachSelectedRow.shipmentId) {
                        if (eachAwbData.clientNodeDTOs) {
                            eachAwbData.clientNodeDTOs[0].originAddress = eachSelectedRow.originAddress;
                            eachAwbData.clientNodeDTOs[2].originAddress = eachSelectedRow.originAddress;
                            eachAwbData.clientNodeDTOs[0].pickupname = eachSelectedRow.pickupAccountName;
                            eachAwbData.clientNodeDTOs[2].pickupname = eachSelectedRow.pickupAccountName;
                            eachAwbData.clientNodeDTOs[0].pickupContactName = eachSelectedRow.originClientNodePhone;
                            eachAwbData.clientNodeDTOs[2].pickupContactName = eachSelectedRow.originClientNodePhone;


                        }
                    }
                });
            });
        }
        // End of Code LN-1492
    });
    let url = logiConstants.order.cityCode;
    logiHttpService.get(url).success(function (data) {
        angular.forEach(data, function (subData) {
            var key = subData.clientRefMasterCd;
            var value = subData.clientRefMasterDesc;
            city[key] = null;
            city[key] = value;
        });
        angular.forEach($scope.awbData, function (row) {
            var to_City_Code = null;
            var ret_City_Code = null;
            angular.forEach(row.clientNodeDTOs, function (node) {
                if (null != node.city && Object.keys(city).indexOf(node.city) >= 0) {
                    if (node.clientNodeType == 'to') {
                        var cityCode = city[node.city];
                        if (null != cityCode) {
                            to_City_Code = cityCode;
                        }
                    }
                    if (node.clientNodeType == 'return') {
                        var cityCode = city[node.city];
                        if (null != cityCode) {
                            ret_City_Code = cityCode;
                        }
                    }
                }
            });
            row['ret_City_Code'] = ret_City_Code;
            row['to_City_Code'] = to_City_Code;
        });
        // setTimeout(function() {
        //     printAwbDiv(style, divToPrintOuterHtml);
        // }, 500)

    });
}
  $scope.toggle_DLC_modal = function (selectedRows) {
    dlcService.toggleModal();
    if (dlcService.isModalActive) {
        var selectedOrderKeys = Object.keys(selectedRows);
        if (selectedOrderKeys.length == 1) {
            var selectedOrderObj = selectedRows[selectedOrderKeys[0]];
            dlcService.initialize(selectedOrderKeys[0], 'orders');
        } else {

        }
    }
}

    // Initialize data for shipping cost popup    
    $scope.shippingCostPopupFl = false;
    $scope.shippingCostPopupDto = null;


    // Function to close shipping cost popup
    $scope.closeShippingCostPopup = function () {
        $scope.shippingCostPopupFl = false;

        // destroy the current cost dto
        $timeout(function () {
            $scope.shippingCostPopupDto = null;
        }, 0);
    }
    // Function to open shipping cost popup
    $scope.openShippingCostPopup = function (mode, params) {
        // mode: actual(be able to fill up) / estimated(read only)
        // params: the shipment details
        var thisFuncPromise = $q.defer();

        // 1. Show the modal with shadow loading of content
        $scope.shippingCostPopupFl = true;



        // 1. Prepare the data/dto for the popup
        $timeout(function () {
            $scope.prepareShippingCostPopup(mode, params).then(
                function () {
                    // success
                    thisFuncPromise.resolve();
                },
                function () {
                    // error
                    $scope.shippingCostPopupFl = false;
                    $scope.shippingCostPopupDto = null;
                    thisFuncPromise.reject();
                });

        })

        return thisFuncPromise.promise;
    }


    $scope.prepareShippingCostPopup = function (mode, params) {
        // mode : actual (be able to fill up) / estimated (read only)
        // params : shipmentId and other fields etc

        var thisFuncPromise = $q.defer();

        // Get form structure
        logiFormService.getFromJSON(logiConstants.order["getShippingCostStructure_" + (mode || 'ACTUAL')]).then(function (structure) {
            // $http.get('order/partial/shippingCostPopup/dummyJsons/structure_' + (mode || 'ACTUAL') + '.json').success(function (structure) {

            // Get cost data
            logiHttpService.post(logiConstants.order.getShippingCostData + '?shipmentId=' + (params) + '&shippingCostType=' + (mode || 'ACTUAL'), null, '').success(function (response) {
                // $http.get('order/partial/shippingCostPopup/dummyJsons/shippingCost_' + (mode || 'ACTUAL') + '.json').success(function (response) {

                // Parse and mash both structure and data into 1 single DTO which is bound to the HTML
                // 1. Parse the structure, fill in the data inside it

                var shippingCostPopupDto = {
                    "structure": angular.copy(structure),
                    "data": angular.copy(response && response.data),
                    "mode": mode || 'ACTUAL',
                    "loaded": true,
                    "specialSections": {
                        "handlingFees": true,
                        "miscellaneousFees": true
                    },
                    "specialSectionsStructure": {
                        "handlingFees": angular.copy(structure.handlingFees.skillType),
                        "miscellaneousFees": angular.copy(structure.miscellaneousFees.rateName)
                    },
                    "sectionPermissions": {},
                    "shipmentDetails": params,
                    "sectionKeys": [],
                    "sectionTitles": {},
                    "dropdownData": {},
                }

                shippingCostPopupDto = prepareShippingCostInternalDto(shippingCostPopupDto);

                // asynchronously fetch dynamic labels of the section keys
                logiHttpService.get(logiConstants.getDynamicLabels + shippingCostPopupDto.sectionKeys.join(",")).success(function (labels) {
                    shippingCostPopupDto.sectionTitles = labels;
                    $scope.shippingCostPopupDto = angular.copy(shippingCostPopupDto);

                    thisFuncPromise.resolve();
                });


            }).error(function (response) {

                var msg
                if (response && response['error']) {
                    msg = response['error'].order_0[0].message[0];
                } else if (response && response['hasError']) {
                    var msg;
                    if (response && response['hasError']) {
                        msg = response['message']
                    } else {
                        msg = $rootScope.buttonLabels.somethingWendWrong;
                    }
                } else {
                    msg = $rootScope.buttonLabels.somethingWendWrong;
                }
                logiConversionService.showPrompt(msg, 'error');
                thisFuncPromise.reject();

            })


        });


        return thisFuncPromise.promise;

    }



    var prepareShippingCostInternalDto = function (shippingCostPopupDto) {
        // The final cost being shown on the top of the popup will be this superCost. Don't want ng-if's in HTML
        var mode = shippingCostPopupDto.mode;
        shippingCostPopupDto.data.superTotal = (!mode || mode == 'ACTUAL') ? shippingCostPopupDto.data.shippingCost_total : shippingCostPopupDto.data.shippingCost_total;

        var specialSections = shippingCostPopupDto.specialSections;

        angular.forEach(shippingCostPopupDto.structure, function (section, sectionKey) {

            // Show a section only if your section-object is present in the data structure
            if ((shippingCostPopupDto.data && shippingCostPopupDto.data[sectionKey] && Object.keys(shippingCostPopupDto.data[sectionKey]))) {
                shippingCostPopupDto.sectionPermissions[sectionKey] = true
            } else {
                shippingCostPopupDto.sectionPermissions[sectionKey] = false
            }

            if (!specialSections[sectionKey]) {
                angular.forEach(section, function (field, fieldKey) {

                    // attach the input template if valid
                    (field && field.fieldType && field.permission) ? field.template = 'order/partial/shippingCostPopup/editFields/logi' + orderService.toCapitalized(field.fieldType) + '.html' : null;

                    // attach the totalValue (rightmost value) to this field/row <readonly>
                    if (sectionKey === 'locationFees') {
                        field.totalValue = shippingCostPopupDto.data && shippingCostPopupDto.data[sectionKey] && shippingCostPopupDto.data[sectionKey][fieldKey + 'Cost'] ? logiConversionService.convertvalue(shippingCostPopupDto.data[sectionKey][fieldKey + 'Cost']) : 0.00;
                    } else {
                        field.totalValue = shippingCostPopupDto.data && shippingCostPopupDto.data[sectionKey] && shippingCostPopupDto.data[sectionKey][fieldKey + '_total'] ? logiConversionService.convertvalue(shippingCostPopupDto.data[sectionKey][fieldKey + '_total']) : 0.00;
                    }

                    // fill in the model dto of the field (middle value) which can be editable/readonly
                    if (field.fieldType !== 'select') {
                        if (fieldKey == 'distance' || fieldKey == 'weight') {
                            field.value = shippingCostPopupDto.data && shippingCostPopupDto.data[sectionKey] ? parseFloat(logiConversionService.convertToConfig(shippingCostPopupDto.data[sectionKey][fieldKey], '', 'GET', fieldKey, 2)) : null;
                        } else {
                            field.value = shippingCostPopupDto.data && shippingCostPopupDto.data[sectionKey] ? shippingCostPopupDto.data[sectionKey][fieldKey] : null;
                        }
                    } else {
                        // select type field logic. Not valid here. All in this kind of section will be inputType.
                    }

                })
            } else if (specialSections[sectionKey] && shippingCostPopupDto.data[sectionKey]) {
                // if the section is special (having that add/remove button as well) and if the section has some content

                //this field is the template for all the upcoming fields
                var fieldsArray = [];

                // The template of the field which is going to be repeated in this section
                var repeatFieldKey = Object.keys(shippingCostPopupDto.structure[sectionKey])[0];
                var repeatFieldStructure = angular.copy((shippingCostPopupDto.structure[sectionKey][repeatFieldKey]));

                // Now parse the data DTO to generate the array of that field with values
                angular.forEach(shippingCostPopupDto.data[sectionKey], function (dataVal, arrIndex) {
                    var thisField = angular.copy(repeatFieldStructure);
                    // thisField.label = dataVal[repeatFieldKey];
                    thisField.label = dataVal[thisField.labelKey];
                    thisField.uiSelectModel = {
                        "id": thisField.labelKey,
                        "name": thisField.label,
                        "label": thisField.label,
                        "rate": dataVal[thisField.labelKey + "Cost"]
                    };
                    // thisField.value = logiConversionService.convertvalue(dataVal[repeatFieldKey + "Cost"]);
                    thisField.value = logiConversionService.convertvalue(dataVal[thisField.labelKey + "Cost"]);
                    fieldsArray.push(thisField);
                })

                // Finally - attach this fields array part to the structure so that HTML can parse it
                shippingCostPopupDto.structure[sectionKey] = angular.copy(fieldsArray);
            }

            // Push the section keys for later dynamic label generation
            shippingCostPopupDto.sectionKeys.push(sectionKey);

        });

        return shippingCostPopupDto;
    }
    
    // Recalculate the shipping cost - actual function
    $scope.recalculateShippingCost = function () {
        var thisFuncPromise = $q.defer();

        var newCostDto = angular.copy($scope.shippingCostPopupDto.data);

        angular.forEach($scope.shippingCostPopupDto.structure, function (section, sectionKey) {
            if ($scope.shippingCostPopupDto.sectionPermissions[sectionKey]) {

                if (!$scope.shippingCostPopupDto.specialSections[sectionKey]) {
                    // for non special sections
                    angular.forEach(section, function (field, fieldKey) {
                        if (fieldKey == 'distance' || fieldKey == 'weight') {
                            field.value = parseFloat(logiConversionService.convertToConfig(field.value, '', 'POST', fieldKey, 2));
                        }
                        newCostDto[sectionKey][fieldKey] = field.value;
                    });
                } else {
                    // for special sections
                    newCostDto[sectionKey] = [];
                    angular.forEach(section, function (field, index) {
                        if (field.uiSelectModel && field.uiSelectModel.id) {
                            // newCostDto[sectionKey][index] = field.uiSelectModel;
                            var obj = {};
                            if (field.isAdded) {
                                obj.isAdded = true;
                            }
                            obj[field.labelKey] = field.uiSelectModel.label;
                            obj[field.labelKey + "Cost"] = parseFloat(field.value ? field.value : field.uiSelectModel.rate);
                            newCostDto[sectionKey].map(function (obj1) {
                                if (obj1[field.labelKey] === obj[field.labelKey]) {
                                    obj1.isAdded = true;
                                    obj1.isRemoved = false;
                                    obj.isExist = true;
                                }
                            })
                            if (!obj.isExist) {
                                newCostDto[sectionKey][index] = obj;
                            }
                        }
                    });
                }

            }
        });

        if (newCostDto && newCostDto.handlingFees && deletedFees.skillType) {
            newCostDto.handlingFees.push(deletedFees);
            deletedFees = {};
        } else if (newCostDto && newCostDto.miscellaneousFees && deletedFees.rateName) {
            newCostDto.miscellaneousFees.push(deletedFees);
            deletedFees = {};
        }

        var url = logiConstants.order.recalculateCost + '?shipmentId=' + ($scope.shippingCostPopupDto.shipmentDetails.shipmentId) + '&shippingCostType=' + ($scope.shippingCostPopupDto.mode || 'ACTUAL');
        newCostDto["isSavedAsDraft"] = false;
        jQ('.loaderContainer').show();
        logiHttpService.post(url, newCostDto, '').success(function (response) {
            var shippingCostPopupDto = angular.copy($scope.shippingCostPopupDto);

            // update the data portion of the DTO
            shippingCostPopupDto.data = response.data;

            // now update the complete structure depending on the new data received
            shippingCostPopupDto = prepareShippingCostInternalDto(shippingCostPopupDto);

            //update the HTML
            $scope.shippingCostPopupDto = angular.copy(shippingCostPopupDto);
            jQ('.loaderContainer').hide();
            thisFuncPromise.resolve(response.data);

        })


        return thisFuncPromise.promise;
    }

// function to save the shipping cost data - DRAFT, PUBLISH
    $scope.saveShippingCostData = function (mode) {
        $scope.recalculateShippingCost().then(function (finalCostDto) {
            var finalDto = angular.copy(finalCostDto);
            var url = logiConstants.order.saveShippingCost;
            finalDto.shipmentId = $scope.shippingCostPopupDto &&  $scope.shippingCostPopupDto.shipmentDetails && $scope.shippingCostPopupDto.shipmentDetails.shipmentId ? $scope.shippingCostPopupDto.shipmentDetails.shipmentId : null;
            if (mode == 'saveAsDraft') {
                finalDto["isSavedAndSubmitted"] = false;
                finalDto["isSavedAsDraft"] = true;
            } else if (mode == 'saveAndPublish') {
                finalDto["isSavedAndSubmitted"] = true;
            }

            logiHttpService.put(url, finalDto, '', '').success(function (response) {
                finalDto = null;
                logiConversionService.showPrompt(response.message, 'success');
                $scope.closeShippingCostPopup();
                $scope.getOrderData();

            }).error(function (response) {
                finalDto = null;
                var msg
                if (response && response['error']) {
                    msg = response['error'].order_0[0].message[0];
                } else if (response && response['hasError']) {
                    var msg;
                    if (response && response['hasError']) {
                        msg = response['message']
                    } else {
                        msg = $rootScope.buttonLabels.somethingWendWrong;
                    }
                } else {
                    msg = $rootScope.buttonLabels.somethingWendWrong;
                }
                logiConversionService.showPrompt(msg, 'error');
                thisFuncPromise.reject();

            })

        })
    }



});