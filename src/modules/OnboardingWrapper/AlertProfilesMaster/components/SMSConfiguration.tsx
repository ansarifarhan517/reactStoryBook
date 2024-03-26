import React, { Dispatch } from 'react'
import { FontIcon, insertMention, generateEditorStateFromJSONString, Tooltip, IconButton, Grid, MultiSelect, TextInput, RichTextEditor, Box, convertHTMLToDraftState } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { REGEXPS } from '../../../../utils/constants'
import InputFieldHelpText from '../../../../utils/components/InputFieldHelpText'
import TestMobile from './TestMobile'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import AttachDynamicTags from './AttachDynamicTags'

const SMSConfiguration = () => {
  const toOptions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.SMS?.to)
  const toSelected = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.SMS?.toSelected)
  const isOtherVisible = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.SMS?.isOtherVisible)
  const otherData = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.SMS?.other)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const { register, errors } = useFormContext()

  const messageDataAPIResponse = useTypedSelector(state => state.settings.alertProfilesMaster.settings.messagesDataResponse)
  const smsRTE = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState.smsMessage)
  const mentions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.mentions)
  const readOnly = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const [isTestSMSModalOpen, setIsTestSMSModalOpen] = React.useState<boolean>(false)
  const [charCount, setCharCount] = React.useState<number>(0)

  React.useEffect(() => {
    if (messageDataAPIResponse?.alertMessageMap?.sms?.message?.value && mentions.suggestionsfromAPI.length) {
      const smsDraftJsonString = messageDataAPIResponse?.alertMessageMap?.sms?.message?.draftJsJson
      const initialState = smsDraftJsonString ?
        generateEditorStateFromJSONString(smsDraftJsonString)
        :
        convertHTMLToDraftState(messageDataAPIResponse?.alertMessageMap?.sms?.message.value, mentions.suggestionsfromAPI)

      dispatch({
        type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
          key: 'smsMessage',
          state: initialState
        }
      })
    }
  }, [messageDataAPIResponse, mentions])

  React.useEffect(() => {
    setCharCount(smsRTE.getCurrentContent().getPlainText('\u0001').length)
  }, [smsRTE])

  const handleToSelectionChange = React.useCallback((_, value: string | undefined, isSelected: boolean = false) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE', payload: {
        key: 'SMS',
        value: Number(value || '0'),
        isSelected
      }
    })
  }, [])

  const handleOtherDataChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD', payload: {
        key: 'SMS',
        value: e.target.value
      }
    })
  }, [])

  return <Box id='sms-configuration-container'>
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
              id='sms-to-selected-count'
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
      <Grid item xl={6} md={3}>
        {(isOtherVisible) && <TextInput
          id='sms-other-contact'
          label={dynamicLabels.otherContact}
          placeholder={dynamicLabels.otherContact}
          name='SMS.otherContact'
          fullWidth
          disabled={readOnly}
          ref={register({
            pattern: {
              message: dynamicLabels.commaSeparatedContactValidation,
              value: new RegExp(REGEXPS.commaSeparatedPhone)
            }
          })}
          onChange={handleOtherDataChange}
          defaultValue={otherData}
          errorMessage={errors?.SMS?.otherContact?.message}
          error={errors?.SMS?.otherContact}
        />}
      </Grid>
    </Grid>

    <Box mb='10px'>
      <AttachDynamicTags onSelect={(label : string, value :string = '') => {
        dispatch({
          type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
            key: 'smsMessage',
            state: insertMention(smsRTE, { text: label, value: value }, false),
            setUpdated: true
          }
        })
      }}
        show={mentions.suggestionsfromAPI.length > 0 ? undefined : false}
      >
        <RichTextEditor label='SMS Message' toolbarHidden placeholder='SMS Message'
          editorState={smsRTE}
          onEditorStateChange={(state) => {
            dispatch({
              type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
                key: 'smsMessage', state, setUpdated: true
              }
            })
          }}
          mention={mentions.mentionProp}
          readOnly={readOnly}
          // onFocus={() => setShowCount(true)}
          // onBlur={() => setShowCount(false)}
        />
      </AttachDynamicTags>
      <Box display='flex' justifyContent='space-between' fullWidth>
        <InputFieldHelpText>Type '@' to enter <Box color='primary.main' display='inline-block'>@Dynamic Tags</Box> in messages.</InputFieldHelpText>
        <InputFieldHelpText>
          <span style={{ marginRight: 5 }}>
            <FontIcon variant='chat' style={{ fontSize: 'inherit' }} />
          </span>
          <span>{`${dynamicLabels.sms_s} Count: ${Math.ceil(charCount / 160)} (${charCount} Characters)`}</span>
        </InputFieldHelpText>
      </Box>
    </Box>
    <Tooltip hover message={dynamicLabels.clickToSendTestSMS} messagePlacement='start'>
      <IconButton id="updateAlertProfile-actionBar-testSms" iconVariant='mobile' intent='table' onClick={() => setIsTestSMSModalOpen(true)}>{dynamicLabels.testSMS}</IconButton>
    </Tooltip>
    <TestMobile isOpen={isTestSMSModalOpen} type='SMS' onClose={() => setIsTestSMSModalOpen(false)}
      // message={messageDataAPIResponse?.alertMessageMap?.sms?.message?.value || ''} 
      message={draftToHtml(
        convertToRaw(smsRTE.getCurrentContent()), undefined, false,
        (entity, _text) => {
          if (entity.data.value != null) {
            if (entity.data.value.startsWith('<')) {
              return _text.replace(`@${entity.data.value}`, `<${mentions.suggestionsValueMap[entity?.data?.value]}>`)
          }
        }
      }
      ) || ''}
    />
  </Box>
}

export default SMSConfiguration