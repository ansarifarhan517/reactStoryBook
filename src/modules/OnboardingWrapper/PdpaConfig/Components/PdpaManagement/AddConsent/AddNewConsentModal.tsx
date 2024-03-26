import React, { Dispatch, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal,useToast,ModalHeader,TextInput, Box, IconButton} from 'ui-library'
import axios from '../../../../../../utils/axios';
import apiMappings from '../../../../../../utils/apiMapping';
import {BorderButton, ModalWrapperForConsent} from '../PdpaManagementStyledComponent';
import { useDispatch } from 'react-redux';
import { ConsentManagementActions } from '../ConsentManagement.action';
import { AppState, useTypedSelector } from '../../../../../../utils/redux/rootReducer';
import { IConsentManagementListData } from '../ConsentManagement.models';
import useDynamicLabels from '../../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../../common/DynamicLabels/dynamicLabels.mapping';
interface IProps {
  persona: string;
}

export const AddNewConsentModal = ({persona}: IProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [enteredValue, setEnteredValue] = useState<string>('');
    const toast = useToast();
    const history = useHistory();
    const dispatch = useDispatch<Dispatch<ConsentManagementActions>>();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentManagement)
    const commonLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
    const isAddConsentEnabled = useTypedSelector((state:AppState) => state.consentManagement.listview.isAddConsentEnabled);

    const handleInputChange = (e) => {
      setEnteredValue(e.target.value)
    }

    const resetPopup = () => {
      setEnteredValue('')
      setShowModal(false)
    }

    const handleNavigation = async() => {
      try {
        const { data } = await axios.get(`${apiMappings.consent?.management?.nameCheck}${enteredValue}`);
        if (data?.status === 200) {
          !isAddConsentEnabled && dispatch({type: "@@consentManagement/TOGGLE_CONSENT_ACTION", payload: true});
          const initialConsentManagementListState: IConsentManagementListData = {
            isActiveFl: true,
            id: 0,
            persona,
            name: enteredValue,
            options: {
              consentTypeId: 0,
              triggerFields: [],
              showConsentOnLogin: false,
              logout: false,
              expiryDays: null
            }
          }
          dispatch({type: "@@consentManagement/SAVE_CONSENT_ACTIVE_FIELD_DATA", payload: initialConsentManagementListState})
          history.push({ 'pathname': `/${enteredValue}` });
        }
        else if(data?.status === 400){
          toast.add(data.message, 'warning', false);
          return;
        }
      } catch (error) {
         toast.add(`Something went wrong while checking ${dynamicLabels.consentType}`, "warning", false);
      }
       
    }
    return (
      <ModalWrapperForConsent>
        <Modal
          open={showModal}
          onToggle={resetPopup}
          children={{
            triggerComponent: (
              <div>
                <BorderButton
                 id="AddNewConsent-actionbar-add"
                 onClick={()=>setShowModal(true)}>{dynamicLabels.addNewConsent} </BorderButton>
              </div>
            ),
            header: (
                <ModalHeader
                handleClose={resetPopup}
                imageVariant="icomoon-close"
                headerStyle={{ fontSize: "15px" }}
                width="100%"
                headerTitle={dynamicLabels.addConsentPopupTitle}
              />
            ),
            content: (
              <TextInput
              id='someId'
              name='someName'
              className='someClassName'
              label={dynamicLabels.consentType}
              labelColor='#000000'
              placeholder={dynamicLabels.consentTypePlaceholder}
              fullWidth={true}
              maxLength={30}
              onChange={handleInputChange}
            />
            ),
            footer: (
                <Box
                  style={{ padding: "15px" }}
                  horizontalSpacing="15px"
                  display="flex"
                  justifyContent="flex-end"
                  className="footer-cont"
                >
                  <IconButton
                    primary
                    id="ConsentFormManagement-actionBar-proceed"
                    iconVariant="icomoon-save"
                    style={{ padding: "0px 15px" }}
                    disabled={enteredValue.length === 0}
                    onClick={handleNavigation}
                  >
                  <span style={{fontSize:"13px"}}>{dynamicLabels.addConsentName}</span>
                  </IconButton>
                  <IconButton
                    id="ConsentFormManagement-actionBar-close"
                    iconVariant="icomoon-close"
                    style={{ padding: "0px 15px"}}
                    onClick={resetPopup}
                  >
                   <span style={{fontSize:"13px"}}>{commonLabels.cancel} </span>
                  </IconButton>
                </Box>
              ),
          }}
        />
        </ModalWrapperForConsent>
    )
  }
  