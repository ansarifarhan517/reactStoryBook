
import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux';
import { useToast } from 'ui-library'
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { tShipperListViewAcions } from './ShipperListView.actions';
import UploadExcel from '../../../utils/wrapper/uploadExcel'
import ActivationConfirmation from './SubComponent/ActivationConfirmation';
import InCompleteShipperModal from './SubComponent/IncompleteShipperModal';
import NoOfUserModal from './SubComponent/NoOfUsersModal'
import RejectConfirmation from './SubComponent/RejectConfirmation';





const ShipperModals = () => {
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)

    const toast = useToast()

    const shipperActivationRequest = useTypedSelector(state => state.shipper.listView.shipperActivationRequest)
    const noOfUsersModal = useTypedSelector(state => state.shipper.listView.noOfUsersModal)
    const showApproveModal = useTypedSelector(state => state.shipper.listView.approvalModal)
    const rejectModal = useTypedSelector(state => state.shipper.listView.rejectionModal)
    const uploadModal = useTypedSelector(state => state.shipper.listView.uploadModal)
    const fetchOptions = useTypedSelector(state => state.shipper.listView.fetchOptions)
    const deactivationReasonList = useTypedSelector(state => state.shipper.listView.deactivationReasonList)
    const breadcrumbFilter = useTypedSelector(state => state.shipper.listView.breadcrumbFilter)

    /** Cell Callbacks */
    const handleShipperActivation = async (reason: any) => {
        if (!shipperActivationRequest) {
            return
        }

        if (Object.keys(shipperActivationRequest.shipperDetailsId).length === 1) {
            const shipperDetailsId = Number(Object.keys(shipperActivationRequest.shipperDetailsId)[0])
            dispatch({
                type: '@@shipperListView/UPDATE_DATA',
                payload: {
                    shipperDetailsId,
                    isActiveFl: shipperActivationRequest.activeRequest
                }
            })
        }
        const params = shipperActivationRequest.activeRequest ? {
            isActive: true
        } :
            {
                isActive: false,
                deactiveReasonId: reason?.clientRefMasterId,
                deactiveReason: reason?.name
            }
        try {
            const payload = [Number(Object.keys(shipperActivationRequest.shipperDetailsId))]
            const response = await axios.post(apiMappings.shipper.listView.activationRequest, payload, {
                params
            }
            )
            if (response?.data) {
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
                        isLoading: true
                    }
                })
                dispatch({ type: '@@shipperListView/SET_SHIPPER_ACTIVATION', payload: undefined })
                return
            }
        } catch (errorMessage) {
            shipperActivationRequest.failureCallback && shipperActivationRequest.failureCallback(!shipperActivationRequest.activeRequest)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
    }

    return <>
        {/*** No of users modal */}
        {noOfUsersModal.activeRequest &&
            <NoOfUserModal
                noOfUsersModal={noOfUsersModal}
                setNoOfUsersModal={(payload => {
                    dispatch({ type: '@@shipperListView/SET_NO_OF_USERS_MODAL', payload })
                })}
            />
        }
        {/* ACTIVATION CONFIRMATION MODAL */}

        <ActivationConfirmation
            shipperActivationRequest={shipperActivationRequest}
            deactivationReasonList={deactivationReasonList}
            dynamicLabels={dynamicLabels}
            title={dynamicLabels?.statusConfirmation}
            handleShipperActivation={handleShipperActivation}
            setShipperActivationRequest={() => dispatch({ type: '@@shipperListView/SET_SHIPPER_ACTIVATION', payload: undefined })}
            confirmationMessage={
                shipperActivationRequest?.activeRequest
                    ? dynamicLabels?.areYouSureYouWantToMarkAsAcitve
                    : dynamicLabels?.areYouSureYouWantToMarkAsInactive
            }
        />
        {
            showApproveModal && <InCompleteShipperModal
                showModal={showApproveModal}
                setShowModal={() => dispatch({ type: '@@shipperListView/SET_APPROVAL_MODAL', payload: false })}
                onUpdateClick={(token: string) => hybridRouteTo(`shipper/settings/profile?token=${token}`)}
            />
        }{
            rejectModal &&
            <RejectConfirmation
                showModal={rejectModal}
                setShowModal={(value: boolean) => dispatch({ type: '@@shipperListView/SET_REJECT_MODAL', payload: value })}

            />
        }
       
            <UploadExcel
                isOpen={uploadModal}
                featureName='shipper'
                onSuccess={() => {
                    dispatch({ type: '@@shipperListView/SET_UPLOAD_MODAL', payload: false })
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
                }}
                onClose={() => dispatch({ type: '@@shipperListView/SET_UPLOAD_MODAL', payload: false })}
            />
        

    </>

}

export default ShipperModals