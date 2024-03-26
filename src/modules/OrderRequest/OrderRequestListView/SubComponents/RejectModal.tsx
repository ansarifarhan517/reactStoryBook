

import React, { Dispatch, useState } from "react";
import { useDispatch } from 'react-redux';
import {
    Modal, IconButton, Box, ISelectedRows, FontIcon,
    ModalHeader, useToast, DropDown
} from "ui-library"
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { tOrderRequestListViewAcions } from '../OrderRequestListView.actions';
import { StyledFooter, StyledRejectList } from '../StyledOrderRequestListView';



interface IRejectModal {
    showModal: boolean
    setShowModal: (value: boolean) => void
}


const RejectModal = ({ showModal, setShowModal }: IRejectModal) => {

    const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.orderRequest)
    const selectedRows = useTypedSelector(state => state.orderRequest.listView.selectedRows)
    const rejectReasonList = useTypedSelector(state => state.orderRequest.listView.rejectReasonList)
    const fetchOptions = useTypedSelector(state => state.orderRequest.listView.fetchOptions)
    const firstReason = rejectReasonList?.[0]?.value

    const [reason, setReason] = useState<string>('')
    const toast = useToast()
    console.log(reason, 'reason')

    const onReject = async (isNotify: boolean) => {
        const payload = {
            ids: Object.values(selectedRows as ISelectedRows).map(row => Number(row.bookingId)),
            isNotify,
            reason: reason,
            reasonId: rejectReasonList.find(entry => entry.value === reason).id
        }
        try {
            const { data: { status, message } } = await axios.put(`${apiMappings.orderRequest.listView.reject}`, payload)
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
                    headerTitle={`${dynamicLabels?.rejectBookingRequest}`}
                    handleClose={() => {
                        setShowModal(false)
                    }}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (<StyledRejectList reason={firstReason === reason ? undefined : reason}>
                <div>{dynamicLabels?.areYouSureRejectOrderRequest || 'Are you sure you want to reject selected Shipment request(s) ?'}</div>
                <br />
                <Box horizontalSpacing='5px' pb='15px'>
                    <FontIcon color='error.main' variant='icomoon-warning-circled' size={13} />
                    <span>{dynamicLabels?.youCantUndoThisAction}</span>
                </Box>
                <DropDown
                    variant='form-select'
                    id='reasonlist'
                    optionList={rejectReasonList}
                    label={dynamicLabels?.reason || 'Reason'}
                    onChange={(value: any) => {
                        setReason(value)
                    }
                    }
                    placeholder={dynamicLabels?.rejectShipperReasonSelectPlacholder || 'Select A Reason For Rejection'}
                    value={reason}
                    required
                />
            </StyledRejectList>),
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
                        <IconButton
                            id='orderRequest-modal-button-reject'
                            iconVariant='delete-tab'
                            primary
                            style={{ opacity: reason !== "" ? '1' : '0.65' }}
                            onClick={() => onReject(false)}
                            disabled={!reason}
                        >
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.reject || 'Reject'}</span>
                        </IconButton>
                        <IconButton
                            iconVariant='delete-tab'
                            id='orderRequest-modal-button-rejectAndNotify'
                            primary
                            style={{ opacity: reason !== "" ? '1' : '0.65' }}
                            onClick={() => onReject(true)}
                            disabled={!reason}
                        >
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.rejectAndNotify || 'Reject & Notify'}</span>
                        </IconButton>
                        <IconButton id='orderRequest-modal-button-close' iconVariant='icomoon-close' iconSize={11} onClick={() => setShowModal(false)}>
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.close || 'Close'}</span>
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    />

}
export default RejectModal