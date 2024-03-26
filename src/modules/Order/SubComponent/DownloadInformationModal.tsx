import React,{} from "react";
import {
    Box,
    Modal,
    ModalHeader
} from "ui-library";


const DownloadInformationModal = ({ showModal,setShowModal }: any) => {
    return <Modal
        open={showModal}
        onToggle={(value) => {
            setShowModal(value);
        }}
        size='md'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Download Report'
                    handleClose={() => setShowModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <div style={{ fontSize: 14, color: '#000' }}>Thank You! Your report is being generated and will be downloaded soon.</div>
            ),
            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    style={{ paddingLeft: '15px', paddingBottom: '15px', paddingTop: '15px' }}
                >
                    <div style={{ fontSize: 14, color: '#000' }}>You may continue to use the app.</div>
                </Box>
            ),
        }}


    />

}

export default DownloadInformationModal;