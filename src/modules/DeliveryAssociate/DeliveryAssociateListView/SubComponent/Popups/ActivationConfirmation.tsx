import React from 'react'
import { Box, Modal, ModalHeader, IconButton } from 'ui-library'
import { IActivationConfirmation, IActivationModalButtonGroup } from '../SubComponent.models'

const ActivationConfirmation = ({ isShowActivationConfirmation, title, footerButtonGroup, confirmationMessage, handleClose }: IActivationConfirmation) => {
    return <Modal open={!!isShowActivationConfirmation} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={title}
                imageVariant='icomoon-close'
                handleClose={handleClose}
            />,

            content: (
                <>
                    <div style={{ fontSize: '14px' }}>{confirmationMessage}</div>
                </>),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    {
                        footerButtonGroup.map((button: IActivationModalButtonGroup) => {
                            return !!button.isVisible &&
                                <IconButton id='DAList-Modal-{{button.label}}' key={button.label} iconVariant={button.iconVariant} primary={button.primary} onClick={button.onClick}>{button.label}</IconButton>
                        })
                    }
                </Box>
            )
        }}
    </Modal>

}
export default ActivationConfirmation