import React, { Dispatch } from 'react'
import { insertMention, generateEditorStateFromJSONString, Tooltip, IconButton, Grid, MultiSelect, TextInput, RichTextEditor, Box, convertHTMLToDraftState } from 'ui-library'
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

const IVRConfiguration = () => {
  const toOptions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.IVR?.to)
  const toSelected = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.IVR?.toSelected)
  const isOtherVisible = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.IVR?.isOtherVisible)
  const otherData = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.IVR?.other)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const { register, errors } = useFormContext()

  const messageDataAPIResponse = useTypedSelector(state => state.settings.alertProfilesMaster.settings.messagesDataResponse)
  const ivrRTE = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState.ivrMessage)
  const mentions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.mentions)
  const readOnly = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const [isTestIVRModalOpen, setIsTestIVRModalOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (messageDataAPIResponse?.alertMessageMap?.ivr?.message?.value && mentions.suggestionsfromAPI.length) {
      const ivrDraftJsonString = messageDataAPIResponse?.alertMessageMap?.ivr?.message?.draftJsJson
      const initialState = ivrDraftJsonString ?
        generateEditorStateFromJSONString(ivrDraftJsonString)
        :
        convertHTMLToDraftState(messageDataAPIResponse?.alertMessageMap?.ivr?.message.value, mentions.suggestionsfromAPI)

      dispatch({
        type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
          key: 'ivrMessage',
          state: initialState
        }
      })
    }
  }, [messageDataAPIResponse, mentions])

  const handleToSelectionChange = React.useCallback((_, value: string | undefined, isSelected: boolean = false) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE', payload: {
        key: 'IVR',
        value: Number(value || '0'),
        isSelected
      }
    })
  }, [])

  const handleOtherDataChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD', payload: {
        key: 'IVR',
        value: e.target.value
      }
    })
  }, [])

  return <Box id='ivr-configuration-container'>
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
              id='ivr-to-selected-count'
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
          id='ivr-other-contact'
          label='Other Contact'
          placeholder='Other Contact'
          name='IVR.otherContact'
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
          errorMessage={errors?.IVR?.otherContact?.message}
          error={errors?.IVR?.otherContact}
        />}
      </Grid>
    </Grid>

    <Box mb='10px'>
      <AttachDynamicTags onSelect={(label : string , value :string = '') => {
        dispatch({
          type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
            key: 'ivrMessage',
            state: insertMention(ivrRTE, { text: label, value: value }, false),
            setUpdated: true
          }
        })
      }}
        show={mentions.suggestionsfromAPI.length > 0 ? undefined : false}
      >
        <RichTextEditor label='IVR Message' toolbarHidden placeholder='IVR Message'
          editorState={ivrRTE}
          onEditorStateChange={(state) =>
            dispatch({
              type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_RTE_STATE', payload: {
                key: 'ivrMessage', state, setUpdated: true
              }
            })}
          mention={mentions.mentionProp}
          readOnly={readOnly}
        />
      </AttachDynamicTags>
      <InputFieldHelpText>Type '@' to enter <Box color='primary.main' display='inline-block'>@Dynamic Tags</Box> in messages.</InputFieldHelpText>
    </Box>
    <Tooltip hover message={dynamicLabels.clickToSendTestIVR} messagePlacement='start'>
      <IconButton iconVariant='mobile' intent='table' onClick={() => setIsTestIVRModalOpen(true)}>{dynamicLabels.testIVR}</IconButton>
    </Tooltip>
    <TestMobile isOpen={isTestIVRModalOpen} type='IVR' onClose={() => setIsTestIVRModalOpen(false)}
      // message={messageDataAPIResponse?.alertMessageMap?.ivr?.message?.value || ''} 
      message={draftToHtml(
        convertToRaw(ivrRTE.getCurrentContent()), undefined, false,
        (entity, _text) =>
          `<${mentions.suggestionsValueMap[entity?.data?.value]}>`
      ) || ''}
    />
  </Box>
}

export default IVRConfiguration