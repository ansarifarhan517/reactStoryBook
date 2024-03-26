import React, { useState, Dispatch, useEffect } from 'react'
import { Loader, Toggle, IconButton, Box, BreadCrumb, SectionHeader, Accordion, AccordionContent, AccordionHeaderTitle, AccordionHeaderSubTitle } from 'ui-library'
import { useBreadcrumbsAlertSetting } from '../utils/useBreadcrumbs'
import { fullHeightStyle } from '../utils/constants'
import { StyledCard } from '../styles'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import SMSConfiguration from './SMSConfiguration'
import IVRConfiguration from './IVRConfiguration'
import EmailConfiguration from './EmailConfiguration'
import GeneralConfiguration from './GeneralConfiguration'
import { IAlertSettingsRoutePayload, IAlertProfileMasterRouteParams, tAlertSettingsMessageType } from '../AlertProfilesMaster.models'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useForm, FormProvider } from 'react-hook-form'
import { tGlobalPopupAction } from '../../../common/GlobalPopup/GlobalPopup.reducer'
import moment from 'moment';
import WhatsappNotification from '../../NotificationConfiguration/SubComponent/WhatsappNotification'
import { tOrdertags } from '../../NotificationConfiguration/SubComponent/Notification.model'
export interface IWhatsappState {
  whatsappMessage: string;
  templateName: string;
  templateId: string;
  templateLanguage: string;
  templateDynamicTags : Record<string, string>; 
}

