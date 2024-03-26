import React, {Dispatch} from 'react'
import { IconButton } from 'ui-library'
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { useDispatch } from 'react-redux';

interface IEditedUpdateConfirmation {
    showModal: boolean
    setShowModal: (value: boolean) => void
    handleAction: (action: string) => void
}

const EditedUpdateConfirmation = ({ showModal, setShowModal,  handleAction }: IEditedUpdateConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
            isOpen: showModal,
            title: dynamicLabels?.navigationConfirmation,
            onClose:() => { setShowModal(false) },
            content: (
                <div style={{ fontSize: '14px' }}>
                    <div>{dynamicLabels.areYouSureYouWantToCancel} {dynamicLabels.anyUnsavedDataWillBeLost}</div>
                </div>
            ),
          footer: (<>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={()=>{globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });handleAction('ok')}}>{dynamicLabels?.ok || 'Ok'}</IconButton>
                    <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {
                        setShowModal(false)
                        handleAction('cancel')
                        globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });
                    }}>
                    {dynamicLabels.cancel}</IconButton>
            </>
        )
        }
      })
    return <></>
}

export default withRedux(EditedUpdateConfirmation)