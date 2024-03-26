import React, { useEffect } from 'react'
import { Box, Modal, ModalHeader, IconButton } from 'ui-library'
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { IUpdateConfirmation } from '../SubComponent.models'



const UpdateConfirmation = ({ daUpdateRequest, title, setDaUpdateRequest, handleOkAction, content }: IUpdateConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);

    useEffect(() => {
    }, [daUpdateRequest.activeRequest])
    return <Modal open={!!daUpdateRequest.activeRequest} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={title}
                imageVariant='icomoon-close'
                handleClose={() => {
                    daUpdateRequest?.failureCallback && daUpdateRequest?.failureCallback(!daUpdateRequest.activeRequest)
                    setDaUpdateRequest(undefined)
                }}
            />,

            content: (
                <>
                    <div style={{ fontSize: '14px', lineHeight: '22px' }}>{content}</div>
                </>),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton id='DA-Notify-Modal-Ok' iconVariant='icomoon-tick-circled' primary onClick={handleOkAction}>{dynamicLabels.ok}</IconButton>
                    <IconButton id='DA-Notify-Modal-Cancel' iconVariant='icomoon-close' iconSize={11}
                        onClick={() => {
                            daUpdateRequest?.failureCallback && daUpdateRequest?.failureCallback(!daUpdateRequest.activeRequest)
                            setDaUpdateRequest(undefined)
                        }}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            )
        }}
    </Modal>

}
export default withRedux(UpdateConfirmation)