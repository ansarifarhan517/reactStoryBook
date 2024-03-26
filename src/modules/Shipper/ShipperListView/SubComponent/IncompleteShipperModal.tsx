

import React, { useEffect, useState } from "react";
import {
    Modal, IconButton, Box, ISelectedRows,
    ModalHeader, useToast
} from "ui-library"
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { StyledFooter } from '../StyledShipperListView';

interface IInCompleteShipper {
    showModal: boolean
    setShowModal: (value: boolean) => void
    onUpdateClick: (token: string) => void
}

const InCompleteShipperModal = ({ showModal, setShowModal, onUpdateClick }: IInCompleteShipper) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
    const selectedRows = useTypedSelector(state => state.shipper.listView.selectedRows)
    
    const toast = useToast()
    const firstSelection = Object.values(selectedRows as ISelectedRows)?.[0]
    const [title, setTitle] = useState<string>(dynamicLabels?.incompleteShipperDetails)
    const [content, setContent] = useState<string>(dynamicLabels?.shipperMandatoryDetailsPending)
    const [loading, setLoading] = useState<boolean>(true)

    const checkValidation = async () => {
        try {
            const { data } = await axios.get(`${apiMappings.shipper.listView.validate}${firstSelection.token}`)
            setLoading(false)
            if (data) {
                setTitle(dynamicLabels?.approveShipperRequestTitle)
                setContent(dynamicLabels?.shipperApproveConfirmation)
            } else {
                setTitle(dynamicLabels?.incompleteShipperDetails)
                setContent(dynamicLabels?.shipperMandatoryDetailsPending)
            }

        } catch (errorMessage) {
            setShowModal(false)
            const message = errorMessage?.response?.data?.message
            toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }

    }
    useEffect(() => {
        checkValidation()
    }, [])

    const onOkClick = async () => {
        try {
            const { data: { status, message} } = await axios.get(`${apiMappings.shipper.listView.approve}${firstSelection.token}`)
            if (status === 200) {
                toast.add(message, 'check-round', false)
                setShowModal(false)
            }

        } catch (errorMessage) {
            setShowModal(false)
            const message = errorMessage?.response?.data?.message
            toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    return !loading ? <Modal open={showModal} onToggle={(value) => { setShowModal(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={title}
                    handleClose={() => {
                        setShowModal(false)
                    }}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '13px',color: '#4c4c4c' }}>
                    <div>{content}</div>
                </div>
            ),
            footer: (
                <StyledFooter>
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>{
                    <IconButton
                         id='shipperListView-IncompleteShipperModal-UpdateNow'
                        iconVariant={`${title === dynamicLabels?.incompleteShipperDetails ? 'icomoon-edit-empty' : 'icomoon-tick-circled'}`}
                        iconSize='md'
                        primary
                        onClick={() => title === dynamicLabels?.incompleteShipperDetails ? onUpdateClick(firstSelection?.token) : onOkClick()}
                    >
                         <span style={{ fontSize: '13px' }}> {title === dynamicLabels?.incompleteShipperDetails ? `${dynamicLabels?.update} ${dynamicLabels.now}` : dynamicLabels?.yes}</span>
                    </IconButton>
                }
                    <IconButton iconVariant='icomoon-close'
                        id='shipperListView-IncompleteShipperModal-Cancel/No'
                        iconSize='md'
                        onClick={() => { setShowModal(false) }}>
                        <span style={{ fontSize: '13px' }}> {title === dynamicLabels?.incompleteShipperDetails ? dynamicLabels?.cancel : dynamicLabels?.no}</span>
                    </IconButton>
                </Box>
                </StyledFooter>
            )
        }}
    /> : null
}
export default InCompleteShipperModal