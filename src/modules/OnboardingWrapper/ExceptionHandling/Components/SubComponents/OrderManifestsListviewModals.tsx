import React, { useState } from "react";
import { Modal, ModalHeader, Box, FontIcon, TextArea, IconButton } from "ui-library";
import { sendGA } from "../../../../../utils/ga";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { ModalFooterButtonContainer, ResolveRejectTextAreaContainer } from "../../ExceptionHandlingStyledComponents";

interface IOrderManifestsListviewModalsProps {
    modalType: string;
    isModalOpen: boolean;
    handleModalCancel: Function;
    modalWidth: string
    markException: Function
    activeTab: string
}

const OrderManifestsListviewModals = (props: IOrderManifestsListviewModalsProps) => {
    const { modalType, isModalOpen, handleModalCancel, modalWidth, markException, activeTab } = props;
    const [notes, setNotes] = useState<string>('');
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling);

    return <Modal open={isModalOpen} onToggle={() => { }} width={modalWidth}>
        {{
            header: (
                <ModalHeader headerTitle={dynamicLabels?.statusChangeConfirmation} imageVariant='icomoon-close' width={modalWidth} handleClose={() => handleModalCancel()} />
            ),
            content: (
                <>
                    <div>{modalType === 'rejected' ? dynamicLabels?.areYouSureToMarkExceptionRejected : dynamicLabels?.areYouSureToMarkExceptionResolved}</div>
                    <br />
                    <Box horizontalSpacing='5px' pb='15px'>
                        <FontIcon color='error.main' variant='icomoon-warning-circled' size={13} />
                        <span>{dynamicLabels?.youCantUndoThisAction}</span>
                        <ResolveRejectTextAreaContainer><TextArea rows={4} maxLength={255} label={dynamicLabels.notes} placeholder={dynamicLabels.addNotes} labelColor="#000" onChange={(e) => { sendGA(activeTab === 'orders' ? "Raised Exceptions - Orders" : 'Raised Exceptions - Manifests',`${modalType === 'rejected' ? 'Enter - Rejection Notes' : 'Enter - Resolution Notes'}`); setNotes(e.target.value)}} /></ResolveRejectTextAreaContainer>
                    </Box>
                </>
            ),
            footer: (
                <ModalFooterButtonContainer>
                    <IconButton id='ExceptionHandling-Modals-{{modalType === "rejected" ? dynamicLabels.reject : dynamicLabels.resolve}}' className="rejected" iconSize={15} primary iconVariant={modalType === "rejected" ? "filter-funnel" : 'bulk-update'} onClick={() => markException(notes)}>{modalType === "rejected" ? dynamicLabels.reject : dynamicLabels.resolve}</IconButton>
                    <IconButton iconVariant="icomoon-close" onClick={() => {sendGA(activeTab === 'orders' ? "Raised Exceptions - Orders" : 'Raised Exceptions - Manifests', `${modalType === 'rejected' ? 'Click - Cancel reject exception' : 'Click - Cancel resolve exception'}`); handleModalCancel()}}>{dynamicLabels.cancel}</IconButton>
                </ModalFooterButtonContainer>
            )
        }}
    </Modal>;
}

export default OrderManifestsListviewModals;