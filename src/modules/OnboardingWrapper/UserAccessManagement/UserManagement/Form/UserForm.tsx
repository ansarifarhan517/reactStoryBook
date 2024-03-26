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
import { IUserFormActions, IUserData, IUserFormParams } from './UserForm.model'
import FormField from '../../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../../utils/api.interfaces'
import { generateUserFormData, useGoogleAnalytics, useBreadCrumbs } from './UserForm.utils'
import { SectionHeaderContainer, UserFormWrapper } from './UserForm.styles'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../../utils/components/FormLoader'
import withReact from '../../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../../utils/core'
import { useHistory } from 'react-router-dom'
import { businessPersonaEnum } from "./../../UserManagement.utilis";


const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const UserForm = () => {
  // const renderCount = React.useRef(0)
  // console.log('Driver Form Renderring: ', renderCount.current++)
  /** General Hooks */
  const history = useHistory();
  const toast = useToast()
  const params = useParams<IUserFormParams>();

  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.settings.userManagement},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false
  })
  const { handleSubmit, reset,  unregister, watch, setValue } = formInstance

  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IUserFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()


  const structure = useTypedSelector(state => state.settings.userManagement.form.structure)
  const isEditMode = useTypedSelector(state => state.settings.userManagement.form.isEditMode)
  const isStructureLoading = useTypedSelector(state => state.settings.userManagement.form.loading)
  const resetData = useTypedSelector(state => state.settings.userManagement.form.resetData)
  const userData = useTypedSelector(state => state.settings.userManagement.form.userData)
  const isSubmitted = useTypedSelector(state => state.settings.userManagement.form.isSubmitted)
  const sectionKeys = Object.keys(structure)

  /** Internal State */

  
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(false)
  const isLoading = React.useMemo(() => isStructureLoading || isUserDataLoading, [isStructureLoading, isUserDataLoading])
  const loaderRef = React.useRef<HTMLDivElement | null>(null)
  const userGroupWatcher = watch('userGroupId', '');
  const [showReportingManager, setShowReportingManager] = useState<boolean>(false);

  dispatch({type:'@@userForm/SET_FORM_DIRTY_FLAG',payload:formInstance.formState.isDirty})

  /** Utils */
  const fetchUserData = async (userId: string | number) => {
    dispatch({ type: '@@userForm/SET_LOADING', payload: true })
    setIsUserDataLoading(true)
    try {
      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IUserData>>(`${apiMappings.userManagement.form.getUser}?userId=${userId}`)
      if (status === 200) {
        dispatch({ type: '@@userForm/SET_USER_DATA', payload: data })
        

        const _resetData = {
          ...resetData, ...generateUserFormData(data)
        }
        reset({ ..._resetData })
        dispatch({ type: '@@userForm/SET_FORM_RESET_DATA', payload: _resetData })
        dispatch({ type: '@@userForm/SET_LOADING', payload: false })
        setIsUserDataLoading(false)
        if (data?.persona && businessPersonaEnum.includes(data?.persona)){
          setShowReportingManager(true)
        }
      }
    } catch (error : any) {
      dispatch({ type: '@@userForm/SET_LOADING', payload: false })
      setIsUserDataLoading(false)
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }



  /** Watchers */
  useEffect(() => {
    
    if (!sectionKeys.length) {
      dispatch({ type: '@@userForm/FETCH_STRUCTURE' })
    }

    if (clientProperties?.TIMEZONE && !userData) {

      if (params.userId) {

        dispatch({ type: '@@userForm/SET_EDIT_MODE', payload: true })

        fetchUserData(params.userId)

      } else {
        reset({ ...resetData })
      }
    }
  }, [clientProperties])

  /** Callbacks */
  const onSubmit = async (data: any) => {
    gaOnSubmit()
    if (!formInstance.formState.isDirty) {
      history.push({ pathname: '/' });
      return
    }
    dispatch({ type: '@@userForm/SET_IS_SUBMIT', payload: true })
    const {
      clientId,
      distributionCenter,
      userTimeZone,
      userGroupId,
      timeZoneId,
      country,
      parentUserId,
      userName
    } = data

    const payload = {
      ...data,
      clientId: clientId?.id,
      distributionCenter: distributionCenter?.id,
      userGroupId: userGroupId?.id,
      timeZoneId: userTimeZone?.timezoneId!==undefined?userTimeZone?.timezoneId:timeZoneId,
      userTimeZone: userTimeZone?.canonicalId,
      country: country?.id,
      parentUserId: parentUserId?.userId,
      timezoneChanged: userTimeZone?.timezoneId != undefined,
      userName: userName.trim()
    }


    try {

      const { data: response } = await axios['post'](apiMappings.userManagement.form[isEditMode ? 'update' : 'create'], payload, {
        headers: {
          'Content-Type': 'application/json'
        },

      })

      if (response.status === 200) {

        dispatch({ type: '@@userForm/SET_LOADING', payload: false })
        dispatch({ type: '@@userForm/SET_IS_SUBMIT', payload: false })
        if (isEditMode === true) {
          toastDispatch({
            type: '@@globalToast/add', payload: {
              message: dynamicLabels?.userUpdatedSuccessfully,
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
      }
      else if (response.status === 409) {
        dispatch({ type: '@@userForm/SET_IS_SUBMIT', payload: false })
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
      }



    } catch (error : any) {
      dispatch({ type: '@@userForm/SET_IS_SUBMIT', payload: false })
      dispatch({ type: '@@userForm/SET_LOADING', payload: false })
      toast.add(error?.response?.data?.error?.message?.[0] || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }





  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })

      dispatch({ type: '@@userForm/RESET_INITIAL_STATE' })
    }
  }, [])

  useEffect(() => {
    const persona = userGroupWatcher?.persona;
    if (persona && Object.keys(structure).length && structure['General Details']['parentUserId']) {
      businessPersonaEnum.includes(persona) ? setShowReportingManager(true) : setShowReportingManager(false);
    } else if (showReportingManager) {
      setShowReportingManager(false)
      setValue("parentUserId", undefined)
    }
  }, [userGroupWatcher])

  useEffect (() => {
  }, [showReportingManager])

  return (
    <UserFormWrapper>
      <div id='toast-inject-here'></div>

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
                {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                  <SectionHeaderContainer>
                    <SectionHeader headerTitle={dynamicLabels[sectionName] ? dynamicLabels[sectionName] : sectionName} />
                  </SectionHeaderContainer>}

                <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                  {Object.keys(structure[sectionName]).map(fieldName => {
                    const meta = structure[sectionName][fieldName]
                    meta.multipleFiles = false

                    const { permission } = meta

                    if (!permission) {
                      return undefined
                    }

                    if (fieldName === "parentUserId" && !showReportingManager) {
                      return undefined;
                    }

                    if (fieldName === "userName" && isEditMode === true) {
                      meta.editable = false;
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
            <IconButton id={`UserForm-actionBar-${isEditMode ? dynamicLabels.update : dynamicLabels.save}`} iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading || isSubmitted} onClick={handleSubmit(onSubmit)} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
            <IconButton id='UserForm-actionBar-cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading || isSubmitted} onClick={() => {
              gaOnCancel(formInstance)
              handleBreadCrumbClick('settings/userManagement')
            }}>{dynamicLabels.cancel}</IconButton>
          </Box>
        </Card>
      </Box>
    </UserFormWrapper>
  )
}

export default withReact(UserForm)