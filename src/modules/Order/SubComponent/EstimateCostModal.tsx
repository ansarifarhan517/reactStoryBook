
import React from "react";
import { Box, IconButton, Modal, ModalHeader } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import EstimateActualCostContent from '../SubComponent/estimateActualCostContent';
const EstimateCostModal = (props: any) => {

    const { showEstimateCostModal, setShowEstimateCostModal, handleEstimatedCostData, handleEstimatedCostStructure } = props
    const dynamicLabels= useTypedSelector(state=>state.dynamicLabels);
    return <Modal
        open={showEstimateCostModal}
        onToggle={(value: boolean) => {
            setShowEstimateCostModal(value);
        }}
        width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Delivery Proof'
                    handleClose={() => setShowEstimateCostModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <EstimateActualCostContent data={handleEstimatedCostData} structure={handleEstimatedCostStructure} />
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
                        onClick={() => setShowEstimateCostModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),

        }}

    />


}

export default EstimateCostModal