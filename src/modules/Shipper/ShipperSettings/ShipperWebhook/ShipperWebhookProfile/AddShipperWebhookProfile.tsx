import React, { createRef, Dispatch, useEffect, useRef, useState } from 'react'
import withRedux from '../../../../../utils/redux/withRedux'
import { theme, withThemeProvider } from '../../../../../utils/theme'
import { withPopup, withToastProvider, SectionHeader, Box, TextInput, Toggle, Grid, IconButton, IconDropdown, Button, CheckboxFieldGroup, Checkbox, Loader, useToast, Tooltip } from 'ui-library'
import { useForm } from "react-hook-form";
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { IValidWebhookLink } from './ShipperWebhookProfile.reducer'
import { useDispatch } from 'react-redux'
import { WebhookProfileActions } from './ShipperWebhookProfile.actions'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'  
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import { WebhookPageHeader, SecureWebhookWrapper, SecureWebhookSignatureWrapper, WebhookLinkWrapper, WebhookURLStyle, WebhookLinkValidationWrapper, WebhookLinkValidation, StyledAccordianWrapper } from '../../../../ClientAdmin/DeveloperSpace/WebhookProfile/subComponents/styledComponents';
import { SectionHeaderWrapper } from '../../../../OnboardingWrapper/AlertMessages/AlertMessageStyledComponents';
import { FormActionButton } from '../../../../OnboardingWrapper/BranchConfiguration/BranchConfigurationStyledComponents';
import AdditionalHeaders from '../../../../../utils/components/AdditionalHeaders/AdditionalHeaders';
import { addAdditionalHeader, findPartialKeyName, getUniqueErrorKeys, hasDuplicates } from '../../../../../utils/helper';
import { IAdditionalWebhookRecord } from '../../../../../utils/common.interface';

