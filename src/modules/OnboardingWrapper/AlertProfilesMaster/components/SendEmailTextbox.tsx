import React,{useState} from 'react'
import styled from 'styled-components'
import { TextInput, IconButton} from 'ui-library'
import useDynamicLabels from '../../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../modules/common/DynamicLabels/dynamicLabels.mapping';

const TextInputWrapper = styled.div`
    display: flex;
    flex-direction:row;
    width: 20%;
`;

export interface ITextEmailTextBox {
    onClick: (email:string) => void
}

const SendEmailTextBox = ({onClick}:ITextEmailTextBox) => {

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alertMessageTemplate);
    const [emailAddress, setEmailAddress] = useState<string>('');
    const[emailError, setEmailError] = useState<boolean>(false);


    const handleInputChange = (email: string) => {
        setEmailAddress(email); 
        const emailError = email.replace(/\s/g, "").split(',')
        let flag = emailError.every((email:string) => {
            return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
        })
        setEmailError(!flag)
    }
    return (
        <TextInputWrapper className="test-email-container"style={{ paddingTop: '31px' }}>
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
        </TextInputWrapper>
    )
}

export default SendEmailTextBox