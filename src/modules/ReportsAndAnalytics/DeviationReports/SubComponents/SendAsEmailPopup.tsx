import React, { useState } from 'react'
import { Box, Modal, ModalHeader, IconButton, TextInput } from 'ui-library'
import { routeContains } from '../../../../utils/hybridRouting';
import { ISendEmailProps } from '../DeviationReports.models'

const SendAsEmailPopup = ({ title, sendEmailHandler, showSendEmailPopup, setShowSendEmailPopup }: ISendEmailProps) => {
    const userEmail = JSON.parse(localStorage.getItem("userAccessInfo") || "{}").emailId;

    const [emailId, setEmailId] = useState(userEmail);
    const [emailError, setEmailError] = useState<boolean>(false);

    const handleClose = () => { 
        setShowSendEmailPopup(false);
    }

    const validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleSendEmail = async () => {
        if (!validateEmail(emailId)) { 
            setEmailError(true);
        } else {
            sendEmailHandler(emailId);
        }
    };

    return <Modal open={!!showSendEmailPopup} onToggle={() => { }} size='md'>
        {{
            header: (
                <ModalHeader
                    headerTitle={routeContains("VehicleReport") ? title : `${title} Report`}
                    imageVariant='icomoon-close'
                    handleClose={handleClose}
                />
            ),
            content: (
                <div style={{ fontSize: '14px', width: '100%' }}>
                    <TextInput
                        id="email-text"
                        name="emailText"
                        maxLength={255}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = e?.target?.value ? e?.target?.value : "";
                            setEmailId(newValue);
                        }}
                        error={emailError}
                        errorMessage={"Invalid email"}
                        type="email"
                        placeholder="Email"
                        fullWidth={true}
                        required={true}
                        title="Email"
                        className="emailText"
                        label="Email"
                        value={emailId}
                        defaultValue={userEmail}
                    />
                </div>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton
                        primary
                        id="btn_deviationReport_sendEmail"
                        iconVariant="icomoon-tick-circled"
                        style={{ padding: "0px 15px" }}
                        disabled={emailId.length === 0}
                        onClick={handleSendEmail}
                    >
                        Submit
                    </IconButton>
                    <IconButton
                        id="btn_deviationReport_cancel"
                        iconVariant="icomoon-close"
                        style={{ padding: "0px 15px" }}
                        onClick={handleClose}
                    >
                        Cancel
                    </IconButton>
                </Box>
            )
        }}
    </Modal>
}
export default SendAsEmailPopup