import React from 'react'
import { Position, Loader, Modal, ModalHeader, Box, IconButton, TextInput, DropDown, useToast } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useForm, Controller } from 'react-hook-form'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { profileTypeToAPIMapping, IAlertProfilesLookupResponse } from '../AlertProfilesMaster.models'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'

interface IAddAlertProfileProps {
  isOpen: boolean
  cloneFrom?: number
  onClose: () => void
  onSave: (profileData?: { alertName: string, alertDescription: string, profileId: number, cloneProfileId: number }) => void
  alertProfileList :any
}

interface IAddFormData {
  alertName: string
  alertDescription: string
  cloneFrom: number | string 
}

const AddAlertProfile = ({ isOpen, cloneFrom, onClose, onSave,alertProfileList }: IAddAlertProfileProps) => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)
  const formInstance = useForm<IAddFormData>({
    mode: 'all', shouldUnregister: false
  })
  const toast = useToast()
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  const [cloneFromOptions, setCloneFromOptions] = React.useState<{ label: string, value: number }[]>([])
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (cloneFrom) {
      formInstance.setValue('cloneFrom', cloneFrom + '')
    }

    fetchCloneFromOptions()
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      formInstance.reset({ alertName: '', alertDescription: '', cloneFrom: undefined })
      fetchCloneFromOptions()
    }
  }, [isOpen])

  const fetchCloneFromOptions = async () => {
    try {
      const { data: response } = await axios.get<ILogiAPIResponse<IAlertProfilesLookupResponse[]>>(apiMappings.settings.alertProfiles.lookups.alertProfiles, {
        params: {
          type: profileTypeToAPIMapping[profileType]
        }
      })

      if (response.hasError) {
        throw response
      }

      setCloneFromOptions(response.data.map(({ profileName, profileId }) => ({ label: profileName, value: profileId })))
      if (response.data.length === 1) {
        formInstance.setValue('cloneFrom', response.data[0].profileId)
      }
    } catch (errorResponse) {
      console.log(errorResponse, errorResponse.response)
    }
  }
  const alertProfile = alertProfileList.find((alertProfile)=>alertProfile?.profileId == cloneFrom)
  const onSubmit = async (data: IAddFormData) => {
    // console.log(data)
    setIsFormLoading(true)
    try {
      const { data: response } = await axios.post(apiMappings.settings.alertProfiles.createProfile, {
        profileName: data.alertName,
        description: data.alertDescription,
        type: profileTypeToAPIMapping[profileType],
        cloneAlertProfileId: cloneFrom || data.cloneFrom,
        isGroupOrderAlert : alertProfile?.isGroupOrderAlert
      })

      if (response.hasError) {
        throw response
      }

      onClose()
      toast.add(response.message, 'check-round', false)
      onSave({ profileId: response.data, alertName: data.alertName, alertDescription: data.alertDescription, cloneProfileId: 1 })
    } catch (errorResponse) {
      toast.add(errorResponse?.response?.data?.message || errorResponse?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    } finally {
      setIsFormLoading(false)
    }
  }

  return <Modal open={isOpen} onToggle={() => { }} size='md'>
    {{
      header: <ModalHeader
        headerTitle={cloneFrom ? `${dynamicLabels.clone} ${currentStep.stepNameLabel}` : `${dynamicLabels.add} ${currentStep.stepNameLabel}`}
        imageVariant='icomoon-close'
        handleClose={onClose}
      />,

      content: (
        <Position type='relative'>
          {isFormLoading && <Loader center fadeBackground />}
          <TextInput
            id={`${profileType}-alertName`}
            name='alertName'
            ref={formInstance.register({ required: true })}
            required
            error={!!formInstance.errors.alertName}
            errorMessage={dynamicLabels.alertProfileNameMandatory}
            label={dynamicLabels.alertProfileName}
            placeholder={dynamicLabels.alertProfileName}
            fullWidth
          />

          <TextInput
            id={`${profileType}-alertDescription`}
            name='alertDescription'
            ref={formInstance.register({ required: false })}
            // error={!!formInstance.errors.alertDescription}
            // errorMessage={'Alert Description is Required'}
            label={dynamicLabels.alertProfileDescription}
            placeholder={dynamicLabels.alertProfileDescription}
            fullWidth
          />

          {!cloneFrom && <Controller
            name={'cloneFrom'}
            control={formInstance.control}
            // defaultValue={''}
            rules={{ required: true }}
            render={props => {
              return <DropDown
                required
                placeholder={dynamicLabels.cloneFromAlertProfile}
                label={dynamicLabels.cloneFromAlertProfile}
                variant='form-select'
                onChange={(value: string) => {
                  props.onChange(value)
                }}
                optionList={cloneFromOptions}
                value={props?.value}
                error={formInstance.errors.cloneFrom}
                errorMessage={dynamicLabels.cloneFromAlertProfileMandatory}
              />
            }}
          />}
        </Position>),

      footer: (
        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
          <IconButton id='add_alert_profile--actionbar--save' iconVariant='icomoon-save' primary disabled={isFormLoading} onClick={formInstance.handleSubmit(onSubmit)}>{dynamicLabels.save}</IconButton>
          <IconButton id='add_alert_profile--actionbar--cancel' iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
            {dynamicLabels.cancel}
          </IconButton>
        </Box>
      )
    }}
  </Modal>
}

export default AddAlertProfile