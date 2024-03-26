import React, { useEffect, Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box, Grid, IconButton, DropDown } from 'ui-library'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { useDispatch } from 'react-redux'
import { IShipperPreferenceFormActions, IShipperUnitSystemProperty, IShipperPreferenceFormData, ICurrencyLookup, ILocaleLookup, ITimezoneLookup, IShipperLookupData } from './ShipperPreference.model'
import { IShipperCommonFormActions } from '../../ShipperCommon/ShipperCommon.model'
import FormField from '../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import useDebounce from "../../../../utils/useDebounce";
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import { generateShipperFormData, sysPropertyMapping, setUnitSystemResponse } from "./ShipperPreference.utils"
import { FormWrapper } from '../../../../utils/components/Form/Form.styles'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../utils/components/FormLoader'
import withReactOptimized from '../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../utils/core'
import { sendGA } from '../../../../utils/ga';
const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const ShipperPreference = () => {
  // const toast = useToast()
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.shipper},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues: {}
  })
  const { handleSubmit, reset, unregister, watch, setValue } = formInstance

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IShipperPreferenceFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const commonDispatch = useDispatch<Dispatch<IShipperCommonFormActions>>()
  const structure = useTypedSelector(state => state.shipper.preference.structure)
  const isStructureLoading = useTypedSelector(state => state.shipper.preference.loading)
  const clientPreferenceData = useTypedSelector(state => state.shipper.preference.preferenceData);
  // const resetData = useTypedSelector(state => state.shipper.preference.resetData)
  const onBoardingData = useTypedSelector(state => state.shipper.onBoardingStructure.onBoardingData.data)
  const sameAsParentSystemProps = useTypedSelector(state => state.shipper.preference.sameAsParentSystemProps);
  const sectionKeys = Object.keys(structure)
  // const [isShipperDataLoading] = useState<boolean>(false)
  // const [sameAsParentSystemPropsTemp, setsameAsParentSystemPropsTemp] = useState<boolean>(sameAsParentSystemProps)
  const isLoading = (isStructureLoading)
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
  const [subClientId, setSubClientId] = useState<string>("");
  const unitSystem = useDebounce(watch('UNITSYSTEM', ''), 0);
  const sameAsOrg = useDebounce(watch('SAMEASORG', undefined), 0);
  const [DISTANCE_DROPDOWNOPTIONS, setDISTANCE_DROPDOWNOPTIONS] = useState<IShipperUnitSystemProperty[]>([])
  const [WEIGHT_DROPDOWNOPTIONS, setWEIGHT_DROPDOWNOPTIONS] = useState<IShipperUnitSystemProperty[]>([])
  const [SPEED_DROPDOWNOPTIONS, setSPEED_DROPDOWNOPTIONS] = useState<IShipperUnitSystemProperty[]>([])
  const [VOLUME_DROPDOWNOPTIONS, setVOLUME_DROPDOWNOPTIONS] = useState<IShipperUnitSystemProperty[]>([])
  const [DIMENSION_DROPDOWNOPTIONS, setDIMENSION_DROPDOWNOPTIONS] = useState<IShipperUnitSystemProperty[]>([])
  const TEMPERATURE_DROPDOWNOPTIONS = [{ label: 'C', value: 'C' }, { label: "F", value: "F" }]
  const [currency, setCurrency] = useState<ICurrencyLookup[]>();
  const [timezone, setTimezone] = useState<ITimezoneLookup[]>();
  const [language, setLanguage] = useState<ILocaleLookup[]>();


  const getShipperStructure = async () => {
    const propertiesData = onBoardingData ? JSON.parse(onBoardingData.configurationSteps[0].subSteps[0].answerData) : '';
    // const subClientId = propertiesData.subClientId;
    setSubClientId(propertiesData.subClientId)
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IShipperPreferenceFormData>>(`${apiMappings.shipper.properties.getShipperProperties}?subClientId=${propertiesData.subClientId}`)
      if (status == 200) {
        const setParentSystemProps = data?.inheritSystemPropFromSuper;
        dispatch({ type: '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF', payload: setParentSystemProps })
        setValue('SAMEASORG', setParentSystemProps?'Y':'N' )
      }
    }
    catch (error) {
      const setParentSystemProps = propertiesData?.inheritSystemPropFromSuper;
        dispatch({ type: '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF', payload: setParentSystemProps })
        setValue('SAMEASORG', setParentSystemProps?'Y':'N' )
    }
  }

    const setShipperData = async() =>{
      if (subClientId && formInstance.getValues('SAMEASORG') === 'N') {
        var url = apiMappings.shipper.getShipperSystemProps + "?clientId=" + subClientId + "&modelType=" + JSON.parse(localStorage?.getItem('userAccessInfo') || '')['modelType'] + "&unitSystem=METRICSYSTEM";
      } else {
        var url = apiMappings.shipper.getShipperSystemProps + "?clientId=" + clientId + "&modelType=" + JSON.parse(localStorage.getItem('userAccessInfo') || '')['modelType'] + "&unitSystem=METRICSYSTEM";
      }
      const { data: response, status } = await axios.get<ILogiAPIResponse>(url)
      if (!response?.hasError) {
        const shipperFormData = generateShipperFormData(response);
        const _resetData = {
          ...shipperFormData, ...{ 'SAMEASORG': formInstance.getValues('SAMEASORG'), 'TIMEZONE': await getTimezone(shipperFormData?.['TIMEZONE']) , 'BASECURRENCY': await getCurrency(shipperFormData?.['BASECURRENCY']), 'BASELANGUAGE' : await getLanguage(shipperFormData?.['BASELANGUAGE'])
         }
        }
        reset({ ..._resetData })
        // setDropDowns(shipperFormData, 'METRICSYSTEM');
        
        dispatch({ type: '@@shipperPreferenceForm/SET_SHIPPER_DATA', payload: _resetData })
        dispatch({ type: '@@shipperPreferenceForm/SET_FORM_RESET_DATA', payload: _resetData })
       
      }
    }
  
  const getCurrency = async (data : IShipperLookupData) : Promise<IShipperLookupData> => {
    if (currency) {
      const value = Object.values(currency).find((key : any) => key?.code === data?.name);
      return {id: data?.id, name: value ? value?.name : data?.name};
    }
    const { data: payload } = await axios.get<ICurrencyLookup[]>(apiMappings.common.lookup.getCurrency, {data: {}, headers: {'Content-Type': 'application/json'}});
    setCurrency(payload);
    const value = Object.values(payload).find((key : any) => key?.code === data?.name);
    return {id: data?.id, name: value ? value?.name : data?.name};
  }

  const getTimezone = async (data : IShipperLookupData) : Promise<IShipperLookupData> => {
    if (timezone) {
      const value = Object.values(timezone).find((key : any) => key?.canonicalId === data?.name);
      return {id: data?.id, name: value ? value?.gmtoffset : data?.name};
    }
    const { data: payload } = await axios.get<ITimezoneLookup[]>(apiMappings.common.lookup.getTimezoneList, {});
    setTimezone(payload)
    const value = Object.values(payload).find((key : any) => key?.canonicalId === data?.name);
    return {id: data?.id, name: value ? value?.gmtoffset : data?.name};
  }

  const getLanguage = async (data : IShipperLookupData) : Promise<IShipperLookupData> => {
    if (language) {
      const value = Object.values(language).find((key : any) => key?.clientRefMasterCd === data?.name);
      return {id: data?.id, name: value ? value?.clientRefMasterDesc : data?.name};
    }
    const { data: payload } = await axios.get<ILocaleLookup[]>(apiMappings.common.lookup.getBaseLanguage, {});
    setLanguage(payload)
    const value = Object.values(payload).find((key : any) => key?.clientRefMasterCd === data?.name);
    return {id: data?.id, name: value ? value?.clientRefMasterDesc : data?.name};
  }

  const setDropDowns = (dataRes: any, prefix: string) => {
    let distanceDropdownOptions: IShipperUnitSystemProperty[] = [];
    let speedDropdownOptions: IShipperUnitSystemProperty[] = [];
    let volumeDropdownOptions: IShipperUnitSystemProperty[] = [];
    let weightDropdownOptions: IShipperUnitSystemProperty[] = [];
    let dimensionDropdownOptions: IShipperUnitSystemProperty[] = [];
    dataRes && dataRes.length && dataRes?.map((res: any) => {
      if (res.lookupType == prefix + 'DISTANCE') {
        distanceDropdownOptions.push({ label: res.lookupCd, value: res.lookupCd })
        setValue('DISTANCE', { id: 'DISTANCE', name: res.lookupCd })
      }
      else if (res.lookupType == prefix + 'VOLUME') {
        speedDropdownOptions.push({ label: res.lookupCd, value: res.lookupCd })
        setValue('VOLUME', { id: 'VOLUME', name: res.lookupCd })
      }
      else if (res.lookupType == prefix + 'SPEED') {
        volumeDropdownOptions.push({ label: res.lookupCd, value: res.lookupCd })
        setValue('SPEED', { id: 'SPEED', name: res.lookupCd })
      }
      else if (res.lookupType == prefix + 'WEIGHT') {
        weightDropdownOptions.push({ label: res.lookupCd, value: res.lookupCd })
        setValue('WEIGHT', { id: 'WEIGHT', name: res.lookupCd })
      }
      else if (res.lookupType == prefix + 'DIMENSION') {
        dimensionDropdownOptions.push({ label: res.lookupCd, value: res.lookupCd })
        setValue('DIMENSION', { id: 'DIMENSION', name: res.lookupCd })
      }
    })
    setDIMENSION_DROPDOWNOPTIONS(dimensionDropdownOptions)
    setWEIGHT_DROPDOWNOPTIONS(weightDropdownOptions)
    setSPEED_DROPDOWNOPTIONS(volumeDropdownOptions)
    setVOLUME_DROPDOWNOPTIONS(speedDropdownOptions)
    setDISTANCE_DROPDOWNOPTIONS(distanceDropdownOptions)
    // setValue("UNITSYSTEM",{ id: 'UNITSYSTEM',name: sysPropertyMapping[prefix] || sysPropertyReverseMapping[prefix]})
    console.log("DISTANCE_DROPDOWNOPTIONS", DISTANCE_DROPDOWNOPTIONS)
  }



  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: '@@shipperPreferenceForm/FETCH_STRUCTURE' })
    }
  }, [!sectionKeys.length])



  useEffect(() => {
    if (!onBoardingData) {
      commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
    }
    else {
      getShipperStructure();
    }
  }, [onBoardingData])

  /** Callbacks */
  const onSubmit = async (data: any) => {
    sendGA('Event New',  'shipperSettings - shipper preference save');
    const payload: IShipperPreferenceFormData[] = [];
    Object.keys(data).map((key: string) => {
      if (key == 'SAMEASORG') {

      }
      else if (key == 'BASECOUNTRYCODE') {
        payload.push({
          "propertyKey": key,
          "propertyValue": data['BASECOUNTRY'].googleCountryCode || data[key].name,
          "propertyType": "system property",
          "showProperty": "Y"
        })
      }
      else if (key == 'TIMEZONE' && timezone) {
        const selectedTimezone = timezone?.filter(item => item.gmtoffset == data[key].name)
        payload.push({
          "propertyKey": key,
          "propertyValue": data[key].canonicalId || selectedTimezone[0]?.canonicalId,
          "propertyType": "system property",
          "showProperty": "Y"
        })
      }
      else if (key == 'UNITSYSTEM') {
        payload.push({
          "propertyKey": key,
          "propertyValue": sysPropertyMapping[data[key]?.name],
          "propertyType": "system property",
          "showProperty": "Y"
        })
      } else if (key == 'BASELANGUAGE' && language) {
        payload.push({
          "propertyKey": key,
          "propertyValue": Object.values(language).find((key : any) => key?.clientRefMasterDesc === data[key]?.name)?.clientRefMasterCd || data[key]?.name || "",
          "propertyType": "system property",
          "showProperty": "Y"
        })
      } else if (key == 'BASECURRENCY' && currency) {
         const selectedCurrency = currency.filter(item => item.name == data[key]?.name)
        payload.push({
          "propertyKey": key,
          "propertyValue": selectedCurrency[0]?.code || "",
          "propertyType": "system property",
          "showProperty": "Y"
        })
      } else {
        payload.push({
          "propertyKey": key,
          "propertyValue": data[key]?.name || "",
          "propertyType": "system property",
          "showProperty": "Y"
        })
      }
    })
    
    dispatch({ type: '@@shipperPreferenceForm/SET_LOADING', payload: true })
    try {
      const { data: response } = await axios['put']((apiMappings.shipper.preference['save'] + subClientId + ((formInstance.getValues('SAMEASORG')=='Y') ? '&inheritFromSuper=true' : '&inheritFromSuper=false')), payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        dispatch({ type: '@@shipperPreferenceForm/SET_LOADING', payload: false })
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message:dynamicLabels.ShipperPreferencesSavedSuccessfully ||  response.message,
            icon: 'check-round'
          }
        })
        hybridRouteTo('shipper')
      }
    } catch (error) {
      dispatch({ type: '@@shipperPreferenceForm/SET_LOADING', payload: false })
      if (error?.response?.data?.status === 428) {
        return
      }

      // toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }



  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })

      dispatch({ type: '@@shipperPreferenceForm/RESET_INITIAL_STATE' })
    }
  }, [])

  useEffect(() => {
    if(sameAsOrg!== undefined){
      if (formInstance.getValues('SAMEASORG') == 'N') {
        dispatch({ type: '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF', payload: false });
      }
      else {
        dispatch({ type: '@@shipperPreferenceForm/SET_SAME_AS_SYSTEMPREF', payload: true });
      }
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })
  
      // dispatch({ type: '@@shipperPreferenceForm/RESET_INITIAL_STATE' })
      // dispatch({ type: '@@shipperPreferenceForm/SET_FORM_RESET_DATA', payload: {} })
      // dispatch({ type: '@@shipperPreferenceForm/SET_SHIPPER_DATA', payload: {} })
      // reset({})
      setShipperData();
    }
  }, [sameAsOrg])


  useEffect(() => {
    if (unitSystem.name && unitSystem.name != '' && unitSystem.name != undefined) {
      setUnitSystem()
    }

  }, [unitSystem, unitSystem?.name])


  const setUnitSystem = async () => {
    let prefix = sysPropertyMapping[unitSystem.name] || 'METRICSYSTEM';
    let param = prefix + "VOLUME," + prefix + "WEIGHT," + prefix + "DISTANCE," + prefix + "SPEED," + prefix + "DIMENSION";
    try {
      const { data: response } = await axios['get'](apiMappings.shipper.preference['getUnitSystemMetrices'] + param)
      if (response) {
        setDropDowns(response, prefix)
        setUnitSystemResponse(response, prefix);
        const unitMapping = setUnitSystemResponse(response, prefix);
        
        if (unitMapping) {
          // const resetUnits = { ...resetData, ...unitMapping, 'UNITSYSTEM': unitSystem, 'SAMEASORg': sameAsOrg}
          // reset(resetUnits)
          // setsameAsParentSystemProps(formInstance.formState.isDirty)
          // dispatch({ type: '@@shipperPreferenceForm/SET_SHIPPER_DATA', payload: resetUnits })
          // dispatch({ type: '@@shipperPreferenceForm/SET_FORM_RESET_DATA', payload: resetUnits });
        }
      }
    }
    catch (error) {

    }
  }


  const setFieldValue=(fieldname:string, dropdownOptions:IShipperUnitSystemProperty[])=>{
   const filtered= dropdownOptions.filter((option:any)=>{
    return  option.value == clientPreferenceData?.[fieldname]?.name
    })
   return filtered.length ? filtered[0]?.value : (dropdownOptions[0]?.value || '')
  }

  return (
    <FormWrapper style={{ marginTop: 0 }} >
      <div id='toast-inject-here'></div>
      <div className="text-initial">
        {/* {isLoading && <div ref={loaderRef}><FormLoader /></div>} */}

        <div style={isLoading ? {  } : { minHeight: 'calc(100vh - 120px)' }}>
         
              <Grid container spacing='10px' style={{ marginBottom: '15px', paddingTop: '24px' }}>

                  <Grid  item md={6} xs={12} sm={6} className='grid-item'>
                  {isLoading && <div ref={loaderRef}><FormLoader /></div>}
                {sectionKeys.length > 0 && sectionKeys.map((sectionName) => {
                   {return Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                    <Grid container spacing='10px' style={isLoading ? { } :{}}>
                      { Object.keys(structure[sectionName]).map(fieldName => {
                        const meta = structure[sectionName][fieldName];
                        // meta.editable = !(formInstance.getValues('SAMEASORG')=='Y');
                        if (meta.fieldName == 'BASECURRENCY') {
                          meta.editable = false
                        }
                        let dropdownOptions: { label: string, value: string }[] = [];
                        if (meta.fieldName == 'DISTANCE') {
                          dropdownOptions = DISTANCE_DROPDOWNOPTIONS;
                        }
                        else if (meta.fieldName == 'SPEED') {
                          dropdownOptions = SPEED_DROPDOWNOPTIONS;
                        }
                        else if (meta.fieldName == 'WEIGHT') {
                          dropdownOptions = WEIGHT_DROPDOWNOPTIONS;
                        }
                        else if (meta.fieldName == 'VOLUME') {
                          dropdownOptions = VOLUME_DROPDOWNOPTIONS;
                        }
                        else if (meta.fieldName == 'DIMENSION') {
                          dropdownOptions = DIMENSION_DROPDOWNOPTIONS;
                        }
                        else if (meta.fieldName == 'TEMPERATURE') {
                          dropdownOptions = TEMPERATURE_DROPDOWNOPTIONS;
                        }
                        if (meta.fieldName == 'DISTANCE' || meta.fieldName == 'SPEED' || meta.fieldName == 'WEIGHT' || meta.fieldName == 'VOLUME' || meta.fieldName == 'DIMENSION' || meta.fieldName == 'TEMPERATURE') {
                          return <Grid item key={fieldName} xs={12} sm={12} md={12} className='grid-item'>
                            <DropDown
                              required
                              placeholder={meta.label}
                              label={meta.label}
                              variant='form-select'
                              disabled={formInstance.getValues('SAMEASORG')=='Y'}
                              onChange={(value: string) => {
                                //   if(meta.fieldName!='TEMPERATURE'){
                                setValue(meta.fieldName, { id: meta.fieldName, 'name': value });
                                // }
                              }}
                              optionList={dropdownOptions}
                              value={ setFieldValue(meta.fieldName, dropdownOptions)}
                                // if(meta.fieldName!='TEMPERATURE'){
                                //   clientPreferenceData?.[meta.fieldName]?.name || dropdownOptions[0]?.value || ''
                                // }
                              
                            />
                          </Grid>

                        }

                        return (
                          <Grid item key={fieldName} xs={12} sm={12} md={12} className='grid-item'>
                            <FormField
                              name={fieldName}
                              meta={meta}
                              formInstance={formInstance} />
                          </Grid>
                        )
                      })}
                    </Grid>}})}
                  </Grid>
                
                  <Grid item md={6} xs={12} sm={6} className='grid-item'>
                    <Grid container >
                      <Grid item md={12} sm={12} className="grid-item">
                        <img style={{ maxWidth: "100%" }} className="laptop-graphic-img" src="images/onboarding/laptop-settings.png" alt=""></img>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
          
        </div>
        {!isLoading &&
          <Box horizontalSpacing='15px' display='flex' mt='30px'>
            <IconButton id='shipperConfigPreference--actionbar--save' iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{dynamicLabels.save}</IconButton>
          </Box>
        }

      </div>
    </FormWrapper>
  )
}

export default withReactOptimized(ShipperPreference)