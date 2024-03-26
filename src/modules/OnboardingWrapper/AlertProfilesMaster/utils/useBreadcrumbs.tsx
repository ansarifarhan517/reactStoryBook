import React, { Dispatch } from 'react'
import { useTypedSelector } from "../../../../utils/redux/rootReducer"
import { useLocation, useHistory, useParams } from 'react-router-dom'
import { IAlertListsRoutePayload, IAlertSettingsRoutePayload, IAlertProfileMasterRouteParams } from '../AlertProfilesMaster.models'
import { useDispatch } from 'react-redux'
import { tGlobalPopupAction } from '../../../common/GlobalPopup/GlobalPopup.reducer'
import { IconButton } from 'ui-library'
import { UseFormMethods } from 'react-hook-form'


export const useBreadcrumbsAlertLists = () => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  const location = useLocation<IAlertListsRoutePayload>()
  const history = useHistory()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const alertListSavePayload = useTypedSelector(state => state.settings.alertProfilesMaster.alertListSavePayload)

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'profileType', label: currentStep.stepNameLabel, disabled: false },
    // { id: 'profileName', label: location?.state?.profileName, disabled: true },
    { id: 'actionProfileName', label: `${dynamicLabels.update} ${location?.state?.profileName}`, disabled: true },
  ], [dynamicLabels, currentStep])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'profileType':
        const handleClose = () => {
          globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
        }

        const handleOk = () => {
          handleClose()
          history.push('/')
        }

        if (alertListSavePayload.length === 0) {
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

        break
    }
  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}

export const useBreadcrumbsAlertSetting = (formInstance: UseFormMethods<Record<string, string | number | boolean>>) => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const currentStep = useTypedSelector(state => state.settings.alertProfilesMaster.currentStep)
  const location = useLocation<IAlertSettingsRoutePayload>()
  const params = useParams<IAlertProfileMasterRouteParams>()
  const history = useHistory()
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const settingsSaveRequestPayload = useTypedSelector(state => state.settings.alertProfilesMaster.settings.saveRequestPayload)
  const rteState = useTypedSelector(state => state.settings.alertProfilesMaster.settings.rteState)

  const isPageDirty = React.useMemo(() => {
    return Object.keys(settingsSaveRequestPayload).length !== 0 || formInstance.formState.isDirty || Object.keys(rteState).length > 4
  }, [settingsSaveRequestPayload, formInstance.formState.isDirty, rteState])

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'profileType', label: currentStep.stepNameLabel, disabled: false },
    // { id: 'profileName', label: location?.state?.profileName, disabled: false },
    { id: 'actionProfileName', label: `${dynamicLabels.update} ${location?.state?.profileName}`, disabled: false },
    { id: 'updateSettings', label: `${dynamicLabels.update} ${location?.state?.alertName}`, disabled: true },
  ], [dynamicLabels, currentStep])

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case 'profileType':
        const handleClose = () => {
          globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
        }

        const handleOk = () => {
          handleClose()
          history.push('/')
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
        break

      case 'profileName':
      case 'actionProfileName':
        {
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
        break
    }

  }

  return { breadCrumbOptions, handleBreadCrumbClick }
}