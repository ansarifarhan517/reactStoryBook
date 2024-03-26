import React, { createRef, Dispatch, useEffect, useRef, useState } from 'react'
import withRedux from '../../../../../utils/redux/withRedux'
import { theme, withThemeProvider } from '../../../../../utils/theme'
import { withPopup, withToastProvider, SectionHeader, Box, TextInput, Toggle, Grid, IconButton, DropDown, CheckboxFieldGroup,RadioGroup, Radio, IconDropdown, Button, Checkbox, useToast, Loader, Tooltip } from 'ui-library'
import { SectionHeaderWrapper, SecureWebhookSignatureWrapper, SecureWebhookWrapper, StyledAccordianWrapper, WebhookLinkValidation, WebhookLinkValidationWrapper, WebhookLinkWrapper, WebhookPageHeader, WebhookURLStyle,OauthDropdowns, OauthForassignOne, } from './../subComponents/styledComponents'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import { IValidWebhookLink } from '../OrganizationWebhookProfile/WebhookProfile.reducer'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'
import { BranchWebhookProfileActions } from './BranchWebhookProfile.actions'
import { IBranchData } from './BranchWebhookProfile.reducer'
import { tGlobalPopupAction } from '../../../../common/GlobalPopup/GlobalPopup.reducer'
import { tGlobalToastActions } from '../../../../common/GlobalToasts/globalToast.reducer'
import AdditionalHeaders from '../../../../../utils/components/AdditionalHeaders/AdditionalHeaders'
import { addAdditionalHeader } from '../utils'
import { IAdditionalWebhookRecord } from '../../../../../utils/common.interface'
import { findPartialKeyName, getUniqueErrorKeys, hasDuplicates } from '../../../../../utils/helper';
import { WebhookProfileActions } from '../OrganizationWebhookProfile/WebhookProfile.actions'

interface IWebhookProfile {
    onFormCancel: () => void
}

