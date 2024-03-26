    import { useCustomFieldsForm } from "../../../utils/components/Form/useCustomFieldsForm";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { generateOrderFormData, handleDisableFieldsForClone } from "./AddOrderForm.utils";
import moment from "moment";
import { useToast } from 'ui-library'
import { deepCopy, metricsConversion } from "../../../utils/helper";
import { populateCustData } from "./AddOrderForm.utils";
import { useDispatch } from "react-redux";
import { IAddOrderFormActions } from "./AddOrderForm.actions";
import { Dispatch } from "react";
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { IAddOrderFormData, ICrateData, ICustomeFields, ICustomerAddressOptionData, ICustomerData, IDeliveryTypeOptionData, IOrderData } from "./AddOrderForm.models";
import { IClientProperty } from "../../common/ClientProperties/interfaces";
import { unitSystemConversionCrateItem } from "../../../utils/components/Form/utils";


export const getOrderData = (formInstance: UseFormMethods<FieldValues>) => {
    const toast = useToast();
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    const { getCustomFieldsFormData, generateCustomFieldsFormData,generateCustomFieldsFormDataAllSection} = useCustomFieldsForm()
    const modelType = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').modelType;
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const structure = useTypedSelector(state => state.orderForm.structure);
    const resetData = useTypedSelector(state => state.orderForm.resetData);
    const clientMetric = useTypedSelector(state => state.orderForm.clientMetric)
    const subClients = useTypedSelector(state => state.orderForm.subClients)
    const activateCustomerProfilingPickup  = useTypedSelector(state => state.orderForm.activateCustomerProfilingPickup);
    const activateCustomerProfilingDelivery  = useTypedSelector(state => state.orderForm.activateCustomerProfilingDeliver);
    const {setValue, watch, clearErrors} = formInstance

    const pickupCountry = watch('pickupCountry', '')
    const pickupApartment = watch('pickupApartment', '')
    const pickupStreetName = watch('pickupStreetName', '')
    const pickupLandmark = watch('pickupLandmark', '')
    const pickupLocality = watch('pickupLocality', '')
    const pickupState = watch('pickupState', '')
    const pickupCity = watch('pickupCity', '')
    const pickupPinCode = watch('pickupPinCode', '')
    const pickupPincodeType = structure?.['pick up details']?.['addressFields']?.['childNodes']?.['pickupPinCode']?.['fieldType']
    const pickupStateType = structure?.['pick up details']?.['addressFields']?.['childNodes']?.['pickupState']?.['fieldType']
    const deliverPincodeType = structure?.['delivery details']?.['addressFields']?.['childNodes']?.['deliverPinCode']?.['fieldType']
    const deliverStateType = structure?.['delivery details']?.['addressFields']?.['childNodes']?.['deliverState']?.['fieldType']
    const returnPincodeType = structure?.['return address details']?.['addressFields']?.['childNodes']?.['returnPinCode']?.['fieldType']
    const returnStateType = structure?.['return address details']?.['addressFields']?.['childNodes']?.['returnState']?.['fieldType']

    const fetchSubClients =  (clientName: string) => {
        if (subClients?.length) {
            const selectedClient = subClients.filter((clientObj: any) => clientObj.name === clientName)
            return selectedClient[0];
        }
        else return {}
    }
    const getOrderDetails = (orderData: IOrderData, setisP2POrder:Function, clientProperties?: Record<string, IClientProperty>) => {
        let structure_copy = deepCopy(structure)
        let clonedOrder = orderData.orderNo+"_Copy";
        const orderCopy = {...orderData, orderNo: clonedOrder }
        const shipmentTimeZone = {value: orderData.orderDateTZ, label: orderData.gmtoffset, id: orderData.canonicalId, name: orderData.gmtoffset}
        const pickupTimeZone = {value: orderData.startTimeWindowTZ, label: orderData.gmtoffset, id: orderData.canonicalId, name: orderData.gmtoffset}
        const returnTimezone = {value: orderData.endTimeWindowTZ, label: orderData.gmtoffset, id: orderData.canonicalId, name: orderData.gmtoffset}
        const deliverTimeZone = {value: orderData.deliverStartTimeWindowTZ, label: orderData.gmtoffset, id: orderData.canonicalId, name: orderData.gmtoffset}
        const customFieldsFormData = getCustomFieldsFormData(orderData.customFieldsList)
        const isorderTypeIsFMLM = orderData.secondLegClientNodeId ? true : false;
        const isP2POrder = orderData.isP2POrder;
        
        let pickupAccountCode = structure_copy?.['pick up details']?.pickupAccountCode?.fieldType === 'autocomplete' ? {name: orderData.customerId, id: orderData.customerId, isActiveFl: true, customerId:orderData.customerId, accountName:orderData.customerName } : orderData.customerId;
        let pickupAddressId = structure_copy?.['pick up details']?.pickupAddressId?.fieldType === 'autocomplete' ? {id: orderData.addressId, name:orderData.addressId, clientNodeAddressCd: orderData.addressId} : orderData.addressId;
        const deliverAccountCode = structure_copy?.['delivery details']?.deliverAccountCode?.fieldType === 'autocomplete' ? {id: orderData.deliverAccountCode, name: orderData.deliverAccountCode, isActiveFl: true, customerId:orderData.deliverAccountCode, accountName:orderData.deliverAccountName } : orderData.deliverAccountCode;
        const deliverAddressId = structure_copy?.['delivery details']?.deliverAddressId?.fieldType === 'autocomplete' ? {name: orderData.deliverAddressId, id: orderData.deliverAddressId, clientNodeAddressCd: orderData.deliverAddressId}: orderData.deliverAddressId;
        const returnAccountCode = (structure_copy?.['pick up details']?.pickupAccountCode?.fieldType === 'autocomplete' || structure?.['delivery details']?.deliverAccountCode?.fieldType === 'autocomplete') ? {id: orderData.returnAccountCode, name: orderData.returnAccountCode, isActiveFl: true, customerId:orderData.returnAccountCode, accountName:orderData.returnAccountName} : orderData.returnAccountCode;
        const returnAddressId = (structure_copy?.['pick up details']?.pickupAddressId?.fieldType === 'autocomplete' || structure?.['delivery details']?.deliverAddressId?.fieldType === 'autocomplete') ? {id: orderData.returnAddressId, name: orderData.returnAddressId, clientNodeAddressCd: orderData.returnAddressId} : orderData.returnAddressId

        let pickupAddressType;
        let deliverAddressType;

        if (orderData.orderType === 'PICKUP' && orderData.addressType) {
            pickupAddressType = structure_copy?.['pick up details']?.pickupAddressType ? {name: orderData.addressType, id: orderData.addressType, clientRefMasterCd: orderData.addressType} : '';
        } else if (orderData.orderType === 'DELIVER' && orderData.addressType) {
            deliverAddressType = structure_copy?.['delivery details']?.deliverAddressType ? {name: orderData.deliverAddressType, id: orderData.deliverAddressType, clientRefMasterCd: orderData.deliverAddressType} : '';
        } 

        let orderType = '', pickupAddressNotes, deliverAddressNotes, returnAddressNotes;
        if (orderData.orderType === 'PICKUP' && !isorderTypeIsFMLM) {
            orderType = dynamicLabels.pickUpLeg
            if (orderData.addressNotes && structure_copy?.['pick up details']?.pickupAddressNotes) {
                structure_copy['pick up details'].pickupAddressNotes['permission'] = true;
                pickupAddressNotes = orderData.addressNotes;
            } 
        } else if (orderData.orderType === 'DELIVER' && !isorderTypeIsFMLM) {
            orderType = dynamicLabels.deliveryLeg
            if (orderData.deliverAddressNotes && structure_copy?.['delivery details']?.deliverAddressNotes) {
                structure_copy['delivery details'].deliverAddressNotes['permission'] = true;
                deliverAddressNotes = orderData.deliverAddressNotes;
            }
        } else if (isorderTypeIsFMLM) {
            orderType = `${dynamicLabels.pickUpLeg},${dynamicLabels.deliveryLeg}`
            if (orderData.addressNotes && structure_copy?.['pick up details']?.pickupAddressNotes) {
                structure_copy['pick up details'].pickupAddressNotes['permission'] = true;
                pickupAddressNotes = orderData.addressNotes;
            } 
            if (orderData.deliverAddressNotes && structure_copy?.['delivery details']?.deliverAddressNotes) {
                structure_copy['delivery details'].deliverAddressNotes['permission'] = true;
                deliverAddressNotes = orderData.deliverAddressNotes;
            }
            if (orderData.returnAddressNotes && structure_copy?.['return address details']?.returnAddressNotes) {
                structure_copy['return address details'].returnAddressNotes['permission'] = true;
                returnAddressNotes = orderData.returnAddressNotes
            }
        }
        if (orderData.isP2POrder) {
            setisP2POrder(orderData.isP2POrder);
            pickupAccountCode = structure_copy?.['pick up details']?.pickupAccountCode?.fieldType === 'autocomplete' ? {name: orderData.pickupAccountCode, id: orderData.pickupAccountCode} : orderData.pickupAccountCode;
            pickupAddressId = structure_copy?.['pick up details']?.pickupAccountCode?.fieldType === 'autocomplete' ? {name: orderData.pickupAddressId, id: orderData.pickupAddressId} : orderData.pickupAddressId
                structure_copy['pick up details'].pickupTimezone.required = true;
                if (structure_copy['pick up details'].pickupTimezone?.validation?.required?.message) {
                    structure_copy['pick up details'].pickupTimezone.validation.required.message = dynamicLabels?.pickupTimezoneMandatory ? dynamicLabels.pickupTimezoneMandatory : 'Pickup Timezone is mandatory';
                } else {
                    structure_copy['pick up details'].pickupTimezone.validation['required'] = {message : dynamicLabels?.pickupTimezoneMandatory ? dynamicLabels.pickupTimezoneMandatory : 'Pickup Timezone is mandatory'};
                }
                structure_copy['delivery details'].deliverTimezone.required = true;
                if (structure_copy['delivery details'].deliverTimezone?.validation?.required?.message) {
                    structure_copy['delivery details'].deliverTimezone.validation.required.message = dynamicLabels?.deliverTimezoneMandatory ? dynamicLabels.deliverTimezoneMandatory : 'Delivery Timezone is mandetory'
                } else {
                    structure_copy['delivery details'].deliverTimezone.validation['required'] = {message: dynamicLabels?.deliverTimezoneMandatory ? dynamicLabels.deliverTimezoneMandatory : 'Delivery Timezone is mandetory'};
                }
                ( structure_copy['delivery details'].deliverNotes) ?  structure_copy['delivery details'].deliverNotes.permission = true : '';
                if ( structure_copy['pick up details'].pickupBranch) {
                    structure_copy['pick up details'].pickupBranch.permission = false;
                }
                if ( structure_copy['delivery details'].deliverBranch) {
                    structure_copy['delivery details'].deliverBranch.permission = false;
                }
                if (orderData.pickupAddressNotes && structure_copy?.['pick up details']?.pickupAddressNotes) {
                    structure_copy['pick up details'].pickupAddressNotes['permission'] = true;
                    pickupAddressNotes = orderData.pickupAddressNotes;
                }
                if (orderData.deliverAddressNotes && structure_copy?.['delivery details']?.deliverAddressNotes) {
                    structure_copy['delivery details'].deliverAddressNotes['permission'] = true;
                    deliverAddressNotes = orderData.deliverAddressNotes;
                }
                orderType = 'Point to Point';
            
        }
        const orderDetails = {}
        orderDetails['orderNo'] = clonedOrder;
        orderDetails['awbNumber'] = orderData.awbNumber ? orderData.awbNumber: ''
        orderDetails['paymentType'] = orderData.clientReferenceMaster?.PAYMENTTYPE ? orderData.clientReferenceMaster?.PAYMENTTYPE: ''
        orderDetails['deliveryType'] = orderData.deliveryTypes ? orderData.deliveryTypes: ''
        orderDetails['preparationTime'] = orderData.preparationTime ? orderData.preparationTime: ''
        orderDetails['packageValue'] = orderData.packageValue ? orderData.packageValue: undefined
        orderDetails['ServiceTime'] = orderData.serviceTimeInMins ? orderData.serviceTimeInMins: ''
        orderDetails['shippingCost'] = orderData.shippingCost ? orderData.shippingCost: undefined
        if (orderData.capacityInVolume) {
            const clientObj = clientMetric?.find(c => c.name === 'volume')
            const val = metricsConversion(orderData.capacityInVolume, 'GET', clientObj?.conversionFactor)
            orderDetails['packageVolume'] = Number(val.toFixed(2))
          }
        if (orderData.capacityInWeight) {
            const clientObj = clientMetric?.find(c => c.name === 'weight')
            const val = metricsConversion(orderData.capacityInWeight, 'GET', clientObj?.conversionFactor)
            orderDetails['packageWeight'] = Number(val.toFixed(2))
        }
        if (orderData['priority'] && structure_copy?.["order details"]["priority"].permission) {
            orderDetails['priority'] = orderData.clientReferenceMaster?.PRIORITY ? orderData.clientReferenceMaster?.PRIORITY: ''
        }
        if (structure_copy["general details"]["clientName"] && structure_copy["general details"]["clientName"].permission && orderData.clientName) {
            orderDetails['clientName'] = fetchSubClients(orderData.clientName)
        }
        if (structure_copy['general details'].hubName && (structure_copy['general details']['hubName'].permission || orderType === "Delivery Leg")) {
            if (orderData["returnBranch"] && orderData["clientBranchId"]) {
                orderDetails['hubName'] = { name: orderData["returnBranch"] , id: orderData["clientBranchId"]};
            } else {
                console.error('Needed fields clientBranchId, returnBranch missing')
            }
        }
        if(activateCustomerProfilingPickup || activateCustomerProfilingDelivery) {
            structure_copy = handleDisableFieldsForClone(structure_copy, orderType, orderCopy, dynamicLabels, isorderTypeIsFMLM, activateCustomerProfilingPickup, activateCustomerProfilingDelivery, isP2POrder);
        }
        dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : structure_copy})
        const _resetData = {
            ...orderDetails,
             ...generateOrderFormData(orderCopy, orderType, isorderTypeIsFMLM,dynamicLabels, isP2POrder,clientProperties,pickupPincodeType,pickupStateType,deliverPincodeType,deliverStateType,returnPincodeType,returnStateType ),
             ...customFieldsFormData,
            pickupAccountCode: pickupAccountCode,
            pickupAddressId: pickupAddressId, 
            deliverAccountCode: deliverAccountCode,
            deliverAddressId: deliverAddressId, 
            returnAccountCode: returnAccountCode,
            returnAddressId: returnAddressId, 
            shipmentOrderDtTZ: shipmentTimeZone,
            pickupTimezone: pickupTimeZone,
            deliverTimezone: deliverTimeZone,
            returnTimezone: returnTimezone,
            pickupLocationRestriction: {id: orderData.pickupLocationRestriction, name: orderData.pickupLocationRestriction, clientRefMasterCd: orderData.pickupLocationRestriction},
            deliverLocationRestriction: {id: orderData.deliverLocationRestriction, name: orderData.deliverLocationRestriction, clientRefMasterCd: orderData.deliverLocationRestriction},
            returnLocationRestriction: {id: orderData.returnLocationRestriction, name: orderData.returnLocationRestriction, clientRefMasterCd: orderData.returnLocationRestriction},
            numberOfItems: orderData.noOfItems ? orderData.noOfItems : undefined,
            shipmentOrderDt: new Date(),
            isPartialDeliveryAllowedFl : orderData.isPartialDeliveryAllowedFl ? 'Y': 'N',
            returnAllowedFl : orderData.isReturnAllowedFl ? 'Y': 'N',
            cancellationAllowedFl : orderData.isCancelAllowedFl ? 'Y': 'N',
            shipmentsType : orderType,
            returnShipment : orderData.orderState === 'REVERSE' ? 'Yes' : 'No',
            secondLegClientBranchId: orderData.secondLegClientBranchId,
            secondLegClientNodeId: orderData.secondLegClientNodeId,
            returnOrderAddress: (orderData.addressId === orderData.returnAddressId) ? true : false,
            pickupAddressType: pickupAddressType,
            deliverAddressType: deliverAddressType,
            pickupAddressNotes: pickupAddressNotes,
            deliverAddressNotes: deliverAddressNotes,
            returnAddressNotes: returnAddressNotes
        }
        return _resetData
    }

    const validateTime = (data: IAddOrderFormData, pickupLeg: boolean, deliveryLeg: boolean) => {
        let checkValidity = true;
        if(modelType === 'FMLM'){
            if(modelType !== 'SM'){
                if(pickupLeg && !deliveryLeg){
                    if(!data.pickupStartTimeWindow) {
                        toast.add(dynamicLabels.startTimeMandatory ? dynamicLabels.startTimeMandatory : 'Start time is mandatory', 'warning', false);
                        checkValidity = false;
                    }
                    if(!data.pickupEndTimeWindow) {
                        toast.add(dynamicLabels.endTimeMandatory ? dynamicLabels.endTimeMandatory : 'End time is mandatory', 'warning', false);
                        checkValidity = false;
                    }
                }
                if(!pickupLeg && deliveryLeg){
                    if(!data.deliverStartTimeWindow){
                        toast.add(dynamicLabels.startTimeMandatory ? dynamicLabels.startTimeMandatory : 'Start time is mandatory', 'warning', false);
                        checkValidity = false;
                    }
                    if(!data.deliverEndTimeWindow){
                        toast.add(dynamicLabels.endTimeMandatory ? dynamicLabels.endTimeMandatory : 'End time is mandatory', 'warning', false);
                        checkValidity = false;
                    }
                }
            }
            if((pickupLeg && deliveryLeg) || (pickupLeg && !deliveryLeg)){
                if( moment(data.shipmentOrderDt) > moment(data.pickupStartTimeWindow)){
                    toast.add(dynamicLabels.StartTimeOrderTimeValidation ? dynamicLabels.StartTimeOrderTimeValidation : 'Start time cannot be less than order time', 'warning', false);
                    checkValidity = false;
                }
                if(moment(data.pickupStartTimeWindow) > moment(data.pickupEndTimeWindow)){
                    toast.add(dynamicLabels.EndTimeStartTimeValidation ? dynamicLabels.EndTimeStartTimeValidation : 'End time cannot be less than start time', 'warning', false);
                    checkValidity = false;
                }
            }
            if((pickupLeg && deliveryLeg) || (!pickupLeg && deliveryLeg)){
                if( moment(data.shipmentOrderDt) > moment(data.deliverStartTimeWindow)){
                        toast.add(dynamicLabels.StartTimeOrderTimeValidation ? dynamicLabels.StartTimeOrderTimeValidation : 'Start time cannot be less than order time', 'warning', false);
                        checkValidity = false;
                }
                if(moment(data.deliverStartTimeWindow) > moment(data.deliverEndTimeWindow)){
                        toast.add(dynamicLabels.EndTimeStartTimeValidation ? dynamicLabels.EndTimeStartTimeValidation : 'End time cannot be less than start time', 'warning', false);
                        checkValidity = false;
                }
            }
        }
        return checkValidity;
    }

    const populateCustomerData = (field: ICustomerData, key: string, data: ICustomerAddressOptionData[]) => {
        const primaryAddress = data?.find((data) => {
            return (data?.isPrimaryAddress === 'Y')
        })
        if (Object.keys(structure).length) { 
            let structure_copy = deepCopy(structure)
            if (!field.customerId) {
                populateCustData(key, structure_copy, [], true)
                dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : structure_copy})
                if (key == 'pick up details') {
                    setValue('pickupAccountName', '');
                    setValue('pickupEmail', '');
                    setValue('pickupPhoneNumber', '');
                    setValue('pickupWhatsappOptin', 'N');

                    setValue('pickupAddressId', '');
                    setValue('pickupApartment', '');
                    setValue('pickupCity', '');
                    setValue('pickupCountry', '');
                    setValue('pickupLandmark', '');
                    setValue('pickupLocality', '');
                    setValue('pickupPinCode', '');
                    setValue('pickupState', '');
                    setValue('pickupStreetName', '');
                    setValue('pickupAddressType', '');
                    setValue('pickupTimezone', '');

                    structure_copy[key]['addressFields']['childNodes']['pickupApartment'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupCity'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupCountry'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupLandmark'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupLocality'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupPinCode'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupState'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['pickupStreetName'].editable = true;
                    structure_copy[key]['pickupAddressType'].editable = true;
                    structure_copy[key]['pickupTimezone'].editable = true;

                    if (structure_copy[key]['pickupLocationRestriction']) {
                        setValue('pickupLocationRestriction', '');
                        structure_copy[key]['pickupLocationRestriction'].editable = true;
                    }
                    if (structure_copy?.[key]?.['pickupAddressNotes']?.permission === true) {
                        structure_copy[key]['pickupAddressNotes'].permission = false;
                        setValue('pickupAddressNotes', '');
                    }
                } else if (key == 'delivery details') {
                    setValue('deliverAccountName', '');
                    setValue('deliverEmail', '');
                    setValue('deliverPhoneNumber', '');
                    setValue('deliverWhatsappOptin', 'N');

                    setValue('deliverAddressId', '');
                    setValue('deliverApartment', '');
                    setValue('deliverCity', '');
                    setValue('deliverCountry', '');
                    setValue('deliverLandmark', '');
                    setValue('deliverLocality', '');
                    setValue('deliverPinCode', '');
                    setValue('deliverState', '');
                    setValue('deliverStreetName', '');
                    setValue('deliverAddressType', '');
                    setValue('deliverTimezone', '');

                    structure_copy[key]['addressFields']['childNodes']['deliverApartment'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverCity'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverCountry'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverLandmark'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverLocality'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverPinCode'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverState'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['deliverStreetName'].editable = true;
                    structure_copy[key]['deliverAddressType'].editable = true;
                    structure_copy[key]['deliverTimezone'].editable = true;
                    if (structure_copy[key]['deliverLocationRestriction']) {
                        setValue('deliverLocationRestriction', '');
                        structure_copy[key]['deliverLocationRestriction'].editable = true;
                    }
                    if (structure_copy?.[key]?.['deliverAddressNotes']?.permission === true) {
                        structure_copy[key]['deliverAddressNotes'].permission = false;
                        setValue('deliverAddressNotes', '')
                    }
                } else if (key == 'return address details') {
                    setValue('returnAccountName', '');
                    setValue('returnEmail', '');
                    setValue('returnPhoneNumber', '');
                    setValue('returnWhatsappOptin', 'N');

                    setValue('returnAddressId', '');
                    setValue('returnApartment', '');
                    setValue('returnCity', '');
                    setValue('returnCountry', '');
                    setValue('returnLandmark', '');
                    setValue('returnLocality', '');
                    setValue('returnPinCode', '');
                    setValue('returnState', '');
                    setValue('returnStreetName', '');
                    setValue('returnAddressType', '');
                    setValue('returnTimezone', '');

                    structure_copy[key]['addressFields']['childNodes']['returnApartment'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnCity'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnCountry'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnLandmark'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnLocality'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnPinCode'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnState'].editable = true;
                    structure_copy[key]['addressFields']['childNodes']['returnStreetName'].editable = true;
                    structure_copy[key]['returnAddressType'].editable = true;
                    structure_copy[key]['returnTimezone'].editable = true;
                    if (structure_copy[key]['returnLocationRestriction']) {
                        setValue('returnLocationRestriction', '');
                        structure_copy[key]['returnLocationRestriction'].editable = true;
                    }
                    if (structure_copy?.[key]?.['returnAddressNotes']?.permission === true) {
                        structure_copy[key]['returnAddressNotes'].permission = false;
                        setValue('returnAddressNotes', '')
                    }
                } else if (key == 'customer details') {
                    setValue('AccountName', '');
                    setValue('Email', '');
                    setValue('PhoneNumber', '');
                }
                return;
            }
            if (field.isActiveFl) {
                if (key == 'pick up details') {
                    setValue('pickupAccountName', field.accountName);
                    setValue('pickupEmail', field.emailAddress);
                    setValue('pickupPhoneNumber', field.customerPhone);

                    setValue('pickupWhatsappOptin', primaryAddress?.whatsappOptin);
                    setValue('pickupAddressId', primaryAddress?.clientNodeAddressCd ? { 'id': primaryAddress?.clientNodeAddressCd, 'name': primaryAddress?.clientNodeAddressCd, 'clientNodeAddressCd': primaryAddress?.clientNodeAddressCd } : '')
                    setValue('pickupAddressType', primaryAddress?.clientNodeType ? { 'id': primaryAddress?.clientNodeType, 'name': primaryAddress?.clientNodeType } : '')
                    setValue('pickupAddress', primaryAddress?.address)
                    setValue('pickupApartment', primaryAddress?.apartment);
                    setValue('pickupCity', primaryAddress?.city);
                    setValue('pickupCountry', primaryAddress?.countryId ? { 'id': primaryAddress?.countryId, 'name': primaryAddress?.country } : '');
                    setValue('pickupLandmark', primaryAddress?.landmark);
                    setValue('pickupLocality', primaryAddress?.locality);
                    setValue('pickupPinCode', primaryAddress?.pincode ? { 'id': primaryAddress?.pincode, 'name': primaryAddress?.pincode } : '');
                    setValue('pickupState', primaryAddress?.state ? { 'id': primaryAddress?.state, 'name': primaryAddress?.state } : '');
                    setValue('pickupStreetName', primaryAddress?.streetName);

                    clearErrors(["pickupAccountName", "pickupEmail","pickupAddressId","pickupPhoneNumber","pickupAddressType","pickupAddress", "pickupApartment", "pickupCity", "pickupCountry", "pickupLandmark", "pickupLocality", "pickupPinCode", "pickupState", "pickupStreetName"])
                } else if (key == 'delivery details') {
                    setValue('deliverAccountName', field.accountName);
                    setValue('deliverEmail', field.emailAddress);
                    setValue('deliverPhoneNumber', field.customerPhone);

                    setValue('deliverWhatsappOptin', primaryAddress?.whatsappOptin);
                    setValue('deliverAddressId', primaryAddress?.clientNodeAddressCd ? { 'id': primaryAddress?.clientNodeAddressCd, 'name': primaryAddress?.clientNodeAddressCd } : '')
                    setValue('deliverAddressType', primaryAddress?.clientNodeType ? { 'id': primaryAddress?.clientNodeType, 'name': primaryAddress?.clientNodeType } : '')
                    setValue('deliverAddress', primaryAddress?.address)
                    setValue('deliverApartment', primaryAddress?.apartment);
                    setValue('deliverCity', primaryAddress?.city);
                    setValue('deliverCountry', primaryAddress?.countryId ? { 'id': primaryAddress?.countryId, 'name': primaryAddress?.country } : '');
                    setValue('deliverLandmark', primaryAddress?.landmark);
                    setValue('deliverLocality', primaryAddress?.locality);
                    setValue('deliverPinCode', primaryAddress?.pincode ? { 'id': primaryAddress?.pincode, 'name': primaryAddress?.pincode } : '');
                    setValue('deliverState', primaryAddress?.state ? { 'id': primaryAddress?.state, 'name': primaryAddress?.state } : '');
                    setValue('deliverStreetName', primaryAddress?.streetName);

                    clearErrors(["deliverAccountName", "deliverEmail","deliverPhoneNumber", 'deliverAddress', 'deliverApartment', 'deliverCity', 'deliverCountry', 'deliverLandmark', 'deliverLocality', 'deliverPinCode', 'deliverState', 'deliverStreetName'])
                } else if (key == 'return address details') {
                    setValue('returnAccountName', field.accountName);
                    setValue('returnEmail', field.emailAddress);
                    setValue('returnPhoneNumber', field.customerPhone);

                    setValue('returnWhatsappOptin', primaryAddress?.whatsappOptin);
                    setValue('returnAddressId', primaryAddress?.clientNodeAddressCd ? { 'id': primaryAddress?.clientNodeAddressCd, 'name': primaryAddress?.clientNodeAddressCd } : '')
                    setValue('returnAddressType', primaryAddress?.clientNodeType ? { 'id': primaryAddress?.clientNodeType, 'name': primaryAddress?.clientNodeType } : '')
                    setValue('returnAddress', primaryAddress?.address)
                    setValue('returnApartment', primaryAddress?.apartment);
                    setValue('returnCity', primaryAddress?.city);
                    setValue('returnCountry', primaryAddress?.countryId ? { 'id': primaryAddress?.countryId, 'name': primaryAddress?.country } : '');
                    setValue('returnLandmark', primaryAddress?.landmark);
                    setValue('returnLocality', primaryAddress?.locality);
                    setValue('returnPinCode', primaryAddress?.pincode ? { 'id': primaryAddress?.pincode, 'name': primaryAddress?.pincode } : '');
                    setValue('returnState', primaryAddress?.state ? { 'id': primaryAddress?.state, 'name': primaryAddress?.state } : '');
                    setValue('returnStreetName', primaryAddress?.streetName);

                    clearErrors(["returnAccountName", "returnEmail","returnPhoneNumber, 'returnAddress", 'returnApartment', 'returnCity', 'returnCountry', 'returnLandmark', 'returnLocality', 'returnPinCode', 'returnState', 'returnStreetName'])
                } else if (key == 'customer details') {
                    setValue('AccountName', field.accountName);
                    setValue('Email', field.emailAddress);
                    setValue('PhoneNumber', field.customerPhone);
                    clearErrors(["AccountName", "Email","PhoneNumber"])
                }
                structure_copy = populateCustData(key, structure_copy, data, false)
            } else {
                structure_copy = populateCustData(key, structure_copy, [], false)
                toast.add('Please select active Customer ID', 'warning', false)
            }
            dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : structure_copy})
        }
    }

    const getCustomerData = (value: ICustomerData, key: string) => {
        try {
            if (activateCustomerProfilingPickup) {
                getAddressNodesData(value, key);
            }
            else if (activateCustomerProfilingDelivery) {
                getAddressNodesData(value, key);
            }
        } catch (error) {
            toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    const getAddressNodesData = async (value: ICustomerData, key: string) => {
        if (value) {
            const param = value?.accountCode ? value.accountCode : value?.name ? value.name : (typeof value== 'string' ? value : '')
            dispatch({ type: '@@addOrderForm/SET_SELECTED_CUSTOMER_ID', payload : param})
            const subclient = formInstance.getValues('clientName') ? "&subClientId="+formInstance.getValues('clientName').id : ""
            
            const { data : {data} } = await axios.get(`${apiMappings.order.form.getAddressIds}&accountCode=${param}${subclient}&customerId=${value?.customerId ? value?.customerId : '' }`, {data: null})
            if (data) {
                populateCustomerData(value, key, data)
            }
        } else {
            populateCustomerData(value, key, [])
        }
    }

    const prepareData = (formInputs: IAddOrderFormData, pickupLeg: boolean, deliveryLeg: boolean, isP2POrder: boolean, returnOrderAddress: boolean, pickupMapPosition: number[], deliverMapPosition: number[], returnMapPosition: number[], crateItems: Array<ICrateData>) => {
        const {
            shipmentOrderDtTZ, deliveryType, distributionCenter, hubName, packageWeight, packageVolume,
            packageValue, shippingCost, ServiceTime, priority, deliverAccountCode, autoAllocateProfileName, 
            pickupAccountName, pickupEmail, pickupPhoneNumber, pickupWhatsappOptin, pickupStartTimeWindow, pickupStartTimeWindowTZ, pickupEndTimeWindow,
            pickupEndTimeWindowTZ, pickupServiceTime, pickupBranch, pickupLatitude, pickupLongitude, pickupAddressTimezoneId, deliverBranch, 
            returnShipment, pickupAddressId, pickupAccountCode, cancellationAllowedFl, returnAllowedFl, isPartialDeliveryAllowedFl, paymentType, 
            awbNumber, orderNo, shipmentOrderDt, deliverEndTimeWindow, deliverStartTimeWindow, deliverTimezone, preparationTime, numberOfItems} = formInputs
        const customFieldsData = generateCustomFieldsFormDataAllSection(structure, formInputs)  
        let customFields: Array<ICustomeFields> = [];
        if(customFieldsData){
            Object.keys(customFieldsData).forEach(function(key) {
                if(customFieldsData[key] !== '' && customFieldsData[key] !== undefined && key !== 'autoAllocateProfileName'){
                    customFields.push({field: key, value: customFieldsData[key].val, type: customFieldsData[key].type});
                }
            });
        }
        let deliveryTypeVal = '';
        if(deliveryType){
            deliveryType.forEach((key: IDeliveryTypeOptionData) => {
                deliveryTypeVal = deliveryTypeVal+ (deliveryTypeVal ? ',' : '') + key.clientRefMasterCd
            })
        }
        let weight = undefined, volume = undefined;
        if (packageWeight) {
            const clientObj = clientMetric?.find(c => c.name === 'weight')
            const val = metricsConversion(packageWeight, 'POST', clientObj?.conversionFactor)
            weight = Number(val.toFixed(4))
        }
        if (packageVolume) {
            const clientObj = clientMetric?.find(c => c.name === 'volume')
            const val = metricsConversion(packageVolume, 'POST', clientObj?.conversionFactor)
            volume = Number(val.toFixed(4))
        }
        const returnToSameAdd = {};
        const addressData = {};

        if((pickupLeg && !deliveryLeg) || (!pickupLeg && deliveryLeg)){
            if(pickupLeg && !deliveryLeg){
                addressData['pickupServiceTime'] = String(ServiceTime),
                addressData['pickupEndTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
                addressData['pickupStartTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
                addressData['pickupAddressTimezoneId'] = shipmentOrderDtTZ?.timezoneId,
                addressData['shipmentOrderTypeCd'] = 'PICKUP',
                addressData['orderState'] = 'FORWARD',
                addressData['pickupBranch'] = distributionCenter?.name ? distributionCenter?.name : pickupBranch ? pickupBranch.name : undefined,
                addressData['distributionCenter'] = distributionCenter?.name ? distributionCenter?.name : pickupBranch ? pickupBranch.name : undefined
                addressData['clientBranchId'] = distributionCenter?.id ? distributionCenter?.id : pickupBranch ? pickupBranch.id : undefined,
                addressData['hubClientNodeId'] = distributionCenter?.clientNodeId ? distributionCenter?.clientNodeId : pickupBranch ? pickupBranch.clientNodeId : undefined
            }
            if(!pickupLeg && deliveryLeg){
                addressData['deliverServiceTime'] = ServiceTime,
                addressData['deliverEndTimeWindowTZ'] = deliverTimezone?.canonicalId ? deliverTimezone.canonicalId : deliverTimezone?.id,
                addressData['deliverStartTimeWindowTZ'] = deliverTimezone?.canonicalId ? deliverTimezone.canonicalId : deliverTimezone?.id,
                addressData['deliverAddressTimezoneId'] = deliverTimezone?.timezoneId,
                addressData['shipmentOrderTypeCd'] = 'DELIVER',
                addressData['orderState'] = 'FORWARD',
                addressData['deliverBranch'] = distributionCenter?.name ? distributionCenter?.name : deliverBranch ? deliverBranch.name : undefined,
                addressData['distributionCenter'] = distributionCenter?.name ? distributionCenter?.name : pickupBranch ? pickupBranch.name : undefined,
                addressData['returnBranch'] = hubName?.name
                addressData['clientBranchId'] = distributionCenter?.id ? distributionCenter?.id : deliverBranch ? deliverBranch.id : undefined,
                addressData['hubClientNodeId'] = distributionCenter?.clientNodeId ? distributionCenter?.clientNodeId : deliverBranch ? deliverBranch.clientNodeId : undefined
                addressData['returnToHubId'] = hubName?.clientNodeId 
            }
        }
        if(isP2POrder){
            addressData['distributionCenter'] = distributionCenter?.name;
            addressData['hubClientNodeId'] = distributionCenter?.clientNodeId ? distributionCenter.clientNodeId : distributionCenter?.id;
            addressData['returnToHubId'] = distributionCenter?.clientNodeId;
            addressData['clientBranchId'] = distributionCenter?.id;
            addressData['deliverBranch'] = distributionCenter?.name;
            addressData['orderState'] = 'FORWARD';
            addressData['pickupAddressType'] = null;
        }
        if(pickupLeg){
            addressData['pickupLatitude'] = parseFloat(String(pickupMapPosition[0]));
            addressData['pickupLongitude'] = parseFloat(String(pickupMapPosition[1]));
            addressData['pickupCountry'] = formInputs['pickupCountry']?.name;
            addressData['pickupPinCode'] = formInputs['pickupPinCode']?.name ? formInputs['pickupPinCode']?.name : formInputs['pickupPinCode'];
            addressData['pickupState'] = formInputs['pickupState']?.name;
            addressData['pickupBranch'] = distributionCenter?.name ? distributionCenter?.name : pickupBranch ? pickupBranch.name : undefined;
            addressData['pickupAddressId'] = formInputs['pickupAddressId']?.clientNodeAddressCd ? formInputs['pickupAddressId'].clientNodeAddressCd : (formInputs['pickupAddressId']?.id ? formInputs['pickupAddressId'].id : formInputs['pickupAddressId']);
            addressData['pickupAccountCode'] = formInputs['pickupAccountCode']?.accountCode ? formInputs['pickupAccountCode'].accountCode : (formInputs['pickupAccountCode']?.id ? formInputs['pickupAccountCode'].id : formInputs['pickupAccountCode']);
            addressData['pickupTimezone'] = formInputs['pickupTimezone']?.canonicalId;
            addressData['pickupServiceTime'] = formInputs['pickupServiceTime'] ? formInputs['pickupServiceTime'] :String(ServiceTime),
            addressData['pickupEndTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['pickupStartTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['pickupAddressTimezoneId'] = shipmentOrderDtTZ?.timezoneId
            addressData['pickupLocationRestriction'] = formInputs['pickupLocationRestriction'] ? formInputs['pickupLocationRestriction'].clientRefMasterCd : null
            addressData['pickupAccountName'] = formInputs['pickupAccountName'] ? formInputs['pickupAccountName'] : null;
            addressData['pickupEndTimeWindow'] = pickupEndTimeWindow
            addressData['pickupStartTimeWindow'] = pickupStartTimeWindow
            addressData['pickupApartment'] = formInputs['pickupApartment'] ? formInputs['pickupApartment'] : null;
            addressData['pickupCity'] = formInputs['pickupCity'] ? formInputs['pickupCity'] : null;
            addressData['pickupEmail'] = formInputs['pickupEmail'] ? formInputs['pickupEmail'] : null;
            addressData['pickupPhoneNumber'] = formInputs['pickupPhoneNumber'] ? formInputs['pickupPhoneNumber'] : null;
            addressData['pickupWhatsappOptin'] = formInputs['pickupWhatsappOptin'] ? formInputs['pickupWhatsappOptin'] : null;
            addressData['pickupLandmark'] = formInputs['pickupLandmark'] ? formInputs['pickupLandmark'] : null
            addressData['pickupLocality'] = formInputs['pickupLocality'] ? formInputs['pickupLocality'] : null,
            addressData['pickupStreetName'] = formInputs['pickupStreetName'] ? formInputs['pickupStreetName'] : null
            addressData['pickupNotes'] = formInputs['pickupNotes'] ? formInputs['pickupNotes'] : null;
            addressData['pickupAddressType'] = formInputs['pickupAddressType'] ? formInputs['pickupAddressType'].clientRefMasterCd : null
        }
        if(deliveryLeg){
            addressData['deliverLatitude'] = parseFloat(String(deliverMapPosition[0]));
            addressData['deliverLongitude'] = parseFloat(String(deliverMapPosition[1]));
            addressData['deliverCountry'] = formInputs['deliverCountry']?.name;
            addressData['deliverBranch'] = distributionCenter?.name ? distributionCenter?.name : deliverBranch ? deliverBranch.name : undefined;
            addressData['deliverPinCode'] = formInputs['deliverPinCode']?.name ? formInputs['deliverPinCode']?.name: formInputs['deliverPinCode'];
            addressData['deliverState'] = formInputs['deliverState']?.name ? formInputs['deliverState']?.name : null;
            addressData['deliverEmail'] = formInputs['deliverEmail'] ? formInputs['deliverEmail'] : null;
            addressData['deliverPhoneNumber'] = formInputs['deliverPhoneNumber'] ? formInputs['deliverPhoneNumber'] : null;
            addressData['deliverWhatsappOptin'] = formInputs['deliverWhatsappOptin'] ? formInputs['deliverWhatsappOptin'] : null;
            addressData['deliverAddressId'] = formInputs['deliverAddressId']?.clientNodeAddressCd ? formInputs['deliverAddressId'].clientNodeAddressCd : (formInputs['deliverAddressId']?.id ? formInputs['deliverAddressId'].id : formInputs['deliverAddressId']);
            addressData['deliverAddressType'] = formInputs['deliverAddressType'] ? formInputs['deliverAddressType'].clientRefMasterCd : null;
            addressData['deliverTimezone'] = formInputs['deliverTimezone']?.canonicalId;
            addressData['deliverLocationRestriction'] = formInputs['deliverLocationRestriction'] ? formInputs['deliverLocationRestriction'].clientRefMasterCd : null;
            addressData['deliverAccountName'] = formInputs['deliverAccountName'] ? formInputs['deliverAccountName'] : null;
            addressData['deliverApartment'] = formInputs['deliverApartment'] ? formInputs['deliverApartment'] : null;
            addressData['deliverCity'] = formInputs['deliverCity'] ? formInputs['deliverCity'] : null;
            addressData['deliverServiceTime'] = formInputs['deliverServiceTime'] ? formInputs['deliverServiceTime'] : ServiceTime,
            addressData['deliverEndTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['deliverStartTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['deliverAddressTimezoneId'] = shipmentOrderDtTZ?.timezoneId;
            addressData['returnBranch'] = hubName?.name;
            addressData['deliverEndTimeWindow'] = deliverEndTimeWindow
            addressData['deliverStartTimeWindow'] = deliverStartTimeWindow
            addressData['deliverLandmark'] = formInputs['deliverLandmark'] ? formInputs['deliverLandmark'] : null,
            addressData['deliverLocality'] = formInputs['deliverLocality'] ? formInputs['deliverLocality'] : null
            addressData['deliverStreetName'] = formInputs['deliverStreetName'] ? formInputs['deliverStreetName'] : null
            addressData['deliverNotes'] = formInputs['deliverNotes'] ? formInputs['deliverNotes'] : null;
        }
        if(pickupLeg && deliveryLeg){
            addressData['shipmentOrderTypeCd'] = !isP2POrder ? 'BOTH' : 'DELIVER';
            if (!isP2POrder){
                addressData['distributionCenter'] = formInputs['pickupBranch']?.name
                addressData['clientBranchId'] = pickupBranch?.branchId;
                addressData['hubClientNodeId'] = pickupBranch?.clientNodeId ? pickupBranch.clientNodeId : pickupBranch?.id;
            }
            // addressData['clientBranchId'] = deliverBranch?.branchId;
            addressData['orderState'] = returnShipment === 'Yes' ? 'REVERSE' :'FORWARD';
            addressData['secondLegClientBranchId'] = deliverBranch?.branchId ? deliverBranch.branchId : resetData['secondLegClientBranchId'];
            addressData['secondLegClientNodeId'] = deliverBranch?.clientNodeId ? deliverBranch.clientNodeId : resetData['secondLegClientNodeId'];
            addressData['returnBranch'] = hubName?.name;
            addressData['pickupServiceTime'] = formInputs['pickupServiceTime'] ? formInputs['pickupServiceTime'] :String(ServiceTime);
            addressData['deliverServiceTime'] = formInputs['deliverServiceTime'] ? formInputs['deliverServiceTime'] : ServiceTime;
        }
        if(!returnOrderAddress && !isP2POrder && pickupLeg && deliveryLeg){
            addressData['returnLatitude'] = parseFloat(String(returnMapPosition[0]));
            addressData['returnLongitude'] = parseFloat(String(returnMapPosition[1]));
            addressData['returnCountry'] = formInputs['returnCountry']?.name;
            addressData['returnPinCode'] = formInputs['returnPinCode']?.name ? formInputs['returnPinCode']?.name : formInputs['returnPinCode'];
            addressData['returnState'] = formInputs['returnState']?.name;
            addressData['returnBranch'] = formInputs['returnBranch']?.name;
            addressData['returnAddressId'] = formInputs['returnAddressId']?.clientNodeAddressCd ? formInputs['returnAddressId'].clientNodeAddressCd : (formInputs['returnAddressId']?.id ? formInputs['returnAddressId'].id : formInputs['returnAddressId']);
            addressData['returnAccountCode'] = formInputs['returnAccountCode']?.accountCode ? formInputs['returnAccountCode'].accountCode : (formInputs['returnAccountCode']?.id ? formInputs['returnAccountCode'].id : formInputs['returnAccountCode']);
            addressData['returnTimezone'] = formInputs['pickupTimezone']?.canonicalId;
            addressData['returnServiceTime'] = formInputs['returnServiceTime'],
            addressData['returnEndTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['returnStartTimeWindowTZ'] = shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            addressData['returnAddressTimezoneId'] = shipmentOrderDtTZ?.timezoneId
            addressData['returnLocationRestriction'] = formInputs['returnLocationRestriction'] ? formInputs['returnLocationRestriction'].clientRefMasterCd : null
            addressData['returnAddressType'] = formInputs['returnAddressType'] ? formInputs['returnAddressType'].clientRefMasterCd : null;
            addressData['returnTimezone'] = formInputs['returnTimezone']?.canonicalId;
            addressData['returnAccountName'] = formInputs['returnAccountName'] ? formInputs['returnAccountName'] : null,
            addressData['returnEmail'] = formInputs['returnEmail'] ? formInputs['returnEmail'] : null,
            addressData['returnPhoneNumber'] = formInputs['returnPhoneNumber'] ? formInputs['returnPhoneNumber'] : null,
            addressData['returnWhatsappOptin'] = formInputs['returnWhatsappOptin'] ? formInputs['returnWhatsappOptin'] : null,
            addressData['returnApartment'] = formInputs['returnApartment'] ? formInputs['returnApartment'] : null,
            addressData['returnStreetName'] = formInputs['returnStreetName'] ? formInputs['returnStreetName'] : null,
            addressData['returnLandmark'] = formInputs['returnLandmark'] ? formInputs['returnLandmark'] : null,
            addressData['returnLocality'] = formInputs['returnLocality'] ? formInputs['returnLocality'] : null,
            addressData['returnCity'] = formInputs['returnCity'] ? formInputs['returnCity'] : null,
            addressData['returnStartTimeWindow'] = formInputs['returnStartTimeWindow'],
            addressData['returnEndTimeWindow'] = formInputs['returnEndTimeWindow']
        }
        if(returnOrderAddress && !isP2POrder){
            returnToSameAdd['returnAccountCode'] = pickupAccountCode?.accountCode ? pickupAccountCode.accountCode : (pickupAccountCode?.id ? pickupAccountCode.id : pickupAccountCode),
            returnToSameAdd['returnAccountName'] = pickupAccountName,
            returnToSameAdd['returnEmail'] = pickupEmail,
            returnToSameAdd['returnPhoneNumber'] = pickupPhoneNumber,
            returnToSameAdd['returnWhatsappOptin'] = pickupWhatsappOptin,
            returnToSameAdd['returnApartment'] = pickupApartment,
            returnToSameAdd['returnStreetName'] = pickupStreetName,
            returnToSameAdd['returnState'] = pickupState?.name,
            returnToSameAdd['returnLandmark'] = pickupLandmark,
            returnToSameAdd['returnLocality'] = pickupLocality ? pickupLocality : null,
            returnToSameAdd['returnCountry'] = pickupCountry?.name,
            returnToSameAdd['returnCity'] = pickupCity,
            returnToSameAdd['returnPinCode'] = pickupPinCode?.name ? pickupPinCode?.name : pickupPinCode,
            returnToSameAdd['returnStartTimeWindow'] = pickupStartTimeWindow,
            returnToSameAdd['returnStartTimeWindowTZ'] = pickupStartTimeWindowTZ,
            returnToSameAdd['returnEndTimeWindow'] = pickupEndTimeWindow,
            returnToSameAdd['returnEndTimeWindowTZ'] = pickupEndTimeWindowTZ,
            returnToSameAdd['returnServiceTime'] = pickupServiceTime,
            returnToSameAdd['returnBranch'] = pickupBranch?.name,
            returnToSameAdd['returnLatitude'] = pickupLatitude,
            returnToSameAdd['returnLongitude'] = pickupLongitude,
            returnToSameAdd['returnAddressTimezoneId'] = pickupAddressTimezoneId,
            returnToSameAdd['returnLocationRestriction'] = null,
            returnToSameAdd['returnAddressId'] = pickupAddressId?.clientNodeAddressCd ? pickupAddressId?.clientNodeAddressCd : null
        }
        crateItems.forEach(crate => {
            crate.crateTemperatureCategory = crate.crateTemperatureCategory?.name ? crate.crateTemperatureCategory.name : crate.crateTemperatureCategory;
            crate = unitSystemConversionCrateItem(crate, "POST");
            if(crate.crateName && crate.crateName.name){
                crate.crateName = crate.crateName.name;
                crate.isActiveFl="Y";
            }
            if (crate.shipmentlineitems && crate.shipmentlineitems.length) {
                crate.shipmentlineitems.forEach(item => {
                    item.temperatureCategory = item.temperatureCategory?.name ? item.temperatureCategory.name : item.temperatureCategory;
                    item.isActiveFl="Y";
                    item = unitSystemConversionCrateItem(item, "POST");
                })
            }
        })
        const payload = {
            ...addressData,
            ...returnToSameAdd,
            shipmentOrderDtTZ: shipmentOrderDtTZ?.canonicalId ? shipmentOrderDtTZ.canonicalId : shipmentOrderDtTZ?.id,
            deliveryType: deliveryTypeVal ? deliveryTypeVal : undefined,
            packageWeight: weight,
            packageVolume: volume,
            packageValue: packageValue && parseFloat(String(packageValue)),
            shippingCost: shippingCost && parseFloat(String(shippingCost)),
            ServiceTime: ServiceTime && parseInt(String(ServiceTime)),
            priority: priority?.clientRefMasterCd,
            paymentType: paymentType?.clientRefMasterCd,
            deliverAccountCode: deliverAccountCode?.accountCode ? deliverAccountCode.accountCode : (deliverAccountCode?.id ? deliverAccountCode.id: deliverAccountCode),
            cancellationAllowedFl: cancellationAllowedFl? cancellationAllowedFl : 'N',
            returnAllowedFl: returnAllowedFl? returnAllowedFl : 'N',
            isPartialDeliveryAllowedFl : isPartialDeliveryAllowedFl ? isPartialDeliveryAllowedFl : 'N',
            shipmentCrateMappings: crateItems,
            autoAllocateProfileName: autoAllocateProfileName?.profileName,
            isP2POrder: isP2POrder,
            awbNumber: awbNumber? awbNumber: '',
            orderNo: orderNo,
            deliveryMediumMasterId : formInputs.deliveryMediumMasterId ? formInputs.deliveryMediumMasterId: null,
            locationRestriction : formInputs.locationRestriction ? formInputs.locationRestriction?.clientRefMasterCd: null,
            shipmentOrderDt: shipmentOrderDt,
            subClientId: formInputs['subClientId'] ? formInputs['subClientId']?.id : formInputs['clientName'] ? formInputs['clientName']?.id : '' ,
            clientCode: formInputs['subClientId'] ? formInputs['subClientId'].name : formInputs['clientName'] ? formInputs['clientName']?.name : '' ,
            customFields: customFields,
            customFieldsEntity: customFields,
            returnToSameAddress: returnOrderAddress,
            preparationTime: preparationTime && parseInt(String(preparationTime)),
            numberOfItems: numberOfItems && parseInt(String(numberOfItems))
        }

        return payload
    
    }

    return { getOrderDetails, validateTime, getCustomerData, prepareData}
}