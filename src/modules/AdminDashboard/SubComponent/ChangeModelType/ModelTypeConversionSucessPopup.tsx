import React from "react";
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import {
    Box,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";

const ConfirmationPopup = (props:any) => {
    const {showModelTypeConversionPopup, setShowModelTypeConversionPopup ,clientName} = props
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.adminDashboard)
    const handleClose = () => {
        setShowModelTypeConversionPopup(false)
    }

    return(
        <Modal
            open={showModelTypeConversionPopup}
            onToggle={() => handleClose()}
            width='600px'
            children={{
                header: (
                    <ModalHeader
                        headerTitle= {dynamicLabels.updateModelTypeConfirmation}
                        handleClose={() => {
                            handleClose()
                        }}
                        imageVariant='icomoon-close'
                        headerStyle={{ fontSize: '15px' }}
                    />
                ),
                content: (
                    <div style={{ fontSize: '14px' }}>
                        <Box horizontalSpacing='5px'>
                            <span style={{ lineHeight: '30px' }}>Model type for {clientName} has been successfully updated.</span>
                        </Box>
                    </div>
                ),
                footer: (
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton
                            iconVariant='icomoon-tick-circled'
                            primary
                            onClick={() => {
                                handleClose()
                            }}
                        >
                        Confirm</IconButton>
                        <IconButton
                            iconVariant='icomoon-close'
                            iconSize={11}
                            onClick={() => {
                                handleClose()
                            }
                            }
                        >Cancel</IconButton>
                    </Box>
                )
            }}
        />
    )
}

export default ConfirmationPopup;