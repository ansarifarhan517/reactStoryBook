
import React, { useEffect, Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  BreadCrumb, Box, Card, Grid, SectionHeader, IconButton, useToast
} from 'ui-library'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { IOrganizationRoleFormActions, IOrganizationRoleData, IOrganizationRoleFormParams } from './OrganizationRoleForm.model'
import FormField from '../../../../../utils/components/Form/FormField'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../../utils/api.interfaces'
import { generateOrganizationFormData, useGoogleAnalytics, useBreadCrumbs } from './OrganizationRoleForm.utils'
import { SectionHeaderContainer, OrganizationRoleFormWrapper } from './OrganizationRoleForm.style'
import useClientProperties from '../../../../common/ClientProperties/useClientProperties'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../../utils/components/FormLoader'
import withReact from '../../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../../utils/core'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const OrganizationRoleForm = () => {

  /** General Hooks */

  const toast = useToast()
  const params = useParams<IOrganizationRoleFormParams>();
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.settings.organizationRole},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false
  })
  const history = useHistory();
  const { handleSubmit, reset, unregister } = formInstance
  const { gaOnSubmit, gaOnCancel } = useGoogleAnalytics()
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadCrumbs(formInstance)

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOrganizationRoleFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const structure = useTypedSelector(state => state.settings.organizationRole.form.structure)
  const isEditMode = useTypedSelector(state => state.settings.organizationRole.form.isEditMode)
  const isStructureLoading = useTypedSelector(state => state.settings.organizationRole.form.loading)
  const resetData = useTypedSelector(state => state.settings.organizationRole.form.resetData)
  const organizationRoleData = useTypedSelector(state => state.settings.organizationRole.form.organizationRoleData)
  const sectionKeys = Object.keys(structure)

  /** Internal State */
  const [isOrganizationRoleDataLoading, setIsOrganizationRoleDataLoading] = useState<boolean>(false)
  const isLoading = React.useMemo(() => isStructureLoading || isOrganizationRoleDataLoading, [isStructureLoading, isOrganizationRoleDataLoading])
  const loaderRef = React.useRef<HTMLDivElement | null>(null)

  dispatch({type:'@@organizationRoleForm/SET_FORM_DIRTY_FLAG',payload:formInstance.formState.isDirty})

  /** Utils */
  const fetchOrganizationRoleData = async (orgRoleId: string | number) => {

    dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: true })
    setIsOrganizationRoleDataLoading(true)
    await fetchname(orgRoleId)

    try {

      const { data: { data, status } } = await axios.get<ILogiAPIResponse<IOrganizationRoleData>>(`${apiMappings.organizationRole.form.getRoleData}?orgRoleId=${orgRoleId}`)

      if (status === 200) {
        dispatch({ type: '@@organizationRoleForm/SET_ORGANIZATION_ROLE_DATA', payload: data })
        const _resetData = {
          ...resetData,
          ...generateOrganizationFormData(data)

        }
        reset({ ..._resetData })
        dispatch({ type: '@@organizationRoleForm/SET_FORM_RESET_DATA', payload: _resetData })
        dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: false })
        setIsOrganizationRoleDataLoading(false)
      }
    }
    catch (error) {
      dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: false })
      setIsOrganizationRoleDataLoading(false)
      toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }
  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: '@@organizationRoleForm/FETCH_STRUCTURE' })
    }

    if (clientProperties?.TIMEZONE && !organizationRoleData) {

      if (params.orgRoleId) {
        dispatch({ type: '@@organizationRoleForm/SET_EDIT_MODE', payload: true })
        fetchOrganizationRoleData(params.orgRoleId)
      } else {
        reset({ ...resetData })
      }
    }
  }, [clientProperties])

  const fetchname = async (orgRoleId: string | number) => {

    try {

      const data = await axios.post(`${apiMappings.organizationRole.form.accessProfileIds}?orgRoleId=${orgRoleId}`)

      dispatch({ type: '@@organizationRoleForm/SET_ACCESSPROFILE_DATA', payload: data.data.results })
    }
    catch (errorMessage) {
      const message = errorMessage?.response?.data?.message;
      toast.add(message || dynamicLabels.somethingWentWrong, 'warning', false);
    }
  }

  /** Callbacks */
  const onSubmit = async (data: any) => {
    gaOnSubmit()
    if (!formInstance.formState.isDirty) {
      history.push({ pathname: '/' })
      return
    }
    const {

      accessProfileIds,

      orgRoleLandingPage,

      persona,

      isSSOMandatoryFl

    } = data

    const payload = {
      ...data,

      accessProfileIds: accessProfileIds?.map((l: any) => l?.accessProfileId),

      orgRoleLandingPage: orgRoleLandingPage?.clientRefMasterCd,

      isSSOMandatoryFl: (isSSOMandatoryFl === 'Y') ? true : false,

      persona: persona?.clientRefMasterCd || organizationRoleData?.persona,

      orgRoleLandingPageId: orgRoleLandingPage?.clientRefMasterId

    }

    dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: true })
    try {

      const { data: response } = await axios[isEditMode ? 'put' : 'post'](apiMappings.organizationRole.form[isEditMode ? 'update' : 'create'], payload, {
        headers: {
          'Content-Type': 'application/json'

        },

      })

      if (response.status === 200) {
        dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: false })

        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
        history.push({ pathname: '/' })
      }
      else if (response.status === 400) {

        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: response.message,
            icon: 'check-round'
          }
        })
        history.push({ pathname: '/' })
      }
    } catch (error) {
      dispatch({ type: '@@organizationRoleForm/SET_LOADING', payload: false })
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

      dispatch({ type: '@@organizationRoleForm/RESET_INITIAL_STATE' })
    }
  }, [])


  return (
    <OrganizationRoleFormWrapper >
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
                    <SectionHeader headerTitle={dynamicLabels?.[sectionName] || sectionName} />
                  </SectionHeaderContainer>}
                <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                  {Object.keys(structure[sectionName]).map(fieldName => {
                    const meta = structure[sectionName][fieldName]
                    meta.multipleFiles = false
                    const { permission,
                    } = meta

                    if (!permission) {
                      return undefined
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
            <IconButton id={`organizationRoles--actionBar--${isEditMode ? dynamicLabels.update : dynamicLabels.save}`} iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{isEditMode ? dynamicLabels.update : dynamicLabels.save}</IconButton>
            <IconButton id='organizationRoles--actionBar--Cancel' iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={() => {
              gaOnCancel(formInstance)
              handleBreadCrumbClick('OrganizationRoles')
            }}>{dynamicLabels.cancel}</IconButton>
          </Box>
        </Card>
      </Box>
    </OrganizationRoleFormWrapper >
  )
}
export default withReact(OrganizationRoleForm)