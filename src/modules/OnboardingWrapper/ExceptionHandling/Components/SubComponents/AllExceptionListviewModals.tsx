import React, { Dispatch, SetStateAction } from "react";
import { IconButton, FontIcon } from 'ui-library';
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DeleteConfirmationModal from '../../../../../utils/components/DeleteConfirmationModal';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { useDispatch } from 'react-redux';

interface IAllExceptionListviewModalsProps {
    modalType: string;
    isModalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    modalWidth: string
    deleteException: Function
    isDeleteError: boolean;
    markException: Function;
    isUpdateError: boolean;
    activeInactiveCount: number;
}
const AllExceptionListviewModals = (props: IAllExceptionListviewModalsProps) => {
    const { modalType, isModalOpen, setModalOpen, deleteException, isDeleteError, markException, isUpdateError, activeInactiveCount } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling);
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    
    {(modalType == 'active' || modalType == 'inActive' || (modalType === 'delete' && isDeleteError)) && 
    globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.statusConfirmation,
          onClose: () => {
            setModalOpen(false)
          },
          content: (
                <>
                    {modalType === 'delete' && isDeleteError ?
                        <>
                            <FontIcon color='error.main' variant='icomoon-warning-circled' size={13} />
                            <span> {dynamicLabels?.resolveExceptionBeforeDelete}</span>
                        </> 
                    :   <>
                            {modalType === 'active' ?
                                isUpdateError ?
                                    <span>{activeInactiveCount} {dynamicLabels?.exceptionActiveMode}</span>
                                    :
                                    <span>{dynamicLabels?.areYouSureYouWantToMarkAsAcitve}</span>
                                :
                                isUpdateError ?
                                    <span>{activeInactiveCount} {dynamicLabels?.exceptionInActiveMode}</span>
                                    :
                                    <span>{dynamicLabels?.areYouSureYouWantToMarkAsInactive}</span>
                            }
                        </>}
                </>
                ),
                  footer: (
                    <>
                        {(modalType === 'delete' && isDeleteError) ?
                            <IconButton id='allExceptionsList-delete-button-Ok' primary iconVariant="icomoon-tick-circled" onClick={() => {setModalOpen(false), globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}} >{dynamicLabels.ok}</IconButton>
                        : modalType === 'active' || 'inActive' ?
                            isUpdateError ?
                                <IconButton id={`allExceptionsList-Modal--${modalType}-button-Ok`} primary iconVariant="icomoon-tick-circled" onClick={() => {setModalOpen(false), globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}}>{dynamicLabels.ok}</IconButton>
                            :
                                <>
                                    <IconButton id={`allExceptionsList-Modal--${modalType}-button-Ok`} primary iconVariant="icomoon-tick-circled" onClick={() => {markException(modalType) ,globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}} >{dynamicLabels.ok}</IconButton>
                                    <IconButton id={`allExceptionsList-Modal--${modalType}-button-cancel`} onClick={() => {setModalOpen(false), globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}} iconVariant="cancel-button">{dynamicLabels.cancel}</IconButton>
                                </>
                        : <></>
                        }
                    </>
                )
        }
      })
}
    return ((modalType === 'delete' && !isDeleteError) ? 
        <DeleteConfirmationModal
            showDeletionConfirmation={isModalOpen}
            setShowDeletionConfirmation={(value: boolean) => setModalOpen(value)}
            deleteSelectedRows={deleteException}
            featureName='exception'
        /> :
        <></>
    )
}

export default AllExceptionListviewModals;