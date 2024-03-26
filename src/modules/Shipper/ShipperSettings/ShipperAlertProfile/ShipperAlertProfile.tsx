import React, { useEffect, Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid, SectionHeader, IconButton, Card, DropDown, withPopup} from 'ui-library'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { IShipperAlertProfileFormActions, IShipperOptionsList } from './ShipperAlertProfile.model'
import { IShipperCommonFormActions } from '../../ShipperCommon/ShipperCommon.model'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { SectionHeaderContainer, FormWrapper } from '../../../../utils/components/Form/Form.styles'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
import FormLoader from '../../../../utils/components/FormLoader'
import withReact from '../../../../utils/components/withReact'
import { getBaseCurrency } from '../../../../utils/core'
import styled from 'styled-components'
import { sendGA } from '../../../../utils/ga';
import { withThemeProvider } from '../../../../utils/theme'
import withRedux from '../../../../utils/redux/withRedux'
const currencySymbol = 'cur_symbol_' + getBaseCurrency()

const ShipperAlertProfile = () => {
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.shipper},${currencySymbol}`)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues: {}
  })
  console.log(formInstance.formState.isDirty)
  const { handleSubmit, reset, unregister, setValue} = formInstance

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IShipperAlertProfileFormActions>>()
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const commonDispatch = useDispatch<Dispatch<IShipperCommonFormActions>>()
  const structure = useTypedSelector(state => state.shipper.alertProfile.structure)
  const isStructureLoading = useTypedSelector(state => state.shipper.alertProfile.loading)
  const alertProfiles = useTypedSelector(state => state.shipper.alertProfile.alertProfileData)
  const resetData = useTypedSelector(state => state.shipper.alertProfile.resetData)
  const onBoardingData = useTypedSelector(state => state.shipper.onBoardingStructure.onBoardingData.data)
  const sectionKeys = Object.keys(structure)
  const [isShipperDataLoading, setIsShipperDataLoading] = useState<boolean>(false)
  const [fieldError, setError] = useState<boolean>(false)
  const isLoading = (isStructureLoading || isShipperDataLoading)
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const [optionsList, setOptionsList]= useState<IShipperOptionsList[]>([]);
  const [alertValue, setAlertValue]= useState<IShipperOptionsList>();

  const SubHeader = styled.div`
    color: #545454;
    padding-left: 5px;
    margin-top: 11px;
    line-height: 20px;
    letter-spacing: 0.6px;
    font-size: 13px;
  `


  const setSelectedAlertProfile = async () => {
    setIsShipperDataLoading(true)
    const answerData = onBoardingData ? JSON.parse(onBoardingData.configurationSteps[0].subSteps[0].answerData) : '';
    const subClientId = answerData.subClientId;

    let dataRes = {}
    var optionsData:IShipperOptionsList[]=[]
    alertProfiles?.map((profile: any) => {
      optionsData.push({ label: profile.profileName, value: profile.profileId })
      if (profile.linkedIds?.includes(subClientId)) {
         dataRes['ALERTPROFILE'] = { id: profile.profileId, name: profile.profileName }
         setAlertValue(profile.profileId)
      }
      return dataRes
    }, dataRes)
    setOptionsList(optionsData)
    const _resetData = {
      ...resetData, ...dataRes,
    }
    reset({ ...dataRes })
    dispatch({ type: '@@shipperAlertProfileForm/SET_FORM_RESET_DATA', payload: _resetData })
    setIsShipperDataLoading(false)
  }

  const onSubmit = async (data: any) => {
    sendGA('Event New',  'shipperSettings - shipper properties save');
    const subClientId = JSON.parse(onBoardingData?.configurationSteps[0]?.subSteps[0]?.answerData)?.subClientId;
    const payload = {
      profileId: data.ALERTPROFILE.profileId || data.ALERTPROFILE.id,
      type: 'SHIPPER',
      linkedIds: [subClientId]
    }
    try {
      const { data: response } = await axios['put'](apiMappings.shipper.alertProfile['update'], payload, {
        headers: {
          'Content-Type': 'application/json'
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
      else{
        toastDispatch({
          type: '@@globalToast/add', payload: {
            message: dynamicLabels['alertProfileAlreadyMapped'] || "Alert Profile is already mapped to Shipper",
            icon: 'warning'
          }
        })
      }
    } catch (error) {
      if (error?.response?.data?.status === 428) {
        return
      }
    
    }
  }

  /** Watchers */
  useEffect(() => {
    if (!sectionKeys.length) {
      dispatch({ type: '@@shipperAlertProfileForm/FETCH_STRUCTURE' })
    }
  }, [!sectionKeys.length])


  useEffect(() => {
    if (!onBoardingData) {
      commonDispatch({ type: '@@shipperOnboarding/FETCH_STRUCTURE' })
    }
    else {
      if (!alertProfiles?.length) {
        dispatch({ type: '@@shipperAlertProfileForm/FETCH_ALERT_PROFILES' })
      }
      else {
        setSelectedAlertProfile()
      }
    }
  }, [onBoardingData, alertProfiles])


  useEffect(() => {
    return () => {
      sectionKeys.forEach((key) => {
        Object.keys(structure[key]).forEach((fieldName) => {
          unregister(fieldName)
        })
      })
      dispatch({ type: '@@shipperAlertProfileForm/RESET_INITIAL_STATE' })
    }
  }, [])

  return (
    <FormWrapper style={{ marginTop: '0px' }}>
      <div id='toast-inject-here'></div>
      <div className="text-initial">
        {isLoading && <div ref={loaderRef}><FormLoader /></div>}
        <div style={isLoading ? { display: 'none' } : {}}>
          {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
            <div key={sectionName}>
              {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
                <SectionHeaderContainer>
                  <SectionHeader headerTitle={dynamicLabels['ALERT_PROFILES_SHIPPER_s'] ? dynamicLabels['ALERT_PROFILES_SHIPPER_s'] : 'Shipper Alert Profile'} />
                  <SubHeader className="text-initial">{dynamicLabels['shipperAlertProfileNote']} </SubHeader>
                </SectionHeaderContainer>}
              <Card>
                <Grid container spacing='10px' style={{ marginBottom: '15px', paddingTop: '24px' }}>
                  <Grid item md={4} xs={12} sm={4} className='grid-item'>
                    <Grid container spacing='10px'>
                      {Object.keys(structure[sectionName]).map(fieldName => {
                        const meta = structure[sectionName][fieldName];
                        return (
                          <Grid item key={fieldName} xs={12} sm={12} md={12} className='grid-item'>
                               <DropDown
                                error={fieldError}
                                errorMessage={"Select Alert Profile"}
                                variant='form-select'
                                id='alertlist'
                                optionList={optionsList}
                                placeholder={meta.label}
                                label={meta.label}
                                onChange={(value: any) => {
                                 value?( setValue('ALERTPROFILE', { id:value }), setError(false)) : setError(true);
                                    setAlertValue(value)
                                }}
                                value={alertValue}
                                 />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Grid>
                <Box horizontalSpacing='15px' display='flex' mt='30px'>
                  <IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading || fieldError} onClick={()=> handleSubmit(onSubmit)()} primary>{dynamicLabels.save}</IconButton>
                  <IconButton iconVariant='icomoon-close' style={{ padding: '0px 15px' }} 
                  onClick={() => {
                    sendGA('Event New',  'shipperSettings - shipper properties cancel');
                    hybridRouteTo('shipper')}}
                  >{dynamicLabels.cancel}</IconButton>
                </Box>
              </Card>
            </div>
          )}
        </div>
      </div>
    </FormWrapper>
  )
}

export default withThemeProvider(withRedux(withPopup(ShipperAlertProfile)), false)