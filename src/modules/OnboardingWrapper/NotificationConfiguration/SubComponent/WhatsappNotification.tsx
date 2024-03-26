import React, { useState, useEffect, Dispatch, useMemo } from "react";
import { Box, DropDown, Grid, Position, MultiSelect, TextInput, Typography, IconButton, Tooltip, useToast } from "ui-library";
import { useDispatch } from 'react-redux'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomWrapper } from "./AddDynamicTags";
import axios from "../../../../utils/axios";
import apiMappings from '../../../../utils/apiMapping'
import DynamicTagsTableComponent from "./DynamicTagsTableComponent";
import InformationIcon from "./InformationIcon";
import { tWhatsappNotificationProps } from "./Notification.model";
import TagsTableView from "./TagsTableView";
import { SectionHeader } from "./SectionHeader";
import { tAlertProfilesMasterActions } from "../../AlertProfilesMaster/AlertProfilesMaster.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import TestMobile from "../../AlertProfilesMaster/components/TestMobile";
import { REGEXPS } from "../../../../utils/constants";
import "./SubComponentStyles.scss";


const WhatsappNotification = ({
    whatsappToggle,
    optionList,
    orderTagList,
    setOrderTagList,
    templateName,
    setTemplateName,
    templateId,
    setTemplateId,
    templateLanguage,
    setTemplateLanaguage,
    whatsappMessage,
    setWhatsappMessage,
    dynamicLabels,
    getNotifyTagsArray,
    setUpdateState,
    templateDynamicTags,
    isViewMode = false,
    fromAlerts = false,
    isWhatsappTouched = false,
    setIsWhatsappTouched,
    handleChange
}: tWhatsappNotificationProps) => {
    const formInstance = useFormContext();
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorTooltip, setErrorTooltip] = useState("")
    const [dropDownOptions, setDropDownOptions] = useState([{}])
    const toOptions = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.WHATSAPP?.to)
    const toSelected = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.WHATSAPP?.toSelected)
    const toSelectedValues = toSelected ? toSelected?.map(option => option.value) : undefined;
    const isOtherVisible = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.WHATSAPP?.isOtherVisible)
    const otherData = useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.WHATSAPP?.other)
    const whatsappActive = !fromAlerts ? whatsappToggle : useTypedSelector(state => state.settings.alertProfilesMaster.settings.formState.WHATSAPP?.isActive)
    const [isTestWhatsappModalOpen, setIsTestWhatsappModalOpen] = useState<boolean>(false)

    const toast = useToast()
    const dispatch = useDispatch<Dispatch<tAlertProfilesMasterActions>>()

    const handleToSelectionChange = React.useCallback((_, value: string | undefined, isSelected: boolean = false) => {
        dispatch({
            type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS_TO_SELECTION_CHANGE', payload: {
                key: 'WHATSAPP',
                value: Number(value || '0'),
                isSelected
            }
        })
    }, [])

    const handleOtherDataChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: '@@ALERT_PROFILES_MASTER/ALERT_SETTINGS/SET_OTHER_FIELD', payload: {
                key: 'WHATSAPP',
                value: e.target.value
            }
        })
    }, [])

    const handleTemplateName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (fromAlerts) {
            handleChange?.("templateName", e.target.value);
            !isWhatsappTouched && setIsWhatsappTouched?.(true)
        } else {
            setTemplateName?.(e.target.value);
            setUpdateState?.(true)
        }
    }, [])

    const handleLanguageCode = React.useCallback((value: string) => {
        if (fromAlerts) {
            handleChange?.("templateLanguage", value);
            !isWhatsappTouched && setIsWhatsappTouched?.(true)
        } else {
            setTemplateLanaguage?.(value);
            setUpdateState?.(true)
        }
    }, [])

    const handleTemplateId = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (fromAlerts) {
            handleChange?.("templateId", e.target.value);
            !isWhatsappTouched && setIsWhatsappTouched?.(true)
        } else {
            setTemplateId?.(e.target.value);
            setUpdateState?.(true)
        }
    }, [])


    useEffect(() => {
        getLanguageDetails();
    }, [])

    const getLanguageDetails = async () => {
        try {
            const { data } = await axios.get(apiMappings.customer.listView.getLanguageCode);
            if (data) {
                const details = data?.data
                const values = Object.keys(details)?.reduce((acc, item) => {
                    const val = item
                    return [...acc, { value: val, label: details[val], title: details[val] }]
                }, [] as { value: string; label: string; title: string }[])
                setDropDownOptions(values)
            }
            return;
        } catch (errorMessage) {
            toast.add(dynamicLabels?.somethingWendWrong || "Something Went Wrong", 'warning', false);
        }
    }

    const fetchWhatsappTemplateDetails = async () => {
        try {
            const { data } = await axios.get(apiMappings.customer.listView.fetchWhatsappTemplate, {
                params: {
                    "templateName": templateName?.trim(),
                    "templateId": templateId?.trim()
                }
            });
            if (data) {
                if (fromAlerts) {
                    handleChange?.("whatsappMessage", data?.data);
                    !isWhatsappTouched && setIsWhatsappTouched?.(true)
                } else {
                    setWhatsappMessage?.(data?.data);
                }
                setHasError(false)
                toast.add(dynamicLabels?.whatsapp_template_fetched || "WhatsApp Template Fetched Successfully", "check-round", false);
            }
            return;

        } catch (error: any) {
            setHasError(true)
            setErrorTooltip(error?.response?.data?.message)
            if (fromAlerts) {
                handleChange?.("whatsappMessage", "");
                !isWhatsappTouched && setIsWhatsappTouched?.(true)
            } else {
                setWhatsappMessage?.("")
            }
            toast.add(error?.response?.data?.message || dynamicLabels?.somethingWendWrong, 'warning', false);
        }
    }

    const whatsappPayloadDetails = useMemo(() => ({
        templateName,
        whatsappMessage,
        templateLanguage,
        templateDynamicTags
    }), [templateName, whatsappMessage, templateLanguage, templateDynamicTags]);

    const fetchTemplateState = isViewMode || !(templateName?.trim() && templateId?.trim());

    return (
        <>
            {
                fromAlerts && (
                    <Grid container spacing='10px' >
                        <Grid item xl={6} md={3} style={{ paddingLeft: "36px" }}>
                        {formInstance?.control ?
                        <>
                         <Controller
                                    name='WHATSAPP.toContact'
                                    control={formInstance?.control}
                                    formInstance
                                    defaultValue={toSelectedValues && toSelectedValues?.length > 0 ? toSelectedValues : undefined}
                                    rules={{ required: whatsappActive ? true : false }}
                                    render={(props) => {
                                        return (
                                        <MultiSelect
                                        options={toOptions}
                                        style={{
                                            position: 'absolute',
                                            top: 60 + 10,
                                            left: 0 + 10,
                                            width: 'calc(100% - 10)'
                                        }}
                                        selected={toSelected}
                                        defaultSelected={toSelected}
                                        onChange={(_, value, isSelected, selectedOptions) => { 
                                            props?.onChange(selectedOptions && selectedOptions?.length > 0 
                                                ? selectedOptions?.map((o) => o.value) : undefined);
                                            if (selectedOptions && selectedOptions?.length == 0) {formInstance?.setError('WHATSAPP.toContact', { type: 'required' })}
                                            else { formInstance?.clearErrors('WHATSAPP.toContact') }
                                            handleToSelectionChange(_,value,isSelected)
                                         }}
                                    >
                                        {({ openMenu, optionSelected }) => {
                                            const hoverTitle = React.useMemo(() => {
                                                return optionSelected.map(option => option.label).join(', ')
                                            }, [optionSelected])
        
                                            return <TextInput
                                                id='whatsapp-to-selected-count'
                                                label={dynamicLabels?.toRecipientKey || "To (Recipient)"}
                                                placeholder={dynamicLabels?.toRecipientKey || "To (Recipient)"}
                                                fullWidth
                                                readOnly
                                                title={hoverTitle}
                                                required
                                                style={{ cursor: 'pointer' }}
                                                defaultValue={optionSelected?.length ? `${optionSelected.length} Selected` : ''}
                                                value={optionSelected?.length ? `${optionSelected.length} Selected` : ''}
                                                onClick={() => openMenu(o => !o)}
                                                error={formInstance?.errors?.WHATSAPP?.toContact}
                                                errorMessage={dynamicLabels?.recipientErrorMessage || "To (Recipient) is a mandatory field."}
                                            />
                                        }}
                                    </MultiSelect>
                                    )}}
                                />

                        </>
                        :
                         <MultiSelect
                                options={toOptions}
                                style={{
                                    position: 'absolute',
                                    top: 60 + 10,
                                    left: 0 + 10,
                                    width: 'calc(100% - 10)'
                                }}
                                selected={toSelected}
                                defaultValue={toSelectedValues}
                                onChange={handleToSelectionChange}
                            >
                                {({ openMenu, optionSelected }) => {
                                    const hoverTitle = React.useMemo(() => {
                                        return optionSelected.map(option => option.label).join(', ')
                                    }, [optionSelected])

                                    return <TextInput
                                        id='whatsapp-to-selected-count'
                                        label={dynamicLabels?.toRecipientKey || "To (Recipient)"}
                                        placeholder={dynamicLabels?.toRecipientKey || "To (Recipient)"}
                                        fullWidth
                                        readOnly
                                        required
                                        title={hoverTitle}
                                        name='WHATSAPP.toContact'
                                        style={{ cursor: 'pointer' }}
                                        defaultValue={optionSelected?.length ? `${optionSelected.length} Selected` : ''}
                                        value={optionSelected?.length ? `${optionSelected.length} Selected` : ''}
                                        onClick={() => openMenu(o => !o)}
                                    />
                                }}
                            </MultiSelect>

                            }
                        </Grid>
                        {(isOtherVisible) && <Grid item xl={6} md={3}>
                            <Box style={{ position: 'relative' }}>
                                <TextInput
                                    id='whatsapp-other-contact'
                                    label={dynamicLabels?.toRecipientKey || "Other Contact"}
                                    placeholder={dynamicLabels?.toRecipientKey || "Other Contact"}
                                    name='WHATSAPP.otherContact'
                                    fullWidth
                                    required
                                    onChange={handleOtherDataChange}
                                    defaultValue={otherData}
                                    ref={formInstance?.register({
                                        required: whatsappActive && isOtherVisible ? true : false,
                                        pattern: {
                                            message: dynamicLabels?.commaSeparatedContactValidation as string,
                                            value: new RegExp(REGEXPS.commaSeparatedPhone)
                                        }
                                    })}
                                    error={formInstance?.errors?.WHATSAPP?.otherContact}
                                    errorMessage={formInstance?.errors?.WHATSAPP?.otherContact?.message || "Please enter valid comma-separated contact number(s)."}
                                />
                                <Position type='absolute' top="40%" right="5px">
                                    <InformationIcon dimension={'16px'} direction="bottom" message={dynamicLabels?.otherContactDescription || "Adding non-consenting recipients may harm your WhatsApp delivery and affect your business account's quality ratings."} />
                                </Position>
                            </Box>
                        </Grid>}
                    </Grid>
                )
            }

            <Box display="flex" p='0px 24px'>
                <Box flexDirection="column" fullWidth>
                    <SectionHeader title="Template Details" message="Add approved Whatsapp Template Name, language code and map the relevant dynamic tags provisioned in the added template." />
                    <div className="sub-component__sectioncontent">
                        <Box style={{ position: 'relative' }}>
                            <TextInput
                                id="templateName"
                                label={dynamicLabels?.templateNameKey || "Template Name"}
                                style={{ width: "240px" }}
                                defaultValue={templateName}
                                onChange={(e) => handleTemplateName(e)}
                                required
                                ref={formInstance?.register({ required: whatsappActive ? true : false })}
                                error={formInstance?.errors?.WHATSAPP?.templateName}
                                errorMessage={dynamicLabels?.templateNameErrorMessage || "Template Name is a mandatory field."}
                                disabled={isViewMode}
                                name='WHATSAPP.templateName'
                            />
                        </Box>
                        {dropDownOptions?.length > 0 &&
                            <>{formInstance?.control ?
                                <Controller
                                    id="WHATSAPP.languageCode"
                                    name="WHATSAPP.languageCode"
                                    control={formInstance?.control}
                                    formInstance
                                    defaultValue={templateLanguage}
                                    rules={{ required: whatsappActive ? true : false }}
                                    render={(props) => (
                                        <DropDown
                                            placeholder={"Language Code"}
                                            label={dynamicLabels?.languageCodeKey || "Language Code"}
                                            variant="form-select"
                                            width='240px'
                                            required
                                            disabled={isViewMode}
                                            value={templateLanguage}
                                            onChange={(value) => { props.onChange(value); handleLanguageCode(value) }}
                                            optionList={dropDownOptions}
                                            limitOptionsList={dropDownOptions?.length}
                                            error={formInstance?.errors?.WHATSAPP?.languageCode && !templateLanguage}
                                            errorMessage={dynamicLabels?.languageCodeErrorMessage || "Language code is a mandatory field."}
                                        />
                                    )}
                                />
                                :
                                <DropDown
                                    placeholder={"Language Code"}
                                    label={dynamicLabels?.languageCodeKey || "Language Code"}
                                    variant="form-select"
                                    width='240px'
                                    disabled={isViewMode}
                                    required
                                    value={templateLanguage}
                                    onChange={(value) => { handleLanguageCode(value) }}
                                    optionList={dropDownOptions}
                                    limitOptionsList={dropDownOptions?.length}
                                />
                            }
                            </>
                        }
                    </div>

                    <Typography className="sub-component__subheading">{dynamicLabels?.previewKey || 'Preview'}</Typography>
                    <div className="sub-component__section-details">
                        <Box display="flex" alignItems="center" style={{ gap: "16px" }} >
                            <Box style={{ position: 'relative' }}>
                                <TextInput
                                    id="templateId"
                                    label={dynamicLabels?.templateId || "Template ID"}
                                    style={{ width: "240px", backgroundColor:"#FAFAFA", borderColor: hasError ? "#f05548" : "#979797" }}
                                    value={templateId}
                                    disabled={isViewMode}
                                    onChange={handleTemplateId}
                                />
                                {hasError && (
                                    <Position type='absolute' top="16%" right="-6px">
                                        <InformationIcon isError dimension={'16px'} direction="top" message={errorTooltip} />
                                    </Position>
                                )}
                            </Box>
                            <IconButton disabled={fetchTemplateState} iconVariant='icon-notes' className="sub-component__fetch-template" onClick={() => fetchWhatsappTemplateDetails()}>{dynamicLabels?.fetchTemplateKey || "Fetch Template"}</IconButton>
                        </Box>
                        <Typography className="sub-component__section-details__section-description">
                            {whatsappMessage || dynamicLabels?.emptyFetchTemplateMessage || "Nothing to show here. Click on Fetch Template to view the message"}
                        </Typography>

                    </div>

                    <SectionHeader title={dynamicLabels?.mapDynamicTagsKey || "Map Dynamic Tags"} message={dynamicLabels?.mapDynamicTagsDescription || "Choose relevant dynamic tags for the WhatsApp Alert template to incorporate specific details, such as the Order ID, in the alert."} />
                    <Box pt='3px' pb='8px'>
                        <CustomWrapper>
                            <div className="dropdownOptionsWrapper" >
                                <div className="sub-component__tablecontainer">
                                    {isViewMode ? (
                                        templateDynamicTags && <TagsTableView isDraggableView={false} data={templateDynamicTags} isViewMode={isViewMode} getNotifyTagsArray={getNotifyTagsArray} dynamicLabels={dynamicLabels} />
                                    ) : (
                                        <DynamicTagsTableComponent optionList={optionList} orderTagList={orderTagList} setOrderTagList={setOrderTagList} dynamicLabels={dynamicLabels} dropDownOptions={dropDownOptions} getNotifyTagsArray={getNotifyTagsArray} setUpdateState={setUpdateState} fromAlerts={fromAlerts} isWhatsappTouched={isWhatsappTouched} setIsWhatsappTouched={setIsWhatsappTouched} />
                                    )}
                                </div>
                            </div>
                        </CustomWrapper>
                    </Box>
                    {
                        fromAlerts && (
                            <>
                                <Tooltip hover message={dynamicLabels?.testWhatsappKey || "Test Whatsapp"} messagePlacement='start'>
                                    <IconButton
                                        id="updateAlertProfile-actionBar-testWhatsapp"
                                        iconVariant='mobile'
                                        intent='table'
                                        onClick={() => setIsTestWhatsappModalOpen(true)}
                                        disabled={!templateName?.trim() || !templateLanguage}
                                    >
                                        {dynamicLabels?.testWhatsappKey || "Test WhatsApp"}
                                    </IconButton>
                                </Tooltip>
                                <TestMobile
                                    isOpen={isTestWhatsappModalOpen}
                                    type='WHATSAPP'
                                    onClose={() => setIsTestWhatsappModalOpen(false)}
                                    payload={whatsappPayloadDetails}
                                />
                            </>
                        )
                    }

                </Box>
            </Box>

        </>
    );
};

export default WhatsappNotification;




