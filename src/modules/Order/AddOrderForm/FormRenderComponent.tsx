import React, {Dispatch, ChangeEvent, useState, useEffect}  from 'react'
import { SectionHeaderContainer, AddressFieldWrapper, TimeZoneFieldWrapper  } from './AddOrderFormStyledComponents'
import { SectionHeader, Box, Grid, Checkbox, useToast } from 'ui-library'
import FormField from '../../../utils/components/Form/FormField';
import AddOrderFormMap from './AddOrderFormMap';
import { useDispatch } from 'react-redux';
import { IAddOrderFormActions } from './AddOrderForm.actions';
import { deepCopy } from '../../../utils/helper';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';
import ErrorBoundary from '../../../utils/components/Form/ErrorBoundary';
import { IMongoField } from '../../../utils/mongo/interfaces';
import { getQueryParams, routeContains } from '../../../utils/hybridRouting';

interface FormRenderProps {
    sectionName: string
    formInstance: UseFormMethods<FieldValues>
    watchShipmentsType: string
    watchPhoneNumbers: Record<string, string>
    returnOrderAddress: boolean
    handleCrateModalPopup: Function
    returnOrderAddressValue: Function
    isLoading: boolean
    pickupMapPosition: Array<number>
    deliverMapPosition: Array<number>
    returnMapPosition: Array<number>
    customerMapPosition: Array<number>
    setPickupMapPosition: Function
    setDeliverMapPosition: Function
    setReturnMapPosition: Function
    setCustomerMapPosition: Function
    userType: string
    deliveryLeg: boolean
    pickupLeg: boolean
    isP2POrder: boolean
}

