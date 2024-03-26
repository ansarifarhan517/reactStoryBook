import React from 'react'
import { Box, Modal, ModalHeader, IconButton } from 'ui-library'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { StyledFooter } from '../StyledFleetTypeView';


interface IEditedUpdateConfirmation {
    showModal: boolean
    setShowModal: (value: boolean) => void
    handleAction: (action: string) => void
}

const EditedUpdateConfirmation = ({ showModal, setShowModal,  handleAction }: IEditedUpdateConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
    return <Modal open={showModal} onToggle={(value) => { setShowModal(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.navigationConfirmation}
                    handleClose={() => setShowModal(false)}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '13px' }}>
                    <div>{dynamicLabels?.cancelConfirmationWarning}</div>
                </div>
            ),
            footer: (
                <StyledFooter>
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={()=>handleAction('ok')}>
                    <span style={{ fontSize: '13px' }}>{dynamicLabels?.ok || 'Ok'}</span>
                        </IconButton>
                    <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {
                        setShowModal(false)
                        handleAction('cancel')
                    }}>
                    <span style={{ fontSize: '13px' }}>{dynamicLabels?.cancel || 'Cancel'}</span>
                    </IconButton>
                </Box>
                </StyledFooter>
            )
        }}
    />
}

export default EditedUpdateConfirmation