const AddBranchWebhookProfile = (props: IWebhookProfile) => {

    const ListViewOption = [
        {
            value: 'POST',
            label: 'Post'
        }
    ]

    

    const dispatch = useDispatch<Dispatch<BranchWebhookProfileActions>>()
    const dispatch2 = useDispatch<Dispatch<WebhookProfileActions>>()
    const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const toast = useToast();
    const formInstance = useForm();
    const { register, handleSubmit, errors, clearErrors, control, getValues, setValue, formState, setError, watch } = formInstance;

    const { isDirty } = formState;

    const webhookProfileFormData = useTypedSelector(state => state.branchWebhookProfile.branchWebhookProfileFormData)
    const webhookLinks = useTypedSelector(State => State.branchWebhookProfile.branchWebhookLinks);
    const isLoading = useTypedSelector(state => state.branchWebhookProfile.isLoading)
    const eventsData = useTypedSelector(state => state.branchWebhookProfile.events)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.driver);
    const editedWebhookProfile = useTypedSelector(state => state.branchWebhookProfile.editedWebhookProfile);
    const isFormEditable = useTypedSelector(state => state.branchWebhookProfile.isEditMode)
    const additionalHeaders = useTypedSelector(state => state.branchWebhookProfile.additionalHeaders)
    const maptokenfl = localStorage.getItem('maptokenShowHide') == 'true' ? true : false

    const [isWebhookSecure, setIsWebhookSecure] = useState<boolean>(false)
    const [webhookLink, setWebhookLink] = useState<IValidWebhookLink>({ type: undefined, link: undefined, isValid: true, showValidation: false, tokenName:undefined , appendTo:undefined });
    const [newWeblink, setNewWeblink] = useState<boolean>(true);
    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [branchList, setBranchList] = useState<IBranchData[]>([]);
    const [usedUrl, setUsedUrl] = useState<string | undefined>();
    const [isRemoveNewWeblink, setIsRemoveNewWeblink] = useState<boolean>(false);
    const [setRotate, setRotateState] = useState("accordionIcon");
    const [isToggleChanged, setIsToggleChanged] = useState<boolean>(false);
    const [isAdditionalHeaderVisible, setAdditionalHeadersVisible] = useState(true);
    const [tokenName , setTokenName] = useState('')
    const [appnedTo , setAppendTo]  =useState('')

    //oauth2
    const OauthDropDownData = useTypedSelector(state => state.webhookProfile.OauthTokenDropDown);
    const [mapToken, setMapToken] = useState(false)
    const [oneormany, SetOneorMany] = useState(false)
    const [radioValue , setRadioValue] = useState("")

       //Oauth end here
       useEffect(() =>{
        dispatch2({
            type: "@@webhookProfile/SET_OAUTH_TOKEN",
        });
    },[])
    //oauth end here
    
    const elementsRef = useRef(Object.keys(eventsData).map(() => createRef()));

    const toggleAccordion = (id: string, index: React.Key) => {
        setActiveState(setActive === id ? "" : id);
        setHeightState(
            setActive === "active" ? "0px" : `${elementsRef.current[index].current.scrollHeight}px`
        );
        setRotateState(
            setActive === "active" ? "accordionIcon" : "accordionIcon rotate"
        );
    }

    const branchWebhookProfileNameErrorMessages = {
        required: dynamicLabels.webhookNameRequired || "Webhook Profile Name is mandatory.",
        pattern: dynamicLabels.webhookNamePattern || "Webhook Profile Name should be alphanumeric.",
        unique: dynamicLabels.webhookNameUnique || "Webhook Profile Name should be unique"
    }

    const branchNameErrorMessages = {
        required: dynamicLabels.branchRequired || "Branch Name is mandatory.",
    }

    const branchWebhookURLErrorMessages = {
        required: dynamicLabels.webhookUrlRequired || "URL is mandatory.",
        unique: dynamicLabels.webhookUrlUnique || "URL already provided.",
        noPost: dynamicLabels.webhookUrlNoPost || "Invalid URL type.",
        successfulTest: dynamicLabels.webhookUrlSuccessfulTest || "Successful url test is required.",
        duplicated: dynamicLabels.webhookUrlDuplicated || "Duplicate URL(s).",
        urlMissing: dynamicLabels.webhookUrlUrlMissing || 'Please enter the url.'
    }

    const branchWebhookSignatureErrorMessages = {
        required: dynamicLabels.webhookSignatureRequired || "Webhook Signature is mandatory",
        maxLength: dynamicLabels.webhookSignaturePattern || "Invalid webhook signature.",
        minLength: dynamicLabels.webhookSignaturePattern || "Invalid webhook signature.",
        pattern: dynamicLabels.webhookSignaturePattern || 'Invalid webhook signature.'
    }



    const mapTokens = () => {
        setMapToken(!mapToken)
        setRadioValue("Assign to all") 
        //xxx
    }

    useEffect(() =>{
        if (mapToken) {
            if(webhookProfileFormData.mapTokenFl  != 'Y')
            {
             setRadioValue("Assign to all");
             SetOneorMany(false)
            }
        }
        else {
            setRadioValue("")
        }
    },[mapToken])

    const getBranches = async () => {
        try {
            const { data } = await axios.get(apiMappings.branchWebhookProfile.getBranches, {
                data: {}
            });
            const branchData = data.map((branch: IBranchData) => {
                branch["value"] = branch?.branchId;
                branch["label"] = branch?.name;
                branch["title"] = branch?.name;
                return branch;
            })
            setBranchList(branchData);
        } catch (errorMessage) {
            console.log(errorMessage)
        }
    }

    const onSubmit = async (data: any) => {
        console.log(tokenName , "neer")
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
            
        const eventsFormData: string[] = [];
        const eventsValueObj: { key: string; value: string }[] = [];
        Object.keys(eventsData).forEach(key => {
            eventsData[key].events.forEach((event) => {
                if (event?.checked) {
                    eventsFormData.push(event?.clientRefMasterCd);
                    eventsValueObj.push({ key: event?.clientRefMasterCd, value: event?.name })
                }
            })
        })

        if (!eventsFormData?.length) {
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
                    if (formValues['branchWebhookURL' + index]) {
                        setError('branchWebhookURL' + index, { type: 'duplicated' })
                    }
                }
            })

            if (webhookLink?.isValid && (webhookLink?.type && webhookLink.link)) {
                if (duplicateUrls.indexOf(`${webhookLink?.type}#@#${webhookLink?.link}`) > -1) {
                    setError('branchWebhookURL', { type: 'duplicated' })
                }
            }
            return;
        }   

        function findOAuthRefId(tokenName) {
            const foundObject = OauthDropDownData.find(obj => obj.label === tokenName);
            return foundObject ? foundObject.referenceId : null;
        }

        var mergedArray = webhookLinks.map(function (obj) {
            return {
              url: `${obj.type}#@#${obj.link}`,
              tokenSetPref: mapToken? radioValue ===   "Assign to indivisual" ? obj.appendTo : appnedTo : null,
              tokenName: mapToken ? radioValue ===   "Assign to indivisual" ?  obj.tokenName :tokenName : null,
              tokenConfigRefId: mapToken ? findOAuthRefId(radioValue === "Assign to indivisual" ?  obj.tokenName :tokenName) :  null,
              type:obj?.type
            };
          });
        if (webhookLink.type && webhookLink.link) {
            mergedArray.push({
                url: `${webhookLink.type}#@#${webhookLink.link}`,
                tokenSetPref: mapToken ?   radioValue === "Assign to indivisual" ? webhookLink.appendTo : appnedTo : null,
                tokenName: mapToken ? radioValue === "Assign to indivisual" ? webhookLink.tokenName : tokenName : null,
                tokenConfigRefId: mapToken ?  findOAuthRefId(radioValue === "Assign to indivisual" ? webhookLink.tokenName : tokenName): null,
                type: webhookLink?.type

            });
        }

        const formData = {
            branchWebhookProfileName: data?.branchWebhookProfileName,
            branchWebhookSignature: data?.branchWebhookSignature,
            secureWebhook: data?.secureWebhook,
            branchId: data?.branchId,
            receiveChildBranchesWebhook: data?.recieveChildBranchWebhook,
            mapTokenFl: data?.Oauthwebhook ? "Y" : "N",
            assignToAllFl:radioValue ===   "Assign to indivisual" ? "N" : "Y",  
            webhookUrlsData:mergedArray,
            events: eventsFormData,
            webhookHeaderFl: isAdditionalHeaderVisible,
            headerList: headerList
        }
        dispatch({ type: '@@branchWebhookProfile/SET_LOADING', payload: true });
        if (editedWebhookProfile) {
            formData['branchWebhookProfileId'] = editedWebhookProfile?.branchWebhookProfileId;
            formData['branchWebhookProfileName'] = webhookProfileFormData?.branchWebhookProfileName;
            try {
                const { data: { message, status, error: urlError } } = await axios.put(apiMappings.branchWebhookProfile.updateWebhook + editedWebhookProfile?.branchWebhookProfileId, formData);
                if (status === 200 || status === 201) {
                    toastDispatch({
                        type: '@@globalToast/add', payload: {
                            message: message,
                            icon: 'check-round',
                            remove: false
                        }
                    })
                    dispatch({ type: '@@branchWebhookProfile/SET_EDIT_MODE', payload: false })
                    dispatch({ type: '@@branchWebhookProfile/INITIALISE_FORM' });
                    props?.onFormCancel();
                }

                if (status === 409) {
                    if (urlError) {
                        const events = urlError.events?.map((item: string) => {
                            const eventValue = eventsValueObj?.filter((eventObj) => eventObj?.key === item);
                            return eventValue?.[0]?.value
                        })

                        toast.add(`${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'} ${dynamicLabels.duplicateUrlmsg || 'cannot be saved because the same URL has already been provided for the same'} ${events?.length > 1 ? 'events' : 'event'} ${events?.length > 1 ? events.slice(0, -1).join(', ') : events[events.length - 1]} ${events?.length > 1 ? 'and' : ''} ${events?.length > 1 ? events[events.length - 1] : ''} ${dynamicLabels.inThe || 'in the'} ${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'}.`, 'warning', false);
                        const url = urlError?.webhookUrls?.[0]?.split('#@#')[1];
                        if ((url && webhookLink?.link) && url === webhookLink?.link) {
                            setError('branchWebhookURL', {
                                type: 'unique'
                            })
                        } else if (webhookLinks?.length) {
                            setUsedUrl(url);
                        }
                    }
                }
            } catch (errorMessage) {
                console.log(errorMessage);
            } finally {
                dispatch({ type: '@@branchWebhookProfile/SET_LOADING', payload: false });
            }
        } else {
            try {
                const { data: { message, status, error: urlError } } = await axios.post(apiMappings.branchWebhookProfile.createWebhookProfile, formData);
                if (status === 200 || status === 201) {
                    toastDispatch({
                        type: '@@globalToast/add', payload: {
                            message: message,
                            icon: 'check-round',
                            remove: false
                        }
                    })
                    dispatch({ type: '@@branchWebhookProfile/SET_EDIT_MODE', payload: false })
                    dispatch({ type: '@@branchWebhookProfile/INITIALISE_FORM' });
                    props?.onFormCancel();
                }

                if (status === 409) {
                    if (!urlError) {
                        toast.add(message, 'warning', false);
                        setError('branchWebhookProfileName', {
                            type: 'unique'
                        })
                    } else if (urlError) {
                        const events = urlError.events?.map((item: string) => {
                            const eventValue = eventsValueObj?.filter((eventObj) => eventObj?.key === item);
                            return eventValue?.[0]?.value
                        })

                        toast.add(`${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'} ${dynamicLabels.duplicateUrlmsg || 'cannot be saved because the same URL has already been provided for the same'} ${events?.length > 1 ? 'events' : 'event'} ${events?.length > 1 ? events.slice(0, -1).join(', ') : events[events.length - 1]} ${events?.length > 1 ? 'and' : ''} ${events?.length > 1 ? events[events.length - 1] : ''} ${dynamicLabels.inThe || 'in the'} ${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'}.`, 'warning', false);
                        const url = urlError?.webhookUrls?.[0]?.split('#@#')[1];
                        if ((url && webhookLink?.link) && url === webhookLink?.link) {
                            setError('branchWebhookURL', {
                                type: 'unique'
                            })
                        } else if (webhookLinks?.length) {
                            setUsedUrl(url);
                        }
                    }
                }

            } catch (errorMessage) {
                console.log(errorMessage);
            } finally {
                dispatch({ type: '@@branchWebhookProfile/SET_LOADING', payload: false });
            }
        }
    };

    const handleWebhookLinkUrlChange = (type: string | undefined = "POST", url: string | undefined) => {
        setNewWeblink(false);
        clearErrors('branchWebhookURL');
        setWebhookLink({
            ...webhookLink,
            type: type,
            link: url,
            isValid: true,
            showValidation: false
        })
    }

    const handleWebhookLinkTypeChange = (type: string | undefined = "POST", url: string | undefined) => {
        setNewWeblink(false);
        clearErrors('branchWebhookURL');
        setWebhookLink({
            ...webhookLink,
            type: type,
            link: url,
            isValid: true,
            showValidation: false
        })
    }

    const handleValidateWebhookLink = async (webhooklink: IValidWebhookLink) => {
        setNewWeblink(false);
        clearErrors('branchWebhookURL');
        if (webhooklink?.type && webhooklink?.link) {
            try {
                const { status, data: { hasError } } = await axios.get(`${apiMappings.branchWebhookProfile.testUrl}${webhooklink?.link}&requestType=${webhooklink?.type}&webhookProfileId=-1`, {})
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
            if (!webhookLink?.link) {
                setError('branchWebhookURL', { type: 'urlMissing' })
            }
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
        clearErrors(`branchWebhookURL`);
        clearErrors(`tokenName`);
        clearErrors(`appendTo`);
        if (webhookLinks?.length === 3) {
            toast.add(dynamicLabels.maxWebhookUrlMsg || 'A maximum of 4 URLs can be added to this Webhook Profile. You have exceeded the maximum number. Please add another Webhook Profile.', 'warning', false);
            return;
        }
        if (webhookLink?.link && webhookLink?.type && (!mapToken ||  radioValue === "Assign to all" || webhookLink.tokenName && webhookLink.appendTo) ) {
            dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...webhookLinks, webhookLink] })
            setNewWeblink(true);
            if (webhookLinks?.length === 3){
                setIsRemoveNewWeblink(false);
                return
            }
            setIsRemoveNewWeblink(true);
        } else {
            if(webhookLink?.type && !webhookLink.link ){
                setError('branchWebhookURL', { type: 'urlMissing' })
            }
            if(!webhookLink.tokenName){
                setError('tokenName' ,{type:'required'}) 
            }
            if(!webhookLink.appendTo){
                setError('appendTo' ,{type:'required'}) 
            }
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
        updatedWebhookLinks.splice(index, 1);
        dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
    }

    const handleTypeChange = (index: number, value: string | undefined) => {
        clearErrors(`branchWebhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        updatedWebhookLinks[index].type = value;
        dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
    }

    const handleUrlChange = (index: number, value: string | undefined) => {
        clearErrors(`branchWebhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        updatedWebhookLinks[index].link = value;
        updatedWebhookLinks[index].isValid = true;
        updatedWebhookLinks[index].showValidation = false;
        dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
    }

    const handleValidateUrl = async (index: number) => {
        clearErrors(`branchWebhookURL${index}`);
        const updatedWebhookLinks = webhookLinks;
        if (updatedWebhookLinks[index]?.type && updatedWebhookLinks[index]?.link) {
            try {

                const { status, data: { hasError } } = await axios.get(`${apiMappings.branchWebhookProfile.testUrl}${updatedWebhookLinks[index]?.link}&requestType=${updatedWebhookLinks[index]?.type}&webhookProfileId=${editedWebhookProfile?.branchWebhookProfileId || '-1'}`)
                if (status === 200 && !hasError) {
                    updatedWebhookLinks[index].isValid = true;
                } else {
                    updatedWebhookLinks[index].isValid = false;
                    setError(`branchWebhookURL${index}`, { type: 'successfulTest' });
                }
                updatedWebhookLinks[index].showValidation = true;
                dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
            } catch (errorMessage) {
                updatedWebhookLinks[index].isValid = false;
                updatedWebhookLinks[index].showValidation = true;
                setError(`branchWebhookURL${index}`, { type: 'successfulTest' });
                dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
            }
        } else {
            if (!updatedWebhookLinks[index].link) {
                setError(`branchWebhookURL${index}`, { type: 'urlMissing' });
            }
            updatedWebhookLinks[index].isValid = false;
            dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
        }
    }

    const setIsEventSelected = (name: any, index: any) => {
        const modifiedEventsData = Object.assign({}, eventsData);
        modifiedEventsData[name].events[index].checked = !modifiedEventsData[name].events[index].checked;
        dispatch({ type: '@@branchWebhookProfile/SET_EVENTS_DATA', payload: modifiedEventsData });
    }

    const setWebhookProfileFormData = (key: string, value: any) => {
        // clearErrors("webhookSignature")
        const { branchId } = getValues();

        if (branchId) {
            setValue("branchId", branchId);
            dispatch({
                type: '@@branchWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA',
                payload: { key: 'branchId', value: branchId }
            });
        }

        dispatch({
            type: '@@branchWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA',
            payload: { key: key, value: value }
        });
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
                                dispatch({ type: '@@branchWebhookProfile/INITIALISE_FORM' });
                                dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
                                dispatch({ type: '@@branchWebhookProfile/SET_EDIT_MODE', payload: false })
                                props?.onFormCancel();
                            }}>{dynamicLabels.ok}</IconButton>
                            <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
                        </>
                    )
                }
            })
        }
        else {
            dispatch({ type: '@@branchWebhookProfile/INITIALISE_FORM' });
            dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
            dispatch({ type: '@@branchWebhookProfile/SET_EDIT_MODE', payload: false })
            props?.onFormCancel();
        }
    }

    const generateWebhookSignature = async () => {
        try {
            const { data: { data: signature, status } } = await axios.get(apiMappings.branchWebhookProfile.generateSignature);
            if (status === 200) {
                setWebhookProfileFormData('branchWebhookSignature', signature);
                clearErrors("branchWebhookSignature");
            }
        } catch (errorMessage) {
            console.log(errorMessage);
        }
    }

    const getExistingSignature = async () => {
        try {
            const { data: { data: { propertyValue: signature }, status } } = await axios.get(apiMappings.branchWebhookProfile.getWebhookSignatue + webhookProfileFormData?.branchId);
            if (status === 200 && signature) {
                setWebhookProfileFormData('branchWebhookSignature', signature);
            } else {
                generateWebhookSignature();
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
            setValue("branchWebhookURL", undefined);
        }
    }, [newWeblink])

    useEffect(() => {
        setIsWebhookSecure(webhookProfileFormData?.secureWebhook);
        setValue("branchId", webhookProfileFormData?.branchId);
        setValue("branchWebhookProfileName", webhookProfileFormData?.branchWebhookProfileName || undefined);
        setValue("secureWebhook", webhookProfileFormData?.secureWebhook || false);
        setValue("recieveChildBranchWebhook", webhookProfileFormData?.receiveChildBranchesWebhook || false);
        setValue("branchWebhookSignature", webhookProfileFormData?.branchWebhookSignature || undefined);
        setValue("Oauthwebhook" ,  webhookProfileFormData?.mapTokenFl == "Y" ? true : false)
        //oauth update here 
        if(webhookProfileFormData?.mapTokenFl){
            setRadioValue(webhookProfileFormData?.mapTokenFl === "N" ? "" : webhookProfileFormData?.assignToAllFl === "N" ?  "Assign to indivisual" : "Assign to all")
        }
        if(webhookProfileFormData?.assignToAllFl){
            // setRadioValue(webhookProfileFormData?.assignToAllFl === "N"  ? "Assign to indivisual" : "Assign to all")
            SetOneorMany(webhookProfileFormData?.assignToAllFl === "N"  ? true  : false)
            setMapToken(webhookProfileFormData?.mapTokenFl == "Y" ? true : false)
        }
        var a =  webhookProfileFormData?.assignToAllFl === "N"  ? "Assign to indivisual" : "Assign to all"
        if (
            webhookProfileFormData &&
            webhookProfileFormData.webhookUrlsData &&
            webhookProfileFormData.webhookUrlsData[0] &&
            webhookProfileFormData.webhookUrlsData[0].tokenName
          ){
             setTokenName(a === "Assign to all" ? webhookProfileFormData?.webhookUrlsData[0]?.tokenName : "")
          }
          if (
            webhookProfileFormData &&
            webhookProfileFormData.webhookUrlsData &&
            webhookProfileFormData.webhookUrlsData[0] &&
            webhookProfileFormData.webhookUrlsData[0].tokenSetPref
          ){
             setAppendTo(a === "Assign to all" ? webhookProfileFormData?.webhookUrlsData[0]?.tokenSetPref : "")
          }
        setAdditionalHeadersVisible(webhookProfileFormData?.webhookHeaderFl)

        if (webhookProfileFormData?.headerList.length > 0 && webhookProfileFormData?.headerList.length === additionalHeaders.length) {
            additionalHeaders.forEach((obj, index) => {
                if(webhookProfileFormData?.headerList[index]) {
                    setValue(`${findPartialKeyName(obj, "Header-")}`, webhookProfileFormData?.headerList[index].key)
                    setValue(`${findPartialKeyName(obj, "Value-")}`, webhookProfileFormData?.headerList[index].value)
                }
            })
        }
    }, [webhookProfileFormData]);

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
        getBranches();
        dispatch({ type: '@@branchWebhookProfile/SET_EVENTS_DATA', payload: eventsData });
        if (editedWebhookProfile?.branchWebhookProfileId) {
            dispatch({ type: '@@branchWebhookProfile/GET_WEBHOOK_DETAILS_DATA', payload: editedWebhookProfile?.branchWebhookProfileId.toString() })
            dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
            dispatch({ type: '@@branchWebhookProfile/SET_EDIT_MODE', payload: true })
        } else {
            dispatch({ type: '@@branchWebhookProfile/INITIALISE_FORM' });
        }
    }, []);

    useEffect(() => {
    }, [eventsData]);

    useEffect(() => {
        webhookLinks?.forEach((link, index) => {
            setValue(`branchWebhookURL${index}`, link?.link);
        });
        if (newWeblink) {
            setValue("branchWebhookURL", undefined);
        }
    }, [webhookLinks])

    useEffect(() => {
        if (isWebhookSecure && webhookProfileFormData && !webhookProfileFormData?.branchWebhookSignature) {
            if (webhookProfileFormData?.branchId) {
                getExistingSignature();
            }
        }
    }, [isWebhookSecure]);

    useEffect(() => {
        if (!isFormEditable && additionalHeaders.length < 1) {
            dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
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
            dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
        }
    }

    const handleRemoveAdditionalHeader = (id: string) => {
        const newAdditionalHeaders = additionalHeaders.filter((header: IAdditionalWebhookRecord) => header[`${findPartialKeyName(header, 'Header-')}`].id !== id)
        dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: newAdditionalHeaders })
        return;
    }

    useEffect(() => {
        if (isFormEditable && isAdditionalHeaderVisible && webhookProfileFormData && webhookProfileFormData?.headerList?.length > 0) {
            let headerList: Array<IAdditionalWebhookRecord> = [];
            
            let currentTimeStamp = new Date().getTime();
            webhookProfileFormData?.headerList.map((obj) => {
                currentTimeStamp++
                const additionalWebhook = {
                    [`Header-${currentTimeStamp}`]: { id: `Header-${currentTimeStamp}`, name: `Header-${currentTimeStamp}`, class: `Header-${currentTimeStamp}` },
                    [`Value-${currentTimeStamp}`]: { id: `Value-${currentTimeStamp}`, name: `Value-${currentTimeStamp}`, class: `Value-${currentTimeStamp}`}
                }
                headerList = [...headerList, ...[additionalWebhook]]
            })

            if (headerList.length > 0 && additionalHeaders.length < headerList.length) {
                dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: [] });
                dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: headerList });
                return;
            }
        } else {
            if(additionalHeaders.length < 1) {
                dispatch({ type: '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS', payload: addAdditionalHeader(additionalHeaders) })
            }
        }
    }, [isFormEditable, webhookProfileFormData, isAdditionalHeaderVisible])

    useEffect(() => {
        if (additionalHeaders.length > 0 ) {
            additionalHeaders.forEach((obj, index) => {
                if(webhookProfileFormData?.headerList[index]) {
                    setValue(`${findPartialKeyName(obj, "Header-")}`, webhookProfileFormData?.headerList[index].key)
                    setValue(`${findPartialKeyName(obj, "Value-")}`,  webhookProfileFormData?.headerList[index].value)
                }
            })
        }
    }, [additionalHeaders])
    
   console.log("token_append",tokenName,appnedTo)
   const options = [
    {
        value: 'emailVerificationPending',
        label: 'Email Verification Pending Shipper',
        title: 'Email Verification Pending Shipper'
    },
    { value: 'allShippers', label: 'All Shippers', title: 'All Shippers' },
    {
        value: 'approvalPendingShippers',
        label: 'Approval Pending Shippers',
        title: 'Approval Pending Shippers'
    }

]

