
import React, { Dispatch } from 'react'
import { IconButton, Box, Toggle } from 'ui-library'
import { Cell } from 'react-table'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux'
import { tAlertProfilesMasterActions } from './AlertProfilesMaster.actions'
import TextOverflowEllipsis from '../../../utils/components/TextOverflowEllipsis'
import { IAlertProfileMasterRouteParams, IAlertProfilesLookupResponse, IAlertSettingsRoutePayload } from './AlertProfilesMaster.models'
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer'
import { sendGA } from '../../../utils/ga'

const GALabelMapping = {
  isAlertActive: 'Active-record',
  isEmailActive: 'Enable-Email',
  isSmsActive: 'Enable-Mobile',
  isIvrActive: 'Enable-IVR Call',
  isWhatsAppActive : 'Enable-Whatsapp'
}

const ToggleComponent = ({ value, row, column }: Cell<any>) => {
  const isChecked = useTypedSelector(state => state.settings.alertProfilesMaster.alertListModifiedData?.[row.original.category]?.[row.index]?.[column.id])
  const readOnlyMode = useTypedSelector(state => state.settings.alertProfilesMaster.readonlyMode)
  const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()

  /* List after filtering was not coming from API but through filter. Thus, filtered rowId was being sent to backend.
     Modified the filtered rowId to the orignal rowId */
  const datafromApi = useTypedSelector(state => state.settings.alertProfilesMaster.alertListDataFromAPI);

  let modifiedRow: number;
  const handleChange = () => {
    Object.keys(datafromApi).forEach((type) => {
      datafromApi[type].forEach((data: { alertMasterId: number }, index: number) => {
        if (data.alertMasterId === row.original.alertMasterId) {
          modifiedRow = index;
        }
      });
    });

    if (!(isChecked === undefined ? value : isChecked)) {
      sendGA('Settings > Alert Profiles Master' ,'Alert Lists > Toggle Enable' + GALabelMapping[column.id])
    }

    dispatch({
      type: '@@ALERT_PROFILES_MASTER/SET_ALERTS_LIST_MODIFIED_DATA', payload: {
        category: row.original.category,
        rowIndex: modifiedRow,
        columnId: column.id,
        value: isChecked === undefined ? !value : !isChecked
      }
    })
  }

  return <Toggle checked={isChecked === undefined ? value : isChecked} onChange={handleChange} disabled={readOnlyMode} />
}

export const ALERT_PROFILES_MASTER_CELL_MAPPING = {
  settings: React.memo(({ row }: Cell<any>) => {
    const history = useHistory<IAlertSettingsRoutePayload>()
    const location = useLocation<IAlertProfilesLookupResponse>()
    const { profileId } = useParams<IAlertProfileMasterRouteParams>()
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const alertListSavePayload = useTypedSelector(state => state.settings.alertProfilesMaster.alertListSavePayload)

    const handleClick = () => {
      const handleClose = () => {
        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
      }

      const handleOk = () => {
        handleClose()
        history.push(`/${profileId}/${row.original.alertMasterId}`, {
          alertName: row.original.shortName,
          profileName: location.state.profileName,
          isGroupOrderAlert: location.state.isGroupOrderAlert
        })
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

    }

    return <Box fullWidth display='flex' justifyContent='flex-start'>
      <IconButton onlyIcon hoverFeedback={false} iconVariant='icomoon-setting' onClick={handleClick} />
    </Box>
  }, (p, n) => p.row.original.alertMasterId === n.row.original.alertMasterId),

  isEmailActive: ToggleComponent,
  shortName: ({ value, row: { original: { alertName, category } } }: Cell<any>) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const isOrderCreatedAlert = alertName === "MILECREATEORDER"

    return <TextOverflowEllipsis title={ isOrderCreatedAlert ? dynamicLabels?.orderCreatedAlertTooltipMessage :  dynamicLabels[`${alertName}${category === 'MMORDER' ? '_MM' : ''}_description`] || alertName}  >{value}</TextOverflowEllipsis>
  },
  alertCategory: ({ value }: Cell<any>) => <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>,
  isSmsActive: ToggleComponent,
  isIvrActive: ToggleComponent,
  isAlertActive: ToggleComponent,
  isWhatsAppActive: ToggleComponent
}