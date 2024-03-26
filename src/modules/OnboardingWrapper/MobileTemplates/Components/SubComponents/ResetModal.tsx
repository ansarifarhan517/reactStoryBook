import React from "react";
import { Modal, ModalHeader, Box, IconButton, FontIcon } from "ui-library";
import { TextWrapper } from "../../MobileTemplateStyledComponents";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

interface IResetModalProps {
    isResetModalOpen: boolean;
    isEditMode: boolean;
    setResetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleReset: (isEditMode: boolean) => void;
}

const ResetModal = ({isResetModalOpen, setResetModalOpen, handleReset, isEditMode}:IResetModalProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);

    return(
        <Modal width="600px" open={isResetModalOpen} onToggle={() => setResetModalOpen(false)}>
                {{
                    header: <ModalHeader width="600px" handleClose={() => setResetModalOpen(false)} headerTitle={dynamicLabels.resetModalConfirmationTitle} />,
                    content: <TextWrapper>
                        <p>{dynamicLabels.resetConfirmationMessage}</p>
                        <p style={{ paddingTop: 5 }}> <FontIcon color="error.main" variant="icomoon-warning-circled" size={14} /> {dynamicLabels.youCantUndoThisAction}</p>
                    </TextWrapper>,
                    footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton primary iconVariant='icomoon-tick-circled'
                            id="MobileTemplates-ResetModal-button-Ok"
                            onClick={() => handleReset(isEditMode)}>
                            {dynamicLabels.ok}
                        </IconButton>
                        <IconButton iconVariant='icomoon-close'
                            id="MobileTemplates-ResetModal-button-Cancel"
                            onClick={() => setResetModalOpen(false)}>
                            {dynamicLabels.cancel}
                        </IconButton>
                    </Box>
                }}
            </Modal>
    )
}

export default ResetModal;