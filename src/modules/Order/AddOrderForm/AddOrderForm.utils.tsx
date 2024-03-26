import moment from "moment";
import { sendGA } from "../../../utils/ga"
import {IDropdownOptionProps, IOrderData} from "./AddOrderForm.models"
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import { ICustomerAddressOptionData } from "./AddOrderForm.models";
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';
import { useDispatch } from 'react-redux';
import React, {Dispatch} from 'react'
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { IconButton } from 'ui-library'
import { hybridRouteTo } from "../../../utils/hybridRouting";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IClientProperty } from "../../common/ClientProperties/interfaces";
import { IAddOrderFormActions } from "./AddOrderForm.actions";

export const generateOrderFormData = (data: IOrderData, orderType: string,isorderTypeIsFMLM: boolean,dynamicLabels: Record<string, string>, isP2POrder?: boolean, clientProperties?: Record<string, IClientProperty>, pickupPincodeType?: string, pickupStateType?: string, deliverPincodeType?: string, deliverStateType?: string, returnPincodeType?: string, returnStateType?: string) => {
  const fillPickupAddressData = (data: IOrderData) => {
    const { customerName, serviceTimeInMins, pickupAccountName, pickupPhoneNumber, contactNumber, apartment, streetName, country, state, locality, city, startTimeWindow, endTimeWindow, landmark, pincode, pickupNotes, pickupServiceTime, pickupApartment, pickupCountry, pickupStreetName, pickupState, pickupLocality, pickupLandmark, pickupPinCode, pickupCity, pickupStartTimeWindow, pickupEndTimeWindow, pickupBranch, pickupWhatsappOptin } = data;
    const branchName = data['branchName'] ? data['branchName'] : '';
    const branchId = data['clientBranchId'] ? data['clientBranchId'] : '';
    const canonicalId = data['canonicalId'] ? data['canonicalId']  : '';
    const gmtoffset = data['gmtoffset'] ? data['gmtoffset']  : '';
    const branchNodeId = data['branchNodeId'] ? data['branchNodeId'] : '';
    return {
      distributionCenter: { name: branchName, id : branchId, 'clientNodeId' : branchNodeId},
      pickupAccountName: isP2POrder ? pickupAccountName : customerName,
      pickupServiceTime: isP2POrder ? pickupServiceTime :serviceTimeInMins,
      pickupApartment: isP2POrder ? pickupApartment : apartment,
      pickupCountry:  isP2POrder ? {name: pickupCountry, id: pickupCountry} : { name: country, id:country },
      pickupStreetName: isP2POrder ? pickupStreetName : streetName,
      pickupState: isP2POrder ? (pickupStateType === 'text' ? pickupState : {name: pickupState, id: pickupState}) : (pickupStateType === 'text' ? state : { name: state, id:state }),
      pickupLocality: isP2POrder ? pickupLocality : locality,
      pickupLandmark: isP2POrder ? pickupLandmark : landmark,
      pickupPinCode:  isP2POrder ? pickupPinCode ? (pickupPincodeType === 'text' ? pickupPinCode : { name: pickupPinCode, 'pincode_lable': pickupPinCode, 'pincode': pickupPinCode, 'displayName': pickupPinCode, 'id': pickupPinCode }): '' : pincode ? (pickupPincodeType === 'text' ? pincode : { name: pincode, 'pincode_lable': pincode, 'pincode': pincode, 'displayName': pincode, 'id': pincode }) : '',
      pickupCity:  isP2POrder ? pickupCity : city ,
      pickupStartTimeWindow: isP2POrder ? moment.utc(pickupStartTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : startTimeWindow ? moment.utc(startTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate(): '',
      pickupEndTimeWindow: isP2POrder ? moment.utc(pickupEndTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : endTimeWindow ? moment.utc(endTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate(): '',
      pickupBranch: isP2POrder ? { label: pickupBranch,name: pickupBranch, value: pickupBranch, title: pickupBranch, id: branchId, branchId: branchId } : { label: branchName, value: branchName, title: branchName, id: branchId, branchId: branchId, name: branchName },
      pickupTimezone:  {value: canonicalId, label: gmtoffset},
      pickupNotes: pickupNotes,
      pickupPhoneNumber: isP2POrder ? pickupPhoneNumber : contactNumber,
      pickupWhatsappOptin: pickupWhatsappOptin ?? 'N'
    }
}

const fillDeliverAddressData = (data: IOrderData) => {
  const { deliverAccountName, deliverServiceTime, deliverPinCode, deliverPhoneNumber, emailAddress, deliverNotes, deliverState, deliverEndTimeWindow, deliverStartTimeWindow, deliverBranch, deliverCountry, deliverLocality, deliverApartment, deliverStreetName, deliverCity, deliverLandmark, startTimeWindow, endTimeWindow, deliverWhatsappOptin } = data
    const branchName = data['branchName'] ? data['branchName'] : '';
    const branchId = data['clientBranchId'] ? data['clientBranchId'] : '';
    const clientNodeId =  data['branchNodeId'] ? data['branchNodeId'] : '';
    const branchTimezoneId = data['branchTimezoneId'] ? data['branchTimezoneId']  : '';
    const canonicalId = data['canonicalId'] ? data['canonicalId']  : '';
    const gmtoffset = data['gmtoffset'] ? data['gmtoffset']  : '';
    const dst = data['dst'] ? data['dst'] : '';
    const deliverStartTimeWindowDate = data['orderType'] && data['orderType'] === 'DELIVER' ? moment.utc(startTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : moment.utc(deliverStartTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate();
    const deliverEndTimeWindowDate =  data['orderType'] && data['orderType'] === 'DELIVER' ? moment.utc(endTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : moment.utc(deliverEndTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate();
    return {
      distributionCenter: { name: branchName, id : branchId , 'branchId' : branchId, 'clientNodeId' : clientNodeId, 'timezoneId' : branchTimezoneId , 'canonicalId': canonicalId, 'gmtoffset' : gmtoffset , 'dst':dst},
      deliverAccountName: deliverAccountName,
      deliverServiceTime: deliverServiceTime ? deliverServiceTime : undefined,
      deliverApartment: deliverApartment,
      deliverStreetName: deliverStreetName,
      deliverLandmark:  deliverLandmark,
      deliverLocality: deliverLocality,
      deliverState: deliverStateType === 'text' ? deliverState : {name: deliverState, id: deliverState},
      deliverPinCode: deliverPinCode ? (deliverPincodeType === 'text' ? deliverPinCode : {displayName: deliverPinCode, name: deliverPinCode, pincode: deliverPinCode, pincodeId: deliverPinCode, pincode_lable: deliverPinCode, id: deliverPinCode}): '',
      deliverCountry: { name: deliverCountry , id: deliverCountry},
      deliverPhoneNumber: deliverPhoneNumber,
      deliverWhatsappOptin: deliverWhatsappOptin ?? 'N',
      deliverEmail: emailAddress,
      deliverCity: deliverCity,
      deliverNotes: deliverNotes,
      deliverStartTimeWindow: deliverStartTimeWindowDate,
      deliverEndTimeWindow: deliverEndTimeWindowDate,
      deliverBranch:{ label: deliverBranch, name:deliverBranch, value: deliverBranch, title: deliverBranch, id: branchId,branchId: branchId},
    }
}

const fillReturnAddressData = (data: IOrderData) => {
  const { returnAccountName, returnServiceTime, returnApartment, returnStreetName, returnLandmark, returnLocality, returnCity, returnPhoneNumber, returnEmail, returnState, returnCountry, returnBranch, isCancelAllowedFl, returnAllowedFl, returnPinCode, returnEndTimeWindow, returnStartTimeWindow, startTimeWindow, endTimeWindow, returnWhatsappOptin } = data;
    const branchId = data['clientBranchId'] ? data['clientBranchId'] : '';
    const returnStartTimeWindowDate = data['orderType'] && data['orderType'] === 'DELIVER' ? moment.utc(startTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : moment.utc(returnStartTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate();
    const returnEndTimeWindowDate =  data['orderType'] && data['orderType'] === 'DELIVER' ? moment.utc(endTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() : moment.utc(returnEndTimeWindow).tz(clientProperties?.TIMEZONE?.propertyValue).toDate();
    return {
      returnAccountName: returnAccountName,
      returnServiceTime: returnServiceTime ? returnServiceTime : undefined,
      returnApartment: returnApartment,
      returnStreetName: returnStreetName,
      returnLandmark: returnLandmark,
      returnLocality: returnLocality,
      returnCity: returnCity,
      returnPinCode: returnPinCode ? (returnPincodeType === 'text'? returnPinCode : {displayName: returnPinCode, name: returnPinCode, pincode: returnPinCode, pincodeId: returnPinCode, pincode_lable: returnPinCode, id: returnPinCode}): '',
      returnPhoneNumber: returnPhoneNumber,
      returnWhatsappOptin: returnWhatsappOptin ?? 'N',
      returnEmail: returnEmail,
      returnState: returnStateType === 'text' ? returnState : {name: returnState, id: returnState},
      returnCountry: { name: returnCountry , id: returnCountry},
      returnBranch: { label: returnBranch,name:returnBranch, value: returnBranch, title: returnBranch, id: branchId, branchId: branchId},
      isCancelAllowedFl: isCancelAllowedFl,
      returnAllowedFl: returnAllowedFl,
      returnStartTimeWindow: returnStartTimeWindowDate,
      returnEndTimeWindow: returnEndTimeWindowDate
    }
}
  if (orderType === dynamicLabels.pickUpLeg && !isorderTypeIsFMLM) {
    return fillPickupAddressData(data)
  } else if (orderType === dynamicLabels.deliveryLeg && !isorderTypeIsFMLM && !isP2POrder) {
    return fillDeliverAddressData(data)
  } else if (isorderTypeIsFMLM && data.returnToSameAddress || (isorderTypeIsFMLM && !data.returnToSameAddres)) {
    return {...fillPickupAddressData(data), ...fillDeliverAddressData(data), ...fillReturnAddressData(data)}
  } else if(isP2POrder) {
    return {...fillPickupAddressData(data), ...fillDeliverAddressData(data)}
  }  else { 
    return {}
  }
}

export const useGoogleAnalytics = () => {
    
    const gaOnSubmit = () => {
      sendGA('Form Actions', 'Button Click - Save');
    }
  
    const gaOnCancel = () => {
      sendGA('Form Actions', 'Button Click - Cancel');
    }

    const gaOnManualAssign = () => {
      sendGA('Form Actions', 'Button Click - save and assign');
    }

    const gaOnAutoAssignToTrip = () => {
      sendGA('Form Actions', 'Button Click - save and auto-assign to planned trips');
    }

    const gaOnAutoAssignToNearestDriver = () => {
      sendGA('Form Actions', 'Button Click - save and auto-assign to nearest driver');
    }
  
    return { gaOnSubmit, gaOnCancel, gaOnManualAssign, gaOnAutoAssignToTrip, gaOnAutoAssignToNearestDriver}
}

export const getFormattedDate = (dateVal: string, dateFormat: string) => {
  return moment(dateVal).format(`${dateFormat?.toUpperCase()} hh:mm A`);
}

export const ListViewOption = [
  {
    value: 'save and assign',
    label: 'Manually Assign to a Trip',
    iconVariant: 'icomoon-ribbon-tick'
  },
  {
    value: 'save and auto-assign to planned trips',
    label: 'Auto-assign to an Existing Route',
    iconVariant: 'line-node-graph'
  },
  {
    value: 'save and auto-assign to nearest driver',
    label: 'Auto-assign to the Nearest Delivery Associate',
    iconVariant: 'origin'
  }
]

export const populateCustData = (key: string, structure_copy:IMongoFormStructure, data: ICustomerAddressOptionData[], isEditable:boolean) => {
  if (key == 'pick up details') {
      structure_copy[key]['pickupAccountName'].editable = isEditable
      structure_copy[key]['pickupEmail'].editable = isEditable;   
      structure_copy[key]['pickupPhoneNumber'].editable = isEditable
      structure_copy[key]['pickupWhatsappOptin'].editable = isEditable
      structure_copy[key]['pickupAddressId'].dropdownOptions = data.length && !isEditable ? data : []

      structure_copy[key]['pickupAddressType'].editable = isEditable;
      if(structure_copy[key]['addressFields']['childNodes'] && data?.length){
        const propertiesToDisable = [
          'pickupCity',
          'pickupCountry',
          'pickupLandmark',
          'pickupLocality',
          'pickupPinCode',
          'pickupState',
          'pickupStreetName',
          'pickupApartment'
        ];
      
        propertiesToDisable.forEach(property => {
          const isProp = structure_copy?.[key]?.['addressFields']?.['childNodes']?.[property]
          if (isProp) {
            isProp.editable = isEditable;
          }
        });
      }
  } else if (key == 'delivery details') {
      structure_copy[key]['deliverAccountName'].editable = isEditable;
      structure_copy[key]['deliverEmail'].editable = isEditable;
      structure_copy[key]['deliverPhoneNumber'].editable = isEditable;
      structure_copy[key]['deliverWhatsappOptin'].editable = isEditable;
      structure_copy[key]['deliverAddressId'].dropdownOptions = data.length && !isEditable ? data : []

      structure_copy[key]['deliverAddressType'].editable = isEditable;
      if(data?.length){
        const propertiesToDisable = [
          'deliverCity',
          'deliverCountry',
          'deliverLandmark',
          'deliverLocality',
          'deliverPinCode',
          'deliverState',
          'deliverStreetName',
          'deliverApartment'
        ];
        
        propertiesToDisable.forEach(property => {
          const isProp = structure_copy?.[key]?.['addressFields']?.['childNodes']?.[property]
          if (isProp) {
            isProp.editable = isEditable;
          }
        })

      }
  } else if (key == 'return address details') {
      structure_copy[key]['returnAccountName'].editable = isEditable;
      structure_copy[key]['returnEmail'].editable = isEditable;
      structure_copy[key]['returnPhoneNumber'].editable = isEditable;
      structure_copy[key]['returnWhatsappOptin'].editable = isEditable;
      structure_copy[key]['returnAddressId'].dropdownOptions = data.length && !isEditable ? data : []

      structure_copy[key]['returnAddressType'].editable = isEditable;
      if(data?.length){
        const propertiesToDisable = [
          'returnCity',
          'returnCountry',
          'returnLandmark',
          'returnLocality',
          'returnPinCode',
          'returnState',
          'returnStreetName',
          'returnApartment'
        ];

        propertiesToDisable.forEach(property => {
          const isProp = structure_copy?.[key]?.['addressFields']?.['childNodes']?.[property]
          if (isProp) {
            isProp.editable = isEditable;
          }
        })
        }
  } else if (key == 'customer details') {
      structure_copy[key]['AccountName'].editable = isEditable;
      structure_copy[key]['Email'].editable = isEditable;
      structure_copy[key]['PhoneNumber'].editable = isEditable;
      structure_copy[key]['AddressId'].dropdownOptions = data.length && !isEditable ? data : []
  }
  return structure_copy;
}

export const useBreadCrumbs = (formInstance: UseFormMethods<FieldValues>) => {
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
  const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'orders', label: dynamicLabels.orders, disabled: false  },
    { id: 'addOrder', label: dynamicLabels.addOrder, disabled: true },
  ], [dynamicLabels])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'orders':
        if (!formInstance.formState.isDirty) {
          dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : {}})
          hybridRouteTo('order')
        } else {
          globalPopupDispatch({
            type: '@@globalPopup/SET_PROPS',
            payload: {
              isOpen: true,
              title: dynamicLabels.navigationConfirmation,
              content: dynamicLabels.dataLostWarningMsg,
              footer: (
                <>
                  <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); hybridRouteTo('order'); dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : {}})}}>{dynamicLabels.ok}</IconButton>
                  <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                </>
              )
            }
          })
        }
        break;
    }
  }
  return { breadCrumbOptions, handleBreadCrumbClick }
}

