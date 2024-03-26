import React from "react";
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import {
    Box,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";

const ConfirmationPopup = (props:any) => {
    const {confirmationPopup, setConfirmationPopup, submit ,modelType,newModelType} = props
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.adminDashboard)
    const handleClose = () => {
        setConfirmationPopup(false)
    }

    return(
        <Modal
            open={confirmationPopup}
            onToggle={() => handleClose()}
            width='600px'
            children={{
                header: (
                    <ModalHeader
                        headerTitle={dynamicLabels.confirmModelTypeUpdate}
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
                            {((modelType === 'FM' && newModelType === 'FMLM') || (modelType === 'LM' && newModelType === 'FMLM'))
                             ? <span style={{ lineHeight: '30px' }}>{dynamicLabels.confirmModelTypeMsg}</span> 
                             : <span style={{ lineHeight: '30px' }}>{dynamicLabels.confirmModelTypeTransactionalMsg}</span>}
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
                                submit()
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