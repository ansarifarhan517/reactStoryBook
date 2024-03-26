import React from "react";
import { Box, IconButton, Modal, ModalHeader} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";

const NotifyFleetModal = (props:any) =>{
    const {showNotifyFleetModal, setShowNotifyFleetModal} = props
    const dynamicLabels =  useTypedSelector(state=>state.dynamicLabels);
return <Modal
        open={showNotifyFleetModal}
        onToggle={(value: boolean) => {
            setShowNotifyFleetModal(value);
        }}
        // width='800px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Bulk Upload'
                    handleClose={() => setShowNotifyFleetModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <><div>TEST</div>
                    </>),

            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        id='notifyFleet-Modal-button-Assign'
                        iconVariant="icomoon-delete-empty"
                        primary
                        onClick={()=> {}}
                    >
                        {'Assign'}
                    </IconButton>
                    <IconButton
                         id='notifyFleet-Modal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => setShowNotifyFleetModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />

}

export default NotifyFleetModal;