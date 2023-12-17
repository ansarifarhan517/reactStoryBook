import React, {useState} from "react";
import {
    TextInput,
    IconButton
} from "ui-library";
import { emailIsValid } from "../../../utils/helper"; 
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import styled from "styled-components";

const InputContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 20%;
`;

interface IEmailProps {
    onClick: (emailAddress: string) => void;
}

const TestEmail = ({onClick}:IEmailProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alertMessageTemplate);

    const [emailAddress, setEmailAddress] = useState<string>('');
    const[emailError, setEmailError] = useState<boolean>(false);


    const handleInputChange = (e: string) => {
        setEmailAddress(e);  
        setEmailError(!emailIsValid(e));
    }

    return(
        <InputContainer className="test-email-container">
            <TextInput  
                id='testEmailInput'
                name='testEmailInput'
                className='testEmailInput'
                value={emailAddress}
                onChange={(e) => handleInputChange(e.target.value)}
                label={dynamicLabels.testEmail}
                labelColor={'text.inputLabel.default'}
                placeholder={dynamicLabels.testEmail}
                error={emailError}
                errorMessage={dynamicLabels.invalidEmail}
                required={true}
                fullWidth={true}
                />
            <IconButton onClick={() => onClick(emailAddress)} disabled={emailError || emailAddress === ''} primary iconVariant="send-mail" style={{marginTop: 18}}/>
        </InputContainer>
    )
}

export default TestEmail;