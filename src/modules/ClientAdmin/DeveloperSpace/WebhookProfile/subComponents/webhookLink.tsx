import React, { useEffect, useState } from 'react'
import { Box, IconDropdown, TextInput, IconButton, Button } from 'ui-library'
import { theme } from '../../../../../utils/theme'
// import { IWebhookLink } from '../OrganizationWebhookProfile/WebhookProfile.reducer'
import { WebhookURLStyle, WebhookLinkValidationWrapper, WebhookLinkValidation } from './styledComponents'

interface webhookLinkProps {
    urlLink?: string
    type?: string
    onTypeChange: (type: string | undefined, url: string | undefined, isValidLink: boolean) => void
    onUrlChange: (type: string | undefined, url: string | undefined, isValidLink: boolean) => void
    onValidation: (isValidLink: boolean) => void
    isShowValidation: boolean
    isValid: boolean,
    readOnly: boolean
}

const WebhookLink = (props: webhookLinkProps) => {
    const { isShowValidation, isValid, readOnly } = props;
    console.log("props - in - link - component", props);

    const [linkType, setLinkType] = useState<string | undefined>('POST');
    const [linkUrl, setLinkUrl] = useState<string | undefined>('');
    const [isValidLink, setIsValidLink] = useState<boolean>(isValid || false);
    const [showValidation, setShowValidation] = useState<boolean>(isShowValidation || false);

    const handleTypeChange = (value: string) => {
        setLinkType(value);
        props?.onTypeChange(value, linkUrl, isValidLink)
    }

    const handleUrlChange = (value: string) => {
        setLinkUrl(value);
        props?.onUrlChange(linkType, value, isValidLink)
    }

    const handleValidateUrl = () => {
        setShowValidation(true);
        if (linkType && linkUrl) {
            setIsValidLink(true);
        } else {
            setIsValidLink(false);
        }
    }

    useEffect(() => {
        props?.onValidation(isValidLink)
    }, [isValidLink])

    useEffect(() => {
        setShowValidation(isShowValidation);
        setIsValidLink(false);
        setLinkType("POST")
    }, [])

    const ListViewOption = [
        {
            value: 'POST',
            label: 'Post'
        },
        {
            value: 'PUT',
            label: 'Put'
        },
        {
            value: 'DELETE',
            label: 'Delete'
        },
        {
            value: 'GET',
            label: 'Get'
        }
    ]
    return (
        <WebhookURLStyle>
            <Box display="flex" flexDirection="row" style={{ width: "100%" }} justifyContent="flex-start">
                <IconDropdown
                    variant='default-dropdown'
                    optionList={ListViewOption}
                    menuIsOpen={false}
                    primary={false}
                    intent='page'
                    onChange={(value: string) => handleTypeChange(value)}
                    isSingleClickOption={true}
                    value={linkType}
                    optionComponent={({ selectedOption }: any) => {
                        return (
                            <div>
                                <div>{selectedOption?.color}</div>
                                <div>{selectedOption?.label}</div>
                            </div>
                        )
                    }}
                    id="typeButton"
                    disabled={readOnly}
                >
                    {({
                        selectedOption,
                        menuIsOpen,
                        setMenuIsOpen
                    }: any) => {
                        return (
                            <Button
                                onClick={() => {
                                    setMenuIsOpen(!menuIsOpen)
                                    // action('Universal open/closed')(menuIsOpen)
                                }}
                                color={theme.colors.text.primary}
                                bgColor="#eeeeee"
                                fullWidth={false}
                                id="innerTypeButton"
                                disabled={readOnly}
                            >
                                {selectedOption?.label}
                            </Button>
                        )
                    }}
                </IconDropdown>
                <WebhookLinkValidationWrapper>
                    <TextInput
                        id="webhookURL"
                        name='webhookURL'
                        className='webhookURL'
                        labelColor={theme.colors.text.inputLabel.default}
                        placeholder="Enter URL"
                        maxLength={250}
                        error={false}
                        errorMessage=""
                        required={false}
                        fullWidth={true}
                        onChange={(value) => handleUrlChange(value.target.value)}
                        tooltipMesaage="webhookURL"
                        value={linkUrl}
                        width="80%"
                        readOnly={readOnly}
                    />
                    {showValidation && <WebhookLinkValidation>{isValidLink ? <span className="validUrl">Valid</span> : <span className="inValidUrl">Invalid</span>}</WebhookLinkValidation>}
                </WebhookLinkValidationWrapper>
                <IconButton
                    onClick={handleValidateUrl}
                    primary={true}
                    iconVariant='calendar'
                    intent={'default'}
                    children='Test URL'
                    disabled={readOnly}
                />
            </Box>
        </WebhookURLStyle>
    )
}

export default WebhookLink;