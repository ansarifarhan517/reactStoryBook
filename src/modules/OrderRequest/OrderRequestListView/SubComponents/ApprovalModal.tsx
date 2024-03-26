

import React, { Dispatch } from "react";
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    Modal, IconButton, Box, ISelectedRows,
    ModalHeader, useToast
} from "ui-library"
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { tOrderRequestListViewAcions } from '../OrderRequestListView.actions';



interface IApprovalModal {
    showModal: boolean
    setShowModal: (value: boolean) => void
}
const StyledFooter = styled.div`
button {
  i {
      margin-top: 5px;
      font-size: 16px;
  }
}

`

const ApprovalModal = ({ showModal, setShowModal }: IApprovalModal) => {

    const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.orderRequest)

    const selectedRows = useTypedSelector(state => state.orderRequest.listView.selectedRows)
    const fetchOptions = useTypedSelector(state => state.orderRequest.listView.fetchOptions)

    const toast = useToast()

    const onApprove = async (isNotify: boolean) => {
        const payload = {
            ids: Object.values(selectedRows as ISelectedRows).map(row => Number(row.bookingId)),
            isNotify
        }
        try {
            const { data: { status, message } } = await axios.put(`${apiMappings.orderRequest.listView.approve}`, payload)
            if (status === 200) {
                dispatch({
                    type: '@@orderRequestListView/FETCH_DATA',
                    payload: {
                        pageNumber: fetchOptions?.pageNumber,
                        pageSize: fetchOptions?.pageSize,
                        searchBy: fetchOptions?.filterOptions?.searchBy,
                        searchText: fetchOptions?.filterOptions?.searchText,
                        sortBy: fetchOptions?.sortOptions?.sortBy,
                        sortOrder: fetchOptions?.sortOptions?.sortOrder,
                        isLoading: true
                    }
                })
                fetchOptions.apis?.resetSelection();
                toast.add(message, 'check-round', false)
                setShowModal(false)
            }

        } catch (errorMessage) {
            setShowModal(false)
            const message = errorMessage?.response?.data?.message
            toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }



    return <Modal open={showModal} onToggle={(value) => { setShowModal(value) }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={`${dynamicLabels?.approve} ${dynamicLabels?.booking_s}`|| "Approve Shipment Request"}
                    handleClose={() => {
                        setShowModal(false)
                    }}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '13px', color: '#4c4c4c' }}>
                    <div>{dynamicLabels?.areYouSureApproveOrderRequest || 'Are you sure you want to approve Shipment Request?'}</div>
                </div>
            ),
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton
                            id='orderRequest-ApprovalModal-button-Approve'
                            iconVariant='icomoon-tick-circled'
                            iconSize='md'
                            primary
                            onClick={() => onApprove(false)}
                        >
                            <span style={{ fontSize: '13px' }}>{dynamicLabels?.approve || 'Approve'}</span>
                        </IconButton>
                        <IconButton
                             id='orderRequest-ApprovalModal-button-ApproveNotify'
                            iconVariant='accept-notify'
                            iconSize='md'
                            primary
                            onClick={() => onApprove(true)}
                        >
                            <span style={{ fontSize: '13px' }}>{dynamicLabels?.approveAndNotify || 'Approve & Notify'}</span>
                        </IconButton>

                        <IconButton iconVariant='icomoon-close'
                            id='orderRequest-ApprovalModal-button-Cancel'
                            iconSize='md'
                            onClick={() => { setShowModal(false) }}>
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.cancel || 'Cancel'}</span>
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    />
}
export default ApprovalModal