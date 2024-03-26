import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, IconButton, useToast, TextArea, ISelectedRows } from 'ui-library'
import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios'
import withRedux from '../../../../../utils/redux/withRedux'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { NotifyImage, StyledNotifyBox } from '../StyledSubComponent'

interface INotify {
    showNotify: boolean
    setShowNotify: (value: boolean) => void
    selectedRows: ISelectedRows
    notifyList?: any[],
    originatedFrom?:string
}


const Notify = ({ showNotify, setShowNotify, selectedRows,notifyList,originatedFrom }: INotify) => {
    console.log(notifyList);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);

    const [notifyMsg, setNotifyMsg] = useState<string>('')
    const [selecteDa, setSelectedDa] = useState(Object.values(selectedRows)?.map(row => row))
    const toast = useToast()

    useEffect(() => {
        setSelectedDa(Object.values(selectedRows)?.map(row => row))
    }, [showNotify, selectedRows])

    const handleNotify = async () => {
        
        const notificationMappingDTOs = selecteDa?.map(row => { return { name: originatedFrom === "ORDERLISTVIEW" ? row.orderNo : row.userName, id: row.deliveryMediumMasterId } })
        const payload = {
            message: notifyMsg,
            notificationMappingDTOs
        }
        try {
            const { data: { message, status } } = await axios.post(`${apiMappings.deliveryMedium.listView.notifyDM}?notificationType=${originatedFrom === "ORDERLISTVIEW"?"ORDERMANUAL":"DBMANUAL"}`, payload)
            if (status === 200) {
                toast.add(message, 'check-round', false)
                setShowNotify(false)
                return
            }
            throw message
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)

        }

    }

    return <Modal open={showNotify} onToggle={(value) => { setShowNotify(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.notifyDeliveryBoys}
                    handleClose={() => setShowNotify(false)}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <StyledNotifyBox >
                    <Box horizontalSpacing='5px'>
                        <div >{`Notify ${selecteDa?.length} ${selecteDa.length === 1 ? dynamicLabels.deliveryboy_s : dynamicLabels.deliveryboy_p }`}</div>
                        <NotifyImage src='images/notifyImage.png'></NotifyImage>
                        <TextArea
                            onChange={(e: any) => setNotifyMsg(e?.target?.value)}
                            label="Message"
                            className='textarea'
                            labelColor='#000'
                        />
                    </Box>
                </StyledNotifyBox>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' pb='15px' pr='15px' pt='-10px'>
                    <IconButton
                        id='DA-Notify-Modal-Notify'
                        iconVariant='icomoon-ribbon-tick'
                        primary
                        style={{opacity: notifyMsg !== "" ? '1' :'0.65'}}
                        onClick={handleNotify}
                        disabled={notifyMsg === ""}
                    >{dynamicLabels?.notify}
                    </IconButton>
                    <IconButton id='DA-Notify-Modal-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => setShowNotify(false)}>{dynamicLabels.cancel}</IconButton>
                </Box>
            )
        }}
    />

}

export default withRedux(Notify)