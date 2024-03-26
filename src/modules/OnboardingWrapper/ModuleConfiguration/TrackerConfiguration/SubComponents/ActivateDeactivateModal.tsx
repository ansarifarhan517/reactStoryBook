import React, {Dispatch} from 'react'
import { IconButton, useToast, Modal, ModalHeader,Box } from 'ui-library';
import { useDispatch } from 'react-redux';
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { IActiveDeactiveConfirmation } from '../TrackerConfiguration.models';


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
          const { data: data } = await axios.put(`${apiMappings.tracker.trackerConfiguration.listView.activateDeactivate}${payload.trackerConfigId}&isActive=${statusChangeData.isChecked}`)
          if (data.status === 200) {
            toast.add(data?.message, 'check-round', false)
            handleFetchData(fetchOptions)
            setStatusChangeData(undefined)
            fetchOptions.apis?.resetSelection()
            setShowActivateDeactivateModal(false)
            return
          }
          throw toast.add(`${data?.message}`, 'warning', false);
        } catch (error) {
          toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
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
                  <IconButton id='TrackerConfig-Modal-ActivateDeactivate-Ok' iconVariant='icomoon-tick-circled' primary
                    onClick={() => {
                      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                      setShowActivateDeactivateModal(false)
                      handleActivationDeactivation();
                    }}>{dynamicLabels.ok}
                  </IconButton>
                  <IconButton id='TrackerConfig-Modal-ActivateDeactivate-Cancel' iconVariant='icomoon-close'
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