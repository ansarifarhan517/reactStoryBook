import React, {Dispatch} from 'react'
import { IconButton, useToast } from 'ui-library';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';
import withRedux from '../../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import { IActiveDeactiveConfirmation } from '../../TerritoryList.models';
import { tTerritoryListActions } from '../../TerritoryList.actions';
import axios from '../../../../../utils/axios';
import apiMappings from '../../../../../utils/apiMapping';
import { ModalContentWrapper } from './../../StyledTerritoryList';
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'


const ActivateDeactivateModal = ({ territoryActivationRequest, setTerritoryActivationRequest, fetchOptions, handleFetchData, setSelectedRows, setEditMode }: IActiveDeactiveConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence);
    const dispatch = useDispatch<Dispatch<tTerritoryListActions>>();
    const breadcrumbState = useTypedSelector(state => state.territory.listView.breadcrumbState);
    const toast = useToast();
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const handleTerritoryActivation = async () => {
        if (!territoryActivationRequest) {
          return
        }
        setTerritoryActivationRequest(undefined)
    
    
        if (Object.keys(territoryActivationRequest.geofenceIds).length === 1) {
          const geofenceId = Number(Object.keys(territoryActivationRequest.geofenceIds)[0])
          dispatch({
            type: '@@territoryList/UPDATE_DATA',
            payload: {
                geofenceId,
                isActiveFl: territoryActivationRequest.activeRequest,
                geofenceProfileId: Number(breadcrumbState)
            }
          })
        }
        try {
          const { data: { message, status } } = await axios.put(apiMappings.geofenceMaster.listView.updateStatus,
            Object.keys(territoryActivationRequest.geofenceIds)
              .map(id => ({
                geofenceId: Number(id),
                isActiveFl: territoryActivationRequest.activeRequest,
                geofenceProfileId: Number(breadcrumbState)
              }))
          )
          if (status === 200) {
            toast.add(message, 'check-round', false)
            handleFetchData(fetchOptions)
            setSelectedRows({})
            fetchOptions.apis?.resetSelection()
            setEditMode(false)
            return
          }
          throw message
        } catch (errorMessage) {
          territoryActivationRequest.failureCallback && territoryActivationRequest.failureCallback(!territoryActivationRequest.activeRequest)
          toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
      }

      globalPopupDispatch({
        type: '@@globalPopup/SET_PROPS',
        payload: {
          isOpen: true,
          title: dynamicLabels.statusConfirmation,
          onClose: () => {
            territoryActivationRequest?.failureCallback && territoryActivationRequest?.failureCallback(!territoryActivationRequest.activeRequest)
            setTerritoryActivationRequest(undefined)
          },
          content: (
            <>
              <ModalContentWrapper>
                <div>
                  {territoryActivationRequest?.message}
                </div>
                <div>
                  {territoryActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}
                </div>
              </ModalContentWrapper>
            </>),
          footer: (<>
            <IconButton id='Territories-ActivateDeActivate-Modal-Button-Ok' iconVariant='icomoon-tick-circled' primary
              onClick={() => {
                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                handleTerritoryActivation();
              }}>{dynamicLabels.ok}</IconButton>
            <IconButton id='Territories-ActivateDeActivate-Modal-Button-Cancel' iconVariant='icomoon-close'
              onClick={() => {
                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' });
                territoryActivationRequest?.failureCallback && territoryActivationRequest?.failureCallback(!territoryActivationRequest.activeRequest)
                setTerritoryActivationRequest(undefined)
                }}>{dynamicLabels.cancel}</IconButton>
          </>)
        }
      })

    return <></>
}

export default withRedux(ActivateDeactivateModal)