const FormRenderComponent = (props : FormRenderProps) => {

    const { sectionName, formInstance, watchShipmentsType, watchPhoneNumbers, returnOrderAddress, handleCrateModalPopup, returnOrderAddressValue, isLoading, pickupMapPosition, deliverMapPosition, returnMapPosition, customerMapPosition, setPickupMapPosition, setDeliverMapPosition, setReturnMapPosition, setCustomerMapPosition, userType, deliveryLeg, pickupLeg, isP2POrder} = props;

    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const structure = useTypedSelector(state => state.orderForm.structure)

    const activateCustomerProfilingPickup = useTypedSelector(state => state.orderForm.activateCustomerProfilingPickup)
    const activateCustomerProfilingDeliver = useTypedSelector(state => state.orderForm.activateCustomerProfilingDeliver)
    const toast = useToast();
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    const { setValue, clearErrors, formState, getValues } = formInstance
    const [isPickupMapSearched, setPickUpMapSearched] = useState<boolean>(false);
    const [isDeliverMapSearched, setDeliverMapSearched] = useState<boolean>(false);
    const [isReturnMapSearched, setReturnMapSearched] = useState<boolean>(false);
    const [isCustomerMapSearched, setCustomerMapSearched] = useState<boolean>(false);
    const [isPickupAddressFieldsTouched, setPickupAddressFieldsTouched] = useState<boolean>(false);
    const [isDeliverAddressFieldsTouched, setDeliverAddressFieldsTouched] = useState<boolean>(false);
    const [isReturnAddressFieldsTouched, setReturnAddressFieldsTouched] = useState<boolean>(false);
    const [isCustomerAddressFieldsTouched, setCustomerAddressFieldsTouched] = useState<boolean>(false);

    const { shipmentId } = getQueryParams();

    const handleOrderNoGenerartion = () => {
        dispatch({ type: '@@addOrderForm/FETCH_ORDER_NUMBER' })
    } 

    const crateModalFlagHandle = () => {
        handleCrateModalPopup(true)
    }

    const returnOrderValueChange = (flag: boolean) => {
        returnOrderAddressValue(flag)
    }

    const populateAdderessData = async (addressField: any, key: string) => {
        
        const structure_copy1 = deepCopy(structure)
        if (!addressField) {
            if (key == 'pick up details') {
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

                structure_copy1[key]['addressFields']['childNodes']['pickupApartment'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupCity'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupCountry'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupLandmark'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupLocality'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupPinCode'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupState'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['pickupStreetName'].editable = true;
                structure_copy1[key]['pickupAddressType'].editable = true;
                structure_copy1[key]['pickupTimezone'].editable = true;

                if (structure_copy1[key]['pickupLocationRestriction']) {
                    setValue('pickupLocationRestriction', '');
                    structure_copy1[key]['pickupLocationRestriction'].editable = true;
                }
                if (structure_copy1?.[key]?.['pickupAddressNotes']?.permission === true) {
                    structure_copy1[key]['pickupAddressNotes'].permission = false;
                    setValue('pickupAddressNotes', '');
                }
            } else if (key == 'delivery details') {
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

                structure_copy1[key]['addressFields']['childNodes']['deliverApartment'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverCity'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverCountry'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverLandmark'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverLocality'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverPinCode'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverState'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['deliverStreetName'].editable = true;
                structure_copy1[key]['deliverAddressType'].editable = true;
                structure_copy1[key]['deliverTimezone'].editable = true;
                if (structure_copy1[key]['deliverLocationRestriction']) {
                    setValue('deliverLocationRestriction', '');
                    structure_copy1[key]['deliverLocationRestriction'].editable = true;
                }
                if (structure_copy1?.[key]?.['deliverAddressNotes']?.permission === true) {
                    structure_copy1[key]['deliverAddressNotes'].permission = false;
                    setValue('deliverAddressNotes', '')
                }
            } else if (key == 'return address details') {
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

                structure_copy1[key]['addressFields']['childNodes']['returnApartment'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnCity'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnCountry'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnLandmark'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnLocality'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnPinCode'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnState'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['returnStreetName'].editable = true;
                structure_copy1[key]['returnAddressType'].editable = true;
                structure_copy1[key]['returnTimezone'].editable = true;
                if (structure_copy1[key]['returnLocationRestriction']) {
                    setValue('returnLocationRestriction', '');
                    structure_copy1[key]['returnLocationRestriction'].editable = true;
                }
                if (structure_copy1?.[key]?.['returnAddressNotes']?.permission === true) {
                    structure_copy1[key]['returnAddressNotes'].permission = false;
                    setValue('returnAddressNotes', '')
                }
            } else if (key == 'customer details') {
                setValue('Apartment', '');
                setValue('City', '');
                setValue('Country', '');
                setValue('Landmark', '');
                setValue('Locality', '');
                setValue('PinCode', '');
                setValue('State', '');
                setValue('StreetName', '');
                setValue('AddressType', '');
                setValue('customerTimezone', '');

                structure_copy1[key]['addressFields']['childNodes']['Apartment'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['City'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['Country'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['Landmark'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['Locality'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['PinCode'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['State'].editable = true;
                structure_copy1[key]['addressFields']['childNodes']['StreetName'].editable = true;
                structure_copy1[key]['AddressType'].editable = true;
                structure_copy1[key]['customerTimezone'].editable = true;
                if (structure_copy1[key]['LocationRestriction']) {
                    setValue('LocationRestriction', '');
                    structure_copy1[key]['LocationRestriction'].editable = true;
                }
            }
        } else {
            if (addressField?.isActiveFl) {
                const urlForAddress = apiMappings.order.form.getAddressJson + '&country=' + addressField.country;
                const dataForAddress = Object.keys(structure_copy1[key].addressFields.childNodes);
    
                const {data} = await axios.post(urlForAddress, dataForAddress);
                structure_copy1[key].addressFields.childNodes = data?.["addressFields"];
                if(structure_copy1[key].addressFields.childNodes){
                if (key == 'pick up details') {
                    setPickupMapPosition([addressField.lat ? addressField.lat : -200, addressField.lng ? addressField.lng : -200])
                    setValue('pickupAddress', addressField.address)
                    setValue('pickupApartment', addressField.apartment);
                    setValue('pickupCity', addressField.city);
                    setValue('pickupCountry', { 'id': addressField.countryId, 'name': addressField.country });
                    setValue('pickupLandmark', addressField.landmark);
                    setValue('pickupLocality', addressField.locality);
                    setValue('pickupPinCode', addressField.pincode);
                    setValue('pickupState', addressField.state);
                    setValue('pickupStreetName', addressField.streetName);
                    clearErrors(["pickupApartment", "pickupCity","pickupCountry", "pickupLandmark", "pickupLocality", "pickupPinCode", "pickupState", "pickupStreetName"])
                    addressField.clientNodeType ? setValue('pickupAddressType', { 'id': addressField.clientNodeType, 'name': addressField.clientNodeType }) : '';
    
                    structure_copy1[key]['addressFields']['childNodes']['pickupApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupStreetName'].editable = false;
                    structure_copy1[key]['pickupAddressType'].editable = false;
                    structure_copy1[key]['pickupTimezone'].editable = false;
                    if (structure_copy1[key]['pickupLocationRestriction']) structure_copy1[key]['pickupLocationRestriction'].editable = false;
    
                    if (structure_copy1[key]['addressFields']['childNodes']['pickupState'].fieldType === 'select') {
                        setValue('pickupState', { "id": 1, "name": addressField.state, "code": "AFG" })
                    }
                    if (structure_copy1[key]['addressFields']['childNodes']['pickupPinCode'].fieldType == 'select') {
                        setValue('pickupPinCode', addressField.pincode ? { "id": addressField.pincode, "name": addressField.pincode, "code": addressField.pincode } : null)
                    }
                    if (addressField.canonicalId) {
                        setValue('pickupTimezone', { 'canonicalId': addressField.canonicalId, 'gmtoffset': addressField.gmtoffset, id:addressField.gmtoffset, name: addressField.gmtoffset });
                    }
                    if (structure_copy1[key]['pickupLocationRestriction']) {
                       setValue('pickupLocationRestriction', { id: addressField.locationRestriction, name: addressField.locationRestriction, clientRefMasterCd: addressField.locationRestriction, clientRefMasterDesc: addressField.locationRestriction });
                    }
                    if (addressField.addressNotes) {
                        structure_copy1[key]['pickupAddressNotes'].permission = true;
                        setValue('pickupAddressNotes', addressField.addressNotes)
                    }
                } else if (key == 'return address details') {
                    setReturnMapPosition([addressField.lat ? addressField.lat : -200, addressField.lng ? addressField.lng : -200])
                    setValue('returnAddress', addressField.address)
                    setValue('returnApartment', addressField.apartment);
                    setValue('returnCity', addressField.city);
                    setValue('returnCountry', { 'id': addressField.countryId, 'name': addressField.country });
                    setValue('returnLandmark', addressField.landmark);
                    setValue('returnLocality', addressField.locality);
                    setValue('returnPinCode', addressField.pincode);
                    setValue('returnState', addressField.state);
                    setValue('returnStreetName', addressField.streetName);
                    clearErrors(["returnApartment", "returnCity","returnCountry", "returnLandmark", "returnLocality", "returnPinCode", "returnState", "returnStreetName"])
                    addressField.clientNodeType ? setValue('returnAddressType', { 'id': addressField.clientNodeType, 'name': addressField.clientNodeType }) : '';
    
                    structure_copy1[key]['addressFields']['childNodes']['returnApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnStreetName'].editable = false;
                    structure_copy1[key]['returnAddressType'].editable = false;
                    structure_copy1[key]['returnTimezone'].editable = false;
                    if (structure_copy1[key]['returnLocationRestriction']) structure_copy1[key]['returnLocationRestriction'].editable = false;
    
                    if (structure_copy1[key]['addressFields']['childNodes']['returnState'].fieldType === 'select') {
                        setValue('returnState', { "id": 1, "name": addressField.state, "code": "AFG" })
                    }
                    if (structure_copy1[key]['addressFields']['childNodes']['returnPinCode'].fieldType == 'select') {
                        setValue('returnPinCode', addressField.pincode ? { "id": addressField.pincode, "name": addressField.pincode, "code": addressField.pincode } : null)
                    }
                    if (addressField.canonicalId) {
                        setValue('returnTimezone', { 'canonicalId': addressField.canonicalId, 'gmtoffset': addressField.gmtoffset, id:addressField.gmtoffset, name: addressField.gmtoffset });
                    }
                    if (structure_copy1[key]['returnLocationRestriction']) {
                       setValue('returnLocationRestriction', { id: addressField.locationRestriction, name: addressField.locationRestriction, clientRefMasterCd: addressField.locationRestriction, clientRefMasterDesc: addressField.locationRestriction });
                    }
                    if (addressField.addressNotes) {
                        structure_copy1[key]['returnAddressNotes'].permission = true;
                        setValue('returnAddressNotes', addressField.addressNotes)
                    }
                } else if (key == 'delivery details') {
                    setDeliverMapPosition(([addressField.lat ? addressField.lat : -200, addressField.lng ? addressField.lng : -200]))
                    setValue('deliverAddress', addressField.address)
                    setValue('deliverApartment', addressField.apartment);
                    setValue('deliverCity', addressField.city);
                    setValue('deliverCountry', { 'id': addressField.countryId, 'name': addressField.country });
                    setValue('deliverLandmark', addressField.landmark);
                    setValue('deliverLocality', addressField.locality);
                    setValue('deliverPinCode', addressField.pincode);
                    setValue('deliverState', addressField.state);
                    setValue('deliverStreetName', addressField.streetName);
                    clearErrors(["deliverApartment", "deliverCity","deliverCountry", "deliverLandmark", "deliverLocality", "deliverPinCode", "deliverState", "deliverStreetName"])
                    addressField.clientNodeType ? setValue('deliverAddressType', { 'id': addressField.clientNodeType, 'name': addressField.clientNodeType }) : '';
    
                    structure_copy1[key]['addressFields']['childNodes']['deliverApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverStreetName'].editable = false;
                    structure_copy1[key]['deliverAddressType'].editable = false;
                    structure_copy1[key]['deliverTimezone'].editable = false;
                    if (structure_copy1[key]['deliverLocationRestriction']) structure_copy1[key]['deliverLocationRestriction'].editable = false;
    
                    if (structure_copy1[key]['addressFields']['childNodes']['deliverState'].fieldType === 'select') {
                        setValue('deliverState', { "id": 1, "name": addressField.state, "code": "AFG" })
                    }
                    if (structure_copy1[key]['addressFields']['childNodes']['deliverPinCode'].fieldType == 'select') {
                        setValue('deliverPinCode', addressField.pincode ? { "id": addressField.pincode, "name": addressField.pincode, "code": addressField.pincode } : null)
                    }
                    if (addressField.canonicalId) {
                        setValue('deliverTimezone', { 'canonicalId': addressField.canonicalId, 'gmtoffset': addressField.gmtoffset, id:addressField.gmtoffset, name: addressField.gmtoffset });
                    }
                    if (structure_copy1[key]['deliverLocationRestriction']) {
                       setValue('deliverLocationRestriction', { id: addressField.locationRestriction, name: addressField.locationRestriction, clientRefMasterCd: addressField.locationRestriction, clientRefMasterDesc: addressField.locationRestriction });
                    }
                    if (addressField.addressNotes) {
                        structure_copy1[key]['deliverAddressNotes'].permission = true;
                        setValue('deliverAddressNotes', addressField.addressNotes)
                    }
                } else if (key == 'customer details') {
                    setCustomerMapPosition(([addressField.lat ? addressField.lat : -200, addressField.lng ? addressField.lng : -200]))
                    setValue('Apartment', addressField.apartment);
                    setValue('City', addressField.city);
                    setValue('Country', { 'id': addressField.countryId, 'name': addressField.country });
                    setValue('Landmark', addressField.landmark);
                    setValue('Locality', addressField.locality);
                    setValue('PinCode', addressField.pincode);
                    setValue('State', addressField.state);
                    setValue('StreetName', addressField.streetName);
                    clearErrors(["Apartment", "City","Country", "Landmark", "Locality", "PinCode", "State", "StreetName"])
                    addressField.clientNodeType ? setValue('AddressType', { 'id': addressField.clientNodeType, 'name': addressField.clientNodeType }) : '';
    
                    structure_copy1[key]['addressFields']['childNodes']['Apartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['City'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Country'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Landmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Locality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['PinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['State'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['StreetName'].editable = false;
                    structure_copy1[key]['AddressType'].editable = false;
                    structure_copy1[key]['customerTimezone'].editable = false;
                    if (structure_copy1[key]['LocationRestriction']) structure_copy1[key]['LocationRestriction'].editable = false;
    
                    if (structure_copy1[key]['addressFields']['childNodes']['State'].fieldType === 'select') {
                        setValue('State', { "id": 1, "name": addressField.state, "code": "AFG" })
                    }
                    if (structure_copy1[key]['addressFields']['childNodes']['PinCode'].fieldType == 'select') {
                        setValue('PinCode', addressField.pincode ? { "id": addressField.pincode, "name": addressField.pincode, "code": addressField.pincode } : null)
                    }
                    if (addressField.canonicalId) {
                        setValue('customerTimezone', { 'canonicalId': addressField.canonicalId, 'gmtoffset': addressField.gmtoffset, id:addressField.gmtoffset, name: addressField.gmtoffset });
                    }
                    if (structure_copy1[key]['LocationRestriction']) {
                       setValue('LocationRestriction', { id: addressField.locationRestriction, name: addressField.locationRestriction, clientRefMasterCd: addressField.locationRestriction, clientRefMasterDesc: addressField.locationRestriction });
                    }
                }
                }
            } else {
                if (key == 'pick up details') {
                    structure_copy1[key]['addressFields']['childNodes']['pickupApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['pickupStreetName'].editable = false;
                    structure_copy1[key]['pickupAddressType'].editable = false;
                    structure_copy1[key]['pickupTimezone'].editable = false;
                } else if (key == 'delivery details') {
                    structure_copy1[key]['addressFields']['childNodes']['deliverApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['deliverStreetName'].editable = false;
                    structure_copy1[key]['deliverAddressType'].editable = false;
                    structure_copy1[key]['deliverTimezone'].editable = false;
                } else if (key == 'return address details') {
                    structure_copy1[key]['addressFields']['childNodes']['returnApartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnCity'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnCountry'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnLandmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnLocality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnPinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnState'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['returnStreetName'].editable = false;
                    structure_copy1[key]['returnAddressType'].editable = false;
                    structure_copy1[key]['returnTimezone'].editable = false;
                } else if (key == 'customer details') {
                    structure_copy1[key]['addressFields']['childNodes']['Apartment'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['City'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Country'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Landmark'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['Locality'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['PinCode'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['State'].editable = false;
                    structure_copy1[key]['addressFields']['childNodes']['StreetName'].editable = false;
                    structure_copy1[key]['AddressType'].editable = false;
                    structure_copy1[key]['customerTimezone'].editable = false;
                }
                toast.add('Please select active Address ID', 'warning', false)
            }
        }
        dispatch({ type: '@@addOrderForm/SET_STRUCTURE_DATA', payload : structure_copy1})
    }

    useEffect(() => {
        const whatsappValues = getValues(['pickupWhatsappOptin', 'returnWhatsappOptin', 'deliverWhatsappOptin' ])
        if (formState.touched?.pickupPhoneNumber && whatsappValues.pickupWhatsappOptin != 'N' && !watchPhoneNumbers?.pickupPhoneNumber) {
            setValue('pickupWhatsappOptin', 'N');
        }
        if (formState.touched?.returnPhoneNumber && whatsappValues.returnWhatsappOptin != 'N' && !watchPhoneNumbers?.returnPhoneNumber) {
            setValue('returnWhatsappOptin', 'N');
        }
        if (formState.touched?.deliverPhoneNumber && whatsappValues.deliverWhatsappOptin != 'N' && !watchPhoneNumbers?.deliverPhoneNumber) {
            setValue('deliverWhatsappOptin', 'N');
        }
    }, [watchPhoneNumbers]);

    return(
        <div>
            {Object.keys(structure[sectionName]).some((fieldKey) => (structure[sectionName][fieldKey].permission) && ((sectionName !== 'return address details' || !returnOrderAddress))) &&   
                <SectionHeaderContainer>
                <SectionHeader headerTitle={dynamicLabels[sectionName]} />
                </SectionHeaderContainer>
                        
            }
            
            {(sectionName ===  'pick up details' || sectionName === 'delivery details' || (sectionName === 'return address details' && !returnOrderAddress) || sectionName === 'customer details') &&
                (
                    <Box display='flex' justifyContent='space-between'>
                        <div style={{width: '50%'}}>
                            <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                                {Object.keys(structure[sectionName]).map(fieldName => {
                                const meta = structure[sectionName][fieldName]
                                meta.shouldRemoveOnBlur =true;
                                meta.multipleFiles = false
                                const { permission, fieldType, childNodes } = meta
                                    if (!permission || ['deliverWhatsappOptin', 'pickupWhatsappOptin', 'returnWhatsappOptin'].includes(fieldName)) {
                                    return undefined
                                }

                                if (fieldType === 'address' && childNodes) {
                                    return Object.keys(childNodes).map((key) => {
                                        if (childNodes[key].permission) {
                                            return (
                                                <Grid item key={key} xs={12} sm={6} md={3} className='grid-item'>
                                                <FormField
                                                    name={key}
                                                    meta={childNodes[key]}
                                                    formInstance={formInstance} 
                                                     onChange={() => { 
                                                        if(sectionName === 'pick up details'){
                                                            setPickUpMapSearched(false); 
                                                            setPickupAddressFieldsTouched(true)
                                                        } else if(sectionName === 'delivery details'){
                                                            setDeliverMapSearched(false); 
                                                            setDeliverAddressFieldsTouched(true)
                                                        } else if(sectionName === 'return address details' && !returnOrderAddress){
                                                            setReturnMapSearched(false); 
                                                            setReturnAddressFieldsTouched(true)
                                                        } else if(sectionName === 'customer details'){
                                                            setCustomerMapSearched(false); 
                                                            setCustomerAddressFieldsTouched(true)
                                                        }
                                                    }}
                                                    />
                                                </Grid> 
                                            )
                                        } else {
                                            return undefined
                                        }
                                    })
                                }
                                if (((activateCustomerProfilingPickup || (fieldType === 'autocomplete')) && (fieldName === 'returnAddressId' || fieldName === 'pickupAddressId')) || ((activateCustomerProfilingDeliver || (fieldType === 'autocomplete')) && (fieldName === 'returnAddressId' || fieldName === 'deliverAddressId' || fieldName === 'AddressId'))) {
                                    return (
                                        <Grid item key={fieldName} xs={12} sm={12} md={3} className='grid-item'>
                                        <AddressFieldWrapper>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {populateAdderessData(e, sectionName)}}
                                                isSetSearchValue
                                                formInstance={formInstance} />
                                        </AddressFieldWrapper>
                                        </Grid>
                                    )
                                }
                                else if (fieldName === 'pickupTimezone' || fieldName === 'deliverTimezone' || fieldName === 'returnTimezone'){
                                    return (
                                        <Grid item key={fieldName} xs={12} sm={12} md={3} className='grid-item'>
                                        <TimeZoneFieldWrapper>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                formInstance={formInstance} />
                                        </TimeZoneFieldWrapper>
                                        </Grid>
                                    )
                                } else if (((activateCustomerProfilingPickup || (fieldType === 'autocomplete')) && (fieldName === 'returnAccountCode' || fieldName === 'pickupAccountCode')) || ((activateCustomerProfilingDeliver || (fieldType === 'autocomplete')) && (fieldName === 'returnAccountCode' || fieldName === 'deliverAccountCode' || fieldName === 'AccountCode'))) {
                                    return (
                                        <Grid item key={fieldName} xs={12} sm={12} md={3} className='grid-item'>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => { populateAdderessData(e, sectionName) }}
                                                isSetSearchValue
                                                formInstance={formInstance} />
                                        </Grid>
                                    )
                                } else if (['deliverPhoneNumber', 'pickupPhoneNumber', 'returnPhoneNumber'].includes(fieldName)) {
                                    const whatsAppFieldKey = ['deliverWhatsappOptin', 'pickupWhatsappOptin', 'returnWhatsappOptin'].find(
                                        (r) => Object.keys(structure[sectionName]).indexOf(r) !== -1,
                                    );
                                    const whatsAppFieldMeta: IMongoField | undefined = whatsAppFieldKey
                                        ? structure[sectionName][whatsAppFieldKey as string]
                                        : undefined;


                                    const editable = routeContains(shipmentId) ? whatsAppFieldMeta?.editable : !meta.editable ? meta.editable : (watchPhoneNumbers?.[fieldName]?.length > 0);
                                        
                                    return (
                                        <>
                                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                            <FormField
                                                name={fieldName}
                                                meta={meta}
                                                formInstance={formInstance} 
                                            />
                                            {whatsAppFieldKey && whatsAppFieldMeta?.permission ?
                                                <Box mt='-5px' mb='8px' className='whatsapp-checkbox-wrapper'>
                                                    <FormField
                                                        name={whatsAppFieldMeta.id}
                                                        meta={{ ...whatsAppFieldMeta, editable }}
                                                        formInstance={formInstance} 
                                                    />
                                                </Box> : null
                                            }
                                        </Grid>
                                        </>
                                    )    
                                } else {                                    
                                    return (
                                        <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                        <FormField
                                            name={fieldName}
                                            meta={meta}
                                            formInstance={formInstance} />
                                        </Grid>
                                    )
                                }
                                })}
                            </Grid>
                            {(sectionName ===  'pick up details' && (watchShipmentsType !== 'Point to Point' && deliveryLeg && pickupLeg)) &&                   
                                <Box pb='10px'>
                                    <Checkbox
                                        id='myCheckbox'
                                        onChange={() => returnOrderValueChange(!returnOrderAddress)}
                                        checked={returnOrderAddress}
                                        label={dynamicLabels.returnToSameAddress}
                                        checkboxSize={'md'}
                                    />
                                </Box>
                            }
                        </div>
                        <ErrorBoundary>
                        <AddOrderFormMap formInstance={formInstance} isLoading={isLoading} sectionName= {sectionName} pickupMapPosition = {pickupMapPosition} returnMapPosition = {returnMapPosition} deliverMapPosition = {deliverMapPosition} customerMapPosition = {customerMapPosition} setPickupMapPosition={setPickupMapPosition} setReturnMapPosition= {setReturnMapPosition} setDeliverMapPosition= {setDeliverMapPosition} setCustomerMapPosition={setCustomerMapPosition} isPickupMapSearched={isPickupMapSearched} isPickupAddressFieldsTouched={isPickupAddressFieldsTouched}
                         setPickUpMapSearched={setPickUpMapSearched} isDeliverMapSearched={isDeliverMapSearched} isDeliverAddressFieldsTouched={isDeliverAddressFieldsTouched} isReturnMapSearched={isReturnMapSearched} isReturnAddressFieldsTouched={isReturnAddressFieldsTouched} isCustomerMapSearched={isCustomerMapSearched} isCustomerAddressFieldsTouched={isCustomerAddressFieldsTouched}
                         setDeliverMapSearched={setDeliverMapSearched} setReturnMapSearched={setReturnMapSearched} setCustomerMapSearched={setCustomerMapSearched} typeOfMap={sectionName} setPickupAddressFieldsTouched={setPickupAddressFieldsTouched} deliveryLeg={deliveryLeg} pickupLeg={pickupLeg} setDeliverAddressFieldsTouched={setDeliverAddressFieldsTouched} isP2POrder={isP2POrder} returnOrderAddress={returnOrderAddress} setReturnAddressFieldsTouched={setReturnAddressFieldsTouched}></AddOrderFormMap>
                        </ErrorBoundary>
                    </Box>
                )
            }
            {(sectionName !==  'pick up details' && sectionName !== 'delivery details' && sectionName !== 'return address details' && sectionName !== 'customer details') && 
                (
                    <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                        {Object.keys(structure[sectionName]).map(fieldName => {
                        const meta = structure[sectionName][fieldName]
                        meta.multipleFiles = false
                        const { permission, fieldType, childNodes } = meta

                        if (!permission) {
                            return undefined
                        }

                        if (fieldType === 'address' && childNodes) {
                            return Object.keys(childNodes).map((key) => {
                            return (
                                <Grid item key={key} xs={12} sm={6} md={3} className='grid-item'>
                                <FormField
                                    name={key}
                                    meta={childNodes[key]}
                                    formInstance={formInstance} />
                                </Grid>
                            )
                            })
                        }
                        if (fieldName === 'orderNo') {
                            meta['fieldType'] = 'textWithIcon'
                            meta['iconVariant'] = 'bulk-update'
                            return (
                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                    <FormField
                                        name={fieldName}
                                        meta={meta}
                                        toolTipText={dynamicLabels.autoGenerateOrderNumber}
                                        handler={handleOrderNoGenerartion}
                                        formInstance={formInstance} />
                                </Grid>
                            )

                        } else if (fieldName === 'numberOfItems') {
                            meta['fieldType'] = 'textWithIcon'
                            meta['readOnly'] = true
                            meta['iconVariant'] = 'add'
                            return (
                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                    <FormField
                                        name={fieldName}
                                        meta={meta}
                                        handler={crateModalFlagHandle}
                                        formInstance={formInstance} />
                                </Grid>
                            ) 
                        } else if (fieldName === 'shipmentsType' && userType === 'both') {
                            return (
                                <Grid item key={fieldName} xs={12} sm={12} md={6} className='grid-item'>
                                <FormField
                                    name={fieldName}
                                    meta={meta}
                                    formInstance={formInstance} />
                                </Grid>
                            )
                        } else {

                            return (
                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                                <FormField
                                    name={fieldName}
                                    meta={meta}
                                    formInstance={formInstance} />
                                </Grid>
                            )
                        }
                        })}
                    </Grid>
                )
            }
        </div>
    )

}

export default FormRenderComponent
