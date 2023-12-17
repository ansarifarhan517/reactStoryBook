import React, { Dispatch, SetStateAction } from "react";
import { Modal, ModalHeader, Box, IconButton, FontIcon } from "ui-library";
import { useTypedSelector } from "../../redux/rootReducer";
import styled from 'styled-components';

interface IConfirmationModalProps {
    title: string;
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    onSubmit: () => void;
    confirmationMessage: string | undefined;
    isDeleteModal: boolean;
}

const TextWrapper = styled.div`
    color: #4c4c4c;
    font-size: 14px;
`;

const ConfirmationModal = ({ title, onClose, isOpen, onSubmit, confirmationMessage, isDeleteModal }: IConfirmationModalProps) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width='600px'>
            {{
                header: <ModalHeader
                    headerTitle={title}
                    handleClose={() => onClose(false)}
                />,
                content: isDeleteModal ?
                    <TextWrapper>
                        <>
                            <p>{dynamicLabels.delete_Confirmation_Warning}</p>
                            <p><FontIcon variant="icomoon-warning-circled" color="red" size={14} /> {dynamicLabels.youCantUndoThisAction}</p>
                        </>
                    </TextWrapper>
                    : <TextWrapper>{confirmationMessage}</TextWrapper>,
                footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton id={`ConfirmationModal-actionBar-${isDeleteModal ? dynamicLabels.Delete : dynamicLabels.confirm}`} primary iconVariant={isDeleteModal ? 'icomoon-delete-empty' : 'icomoon-tick-circled'}
                        onClick={() => onSubmit()}>
                        {isDeleteModal ? dynamicLabels.Delete : dynamicLabels.confirm}
                    </IconButton>
                    <IconButton id="ConfirmationModal-actionBar-Cancel" iconVariant='icomoon-close'
                        onClick={() => onClose(false)}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>

            }}
        </Modal>
    )
}

export default ConfirmationModal;