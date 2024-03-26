import React, { Dispatch, useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalFooter, IconButton, useToast } from "ui-library";
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { useDispatch } from 'react-redux';
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';

const SendActivationLink = (props : any) => {
    const {rowData, sendActivationLink, setSendActivationLink, fetchDataSilenty} = props
    const toast = useToast();
    const dynamicLabels = useDynamicLabels(`navigationConfirmation,sendActivationLinkMsg`);

    const [skipPaymentValidation, setSkipPaymentValidation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const [message, setMessage] = useState<string>(dynamicLabels.sendActivationLinkMsg || "Are you sure you want to Resend the product activation link?")
    const [showButton, setShowButton] = useState<boolean>(true);
    
    useEffect(() => {
    }, [message])

    const handleSend = async () => {
        setIsLoading(true)
        try {
            const params = rowData.zohoSubscriptionId == undefined ? rowData?.guid == undefined ? `guid=` : `guid=${rowData.guid}` : `zohoSubscriptionId=${rowData.zohoSubscriptionId}`;
            const { data : response }: any = await axios.post(`${apiMappings.adminDashboard.pendingAction.sendActivationLink}?${params}&skipPaymentValidation=${skipPaymentValidation}`);
            if (!response?.hasError) {
                resetDefaultValues()
                fetchDataSilenty()
                toastDispatch({type: '@@globalToast/add', payload: {message: response.message,icon: 'check-round'}})
            } else  {
                setIsLoading(false)
                response.status === 409 ? setSkipPaymentValidation(true) : setShowButton(false)
                setMessage(response.message)
            }
        } catch (error) {
            console.log("Error occured while sending activation link");
            console.log(error)
            resetDefaultValues()
            toast.add(dynamicLabels.somethingWendWrong, "warning", false);
        }
    }
    
    const resetDefaultValues = () => {
        setSendActivationLink(false)
        setSkipPaymentValidation(false);
        setIsLoading(false)
        setShowButton(false)
        setMessage("")
    }

    return (<>
        {sendActivationLink && <Modal open = {true} onToggle={() => {}} width='600px' size='lg'
        children = {{
            header: (<ModalHeader headerTitle={dynamicLabels.navigationConfirmation} handleClose={() => {resetDefaultValues()}} imageVariant="icomoon-close" headerStyle={{ fontSize: "15px" }} width='100%' />),
            content: (<div onClick={() => {resetDefaultValues()}} style={{ position: 'relative', fontSize: '14px', marginBottom: '5px' }}>
                    {message}
                </div>),
            footer: (<ModalFooter>
                    {showButton && 
                    <IconButton iconVariant='icomoon-tick-circled' primary
                    onClick={() => {handleSend()}} disabled={isLoading}> {dynamicLabels.send} </IconButton>}
                    {showButton && <IconButton iconVariant='icomoon-close' disabled = {isLoading} onClick={() => {resetDefaultValues()}} iconSize={11}> {dynamicLabels.cancel} </IconButton>}
                </ModalFooter>)
            }}
    />}</>)
}

export default SendActivationLink;