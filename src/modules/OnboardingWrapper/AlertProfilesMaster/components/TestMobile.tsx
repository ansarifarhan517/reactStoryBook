import React, { Dispatch } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useToast, Loader, TextInput, DropDown, Grid, Modal, ModalFooter, ModalHeader, IconButton, Box } from 'ui-library'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { REGEXPS } from '../../../../utils/constants'
import { sendGA } from '../../../../utils/ga'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { IAlertProfileMasterRouteParams, IAlertSettingsRoutePayload } from '../AlertProfilesMaster.models'
import { stripParagraphTags } from '../utils/constants'

export interface IAlertSettingsTestModalProps {
  isOpen: boolean
  onClose?: () => void
  type: 'SMS' | 'IVR' | 'WHATSAPP'
  message?: string
  payload?: Record <string,string>
}

interface ITestMobileForm {
  country: string
  phoneNumber: string
}
const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')
const baseCountryCode = userAccessInfo.countryCode
const TestMobile = ({ isOpen, type, message,payload, onClose = () => { } }: IAlertSettingsTestModalProps) => {
  const location = useLocation<IAlertSettingsRoutePayload>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const countryLookup = useTypedSelector(state => state.settings.alertProfilesMaster.countryLookup)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const params = useParams<IAlertProfileMasterRouteParams>()
  const { register, errors, control, handleSubmit } = useForm<ITestMobileForm>({ shouldUnregister: false, mode: 'onTouched' })
  const toast = useToast()
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleTestMobile = async (data: ITestMobileForm) => {
    // console.log(data)
    setLoading(true)
    const messageTransformed = message && stripParagraphTags(message)

    sendGA('Settings > Alert Profiles Master', `Button Click ${location.state.alertName} - Send Test ${type === 'SMS' ? 'SMS' : type === 'IVR' ? 'IVR Call' : 'WhatsApp'}`);

    try {
      const url = apiMappings.settings.alertProfiles.previewMobile + (type === 'WHATSAPP' ? '/whatsApp' : '');
      const { data: response } = await axios.post<ILogiAPIResponse<{ isAlertSent: boolean }>>(url, 
        type !== 'WHATSAPP' 
          ? { message: messageTransformed }
          : {...payload},
        { 
          params: {
            ...(type !== 'WHATSAPP' && { alertMasterId: params.alertMasterId, type }),
            countryCode: data?.country,
            phoneNumber: data?.phoneNumber
          }
        }
      );

      if (response.data.isAlertSent) {
        toast.add(response.message, 'check-round', false)
        onClose()
        return
      }
      throw response
    } catch (errorResponse) {
      console.log(errorResponse, errorResponse.response)
      toast.add(errorResponse?.message || errorResponse.response.message || dynamicLabels.somethingWendWrong, 'warning', false)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!countryLookup.length) {
      dispatch({ type: '@@ALERT_PROFILES_MASTER/FETCH_COUNTRY_LOOKUP' })
    }
  }, [])

  return <Modal open={isOpen} onToggle={() => { }} width='600px'
    children={{
      header: (
        <ModalHeader
          headerTitle={type === 'SMS' ? dynamicLabels.testSMS : type === 'IVR' ? dynamicLabels.testIVR : 'WhatsApp'}
          handleClose={onClose}
          imageVariant='icomoon-close'
          headerStyle={{ fontSize: '15px' }}
        />
      ),
      content: (
        <Box style={{ fontSize: '14px', position: 'relative' }}>
          {loading && <Loader center fadeBackground />}
          <Grid container spacing='15px'>
            <Grid item xs={12} sm={6}>
              <Controller
                name='country'
                control={control}
                defaultValue={baseCountryCode}
                rules={{ required: true }}
                render={({ onChange, value }) => {
                  return <DropDown
                    variant='form-select'
                    label={dynamicLabels.Country}
                    placeholder={dynamicLabels.Country}
                    optionList={countryLookup}
                    onChange={onChange}
                    error={errors?.country}
                    errorMessage={dynamicLabels.Country_MANDATORY}
                    value={value}

                  />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label={dynamicLabels.phoneNumber}
                placeholder={dynamicLabels.phoneNumber}
                name='phoneNumber'
                fullWidth
                error={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber?.message}
                ref={register({
                  required: {
                    message: dynamicLabels.phoneNumberIsMandatory,
                    value: true
                  },
                  pattern: {
                    value: REGEXPS.phone,
                    message: dynamicLabels.phoneNumberIsInvalid
                  }
                })}
              />
            </Grid>
          </Grid>
        </Box>
      ),
      footer: (
        <ModalFooter>
          <IconButton iconVariant='mobile' primary disabled={loading} onClick={handleSubmit(handleTestMobile)}>Send {type === 'SMS' ? dynamicLabels.sms_s : type === 'IVR' ? dynamicLabels.ivrMessage : 'WhatsApp'}</IconButton>
          <IconButton iconVariant='icomoon-close' iconSize={11} onClick={onClose}>{dynamicLabels.cancel}</IconButton>
        </ModalFooter>
      )
    }}
  />
}

export default TestMobile