const AccordionToggle = (props: { id: string, highlightWhenChecked: boolean },) => {
  const isActive = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState?.[props.id]?.isActive || false)
  const readOnly = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()

  return <Toggle
    disabled={readOnly}
    checked={isActive}
    highlightWhenChecked={props.highlightWhenChecked}
    onChange={(e) => {
      dispatch({
        type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_ACTIVATION_CHANGE',
        payload: {
          key: props.id as tAlertSettingsMessageType,
          value: e.target.checked
        }
      })
    }}
  />
}
const AlertSettings = () => {

  const location = useLocation<IAlertSettingsRoutePayload>()
  const history = useHistory<IAlertSettingsRoutePayload>()
  const params = useParams<IAlertProfileMasterRouteParams>()
  
  const formInstance = useForm<Record<string, string | number | boolean>>({ mode: 'onTouched', shouldUnregister: true })
  const { breadCrumbOptions, handleBreadCrumbClick } = useBreadcrumbsAlertSetting(formInstance)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const apiGetResponse = useTypedSelector(state => state.settings.alertProfilesMaster.settings.apiResponse)
  const messageStructure = useTypedSelector(state => state.settings.alertProfilesMaster.settings.messageStructure)
  const loadingState = useTypedSelector(state => state.settings.alertProfilesMaster.loading)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const settingsSaveRequestPayload = useTypedSelector(state => state.settings.alertProfilesMaster.settings.saveRequestPayload)
  const rteState = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState)
  const settingsAPIRespons = useTypedSelector(state => state.settings.alertProfilesMaster.settings.apiResponse)
  const messageDataAPIResponse = useTypedSelector(state => state.settings.alertProfilesMaster.settings.messagesDataResponse);
  const mentions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.mentions);
  const [whatsappDetails, setWhatsappDetails] = useState<IWhatsappState>({
    whatsappMessage: '',
    templateName: '',
    templateId: '',
    templateLanguage: '',
    templateDynamicTags: {}
  });
  const [orderTagList, setOrderTagList] = useState<tOrdertags[]| undefined>([]);
  const [isWhatsappTouched, setIsWhatsappTouched]= useState(false)

  useEffect(()=> {
      const outputObject = orderTagList && orderTagList.reduce((acc, obj, index) => {
        if (obj.value !== "") {
          acc[index + 1] = obj.value;
        }
        return acc;
      }, {});
      handleChange('templateDynamicTags',outputObject);
  },[orderTagList])

  useEffect(() => {
    const dynamicTags = messageDataAPIResponse?.alertMessageMap?.whatsapp?.dynamicTag?.dynamicTags || {}
    const data = dynamicTags && Object.entries(dynamicTags).map(([key, value]) => ({ key, value }));
    setOrderTagList(data);
    setWhatsappDetails({
      whatsappMessage: messageDataAPIResponse?.alertMessageMap?.whatsapp?.message?.value || '',
      templateName: messageDataAPIResponse?.alertMessageMap?.whatsapp?.template?.value || '',
      templateId: messageDataAPIResponse?.alertMessageMap?.whatsapp?.templateId?.value || '',
      templateLanguage: messageDataAPIResponse?.alertMessageMap?.whatsapp?.templateLang?.value || '',
      templateDynamicTags: dynamicTags
    });

  }, [messageDataAPIResponse]);

  console.log(formInstance.formState.isDirty); // make sure formState is read before render to enable the Proxy

  const isPageDirty = React.useMemo(() => {
    return Object.keys(settingsSaveRequestPayload).length !== 0 || formInstance.formState.isDirty || Object.keys(rteState).length > 4
  }, [settingsSaveRequestPayload, formInstance.formState.isDirty, rteState])

  const handleChange = (name, value) => {
    setWhatsappDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
};

  const ACCORDION_DATA = React.useMemo(() => [
    { id: 'SMS', isVisible: messageStructure?.smsMessage?.permission, title: dynamicLabels.sms_s, description: dynamicLabels.configureSMS, content: <SMSConfiguration /> },
    { id: 'IVR', isVisible: messageStructure?.ivrMessage?.permission, title: dynamicLabels.ivrMessage, description: dynamicLabels.configureIVR, content: <IVRConfiguration /> },
    { id: 'EMAIL', isVisible: messageStructure?.emailSubject?.permission && messageStructure?.emailBody?.permission, title: dynamicLabels.email, description: dynamicLabels.configureEmail, content: <EmailConfiguration /> },
    {id: 'WHATSAPP', isVisible: true, title: dynamicLabels?.whatsappTitle || "WhatsApp", description: dynamicLabels?.whatsapp_description || "Configure WhatsApp Template", 
      content: <WhatsappNotification {...whatsappDetails} handleChange={handleChange} orderTagList={orderTagList} setOrderTagList={setOrderTagList} optionList={mentions?.optionList} getNotifyTagsArray={mentions?.getTagsArray} dynamicLabels={dynamicLabels} isWhatsappTouched={isWhatsappTouched} setIsWhatsappTouched={setIsWhatsappTouched} fromAlerts/>
    },

  ], [dynamicLabels, messageStructure,whatsappDetails,orderTagList, mentions])

  const [expandedAccordionID, setExpandedAccordionID] = useState<string>(ACCORDION_DATA[0].id)
  const isLoading = React.useMemo(() => {
    const { alertParamsData, messageData, messagesStructure, tags } = loadingState
    return alertParamsData || messageData || messagesStructure || tags
  }, [loadingState])

  React.useEffect(() => {
    if (loadingState.saveAlertSettings === false) {
      // console.log(location.state, params)
      dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_LOADING', payload: { key: 'saveAlertSettings', value: undefined } })
      history.push(`/${params.profileId}`, location.state)
    }
  }, [loadingState.saveAlertSettings])

  React.useEffect(() => {
    const payload = {
      profileId: Number(params.profileId),
      alertMasterId: Number(params.alertMasterId)
    }

    dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/RESET_STATE' })
    dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGE_STRUCTURE' })
    dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_MESSAGES_DATA', payload })
    dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/FETCH_TAGS', payload: { alertMasterId: payload.alertMasterId } })
    dispatch({ type: '@@ALERT_PROFILES_MASTER/FETCH_ALERT_SETTINGS', payload })
  }, [])

  const handleAccordionToggle = React.useCallback((id: string, isExpanded?: boolean) => {
    setExpandedAccordionID(isExpanded ? id : '')
  }, [setExpandedAccordionID])

  const handleCancel = () => {
    const handleClose = () => {
      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
    }

    const handleOk = () => {
      handleClose()
      history.push(`/${params.profileId}`, {
        profileName: location.state.profileName
      })
    }

    if (!isPageDirty) {
      handleOk()
    } else {
      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (<>
            <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleOk}>{dynamicLabels.ok}</IconButton>
            <IconButton iconVariant='icomoon-close' onClick={handleClose}>{dynamicLabels.cancel}</IconButton>
          </>)
        }
      })
    }
  }

  const handleSave = React.useCallback((data: Record<string, string | number | boolean>) => {
    if (!isPageDirty && !isWhatsappTouched) {
      return
    }

    const saveRequestPayload = {}
    Object.keys(data?.generalParamMap || {}).forEach((key) => {
      if(key === 'VEHCILENODRIVEENDTIMEHRS' || key === 'VEHCILENODRIVESTARTTIMEHRS'){
        data.generalParamMap[key] = !data.generalParamMap[key] ? '' : moment(data?.generalParamMap?.[key], 'HH:mm').add(new Date().getTimezoneOffset(), "minute").format('HH:mm:ss')
      }
      if (apiGetResponse.generalParamMap[key]) {
        saveRequestPayload[key] = {
          ...apiGetResponse.generalParamMap[key],
          paramValue: (typeof data.generalParamMap[key] === 'boolean') ? (data.generalParamMap[key] === true ? 'Y' : 'N') : data.generalParamMap[key]
        }
      }
    })

    dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/APPEND_SAVE_REQUEST_PAYLOAD', payload: saveRequestPayload })
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SAVE', payload: {
        alertProfileId: Number(params.profileId || '-1'),
        alertMasterId: Number(params.alertMasterId || '-1'),
        whatsappDetails
      }
    })
  }, [apiGetResponse, params, isPageDirty,isWhatsappTouched,whatsappDetails])

  return <FormProvider {...formInstance}>
    <Box style={fullHeightStyle} display='flex' flexDirection='column' alignItems='stretch'>

      <Box my='20px'>
        <BreadCrumb options={breadCrumbOptions} onClick={handleBreadCrumbClick} />
      </Box>

      <Box flexGrow={1} pb='15px'>
        <StyledCard style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {(isLoading || loadingState.saveAlertSettings) && <Loader center fadeBackground />}
          <Box flexGrow={1} className='content-container'>
            {!isLoading && (<>
              {Object.keys(settingsAPIRespons.generalParamMap).length > 0 && <Box className='general-configuration-container'>
                <SectionHeader headerTitle={dynamicLabels['general details']} />
                <GeneralConfiguration />
              </Box>}

              <Box className='message-configuration-container'>
                <SectionHeader headerTitle={dynamicLabels['message details']} />
                <Box>
                  {ACCORDION_DATA.map((data) => (
                    data.isVisible ? <Accordion key={data.id} id={data.id} expanded={expandedAccordionID === data.id} onToggle={handleAccordionToggle}>
                      {{
                        header: <Box display='flex'>
                          <Box flexGrow={1}>
                            <AccordionHeaderTitle>{data.title}</AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>{data.description}</AccordionHeaderSubTitle>
                          </Box>
                          <AccordionToggle id={data.id} highlightWhenChecked={expandedAccordionID !== data.id} />
                        </Box>,
                        content: <AccordionContent>
                          <Box pb='10px'>
                            {data.content}
                          </Box>
                        </AccordionContent>
                      }}
                    </Accordion> : <></>
                  ))}
                </Box>
              </Box>
            </>)}

          </Box>
          <Box horizontalSpacing='10px' display='flex' justifyContent='flex-start' p='0' pt='15px' fullWidth className='action-container'>
            <IconButton id="updateAlertProfile-actionBar-save" iconVariant='icomoon-save' primary
              // disabled={!formInstance.formState.isDirty && !isPageDirty} 
              onClick={(!formInstance.formState.isDirty && !isPageDirty && !isWhatsappTouched) ? handleCancel : formInstance.handleSubmit(handleSave)}>
              {dynamicLabels.save}
            </IconButton>
            <IconButton id="updateAlertProfile-actionBar-cancel" iconVariant='icomoon-close' iconSize={11} onClick={handleCancel}>
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        </StyledCard>
      </Box>
    </Box>
  </FormProvider >
}

export default AlertSettings