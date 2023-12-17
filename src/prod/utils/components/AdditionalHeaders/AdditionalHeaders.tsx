import React from "react";
import { IAdditionalWebhookRecord } from "../../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/OrganizationWebhookProfile/WebhookProfile.reducer";
import { Box, Grid, TextInput, IconButton } from "ui-library";
import { findPartialKeyName } from "../../helper";
import { UseFormMethods } from "react-hook-form";
import { theme } from "../../theme";
import useDynamicLabels from "../../../modules/common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../modules/common/DynamicLabels/dynamicLabels.mapping";
import { FontIconContainer, IncrementDecrementGrid } from "../../../modules/ClientAdmin/DeveloperSpace/WebhookProfile/subComponents/styledComponents";


interface IAdditionalHeaderProps {
    additionalHeaders: IAdditionalWebhookRecord[]
    handleIncrement: Function
    handleDecrement: Function
    formInstance: UseFormMethods<Record<string, any>>
}

const AdditionalHeaders = (props: IAdditionalHeaderProps) => {
    const { additionalHeaders, handleIncrement, handleDecrement, formInstance } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.webHooks);
    const { register, clearErrors, watch, errors } = formInstance

    const additionalHeaderErrorMessages = {
        required: dynamicLabels.headerMandatory || "Header cannot be blank.",
        pattern: dynamicLabels.invalidHeaderName || 'Invalid Header Name.',
        duplicated: dynamicLabels.uniqueHeaderValidation || "Header name must be unique."
    }

    const additionalHeaderValueErrorMessages = {
        required: dynamicLabels.valueMandatory || "Value cannot be blank.",
        pattern: dynamicLabels.invalidHeaderValue || 'Invalid Header Value.'
    }

    
    const handleHeaderValueChange = (key: string) => {
        const value = watch(key);
        if(value) {
            clearErrors(key)
        }
    }


    return (
        <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">

            {additionalHeaders.length > 0 ?
                additionalHeaders.map((header: IAdditionalWebhookRecord, index: number) => {
                    return <Grid key={findPartialKeyName(header, 'Header-')} container spacing='15px'>

                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <TextInput
                                id={header[`${findPartialKeyName(header, 'Header-')}`].id}
                                name={header[`${findPartialKeyName(header, 'Header-')}`].name}
                                className={header[`${findPartialKeyName(header, 'Header-')}`].class}
                                label={dynamicLabels.headerName || 'Header'}
                                labelColor={theme.colors.text.inputLabel.default}
                                placeholder={dynamicLabels.headerName || 'Header'}
                                maxLength={255}
                                error={errors?.[`${findPartialKeyName(header, 'Header-')}`]}
                                errorMessage={errors?.[`${findPartialKeyName(header, 'Header-')}`] && additionalHeaderErrorMessages[errors?.[`${findPartialKeyName(header, 'Header-')}`].type]}
                                required={false}
                                fullWidth={true}
                                onBlur={() => handleHeaderValueChange(`${findPartialKeyName(header, 'Header-')}`)}
                                onChange={() => handleHeaderValueChange(`${findPartialKeyName(header, 'Header-')}`)}
                                arrowPlacement='center'
                                messagePlacement='start'
                                tooltipDirection='bottom'
                                disabled={false}
                                width="100%"
                                ref={register({
                                    required: false,
                                    maxLength: 255,
                                    pattern: /^[A-Za-z0-9_@./*^$!#&+-]+$/
                                })}
                                
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3}>
                            <TextInput
                                id={header[`${findPartialKeyName(header, 'Value-')}`].id}
                                name={header[`${findPartialKeyName(header, 'Value-')}`].name}
                                className={header[`${findPartialKeyName(header, 'Value-')}`].class}
                                label={dynamicLabels.headerValue || 'Value'}
                                labelColor={theme.colors.text.inputLabel.default}
                                placeholder={dynamicLabels.headerValue || 'Value'}
                                maxLength={1024}
                                error={errors?.[`${findPartialKeyName(header, 'Value-')}`]}
                                errorMessage={errors?.[`${findPartialKeyName(header, 'Value-')}`] && additionalHeaderValueErrorMessages[errors?.[`${findPartialKeyName(header, 'Value-')}`].type]}
                                required={false}
                                fullWidth={true}
                                onBlur={() => handleHeaderValueChange(`${findPartialKeyName(header, 'Value-')}`)}
                                onChange={() => handleHeaderValueChange(`${findPartialKeyName(header, 'Value-')}`)}
                                arrowPlacement='center'
                                messagePlacement='start'
                                tooltipDirection='bottom'
                                disabled={false}
                                width="100%"
                                ref={register({
                                    required: false,
                                    maxLength: 1024,
                                    pattern: /^[A-Za-z0-9_ @./*^$!#&+-=]+$/

                                })}
                               
                            />
                        </Grid>
                        <IncrementDecrementGrid item xs={6} sm={6} md={1} lg={1}>
                            {(additionalHeaders.length > 1 ? true : index > 0) && <FontIconContainer className="danger"><IconButton onClick={() => handleDecrement(header[`${findPartialKeyName(header, 'Header-')}`].id)} circle iconSize={11} iconVariant='icomoon-close' className="deleteWebhookHeader" /> </FontIconContainer>}
                            {index < 9 && <FontIconContainer><IconButton onClick={() => handleIncrement(header)} circle primary iconSize={11} iconVariant='icomoon-add' /></FontIconContainer>}
                        </IncrementDecrementGrid>
                    </Grid>
                })
            : "No Additional Headers"}
        </Box>
    )
}

export default AdditionalHeaders;