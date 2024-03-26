import React from 'react'
import {
    Modal,
    ModalHeader
} from 'ui-library';


interface Props {
    showDownloadModal: boolean
    setShowDownloadModal: React.Dispatch<React.SetStateAction<boolean>>
    dynamicLabels: Record<string, string>
}

export const DownloadResponseModal = ({ showDownloadModal,
    setShowDownloadModal,
    dynamicLabels }: Props) => {
    return (
        <Modal
            open={showDownloadModal}
            onToggle={value => {
                setShowDownloadModal(value);
            }}
            width='600px'
            children={{
                header: (
                    <ModalHeader
                        headerTitle={`${dynamicLabels?.information}`}
                        handleClose={() => setShowDownloadModal(false)}
                        imageVariant='icomoon-close'
                        headerStyle={{ fontSize: '15px' }}
                    />
                ),
                content: (
                    <div style={{ fontSize: '14px' }}>
                        <div>{dynamicLabels?.MISSuccessDownload}</div>
                        <br /><br />
                        <div>{dynamicLabels?.MISCommonMessage}</div>
                    </div>
                ),
                footer: (
                    <></>
                ),
            }}
        />
    )
}



