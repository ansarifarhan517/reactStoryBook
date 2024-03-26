import React, { Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, FontIcon, Modal, ModalHeader, IconButton, DropDown, useToast,ISelectedRows } from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { tShipperListViewAcions } from '../ShipperListView.actions'
import { IStatusList } from '../ShipperListView.models'
import { StyledFooter, StyledRejectList } from '../StyledShipperListView'
import { IRejectConfirmation } from './SubComponent.models'



const RejectConfirmation = ({ showModal, setShowModal, page }: IRejectConfirmation) => {
    const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
    const isFormView = page=='ShipperForm';
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
    const rejectReasonList = useTypedSelector(state => state.shipper.listView.rejectReasonList)
    const selectedRows = useTypedSelector(state => state.shipper.listView.selectedRows)
    const fetchOptions = useTypedSelector(state => state.shipper.listView.fetchOptions)
    const breadcrumbFilter = useTypedSelector(state => state.shipper.listView.breadcrumbFilter)
    const selectedShipper = useTypedSelector(state => state.shipper.form.shipperData?.shipperDetailsId)


    const firstReason = rejectReasonList?.[0]?.value

    const [reason, setReason] = useState<string>('')
    const toast = useToast()

    const onRejectClick = async () => {
        const payload = Object.keys(selectedRows as ISelectedRows).length? Object.keys(selectedRows as ISelectedRows): [selectedShipper]
        const selectedReason = rejectReasonList?.find((reasonObj: IStatusList) => reasonObj.value === reason)

        try {
           const { status} =  await axios.post(`${apiMappings.shipper.listView.reject}`, payload, {
                params: {
                    rejectReasonId: selectedReason?.clientRefMasterId,
                    rejectReason: selectedReason?.name
                }
            })
            if(status==200){
                toast.add(dynamicLabels.shipperRejectedSuccessfully || ("Shipper rejected Successfully"), 'check-round', false)
                if(selectedShipper){
                    setTimeout(()=>{
                        hybridRouteTo('shipper')
                    }, 2000) 
                }
                else{
                    dispatch({
                        type: '@@shipperListView/FETCH_DATA',
                        payload: {
                          pageNumber: fetchOptions?.pageNumber,
                          pageSize: fetchOptions?.pageSize,
                          searchBy: fetchOptions?.filterOptions?.searchBy,
                          searchText: fetchOptions?.filterOptions?.searchText,
                          sortBy: fetchOptions?.sortOptions?.sortBy,
                          sortOrder: fetchOptions?.sortOptions?.sortOrder,
                          page: breadcrumbFilter,
                          isLoading: false
                        }
                      })
                }
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
                    headerTitle={isFormView ? dynamicLabels.rejectShipper : dynamicLabels?.rejectSignupRequest}
                    handleClose={() => setShowModal(false)}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                    width='100%'
                />
            ),
            content: (
                <StyledRejectList reason={firstReason === reason ? undefined : reason}>
                    <div>{isFormView ? dynamicLabels?.youSureRejectShipper : dynamicLabels?.areYouSureRejectShipper}</div>
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
                </StyledRejectList>
            ),
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px' >
                        <IconButton
                            id='Reject-Shipper-Modal'
                            iconVariant='icomoon-delete-empty'
                            primary
                            onClick={() => onRejectClick()}
                            disabled={!reason}
                        >
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.reject || 'Reject'}</span>
                        </IconButton>
                        <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => setShowModal(false)}>
                            <span style={{ fontSize: '13px' }}> {dynamicLabels?.close || 'Close'}</span>
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    />
}

export default RejectConfirmation