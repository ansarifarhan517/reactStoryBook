
import React from "react";
import { Box, IconButton, Modal, ModalHeader } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DeliveryProofContent from '../SubComponent/DeliveryProofContent'
// import apiMappings from "../../../utils/apiMapping";

// import moment from 'moment';
// import DAListView from './DAListView';
const DeliveryProofModal = (props: any) => {
    const { showDeliveryProofModal, setShowDeliveryProofModal, deliveryProofStructure, selectedRows } = props
    const dynamicLabels= useTypedSelector(state=>state.dynamicLabels);
    return <Modal
        open={showDeliveryProofModal}
        onToggle={(value: boolean) => {
            setShowDeliveryProofModal(value);
        }}
        width='1200px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Delivery Proof'
                    handleClose={() => setShowDeliveryProofModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <DeliveryProofContent row={selectedRows} structure={deliveryProofStructure} />
            ),

            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >

                    <IconButton
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => setShowDeliveryProofModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />


}

export default DeliveryProofModal