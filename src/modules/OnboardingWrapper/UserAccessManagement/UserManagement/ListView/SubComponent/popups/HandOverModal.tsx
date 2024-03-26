import React, { Dispatch, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalHeader, IconButton, DropDown, ModalFooter, useToast } from "ui-library";
import apiMappings from "../../../../../../../utils/apiMapping";
import axios from "../../../../../../../utils/axios";
import { useTypedSelector } from "../../../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../../../common/DynamicLabels/useDynamicLabels";
import { UserManagementActions } from "../../UserManagement.actions";
import { IHandOverDropDownOptions } from "../SubComponent.models";

const HandOverModal = (props : any) => {
    const {showHandOverModal, setShowHandOverModal, handOverData, setHandOverData,  fetchOptions, handleFetchData, setSelectedRows} = props
    const dynamicLabels = useDynamicLabels(`handOver,${handOverData.persona}`);
    const handOverOptions = useTypedSelector(state => state.settings.userManagement.listView.handOverOptions);
    const dispatch = useDispatch<Dispatch<UserManagementActions>>();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>();
    const [retry, setRetryValue] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    React.useEffect(() => {
      if (handOverData?.handOverId && handOverData?.toUserId) {
        fetchEmailbyFromUserId(handOverData?.toUserId)
      } else {
        dispatch({type: "@@userManagement/FETCH_USER_OPTIONS", payload : handOverData.userGroupId});
      }
    }, [])

    const fetchEmailbyFromUserId = async (userId : number) => {
      try {
        const {data : {data, status}} = await axios.get(`${apiMappings.userManagement.form.getUser}?userId=${userId}`)
        if (status == 200) {
          setRetryValue(data)
          setValue(data?.emailAddress)
        }
      } catch (error) {
        console.log("Error Occured");
      }
    }

    const optionList = useMemo(() => {
      return handOverOptions.map(o => {
        if (handOverData.emailAddress !== o.emailAddress) {
          return { label: o.emailAddress, value: o.userId }
        }
        return {label : o.emailAddress, value: o.userId}
      })
    }, [handOverOptions])
  
    
      const optionsMap: Record<string, IHandOverDropDownOptions> = useMemo(() => {
        return handOverOptions.reduce((accumulator, current) => ({ ...accumulator, [current.userId]: current }), {})
      }, [handOverOptions])

      const handleClose = () => {
          setShowHandOverModal(false)
          setHandOverData(undefined)
          handleFetchData(fetchOptions)
          fetchOptions.apis?.resetSelection();
      }

      const handleSubmit = async () => {
          try {
              setIsLoading(true)
              const selectedValue = optionsMap[value || ''];
              const payload = {
                  persona: handOverData?.persona,
                  fromUser : { userId: handOverData?.userId, name : handOverData?.name, emailAddress: handOverData?.emailAddress },
                  toUser: selectedValue ? { userId: selectedValue?.userId, name : selectedValue?.name, emailAddress: selectedValue?.emailAddress } : 
                  { userId: retry?.userId, name : retry?.name, emailAddress: retry?.emailAddress },
                  referenceId: handOverData?.handOverId
                }
                const {data: { message, status }} = await axios.post(apiMappings.userManagement.listView.handOver, payload);
                if (status === 200) {
                    toast.add(message, "check-round", false);
                    const {
                      data: { status },
                    } = await axios.put(
                      apiMappings.userManagement.listView.toggleProfileActive,
                      {
                        id: handOverData?.userId,
                        isActiveFl: handOverData?.activeRequest,
                      }
                    );
                    if (status === 200) {
                      setSelectedRows({});
                    }
                    throw message;
                } 
                throw message;
            } catch (errorMessage) {
              console.log("Error Occured while doing handover process.")
              toast.add(typeof errorMessage === "string" ? errorMessage : dynamicLabels.somethingWendWrong, "", false);
            } finally {
              setIsLoading(false)
              handleClose()
            }
      }

      return (<>
        <Modal open = {showHandOverModal} onToggle={() => {}} width='750px' size='lg'
        children = {{
            header: (<ModalHeader headerTitle={dynamicLabels.handOver} handleClose={handleClose} imageVariant="icomoon-close" headerStyle={{ fontSize: "15px" }} width='100%'/>),
            content: (<div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
                    <DropDown label={`Choose ${dynamicLabels[handOverData.persona]} to handover Deals & Clients`} variant='form-select'
                    optionList={optionList}
                    placeholder={handOverData?.handOverId ? value : `Select ${dynamicLabels[handOverData.persona]}`}
                    onChange={setValue}
                    value={value}
                    isMenuOpen={isMenuOpen}
                    disabled = {handOverData?.handOverId}/>
                </div>),
            footer: (<ModalFooter>
                    <IconButton iconVariant='icomoon-tick-circled' primary
                    disabled={isLoading}
                    onClick={handleSubmit}> {dynamicLabels.ok} </IconButton>
                    <IconButton iconVariant='icomoon-close' onClick={handleClose} iconSize={11} disabled = {isLoading}> {dynamicLabels.cancel} </IconButton>
                </ModalFooter>),
            }}
    /></>)
    
}

export default HandOverModal;