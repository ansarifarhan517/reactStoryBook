import React,{useState} from 'react';
import {Modal, ModalHeader,Box,useToast} from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import  axios from '../../../utils/axios'
import  DLCModalContent from '../SubComponent/DLCModalContent'
import { getFormattedDate } from '../../Order/OrderListOptionData/utils';
// import moment from 'moment';
let isPickupCheckinComplete =  false;
let isDeliverCheckinComplete = false;
const disallow_status_list = ['NOTDISPATCHED', 'CANCELLED', 'PARTIALLYDELIVERED'];  


const DLCModal = (props:any) => {
    const toast = useToast();
    const {showDLCModal,setShowDLCModal,selectedRows }  = props
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const [is_bad_order, set_is_bad_order] = useState<boolean>(false);
    // const [custom_form_data, set_custom_form_data] = useState([]);
    const[modal_structure, set_modal_structure] = useState<any>({});
    
    const [showContent, setShowContent]= useState<boolean>(false);

    const [orderData, setOrderData]= useState<any>({});
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
    
    const get_custom_form_data = async function() {
        
        var attempt_count = (selectedRows[Object.keys(selectedRows)[0]]?.noOfAttempts || 0);
        if (selectedRows[Object.keys(selectedRows)[0]]?.orderStatus == 'NOTPICKEDUP' || selectedRows[Object.keys(selectedRows)[0]]?.orderStatus == 'NOTDELIVERED' || (selectedRows[Object.keys(selectedRows)[0]]?.orderType == 'DELIVER' && selectedRows[Object.keys(selectedRows)[0]]?.orderStatus == 'DELIVERED') || (selectedRows[Object.keys(selectedRows)[0]]?.orderType == 'PICKUP' && selectedRows[Object.keys(selectedRows)[0]]?.orderStatus == 'PICKEDUP')) {
            if (attempt_count > 0) {
                attempt_count--;
            }
        }
        var urlParam = '?moduleId=' + selectedRows[Object.keys(selectedRows)[0]]?.shipmentId + '&moduleName=ORDERS&attemptCount=' + attempt_count;
        const response = await axios.get('/LoginApp/custom/form' + urlParam)
        if(response.data){
            var data = response ? response.data : [];
        }
        return data;
    }
    var get_structure_callback = function(response:any) {
        if (response.data) {
            set_modal_structure({section:response.data});
            // modal_structure.sections = response.data;
            Object.keys(modal_structure.sections).map((sectionKey)=> {
                // console.log(key,value)
                var tempObj = {};
                tempObj["id"] = sectionKey;
                tempObj["labelKey"] = sectionKey;
                tempObj["label"] = sectionKey;
                tempObj["steps"] = modal_structure.sections[sectionKey];
                modal_structure.sections[sectionKey] = tempObj;
                
            })
            getDropdownData();
            prepare_structure(modal_structure);
            


        }
    }

    const getDropdownData = async ()=> {
        
        if ((modal_structure.sections && modal_structure.sections?.pickup && modal_structure.sections.pickup.steps && modal_structure.sections.pickup.steps.payment && modal_structure.sections.pickup.steps.payment.childNodes && modal_structure.sections.pickup.steps.payment.childNodes.paymentType && modal_structure.sections.pickup.steps.payment.childNodes.cashDiffReason) || (modal_structure.sections && modal_structure.sections.deliver && modal_structure.sections.deliver.steps && modal_structure.sections.deliver.steps.payment && modal_structure.sections.deliver.steps.payment.childNodes && modal_structure.sections.deliver.steps.payment.childNodes.paymentType && modal_structure.sections.deliver.steps.payment.childNodes.cashDiffReason)) {
            modal_structure.sections.pickup.steps.payment.childNodes.paymentType.dropdownOptions = [];
            modal_structure.sections.deliver.steps.payment.childNodes.paymentType.dropdownOptions = [];
            modal_structure.sections.pickup.steps.payment.childNodes.cashDiffReason.dropdownOptions = [];
            modal_structure.sections.deliver.steps.payment.childNodes.cashDiffReason.dropdownOptions = [];
            const getPaymentDropdown = async function() {
                var url = "/ClientApp/client/getByTypeAndId?type=paymentSubType";
                const data = await axios.get(url)
                if(data.data){
                    modal_structure.sections.pickup.steps.payment.childNodes.paymentType.dropdownOptions = (data.data || data);
                    modal_structure.sections.deliver.steps.payment.childNodes.paymentType.dropdownOptions = (data.data || data);
                }
            }

            const getReasonDropdown = async function() {
                
                var urlCashTransaction = "/ClientApp/client/getByTypeAndId?type=CASHTRANSACTIONREASON";
                const data = await axios.get(urlCashTransaction)
                if(data.data){
                    modal_structure.sections.pickup.steps.payment.childNodes.cashDiffReason.dropdownOptions = (data.data || data);
                    modal_structure.sections.deliver.steps.payment.childNodes.cashDiffReason.dropdownOptions = (data.data || data);
                }
                
            }

            getPaymentDropdown()
            getReasonDropdown()
        }

    }
    var prepare_structure = function(structure:any) {
        Object.keys(structure.sections).map(function(section:any) {
            // for every section
            
            Object.keys(structure.sections[section].steps).map(function(eventTabKey:string) {
                // for every tab 
                if (structure.sections[section].steps[eventTabKey].permission && is_tab_allowed(structure.sections[section].steps[eventTabKey])) {
                    structure.sections[section].steps[eventTabKey].isComplete = false;
                    structure.sections[section].steps[eventTabKey].isLocked = true;
                    structure.sections[section].steps[eventTabKey].labelKey = (structure.sections[section].steps[eventTabKey].labelKey ? structure.sections[section].steps[eventTabKey].labelKey : eventTabKey);
                    Object.keys(structure.sections[section].steps[eventTabKey].childNodes).map(function(subValue:any) {

                        // for every question
                        //section, eventTab, subValue, subValueKey
                        set_parent_info_in_question(structure.sections[section],structure.sections[section].steps[eventTabKey],structure.sections[section].steps[eventTabKey].childNodes[subValue],subValue);
                        set_form_template(structure.sections[section], structure.sections[section].steps[eventTabKey], structure.sections[section].steps[eventTabKey].childNodes[subValue]);
                        set_data_in_structure(structure.sections[section], structure.sections[section].steps[eventTabKey], structure.sections[section].steps[eventTabKey].childNodes[subValue]);
                        // attach_events(structure.sections[section].steps[eventTabKey].childNodes[subValue]);

                    })
                } else {
                    //1. remove tabs with permission false
                    //2. remove DELIVERED_AFTER custom form is deliver checkout status is marked as attempted delivery (when packageStatusCd is NOTDELIVERED) 
                    removeTab(section, eventTabKey);
                }

            })
        });
        setTimeout(()=>{
            set_permissions();
        },1000)
        
        // is_prepare_structure_complete = true;
    }
    var removeTab = function removeTab(section:any, eventTabKey:any) {
        
        delete modal_structure.sections[section].steps[eventTabKey];
      };

    var set_parent_info_in_question = function(section:any, eventTab:any, subValue:any, subValueKey:any) {
        eventTab.sectionKey = section.labelKey;
        subValue.sectionKey = section.labelKey;
        subValue.key = subValueKey;
        subValue.stepKey = eventTab.labelKey;
        if (section.labelKey != 'pickup' && section.labelKey != 'deliver') {
            // custom form question
            subValue.customField = true;
        }
    }

    var set_form_template = function(section:any, eventTab:any, subValue:any) {
        if (subValue.fieldType == 'esign') {
            subValue.fieldType = 'file';
        }
        if (subValue.fieldType == 'radioGroup') {
            subValue.fieldType = 'radio';
        }
        if (subValue.fieldType == 'geocode') {
            subValue.fieldType = 'text';
        }
        if (section.labelKey == 'pickup' && orderData.startTimeWindowTZ) {
            // switch (subValue.labelKey) {
            //     case 'checkInTime':
            //         subValue.label += ' (' + self.dlc_labels['in'] + ' ' + moment().tz(orderData.startTimeWindowTZ).format('z') + ')';
            //         subValue.placeholder = self.dlc_labels['enterTimeIn'] + ' ' + moment().tz(orderData.startTimeWindowTZ).format('z');
            //         break;
            //     case 'checkOutTime':
            //         subValue.label += ' (' + self.dlc_labels['in'] + ' ' + moment().tz(orderData.startTimeWindowTZ).format('z') + ')';
            //         subValue.placeholder = self.dlc_labels['enterTimeIn'] + ' ' + moment().tz(orderData.startTimeWindowTZ).format('z');
            //         break;
            //     default:
            //         break;
            // }
        }
        if (section.labelKey == 'deliver' && orderData.endTimeWindowTZ) {
            // switch (subValue.labelKey) {
            //     case 'checkInTime':
            //         subValue.label += ' (' + self.dlc_labels['in'] + ' ' + moment().tz(orderData.endTimeWindowTZ).format('z') + ')';
            //         subValue.placeholder = self.dlc_labels['enterTimeIn'] + ' ' + moment().tz(orderData.endTimeWindowTZ).format('z');
            //         break;
            //     case 'checkOutTime':
            //         subValue.label += ' (' + self.dlc_labels['in'] + ' ' + moment().tz(orderData.endTimeWindowTZ).format('z') + ')';
            //         subValue.placeholder = self.dlc_labels['enterTimeIn'] + ' ' + moment().tz(orderData.endTimeWindowTZ).format('z');
            //         break;
            //     default:
            //         break;
            // }
        }
        // subValue.template = 'common/logi-' + subValue.fieldType + '/logi' + toCapitalized(subValue.fieldType) + 'Template.html';
        if (!subValue.id) {
            subValue.name = section.labelKey + '-' + eventTab.labelKey + '-' + subValue.labelKey;
            // subValue.id = angular.copy(subValue.name);
        } else {
            subValue.name = subValue.id;
        }
    }
    var set_data_in_structure = function(section:any, eventTab:any, subValue:any) {
        // var date_format = logiConversionService.propertiesMapping.DATEFORMAT.toUpperCase() + ' HH:mm';
        if (section.labelKey == 'pickup') {
            // pickup details section
            if (eventTab.labelKey == 'checkIn' || eventTab.labelKey == 'checkOut') {
                // when the question belongs to static steps - checkIn or checkOut
                switch (subValue.fieldName) {
                    case 'checkInTime':
                        if (orderData.pickupCheckInTime) {
                            subValue.value = getFormattedDate(orderData.pickupCheckInTime,"");
                            subValue.disabled = true;
                            eventTab.isComplete = true;
                            isPickupCheckinComplete = true;
                        } else {
                            //LN-3950: Opening update status on the first time page directly opens on check-out instead of check-in page
                            isPickupCheckinComplete = false;
                            //var maxDateMomentObj = moment(getFormattedDate(moment.utc());
                            //subValue.maxDate = new Date(maxDateMomentObj);
                        }
                        break;
                    case 'checkOutTime':
                        if (orderData.pickupCheckOutTime) {
                            subValue.value = getFormattedDate(orderData.pickupCheckOutTime,"");
                            subValue.disabled = true;
                            eventTab.isComplete = true;
                        } else {
                            if (orderData.pickupCheckInTime) {
                                // Do this later
                                // var minDateMomentObj = moment(get_timezone_date(parseInt(orderData.pickupCheckInTime) + 60000, orderData.pickupCheckInTimeTZ), date_format);
                                // subValue.minDate = new Date(minDateMomentObj);
                                // var maxDateMomentObj = moment(get_timezone_date(moment.utc() + 60000, orderData.startTimeWindowTZ), date_format);
                                // subValue.maxDate = new Date(maxDateMomentObj);
                            }
                        }
                        break;
                    case 'markAs':
                        if (orderData.packageStatusCd != 'INTRANSIT') {
                            subValue.permission = false;
                        }
                        if (subValue.childNodes && subValue.childNodes.pickedUp) {
                            subValue.value = subValue.childNodes.pickedUp.labelKey;
                            // self.attemptedPickupPermission = false;
                            modal_structure.sections.pickup.steps.checkOut.childNodes.reason.permission = false;
                            if (modal_structure.sections.pickup.steps.checkOut.childNodes.otherReason) {
                                modal_structure.sections.pickup.steps.checkOut.childNodes.otherReason.permission = false;
                            }
                        }
                        break;
                }
            } else if (eventTab.labelKey == 'payment') {
    
                eventTab.isComplete = ((orderData.pickupPaymentSubType || (orderData.pickupTobeCollected == 0)) && isPickupCheckinComplete) ? true : false;
                if (orderData.paymentType && orderData.paymentType.toUpperCase() != 'COD' && isPickupCheckinComplete) {
                    eventTab.isComplete = true;
                }
                if (eventTab.isComplete) {
                    subValue.disabled = true;
                }
                if (orderData.paymentType && orderData.paymentType.toUpperCase() == 'COD') {
                    // set_data_in_payment_form(section, eventTab, subValue);
                }
            } else {
                // If question belongs to custom form step
                // set_data_in_custom_field(section, eventTab, subValue);
            }
        } else if (section.labelKey == 'deliver') {
            // deliver details section
            if (eventTab.labelKey == 'checkIn' || eventTab.labelKey == 'checkOut') {
                // when the question belongs to static steps - checkIn or checkOut
                switch (subValue.fieldName) {
                    case 'checkInTime':
                        if (orderData.deliverCheckInTime) {
                            //subValue.value = get_timezone_date(parseInt(orderData.deliverCheckInTime), orderData.deliverCheckInTimeTZ);
                            subValue.disabled = true;
                            eventTab.isComplete = true;
                            isDeliverCheckinComplete = true;
                        } else {
                            if (orderData.pickupCheckOutTime) {
                                // var minDateMomentObj = moment(get_timezone_date(parseInt(orderData.pickupCheckOutTime), orderData.endTimeWindowTZ), date_format)
                                // subValue.minDate = new Date(minDateMomentObj);
                                // var maxDateMomentObj = moment(get_timezone_date(moment.utc(), orderData.endTimeWindowTZ), date_format);
                                // subValue.maxDate = new Date(maxDateMomentObj);
                            }
                        }
                        break;
                    case 'checkOutTime':
                        if (orderData.deliverCheckOutTime) {
                            subValue.value = getFormattedDate(orderData.deliverCheckOutTime,"");
                            subValue.disabled = true;
                            eventTab.isComplete = true;
                        } else {
                            if (orderData.deliverCheckInTime) {
                                // var minDateMomentObj = moment(getFormattedDate(orderData.deliverCheckInTime));
                                // subValue.minDate = new Date(minDateMomentObj);
                                // var maxDateMomentObj = moment(get_timezone_date(moment.utc() + 60000, orderData.endTimeWindowTZ), date_format);
                                // subValue.maxDate = new Date(maxDateMomentObj);
                            }
                        }
                        break;
                    case 'markAs':
                        var terminal_status_list = ['DELIVERED', 'NOTDELIVERED', 'CANCELLED'];
                        if (terminal_status_list.indexOf(orderData.packageStatusCd) != -1) {
                            subValue.permission = false;
                        }
                        if (subValue.childNodes && subValue.childNodes.delivered) {
                            subValue.value = subValue.childNodes.delivered.labelKey;
                            modal_structure.sections.deliver.steps.checkOut.childNodes.reason.permission = false;
                            if (modal_structure.sections.deliver.steps.checkOut.childNodes.otherReason) {
                                modal_structure.sections.deliver.steps.checkOut.childNodes.otherReason.permission = false;
                            }
                        }
                        break;
                    case 'reason':
                        break;
                }
            } else if (eventTab.labelKey == 'payment') {
    
                eventTab.isComplete = ((orderData.deliverPaymentSubType || (orderData.deliverTobeCollected == 0)) && isDeliverCheckinComplete) ? true : false;
                if (orderData.paymentType && orderData.paymentType.toUpperCase() != 'COD' && isDeliverCheckinComplete) {
                    eventTab.isComplete = true;
                }
                if (eventTab.isComplete) {
                    subValue.disabled = true;
                }
                if (orderData.paymentType && orderData.paymentType.toUpperCase() == 'COD') {
                    // set_data_in_payment_form(section, eventTab, subValue);
                }
            } else {
                // If question belongs to custom form step
                // set_data_in_custom_field(section, eventTab, subValue);
            }
        }
    }
    // var set_data_in_structure = function(section:any, eventTab:any, subValue:any) {
    //     if (section.labelKey == 'pickup') {
    //         // pickup details section
    //         if (eventTab.labelKey == 'checkIn' || eventTab.labelKey == 'checkOut') {
    //             // when the question belongs to static steps - checkIn or checkOut
    //             switch (subValue.fieldName) {
    //                 case 'checkInTime':
    //                     if (selectedRows[Object.keys(selectedRows)[0]].pickupCheckInTime) {
    //                         subValue.value = getFormattedDate(selectedRows[Object.keys(selectedRows)[0]].pickupCheckInTime);
    //                         subValue.disabled = true;
    //                         eventTab.isComplete = true;
    //                         // isPickupCheckinComplete = true;
    //                     } else {
    //                         //LN-3950: Opening update status on the first time page directly opens on check-out instead of check-in page
    //                         // isPickupCheckinComplete = false;
    //                         //var maxDateMomentObj = moment(get_timezone_date(moment.utc(), orderData.startTimeWindowTZ), date_format);
    //                         // subValue.maxDate = new Date(maxDateMomentObj);
    //                     }
    //                     break;
    //                 case 'checkOutTime':
    //                     if (selectedRows[Object.keys(selectedRows)[0]].pickupCheckOutTime) {
    //                         // subValue.value = get_timezone_date(parseInt(orderData.pickupCheckOutTime), orderData.pickupCheckOutTimeTZ);
    //                         subValue.disabled = true;
    //                         eventTab.isComplete = true;
    //                     } else {
    //                         if (selectedRows[Object.keys(selectedRows)[0]].pickupCheckInTime) {
    //                             // var minDateMomentObj = moment(get_timezone_date(parseInt(orderData.pickupCheckInTime) + 60000, orderData.pickupCheckInTimeTZ), date_format);
    //                             // subValue.minDate = new Date(minDateMomentObj);
    //                             // var maxDateMomentObj = moment(get_timezone_date(moment.utc() + 60000, orderData.startTimeWindowTZ), date_format);
    //                             // subValue.maxDate = new Date(maxDateMomentObj);
    //                         }
    //                     }
    //                     break;
    //                 case 'markAs':
    //                     if (selectedRows[Object.keys(selectedRows)[0]].packageStatusCd != 'INTRANSIT') {
    //                         subValue.permission = false;
    //                     }
    //                     if (subValue.childNodes && subValue.childNodes.pickedUp) {
    //                         subValue.value = subValue.childNodes.pickedUp.labelKey;
    //                         // self.attemptedPickupPermission = false;
    //                         modal_structure.sections.pickup.steps.checkOut.childNodes.reason.permission = false;
    //                         if (modal_structure.sections.pickup.steps.checkOut.childNodes.otherReason) {
    //                             modal_structure.sections.pickup.steps.checkOut.childNodes.otherReason.permission = false;
    //                         }
    //                     }
    //                     break;
    //             }
    //         } else if (eventTab.labelKey == 'payment') {

    //             eventTab.isComplete = ((selectedRows[Object.keys(selectedRows)[0]].pickupPaymentSubType || (selectedRows[Object.keys(selectedRows)[0]].pickupTobeCollected == 0))) ? true : false;
    //             if (selectedRows[Object.keys(selectedRows)[0]].paymentType && selectedRows[Object.keys(selectedRows)[0]].paymentType.toUpperCase() != 'COD' ) {
    //                 eventTab.isComplete = true;
    //             }
    //             if (eventTab.isComplete) {
    //                 subValue.disabled = true;
    //             }
    //             if (selectedRows[Object.keys(selectedRows)[0]].paymentType && selectedRows[Object.keys(selectedRows)[0]].paymentType.toUpperCase() == 'COD') {
    //                 // set_data_in_payment_form(section, eventTab, subValue);
    //             }
    //         } else {
    //             // If question belongs to custom form step
    //             // set_data_in_custom_field(section, eventTab, subValue);
    //         }
    //     } else if (section.labelKey == 'deliver') {
    //         // deliver details section
    //         if (eventTab.labelKey == 'checkIn' || eventTab.labelKey == 'checkOut') {
    //             // when the question belongs to static steps - checkIn or checkOut
    //             switch (subValue.fieldName) {
    //                 case 'checkInTime':
    //                     if (orderData.deliverCheckInTime) {
    //                         subValue.value = getFormattedDate(orderData.deliverCheckInTime);
    //                         subValue.disabled = true;
    //                         eventTab.isComplete = true;
    //                         // isDeliverCheckinComplete = true;
    //                     } else {
    //                         if (orderData.pickupCheckOutTime) {
    //                             // var minDateMomentObj = moment(get_timezone_date(parseInt(orderData.pickupCheckOutTime), orderData.endTimeWindowTZ), date_format)
    //                             // subValue.minDate = new Date(minDateMomentObj);
    //                             // var maxDateMomentObj = moment(get_timezone_date(moment.utc(), orderData.endTimeWindowTZ), date_format);
    //                             // subValue.maxDate = new Date(maxDateMomentObj);
    //                         }
    //                     }
    //                     break;
    //                 case 'checkOutTime':
    //                     if (orderData.deliverCheckOutTime) {
    //                         subValue.value = getFormattedDate(orderData.deliverCheckOutTime);
    //                         subValue.disabled = true;
    //                         eventTab.isComplete = true;
    //                     } else {
    //                         if (orderData.deliverCheckInTime) {
    //                             // var minDateMomentObj = moment(get_timezone_date(parseInt(orderData.deliverCheckInTime) + 60000, orderData.deliverCheckInTimeTZ), date_format);
    //                             // subValue.minDate = new Date(minDateMomentObj);
    //                             // var maxDateMomentObj = moment(get_timezone_date(moment.utc() + 60000, orderData.endTimeWindowTZ), date_format);
    //                             // subValue.maxDate = new Date(maxDateMomentObj);
    //                         }
    //                     }
    //                     break;
    //                 case 'markAs':
    //                     var terminal_status_list = ['DELIVERED', 'NOTDELIVERED', 'CANCELLED'];
    //                     if (terminal_status_list.indexOf(orderData.packageStatusCd) != -1) {
    //                         subValue.permission = false;
    //                     }
    //                     if (subValue.childNodes && subValue.childNodes.delivered) {
    //                         subValue.value = subValue.childNodes.delivered.labelKey;
    //                         modal_structure.sections.deliver.steps.checkOut.childNodes.reason.permission = false;
    //                         if (modal_structure.sections.deliver.steps.checkOut.childNodes.otherReason) {
    //                             modal_structure.sections.deliver.steps.checkOut.childNodes.otherReason.permission = false;
    //                         }
    //                     }
    //                     break;
    //                 case 'reason':
    //                     break;
    //             }
    //         } else if (eventTab.labelKey == 'payment') {

    //             // eventTab.isComplete = ((orderData.deliverPaymentSubType || (orderData.deliverTobeCollected == 0)) && isDeliverCheckinComplete) ? true : false;
    //             // if (orderData.paymentType && orderData.paymentType.toUpperCase() != 'COD' && isDeliverCheckinComplete) {
    //             //     eventTab.isComplete = true;
    //             // }
    //             // if (eventTab.isComplete) {
    //             //     subValue.disabled = true;
    //             // }
    //             // if (orderData.paymentType && orderData.paymentType.toUpperCase() == 'COD') {
    //             //     set_data_in_payment_form(section, eventTab, subValue);
    //             // }
    //         } else {
    //             // If question belongs to custom form step
    //             // set_data_in_custom_field(section, eventTab, subValue);
    //         }
    //     }
    // }
    var set_permissions = function() {
        const allowed_steps_map = {};
        if (modal_structure.sections['pickup'].steps['checkIn']) {
            modal_structure.sections['pickup'].steps['checkIn'].isLocked = false;
        }

        modal_structure.sections['pickup'].isActive = true;
        modal_structure.sections['deliver'].isLocked = true;
        Object.keys(modal_structure.sections).map(function(section:any) {
            allowed_steps_map[modal_structure.sections[section].labelKey] = [];
            var stepKeysList = Object.keys(modal_structure.sections[section].steps);
            stepKeysList.sort(function(a, b) {
                var keyA = modal_structure.sections[section].steps[a].fieldSequence;
                var keyB = modal_structure.sections[section].steps[b].fieldSequence;
                return keyA - keyB;
            });

            Object.keys(stepKeysList).map(function(stepKey:any, i:any) {
                if (modal_structure.sections[section].steps[stepKeysList[stepKey]].isComplete || modal_structure.sections[section].steps[stepKeysList[stepKey]].isSkipped) {
                    allowed_steps_map[modal_structure.sections[section].labelKey].push(stepKeysList[i]);
                    if (stepKeysList[i + 1]) {
                        allowed_steps_map[modal_structure.sections[section].labelKey].push(stepKeysList[i + 1]);
                    } else {
                        // unlock deliver accordion section
                        if (modal_structure.sections[section].labelKey == 'pickup' && selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd != 'NOTPICKEDUP') {
                            modal_structure.sections['deliver'].isLocked = false;
                            modal_structure.sections['deliver'].isActive = true;
                            modal_structure.sections['pickup'].isActive = false;
                            if (modal_structure.sections['deliver'].steps['checkIn']) {
                                modal_structure.sections['deliver'].steps['checkIn'].isLocked = false;
                            }
                        }
                    }
                }
            });

            if (selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'DELIVERED' || selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'NOTDELIVERED') {
                modal_structure.sections['deliver'].isLocked = false;
                modal_structure.sections['deliver'].isActive = true;
                modal_structure.sections['pickup'].isActive = false;
                // if (modal_structure.sections['deliver'].steps['checkIn']) {
                //     modal_structure.sections['deliver'].steps['checkIn'].isLocked = false;
                // }
            }


            if (section.labelKey == 'pickup') {
                if (selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'NOTPICKEDUP') {
                    var last_step_key = stepKeysList[stepKeysList.length - 1];
                    section.steps[last_step_key].hideSkip = true;
                }
            }

            if (section.labelKey == 'deliver') {
                var last_step_key = stepKeysList[stepKeysList.length - 1];
                section.steps[last_step_key].hideSkip = true;
            }

            allowed_steps_map[section].forEach(function(key:any) {
                modal_structure.sections[section].steps[key].isLocked = false;
            });
            
            // open last allowed unfinished tab. If none found, default to 'checkIn'.
            var targetTabKey = allowed_steps_map[section].slice(-1)[0] || 'checkIn';
            
            var targetTab = modal_structure.sections[section].steps[targetTabKey];
            
            changeTab(section, targetTab, targetTabKey);
        });
    }

    const changeTab = function(accordSection:any, eventTab:any, targetTabKey:any) {
        if (eventTab && !eventTab.isLocked) {
            Object.values(modal_structure.sections[accordSection].steps).map(function(tab:any) {
                
                tab.isActive = false;
            });
            eventTab.isActive = true;
            if (targetTabKey == 'payment') {
                //self.displayPaymentScreen(accordSection);
            }
        }

    }


    var is_tab_allowed = function(eventTab:any) {
        var permission = true;
        if (eventTab && eventTab.fieldName) {
            if (eventTab.fieldName == 'DELIVERED_AFTER' && selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'NOTDELIVERED') {
                permission = false;
            }
            if (eventTab.fieldName == 'NOTDELIVER_AFTER' && selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'DELIVERED') {
                permission = false;
            }
            if (eventTab.fieldName == 'NOTPICKED-UP_AFTER' && (selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'PICKEDUP' || selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'DELIVERED' || selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'NOTDELIVERED')) {
                permission = false;
            }
            if (eventTab.fieldName == 'PICKEDUP_AFTER' && selectedRows[Object.keys(selectedRows)[0]]?.packageStatusCd == 'NOTPICKEDUP') {
                permission = false;
            }
        }
        return permission;
    }

    const get_structure = async function() {
        
        var url = '/LoginApp/framework/structure/dlc?shipmentId=' + selectedRows[Object.keys(selectedRows)[0]]?.shipmentId;
        // While fetching structure, we send the form ids for which custom form data is received from the get_custom_form_data() function. 
        // Scenario: Let's say you've filled a custom form CHECKIN_AFTER in pickup leg and saved the data.
        // Next, if you disable the CHECKIN_AFTER form from the custom form settings page and then revisit the order DLC popup for the order,
        // you will not see the CHECKIN_AFTER custom form step even though it was filled previously and contains data. 
        // To solve this problem, backend separately fetches structures for those custom forms where data is already saved 
        // and send them with the Order DLC structure, irrespective of whether the access for that form is enabled or disabled. 
        let custom_form_data_map = {'PICKUP': {},
        'DELIVER': {}}
        const data = await axios.post(url, custom_form_data_map)
        if(data.data){
            get_structure_callback(data.data);
            
        }else{
            toast.add('Could not fetch structure!', 'error', false);
        }
    }
    const get_order_data = async function() {
        
        var url = "/ShipmentApp/shipment/fmlm/progress" + '?shipmentId=' + selectedRows[Object.keys(selectedRows)[0]].shipmentId;
        const data = await axios.get(url)
        
        if(data.data){
            setOrderData(data.data[0]);
            
            // orderData = response[0];
            // orderData.pickupActualCashAmount = orderData.pickupActualCashAmount ? orderData.pickupActualCashAmount : 0;
            // orderData.deliverActualCashAmount = orderData.deliverActualCashAmount ? orderData.deliverActualCashAmount : 0;
            // orderData.pickupCashAmount = orderData.pickupCashAmount ? orderData.pickupCashAmount : 0;
            // orderData.shippingCost = orderData.shippingCost ? orderData.shippingCost : 0;
            // orderData.deliverCashAmount = orderData.deliverCashAmount ? orderData.deliverCashAmount : 0;
            // orderData.pickupTobeCollected = (orderData.pickupCashAmount) - orderData.pickupActualCashAmount;
            // orderData.deliverTobeCollected = (orderData.deliverCashAmount + orderData.shippingCost) - orderData.deliverActualCashAmount;
            // deferred.resolve(orderData);
        };
        return "done";
        
    }
    React.useEffect(() => {
        set_is_bad_order((disallow_status_list.indexOf(selectedRows[Object.keys(selectedRows)[0]]?.orderStatus) != -1 || !selectedRows[Object.keys(selectedRows)[0]]?.tripId))
    }, [selectedRows])
    React.useEffect(()=>{
        
        if(!is_bad_order && showDLCModal){
            get_order_data().then(()=>{
                
                get_custom_form_data().then(()=>{
                    
                    get_structure();
                    setTimeout(()=>{
                        setIsDataLoaded(true);
                        setTimeout(()=>{
                            setShowContent(true);    
                        },3000)
                        
                        
                    },100)
                });
            });
        }
    },[showDLCModal])


    return <Modal
    open={isDataLoaded}
    onToggle={(value: boolean) => {
        setIsDataLoaded(value);
    }}
    width="600px"
    children={{
        header: (
            <ModalHeader
                headerTitle={`${dynamicLabels?.updateStatus}: ${selectedRows[Object.keys(selectedRows)[0]]?.orderNo}`}
                handleClose={() => {setIsDataLoaded(false);setShowDLCModal(false)}}
                imageVariant="icomoon-close"
                headerStyle={{ fontSize: "15px" }}
            />
        ),
        content: (
            <div style={{ fontSize: "14px" }}>
                <Box horizontalSpacing="5px">
                    {is_bad_order ? <span>{dynamicLabels.updateStatusNotAvailableForOrder}</span>:(showContent &&<DLCModalContent
                        structure={modal_structure}
                    ></DLCModalContent>)}

                </Box>
            </div>
        ),
        footer: (
            <></>
        ),
    }}
/>
}

export default DLCModal;