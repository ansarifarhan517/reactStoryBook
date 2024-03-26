import React, { Dispatch } from 'react'
import { insertMention, generateEditorStateFromJSONString, DropDown, Tooltip, IconButton, Position, Grid, MultiSelect, TextInput, RichTextEditor, Box, convertHTMLToDraftState } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { REGEXPS } from '../../../../utils/constants'
import styled from 'styled-components'
import InputFieldHelpText from '../../../../utils/components/InputFieldHelpText'
import AlertEmailPreview from './AlertEmailPreview'
import { IAlertProfileMasterRouteParams, IAlertSettingsRoutePayload } from '../AlertProfilesMaster.models'
import { useLocation, useParams } from 'react-router-dom'
import AttachDynamicTags from './AttachDynamicTags'
import { sendGA } from '../../../../utils/ga'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
import { stripParagraphTags } from '../utils/constants'

const EmailSubjectContainer = styled.div`
  margin-bottom: 20px;
  .logi-rte-editor {
    min-height: 71px;
    padding-bottom: 0px;
  }
`
const EmailConfiguration = () => {
  const { register, errors } = useFormContext()
  const location = useLocation<IAlertSettingsRoutePayload>()
  const params = useParams<IAlertProfileMasterRouteParams>()
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const toOptions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.EMAIL?.to)
  const toSelected = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.EMAIL?.toSelected)
  const isOtherVisible = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.EMAIL?.isOtherVisible)
  const otherData = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.EMAIL?.other)
  const messageDataAPIResponse = useTypedSelector(state => state.settings.alertProfilesMaster.settings.messagesDataResponse)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const emailSubjectRTE = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState.emailSubject)
  const emailBodyRTE = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState.emailBody)

  const mentions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.mentions)
  const readOnly = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)
  const alertEmailTemplateOptions = useTypedSelector(state => state.settings.alertProfilesMaster.alertTemplateLookup)
  const alertEmailTemplateOptionsMap = useTypedSelector(state => state.settings.alertProfilesMaster.alertTemplateLookupMap)
  const emailTemplateIdParam = useTypedSelector(state => state.settings.alertProfilesMaster.settings.apiResponse.messageParamMap.EMAIL?.paramsMap.EMAILTEMPLATEID)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState<boolean>(false)
  const [templateId, setTemplateId] = React.useState<number>()

  // const [emailTemplateValue, setEmailTemplateValue] = React.useState<number>()

  const subjectHtml = React.useMemo(() => draftToHtml(
    convertToRaw(emailSubjectRTE.getCurrentContent()), undefined, false,
    (entity, _text) =>
      `<${mentions.suggestionsValueMap[entity?.data?.value]}>`
  ) || ''
    , [emailSubjectRTE, mentions.suggestionsValueMap])

  const bodyHtml = React.useMemo(() => draftToHtml(
    convertToRaw(emailBodyRTE.getCurrentContent()), undefined, false,
    (entity, text) => {
      if (entity.data.value != null) {
        if (entity.data.value.startsWith('<')) {
          return text.replace(`@${entity.data.value}`, `<${mentions.suggestionsValueMap[entity?.data?.value]}>`)
        }
      }
    }
  ) || ''
    , [emailBodyRTE, mentions.suggestionsValueMap])

  React.useEffect(() => {
    if (!templateId) {
      if (emailTemplateIdParam?.paramValue) {
        setTemplateId(Number(emailTemplateIdParam?.paramValue))
        return
      }
      const defaultValue = alertEmailTemplateOptions.find(option => alertEmailTemplateOptionsMap[option.value].isDefault === true)?.value
      setTemplateId(defaultValue)
    }
  }, [alertEmailTemplateOptions])

  React.useEffect(() => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/FETCH_ALERT_EMAIL_TEMPLATE_LOOKUP', payload: {
        profileId: Number(params.profileId),
        alertMasterId: Number(params.alertMasterId)
      }
    })

    return () => {
      dispatch({ type: '@@ALERT_PROFILES_MASTER/CLEAR_ALERT_EMAIL_TEMPLATE_LOOKUP' })
    }
  }, [])

  React.useEffect(() => {
    if (messageDataAPIResponse?.alertMessageMap?.email?.subject?.value && messageDataAPIResponse?.alertMessageMap?.email?.body?.value && mentions.suggestionsfromAPI.length) {
      const subjectJsonString = messageDataAPIResponse?.alertMessageMap?.email?.subject?.draftJsJson
      const bodyJsonString = messageDataAPIResponse?.alertMessageMap?.email?.body?.draftJsJson
      const initialSubjectState = subjectJsonString ?
        // JSON.parse(messageDataAPIResponse?.alertMessageMap?.email?.subject?.draftJsJson)
        generateEditorStateFromJSONString(subjectJsonString)
        : convertHTMLToDraftState(messageDataAPIResponse?.alertMessageMap?.email?.subject.value, mentions.suggestionsfromAPI)

      const initialBodyState = bodyJsonString ?
        // JSON.parse(messageDataAPIResponse?.alertMessageMap?.email?.body?.draftJsJson)
        generateEditorStateFromJSONString(bodyJsonString)
        : convertHTMLToDraftState(messageDataAPIResponse?.alertMessageMap?.email?.body.value, mentions.suggestionsfromAPI)

      dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: { key: 'emailSubject', state: initialSubjectState } })
      dispatch({ type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: { key: 'emailBody', state: initialBodyState } })
    }
  }, [messageDataAPIResponse, mentions])

  const handleToSelectionChange = React.useCallback((_, value: string | undefined, isSelected: boolean = false) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE', payload: {
        key: 'EMAIL',
        value: Number(value || '0'),
        isSelected
      }
    })
  }, [])

  const handleOtherDataChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD', payload: {
        key: 'EMAIL',
        value: e.target.value
      }
    })
  }, [])


  return <Box id='email-configuration-container'>
    <Grid container spacing='10px'>
      <Grid item xl={6} md={3}>
        <MultiSelect
          options={toOptions}
          style={{
            position: 'absolute',
            top: 60 + 10,
            left: 0 + 10,
            width: 'calc(100% - 10)'
          }}
          selected={toSelected}
          onChange={handleToSelectionChange}
        >
          {({ openMenu, optionSelected }) => {
            const hoverTitle = React.useMemo(() => {
              return optionSelected.map(option => option.label).join(', ')
            }, [optionSelected])

            return <TextInput
              id='email-to-selected-count'
              label='To'
              placeholder='To'
              fullWidth
              readOnly
              disabled={readOnly}
              title={hoverTitle}
              style={{ cursor: 'pointer' }}
              value={optionSelected.length ? `${optionSelected.length} Selected` :''}
              onClick={() => openMenu(o => !o)}
            />
          }}
        </MultiSelect>
      </Grid>
      {(isOtherVisible) && <Grid item xl={6} md={3}>
        <TextInput
          id='email-other-contact'
          label={dynamicLabels.otherEmail}
          placeholder={dynamicLabels.otherEmail}
          name='EMAIL.otherContact'
          fullWidth
          ref={register({
            pattern: {
              message: dynamicLabels.commaSeparatedEmailAddressValidation,
              value: new RegExp(REGEXPS.commaSeparatedEmail)
            }
          })}
          onChange={handleOtherDataChange}
          disabled={readOnly}
          defaultValue={otherData}
          errorMessage={errors?.EMAIL?.otherContact?.message}
          error={errors?.EMAIL?.otherContact}
        />
      </Grid>}
      <Grid item xl={6} md={3}>
        <DropDown
          placeholder={dynamicLabels.alertEmailTemplate}
          label={dynamicLabels.alertEmailTemplate}
          variant='form-select'
          value={templateId}
          onChange={(value: number) => {
            if (emailTemplateIdParam) {
              dispatch({
                type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/APPEND_SAVE_REQUEST_PAYLOAD', payload: {
                  EMAILTEMPLATEID: { ...emailTemplateIdParam, paramValue: value || '' }
                }
              })
            }
            setTemplateId(value)
          }}
          tooltipMessage={dynamicLabels.chooseTheEmailTemplate}
          optionList={alertEmailTemplateOptions}
        />
      </Grid>
    </Grid>

    <Box mb='10px' >
      <EmailSubjectContainer>
        <AttachDynamicTags
          onSelect={(label : string, value :string) => {
            dispatch({
              type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
                key: 'emailSubject',
                state: insertMention(emailSubjectRTE, { text: label, value: value }, false),
                setUpdated: true
              }
            })
          }}
          show={mentions.suggestionsfromAPI.length > 0 ? undefined : false}>
          <RichTextEditor label='Email Subject' toolbarHidden placeholder='Email Subject'
            editorState={emailSubjectRTE}
            onEditorStateChange={(state) =>
              dispatch({
                type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
                  key: 'emailSubject', state, setUpdated: true
                }
              })}
            mention={
              mentions.mentionProp
            }
            readOnly={readOnly}
          />
        </AttachDynamicTags>
      </EmailSubjectContainer>
      <Position type='relative'>
        <AttachDynamicTags
        onSelect={(label: string, value: string) => {
           dispatch({
             type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
               key: 'emailBody',
               state: insertMention(emailBodyRTE, { text: label, value: value }, false),
               setUpdated: true
             }
           })
         }}
         show={mentions.suggestionsfromAPI.length > 0 ? undefined : false}
        >
          <RichTextEditor label='Email Body' placeholder='Email Body' isStripPastedStyles={false}
            editorState={emailBodyRTE}
            onEditorStateChange={(state) =>
              dispatch({
                type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
                  key: 'emailBody', state, setUpdated: true
                }
              })}
            mention={mentions.mentionProp}
            // onFocus={() => console.log('On Focus Email Body')}
            // onBlur={() => console.log('On Blur Email Body')}
            readOnly={readOnly}
            toolbarHidden={readOnly}
          />
        </AttachDynamicTags>
        <Position type='absolute' right='10px' top='10px'>
          {/* <button>Dynamic Tags</button> */}
        </Position>
      </Position>
      {mentions.suggestionsfromAPI.length > 0 && <InputFieldHelpText>Type '@' to enter <Box color='primary.main' display='inline-block'>@{dynamicLabels.dynamicTags}</Box> in messages.</InputFieldHelpText>}
    </Box>
    <Tooltip hover messagePlacement='start'
      message={templateId === undefined ? dynamicLabels.pleaseSelectAlertEmailTemplate : dynamicLabels.clickToPreviewAlert}
    >
      <IconButton
         id="updateAlertProfile-actionBar-preview-email"
        disabled={templateId === undefined}
        intent='table'
        iconVariant='preview' onClick={() => {
          sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${location.state.alertName} - Preview Email`)
          setIsPreviewModalOpen(true)
        }}>{dynamicLabels.Preview}</IconButton>
    </Tooltip>
    {isPreviewModalOpen && <AlertEmailPreview
      handleClose={() => setIsPreviewModalOpen(false)}
      alertMasterId={Number(params.alertMasterId)}
      templateId={templateId || 0}
      // subject={messageDataAPIResponse.alertMessageMap?.email?.subject?.value || ''}
      // message={messageDataAPIResponse.alertMessageMap?.email?.body?.value || ''} />
      subject={stripParagraphTags(subjectHtml.replace(/\n/g, ''))}  
      message={bodyHtml}
    />}
  </Box>
}

export default EmailConfiguration