
import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux';
import { useToast } from 'ui-library'
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { sendGA } from '../../../utils/ga';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions';
import ActivationConfirmation from './ActivationConfirmation'
import UploadExcel from '../../../utils/wrapper/uploadExcel';





const FleetTypeModals = () => {
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.fleet)

    const toast = useToast()

    const fleetActivationRequest = useTypedSelector(state => state.fleet.listView.fleetActivationRequest)

    const uploadModal = useTypedSelector(state => state.fleet.listView.uploadModal)
    const fetchOptions = useTypedSelector(state => state.fleet.listView.fetchOptions)
    // const clientId = useTypedSelector(state => state.fleet.listView.clientId);
    // const userId = useTypedSelector(state => state.fleet.listView.userId);
    // const editConfirmationModal = useTypedSelector(state => state.fleet.listView.editConfirmationModal)

    /** Cell Callbacks */
    const handleFleetActivation = async () => {

        if (!fleetActivationRequest) {
            return
        }

        try {
            const payload = [Number(Object.keys(fleetActivationRequest.id))]
            const   {data: { message, status }} = await axios.put(apiMappings.fleet.listView.activationRequest, payload, {
                params: { isActive: !!fleetActivationRequest.activeRequest }
            }
            )
            if (status === 200) {
                toast.add(message, 'check-round', false)
                sendGA('Event New' ,`Fleet type List View - Toggle ${fleetActivationRequest.activeRequest ? 'Active' : 'Inactive'}`)
                const fleetId = Number(Object.keys(fleetActivationRequest.id)[0])
                dispatch({
                    type: '@@fleetTypeListView/UPDATE_DATA',
                    payload: {
                        id: fleetId,
                        isActiveFl: fleetActivationRequest.activeRequest
                    }
                })
                dispatch({
                    type: '@@fleetTypeListView/FETCH_DATA',
                    payload: {
                        pageNumber: fetchOptions?.pageNumber,
                        pageSize: fetchOptions?.pageSize,
                        searchBy: fetchOptions?.filterOptions?.searchBy,
                        searchText: fetchOptions?.filterOptions?.searchText,
                        sortBy: fetchOptions?.sortOptions?.sortBy,
                        sortOrder: fetchOptions?.sortOptions?.sortOrder,
                        isLoading: false
                    }
                })
                dispatch({ type: '@@fleetTypeListView/SET_FLEET_ACTIVATION', payload: undefined })
                return
            }
        } catch (errorMessage) {
            fleetActivationRequest.failureCallback && fleetActivationRequest.failureCallback(!fleetActivationRequest.activeRequest)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
    }

    return <>

        {/* ACTIVATION CONFIRMATION MODAL */}
        <ActivationConfirmation
            isShowActivationConfirmation={!!fleetActivationRequest?.showModal}
            title={dynamicLabels?.statusConfirmation}
            footerButtonGroup={[
                {
                    iconVariant: 'icomoon-tick-circled',
                    onClick: handleFleetActivation,
                    primary: true,
                    label: dynamicLabels?.ok,
                    isVisible: true,
                },
                {
                    iconVariant: 'icomoon-close',
                    onClick: () => {
                        fleetActivationRequest?.failureCallback && fleetActivationRequest?.failureCallback(!fleetActivationRequest.activeRequest);
                        dispatch({ type: '@@fleetTypeListView/SET_FLEET_ACTIVATION', payload: undefined })
                    },
                    primary: false,
                    label: dynamicLabels?.cancel,
                    isVisible: true,
                },
            ]}
            confirmationMessage={
                fleetActivationRequest?.activeRequest
                    ? dynamicLabels?.areYouSureYouWantToMarkAsAcitve
                    : dynamicLabels?.areYouSureYouWantToMarkAsInactive
            }
            handleClose={() => {
                fleetActivationRequest?.failureCallback && fleetActivationRequest?.failureCallback(!fleetActivationRequest.activeRequest);
                dispatch({ type: '@@fleetTypeListView/SET_FLEET_ACTIVATION', payload: undefined })
            }}
        />

            <UploadExcel
                isOpen={uploadModal}
                featureName='fleetType'
                onSuccess={() => {
                    dispatch({ type: '@@fleetTypeListView/SET_UPLOAD_MODAL', payload: false })
                    dispatch({
                        type: '@@fleetTypeListView/FETCH_DATA',
                        payload: {
                            pageNumber: fetchOptions?.pageNumber,
                            pageSize: fetchOptions?.pageSize,
                            searchBy: fetchOptions?.filterOptions?.searchBy,
                            searchText: fetchOptions?.filterOptions?.searchText,
                            sortBy: fetchOptions?.sortOptions?.sortBy,
                            sortOrder: fetchOptions?.sortOptions?.sortOrder,
                            isLoading: false
                        }
                    })
                }}
                onClose={() => dispatch({ type: '@@fleetTypeListView/SET_UPLOAD_MODAL', payload: false })}
            />
        

    </>

}

export default FleetTypeModals