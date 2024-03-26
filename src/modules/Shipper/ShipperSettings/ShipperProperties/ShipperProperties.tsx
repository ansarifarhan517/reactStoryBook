import React, { useEffect, Dispatch } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box, Grid, SectionHeader, IconButton,
  useToast,
  withPopup
  // Loader
} from 'ui-library'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { hybridRouteTo} from '../../../../utils/hybridRouting'
import { useDispatch } from 'react-redux'
import { IShipperPropertiesFormActions, IShipperData, ILocalStorageEntries } from './ShipperProperties.model'
import { IShipperCommonFormActions } from '../../ShipperCommon/ShipperCommon.model'
import FormField from '../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import { generateShipperFormData } from './ShipperProperties.utils'
import { SectionHeaderContainer, FormWrapper } from '../../../../utils/components/Form/Form.styles'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../utils/components/FormLoader'
import withReact from '../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../utils/core'
import { FormFieldWapper } from './ShipperProperties.styles'
import { sendGA } from '../../../../utils/ga';
import { withThemeProvider } from '../../../../utils/theme'
import withRedux from '../../../../utils/redux/withRedux'
const currencySymbol = 'cur_symbol_' + getBaseCurrency();

const ShipperProperties = () => {
   const toast = useToast();
   const userAccessInfo: ILocalStorageEntries = JSON.parse(localStorage.getItem('userAccessInfo') || '{}');
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.shipper},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues:{}
  })
  const { handleSubmit, reset, unregister } = formInstance
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IShipperPropertiesFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const commonDispatch = useDispatch<Dispatch<IShipperCommonFormActions>>()
  // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const structure = useTypedSelector(state => state.shipper.properties.structure)
  const isStructureLoading = useTypedSelector(state => state.shipper.properties.loading)
  const resetData = useTypedSelector(state => state.shipper.properties.resetData)
  const  onBoardingData = useTypedSelector(state => state.shipper.onBoardingStructure.onBoardingData.data)
  const shipperDetailsTem = onBoardingData?.configurationSteps[0]?.subSteps[0]?.answerData;
  const shipperDetails= shipperDetailsTem && shipperDetailsTem!=="" ? JSON.parse(shipperDetailsTem): ''
  const serviceTypesList =  useTypedSelector(state => state.shipper.properties.serviceType)
  const priorityData =  useTypedSelector(state => state.shipper.properties.priorityData)
  const sectionKeys = Object.keys(structure)
  const isLoading = (isStructureLoading)
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  /** Utils */
  const fetchShipperProperties = async (priority:any) => {
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IShipperData>>(`${apiMappings.shipper.properties.getShipperProperties}?subClientId=${shipperDetails.subClientId}`)
      if (status === 200) {
        dispatch({ type: '@@shipperPropertiesForm/SET_SHIPPER_DATA', payload: data })
        const _resetData = {
          ...resetData, ...generateShipperFormData(data, priority, serviceTypesList)
         }
        if(_resetData?.serviceType){
          _resetData.serviceType = typeof _resetData.serviceType === 'string' ?  [] : _resetData.serviceType
        }
        reset({ ..._resetData })
        dispatch({ type: '@@shipperPropertiesForm/SET_FORM_RESET_DATA', payload: _resetData })
      }
    } catch (error) {
      console.log(error)
      // toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: '@@shipperPropertiesForm/FETCH_STRUCTURE' })
    }
    else{
      dispatch({ type: '@@shipperPropertiesForm/SET_LOADING', payload: false })
    }
  }, [!sectionKeys.length])



  useEffect(() => {
    if (!onBoardingData) {
      commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
    }
    // else{
    //   if(shipperDetails.subClientId){
    //     getPriority()
    //   }
    // }
  }, [onBoardingData])

  // const getPriority= async() =>{
  //   try{
  //     const { data: { data, status } } = await axios.get<ILogiAPIResponse<IShipperData>>(`${apiMappings.shipper.properties.priority}`)
  //     if(status==200){
  //       dispatch({type:'@@shipperPropertiesForm/SET_PRIORITY_DATA', payload:data})
  //     }
  //   }catch(error){

  //   }
  // }

  useEffect(()=>{  
      if(priorityData.length>0 && serviceTypesList.length>0 && shipperDetails.subClientId){
        fetchShipperProperties(priorityData)
      }
  },[priorityData, serviceTypesList])

  /** Callbacks */
  const onSubmit = async (data: any) => { 
    if((data?.serviceAreaProfileId === data?.serviceAreaProfileName?.serviceAreaProfileId) && (data?.rateChartId === data?.rateChartName?.id)){
      data.rateChartName=undefined
    }
    sendGA('Event New',  'shipperSettings - shipper properties save');
    let clientPropertiesData: any[] = [];
    clientPropertiesData.push({
      "propertyKey": "MAXRETRYATTEMPTS",
      "propertyValue": data.orderReAttemps,
      "propertyType": "client property",
      "showProperty": "Y"
    });
    clientPropertiesData.push({
      "propertyKey": "BOOKINGTOORDER",
      "propertyValue": data.orderConversion =='Manual' ? "FALSE" : "TRUE" ,
      "propertyType": "client property",
      "showProperty": "Y"
    });
    
    const payload = { 
      clientProperties: clientPropertiesData,
      shipperDetailsId:shipperDetails?.shipperDetailsId ,
      subClientId: shipperDetails?.subClientId ,
      serviceAreaProfileName:data?.serviceAreaProfileName?.serviceAreaProfileName || data?.serviceAreaProfileName?.name || '',
      serviceAreaProfileId:data?.serviceAreaProfileName?.serviceAreaProfileId  || data?.serviceAreaProfileName?.id || '',
      rateChartName:  data?.rateChartName?.rateChartName || data?.rateChartName?.name || '',
      rateChartId:  data?.rateChartName?.shipmentratechartdetailsid || data?.rateChartName?.id || '',
      clientId:JSON.parse(userAccessInfo.clientId),
      serviceType:data ? (data?.serviceType?.map((service:any) => {return service?.clientRefMasterCd || service?.name; }))?.toString():'',
      priority: data?.priority?.clientRefMasterCd || data?.priority?.name || '',
      calendarId: data?.holidayCalendar?.calendarId
     }
    
    try {
      const { data: response } = await axios['put'](apiMappings.shipper.properties['save']+('?subClientId='+shipperDetails.subClientId), payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.status === 200) {
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
      }
    } catch (error) {
      if (error?.response?.data?.status === 428) {
        return
      }
      toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }



  useEffect(() => {
    // dispatch({ type: '@@shipperPropertiesForm/FETCH_SERVICETYPE' })
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })

      dispatch({ type: '@@shipperPropertiesForm/RESET_INITIAL_STATE' })
    }
  }, [])

 
  return (
    <FormWrapper formName="shipper" style={{marginTop:0}}>
      <div id='toast-inject-here'></div>
     
      <div>
        {isLoading && <div ref={loaderRef}><FormLoader /></div>}
        {!isLoading && 
        <div>
          {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
            <div key={sectionName}>
              {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                <SectionHeaderContainer>
                    <SectionHeader headerTitle={dynamicLabels[sectionName] ? dynamicLabels[sectionName] : 'Shipper Properties'} />
                </SectionHeaderContainer>}

              <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                <Grid item md={12} xs={12} sm={12} className='grid-item'>
                  <Grid container spacing='10px'>
                    {Object.keys(structure[sectionName]).map(fieldName => {
                      const meta = structure[sectionName][fieldName]
                      if(fieldName=='orderConversion'){
                        meta['dropdownValues']= {"Automatic":"Automatic", "Manual":"Manual"}
                        meta['customField'] = true;
                      }
                      const { permission} = meta
                      if (!permission) {
                        return undefined
                      }
                      return (
                          <Grid item key={fieldName} xs={12} sm={6} md={4} className='grid-item'>
                          <FormFieldWapper>
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance} />
                            </FormFieldWapper>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </Grid>

            </div>
          )}
        </div>
        }
        {!isLoading && 
         <Box horizontalSpacing='15px' display='flex' mt='30px'>
         <IconButton id='shipperConfigProperties--actionbar--save' iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{ dynamicLabels.save }</IconButton>
         <IconButton id='shipperConfigProperties--actionbar--cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} onClick={() => {
           sendGA('Event New',  'shipperSettings - shipper properties cancel');
           hybridRouteTo('shipper');
         }}>{dynamicLabels.cancel}</IconButton>
       </Box>} 
       
      </div>
    </FormWrapper>
  )
}

export default withThemeProvider(withRedux(withPopup(ShipperProperties)), false)