export const formatAddress = (country: IDropdownOptionProps, pincode: IDropdownOptionProps, state: IDropdownOptionProps) => {
    let formattedString = '';
    if (state && state.name) {
        formattedString += state.name
    }
    if (country && country.name) {
        formattedString += ` ${country.name}`
    }
    if (pincode) {
        formattedString += ` ${pincode}`
    }
    return formattedString;
}

export const useReactPath = () => {
  const [path, setPath] = React.useState(window.location.href);
  const listenToPopstate = () => {
    const winPath = window.location.href;
    setPath(winPath);
  };
  React.useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);
  return path;
};

export const handleDisableFieldsForClone = (structure_copy: any, orderType: string, data: IOrderData, dynamicLabels: Record<string, string>, isorderTypeIsFMLM: boolean, pickupProfile: boolean, deliveryProfile: boolean, isP2POrder?: boolean) => {
  if (orderType === dynamicLabels.pickUpLeg && !isorderTypeIsFMLM && pickupProfile) {
    return populateCustData('pick up details', structure_copy, [{}] as ICustomerAddressOptionData[], false);
  } else if (orderType === dynamicLabels.deliveryLeg && !isorderTypeIsFMLM && !isP2POrder && deliveryProfile) {
    return populateCustData('delivery details', structure_copy, [{}] as ICustomerAddressOptionData[], false);
  } else if (isorderTypeIsFMLM && data.returnToSameAddress || (isorderTypeIsFMLM && !data.returnToSameAddres)) {
    pickupProfile && (structure_copy = populateCustData('pick up details', structure_copy, [{}] as ICustomerAddressOptionData[], false));
    deliveryProfile && (structure_copy = populateCustData('delivery details', structure_copy, [{}] as ICustomerAddressOptionData[], false));
    pickupProfile && (structure_copy = populateCustData('return address details', structure_copy, [{}] as ICustomerAddressOptionData[], false));
    return structure_copy
  } else if (isP2POrder) {
    pickupProfile && (structure_copy = populateCustData('pick up details', structure_copy, [{}] as ICustomerAddressOptionData[], false));
    deliveryProfile && (structure_copy = populateCustData('delivery details', structure_copy, [{}] as ICustomerAddressOptionData[], false));
    return structure_copy
  } else {
    return structure_copy
  }

}