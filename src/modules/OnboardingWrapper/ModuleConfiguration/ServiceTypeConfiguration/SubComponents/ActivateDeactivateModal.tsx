import React, {Dispatch} from 'react'
import { IconButton, useToast, Modal, ModalHeader,Box } from 'ui-library';
import { useDispatch } from 'react-redux';
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { IActiveDeactiveConfirmation } from '../ServiceTypeConfiguration.models';


const ActivateDeactivateModal = ({ showActivateDeactivateModal, setShowActivateDeactivateModal, fetchOptions, handleFetchData, statusChangeData, setStatusChangeData }: IActiveDeactiveConfirmation) => {
  
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.serviceTypeConfiguration);
    const toast = useToast();
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

    const handleActivationDeactivation = async () => {
      const payload = statusChangeData.selectedRow
        if (!statusChangeData) {
          return
        }
        try {
          const { data: { message, status } } = await axios.post(`${apiMappings.serviceTypeConfiguration.listView.activateDeactivateServiceType}${payload.serviceTypeDetailsId}&isActive=${statusChangeData.isChecked}`)
          if (status === 200) {
            toast.add(message, 'check-round', false)
            handleFetchData(fetchOptions)
            setStatusChangeData(undefined)
            fetchOptions.apis?.resetSelection()
            setShowActivateDeactivateModal(false)
            return
          }
          throw message
        } catch (errorMessage) {
          toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
    }
    const handleClose = () => {
      setShowActivateDeactivateModal(false)
      setStatusChangeData(undefined)
    }

    return <Modal open={!!showActivateDeactivateModal} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={dynamicLabels.statusConfirmation}
                imageVariant='icomoon-close'
                handleClose={handleClose}
            />,
            content: (
                <>
                    <div style={{ fontSize: '14px' }}>{statusChangeData?.isChecked ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
                </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton id='ServiceTypeConfig-Modal-ActivateDeactivate-Ok' iconVariant='icomoon-tick-circled' primary
                    onClick={() => {
                      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                      setShowActivateDeactivateModal(false)
                      handleActivationDeactivation();
                    }}>{dynamicLabels.ok}
                  </IconButton>
                  <IconButton id='ServiceTypeConfig-Modal-ActivateDeactivate-Cancel' iconVariant='icomoon-close'
                    onClick={() => {
                      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });
                      setShowActivateDeactivateModal(false)
                      setStatusChangeData(undefined)
                      }}>{dynamicLabels.cancel}
                  </IconButton>
              </Box>)
        }}
    </Modal>
}

export default withRedux(ActivateDeactivateModal)