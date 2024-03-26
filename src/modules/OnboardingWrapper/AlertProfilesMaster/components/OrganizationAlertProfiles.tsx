import React, { useEffect, Dispatch } from 'react'
import { Box, useToast, IconButton, FontIcon } from 'ui-library'
import { BorderButton } from '../styles'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { IAlertProfileDetails, profileTypeToAPIMapping } from '../AlertProfilesMaster.models'
import { AlertProfileDetail } from './AlertProfileDetail'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import AddAlertProfile from './AddAlertProfile'
import { Shimmer } from 'react-shimmer'
import { s3BucketMapping } from '../../../../utils/s3Bucket.mapping'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from '../AlertProfilesMaster.actions'
import { tGlobalPopupAction } from '../../../common/GlobalPopup/GlobalPopup.reducer'
import { sendGA } from '../../../../utils/ga'
import { isShipper } from '../utils/constants'

const OrganizationAlertProfiles = () => {
  const toast = useToast()
  const history = useHistory()
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const alertProfileList = useTypedSelector(state => state.settings.alertProfilesMaster.alertProfilesList)
  const profileType = useTypedSelector(state => state.settings.alertProfilesMaster.profileType)
  const [isAddPopupOpen, setIsAddPopupOpen] = React.useState<boolean>(false)
  const [showShimmer, setShowShimmer] = React.useState<boolean>(false)
  // const [hasNoData, setHasNoData] = React.useState<boolean>(false)
  const [cloneFrom, setCloneFrom] = React.useState<number | undefined>()

  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const hasNoData = React.useMemo(() => {
    return !showShimmer && alertProfileList.length === 0
  }, [showShimmer, alertProfileList])

  const fetchOrganizationProfiles = React.useCallback(async () => {
    setShowShimmer(true)
    try {
      const { data } = await axios.get<ILogiAPIResponse<IAlertProfileDetails[]>>(apiMappings.settings.alertProfiles.getProfileList, {
        params: {
          type: profileTypeToAPIMapping[profileType]
        }
      })
      // setHasNoData(!data.data.length)
      dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST', payload: data.data })
      // setAlertProfileList(data.data)
      setShowShimmer(false)
      if (data.hasError) {
        throw data
      }
    } catch (error) {
      setShowShimmer(false)
      // setHasNoData(true)
      toast.add(error?.message || error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }, [])

  const handleEdit = React.useCallback((data: IAlertProfileDetails) => {
    sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Edit`)

    history.push({ pathname: `/${data.profileId}`, state: data })
  }, [history])

  const handleFavourite = React.useCallback(async (data: IAlertProfileDetails, newFavIndex: number) => {
    const currentFavIndex = alertProfileList.findIndex((profile) => profile.isFavouriteFl)

    dispatch({ type: '@@ALERT_PROFILES_MASTER/MARK_PROFILE_FAVOURITE', payload: { profileId: alertProfileList[newFavIndex].profileId } })

    try {
      const { data: response } = await axios.put<ILogiAPIResponse>(apiMappings.settings.alertProfiles.markFavourite, {}, { params: { profileId: data.profileId } })
      if (response.hasError) {
        throw response
      }
      toast.add(response.message, 'check-round', false)
    } catch (errorResponse) {
      toast.add(errorResponse?.response?.data?.message || errorResponse?.message || dynamicLabels.somethingWendWrong, 'warning', false)
      dispatch({ type: '@@ALERT_PROFILES_MASTER/MARK_PROFILE_FAVOURITE', payload: { profileId: alertProfileList[currentFavIndex].profileId } })
    }

  }, [alertProfileList])

  const handleDelete = React.useCallback((data: IAlertProfileDetails) => {
    const alertProfilesListBackup = [...alertProfileList]
    if (data.isFavouriteFl) {
      toast.add(dynamicLabels.cannotDeleteFavouriteAlertProfile, 'warning', false)
      return
    }

    const processDelete = async () => {
      try {
        const { data: response } = await axios.put(apiMappings.settings.alertProfiles.deleteProfile, {}, { params: { profileId: data.profileId } })
        toast.add(response.message, 'check-round', false)
        fetchOrganizationProfiles()
      } catch (errorResponse) {
        dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST', payload: alertProfilesListBackup })
        toast.add(errorResponse?.response?.data?.message || errorResponse?.message || dynamicLabels.somethingWendWrong, 'warning', false)
      }
    }

    const confirmationLabelKey = {
      ORGANIZATION: 'deleteConfirmationOrganizationAlertProfile',
      SHIPPER: 'deleteConfirmationShipperAlertProfile',
      BRANCH: 'deleteConfirmationBranchAlertProfile'
    }


    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS', payload: {
        isOpen: true,
        title: 'Delete Confirmation',
        onClose: () => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }) },
        content: <>
          <div>{`${dynamicLabels[confirmationLabelKey[profileType]]}: ${data.profileName} ?`}</div>
          <br />
          <div><span style={{ marginRight: 5 }}><FontIcon variant='icomoon-warning-circled' size={16} color='error.main' /></span>{dynamicLabels.youCantUndoThisAction}</div>
          <br />
          <div style={{ lineHeight: '16px' }}>{profileType === 'BRANCH' && dynamicLabels.branchDeleteLinkInformationAlertProfile} {profileType === 'SHIPPER' && dynamicLabels.shipperDeleteLinkInformationAlertProfile}</div>
        </>,
        footer: <>
          <IconButton id='AlertProfile-Delete-Ok' iconVariant='icomoon-tick-circled' primary
            onClick={() => {
              globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
              dispatch({ type: '@@ALERT_PROFILES_MASTER/DELETE_ALERT_PROFILE', payload: { profileId: data.profileId } })
              processDelete()
            }}>{dynamicLabels.ok}</IconButton>
          <IconButton id='AlertProfile-Delete-Cancel' iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
        </>
      }
    })

    sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Delete`)
  }, [globalPopupDispatch, alertProfileList])

  const handleClone = React.useCallback((data: IAlertProfileDetails) => {
    setCloneFrom(data.profileId)
    setIsAddPopupOpen(true)
    sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Clone`)
  }, [setCloneFrom, setIsAddPopupOpen])

  useEffect(() => {
    dispatch({ type: '@@ALERT_PROFILES_MASTER/SET_PROFILE_LIST', payload: [] })
    fetchOrganizationProfiles()
  }, [])


  return <Box verticalSpacing='2.5px' >
    <div ref={containerRef}>
      {alertProfileList.map((detail, index) => (
        <Box mt='5px' key={detail.profileId}>
          <AlertProfileDetail data={detail}
            onEditClick={handleEdit}
            onToggleFavourite={(data) => handleFavourite(data, index)}
            onDeleteClick={handleDelete}
            onCloneClick={handleClone}
          />
        </Box>
      ))}

      {false && showShimmer && Array(4).fill(0).map((_, i) => <Box key={i} mb='15px'>
        <Shimmer width={containerRef.current?.clientWidth || 0} height={40}></Shimmer>
      </Box>)}

      {hasNoData && <Box display='flex' justifyContent='center' alignItems='center' my='25px'>
        <img src={s3BucketMapping.settings.alertProfiles.noAlertProfilesList} height='200px' />
      </Box>}
    </div>
    {!isShipper && <Box mt='15px' fullWidth>
      <BorderButton onClick={() => {
        sendGA('Settings > Alert Profiles Master' , `Button Click ` + `${currentStep.stepNameLabel} - Add`)
        setIsAddPopupOpen(true)
      }} id='alert_profiles-actionbar-add'> + {dynamicLabels.add} {currentStep.stepNameLabel}</BorderButton>
    </Box>}

    <AddAlertProfile
      isOpen={isAddPopupOpen}
      cloneFrom={cloneFrom}
      onClose={() => {
        setIsAddPopupOpen(false)
        setCloneFrom(undefined)
      }}
      onSave={() => {
        fetchOrganizationProfiles()
      }}
      alertProfileList={alertProfileList}
       />
  </Box>
}

export default OrganizationAlertProfiles