const optionsAppend = [
    {
        value: 'header',
        label: 'Header',
        title: 'Header'
    },
    { value: 'url', label: 'URL', title: 'URL' },

]

//Oauth end here

const handleAppendDropDownchnage = (index ,e) =>{
    const updatedWebhookLinks = webhookLinks;
    updatedWebhookLinks[index].appendTo = e
    dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
}

const handleDropDownchanges = (index,e) =>{
    const updatedWebhookLinks = webhookLinks;
    updatedWebhookLinks[index].tokenName = e
    dispatch({ type: '@@branchWebhookProfile/SET_WEBHOOKS_LINKS', payload: [...updatedWebhookLinks] })
}

const handleDropDownchange = (e)  =>{
    setWebhookLink({
        ...webhookLink,
        tokenName : e
    })
}

const handleApendTochange = (e) =>{
    setWebhookLink({
        ...webhookLink,
        appendTo: e
    })
}

const OauthTokenErrorMessages = {
    required : dynamicLabels.OauthNameRequired || 'Token name is mandatory'
}
    return (
        <>
            <div id='toast-inject-here'></div>
            <WebhookPageHeader className="webhook-page-header">
                {`${dynamicLabels.add} ${dynamicLabels.BranchWebhookProfile}` || 'Add Branch Webhook Profile'}
            </WebhookPageHeader>
            <Box display='flex' flexDirection='column' style={{ width: '100%', minHeight: 'calc(100vh - 130px)', height: 'auto', backgroundColor: '#fff', boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)" }} py='15px' px="15px">
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} bgColor="#fff">
                    <SectionHeaderWrapper className="section-header-wrapper">
                        <SectionHeader headerTitle={`${dynamicLabels.BranchWebhookProfile || 'Branch Webhook Profile'} ${dynamicLabels.Details || 'Details'}`} />
                    </SectionHeaderWrapper>
                    <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">
                        <Grid container spacing='15px'>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <TextInput
                                    id='branchWebhookProfileName'
                                    name='branchWebhookProfileName'
                                    className='branchWebhookProfileName'
                                    label={`${dynamicLabels.BranchWebhookProfile || "Branch Webhook Profile"} ${dynamicLabels.Name}`}
                                    labelColor={theme.colors.text.inputLabel.default}
                                    placeholder={`${dynamicLabels.BranchWebhookProfile || "Branch Webhook Profile"} ${dynamicLabels.Name}`}
                                    maxLength={50}
                                    error={errors?.branchWebhookProfileName}
                                    errorMessage={errors?.branchWebhookProfileName && branchWebhookProfileNameErrorMessages[errors?.branchWebhookProfileName.type]}
                                    required={true}
                                    fullWidth={true}
                                    onBlur={(e: { target: { value: any } }) => setWebhookProfileFormData('branchWebhookProfileName', e.target.value)}
                                    onChange={() => { }}
                                    tooltipMesaage={dynamicLabels?.BranchWebhookProfileNameTooltipMsg || "Provide a unique name to identify the Branch Webhook Profile."}
                                    arrowPlacement='center'
                                    messagePlacement='start'
                                    tooltipDirection='bottom'
                                    width="100%"
                                    disabled={!!editedWebhookProfile}
                                    ref={register({
                                        required: true,
                                        maxLength: 50,
                                        pattern: /^[a-zA-Z0-9_ ]+$/
                                    })}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <Controller
                                    // as={DropDown}
                                    id="branchId"
                                    name="branchId"
                                    rules={{ required: true }}
                                    control={control}
                                    render={() => (
                                        <DropDown
                                            onChange={(value: any) => {
                                                setWebhookProfileFormData('branchId', value);
                                                setIsToggleChanged(true);
                                                if (isWebhookSecure && !webhookProfileFormData.branchWebhookSignature) {
                                                    generateWebhookSignature();
                                                }
                                            }}
                                            variant='form-select'
                                            optionList={branchList}
                                            label={`${dynamicLabels.branch} ${dynamicLabels.Name}`}
                                            required={true}
                                            loading={branchList.length ? false : true}
                                            error={errors?.branchId}
                                            errorMessage={errors?.branchId && branchNameErrorMessages[errors?.branchId.type]}
                                            placeholder={`${dynamicLabels.branch} ${dynamicLabels.Name}`}
                                            value={webhookProfileFormData?.branchId}
                                            width="100%"
                                            onMenuOpen={() => { }}
                                            onMenuClose={() => { }}
                                            showDescription={false}
                                            tooltipMessage={dynamicLabels.BranchNameTooltipMsg || 'Choose the branch for which the Branch Webhook Profile should be created.'}
                                            disabled={false}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <SecureWebhookWrapper className="secure-webhook-wrapper">
                                    <Tooltip message={`${dynamicLabels.ReceivesChildBranchesWebhookTooltipMsg || "Enabling this option means branch will receive webhooks for events that occur in child branches."}`} hover messagePlacement='end' tooltipDirection='bottom' arrowPlacement='end'>
                                        <Toggle
                                            id='recieveChildBranchWebhook'
                                            name="recieveChildBranchWebhook"
                                            label={dynamicLabels.ReceiveChildBranchesWebhook || "Receive Child Branches Webhook"}
                                            labelColor={theme.colors.text.inputLabel.default}
                                            checked={webhookProfileFormData?.receiveChildBranchesWebhook}
                                            onChange={() => { setWebhookProfileFormData('receiveChildBranchesWebhook', !webhookProfileFormData?.receiveChildBranchesWebhook); setIsToggleChanged(true); }}
                                            disabled={false}
                                            width="100%"
                                            ref={register}
                                        />
                                    </Tooltip>
                                </SecureWebhookWrapper>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <SecureWebhookWrapper className="secure-webhook-wrapper">
                                    <Tooltip message={`${dynamicLabels.BrnachSecureBranchWebhookTooltipMsg || "Enabling this option means Branch Webhook Signature will be passed for authentication in the request body of the webhook."}`} hover messagePlacement='end' tooltipDirection='bottom' arrowPlacement='end'>
                                        <Toggle
                                            id='branchSecureWebhook'
                                            label={`${dynamicLabels.Secure || 'Secure'} ${dynamicLabels.BranchWebhook || "Branch Webhook"}`}
                                            name="secureWebhook"
                                            labelColor={theme.colors.text.inputLabel.default}
                                            checked={isWebhookSecure}
                                            onChange={handleSecureWebhookToggle}
                                            disabled={false}
                                            width="100%"
                                            ref={register}
                                        />
                                    </Tooltip>
                                </SecureWebhookWrapper>
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <SecureWebhookSignatureWrapper className="secure-webhook-signature-wrapper">    
                                <TextInput
                                        id='branchWebhookSignature'
                                        name='branchWebhookSignature'
                                        className='branchWebhookSignature'
                                        label={`${dynamicLabels.BranchWebhook || "Branch Webhook"} ${dynamicLabels.Signature || 'Signature'} `}
                                        labelColor={theme.colors.text.inputLabel.default}
                                        placeholder={`${dynamicLabels.BranchWebhook || "Branch Webhook"} ${dynamicLabels.Signature || 'Signature'} `}
                                        error={isWebhookSecure && errors?.branchWebhookSignature}
                                        errorMessage={errors?.branchWebhookSignature && branchWebhookSignatureErrorMessages[errors?.branchWebhookSignature?.type]}
                                        required={isWebhookSecure && true}
                                        fullWidth={true}
                                        onBlur={(e: { target: { value: any } }) => setWebhookProfileFormData('branchWebhookSignature', e.target.value)}
                                        onChange={() => { }}
                                        tooltipMesaage={dynamicLabels?.BranchWebhookSignatureTooltipMsg || "Provide or autogenerate a Branch Webhook Signature."}
                                        arrowPlacement='center'
                                        messagePlacement='start'
                                        tooltipDirection='bottom'
                                        width="100%"
                                        ref={register({
                                            required: isWebhookSecure ? true : false,
                                            maxLength: isWebhookSecure ? 256 : undefined,
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
                         <Box display='flex' flexDirection='row' style={{ width: '100%', margin: '15px 0' }} bgColor="#fff" mt="">
                            <Grid container spacing='15px'>
                        {maptokenfl && (   <Grid item xs={6} sm={6} md={4} lg={3} style={{margin: "auto 0"}}>
                                    <Toggle
                                        id='Oauthwebhook'
                                        name="Oauthwebhook"
                                        label={"Map Token"}
                                        labelColor={theme.colors.text.inputLabel.default}
                                        checked={mapToken}
                                        onChange={mapTokens}
                                        disabled={false}
                                        // width="100%"
                                        ref={register}
                                    />

                                </Grid>)}
                        {/* here i have radio button  */}
                        {maptokenfl && mapToken && 
                                <Grid item xs={6} sm={6} md={4} lg={3}>
                                    <RadioGroup
                                        id='defaultRadioGroup'
                                        spacing={2}
                                        variant='default'
                                        width='300px'
                                        label='Gender'
                                    >
                                        <Radio
                                            id='branchWebhookProfile-radioButton-assignToAll'
                                            onChange={() => { SetOneorMany(false) ; setRadioValue("Assign to all") }}
                                            checked={!oneormany}
                                            name={"Assign to all"}
                                            value={"Assign to all"}
                                            label={"Assign to All"}
                                        />
                                        <Radio
                                            id='branchWebhookProfile-radioButton-assignToIndividual'
                                            onChange={() => { SetOneorMany(true); setRadioValue("Assign to indivisual") }}
                                            checked={oneormany}
                                            name={"Assign to indivisual"}
                                            value={"Assign to indivisual"}
                                            label={"Assign to Individual"}
                                        />
                                    </RadioGroup>

                                </Grid> }
                            </Grid>  
                        </Box>

                        { maptokenfl && radioValue === "Assign to all" &&
                            <OauthDropdowns>
                            <>
                                <Controller
                                    // as={DropDown}
                                    id="OauthwebhookToken"
                                    name="OauthwebhookToken"
                                    rules={{ required: tokenName ? false : true }}
                                    control={control}
                                    render={() => (
                                        <DropDown
                                            optionList={OauthDropDownData}
                                            label={'Token Name'}
                                            error={errors?.OauthwebhookToken}
                                            errorMessage={errors?.OauthwebhookToken && "Token name is mandatory"}
                                            required={true}
                                            onChange={(e: string) => {
                                                setTokenName(e), clearErrors('OauthwebhookToken')
                                            }}
                                            placeholder={'Select'}
                                            value={tokenName}
                                            width={'300px'}

                                        />)} />
                                <Controller
                                    // as={DropDown}
                                    id="AppendTo"
                                    name="AppendTo"
                                    rules={{ required: appnedTo ? false : true }}
                                    control={control}
                                    render={() => (
                                        <DropDown
                                            optionList={optionsAppend}
                                            label={'Append to'}
                                            error={errors?.AppendTo}
                                            errorMessage={errors?.AppendTo && "Append to  is mandatory"}
                                            required={true}
                                            onChange={(e: string) => {
                                                setAppendTo(e), clearErrors('AppendTo')
                                            }}
                                            placeholder={'Select'}
                                            value={appnedTo}
                                            width={'300px'}

                                        />)} />

                            </>
                            </OauthDropdowns>
                        }
                        {/* {end here} */}

                        {webhookLinks.length > 0 && webhookLinks?.map((webhookLinkObj, index) => {
                            return (
                                <WebhookLinkWrapper key={`${webhookLinkObj}-${index}-link`} className="webhook-link-wrapper">
                                    <WebhookURLStyle  width= {radioValue ===  "Assign to indivisuall" ? '50%' : '100%' } className="webhook-url-style">
                                        <Box display="flex" flexDirection="row" style={{ width: "100%" }} justifyContent="flex-start" className={errors?.[`branchWebhookURL${index}`] && errors?.[`branchWebhookURL${index}`]?.type === 'noPost' ? 'ivalidUrlType' : ''}>
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
                                                                // action('Universal open/closed')(menuIsOpen)
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
                                            <WebhookLinkValidationWrapper className={(webhookLinkObj?.showValidation && !webhookLinkObj?.isValid) || (usedUrl === webhookLinkObj?.link) || (errors?.[`branchWebhookURL${index}`]) ? 'webhook-link-validation-wrapper inValidLink' : 'webhook-link-validation-wrapper'}>
                                                <TextInput
                                                    id={`branchWebhookURL${index}`}
                                                    name={`branchWebhookURL${index}`}
                                                    className='branchWebhookURL'
                                                    labelColor={theme.colors.text.inputLabel.default}
                                                    placeholder={dynamicLabels.EnterURL || 'Enter URL'}
                                                    maxLength={250}
                                                    error={errors?.[`branchWebhookURL${index}`] || usedUrl === webhookLinkObj?.link}
                                                    errorMessage={errors?.[`branchWebhookURL${index}`] && branchWebhookURLErrorMessages[errors?.[`branchWebhookURL${index}`].type] || usedUrl === webhookLinkObj?.link && dynamicLabels.webhookUrlUnique || 'URL already provided.'}
                                                    required={false}
                                                    fullWidth={true}
                                                    onBlur={(e: { target: { value: string | undefined } }) => handleUrlChange(index, e.target.value)}
                                                    onChange={() => { }}
                                                    tooltipMesaage=""
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
                                                        color="#f05548"
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
                                    {maptokenfl && radioValue == "Assign to indivisual" &&
                                        <OauthDropdowns>
                                        <Controller
                                            // as={DropDown}
                                            id={`tokenName${index}`}
                                            name={`tokenName${index}`}
                                            rules={{ required: webhookLinkObj.tokenName ? false : true }}
                                            control={control}
                                            render={() => (
                                                <DropDown
                                                    optionList={OauthDropDownData}
                                                    label={'Token Name'}
                                                    required={true}
                                                    error={errors?.[`tokenName${index}`]}
                                                    errorMessage={"this filed is needed"}
                                                    onChange={(e) => handleDropDownchanges(index, e)}
                                                    placeholder={'Select'}
                                                    value={webhookLinkObj.tokenName}
                                                    width={"185px"}
                                                />)} />

                                        <Controller
                                            // as={DropDown}
                                            id={`appendTo${index}`}
                                            name={`appendTo${index}`}
                                            rules={{ required: webhookLinkObj.appendTo ? false : true }}
                                            control={control}
                                            render={() => (
                                                <DropDown
                                                    optionList={optionsAppend}
                                                    error={errors?.[`appendTo${index}`]}
                                                    errorMessage={"this filed is needed"}
                                                    label={'Append to'}
                                                    required={true}
                                                    onChange={(e: string) => {
                                                        handleAppendDropDownchnage(index, e)
                                                    }}
                                                    placeholder={'Select'}
                                                    value={webhookLinkObj.appendTo}
                                                    width={'185px'}
                                                />)} />
                                        </OauthDropdowns>
                                    }
                                </WebhookLinkWrapper>
                                
                            )
                        })}
                        {(webhookLinks.length == 0 || isRemoveNewWeblink) && webhookLinks.length <= 3 && <WebhookLinkWrapper className="noBorder webhook-link-wrapper">
                            <WebhookURLStyle  width= {radioValue ===  "Assign to indivisual" ? '50%' : '100%' } className="webhook-url-style">
                                <Box display="flex" flexDirection="row" style={{ width: "100%" }} justifyContent="flex-start" className={errors?.branchWebhookURL && errors?.branchWebhookURL?.type === 'noPost' ? 'ivalidUrlType' : ''}>
                                    <IconDropdown
                                        variant='default-dropdown'
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
                                    <WebhookLinkValidationWrapper className={((webhookLink?.showValidation && !webhookLink?.isValid) || errors?.branchWebhookURL) ? 'webhook-link-validation-wrapper inValidLink' : 'webhook-link-validation-wrapper'}>
                                        <TextInput
                                            id="branchWebhookURL"
                                            name='branchWebhookURL'
                                            className='branchWebhookURL'
                                            labelColor={theme.colors.text.inputLabel.default}
                                            placeholder="Enter URL"
                                            maxLength={250}
                                            error={errors?.branchWebhookURL || !webhookLink?.isValid}
                                            errorMessage={errors?.branchWebhookURL && branchWebhookURLErrorMessages[errors?.branchWebhookURL.type] || (!webhookLink?.isValid && webhookLink?.showValidation) && "Successful URL test is required."}
                                            required={false}
                                            fullWidth={true}
                                            onBlur={(e: { target: { value: string | undefined } }) => handleWebhookLinkUrlChange(webhookLink?.type, e.target.value)}
                                            onChange={() => { }}
                                            tooltipMesaage="branchWebhookURL"
                                            // value={newWeblink ? "" : webhookLink?.link}
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
                                                color="#f05548"
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
                                        children='Test URL'
                                    />
                                </Box>
                            </WebhookURLStyle>
                            <div className="webhook-link-action-buttons">
                                {webhookLinks?.length > 0 && <IconButton iconVariant="icomoon-close" iconSize={11} circle className="deleteWebhooklink" onClick={() => { handleRemoveWebhookLink(-1) }} />}
                                <IconButton iconVariant="icomoon-add" iconSize={11} circle primary onClick={() => handleAddWebhookLink()} className="add-link-button"></IconButton>
                            </div>
                            {maptokenfl && radioValue == "Assign to indivisual" &&
                                <OauthDropdowns>
                                    <Controller
                                        // as={DropDown}
                                        id="tokenName"
                                        name="tokenName"
                                        rules={{ required: webhookLink?.tokenName ? false : true }}
                                        control={control}
                                        render={() => (
                                            <DropDown
                                                optionList={OauthDropDownData}
                                                label={'Token Name'}
                                                required={true}
                                                onChange={(e) => handleDropDownchange(e)}
                                                error={errors?.tokenName}
                                                errorMessage={errors?.tokenName && OauthTokenErrorMessages[errors?.tokenName] || (!webhookLink?.tokenName) && "Token name is mandatory"}
                                                placeholder={'Select'}
                                                value={webhookLink.tokenName || 'NA'}
                                                width={"185px"}
                                            />)} />
                                    <Controller
                                        // as={DropDown}
                                        id="appendTo"
                                        name="appendTo"
                                        rules={{ required: webhookLink?.appendTo ? false : true }}
                                        control={control}
                                        render={() => (
                                            <DropDown
                                                optionList={optionsAppend}
                                                label={'Append to'}
                                                required={true}
                                                onChange={(e) => {
                                                    handleApendTochange(e)
                                                }}
                                                error={errors?.appendTo}
                                                errorMessage={errors?.appendTo && OauthTokenErrorMessages[errors?.appendTo] || (!webhookLink?.appendTo) && "Append to is mandatory"}
                                                placeholder={'Select'}
                                                value={webhookLink.appendTo || 'NA'}
                                                width={'185px'}
                                            />
                                        )} />
                                </OauthDropdowns>
                            }
                        </WebhookLinkWrapper>}   
                    </Box>
                </Box>
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} bgColor="#fff" mt="30px">
                    <SectionHeaderWrapper className="section-header-wrapper">
                        <SectionHeader headerTitle={dynamicLabels.EventDetails || "Event Details"} />
                    </SectionHeaderWrapper>
                    <StyledAccordianWrapper className='stytled-accordian-wrapper'>
                        {
                            Object.keys(eventsData).map((key, index: React.Key) => {
                                const accordItem = eventsData[key];
                                return (
                                    <div className="accordionSection" key={index}>
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
                                                                    key={eventItem.clientRefMasterCd}
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
                    </StyledAccordianWrapper>
                </Box>
                <Box horizontalSpacing='15px' display='flex' mt='30px' fullWidth>
                    <IconButton id={editedWebhookProfile ? 'BranchWebhookForm-button-Update' : 'BranchWebhookForm-button-save'} className="form-action-button" iconVariant='icomoon-save' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleSubmit(onSubmit)} primary>{editedWebhookProfile ? dynamicLabels.update : dynamicLabels.save}</IconButton>
                    <IconButton id='BranchWebhookForm-button-cancel' className="form-action-button" iconVariant='icomoon-close' style={{ padding: '0px 15px' }} disabled={isLoading} onClick={handleCancelClick}>{dynamicLabels.cancel}</IconButton>
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

export default withThemeProvider(withToastProvider(withRedux(withPopup(AddBranchWebhookProfile)), 'toast-inject-here'))