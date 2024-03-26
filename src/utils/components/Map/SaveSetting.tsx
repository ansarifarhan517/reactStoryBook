

import React from "react";
import {
     Modal, IconButton, Box,
    ModalHeader
} from "ui-library"
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';


interface ISaveSettingModal {
    showModal: boolean
    setShowModal: (value: boolean) => void
    onSaveChange: () => void
    handleCancel: () => void
}

const SaveSettingModal = ({ showModal, setShowModal, onSaveChange, handleCancel }: ISaveSettingModal) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.vehicle)
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)

    return <Modal open={showModal} onToggle={(value) => { setShowModal(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={popupDynamicLabel?.mapSettingsConfirmation}
                    handleClose={() => {
                        handleCancel()
                        setShowModal(false)
                    }}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '14px' }}>
                    <div>{popupDynamicLabel?.areYouSureYouWantToSaveMapSettings}</div>
                </div>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => onSaveChange()}>{dynamicLabels.save}</IconButton>
                    <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {
                        handleCancel()
                        setShowModal(false)
                    }
                    }>{dynamicLabels.cancel}</IconButton>
                </Box>
            )
        }}
    />
}
export default SaveSettingModal