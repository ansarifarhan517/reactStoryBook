import React, { Dispatch } from 'react';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { Modal, ModalHeader, Box, IconButton } from 'ui-library'
import { useDispatch } from 'react-redux';
import { IPlansFormActions } from '../PlansForm.model';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import { IEditModePopup } from './EditModePopup';

const ScheduledChangesPopup = ({ handleSubmitForm }: IEditModePopup) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.saas.plans);
    const scheduledChangesDiscardPopup = useTypedSelector(state => state.saas.plans.scheduledChangesDiscardPopup)
    const dispatch = useDispatch<Dispatch<IPlansFormActions>>()
    return <Modal open={scheduledChangesDiscardPopup}
        onToggle={(value) => { 
            dispatch({ type: '@@plansForm/SET_IS_DISCARD', payload: undefined });
            dispatch({ type: '@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP', payload: value }) 
          
        }}
        width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle='Override Scheduled Changes'
                    handleClose={() => {
                        dispatch({ type: '@@plansForm/SET_IS_DISCARD', payload: undefined });
                        dispatch({ type: '@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP', payload: false })
                        
                    }}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <div style={{ fontSize: '14px' }}>
                    <Box horizontalSpacing='5px'>
                        <span style={{ lineHeight: '30px' }}>There are already some scheduled changes on the subscription. Those changes will be discarded if you update the subscription. Do you want to continue?</span>
                    </Box>
                </div>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton
                        iconVariant='icomoon-delete-empty'
                        primary
                        onClick={() => {
                            handleSubmitForm(true)
                        }}>{dynamicLabels?.confirm || 'Confirm'}</IconButton>
                    <IconButton
                        iconVariant='icomoon-close'
                        iconSize={11}
                        onClick={() => {
                            dispatch({ type: '@@plansForm/SET_IS_DISCARD', payload: undefined });
                            dispatch({ type: '@@plansForm/SET_SCHEDULED_CHANGES_DISCARD_POPUP', payload: false });
                           // handleSubmitForm(false)
                          
                        }
                        }
                    >{dynamicLabels.cancel}</IconButton>
                </Box>
            )
        }}
    />
}


export default ScheduledChangesPopup