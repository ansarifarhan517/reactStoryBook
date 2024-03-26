import React from "react";
import {
    Box,
    FontIcon,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";
import { useTypedSelector } from "../redux/rootReducer";

const DeleteConfirmationModal = (props: any) => {
    const { showDeletionConfirmation, setShowDeletionConfirmation , deleteSelectedRows , featureName = ''} = props
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    return <Modal
        open={showDeletionConfirmation}
        onToggle={(value: boolean) => {
            setShowDeletionConfirmation(value);
        }}
        width="600px"
        children={{
            header: (
                <ModalHeader
                  headerTitle={dynamicLabels?.deletionConformation}
                  handleClose={() => setShowDeletionConfirmation(false)}
                  imageVariant='icomoon-close'
                  headerStyle={{ fontSize: '15px' }}
                />
              ),
            content: (
                <div style={{ fontSize: '14px' }}>
                  <Box horizontalSpacing='5px'>
    
                    <span>
                      {featureName == 'vehicle' ? dynamicLabels?.vehicle_delete_confirmation_msg : featureName == 'exception' ? dynamicLabels?.areYouSureDeleteExceptionRequest : dynamicLabels.delete_Confirmation_Warning}<br /><br />
                      <FontIcon color='error.main' variant='icomoon-warning-circled' size={14} />
                       {featureName == 'comparment' && ' ' + dynamicLabels?.deleteCompartmentRequest} {' ' + dynamicLabels?.youCantUndoThisAction}
                    </span>
                  </Box>
                </div>
              ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton id='deleteConfirmation-Modal-Button-Delete' iconVariant='icomoon-delete-empty' primary onClick={deleteSelectedRows}>
                    {dynamicLabels.Delete}
                  </IconButton>
                  <IconButton id='deleteConfirmation-Modal-Button-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => setShowDeletionConfirmation(false)}>
                    {dynamicLabels.cancel}
                  </IconButton>
                </Box>
              ),
        }}
    />

}

export default DeleteConfirmationModal