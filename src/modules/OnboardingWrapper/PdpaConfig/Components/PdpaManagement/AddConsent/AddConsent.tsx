import React, { useState, useEffect, Dispatch } from "react";
import { useDispatch } from 'react-redux';
import axios from "../../../../../../utils/axios";
import apiMappings from "../../../../../../utils/apiMapping";
import { useHistory } from 'react-router-dom';
import { Box, Tooltip, Accordion,useToast, IconButton, AccordionHeaderTitle, AccordionHeaderSubTitle, Typography, Loader } from 'ui-library'
import {AddNewConsentModal} from './AddNewConsentModal'
import {StyledCard, StyledFontContainer,BoxStyle, OuterBox} from '../PdpaManagementStyledComponent'
import useDynamicLabels from "../../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../../common/DynamicLabels/dynamicLabels.mapping";
import { ConsentManagementActions } from "../ConsentManagement.action";
import { AppState, useTypedSelector } from "../../../../../../utils/redux/rootReducer";
import { IConsentManagementListData } from "../ConsentManagement.models";
import { PdpaConfigActions } from "../../PdpaConfig.action";
import { ProfileDetailsCard } from "../../../../AlertProfilesMaster/styles";

const AddConsent = () => {
    const history = useHistory();
    const [expendable, setExpendable] = useState<boolean>(false)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentManagement)
    const dispatch = useDispatch<Dispatch<ConsentManagementActions | PdpaConfigActions>>();
    const loading = useTypedSelector(state => state.consentManagement.listview.loading);
    const consentManagementListData = useTypedSelector((state: AppState) => state.consentManagement.listview.data);
    const {uniquePersonas, data} = consentManagementListData;
    const toast = useToast();

    const handleToggle = () => {
        setExpendable(!expendable)
    }

    const handleEditConsent = (consent: IConsentManagementListData) => {
        dispatch({type: "@@consentManagement/TOGGLE_CONSENT_ACTION", payload: false}); // false to denote EDIT action
        dispatch({type: "@@consentManagement/SAVE_CONSENT_ACTIVE_FIELD_DATA", payload: consent})
        history.push({ 'pathname': `/${consent.name}` });
    }
    
    const handleDeleteConsent = async(id) => {
        try {
            const data = await axios.delete(`${apiMappings.consent?.management?.deleteConsent}${id}`);
            const status = data?.status
            if (status === 200) {
              toast.add(data.data.message ? data.data.message : "Success", "check-round", false);
              dispatch({type:'@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW'})
              return;
            }
          } catch (error) {
            console.log("Failed to Delete consent: ", error);
            const message = error?.response?.data?.message
            toast.add(message || dynamicLabels.somethingWentWrong, 'warning', false)
          }
    }

    useEffect(() =>{
        dispatch({type:'@@consentManagement/FETCH_CONSENT_TYPE_DETAILS_LISTVIEW'})
        dispatch({ type: "@@PROTECTIONCONFIG/SET_VIEW_TYPE", payload: {viewType:"List"} })
    },[])

    return (
        <>
        {loading &&  <Loader center={true} speed={1}/>}
        {uniquePersonas && !!uniquePersonas.length &&
         <StyledCard>
          {uniquePersonas?.map((item: string, index:number) => { 
           return <Accordion key={index} id={item} expanded={expendable} hideChevron={false} onToggle={() => handleToggle()}>
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>
                            {item === "DELIVERYMEDIUM" ? dynamicLabels.deliveryboy_s : item}
                            </AccordionHeaderTitle>
                            <AccordionHeaderSubTitle>
                            {dynamicLabels?.consentPersonaSubtitle}
                            </AccordionHeaderSubTitle>
                        </>
                    ),
                    content: (
                        <>
                        <div style={OuterBox}>
                          {data && data.length > 0 && 
                            data.map((consent:IConsentManagementListData) => {
                            return consent?.persona === item && (    
                                <Box flexGrow={1} style={{marginTop:"5px"}}>
                                <ProfileDetailsCard>
                                  <Box flexGrow={1} display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start'>
                                    <div className='header'> {consent?.name}</div>
                                  </Box>
                                  <Box className='profile-actions-container' display='flex' horizontalSpacing='10px'>
                                    <Tooltip message={dynamicLabels?.editConsent} hover tooltipDirection='bottom'>
                                      <IconButton className='profile-actions' 
                                      onlyIcon iconVariant='icomoon-edit-empty' 
                                      id="EditConsent-actionbar-edit"
                                      style={{ color: '#666' }}
                                        onClick={()=>handleEditConsent(consent)}
                                      />
                                    </Tooltip>
                                    <Tooltip
                                      message={dynamicLabels?.deleteConsent}
                                      hover tooltipDirection='bottom' messagePlacement='end'>
                                      <IconButton  className='profile-actions' 
                                      onlyIcon iconVariant='icomoon-delete-empty' 
                                      id="DeleteConsent-actionbar-delete"
                                      style={{ color: '#666' }}
                                        onClick={()=>handleDeleteConsent(consent?.id)}
                                      />
                                    </Tooltip>
                                  </Box>
                                </ProfileDetailsCard>
                              </Box>
                            )
                            })}
                            <AddNewConsentModal persona={item}/>
                        </div>
                    </>
                    )
                }}
            </Accordion>
          })}
           </StyledCard>
        
}
        </>)
}

export default AddConsent

