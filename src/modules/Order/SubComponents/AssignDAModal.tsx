
import React, { useEffect } from "react";
import { Box, IconButton, Modal, ModalHeader } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DAListView from './DAListView';
const AssignDAModal = (props: any) => {
    const { showAssignDAModal, setAssignDAModal, manualAssignFunc, manualAssignClick } = props
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    useEffect(() => {
        setAssignDAModal(showAssignDAModal)
    }, [showAssignDAModal])


    const handleAssign = (row: any) => {
        manualAssignFunc(row);

    }
    return <Modal
        open={showAssignDAModal}
        onToggle={(value: boolean) => {
            setAssignDAModal(value);
        }}
        width='1200px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.assignTrip ? dynamicLabels?.AssignTrip : 'Select Trip'}
                    handleClose={() => setAssignDAModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (<DAListView handleAssign={handleAssign} />),

            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                         id='AssignDA-Modal-button-Assign'
                        iconVariant="icomoon-tick-circled"
                        primary
                        onClick={manualAssignClick}
                    >
                        {'Assign'}
                    </IconButton>
                    <IconButton
                    id='AssignDA-Modal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => setAssignDAModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />


}

export default AssignDAModal