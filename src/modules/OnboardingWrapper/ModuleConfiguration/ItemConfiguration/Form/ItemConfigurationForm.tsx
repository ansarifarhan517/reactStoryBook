import React, { useEffect, Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  BreadCrumb, Box, Card, Grid, SectionHeader, IconButton, 
  useToast
} from 'ui-library'

import { useParams } from 'react-router-dom'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import {  IUserData, IItemFormParams } from './ItemConfiguration.model'
import {IItemFormActions} from './ItemConfiguration.action'
import FormField from '../../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../../utils/api.interfaces'
import { generateItemFormData, useGoogleAnalytics, useBreadCrumbs } from './ItemConfiguration.utils'
import { ItemFormWrapper, SectionHeaderContainer } from './ItemConfiguration.styles'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../../utils/components/FormLoader'
import withReact from '../../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../../utils/core'
import { useHistory } from 'react-router-dom'
import {preparePOSTData} from './../utils'

const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const ItemConfiguration = () => {
  /** General Hooks */
  const history = useHistory();
  const toast = useToast()
  const params = useParams<IItemFormParams>();

  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.settings.itemConfiguration},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false
  })
  const { handleSubmit, reset,  unregister } = formInstance

  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IItemFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()


  const structure = useTypedSelector(state => state.itemConfiguration.form.structure)
  const isEditMode = useTypedSelector(state => state.itemConfiguration.form.isEditMode)
  const isStructureLoading = useTypedSelector(state => state.itemConfiguration.form.loading)
  const resetData = useTypedSelector(state => state.itemConfiguration.form.resetData)
  const userData = useTypedSelector(state => state.itemConfiguration.form.userData)
  const systemMetric = useTypedSelector(state => state.itemConfiguration.form.systemMetric)
  const sectionKeys = Object.keys(structure) !== null && Object.keys(structure)
  
  /** Internal State */

  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false)
  const isLoading = React.useMemo(() => isStructureLoading || isUserDataLoading, [isStructureLoading, isUserDataLoading])
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  const [disableSave, setDisableSave] = useState(false)

  dispatch({type:'@@itemForm/SET_FORM_DIRTY_FLAG',payload:formInstance.formState.isDirty})
