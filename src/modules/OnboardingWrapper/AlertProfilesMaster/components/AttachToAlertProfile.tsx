import React, { Dispatch } from 'react'
import { Loader, Position, Box, InlinePopup, IconButton, DropDown, useToast, Tooltip } from 'ui-library'
import { IAlertProfileDetails, profileTypeToAPIMapping } from '../AlertProfilesMaster.models'
import ChipsContainer from '../../../../utils/components/Chips/ChipsContainer'
import Chip from '../../../../utils/components/Chips/Chip'
import Badge from '../../../../utils/components/Badge'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useDispatch } from 'react-redux'
import { sendGA } from '../../../../utils/ga'

export interface IAttachToAlertProfileProps {
  data: IAlertProfileDetails
}

const AttachToAlertProfile = ({ data }: IAttachToAlertProfileProps) => {
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)
  const shipperLookup = useTypedSelector(state => state.settings.alertProfilesMaster.shipperLookup)
  const shipperLookupMap = useTypedSelector(state => state.settings.alertProfilesMaster.shipperLookupMap)
  const branchLookup = useTypedSelector(state => state.settings.alertProfilesMaster.branchLookup)
  const branchLookupMap = useTypedSelector(state => state.settings.alertProfilesMaster.branchLookupMap)
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  const toast = useToast()
  const [isAddMode, setIsAddMode] = React.useState<boolean>(false)
  const [isFormLoading, setIsFormLoading] = React.useState<boolean>(false)
  const [dropdownValue, setDropdownValue] = React.useState<number | undefined>()

  const shipperDropdownOptions = React.useMemo(() => {
    const alreadyLinked = new Set()

    data.linkedIds?.forEach((linkedId) => {
      alreadyLinked.add(linkedId)
    })

    return shipperLookup.filter((option) => !alreadyLinked.has(option.value))
  }, [shipperLookup, data])

  const branchDropdownOptions = React.useMemo(() => {
    const alreadyLinked = new Set()

    data.linkedIds?.forEach((linkedId) => {
      alreadyLinked.add(linkedId)
    })

    return branchLookup.filter((option) => !alreadyLinked.has(option.value))
  }, [branchLookup, data])

  const linkageInformation = React.useMemo(() => {
    if (!data.linkedIds?.length) {
      return profileType === 'BRANCH' ? dynamicLabels.noBranchAttachedToAlertProfile : dynamicLabels.noShippersAttachedToAlertProfile
    } else {
      return (profileType === 'BRANCH' ? dynamicLabels.xBranchesAttachedToAlertProfile : dynamicLabels.xShippersAttachedToAlertProfile).replace(':1', String(data.linkedIds?.length || 0))
    }
  }, [data, profileType, dynamicLabels.xBranchesAttachedToAlertProfile, dynamicLabels.xShippersAttachedToAlertProfile, dynamicLabels.noBranchAttachedToAlertProfile, dynamicLabels.noShippersAttachedToAlertProfile])

  const popupTitle = React.useMemo(() => {
    return `Attached ${profileType === 'BRANCH' ? dynamicLabels.branch_p : dynamicLabels.shipper_p}`
  }, [dynamicLabels.shipper_p, dynamicLabels.branch_p, profileType])

  const dropdownLabel = React.useMemo(() => {
    return profileType === 'BRANCH' ? dynamicLabels.branch_s : dynamicLabels.shipper_s
  }, [profileType, dynamicLabels.shipper_s, dynamicLabels.branch_s])

  const shouldRender = React.useMemo(() => profileType === 'BRANCH' || profileType === 'SHIPPER', [profileType])

  const handleAddClick = React.useCallback(() => {
    sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Add ${profileType === 'BRANCH' ? 'Branch' : 'Shipper'}`)
    setIsAddMode(true)
  }, [setIsAddMode])

  const handleCancel = React.useCallback(() => {
    setIsAddMode(false)
  }, [setIsAddMode])

  const handleSave = async () => {
    setIsFormLoading(true)
    try {
      const { data: response } = await axios.put<ILogiAPIResponse<boolean>>(apiMappings.settings.alertProfiles.linkAlertProfile, {
        profileId: data.profileId,
        type: profileType,
        linkedIds: [dropdownValue]
      })

      if (!response.hasError && response.status === 200) {

        const { data } = await axios.get<ILogiAPIResponse<IAlertProfileDetails[]>>(apiMappings.settings.alertProfiles.getProfileList, {
          params: {
            type: profileTypeToAPIMapping[profileType]
          }
        })
        dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST', payload: data.data })
        setIsAddMode(false)

      } else {
        throw response
      }
    } catch (errorResponse) {
      console.log(errorResponse)
      toast.add(errorResponse?.message || errorResponse?.response?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    } finally {
      setIsFormLoading(false)
    }

  }

  return shouldRender ? <InlinePopup id='link-popup' title={popupTitle} isOpen={false} width={500} height={300}
    style={{ margin: '5px 0px' }}
    content={
      <Box p='15px' bgColor='white'>
        <Box style={{ color: 'gray', fontSize: 13 }} mb='15px' >{linkageInformation}</Box>
        {(data.linkedIds?.length || 0) > 0 && <ChipsContainer>
          {data.linkedIds?.map((id) => <Box m='5px' display='inline-block'>
            <Chip>
              {profileType === 'BRANCH' ? (branchLookupMap[id]?.name || id) : (shipperLookupMap[id]?.name || id)}
            </Chip>
          </Box>)}
        </ChipsContainer>}

        <Position type='relative'>
          {isFormLoading && <Loader center fadeBackground />}
          {isAddMode && <Box fullWidth mt='15px'>
            <DropDown
              placeholder={dropdownLabel}
              label={dropdownLabel}
              variant='form-select'
              onChange={setDropdownValue}
              optionList={profileType === 'BRANCH' ? branchDropdownOptions : shipperDropdownOptions}
            />
          </Box>}
          <Box mt='15px' display='flex' fullWidth justifyContent='flex-end' horizontalSpacing='10px'>
            {isAddMode ?
              <>
                <IconButton iconVariant='icomoon-save' primary onClick={handleSave} disabled={!dropdownValue}>{dynamicLabels.save}</IconButton>
                <IconButton iconVariant='icomoon-close' onClick={handleCancel}>{dynamicLabels.cancel}</IconButton>
              </>
              : (
                <Tooltip
                  hover
                  message={`Link ${dynamicLabels[profileType === 'BRANCH' ? 'branch_s' : 'shipper_s']}`}
                  tooltipDirection='bottom'
                >
                  <IconButton iconVariant='icomoon-add' onClick={handleAddClick}>{dynamicLabels.add}</IconButton>
                </Tooltip>
              )
            }
          </Box>
        </Position>
      </Box>}
    className=''
  >
    <Tooltip message={linkageInformation} hover>
      <Badge
        onClick={() => {
          sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Link ${profileType === 'BRANCH' ? 'Branch' : 'Shipper'}`)
        }}
      // className={!data.linkedIds?.length ? 'disabled' : ''}
      >{data.linkedIds?.length || 0}</Badge>
    </Tooltip>
  </InlinePopup> : <></>
}

export default AttachToAlertProfile