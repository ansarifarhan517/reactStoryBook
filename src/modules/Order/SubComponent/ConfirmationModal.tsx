import React from "react";
import {
    Box,
    FontIcon,
    IconButton,
    Modal,
    ModalHeader
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";

const ConfirmationModal = (props: any) => {
    const { showConfirmationModal, setShowConfirmationModal, setIsConfirmed } = props
    const dynamicLabels= useTypedSelector(state=>state.dynamicLabels);
    // useEffect(() => {
    //     setShowDeletionConfirmation(showDeletionConfirmation)
    // }, [deleteSelectedRows, showDeletionConfirmation])
    const closeConfirmationModal = () => {
        setShowConfirmationModal(false);
        setIsConfirmed(false);
    }
    const setConfirm = () => {
        setIsConfirmed(true);
        setShowConfirmationModal(false);
    }
    return <Modal
        open={showConfirmationModal}
        onToggle={(value: boolean) => {
            setShowConfirmationModal(value);
        }}
        width="600px"
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.statusChangeConfirmation}
                    handleClose={() => setShowConfirmationModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                />
            ),
            content: (
                <div style={{ fontSize: "14px" }}>
                    <Box horizontalSpacing="5px">
                        <FontIcon
                            color="error.main"
                            variant="icomoon-warning-circled"
                            size={14}
                        />
                        <span>
                            {dynamicLabels?.areYouSureYouWantToChangeStatus || "Are you sure you want to change the status?"}
                        </span>
                    </Box>
                </div>
            ),
            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        id='orderConfirmation-Modal-button-Confirm'
                        iconVariant="icomoon-tick-circled"
                        primary
                        onClick={() => setConfirm()
                        }
                    >
                        {dynamicLabels.confirm}
                    </IconButton>
                    <IconButton
                        id='orderConfirmation-Modal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeConfirmationModal()}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),
        }}
    />

}

export default ConfirmationModal;

