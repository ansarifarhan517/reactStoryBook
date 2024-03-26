
import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux';
//import { useToast } from 'ui-library'

import { useTypedSelector } from '../../../../utils/redux/rootReducer';
// import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
// import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { tOrderRequestListViewAcions } from '../../OrderRequestListView/OrderRequestListView.actions';
import ApprovalModal from './ApprovalModal';
import UploadExcel from '../../../../utils/wrapper/uploadExcel'
import RejectModal from './RejectModal';





const OrderRequestModals = () => {
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tOrderRequestListViewAcions>>()
    // const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.orderRequest)

    // const toast = useToast()



    const uploadModal = useTypedSelector(state => state.orderRequest.listView.uploadModal)
    const fetchOptions = useTypedSelector(state => state.orderRequest.listView.fetchOptions)
    const approveModal = useTypedSelector(state => state.orderRequest.listView.approveModal)
    const rejectionModal = useTypedSelector(state => state.orderRequest.listView.rejectionModal)


    // const clientId = useTypedSelector(state => state.orderRequest.listView.clientId);
    // const userId = useTypedSelector(state => state.orderRequest.listView.userId);



    return <>
        {approveModal &&<ApprovalModal
            showModal={approveModal}
            setShowModal={(isShowModal) => dispatch({ type: '@@orderRequestListView/SET_APPROVE_MODAL', payload: isShowModal })}

        />}
        {rejectionModal && <RejectModal
         showModal={rejectionModal}
         setShowModal={(isShowModal) => dispatch({ type: '@@orderRequestListView/SET_REJECT_MODAL', payload: isShowModal })}
        />}


            <UploadExcel
                isOpen={uploadModal}
                featureName='orderRequest'
                onSuccess={() => {
                    dispatch({ type: '@@orderRequestListView/SET_UPLOAD_MODAL', payload: false })
                    dispatch({
                        type: '@@orderRequestListView/FETCH_DATA',
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
                onClose={() => dispatch({ type: '@@orderRequestListView/SET_UPLOAD_MODAL', payload: false })}
            />
        

    </>

}

export default OrderRequestModals