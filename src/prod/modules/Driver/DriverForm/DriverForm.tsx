import React, { useEffect, Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  BreadCrumb, Box, Card, Grid, SectionHeader, IconButton, Checkbox,
  Modal, ModalHeader,
  useToast,
  IFilePreviewObject, IShiftTimingsObject,
  // Loader
} from 'ui-library'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { hybridRouteTo, routeContains, getQueryParams } from '../../../utils/hybridRouting'
import { useDispatch } from 'react-redux'
import { IDriverFormActions, IDriverData } from './DriverForm.model'
import FormField from '../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../utils/api.interfaces'
import { generateDriverFormData, useGoogleAnalytics, useBreadCrumbs } from './DriverForm.utils'
import moment from 'moment-timezone'
import { SectionHeaderContainer, FormWrapper } from '../../../utils/components/Form/Form.styles'
import useClientProperties from '../../common/ClientProperties/useClientProperties'
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer'
import { useCustomFieldsForm } from '../../../utils/components/Form/useCustomFieldsForm'
import FormLoader from '../../../utils/components/FormLoader'
import withReact from '../../../utils/components/withReact'
import { getBaseCurrency } from '../../../utils/core'

const hiddenSections = {
  // 'general details': true
}

const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const DriverForm = () => {
  // const renderCount = React.useRef(0)
  // console.log('Driver Form Renderring: ', renderCount.current++)
  /** General Hooks */
  const toast = useToast()

  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.driver},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false
  })
  console.log(formInstance.formState.isDirty) // make sure formState is read before render to enable the Proxy
  const { handleSubmit, reset, setValue, getValues, unregister } = formInstance
  const { getCustomFieldsFormData, generateCustomFieldsFormData } = useCustomFieldsForm()
  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IDriverFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  // const pageLabels = useTypedSelector(state => state.pageLabels.driver)
  const structure = useTypedSelector(state => state.driver.form.structure)
  const isEditMode = useTypedSelector(state => state.driver.form.isEditMode)
  const isStructureLoading = useTypedSelector(state => state.driver.form.loading)
  const resetData = useTypedSelector(state => state.driver.form.resetData)
  const driverData = useTypedSelector(state => state.driver.form.driverData)

  const sectionKeys = Object.keys(structure)

  /** Internal State */
  const [showDuplicatePhonePopup, setShowDuplicatePhonePopup] = useState<boolean>(false)
  const [duplicatePhoneMessage, setDuplicatePhoneMessage] = useState<string>('')
  const [formPayload, setFormPayload] = useState<FormData>()
  const [isDriverDataLoading, setIsDriverDataLoading] = useState<boolean>(false)
  const isLoading = React.useMemo(() => isStructureLoading || isDriverDataLoading, [isStructureLoading, isDriverDataLoading])
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  // const [navigateToRoute, setNavigateToRoute] = useState<string>()

  const [isSameAddressChecked, setIsSameAddressChecked] = useState<boolean>(false)

  /** Utils */
  const fetchDriverData = async (driverId: string | number) => {
    // dispatch({ type: '@@driverForm/SET_LOADING', payload: true })
    setIsDriverDataLoading(true)
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IDriverData>>(`${apiMappings.driver.form.getDriver}?driverId=${driverId}`)
      if (status === 200) {
        dispatch({ type: '@@driverForm/SET_DRIVER_DATA', payload: data })

        const customFieldsFormData = getCustomFieldsFormData(data.customFieldsEntity)

        const _resetData = {
          ...resetData, ...generateDriverFormData(data), ...customFieldsFormData,
          shiftList: data?.shiftList?.map((timing, i) => ({
            id: i,
            fromValue: moment.utc(timing.startTime).tz(clientProperties?.TIMEZONE?.propertyValue).toDate(),
            toValue: moment.utc(timing.endTime).tz(clientProperties?.TIMEZONE?.propertyValue).toDate()
          })),
          dateOfBirth: data.dateOfBirth && moment.utc(data.dateOfBirth).tz(clientProperties?.TIMEZONE?.propertyValue).toDate(),
          licenseValidity: data.licenseValidity && moment.utc(data.licenseValidity).tz(clientProperties?.TIMEZONE?.propertyValue).toDate()
        }
        reset({ ..._resetData })
        dispatch({ type: '@@driverForm/SET_FORM_RESET_DATA', payload: _resetData })
        // dispatch({ type: '@@driverForm/SET_LOADING', payload: false })
        setIsDriverDataLoading(false)
      }
    } catch (error) {
      console.log(error)
      // dispatch({ type: '@@driverForm/SET_LOADING', payload: false })
      setIsDriverDataLoading(false)
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: '@@driverForm/FETCH_STRUCTURE' })
    }

    if (clientProperties?.TIMEZONE && !driverData) {
      const { driverid } = getQueryParams()
      if (routeContains('updatedriver') && driverid) {
        dispatch({ type: '@@driverForm/SET_EDIT_MODE', payload: true })
        fetchDriverData(driverid)
      } else {
        reset({ ...resetData })
      }
    }
  }, [clientProperties])

  /** Callbacks */
  const onSubmit = async (data: any) => {
    gaOnSubmit()

    if (!formInstance.formState.isDirty) {
      hybridRouteTo('driver/')
      return
    }

    const {
      clientBranchId, assignVehicle, cur_country, cur_pincode, cur_state, per_country, per_pincode, per_state,
      dateOfBirth, licenseValidity,
      shiftList,
      licenseFileUpload, idProofUpload,
      licenseType,
      languagelist } = data

    const customFieldsData = generateCustomFieldsFormData(structure, data)
    // const licenseTypes = licenseType['2 Wheeler'] && licenseType['4 Wheeler'] ? 'Both' : licenseType['2 Wheeler'] ? '2 Wheeler' : licenseType['4 Wheeler'] ? '4 Wheeler' : undefined
    let licenseTypes;
    if(licenseType && typeof licenseType === 'string' && licenseType.charAt(0) != '{'){
      licenseTypes = licenseType.split(',').length > 1 ? 'Both' : licenseType
    } else if(licenseType && typeof licenseType === 'object'){
      licenseTypes = JSON.stringify(licenseType)
    } else {
      licenseTypes = licenseType
    }
    const payload = {
      ...data,
      licenseFileUpload: licenseFileUpload?.newFiles?.[0]?.data,
      idProofUpload: idProofUpload?.newFiles?.[0]?.data,
      removedLicenseProof: licenseFileUpload?.deletedFiles?.map((d: IFilePreviewObject) => d.id).join(','),
      removedAddressProof: idProofUpload?.deletedFiles?.map((d: IFilePreviewObject) => d.id).join(','),
      clientBranchId: clientBranchId?.id,
      clientBranchName: clientBranchId?.name,
      assignVehicle: assignVehicle?.id,
      cur_country: cur_country?.id,
      cur_pincode: cur_pincode?.name,
      cur_state: cur_state?.id,
      per_country: per_country?.id,
      per_pincode: per_pincode?.name,
      per_state: per_state?.id,
      licenseTypes,
      languagelist: languagelist?.map((l: any) => l?.name).join(','),
      dateOfBirth: dateOfBirth && moment(dateOfBirth).format('DD-MMM-YYYY'),
      licenseValidity: licenseValidity && moment(licenseValidity).format('DD-MMM-YYYY'),
      shiftTiming: shiftList?.length ? JSON.stringify(shiftList.map((timing: IShiftTimingsObject) => ({
        shiftStartTime: moment.tz(timing.fromValue, clientProperties?.TIMEZONE?.propertyValue).utc().format(),
        shiftEndTime: moment.tz(timing.toValue, clientProperties?.TIMEZONE?.propertyValue).utc().format()
      }))) : undefined,
      ...customFieldsData
    }

    const formData = new FormData()
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key] || '')
    })

    if (isEditMode) {
      formData.append('prevLisenceNumber', driverData?.licenseNumber || '');
      formData.append('prevPhoneNumber', driverData?.phoneNumber || '');
      if (driverData?.addressList?.[0]) {
        formData.append('curAddressId', driverData?.addressList?.[0]?.id + '' || '');
        formData.append('perAddressId', driverData?.addressList?.[1]?.id + '' || '');
      }
      formData.append('driverId', driverData?.driverId + '')
      formData.append('guid', driverData?.guid + '')
    }
    dispatch({ type: '@@driverForm/SET_LOADING', payload: true })
    try {
      const { data: response } = await axios[isEditMode ? 'put' : 'post'](apiMappings.driver.form[isEditMode ? 'update' : 'create'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        dispatch({ type: '@@driverForm/SET_LOADING', payload: false })
        // toast.add(response.message, 'check-round', false)
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
        hybridRouteTo('driver/')
      }
    } catch (error) {
      dispatch({ type: '@@driverForm/SET_LOADING', payload: false })
      if (error?.response?.data?.status === 428) {
        setDuplicatePhoneMessage(error?.response?.data?.message)
        setShowDuplicatePhonePopup(true)
        setFormPayload(formData)
        return
      }

      toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const proceedWithDuplicatePhone = async () => {
    setShowDuplicatePhonePopup(false)
    dispatch({ type: '@@driverForm/SET_LOADING', payload: true })
    try {
      const { data: response } = await axios[isEditMode ? 'put' : 'post'](apiMappings.driver.form[isEditMode ? 'update' : 'create'], formPayload, {
        params: {
          proceedWithDupContactFl: true
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        // dispatch({ type: '@@driverForm/SET_LOADING', payload: false})
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
        hybridRouteTo('driver/')
      }
    } catch (error) {
      toast.add(error?.response?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    } finally {
      dispatch({ type: '@@driverForm/SET_LOADING', payload: false })
      setFormPayload(undefined)
    }
  }

  const handleCopyAddress = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameAddressChecked(e.target.checked)
    if (e.target.checked) {
      const currentModel = getValues()

      setValue('per_country', currentModel.cur_country)
      setValue('per_state', currentModel.cur_state)
      setValue('per_apartment', currentModel.cur_apartment)
      setValue('per_pincode', currentModel.cur_pincode)
      setValue('per_streetName', currentModel.cur_streetName)
      setValue('per_landmark', currentModel.cur_landmark)
      setValue('per_locality', currentModel.cur_locality)
      setValue('per_city', currentModel.cur_city)
    }else{
      setValue('per_country', '')
      setValue('per_state', '')
      setValue('per_apartment', '')
      setValue('per_pincode', '')
      setValue('per_streetName', '')
      setValue('per_landmark', '')
      setValue('per_locality', '')
      setValue('per_city', '')
    }
  }, [setValue, getValues])

  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })

      dispatch({ type: '@@driverForm/RESET_INITIAL_STATE' })
    }
  }, [])

  const handleCountryChange = ()=>{
    setValue('cur_state', '')
    setValue('cur_apartment', '')
    setValue('cur_pincode', '')
    setValue('cur_streetName', '')
    setValue('cur_landmark', '')
    setValue('cur_locality', '')
    setValue('cur_city', '')
  }

  return (
    <FormWrapper>
      <div id='toast-inject-here'></div>
      <Modal open={showDuplicatePhonePopup} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={`${dynamicLabels['Contact Number']} ${dynamicLabels.Confirmation}`}
            imageVariant='icomoon-close'
            handleClose={() => {
              setFormPayload(undefined)
              setShowDuplicatePhonePopup(false)
            }}
          />,
          content: <div style={{ fontSize: '14px' }}>{duplicatePhoneMessage}</div>,
          footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
            <IconButton id='driverForm-actionBar-ok' iconVariant='icomoon-tick-circled' primary onClick={proceedWithDuplicatePhone}>{dynamicLabels.ok}</IconButton>
            <IconButton id='driverForm-actionBar-cancel' iconVariant='icomoon-close' onClick={() => setShowDuplicatePhonePopup(false)}>{dynamicLabels.cancel}</IconButton>
          </Box>
        }}
      </Modal>
      <Box py='15px'>
        <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
      </Box>
      <Box bgColor='white'>
        <Card style={{ minHeight: '80vh', position: 'relative' }}>

          {/* {isLoading && <Loader center fadeBackground />} */}
          {isLoading && <div ref={loaderRef}><FormLoader /></div>}

          <div style={isLoading ? { display: 'none' } : {}}>
          {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
            <div key={sectionName}>
              {!hiddenSections[sectionName] && Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                <SectionHeaderContainer>
                  {sectionName === 'Permanent Address' ?
                    <SectionHeader headerTitle={dynamicLabels[sectionName]} >
                      <div style={{paddingLeft:'10px'}}>
                        <Checkbox id='sameAsCurrentAddress' label={dynamicLabels.sameAddress} checkboxSize='md' checked={isSameAddressChecked} onChange={handleCopyAddress} />
                      </div>
                    </SectionHeader>
                    :
                    <SectionHeader headerTitle={dynamicLabels[sectionName]} />}
                </SectionHeaderContainer>}

              <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                {Object.keys(structure[sectionName]).map(fieldName => {
                  const meta = structure[sectionName][fieldName]
                  meta.multipleFiles = false
                  const { permission, fieldType, childNodes } = meta

                  if (!permission) {
                    return undefined
                  }

                  if (fieldType === 'address' && childNodes) {
                    return Object.entries(childNodes).map(([key, value]) => {
                      if(key =="cur_country"){
                        return (
                          <Grid item key={key} xs={12} sm={6} md={3} className='grid-item'>
                            <FormField
                              name={key}
                              onChange={handleCountryChange}
                              meta={value}
                              formInstance={formInstance}
                               />
                          </Grid>
                        )
                      }
                      return (
                        <Grid item key={key} xs={12} sm={6} md={3} className='grid-item'>
                          <FormField
                            name={key}
                            meta={value}
                            formInstance={formInstance} />
                        </Grid>
                      )
                    })
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

            <IconButton id={`${isEditMode? 'driverForm-actionBar-update':'driverForm-actionBar-save' } `} iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
            <IconButton id='driverForm-actionBar-cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => {

              gaOnCancel()
              handleBreadCrumbClick('drivers')
            }}>{dynamicLabels.cancel}</IconButton>
          </Box>
        </Card>
      </Box>
    </FormWrapper>
  )
}

export default withReact(DriverForm)