import React, {Dispatch} from 'react'
import { IconButton, useToast, Modal, ModalHeader,Box } from 'ui-library';
import { useDispatch } from 'react-redux';
import withRedux from '../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer'
import { IActiveDeactiveConfirmation } from '../TrackersListView/TrackersListView.models';


const ActivateDeactivateModal = ({ fetchOptions, handleFetchData, trackerActivationRequest, setTrackerActivationRequest, setSelectedRows }: IActiveDeactiveConfirmation) => {
  
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.serviceTypeConfiguration);
    const toast = useToast();
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

    const handleActivationDeactivation = async () => {
        if (!trackerActivationRequest) {
          return
        }
        try {
          const { data: { message, status } } = await axios.put(`${apiMappings.tracker.trackers.listView.activateDeactivate}isActive=${trackerActivationRequest.activeRequest}`, 
          trackerActivationRequest.trackerIds)
          if (status === 200) {
            toast.add(message, 'check-round', false)
            handleFetchData(fetchOptions)
            setTrackerActivationRequest(undefined)
            fetchOptions.apis?.resetSelection()
            setSelectedRows({})
            return
          }
          throw toast.add(`${data?.message}`, 'warning', false);
        } catch (error) {
          toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }
    const handleClose = () => {
      setTrackerActivationRequest(undefined)
    }

    return <Modal open={!!trackerActivationRequest} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={dynamicLabels.statusConfirmation}
                imageVariant='icomoon-close'
                handleClose={handleClose}
            />,
            content: (
                <>
                    <div style={{ fontSize: '14px' }}>{trackerActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
                </>),
            footer: (
              <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                  <IconButton id='Trackers-ActivateDeActivate-Modal-Button-Ok' iconVariant='icomoon-tick-circled' primary
                    onClick={() => {
                      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP'})
                      handleActivationDeactivation();
                    }}>{dynamicLabels.ok}
                  </IconButton>
                  <IconButton id='Trackers-ActivateDeActivate-Modal-Button-Cancel' iconVariant='icomoon-close'
                    onClick={() => {
                      globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP'});
                      setTrackerActivationRequest(undefined)
                      }}>{dynamicLabels.cancel}
                  </IconButton>
              </Box>)
        }}
    </Modal>
}

export default withRedux(ActivateDeactivateModal)