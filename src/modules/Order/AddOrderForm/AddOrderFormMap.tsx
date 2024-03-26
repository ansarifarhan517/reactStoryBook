import React, { Dispatch, useEffect, useState } from 'react';
import {LeafletMap, useToast } from 'ui-library'
import { useDispatch } from 'react-redux';
import { MapContainer } from './AddOrderFormStyledComponents';
import L, { LatLngExpression } from 'leaflet';
import Settings from "../../../utils/map/map.settingsdata";
import markerIcons from "../../../utils/map/icon.config";
import { ISettingConfigData, tMapButton, ISetting, IMapSettingsOption, tTiles} from "./AddOrderForm.models";
import { deepCopy } from '../../../utils/helper';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { tSearchFieldAddressInfo } from '../../../utils/components/Map/interface';
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';
import useDebounce from "../../../utils/useDebounce";
import { IAddOrderFormActions } from './AddOrderForm.actions';

const FALLBACK_CENTER = new L.LatLng(37.09024, -95.71289100000001);
interface IMapProps {
    sectionName: string
    isLoading:  boolean
    formInstance: UseFormMethods<FieldValues>
    pickupMapPosition: Array<number>
    deliverMapPosition: Array<number>
    returnMapPosition: Array<number>
    customerMapPosition: Array<number>
    setPickupMapPosition: Function
    setReturnMapPosition: Function
    setDeliverMapPosition: Function
    setCustomerMapPosition: Function
    isPickupMapSearched: boolean
    isPickupAddressFieldsTouched: boolean
    setPickupAddressFieldsTouched: Function
    setPickUpMapSearched: Function
    isDeliverMapSearched: boolean
    isDeliverAddressFieldsTouched: boolean
    isReturnMapSearched: boolean
    isReturnAddressFieldsTouched: boolean
    isCustomerMapSearched: boolean
    isCustomerAddressFieldsTouched: boolean
    setDeliverMapSearched: Function
    setReturnMapSearched: Function
    setCustomerMapSearched: Function
    typeOfMap: string
    pickupLeg: boolean
    deliveryLeg: boolean
    setDeliverAddressFieldsTouched: Function
    isP2POrder: boolean
    returnOrderAddress: boolean
    setReturnAddressFieldsTouched: Function
}

