import React from "react";
import {
    Box,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";
import { useTypedSelector } from "../redux/rootReducer";

const InlineEditConfirmationModal = (props: any) => {
    const { showCancelConfirmationModal, setShowCancelConfirmationModal , handleCancelRows} = props
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    return <Modal
        open={showCancelConfirmationModal}
        onToggle={(value: boolean) => {
            setShowCancelConfirmationModal(value);
        }}
        width="600px"
        children={{
            header: (
                <ModalHeader
                  headerTitle={`${dynamicLabels?.confirmation}`} 
                  handleClose={() => setShowCancelConfirmationModal(false)}
                  imageVariant='icomoon-close'
                  headerStyle={{ fontSize: '15px' }}
                />
              ),
            content:  (
                <div style={{ fontSize: '14px' }}>
                  <div>{dynamicLabels.cancelConfirmationWarning}</div>
                </div>
              ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleCancelRows}>
                    {dynamicLabels.ok}
                  </IconButton>
                  <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setShowCancelConfirmationModal(false)}>
                    {dynamicLabels.cancel}
                  </IconButton>
                </Box>
              ),
        }}
    />

}

export default InlineEditConfirmationModal