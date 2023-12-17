import React from 'react';
import { Modal, ModalHeader, Box } from "ui-library";
import DYNAMIC_LABELS_MAPPING from '../../modules/common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../modules/common/DynamicLabels/useDynamicLabels';
interface IDownloadMessage {
    showInfoModal: boolean,
    onToggle: (val: boolean) => void
    email : string
}
const EmailMessage = ({ showInfoModal, onToggle ,email}: IDownloadMessage) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
    return (
        <>
            <Modal
                open={showInfoModal}
                onToggle={() => onToggle(false)}
                children={{
                    header: (
                        <ModalHeader
                            headerTitle='Information'
                            handleClose={() => { onToggle(false) }}
                            imageVariant='icomoon-close'
                            headerStyle={{ fontSize: "15px" }}
                            width='100%'
                        />
                    ),
                    content: (
                        <>
                        <div style={{ fontSize: 14, color: '#000' }}>{ dynamicLabels?.emailSuccessMsg ||
                        `Thank you! Your report is being generated and will be  emailed to `} </div>
                        <div>{email}</div>
                        </>
                    ),
                    footer: (
                        <Box
                            horizontalSpacing="10px"
                            display="flex"
                            style={{ paddingLeft: '15px', paddingBottom: '15px', paddingTop: '15px' }}
                        >
                            <div style={{ fontSize: 14, color: '#000' }}>{dynamicLabels.continueUsingApp || "You may continue to use the app."}</div>
                        </Box>
                    ),
                }}
                size='md'
            />
        </>
    )
}

export default EmailMessage;