const AddOrderFormMap = (props : IMapProps) => {
    
    const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const _center = userAccessInfo?.['countryLatLng']?.split(",") || FALLBACK_CENTER

    const toast = useToast();
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const countryList = useTypedSelector(state => state.orderForm.localeData)
    const googleAPIKey = useTypedSelector(state => state.orderForm.googleApiKey)
    const structure = useTypedSelector(state => state.orderForm.structure)
    const isOrderCloned = useTypedSelector(state => state.orderForm.isOrderCloned);
    const isMapLoadingFirstTime = useTypedSelector(state => state.orderForm.isMapLoadingFirstTime);
    const [center, setCenter] = useState<LatLngExpression>(FALLBACK_CENTER);
    const [position, setPosition] = useState<Array<number>>([_center[0], _center[1]]);

    const settingObj = {
        locationSearch: false,
        mapSource: "google",
        mapTheme: "day",
        markerMode: "markers",
        osm: false,
        poi: false,
        rulerControl: true,
        terrain_google: true,
        traffic: false,
        transit: false,
    }
    const themeMapping = {
        'dark': 'night',
        'light': 'day'
    }

    const [pickupAddress, setPickupAddress] = useState<string>('');
    const [returnAddress, setReturnAddress] = useState<string>('');
    const [deliverAddress, setDeliverAddress] = useState<string>('');
    const [customerAddress, setCustomerAddress] = useState<string>('');

    const [settingPickUpMapConfig, setSettingPickUpMapConfig] = useState<ISetting>(Settings);
    const [settingReturnMapConfig, setSettingReturnMapConfig] = useState<ISetting>(Settings);
    const [settingDeliveryMapConfig, setSettingDeliveryMapConfig] = useState<ISetting>(Settings);
    const [settingCustomerMapConfig, setSettingCustomerMapConfig] = useState<ISetting>(Settings);  
    settingPickUpMapConfig['Map Mode'].permission = false;
    settingReturnMapConfig['Map Mode'].permission = false;
    settingDeliveryMapConfig['Map Mode'].permission = false;
    settingCustomerMapConfig['Map Mode'].permission = false;
    const [orderFormMapPickupSetting, setorderFormMapPickupSetting] = useState<ISettingConfigData>(settingObj)
    const [orderFormMapReturnSetting, setorderFormMapReturnSetting] = useState<ISettingConfigData>(settingObj)
    const [orderFormMapDeliverySetting, setorderFormMapDeliverySetting] = useState<ISettingConfigData>(settingObj)
    const [orderFormMapCustomerSetting, setorderFormMapCustomerSetting] = useState<ISettingConfigData>(settingObj)
    const [tileSubOptionLayerPickup, settileSubOptionLayerPickup] = useState<tTiles>('google_roadmap')
    const [tileSubOptionLayerReturn, settileSubOptionLayerReturn] = useState<tTiles>('google_roadmap')
    const [tileSubOptionLayerDelivery, settileSubOptionLayerDelivery] = useState<tTiles>('google_roadmap')
    const [tileSubOptionLayerCustomer, settileSubOptionLayerCustomer] = useState<tTiles>('google_roadmap')

    const {sectionName, isLoading, formInstance: {setValue, watch}, pickupMapPosition, deliverMapPosition, returnMapPosition, customerMapPosition, setPickupMapPosition, setReturnMapPosition, setDeliverMapPosition, setCustomerMapPosition, isPickupMapSearched, isPickupAddressFieldsTouched, setPickUpMapSearched,isDeliverMapSearched, isDeliverAddressFieldsTouched,isReturnMapSearched, isReturnAddressFieldsTouched,isCustomerMapSearched, isCustomerAddressFieldsTouched, setReturnMapSearched, setDeliverMapSearched, setCustomerMapSearched, typeOfMap, setPickupAddressFieldsTouched, pickupLeg, deliveryLeg, setDeliverAddressFieldsTouched, isP2POrder, returnOrderAddress, setReturnAddressFieldsTouched} = props;

    /* watchers for pickup address fields*/
    const pickupCountry = useDebounce(watch('pickupCountry', ''), 1000);
    const pickupApartment = useDebounce(watch('pickupApartment', ''), 1000)
    const pickupStreetName = useDebounce(watch('pickupStreetName', ''), 1000)
    const pickupLandmark = useDebounce(watch('pickupLandmark', ''), 1000)
    const pickupLocality = useDebounce(watch('pickupLocality', ''), 1000)
    const pickupState = useDebounce(watch('pickupState', ''), 1000)
    const pickupCity = useDebounce(watch('pickupCity', ''), 1000)
    const pickupPinCode = useDebounce(watch('pickupPinCode', ''), 1000)

    /* watchers for deliver address fields*/
    const deliverCountry = useDebounce(watch('deliverCountry', ''), 1000);
    const deliverApartment = useDebounce(watch('deliverApartment', ''), 1000);
    const deliverStreetName = useDebounce(watch('deliverStreetName', ''), 1000);
    const deliverLandmark = useDebounce(watch('deliverLandmark', ''), 1000);
    const deliverLocality = useDebounce(watch('deliverLocality', ''), 1000);
    const deliverState = useDebounce(watch('deliverState', ''), 1000);
    const deliverCity = useDebounce(watch('deliverCity', ''), 1000);
    const deliverPinCode = useDebounce(watch('deliverPinCode', ''), 1000);
    
    /* watchers for return address fields*/
    const returnCountry = useDebounce(watch('returnCountry', ''), 1000);
    const returnApartment = useDebounce(watch('returnApartment', ''), 1000);
    const returnStreetName = useDebounce(watch('returnStreetName', ''), 1000);
    const returnLandmark = useDebounce(watch('returnLandmark', ''), 1000);
    const returnLocality = useDebounce(watch('returnLocality', ''), 1000);
    const returnState = useDebounce(watch('returnState', ''), 1000);
    const returnCity = useDebounce(watch('returnCity', ''), 1000);
    const returnPinCode = useDebounce(watch('returnPinCode', ''), 1000);

    /* watchers for customer address fields*/
    const customerCountry = useDebounce(watch('customerCountry', ''), 1000);
    const customerApartment = useDebounce(watch('customerApartment', ''), 1000);
    const customerStreetName = useDebounce(watch('customerStreetName', ''), 1000);
    const customerLandmark = useDebounce(watch('customerLandmark', ''), 1000);
    const customerLocality = useDebounce(watch('customerLocality', ''), 1000);
    const customerState = useDebounce(watch('customerState', ''), 1000);
    const customerCity = useDebounce(watch('customerCity', ''), 1000);
    const customerPinCode = useDebounce(watch('customerPinCode', ''), 1000);

 


    useEffect(() => {
        const isTextType = structure?.['pick up details']?.['addressFields']?.['childNodes']?.pickupPinCode?.fieldType === "text" ? true : false;
        // let address = (!!pickupState?.name || !!pickupCountry?.name) ? `${pickupApartment} ${pickupStreetName} ${pickupLandmark} ${pickupLocality} ${pickupCity} ${formatAddress(pickupState, pickupCountry, isTextType ? pickupPinCode : pickupPinCode.name)}`: `${pickupApartment} ${pickupStreetName} ${pickupLandmark} ${pickupLocality} ${pickupCity}`;
        let address = `${pickupApartment} ${pickupStreetName} ${pickupLandmark} ${pickupLocality} ${pickupCity} ${pickupState?.name} ${pickupCountry?.name} ${isTextType ? pickupPinCode : pickupPinCode?.name}`.replaceAll('undefined', '');
        console.log('isPickupAddressFieldsTouched', isPickupAddressFieldsTouched, address)
        if(!isPickupMapSearched && isPickupAddressFieldsTouched && !isOrderCloned){
            setPickupAddress(address);
            setPickupMapPosition(pickupMapPosition)
        }
        if(watch('pickupAddress', '') != ''){
            setPickupAddress(watch('pickupAddress', ''));
        }  
    },[pickupCountry,pickupApartment,pickupStreetName,pickupLandmark,pickupLocality,pickupCity,pickupPinCode,pickupState, isPickupAddressFieldsTouched])
    
    useEffect(() => {
        const isTextType = structure?.['delivery details']?.['addressFields']?.['childNodes']?.deliverPinCode?.fieldType === "text" ? true : false;
        // let address = (!!deliverState?.name || !!deliverCountry?.name) ? `${deliverApartment} ${deliverStreetName} ${deliverLandmark} ${deliverLocality} ${deliverCity} ${formatAddress(deliverState, deliverCountry, isTextType ? deliverPinCode : deliverPinCode.name)}`: `${deliverApartment} ${deliverStreetName} ${deliverLandmark} ${deliverLocality} ${deliverCity}`;
        let address = `${deliverApartment} ${deliverStreetName} ${deliverLandmark} ${deliverLocality} ${deliverCity} ${deliverState?.name} ${deliverCountry?.name} ${isTextType ? deliverPinCode : deliverPinCode?.name}`.replaceAll('undefined', '');
        if(!isDeliverMapSearched && isDeliverAddressFieldsTouched  && !isOrderCloned) {
        setDeliverAddress(address);
        setDeliverMapPosition(deliverMapPosition)
        }
        if(watch('deliverAddress', '') != ''){
            setDeliverAddress(watch('deliverAddress', ''));
        }    
    },[deliverCountry,deliverApartment,deliverStreetName,deliverLandmark,deliverLocality,deliverCity,deliverPinCode, isDeliverAddressFieldsTouched, deliverState])
    
    useEffect(() => {
        const isTextType = structure?.['return address details']?.['addressFields']?.['childNodes']?.returnPinCode?.fieldType === "text" ? true : false;
        // let address = (!!returnState?.name || !!returnCountry?.name) ? `${returnApartment} ${returnStreetName} ${returnLandmark} ${returnLocality} ${returnCity} ${formatAddress(returnState, returnCountry, isTextType ? returnPinCode : returnPinCode.name)}`: `${returnApartment} ${returnStreetName} ${returnLandmark} ${returnLocality} ${returnCity}`;
        let address = `${returnApartment} ${returnStreetName} ${returnLandmark} ${returnLocality} ${returnCity} ${returnState?.name} ${returnCountry?.name} ${isTextType ? returnPinCode : returnPinCode?.name}`.replaceAll('undefined', '');
        if(!isReturnMapSearched && isReturnAddressFieldsTouched && !isOrderCloned) {
            setReturnAddress(address);
            setReturnMapPosition(returnMapPosition)
        }
        if(watch('returnAddress', '') != ''){
            setReturnAddress(watch('returnAddress', ''));
        }   
    },[returnCountry,returnApartment,returnStreetName,returnLandmark,returnLocality,returnCity,returnPinCode, isReturnAddressFieldsTouched, returnState])

    useEffect(() => {
        const isTextType = structure?.['customer details']?.['addressFields']?.['childNodes']?.customerPinCode?.fieldType === "text" ? true : false;
        // let address = (!!customerState?.name || !!customerCountry?.name) ? `${customerApartment} ${customerStreetName} ${customerLandmark} ${customerLocality} ${customerCity} ${formatAddress(customerState, customerCountry, isTextType ? customerPinCode : customerPinCode.name )}`: `${customerApartment} ${customerStreetName} ${customerLandmark} ${customerLocality} ${customerCity}`;
        let address = `${customerApartment} ${customerStreetName} ${customerLandmark} ${customerLocality} ${customerCity} ${customerState?.name} ${customerCountry?.name} ${isTextType ? customerPinCode : customerPinCode?.name}`.replaceAll('undefined', '');
        if(!isCustomerMapSearched && isCustomerAddressFieldsTouched) {
            setCustomerAddress(address);
            setCustomerMapPosition(customerMapPosition)
        }
    },[customerCountry,customerApartment,customerStreetName,customerLandmark,customerLocality,customerCity,customerPinCode, isCustomerAddressFieldsTouched, customerState])

    useEffect(() => {
        if(isOrderCloned) {
            if(pickupLeg) {
                setPickUpMapSearched(false);
                setPickupAddressFieldsTouched(true);
            } 
            if(deliveryLeg) {
                setDeliverMapSearched(false);
                setDeliverAddressFieldsTouched(true);
            } 
            if(isP2POrder) {
                setPickUpMapSearched(false);
                setDeliverMapSearched(false);
                setPickupAddressFieldsTouched(true);
                setDeliverAddressFieldsTouched(true);
            } 

            if(!returnOrderAddress) {
                setReturnMapSearched(false);
                setReturnAddressFieldsTouched(true);
            }
        }
    },[isOrderCloned, pickupLeg, deliveryLeg, isP2POrder, returnOrderAddress])


    useEffect(() => {
        if (isMapLoadingFirstTime) {
            if(typeOfMap === 'pick up details')
            getMapSettings('orderFormMapPickup');
            if(typeOfMap === 'return address details')
                getMapSettings('orderFormMapReturn');
            if(typeOfMap === 'delivery details')
                getMapSettings('orderFormMapDelivery');
            if(typeOfMap === 'customer details')
                getMapSettings('orderFormMapCustomer');
            dispatch({ type: '@@addOrderForm/SET_IS_MAP_LOADING_FIRST_TIME', payload: false});
        } else {
            setTimeout(() => {
                if(typeOfMap === 'pick up details')
                getMapSettings('orderFormMapPickup');
                if(typeOfMap === 'return address details')
                    getMapSettings('orderFormMapReturn');
                if(typeOfMap === 'delivery details')
                    getMapSettings('orderFormMapDelivery');
                if(typeOfMap === 'customer details')
                    getMapSettings('orderFormMapCustomer');
            }, 1000)
        }
    },[typeOfMap]);

    const getMapSettings = async (settingAPIParam: string) => {
        try {
            const { data: { data: resultData } } = await axios.get(`${apiMappings.common.getSettings}${settingAPIParam}`)
            setMapSettings(settingAPIParam, resultData)
                
        } catch (errorMessage) {}
    }
    const setMapSettings = (settingAPIParam: string, resultData: ISettingConfigData) => {
        switch (settingAPIParam) {
            case 'orderFormMapPickup':
                setorderFormMapPickupSetting(resultData)
            break
            case 'orderFormMapReturn':
                setorderFormMapReturnSetting(resultData)
            break
            case 'orderFormMapDelivery':
                setorderFormMapDeliverySetting(resultData)
            break
            case 'orderFormMapCustomer':
                setorderFormMapCustomerSetting(resultData)
            break
        }
    }

    const onSaveChange = async (setting: ISetting, type: tMapButton, mapId: string) => {
        const settingConfigDataClone: any = {
            actualRoute: true,
            circleMaker: false,
            geocoder: false,
            locationSearch: true,
            overspeedViolation: false,
            plannedRoute: false,
            polygonMaker: false,
            showAllGeofences: false,
            showTrackingPoints: false,
            speedSensitivePoints: false,
            transit: false
        }
        //google , osm
        const mapSource = setting['Map Type'].option.find((entry: IMapSettingsOption) => entry.selected)
        const googleSubOptions = setting['Map Type'].option[0]?.subOptions
        const osmSubOptions = setting['Map Type'].option[1]?.subOptions
        settingConfigDataClone.mapSource = mapSource?.id
        if (mapSource?.id === 'osm') {
            settingConfigDataClone.osm = true
            settingConfigDataClone.google = false
            const selectedOption = osmSubOptions?.find((subOpt: IMapSettingsOption) => subOpt.selected)
            const keySplit = selectedOption?.id?.split('_')
            const newTileLayerName = `${keySplit?.[1]}_${keySplit?.[0]}`
            //roadmap_google=true
            settingConfigDataClone[newTileLayerName] = true
        } else {
            settingConfigDataClone.google = true
            settingConfigDataClone.osm = false
            const selectedOption = googleSubOptions?.find((subOpt: IMapSettingsOption) => subOpt.selected)
            const keySplit = selectedOption?.id?.split('_')
            const newTileLayerName = `${keySplit?.[1]}_${keySplit?.[0]}`
            settingConfigDataClone[newTileLayerName] = true
        }
        // day ,night
        const mapTheme = setting['Map Theme'].option.find((entry: IMapSettingsOption) => entry.selected)
        if (mapTheme?.id) {
            settingConfigDataClone.mapTheme = themeMapping[mapTheme?.id]
        }

        setting['Miscellaneous'].option.find((entry: IMapSettingsOption) => {
            if (entry.name === 'Point of interest') {
                settingConfigDataClone.poi = entry.selected
            } else if (entry.name === 'Traffic') {
                settingConfigDataClone.traffic = entry.selected
            } else if (entry.name === 'Ruler Control') {
                settingConfigDataClone.rulerControl = entry.selected
            } else if (entry.name === 'Location Search') {
                settingConfigDataClone.locationSearch = entry.selected
            }
        })
        if (type === 'save') {
            try {
                const { data } = await axios.put(`${apiMappings.common.saveSettings}${mapId}`, { data: settingConfigDataClone })
                if (data || data?.status === 200) {
                    // once you save in db, just rerender the model with new values
                    setMapSettings(mapId, settingConfigDataClone)
                    toast.add('Map settings successfully saved.', 'check-round', false)
                    return
                }
            } catch (errorMessage) {
                toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)

            }
        } else {
            // on only apply dont save in db jst change config and accordigly make settingconfig object
            setMapSettings(mapId, settingConfigDataClone)
        }
    }

    // whenevr user clicks on save/apply settings
    const handleSettingSave = (data: ISetting, type: tMapButton, mapId: string) => {
        onSaveChange(data, type, mapId)
    }
    useEffect(() => {
        updateSettings(orderFormMapPickupSetting, 'pickUp')
    }, [orderFormMapPickupSetting, setSettingPickUpMapConfig])
    useEffect(() => {
        updateSettings(orderFormMapReturnSetting, 'return')
    }, [orderFormMapReturnSetting, setSettingReturnMapConfig])
    useEffect(() => {
        updateSettings(orderFormMapDeliverySetting, 'delivery')
    }, [orderFormMapDeliverySetting, setSettingDeliveryMapConfig])
    useEffect(() => {
        updateSettings(orderFormMapCustomerSetting, 'customer')
    }, [orderFormMapCustomerSetting, setSettingCustomerMapConfig])
    const updateSettings = async (settingConfigData: ISettingConfigData, mapType: string) => {
        let configClone = {}
        // setting fetched from api
        if (settingConfigData) {
            const keys = Object.keys(settingConfigData)
            let selectedTileLayer = ''
            keys.forEach((key: string) => {
                const keySplit = key.split('_')
                if (keySplit.length === 2 && (key.includes('google') || key.includes('osm'))) {
                    const newTileLayerName = `${keySplit[1]}_${keySplit[0]}`
                    selectedTileLayer = newTileLayerName
                    if(mapType === 'pickUp'){
                        settileSubOptionLayerPickup(newTileLayerName as tTiles)
                    }else if(mapType === 'return'){
                        settileSubOptionLayerReturn(newTileLayerName as tTiles)
                    }else if(mapType === 'delivery'){
                        settileSubOptionLayerDelivery(newTileLayerName as tTiles)
                    }else{
                        settileSubOptionLayerCustomer(newTileLayerName as tTiles)
                    }
                }
            })
            configClone = mapType === 'pickUp' ? deepCopy(settingPickUpMapConfig) : 
                          mapType === 'return' ? deepCopy(settingReturnMapConfig) :
                          mapType === 'delivery' ? deepCopy(settingDeliveryMapConfig) : deepCopy(settingCustomerMapConfig)
     
            // in setting google is already selected.so only if mode not equal to google then only change

            configClone['Map Type'].option.forEach((mode: IMapSettingsOption) => {
                if (settingConfigData.mapSource === 'google') {
                    if (mode.name === 'Google') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                } else {
                    if (mode.name === 'Open Street Maps') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                }
            })


            // in setting theme day is already selected.so only if mode not equal to day then only change

            configClone['Map Theme'].option.forEach((mode: IMapSettingsOption) => {
                if (settingConfigData.mapTheme === 'day') {
                    if (mode.name === 'Day') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                } else {
                    if (mode.name === 'Night') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                }
            })
            configClone['Map Type'].option.forEach((mode: IMapSettingsOption) => {
                mode?.subOptions?.forEach((suboption: IMapSettingsOption) => {
                    if (settingConfigData.mapSource === 'google') {
                        // if selected tile layer from google then only for suboptions google select suboption and remianing set to false
                        if (selectedTileLayer.includes('google') && mode?.id === 'google') {
                            if (suboption.id === selectedTileLayer) {
                                suboption.selected = true
                            } else {
                                suboption.selected = false
                            }
                        }

                    } else if (settingConfigData.mapSource === 'osm') {
                        // if selected tile layer from osm then only for suboptions osm select suboption and remianing set to false
                        if (selectedTileLayer.includes('osm') && mode?.id === 'osm') {
                            if (suboption.id === selectedTileLayer) {
                                suboption.selected = true
                            } else {
                                suboption.selected = false
                            }
                        }
                    } else {
                        // if sub option is google then it will go to first if and for osm layer all sub option select false
                        // same ways if sub option is osm then it will go to second if and for google layer all sub option select false
                        suboption.selected = false

                    }
                })

            })

            configClone['Miscellaneous'].option.find((entry: IMapSettingsOption) => {
                if (entry.name === 'Point of interest') {
                    entry.selected = settingConfigData.poi
                } else if (entry.name === 'Traffic') {
                    entry.selected = settingConfigData.traffic
                } else if (entry.name === 'Ruler Control') {
                    entry.selected = settingConfigData.rulerControl
                } else if (entry.name === 'Location Search') {
                    entry.selected = settingConfigData.locationSearch
                }
            })


            // const newMarker = setMapData(settingConfigData)
            setCenter(new L.LatLng(_center[0], _center[1]));

            // setMarkerData(newMarker)
            // create legend on the basis of markers data
            if(mapType === 'pickUp'){
                setSettingPickUpMapConfig(deepCopy(configClone))
            } else if(mapType === 'return'){
                setSettingReturnMapConfig(deepCopy(configClone))
            } else if(mapType === 'delivery'){
                setSettingDeliveryMapConfig(deepCopy(configClone))
            } else{
                setSettingCustomerMapConfig(deepCopy(configClone))
            }
            
            // setMapLoading(false);
        }
    }

    const populatePickupAdd = (address: tSearchFieldAddressInfo) => {
        setPickUpMapSearched(address?.isPropSearch);
        if (Object.keys(address).length > 0) {
            if (address?.isPropSearch) {
                setPickupValues(address);
                setPickupMapPosition(address.position);
            } else if (!address?.isPropSearch) {
              // in add mode, if address field touched and 
              if (!isPickupAddressFieldsTouched && address?.isPropSearch) {
                setPickupValues(address);
              }
              setPickupMapPosition(address.position);
            } else if (address?.isPropSearch) {
                setPickupValues(address);
                setPickupMapPosition(address.position);
            }
            else {
                setPickupMapPosition([_center[0], _center[1]]);
            }
        }
    }
    const setPickupValues = (address: tSearchFieldAddressInfo) => {
        if (Object.keys(address).length) {
            const selectedCountry = countryList?.filter((o) => {return o['name'] === address.country?.toUpperCase()})
            setValue('pickupApartment', address.apartment)
            setValue('pickupStreetName', address.streetName)
            setValue('pickupLandmark', address.landMark)
            setValue('pickupLocality', address.locality)  
            setValue('pickupCity', address.city)
            setValue('pickupCountry', { 'id': selectedCountry && selectedCountry[0]?.['id'], 'name': address.country })
            setValue('pickupState', { "id": 1, "name": address.state, "code": "AFG" })
            setValue('pickupPinCode', address.pincode ? { "id": address.pincode, "name": address.pincode, "code": address.pincode } : null)
            
        }
    }
     const populateReturnAdd = (address: tSearchFieldAddressInfo) => {
        setReturnMapSearched(address?.isPropSearch);
        if (Object.keys(address).length > 0) {
            if (address?.isPropSearch) {
                setReturnValues(address);
                setReturnMapPosition(address.position);
            } else if (!address?.isPropSearch) {
              // in add mode, if address field touched and 
              if (!isPickupAddressFieldsTouched && address?.isPropSearch) {
                setReturnValues(address);
              }
              setReturnMapPosition(address.position);
            } else if (address?.isPropSearch) {
                setReturnValues(address);
                setReturnMapPosition(address.position);
            }
            else {
                setReturnMapPosition([_center[0], _center[1]]);
            }
        }
    }
    const setReturnValues = (address: tSearchFieldAddressInfo) => {
        if (Object.keys(address).length) {
            const selectedCountry = countryList?.filter((o) => {return o['name'] === address.country?.toUpperCase()})
            setValue('returnApartment', address.apartment)
            setValue('returnStreetName', address.streetName)
            setValue('returnLandmark', address.landMark)
            setValue('returnLocality', address.locality)
            setValue('returnCity', address.city)
            setValue('returnCountry', { 'id':  selectedCountry && selectedCountry[0]['id'], 'name': address.country })
            setValue('returnState', { "id": 1, "name": address.state, "code": "AFG" })
            setValue('returnPinCode', address.pincode ? { "id": address.pincode, "name": address.pincode, "code": address.pincode } : null)
        }
    }

    const populateDeliveryAdd = (address: tSearchFieldAddressInfo) => {
        setDeliverMapSearched(address?.isPropSearch);
        if (Object.keys(address).length > 0) {
            if (address?.isPropSearch) {
                setDeliveryValues(address);
                setDeliverMapPosition(address.position);
            } else if (!address?.isPropSearch) {
              // in add mode, if address field touched and 
              if (!isPickupAddressFieldsTouched && address?.isPropSearch) {
                setDeliveryValues(address);
              }
              setDeliverMapPosition(address.position);
            } else if (address?.isPropSearch) {
                setDeliveryValues(address);
                setDeliverMapPosition(address.position);
            }
            else {
                setDeliverMapPosition([_center[0], _center[1]]);
            }
        }
    }
    const setDeliveryValues = (address: tSearchFieldAddressInfo) => {
        if (Object.keys(address).length) {
            const selectedCountry = countryList?.filter((o) => {return o['name'] === address.country?.toUpperCase()})
            setValue('deliverApartment', address.apartment)
            setValue('deliverStreetName', address.streetName)
            setValue('deliverLandmark', address.landMark)
            setValue('deliverLocality', address.locality)
            setValue('deliverCity', address.city)
            setValue('deliverCountry', { 'id':  selectedCountry && selectedCountry[0]['id'], 'name': address.country })
            setValue('deliverState', { "id": 1, "name": address.state, "code": "AFG" })
            setValue('deliverPinCode', address.pincode ? { "id": address.pincode, "name": address.pincode, "code": address.pincode } : null)
        }
    }

    const populateCustomerAdd = (address: tSearchFieldAddressInfo) => {
        setCustomerMapSearched(address?.isPropSearch);
        if (Object.keys(address).length > 0) {
            if (address?.isPropSearch) {
                setCustomerValues(address);
                setCustomerMapPosition(address.position);
            } else if (!address?.isPropSearch) {
              // in add mode, if address field touched and 
              if (!isPickupAddressFieldsTouched && address?.isPropSearch) {
                setCustomerValues(address);
              }
              setCustomerMapPosition(address.position);
            } else if (address?.isPropSearch) {
                setCustomerValues(address);
                setCustomerMapPosition(address.position);
            }
            else {
                setCustomerMapPosition([_center[0], _center[1]]);
            }
        }
    }
    const setCustomerValues = (address: tSearchFieldAddressInfo) => {
        if (Object.keys(address).length) {
            const selectedCountry = countryList?.filter((o) => {return o['name'] === address.country?.toUpperCase()})
            setValue('customerApartment', address.apartment)
            setValue('customerStreetName', address.streetName)
            setValue('customerLandmark', address.landMark)
            setValue('customerLocality', address.locality)
            setValue('customerCity', address.city)
            setValue('customerCountry', { 'id':  selectedCountry && selectedCountry[0]['id'], 'name': address.country })
            setValue('customerState', { "id": 1, "name": address.state, "code": "AFG" })
            setValue('customerPinCode', address.pincode ? { "id": address.pincode, "name": address.pincode, "code": address.pincode } : null)
        }
    }

    return(
        <div style={{width: '50%', paddingLeft: 20, zIndex: 0}}>
            {sectionName === 'pick up details' ?                                            
            <MapContainer className="orderFormMapPickup">
            {!isLoading && pickupMapPosition && orderFormMapPickupSetting &&
                <LeafletMap 
                    id='orderFormMapPickup'
                    classes='baseMap customBaseMap'
                    center={center}
                    zoom={4}
                    zoomControl
                    googleApiKey={googleAPIKey}
                    height="350px"
                    width="100%"
                    tiles={tileSubOptionLayerPickup}
                    isShowMapTileLayer={!!(tileSubOptionLayerPickup && pickupMapPosition && orderFormMapPickupSetting) }
                    settingConfig={settingPickUpMapConfig}
                    onSettingChange={(data: ISetting, type: tMapButton) => handleSettingSave(data, type, 'orderFormMapPickup')}
                    sendLocationOutside={(address: tSearchFieldAddressInfo) => populatePickupAdd(address)}
                    geocoding={{
                        permission: true,
                        searchText: pickupAddress,
                        position: pickupMapPosition,
                        onGeocodingSave: (e: any) => {
                        window.alert(
                            'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
                        )
                        },
                        onGeocodingDragEnd: (pos: [number, number]) => {
                        setPosition(pos)
                        console.log(position)
                                }
                            }}
                        iconsRef={markerIcons}
                    />}
                    </MapContainer>
                : sectionName === 'return address details' ? 
                <MapContainer className="orderFormMapReturn">
                {!isLoading && returnMapPosition && orderFormMapReturnSetting &&
                    <LeafletMap 
                        id='orderFormMapReturn'
                    classes='baseMap customBaseMap'
                    center={center}
                    zoom={4}
                    zoomControl
                    googleApiKey={googleAPIKey}
                    height="350px"
                    width="100%"
                    tiles={tileSubOptionLayerReturn}
                    isShowMapTileLayer={!!(tileSubOptionLayerReturn && returnMapPosition && orderFormMapReturnSetting) }
                    settingConfig={settingReturnMapConfig}
                    onSettingChange={(data: ISetting, type: tMapButton) => handleSettingSave(data, type, 'orderFormMapReturn')}
                    sendLocationOutside={(address: tSearchFieldAddressInfo) => populateReturnAdd(address)}
                    geocoding={{
                        permission: true,                                            
                        searchText: returnAddress,
                        searchTextInput: '',
                        position: returnMapPosition || [19.0759837, 72.8776559],
                        onGeocodingSave: (e: any) => {
                        window.alert(
                            'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
                        )
                        },
                        onGeocodingDragEnd: (pos: [number, number]) => {
                        console.log('On Geocoding Drag End', pos);
                        }
                    }}
                    iconsRef={markerIcons}
                    />}
                </MapContainer>
                : sectionName === 'delivery details' ? 
                <MapContainer className="orderFormMapDelivery">
                {!isLoading && deliverMapPosition && orderFormMapDeliverySetting &&
                    <LeafletMap 
                        id='orderFormMapDelivery'
                        classes='baseMap customBaseMap'
                        center={center}
                        // latLngBounds={[_center[0], _center[1]]}
                        zoom={4}
                        zoomControl
                        googleApiKey={googleAPIKey}
                        height="350px"
                        width="100%"
                        tiles={tileSubOptionLayerDelivery}
                        isShowMapTileLayer={!!(tileSubOptionLayerDelivery && deliverMapPosition && orderFormMapDeliverySetting) }
                        settingConfig={settingDeliveryMapConfig}
                        onSettingChange={(data: ISetting, type: tMapButton) => handleSettingSave(data, type, 'orderFormMapDelivery')}
                        sendLocationOutside={(address: tSearchFieldAddressInfo) => populateDeliveryAdd(address)}
                        geocoding={{
                            permission: true,                                            
                            searchText: deliverAddress,
                            searchTextInput: '',
                            position: deliverMapPosition || [19.0759837, 72.8776559],
                            onGeocodingSave: (e: any) => {
                            window.alert(
                                'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
                            )
                            },
                            onGeocodingDragEnd: (pos: [number, number]) => {
                            setPosition(pos)
                            }
                        }}
                        iconsRef={markerIcons}
                        /> 
                    }
                </MapContainer> 
                : sectionName === 'customer details' ?  
                <MapContainer className="orderFormMapCustomer">
                {!isLoading && customerMapPosition && orderFormMapCustomerSetting &&
                    <LeafletMap 
                        id='orderFormMapCustomer'
                        classes='baseMap customBaseMap'
                        center={center}
                        zoom={4}
                        zoomControl
                        googleApiKey={googleAPIKey}
                        height="350px"
                        width="100%"
                        tiles={tileSubOptionLayerCustomer}
                        isShowMapTileLayer={!!(tileSubOptionLayerCustomer && customerMapPosition && orderFormMapCustomerSetting) }
                        settingConfig={settingCustomerMapConfig}
                        onSettingChange={(data: ISetting, type: tMapButton) => handleSettingSave(data, type, 'orderFormMapCustomer')}
                        sendLocationOutside={(address: tSearchFieldAddressInfo) => populateCustomerAdd(address)}
                        geocoding={{
                            permission: true,                                            
                            searchText: customerAddress,
                            searchTextInput: '',
                            position: customerMapPosition || [19.0759837, 72.8776559],
                            onGeocodingSave: (e: any) => {
                            window.alert(
                                'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
                            )
                            },
                            onGeocodingDragEnd: (pos: [number, number]) => {
                            console.log('On Geocoding Drag End', pos);
                            }
                        }}
                        iconsRef={markerIcons}
                        /> 
                    }
                    </MapContainer>                                                
                    : null}    
        </div>                                     
    )
}

export default AddOrderFormMap