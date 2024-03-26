import React, { Dispatch } from 'react';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { IconButton } from 'ui-library'
import { hybridRouteTo } from '../../../../../utils/hybridRouting';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { useDispatch } from 'react-redux';

interface IEditConfirmationProps {
    showEditConfirmation: boolean
    setShowEditConfirmation: (flag: boolean) => void
    geofenceId: number
}

const EditRouteConfirmationComponent = ({showEditConfirmation, setShowEditConfirmation, geofenceId}: IEditConfirmationProps) => {

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const redirectToEdit = () => {
        hybridRouteTo(`addgeofence?gid=${geofenceId}`)
    }
    globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
            isOpen: showEditConfirmation,
            title: dynamicLabels?.leavePage_title,
            onClose:() => { setShowEditConfirmation(false) },
            content: (
                <div style={{ fontSize: '14px' }}>{dynamicLabels.sureOpenGeofenceEditor || 'Are you sure you want to leave this page and open the Territory Editor?'}</div>
            ),
          footer: (<>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); redirectToEdit() }}>{dynamicLabels?.confirm}</IconButton>
                <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });setShowEditConfirmation(false)}}>{dynamicLabels.cancel}</IconButton>
            </>
        )
        }
      })
    return <></>

}

export default EditRouteConfirmationComponent