interface IWebhookProfile {
    onFormCancel: () => void
    subClientId: string | number
    isNavigatetoList: boolean
    setIsNavigatetoList: (arg: boolean) => void
}
const AddShipperWebhookProfile = (props: IWebhookProfile) => {
    const dispatch = useDispatch<Dispatch<WebhookProfileActions>>()
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const toast = useToast()
    const formInstance = useForm();
    const { register, handleSubmit, errors, clearErrors, formState, setError, getValues, setValue, watch } = formInstance;
    const { isDirty } = formState;
    const webhookProfileFormData = useTypedSelector(state => state.shipperSettings.shipperWebhook.webhookProfileFormData)
    const webhookLinks = useTypedSelector(state => state.shipperSettings.shipperWebhook.webhookLinks);
    const isLoading = useTypedSelector(state => state.shipperSettings.shipperWebhook.isLoading)
    const eventsData = useTypedSelector(state => state.shipperSettings.shipperWebhook.events)
    const editedWebhookProfile = useTypedSelector(state => state.shipperSettings.shipperWebhook.editedWebhookProfile);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipperWebHooks);
    const initselectedEvents = useTypedSelector(state => state.shipperSettings.shipperWebhook.selectedEvents)
    const initselectedEventsObject = useTypedSelector(state => state.shipperSettings.shipperWebhook.selectedEventsObject)
    const additionalHeaders = useTypedSelector(state => state.shipperSettings.shipperWebhook.additionalHeaders)
    const isFormEditable = useTypedSelector(state => state.shipperSettings.shipperWebhook.isEditMode)


    const ListViewOption = [
        {
            value: 'POST',
            label: 'Post'
        }
        // {
        //     value: 'PUT',
        //     label: 'Put'
        // },
        // {
        //     value: 'DELETE',
        //     label: 'Delete'
        // }
    ]

    const [isWebhookSecure, setIsWebhookSecure] = useState<boolean>(false)
    const [webhookLink, setWebhookLink] = useState<IValidWebhookLink>({ type: undefined, link: undefined, isValid: true, showValidation: false });
    const [newWeblink, setNewWeblink] = useState<boolean>(true);
    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [usedUrl, setUsedUrl] = useState<string | undefined>();
    const [isRemoveNewWeblink, setIsRemoveNewWeblink] = useState<boolean>(false);
    const [setRotate, setRotateState] = useState("accordionIcon");
    const [isToggleChanged, setIsToggleChanged] = useState<boolean>(false);

    const [selectedEvents, setSelectedEvents] = useState<string[]>(initselectedEvents || [])
    const [selectedEventsObject, setSelectedEventsObject] = useState<{ key: string; value: string }[]>(initselectedEventsObject || [])
    const [isAdditionalHeaderVisible, setAdditionalHeadersVisible] = useState(true);


    const elementsRef = useRef(eventsData && Object.keys(eventsData).length && Object.keys(eventsData).map(() => createRef()));

    const toggleAccordion = (id: string, index: React.Key) => {
        setActiveState(setActive === id ? "" : id);
        setHeightState(
            setActive === "active" ? "0px" : `${elementsRef.current[index].current.scrollHeight}px`
        );
        setRotateState(
            setActive === "active" ? "accordionIcon" : "accordionIcon rotate"
        );
    }

    const webhookProfileNameErrorMessages = {
        required: dynamicLabels.webhookNameRequired || "Webhook Profile Name is mandatory.",
        pattern: dynamicLabels.webhookNamePattern || "Webhook Profile Name should be alphanumeric.",
        unique: dynamicLabels.webhookNameUnique || "Webhook Profile Name should be unique."
    }

    const webhookURLErrorMessages = {
        required: dynamicLabels.webhookUrlRequired || "URL is mandatory.",
        unique: dynamicLabels.webhookUrlUnique || "URL already provided.",
        noPost: dynamicLabels.webhookUrlNoPost || "Invalid URL type.",
        successfulTest: dynamicLabels.webhookUrlSuccessfulTest || "Successful url test is required.",
        duplicated: dynamicLabels.webhookUrlDuplicated || "Duplicate URL(s).",
        urlMissing: dynamicLabels.webhookUrlUrlMissing || 'Please enter the url.'
    }

    const webhookSignatureErrorMessages = {
        required: dynamicLabels.webhookSignatureRequired || "Webhook Signature is mandatory",
        maxLength: dynamicLabels.webhookSignaturePattern || "Invalid webhook signature.",
        minLength: dynamicLabels.webhookSignaturePattern || "Invalid webhook signature.",
        pattern: dynamicLabels.webhookSignaturePattern || 'Invalid webhook signature.'
    }

    const onSubmit = async (data: any) => {
        const headerList = isAdditionalHeaderVisible ?
            additionalHeaders.map((obj, index) => {
                return {
                    key: data[`${findPartialKeyName(obj, "Header-")}`],
                    value: data[`${findPartialKeyName(obj, "Value-")}`],
                    sequence: index + 1
                }
            }).filter((obj) => obj.key && obj.value) 
            : [];

            const headerNameList = isAdditionalHeaderVisible ?
            additionalHeaders.map((obj) => {
                return data[`${findPartialKeyName(obj, "Header-")}`].toLowerCase();
            })
            : [];
            
            if(hasDuplicates(headerNameList)) {
    
                toast.add("Header name must be unique.", 'warning', false);
    
                setTimeout(() => {
                    getUniqueErrorKeys(headerNameList, data, "Header").forEach((key) => {
                        setError(`${key}`, {type: "duplicated"})
                    });
                },100); 
            
                return;
            }
            

        if (!selectedEvents?.length) {
            toast.add(dynamicLabels.eventMandatoryMsg || 'At least one event is mandatory to be selected.', 'warning', false);
            return;
        }
        const webhookLinksFormData = webhookLinks.map(link => {
            return `${link?.type}#@#${link?.link}`;
        })
        if (webhookLink?.isValid && (webhookLink?.type && webhookLink.link)) {
            webhookLinksFormData.push(`${webhookLink?.type}#@#${webhookLink?.link}`)
        }

        const duplicateUrls = webhookLinksFormData.filter((item, index) => webhookLinksFormData.indexOf(item) != index);
        if (duplicateUrls?.length) {
            webhookLinksFormData.forEach((item, index) => {
                if (duplicateUrls.indexOf(item) > -1) {
                    const formValues = getValues();
                    if (formValues['webhookURL' + index]) {
                        setError('webhookURL' + index, { type: 'duplicated' })
                    }
                }
            })

            if (webhookLink?.isValid && (webhookLink?.type && webhookLink.link)) {
                if (duplicateUrls.indexOf(`${webhookLink?.type}#@#${webhookLink?.link}`) > -1) {
                    setError('webhookURL', { type: 'duplicated' })
                }
            }
            return;
        }

        let  webhookUrlsData = webhookLinks.map(function (obj) {
            return {
              url: `${obj.type}#@#${obj.link}`,
            };
          });

          if (webhookLink?.type && webhookLink?.link) {
            webhookUrlsData.push({
                url: `${webhookLink.type}#@#${webhookLink.link}`,
            })
          }
          console.log(webhookUrlsData,'webhookUrlsData')
        const formData = {
            "webhookProfileName": data?.webhookProfileName,
            "webhookSignature": data?.webhookSignature,
            "secureWebhook": data?.secureWebhook,
            "webhookUrlsData": webhookUrlsData,
            "events": selectedEvents,
            "subClientId": props?.subClientId,
            "webhookHeaderFl": isAdditionalHeaderVisible,
            "headerList": headerList
        }

        dispatch({ type: '@@shipperWebhookProfile/SET_LOADING', payload: true });

        if (editedWebhookProfile) {
            formData['webhookprofileId'] = editedWebhookProfile?.webhookProfileId;
            formData['webhookProfileName'] = webhookProfileFormData?.webhookProfileName;
            try {
                const { data: { message, status, error: urlError } } = await axios.put(apiMappings.shipperWebhookProfile.updateWebhook + editedWebhookProfile?.webhookProfileId, formData);
                if (status === 200 || status === 201) {
                    toastDispatch({
                        type: '@@globalToast/add', payload: {
                            message: message,
                            icon: 'check-round',
                            remove: false
                        }
                    })
                    dispatch({ type: '@@shipperWebhookProfile/SET_EDIT_MODE', payload: false });
                    dispatch({ type: '@@shipperWebhookProfile/INITIALISE_FORM' });
                    props?.onFormCancel();
                }

                if (status === 409) {
                    if (urlError) {
                        const events = urlError.events?.map((item: string) => {
                            const eventValue = selectedEventsObject?.filter((eventObj) => eventObj?.key === item);
                            return eventValue?.[0]?.value
                        })

                        toast.add(`${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'} ${dynamicLabels.duplicateUrlmsg || 'cannot be saved because the same URL has already been provided for the same'} ${events?.length > 1 ? 'events' : 'event'} ${events?.length > 1 ? events.slice(0, -1).join(', ') : events[events.length - 1]} ${events?.length > 1 ? 'and' : ''} ${events?.length > 1 ? events[events.length - 1] : ''} ${dynamicLabels.inThe || 'in the'} ${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}.`, 'warning', false);
                        const url = urlError?.webhookUrls?.[0]?.split('#@#')[1];
                        if ((url && webhookLink?.link) && url === webhookLink?.link) {
                            setError('webhookURL', {
                                type: 'unique'
                            })
                        } else if (webhookLinks?.length) {
                            setUsedUrl(url);
                        }
                    }
                }
            } catch (errorMessage:any) {
                toast.add(errorMessage, 'warning', false);
            } finally {
                dispatch({ type: '@@shipperWebhookProfile/SET_LOADING', payload: false });
            }
        } else {
            try {
                const { data: { message, status, error: urlError } } = await axios.post(apiMappings.shipperWebhookProfile.createWebhookProfile, formData);
                if (status === 200 || status === 201) {
                    toastDispatch({
                        type: '@@globalToast/add', payload: {
                            message: message,
                            icon: 'check-round',
                            remove: false
                        }
                    })
                    dispatch({ type: '@@shipperWebhookProfile/SET_EDIT_MODE', payload: false });
                    dispatch({ type: '@@shipperWebhookProfile/INITIALISE_FORM' });
                    props?.onFormCancel();
                }

                if (status === 409) {
                    if (!urlError) {
                        toast.add(message, 'warning', false);
                        setError('webhookProfileName', {
                            type: 'unique'
                        })
                    } else if (urlError) {
                        const events = urlError.events?.map((item: string) => {
                            const eventValue = selectedEventsObject?.filter((eventObj) => eventObj?.key === item);
                            return eventValue?.[0]?.value
                        })

                        toast.add(`${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'} ${dynamicLabels.duplicateUrlmsg || 'cannot be saved because the same URL has already been provided for the same'} ${events?.length > 1 ? 'events' : 'event'} ${events?.length > 1 ? events.slice(0, -1).join(', ') : events[events.length - 1]} ${events?.length > 1 ? 'and' : ''} ${events?.length > 1 ? events[events.length - 1] : ''} ${dynamicLabels.inThe || 'in the'} ${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}.`, 'warning', false);
                        const url = urlError?.webhookUrls?.[0]?.split('#@#')[1];
                        if ((url && webhookLink?.link) && url === webhookLink?.link) {
                            setError('webhookURL', {
                                type: 'unique'
                            })
                        } else if (webhookLinks?.length) {
                            setUsedUrl(url);
                        }
                    }
                }
            } catch (errorMessage:any) {
                toast.add(errorMessage, 'warning', false);
            } finally {
                dispatch({ type: '@@shipperWebhookProfile/SET_LOADING', payload: false });
            }
        }
    };

    const handleWebhookLinkUrlChange = (type: string | undefined = "POST", url: string | undefined) => {
        setNewWeblink(false);
        clearErrors('webhookURL');
        setWebhookLink({
            type: type,
            link: url,
            isValid: true,
            showValidation: false
        })
    }

    const handleWebhookLinkTypeChange = (type: string | undefined = "POST", url: string | undefined) => {
        setNewWeblink(false);
        clearErrors('webhookURL');
        setWebhookLink({
            type: type,
            link: url,
            isValid: true,
            showValidation: false
        })
    }

    const handleValidateWebhookLink = async (webhooklink: IValidWebhookLink) => {
        setNewWeblink(false);
        clearErrors('webhookURL');
        if (webhooklink?.type && webhooklink?.link) {
            try {
                const { status, data: { hasError } } = await axios.get(`${apiMappings.shipperWebhookProfile.testUrl}${webhooklink?.link}&requestType=${webhooklink?.type}&webhookProfileId=-1`, { data: {} })
                if (status === 200 && !hasError) {
                    setWebhookLink({
                        ...webhookLink,
                        isValid: true,
                        showValidation: true
                    })
                } else {
                    setWebhookLink({
                        ...webhookLink,
                        isValid: false,
                        showValidation: true
                    })
                }
            } catch (errorMessage) {
                setWebhookLink({
                    ...webhookLink,
                    isValid: false,
                    showValidation: true
                })
            }
        } else {
            setError('webhookURL', { type: 'urlMissing' })
            // setWebhookLink({
            //     ...webhookLink,
            //     isValid: false,
            //     showValidation: true
            // })
        }
    }

    const handleAddWebhookLink = (index?: number) => {
        if (webhookLinks?.length === 4) {
            toast.add(dynamicLabels.maxWebhookUrlMsg || 'A maximum of 4 URLs can be added to this Webhook Profile. You have exceeded the maximum number. Please add another Webhook Profile.', 'warning', false);
            return
        }
        if (index && index === -1) {
            setIsRemoveNewWeblink(true);
            return;
        }
        clearErrors(`webhookURL`);
        if (webhookLinks?.length === 3 || webhookLinks?.length > 3) {
            toast.add(dynamicLabels.maxWebhookUrlMsg || 'A maximum of 4 URLs can be added to this Webhook Profile. You have exceeded the maximum number. Please add another Webhook Profile.', 'warning', false);
            return;
        }
        if (webhookLink?.link && webhookLink?.type) {
            dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...webhookLinks, webhookLink] })
            setNewWeblink(true);
            if (webhookLinks?.length === 3){
                setIsRemoveNewWeblink(false);
                return
            }
            setIsRemoveNewWeblink(true);
        } else {
            setError('webhookURL', { type: 'urlMissing' })
        }
    }

    const handleRemoveWebhookLink = (index: number) => {
        setIsToggleChanged(true);
        if (index === -1) {
            setIsRemoveNewWeblink(false);
            setNewWeblink(true);
            return;
        }
        const updatedWebhookLinks = webhookLinks;
        clearErrors(['webhookURL', 'webhookURL0', 'webhookURL1', 'webhookURL3']);
        updatedWebhookLinks.splice(index, 1);
        dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
        if (index === 3) {
            setIsRemoveNewWeblink(true);
            setNewWeblink(true);
        }
    }

    const handleTypeChange = (index: number, value: string | undefined) => {
        clearErrors(`webhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        updatedWebhookLinks[index].type = value;
        dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
    }

    const handleUrlChange = (index: number, value: string | undefined) => {
        clearErrors(`webhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        updatedWebhookLinks[index].link = value;
        updatedWebhookLinks[index].isValid = true;
        updatedWebhookLinks[index].showValidation = false;
        dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
    }

    const handleValidateUrl = async (index: number) => {
        clearErrors(`webhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        if (updatedWebhookLinks[index]?.type && updatedWebhookLinks[index]?.link) {
            try {
                const { status, data: { hasError } } = await axios.get(`${apiMappings.shipperWebhookProfile.testUrl}${updatedWebhookLinks[index]?.link}&requestType=${updatedWebhookLinks[index]?.type}&webhookProfileId=${editedWebhookProfile?.webhookProfileId || '-1'}`)
                if (status === 200 && !hasError) {
                    updatedWebhookLinks[index].isValid = true;
                } else {
                    updatedWebhookLinks[index].isValid = false;
                    setError(`webhookURL${index}`, { type: 'successfulTest' });
                }
                updatedWebhookLinks[index].showValidation = true;
                dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
            } catch (errorMessage) {
                updatedWebhookLinks[index].isValid = false;
                updatedWebhookLinks[index].showValidation = true;
                setError(`webhookURL${index}`, { type: 'successfulTest' });
                dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
            }
        } else {
            if (!updatedWebhookLinks[index].link) {
                setError(`webhookURL${index}`, { type: 'urlMissing' });
            }
            updatedWebhookLinks[index].isValid = false;
            dispatch({ type: '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
        }
    }

    const handleSecureWebhookToggle = () => {
        setIsWebhookSecure(!isWebhookSecure)
        setWebhookProfileFormData('secureWebhook', !isWebhookSecure);
        setIsToggleChanged(true);
        if (!isWebhookSecure) {
            clearErrors('secureWebhook');
        }
    }

    const handleCancelClick = () => {
        if (isDirty || isToggleChanged) {
            globalPopupDispatch({
                type: '@@globalPopup/SET_PROPS',
                payload: {
                    isOpen: true,
                    title: dynamicLabels.navigationConfirmation,
                    content: dynamicLabels.cancelConfirmationWarning,
                    footer: (
                        <>
                            <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
                                globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
                                dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
                                dispatch({ type: '@@shipperWebhookProfile/SET_EDIT_MODE', payload: false });
                                props?.onFormCancel();
                            }}>{dynamicLabels.ok}</IconButton>
                            <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                        </>
                    )
                }
            })
        } else {
            dispatch({ type: '@@shipperWebhookProfile/INITIALISE_FORM' });
            dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
            dispatch({ type: '@@shipperWebhookProfile/SET_EDIT_MODE', payload: false })

            props?.onFormCancel();
        }
    }

    const setIsEventSelected = (name: any, index: any) => {
        const modifiedEventsData = Object.assign({}, eventsData);
        if (modifiedEventsData[name].events[index].checked) {
            setSelectedEvents(selectedEvents.filter((value: string) => value !== modifiedEventsData[name].events[index]?.clientRefMasterCd));
            setSelectedEventsObject(selectedEventsObject.filter((event: { key: string, value: string }) => event.value !== eventsData[name].events[index]?.name))
        } else {
            setSelectedEvents([...selectedEvents, eventsData[name].events[index]?.clientRefMasterCd]);
            setSelectedEventsObject([...selectedEventsObject, { key: eventsData[name].events[index]?.clientRefMasterCd, value: eventsData[name].events[index]?.name }])
        }
        modifiedEventsData[name].events[index].checked = !modifiedEventsData[name].events[index].checked;
        dispatch({ type: '@@shipperWebhookProfile/SET_EVENTS_DATA', payload: modifiedEventsData });
    }

    const setWebhookProfileFormData = (key: string, value: any) => {
        // clearErrors("webhookSignature")
        dispatch({
            type: '@@shipperWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA',
            payload: { key: key, value: value }
        });
    }

    const generateWebhookSignature = async () => {
        try {
            const { data: { data: signature, status } } = await axios.get(apiMappings.shipperWebhookProfile.generateSignature, { params: { subClientId: props?.subClientId } });
            if (status === 200) {
                setWebhookProfileFormData('webhookSignature', signature);
                clearErrors("webhookSignature")
            }
        } catch (errorMessage) {
            console.log(errorMessage);
        }
    }

    const getExistingSignature = async () => {
        try {
            const { data: { data: { propertyValue: signature }, status } } = await axios.get(apiMappings.shipperWebhookProfile.getWebhookSignatue, { params: { subClientId: props?.subClientId } });
            if (status === 200) {
                setWebhookProfileFormData('webhookSignature', signature);
            }
        } catch (errorMessage) {
            console.log(errorMessage);
        }
    }

    useEffect(() => {
    }, [errors]);

    useEffect(() => {
        if (newWeblink) {
            setWebhookLink({
                type: "POST",
                link: undefined,
                isValid: true,
                showValidation: false
            });
            setValue("webhookURL", undefined);
        }
    }, [newWeblink])

    useEffect(() => {

        setIsWebhookSecure(webhookProfileFormData?.secureWebhook);
        setValue("webhookProfileName", webhookProfileFormData?.webhookProfileName || undefined);
        setValue("secureWebhook", webhookProfileFormData?.secureWebhook || false);
        setValue("webhookSignature", webhookProfileFormData?.webhookSignature || undefined);
        setAdditionalHeadersVisible(webhookProfileFormData?.webhookHeaderFl)
   
        if (webhookProfileFormData?.headerList.length > 0 && webhookProfileFormData?.headerList.length === additionalHeaders.length) {
            additionalHeaders.forEach((obj, index) => {
                if(webhookProfileFormData?.headerList[index]) {
                    setValue(`${findPartialKeyName(obj, "Header-")}`, webhookProfileFormData?.headerList[index].key)
                    setValue(`${findPartialKeyName(obj, "Value-")}`, webhookProfileFormData?.headerList[index].value)
                }
            })
        }
    }, [webhookProfileFormData, additionalHeaders]);

    useEffect(() => {
        if (isFormEditable && isAdditionalHeaderVisible && webhookProfileFormData?.headerList.length > 0) {
            additionalHeaders.forEach((obj, index) => {
                if(webhookProfileFormData?.headerList[index]) {
                    setValue(`${findPartialKeyName(obj, "Header-")}`, webhookProfileFormData?.headerList[index].key)
                    setValue(`${findPartialKeyName(obj, "Value-")}`, webhookProfileFormData?.headerList[index].value)
                }
            })
        }
    },[isFormEditable, isAdditionalHeaderVisible, webhookProfileFormData])

    useEffect(() => {
        if (editedWebhookProfile?.webhookProfileId) {
            dispatch({ type: '@@shipperWebhookProfile/GET_WEBHOOK_DETAILS_DATA', payload: { webhookProfileId: editedWebhookProfile?.webhookProfileId.toString(), subClientId: props.subClientId } })
            dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
            dispatch({ type: '@@shipperWebhookProfile/SET_EDIT_MODE', payload: true })
        } else {
            dispatch({ type: '@@shipperWebhookProfile/INITIALISE_FORM' });
            getExistingSignature();
        }
    }, []);

    useEffect(() => {
    }, [eventsData]);

    useEffect(() => {
        webhookLinks?.forEach((link, index) => {
            setValue(`webhookURL${index}`, link?.link);
        });
        if (newWeblink) {
            setValue("webhookURL", undefined);
        }
    }, [webhookLinks])

    useEffect(() => {
        if (isWebhookSecure && webhookProfileFormData && !webhookProfileFormData?.webhookSignature) {
            getExistingSignature();
        }
    }, [isWebhookSecure])

    // navigate back to list
    useEffect(() => {
        if (props?.isNavigatetoList) {
            handleCancelClick()
            props?.setIsNavigatetoList && props?.setIsNavigatetoList(false)
        }
    }, [props?.isNavigatetoList])

    // editWebhookData
    useEffect(() => {
        setSelectedEvents(initselectedEvents);
        setSelectedEventsObject(initselectedEventsObject)
    }, [initselectedEventsObject, initselectedEventsObject])

    
    useEffect(() => {
        if (!isFormEditable && additionalHeaders.length < 1) {
            dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
        }
    }, [isFormEditable])

    const handleAddAdditionalHeader = (header: IAdditionalWebhookRecord) => {
        const keys = Object.keys(header);
        const headerValue = watch(keys[0]);
        const value = watch(keys[1]);
        if (!headerValue && !value) {
            setError(keys[0], { type: 'required' })
            setError(keys[1], { type: 'required' })
        } else if (!value) {
            setError(keys[1], { type: 'required' })
        } else if (!headerValue) {
            setError(keys[0], { type: 'required' })
        } else {
            dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
        }
    }

    const handleRemoveAdditionalHeader = (id: string) => {
        const newAdditionalHeaders = additionalHeaders.filter((header: IAdditionalWebhookRecord) => header[`${findPartialKeyName(header, 'Header-')}`].id !== id)
        dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: newAdditionalHeaders })
        return;
    }


    useEffect(() => {
        if (isFormEditable && isAdditionalHeaderVisible && webhookProfileFormData && webhookProfileFormData?.headerList?.length > 0) {
            let headerList: Array<IAdditionalWebhookRecord> = [];
            
            let currentTimeStamp = new Date().getTime();
            webhookProfileFormData?.headerList.map(() => {
                currentTimeStamp++
                const additionalWebhook = {
                    [`Header-${currentTimeStamp}`]: { id: `Header-${currentTimeStamp}`, name: `Header-${currentTimeStamp}`, class: `Header-${currentTimeStamp}` },
                    [`Value-${currentTimeStamp}`]: { id: `Value-${currentTimeStamp}`, name: `Value-${currentTimeStamp}`, class: `Value-${currentTimeStamp}` }
                }
                headerList = [...headerList, ...[additionalWebhook]]
            })

            if (headerList.length > 0 && additionalHeaders.length < headerList.length) {
                dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
                dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: headerList });
                return;
            }
        } else {
            if(additionalHeaders.length < 1) {
                dispatch({ type: '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
            }
        }
    }, [isFormEditable, isAdditionalHeaderVisible, webhookProfileFormData])

    return (
        <>
            <div id='toast-inject-here'></div>
            <WebhookPageHeader className="webhook-page-header" style={{ margin: '0 0 18px' }}>
                {`${editedWebhookProfile ? dynamicLabels.edit || 'Edit' : dynamicLabels.add || 'Add'} ${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'}` || 'Shipper Webhook Profile'}
            </WebhookPageHeader>
            <Box display='flex' flexDirection='column' style={{ width: '100%', minHeight: 'calc(100vh - 130px)', backgroundColor: '#fff', boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" }} py='15px' px="15px">
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} bgColor="#fff">
                    <SectionHeaderWrapper className="section-header-wrapper">
                        <SectionHeader headerTitle={`${dynamicLabels.ShipperWebhookProfile || 'Shipper Webhook Profile'} ${dynamicLabels.Details || 'Details'}`} />
                    </SectionHeaderWrapper>
                    <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">
                        <Grid container spacing='15px'>
                            <Grid item xs={6} sm={6} md={4} lg={3}>
                                <TextInput
                                    id='webhookProfileName'
                                    name='webhookProfileName'
                                    className='webhookProfileName'
                                    label={`${dynamicLabels.ShipperWebhookProfile || "Shipper Webhook Profile"} ${dynamicLabels.Name}`}
                                    labelColor={theme.colors.text.inputLabel.default}
                                    placeholder={`${dynamicLabels.ShipperWebhookProfile || "Shipper Webhook Profile"} ${dynamicLabels.Name}`}
                                    maxLength={50}
                                    error={errors?.webhookProfileName}
                                    errorMessage={errors?.webhookProfileName && webhookProfileNameErrorMessages[errors?.webhookProfileName.type]}
                                    required={true}
                                    fullWidth={true}
                                    onBlur={(e: { target: { value: any } }) => setWebhookProfileFormData('webhookProfileName', e.target.value)}
                                    onChange={() => { }}
                                    tooltipMesaage={`${dynamicLabels.ShipperWebhookNameTooltipMsg || "Provide a unique name to identify the Shipper Webhook Profile."}`}
                                    arrowPlacement='center'
                                    messagePlacement='start'
                                    tooltipDirection='bottom'
                                    disabled={!!editedWebhookProfile}
                                    width="100%"
                                    ref={register({
                                        required: true,
                                        maxLength: 50,
                                        pattern: /^[a-zA-Z0-9_ ]+$/
                                    })}
                                    // boundLeft={335}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={4} lg={3}>
                                <SecureWebhookWrapper className="secure-webhook-wrapper">
                                    <Tooltip message={dynamicLabels.SecureShipperWebhookTooltipMsg || "Enabling this option means Shipper Webhook Signature will be passed for authentication in the request body of the webhook."} hover messagePlacement='end' tooltipDirection='bottom' arrowPlacement='end' >
                                        <Toggle
                                            id='secureWebhook'
                                            name="secureWebhook"
                                            label={`${dynamicLabels.Secure || 'Secure'} ${dynamicLabels.ShipperWebhook || " Shipper Webhook"}`}
                                            labelColor={theme.colors.text.inputLabel.default}
                                            checked={webhookProfileFormData?.secureWebhook}
                                            onChange={handleSecureWebhookToggle}
                                            disabled={false}
                                            width="100%"
                                            ref={register}
                                        />
                                    </Tooltip>
                                </SecureWebhookWrapper>
                            </Grid>
                            <Grid item xs={6} sm={6} md={4} lg={3}>
                                <SecureWebhookSignatureWrapper className="secure-webhook-signature-wrapper">
                                    <TextInput
                                        id='webhookSignature'
                                        name='webhookSignature'
                                        className='webhookSignature'
                                        label={`${dynamicLabels.ShipperWebhook || "Shipper Webhook"} ${dynamicLabels.Signature || 'Signature'} `}
                                        labelColor={theme.colors.text.inputLabel.default}
                                        placeholder={`${dynamicLabels.ShipperWebhook || "Shipper Webhook"} ${dynamicLabels.Signature || 'Signature'} `}
                                        maxLength={150}
                                        error={isWebhookSecure && errors?.webhookSignature}
                                        errorMessage={errors?.webhookSignature && webhookSignatureErrorMessages[errors?.webhookSignature?.type]}
                                        required={isWebhookSecure ? true : false}
                                        fullWidth={true}
                                        onBlur={(e: { target: { value: any } }) => setWebhookProfileFormData('webhookSignature', e.target.value)}
                                        onChange={() => { }}
                                        tooltipMesaage={dynamicLabels.ShipperWebhookSignatureTooltipMsg || 'Provide or autogenerate an Shipper Webhook Signature.'}
                                        arrowPlacement='center'
                                        messagePlacement='start'
                                        tooltipDirection='bottom'
                                        width="100%"
                                        ref={register({
                                            required: isWebhookSecure ? true : false,
                                            maxLength: isWebhookSecure ? 150 : undefined,
                                            minLength: isWebhookSecure ? 12 : undefined,
                                            pattern: /[A-Za-z0-9_@./*^$!#&+-]+$/
                                        })}
                                        disabled={!isWebhookSecure}
                                    />
                                    <IconButton
                                        onClick={generateWebhookSignature}
                                        disabled={!isWebhookSecure}
                                        iconVariant='refresh-thin'
                                        color="#efefef"
                                        variant='link'
                                        className="refreshIcon"
                                    />
                                </SecureWebhookSignatureWrapper>
                            </Grid>
                        </Grid>
                        <Box display='flex' flexDirection='column' style={{ width: '100%', margin: '15px 0' }} bgColor="#fff" mt="">
                            <Grid container spacing='15px'>
                                <Grid item xs={6} sm={6} md={4} lg={3}>
                                    <Checkbox
                                        checked={isAdditionalHeaderVisible}
                                        label={dynamicLabels.additionalHeaderDetails}
                                        onChange={() => setAdditionalHeadersVisible(!isAdditionalHeaderVisible)}
                                        ref={register}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        {isAdditionalHeaderVisible &&
                            <Box display='flex' flexDirection='column' style={{ width: '100%' }} bgColor="#fff" mt="">
                                <AdditionalHeaders additionalHeaders={additionalHeaders} handleIncrement={handleAddAdditionalHeader} handleDecrement={handleRemoveAdditionalHeader} formInstance={formInstance} />
                            </Box>
                        }
                        {webhookLinks.length > 0 && webhookLinks?.map((webhookLinkObj, index) => {
                            return (
                                <WebhookLinkWrapper key={`webhookLinkWrapper-${index}`} className="webhook-link-wrapper">
                                    <WebhookURLStyle className="webhook-url-style">
                                        <Box display="flex" flexDirection="row" style={{ width: "100%" }} justifyContent="flex-start" className={errors?.[`webhookURL${index}`] && errors?.[`webhookURL${index}`]?.type === 'noPost' ? 'ivalidUrlType' : ''}>
                                            <IconDropdown
                                                variant='default-dropdown'
                                                optionList={ListViewOption}
                                                menuIsOpen={false}
                                                primary={false}
                                                intent='page'
                                                onChange={(value: any) => handleTypeChange(index, value)}
                                                isSingleClickOption={true}
                                                value={webhookLinkObj?.type}
                                                optionComponent={({ selectedOption }: any) => {
                                                    return (
                                                        <div>
                                                            <div>{selectedOption?.color}</div>
                                                            <div>{selectedOption?.label}</div>
                                                        </div>
                                                    )
                                                }}
                                                id="typeButton"
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
                                                            }}
                                                            color={theme.colors.text.primary}
                                                            bgColor="#eeeeee"
                                                            fullWidth={false}
                                                            id="innerTypeButton"
                                                        >
                                                            <>
                                                                <div className="buttonArrow">{selectedOption?.label}</div>
                                                            </>
                                                        </Button>
                                                    )
                                                }}
                                            </IconDropdown>
                                            <WebhookLinkValidationWrapper className={(webhookLinkObj?.showValidation && !webhookLinkObj?.isValid) || (usedUrl === webhookLinkObj?.link) || (errors?.[`webhookURL${index}`]) ? 'webhook-link-validation-wrapper inValidLink' : 'webhook-link-validation-wrapper'}>
                                                <TextInput
                                                    id={`webhookURL${index}`}
                                                    name={`webhookURL${index}`}
                                                    className='webhookURL'
                                                    labelColor={theme.colors.text.inputLabel.default}
                                                    placeholder={dynamicLabels.EnterURL || 'Enter URL'}
                                                    maxLength={250}
                                                    error={errors?.[`webhookURL${index}`] || usedUrl === webhookLinkObj?.link}
                                                    errorMessage={errors?.[`webhookURL${index}`] && webhookURLErrorMessages[errors?.[`webhookURL${index}`].type] || usedUrl === webhookLinkObj?.link && dynamicLabels.webhookUrlUnique || 'URL already provided.'}
                                                    required={false}
                                                    fullWidth={true}
                                                    onBlur={(e: { target: { value: string | undefined } }) => handleUrlChange(index, e.target.value)}
                                                    onChange={() => { }}
                                                    tooltipMesaage="webhookURL"
                                                    width="80%"
                                                    ref={register({
                                                        required: webhookLinks?.length > 0 ? false : true,
                                                        maxLength: 250,
                                                        validate: {
                                                            noPost: () => webhookLinkObj.type === 'POST',
                                                            successfulTest: () => webhookLinkObj.isValid
                                                        }
                                                    })}
                                                />
                                                {webhookLinkObj?.showValidation && <WebhookLinkValidation className='webhook-link-validation'>{webhookLinkObj?.isValid ? <span className="validUrl">
                                                    <IconButton
                                                        onClick={() => { }}
                                                        disabled={false}
                                                        iconVariant='check-tick'
                                                        iconSize='xs'
                                                        className="validMsg"
                                                        color="#47b51d"
                                                        children={dynamicLabels.TestSuccessFul || "Test Successful"}
                                                    /></span> : <span className="inValidUrl">
                                                    <IconButton
                                                        onClick={() => { }}
                                                        disabled={false}
                                                        iconVariant='close'
                                                        iconSize='xs'
                                                        className="invalidMsg"
                                                        color="#f05548"
                                                        children={dynamicLabels.TestFailed || "Test Failed"}
                                                    /></span>}</WebhookLinkValidation>}
                                            </WebhookLinkValidationWrapper>
                                            <IconButton
                                                onClick={() => handleValidateUrl(index)}
                                                primary={true}
                                                iconVariant='link'
                                                intent={'default'}
                                                children='Test URL'
                                            />
                                        </Box>
                                    </WebhookURLStyle>
                                    <div className="webhook-link-action-buttons">
                                    <IconButton iconVariant="icomoon-close" iconSize={11} circle className="deleteWebhooklink" onClick={() => { handleRemoveWebhookLink(index) }}></IconButton>
                                        {(!isRemoveNewWeblink && webhookLinks.length === index + 1) && <IconButton iconVariant="icomoon-add" iconSize={11} circle primary onClick={() => handleAddWebhookLink(-1)} className="add-link-button"></IconButton>}
                                    </div>
                                </WebhookLinkWrapper>
                            )
                        })}
                            {(webhookLinks.length == 0 || isRemoveNewWeblink) && webhookLinks.length <= 3 && <WebhookLinkWrapper className="noBorder webhook-link-wrapper">
                            <WebhookURLStyle className="webhook-url-style">
                                <Box display="flex" flexDirection="row" style={{ width: "100%" }} justifyContent="flex-start" className={errors?.webhookURL && errors?.webhookURL?.type === 'noPost' ? 'ivalidUrlType' : ''}>
                                    <IconDropdown
                                        variant='default-dropdown'
                                        name="urlType"
                                        optionList={ListViewOption}
                                        menuIsOpen={false}
                                        primary={false}
                                        intent='page'
                                        onChange={(value: string | undefined) => handleWebhookLinkTypeChange(value, webhookLink?.link)}
                                        isSingleClickOption={true}
                                        value={newWeblink ? "POST" : webhookLink?.type || "POST"}
                                        optionComponent={({ selectedOption }: any) => {
                                            return (
                                                <div>
                                                    <div>{selectedOption?.color}</div>
                                                    <div>{selectedOption?.label}</div>
                                                </div>
                                            )
                                        }}
                                        id="typeButton"
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
                                                    }}
                                                    color={theme.colors.text.primary}
                                                    bgColor="#eeeeee"
                                                    fullWidth={false}
                                                    id="innerTypeButton"
                                                >
                                                    <div className="buttonArrow">{selectedOption?.label}</div>
                                                </Button>
                                            )
                                        }}
                                    </IconDropdown>
                                    <WebhookLinkValidationWrapper className={((webhookLink?.showValidation && !webhookLink?.isValid) || errors?.webhookURL) ? 'webhook-link-validation-wrapper inValidLink' : 'webhook-link-validation-wrapper'}>
                                        <TextInput
                                            id="webhookURL"
                                            name='webhookURL'
                                            className={!webhookLink?.isValid ? 'webhookURL' : 'webhookURLTest'}
                                            labelColor={theme.colors.text.inputLabel.default}
                                            placeholder="Enter URL"
                                            maxLength={250}
                                            error={errors?.webhookURL || !webhookLink?.isValid}
                                            errorMessage={errors?.webhookURL && webhookURLErrorMessages[errors?.webhookURL.type] || (!webhookLink?.isValid && webhookLink?.showValidation) && "Successful URL test is required."}
                                            required={false}
                                            fullWidth={true}
                                            onBlur={(e: { target: { value: string | undefined } }) => handleWebhookLinkUrlChange(webhookLink?.type, e.target.value)}
                                            tooltipMesaage="webhookURL"
                                            width="80%"
                                            ref={register({
                                                required: webhookLinks?.length > 0 ? false : true,
                                                maxLength: 250,
                                                validate: (webhookLink && webhookLink?.link && webhookLink?.type) ? {
                                                    noPost: () => webhookLink.type === 'POST',
                                                    successfulTest: () => webhookLink.isValid
                                                } : {}
                                            })}
                                        />
                                        {webhookLink?.showValidation && <WebhookLinkValidation className='webhook-link-validation'>{webhookLink?.isValid ? <span className="validUrl">
                                            <IconButton
                                                onClick={() => { }}
                                                disabled={false}
                                                iconVariant='check-tick'
                                                iconSize='xs'
                                                className="validMsg"
                                                color="#47b51d"
                                                children={dynamicLabels.TestSuccessFul || "Test Successful"}
                                            /></span> : <span className="inValidUrl">
                                            <IconButton
                                                onClick={() => { }}
                                                disabled={false}
                                                iconVariant='close'
                                                iconSize='xs'
                                                className="invalidMsg"
                                                color="#f05548"
                                                children={dynamicLabels.TestFailed || "Test Failed"}
                                            /></span>}</WebhookLinkValidation>}
                                    </WebhookLinkValidationWrapper>
                                    <IconButton
                                        onClick={() => handleValidateWebhookLink(webhookLink)}
                                        primary={true}
                                        iconVariant='link'
                                        intent={'default'}
                                        children={dynamicLabels.TestURL || 'Test URL'}
                                    />
                                </Box>
                            </WebhookURLStyle>
                            <div className="webhook-link-action-buttons">
                                {webhookLinks?.length > 0 && <IconButton iconVariant="icomoon-close" iconSize={11} circle className="deleteWebhooklink" onClick={() => { handleRemoveWebhookLink(-1) }} />}
                                <IconButton iconVariant="icomoon-add" iconSize={11} circle primary onClick={() => handleAddWebhookLink()} className="add-link-button" />
                            </div>
                        </WebhookLinkWrapper>}
                    </Box>
                </Box>
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} bgColor="#fff" mt="">
                    <SectionHeaderWrapper className="section-header-wrapper">
                        <SectionHeader headerTitle={dynamicLabels.EventDetails || "Event Details"} />
                    </SectionHeaderWrapper>
                    {eventsData && <StyledAccordianWrapper className='stytled-accordian-wrapper'>
                        {
                            Object.keys(eventsData).map((key, index: React.Key) => {
                                const accordItem = eventsData[key];
                                return (
                                    <div className="accordionSection" key={accordItem.title}>
                                        <button className={`accordion ${setActive === accordItem.title ? 'active' : ''}`} onClick={() => toggleAccordion(accordItem.title, index)}>
                                            <p className="accordionTitle">{dynamicLabels[accordItem?.titleLabelKey]}</p>
                                            <IconButton
                                                onClick={() => { }}
                                                disabled={false}
                                                onlyIcon
                                                iconVariant='angle-down'
                                                iconSize='xs'
                                                color={theme?.colors?.black}
                                                className={`${setRotate}`}
                                            />
                                        </button>
                                        <div
                                            ref={elementsRef.current[index]}
                                            style={{ maxHeight: `${setActive === accordItem.title ? setHeight : '0px'}` }}
                                            className={`accordionContent ${setActive === accordItem.title ? 'activeContent' : ''}`}
                                        >
                                            <CheckboxFieldGroup
                                                id='defaultCheckboxFieldGroup'
                                                orientation={false}
                                                spacing={10}
                                                variant='default'
                                                width='100%'
                                                label={key}
                                                labelColor={theme.colors.text.primary}
                                                ref={register}
                                            >
                                                <Grid container spacing='15px'>
                                                    {eventsData[key]?.events.map((eventItem, i) => {
                                                        return (
                                                            <Grid item xs={3} sm={3} md={3} lg={3} key={eventItem.clientRefMasterCd}>
                                                                <Checkbox
                                                                    id={eventItem.clientRefMasterCd}
                                                                    onChange={() => setIsEventSelected(key, i)}
                                                                    disabled={false}
                                                                    checked={eventItem?.checked || false}
                                                                    name={key}
                                                                    value={eventItem.clientRefMasterCd}
                                                                    label={eventItem.clientRefMasterDesc}
                                                                    checkboxSize={14}
                                                                    labelColor={theme.colors.text.primary}
                                                                    style={{
                                                                        fontSize: "13px", color: theme.colors.text.inputLabel.grey, fontWeight: 'normal',
                                                                        fontStretch: 'normal',
                                                                        fontStyle: 'normal'
                                                                    }}
                                                                    ref={register}
                                                                />
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </CheckboxFieldGroup>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </StyledAccordianWrapper>}
                </Box>
                <Box horizontalSpacing='15px' display='flex' mt='30px' fullWidth>
                    <FormActionButton className="form-action-button" iconVariant='icomoon-save' disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{editedWebhookProfile ? dynamicLabels.update : dynamicLabels.save}</FormActionButton>
                    <FormActionButton className="form-action-button" iconVariant='icomoon-close' disabled={isLoading} onClick={handleCancelClick}>{dynamicLabels.cancel}</FormActionButton>
                </Box>
            </Box>
            {isLoading && <Loader
                center={true}
                fadeBackground={true}
                speed={1}
            />}
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(AddShipperWebhookProfile)), 'toast-inject-here'))