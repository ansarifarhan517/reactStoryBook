import React from 'react'
import { Box, Modal, ModalHeader, IconButton } from 'ui-library'
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';

interface IEditedUpdateConfirmation {
    showModal: boolean
    setShowModal: (value: boolean) => void
    handleAction: (action: string) => void
}

const EditedUpdateConfirmation = ({ showModal, setShowModal,  handleAction }: IEditedUpdateConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);

    return <Modal open={showModal} onToggle={(value) => { setShowModal(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={'Navigation Confirmation'}
                    handleClose={() => setShowModal(false)}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '14px' }}>
                    <div>{`Are you sure you want to cancel? Any unsaved data will be lost.`}</div>
                </div>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton id='DA-EditedUpdateConfirmation-Modal-ok' iconVariant='icomoon-tick-circled' primary onClick={()=>handleAction('ok')}>{dynamicLabels?.ok || 'Ok'}</IconButton>
                    <IconButton id='DA-EditedUpdateConfirmation-Modal-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => {
                        setShowModal(false)
                        handleAction('cancel')
                    }}>
                    {dynamicLabels.cancel}</IconButton>
                </Box>
            )
        }}
    />
}

export default withRedux(EditedUpdateConfirmation)