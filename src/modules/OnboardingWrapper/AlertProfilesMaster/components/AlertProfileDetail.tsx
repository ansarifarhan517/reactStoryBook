import React, { Dispatch } from 'react'
import { IAlertProfileDetails } from '../AlertProfilesMaster.models'
import { Box, IconButton, Tooltip } from 'ui-library'
import { ProfileDetailsCard } from '../styles'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { tGlobalPopupAction } from '../../../common/GlobalPopup/GlobalPopup.reducer'
import AttachToAlertProfile from './AttachToAlertProfile'
import { sendGA } from '../../../../utils/ga'
import { isShipper } from '../utils/constants'
interface IAlertProfileDetailProps {
  data: IAlertProfileDetails
  onEditClick?: (data: IAlertProfileDetails) => void
  onCloneClick?: (data: IAlertProfileDetails) => void
  onDeleteClick?: (data: IAlertProfileDetails) => void
  onToggleFavourite?: (data: IAlertProfileDetails) => void
}

const defaultCallback = () => { }

export const AlertProfileDetail = ({
  data,
  onEditClick = defaultCallback,
  onCloneClick = defaultCallback,
  onDeleteClick = defaultCallback,
  onToggleFavourite = defaultCallback
}: IAlertProfileDetailProps) => {

  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)

  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const handleEditClick = React.useCallback(() => {
    dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_READONLY_MODE', payload: isShipper || !data.isEditable })
    onEditClick(data)
  }, [data])


  const handleFavouriteClick = React.useCallback(() => {
    sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Mark As Favourite`)

    if (data.isFavouriteFl) {
      return
    }

    const handleClose = () => {
      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
    }
    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS', payload: {
        isOpen: true,
        onClose: handleClose,
        title: dynamicLabels.confirmation,
        content: <div>{`${dynamicLabels.areYouSureMarkFavouriteAlertProfiles}: ${data.profileName} ?`}</div>,
        footer: <>
          <IconButton id='AlertProfile-Mark-as-favourite-Ok' iconVariant='icomoon-tick-circled' primary onClick={() => {
            handleClose()
            onToggleFavourite(data)
          }}>{dynamicLabels.ok}</IconButton>
          <IconButton id='AlertProfile-Mark-as-favourite-Cancel' iconVariant='icomoon-close' onClick={handleClose}>{dynamicLabels.cancel}</IconButton>
        </>
      }
    })
  }, [globalPopupDispatch, data])

  const deleteButtonTooltipMessage = React.useMemo(() => {
    return data.isFavouriteFl ? dynamicLabels.cannotDeleteFavouriteAlertProfile : data.isEditable ? `${dynamicLabels.Delete} ${dynamicLabels.alertProfile_s}.` : dynamicLabels.cannotDeleteAlertProfile
  }, [data.isFavouriteFl, dynamicLabels.cannotDeleteAlertProfile, data.isEditable, dynamicLabels.Delete, dynamicLabels.alertProfile_s, dynamicLabels.cannotDeleteAlertProfile])

  return <Box display='flex' alignItems='center'>
    {profileType !== 'BRANCH' && !isShipper && <Box mr='10px'>

      <Tooltip message={data.isFavouriteFl && dynamicLabels.alertProfileAlreadyFavourite} hover hide={!data.isFavouriteFl} tooltipDirection='bottom' messagePlacement='start'>
        <IconButton onlyIcon
          iconVariant={data.isFavouriteFl ? 'star-filled' : 'star-empty'}
          color={data.isFavouriteFl ? 'primary.main' : 'grey.A1000'}
          hoverFeedback={!data.isFavouriteFl}
          onClick={handleFavouriteClick}
        />
      </Tooltip>
    </Box>}
    <Box flexGrow={1}>
      <ProfileDetailsCard>
        <Box flexGrow={1} display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start'>
          <div className='header'>{data.profileName}</div>
          {data.description && <div className='description'>{data.description}</div>}
        </Box>
        <Box className='profile-actions-container' display='flex' horizontalSpacing='10px'>

          {!isShipper && <div className='profile-actions'>
            <AttachToAlertProfile data={data} />
          </div>}

          <Tooltip message={data.isEditable ? `${dynamicLabels.edit} ${dynamicLabels.alertProfile_s}.` : dynamicLabels.cannotEditAlertProfile} hover tooltipDirection='bottom'>
            <IconButton id={`alert_profiles--actionbar--${data.profileId}_edit`} className='profile-actions' onlyIcon iconVariant='icomoon-edit-empty' style={{ color: '#666' }}
              disabled={!data.isEditable}
              onClick={handleEditClick}
            />
          </Tooltip>
          {!isShipper && <Tooltip message={`${dynamicLabels.clone} ${dynamicLabels.alertProfile_s}.`} hover tooltipDirection='bottom'>
            <IconButton id={`alert_profiles--actionbar--${data.profileId}_clone`} className='profile-actions' onlyIcon iconVariant='copy-empty' style={{ color: '#666' }}
              onClick={() => onCloneClick(data)}
            />
          </Tooltip>}
          {!isShipper && <Tooltip
            message={deleteButtonTooltipMessage}
            hover tooltipDirection='bottom' messagePlacement='end'>
            <IconButton id={`alert_profiles--actionbar--${data.profileId}_delete`} className='profile-actions' onlyIcon iconVariant='icomoon-delete-empty' style={{ color: '#666' }}
              disabled={!data.isEditable || data.isFavouriteFl}
              onClick={() => onDeleteClick(data)}
            />
          </Tooltip>}
        </Box>
      </ProfileDetailsCard>
    </Box>
  </Box>
}