/** Callbacks */
const onSubmit = async (data: any) => {
  gaOnSubmit()
  if (!formInstance.formState.isDirty) {
    history.push({ pathname: '/' });
    return
  }
  if(data?.minTemperature !== '' && data?.maxTemperature !== ''){
    if(parseInt(data?.minTemperature) >= parseInt(data?.maxTemperature)) {
      toastDispatch({
        type: '@@globalToast/add', payload: {
          message: dynamicLabels?.maxTempGreaterThanMinTemp,
          icon: 'check-round'
        }
      })
      return
    }
  } 
  setDisableSave(true)
  
  const convertedData = preparePOSTData(data,"POST", systemMetric)

  const {
    preparationTime,
    temperatureCategory,
  } = convertedData
  
  delete convertedData?.preparationTime
  delete convertedData?.temperatureCategory

  const payload = {
    prepTime: parseInt(preparationTime),
    temperatureCategoryCd: temperatureCategory?.name,
    ...convertedData,
  }

  try {

    const { data: response } = await axios['post'](apiMappings.itemConfiguration.form[isEditMode ? 'update' : 'create'], payload, {
      headers: {
        'Content-Type': 'application/json'
      },

    })

    if (response.status === 200) {


      dispatch({ type: '@@itemForm/SET_LOADING', payload: false })
      if (isEditMode === true) {
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: dynamicLabels?.itemUpdatedSuccessfully,
            icon: 'check-round'
          }
        })
      }

      toastDispatch({
        type: '@@globalToast/add', payload: {
          message: response.message,
          icon: 'check-round'
        }
      })
      history.push({ pathname: '/' });
      setDisableSave(false)
    }
    else if (response.status === 409) {

      toastDispatch({
        type: '@@globalToast/add', payload: {
          message: response.message,
          icon: 'check-round'
        }
      })
      setDisableSave(false)
    }
  } catch (error) {

    dispatch({ type: '@@itemForm/SET_LOADING', payload: false })
    toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
  }
}

  console.log(formInstance.formState.isDirty)

  /** Utils */
  const fetchUserData = async (userId: string | number) => {
    dispatch({ type: '@@itemForm/SET_LOADING', payload: true })
    setIsUserDataLoading(true)
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IUserData>>(`${apiMappings.itemConfiguration.form.getItem}?itemId=${userId}`)
      if (status === 200) {
        dispatch({ type: '@@itemForm/SET_USER_DATA', payload: data })
        
        const convertedGETDATA = preparePOSTData(data, 'GET', systemMetric)

        const _resetData = {
          ...resetData, ...generateItemFormData(convertedGETDATA)
        }

        reset({ ..._resetData })
        dispatch({ type: '@@itemForm/SET_FORM_RESET_DATA', payload: _resetData })
        dispatch({ type: '@@itemForm/SET_LOADING', payload: false })
        setIsUserDataLoading(false)
       
      }
    } catch (error) {
      dispatch({ type: '@@itemForm/SET_LOADING', payload: false })
      setIsUserDataLoading(false)
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }



  /** Watchers */
  useEffect(() => {
    
    if (!sectionKeys.length) {
      dispatch({ type: '@@itemForm/FETCH_STRUCTURE' })
    }

    if (clientProperties?.TIMEZONE && !userData && systemMetric && systemMetric?.length > 0) {

      if (params.itemId) {

        dispatch({ type: '@@itemForm/SET_EDIT_MODE', payload: true })

        fetchUserData(params.itemId)

      } else {
        reset({ ...resetData })
      }
    }
  }, [clientProperties, systemMetric])

  

  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })

      dispatch({ type: '@@itemForm/RESET_INITIAL_STATE' })
    }
  }, [])

  return (
    <ItemFormWrapper>
      <div id='toast-inject-here'></div>

      <Box py='15px'>
        <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
      </Box>
      <Box bgColor='white'>
        <Card style={{ minHeight: '80vh', position: 'relative' }}>

          {isLoading && <div ref={loaderRef}><FormLoader /></div>}

          <div style={isLoading ? { display: 'none' } : {}}>

            {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>

              <div key={sectionName}>
                {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                  <SectionHeaderContainer>
                    <SectionHeader headerTitle={dynamicLabels[sectionName]} />
                  </SectionHeaderContainer>}

                <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                  {Object.keys(structure[sectionName]) !== null && Object.keys(structure[sectionName]).map((fieldName:string) => {
                    const meta = structure[sectionName][fieldName]
                    meta.multipleFiles = false

                    const { permission } = meta

                    if (!permission) {
                      return undefined
                    }
                    if(fieldName === 'itemPrice' && !meta.label.includes(dynamicLabels?.[`${currencySymbol}`])) {
                      meta.label = meta.label+` ( ${dynamicLabels?.[`${currencySymbol}`]} )`
                      meta.decimalPlaces = 2
                    }

                    if(fieldName === 'itemCode' && params.itemId) {
                      meta.editable = false
                    }
                    if((fieldName === 'itemPrice' || fieldName === 'itemLength' || fieldName === 'itemBreadth' || fieldName === 'itemHeight' || fieldName === 'itemVolume' || fieldName === 'itemWeight' || fieldName === 'minTemperature' || fieldName === 'maxTemperature' ) && (meta?.validation?.maxlength?.args)) {
                      meta.decimalPlaces = 2
                      meta.validation.maxlength.args = 11
                    }
                    if(fieldName === 'preparationTime') {
                      meta.removeDecimal = true
                    }
                    if(fieldName === 'incrementalPrepTime') {
                      meta.messagePlacement ='start'
                      meta.placeholder = dynamicLabels?.incrementalPreparationTimePlaceholder
                      meta.removeDecimal = true
                    }
                   
                    if(fieldName === 'itemCode' && params.itemId) {
                      meta.editable = false
                    }

                    return (
                      <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item'>
                        <FormField
                          name={fieldName}
                          meta={meta}
                          formInstance={formInstance} />
                      </Grid>
                    )
                  })}
                </Grid>
              </div>
            )}
          </div>
          <Box horizontalSpacing='15px' display='flex' mt='30px'>
            <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={disableSave} onClick={handleSubmit(onSubmit)} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
            <IconButton iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => {
              gaOnCancel(formInstance)
              handleBreadCrumbClick('settings/itemConfiguration')
            }}>{dynamicLabels.cancel}</IconButton>
          </Box>
        </Card>
      </Box>
    </ItemFormWrapper>
  )
}

export default withReact(ItemConfiguration)



