import React, { Dispatch, useEffect, useRef, useState } from 'react'
import withRedux from '../../../../utils/redux/withRedux'
import { withThemeProvider } from '../../../../utils/theme'
import { withToastProvider, withPopup, Box, Grid, SectionHeader, TextInput, Card, BreadCrumb, FileUpload, useToast, Loader,ButtonGroup, Accordion,  AccordionContent, AccordionHeaderTitle, AccordionHeaderSubTitle,
    Modal, ModalHeader, IconButton} from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { SectionHeaderWrapper, FormActionButton, PromotionLinkActionButtonWrapper, PromotionActionButton, AccordionContentWraper, PreviewHeaderWrapper, BrandProfilePageHeader, BestFitTextWrapper } from './BrandProfileListStyledComponents'
import AceEditor from "react-ace-builds";
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/webpack-resolver.js'
import { useDispatch } from 'react-redux'
import { BrandProfileListActions } from './BrandProfileList.actions'
import PreviewModal from "../../../../utils/components/Preview/PreviewModal";
import DesktopPreview from '../../../../utils/components/Preview/DesktopPreview';
import MobilePreview from '../../../../utils/components/Preview/MobilePreview';
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import './BrandProfileList.css'
import {FunctionalIFrameComponent} from './FunctionalIframeComponent' 
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'
interface IBrandProfileForm {
    onFormCancel: () => void
    stateParams: any
}
export interface IFileData {
    id: string | number;
    filename: string;
    [key: string]: any;
}

const BrandProfileForm = (props: IBrandProfileForm) => {

    const toast = useToast();
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const dispatch = useDispatch<Dispatch<BrandProfileListActions>>()
    const pageLabels = useTypedSelector(state => state.pageLabels.brandingProfiles) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.brandProfile)

    const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);

    const isEditBrandProfile = useTypedSelector(state => state.brandProfile.listView.isEditBrandProfile);
    const formData = useTypedSelector(state => state.brandProfile.listView.brandProfileFormData);
    const defaultHeader = useTypedSelector(state => state.brandProfile.listView.defaultHeader.htmlData);
    const defaultFooter = useTypedSelector(state => state.brandProfile.listView.defaultFooter.htmlData);
    const templateReferenceId = useTypedSelector(state => state.brandProfile.listView.defaultTemplateReferenceId);
    const isLoading = useTypedSelector(state => state.brandProfile.listView.isLoading)

    const [headerData, setHeaderData] = useState<string>(formData.header.htmlData)
    const [footerData, setFooterData] = useState<string>(formData.footer.htmlData)
    const [payload] = useState<any>(new FormData());
    const [imagePayload] = useState<any>(new FormData());
    const [previewMode, setPreviewMode] = useState<string>('desktop');
    const [noOfErrorsInHeader, setNoOfErrorsInHeader] = useState<number>(0);
    const [noOfErrorsInFooter, setNoOfErrorsInFooter] = useState<number>(0);
    const [brandProfileNameError, setBrandProfileNameError] = useState<boolean>(false);
    const [brandProfileDescError, setBrandProfileDescError] = useState<boolean>(false);
    const [deletedMediaIds, setDeletedMediaIds] = useState<Array<number>>([])
    const [showUpdateConfirmationPopup, setShowUpdateConfirmationPopup] = useState<boolean>(false);
    const [fileNames, setFileNames] = useState<string>('')
    const [expanded, setExpanded] = React.useState('1')
    const headerEditor = useRef(null)
    const footerEditor = useRef(null)
    const subClientID =  props.stateParams?.shipperDetails && props.stateParams?.shipperDetails.subClientId ? props.stateParams.shipperDetails.subClientId : undefined
    const clientLogo =  JSON.parse(localStorage.getItem('userAccessInfo') || '{}').clientLogo || "https://s3-ap-southeast-1.amazonaws.com/loginext-client-logo/Vendor_Demo_445.png";

    const previewOptions = [
        { id: 'desktop', label: 'Desktop', selected: previewMode === 'desktop', tooltipText: 'Desktop', icon: 'desktop'},
        { id: 'mobile', label: 'Mobile', selected: previewMode === 'mobile', tooltipText: 'Mobile', icon: 'mobile' }
    ]

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'brandProfiles', label: dynamicLabels.brandProfiles }
    ], [pageLabels, dynamicLabels])

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }

    useEffect(() => {
        dispatch({ type: '@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA', payload: {subClientId: subClientID} })
        if (isEditBrandProfile) {
            dispatch({ type: '@@brandProfileList/GET_BRAND_PROFILE_DETAILS_DATA', payload: {brandProfileId : isEditBrandProfile?.brandProfileId, subClientId: subClientID} })
        } else {
            dispatch({ type: '@@brandProfileList/INITIALISE_FORM' });
        }
    },[])

    useEffect(() => {
        if (!isEditBrandProfile) {
            if (!headerData) { 
                let defaultHeaderClone = defaultHeader;
                defaultHeaderClone = defaultHeaderClone.replace('#@--dynamic_logo--@#',clientLogo)
                setHeaderData(defaultHeaderClone) }
            if (!footerData) { 
                let defaultFooterClone = defaultFooter;
                defaultFooterClone = defaultFooterClone.replace('#@--dynamic_logo--@#',clientLogo)
                setFooterData(defaultFooterClone) }            
        } else {
            if (!headerData) { 
                let defaultHeaderClone = formData.header.htmlData !== undefined ? formData.header.htmlData : defaultHeader;
                defaultHeaderClone = defaultHeaderClone.replace('#@--dynamic_logo--@#',clientLogo)
                setHeaderData(defaultHeaderClone) }
            if (!footerData) { 
                let defaultFooterClone = formData.footer.htmlData !== undefined ? formData.footer.htmlData : defaultFooter;
                defaultFooterClone = defaultFooterClone.replace('#@--dynamic_logo--@#',clientLogo)
                setFooterData(defaultFooterClone) }
            if (formData?.promotionLinks && !formData.promotionLinks.length) { 
                const promotionPayload = [
                    {mediaDto: {id: 1, filename: ''}, link:'', hasLinkError: false},
                    {mediaDto: {id: 2, filename: ''}, link:'', hasLinkError: false}
                ]
                formData.promotionLinks = promotionPayload
            }
        }
    },[defaultHeader, formData])

    useEffect(() => {
        setTimeout(() => {
            const innerHeaderElement = headerEditor.current?.['refEditor']['innerHTML'] || '';
            const noOfErrors = (innerHeaderElement.match(/ ace_error/g) || []).length;
            setNoOfErrorsInHeader(noOfErrors);
        }, 500)
    },[headerData])

    useEffect(() => {
       setTimeout(() => {
        const innerFooterElement = footerEditor.current?.['refEditor']['innerHTML'] || '';
        const noOfErrors = (innerFooterElement.match(/ ace_error/g) || []).length;
        setNoOfErrorsInFooter(noOfErrors)
       }, 500)
    },[footerData])

    const onChangeHeader = (newValue : string) => {
        setHeaderData(newValue);        
    }

    const onChangeFooter = (newFooterValue: string) => {
        setFooterData(newFooterValue)       
    }

    const handleAddPromotion = () => {
        formData.promotionLinks.push({mediaDto: {id: formData.promotionLinks.length + 1, filename: ''},  link: '', hasLinkError: false})
        dispatch({
            type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA',
            payload: { key: 'promotionLinks', value: [...formData.promotionLinks] }
        });
    }

    const handleRemovePromotion = (index: number) => {
        if (formData.promotionLinks[index].mediaDto.mediaUrl) {
            let deletedFileWithUrls = []
            deletedFileWithUrls = [...deletedMediaIds]
            deletedFileWithUrls.push(formData.promotionLinks[index].mediaDto.id);
            setDeletedMediaIds(deletedFileWithUrls)
        }
        formData.promotionLinks = formData.promotionLinks.filter((value, i) => {console.log(value); return index !== i})
        dispatch({
            type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA',
            payload: { key: 'promotionLinks', value: [...formData.promotionLinks] }
        });
    }

    const handleFileUpload = async (e: any, index: number) => {
        if (e.target.files && e.target.files.length) {
            formData.promotionLinks[index].mediaDto = {id: index, filename: e.target.files[0].name, file:e.target.files[0]}
        }
        imagePayload.append('promotionImage', e.target.files[0])

        const url = formData.structureReferenceId ? `${apiMappings.brandProfile.listView.uploadPromotionImage}?referenceId=${formData.structureReferenceId}` : apiMappings.brandProfile.listView.uploadPromotionImage;
        try {
            dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: true });
            const { data: { data, message, status } } = await axios.post(url, imagePayload,  {
                headers: {
                'Content-Type': 'multipart/form-data'
            }})
            
            if (status === 200) {          
                message && toast.add(message, 'check-round', false)
                formData.structureReferenceId = data.parentGuid;
                formData.promotionLinks[index].mediaDto.id = data.mediaId;
                formData.promotionLinks[index].mediaDto.filename = data.fileName
                formData.promotionLinks[index].mediaDto.mediaUrl = data.mediaUrl
                dispatch({
                    type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA',
                    payload: { key: 'promotionLinks', value: [...formData.promotionLinks] }
                });
                imagePayload?.delete("promotionImage")
            } else {        
                message && toast.add(message, 'warning', false)
                imagePayload?.delete("promotionImage")
            }
        } catch (error){      
            if (error?.response?.status === 412) {          
                error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                imagePayload?.delete("promotionImage")
            } else {
                error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                imagePayload?.delete("promotionImage")
            }
        } finally {
            dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: false });
        }
    }

    const handleFileRemove = (file: IFileData, index: number) => {
        console.log(file);
        if (formData.promotionLinks[index].mediaDto.mediaUrl) {
            let deletedFileWithUrls = []
            deletedFileWithUrls = [...deletedMediaIds]
            deletedFileWithUrls.push(formData.promotionLinks[index].mediaDto.id);
            setDeletedMediaIds(deletedFileWithUrls)
        }
        formData.promotionLinks[index].mediaDto = {id: 0, filename: ''}
        dispatch({
            type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA',
            payload: { key: 'promotionLinks', value: [...formData.promotionLinks] }
        });
    }

    const handleAddBrandProfile = async(filteredFilesCopy:string) => {
        const linksArray = formData.promotionLinks.map((promoObj) => {
            return promoObj.link 
        });
        const filteredLinks = linksArray.filter((link) => {return link !== undefined })
        const links = filteredLinks.toString();

        payload.append('brandProfileDesc', formData.brandProfileDesc)
        payload.append('brandProfileName', formData.brandProfileName)
        payload.append('headerHtml', headerData)
        payload.append('footerHtml', footerData)
        payload.append('headerIsDefault',  headerData === defaultHeader ? 'YES' : 'NO')
        payload.append('footerIsDefault', footerData === defaultFooter ? 'YES' : 'NO')
        payload.append('links', links)
        payload.append('fileNames', filteredFilesCopy)
        payload.append('refernceId', formData.structureReferenceId)
        if (headerData === defaultHeader) {
            payload.append('headerTemplateRefId', templateReferenceId)
        }
        if (footerData === defaultFooter) {
            payload.append('footerTemplateRefId', templateReferenceId)
        }


        if (!isEditBrandProfile) {
            try {  
                dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: true });      
                const url = subClientID ? `${apiMappings.brandProfile.listView.saveBrandProfile}?subClientId=${subClientID}` : apiMappings.brandProfile.listView.saveBrandProfile;
                const { data: { message, status } } = await axios.post(url, payload,  {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                }})
        
                if (status === 200) {
                    toastDispatch({type: '@@globalToast/add', payload: {message: message, icon: 'check-round', remove: false}})
                    dispatch({ type: '@@brandProfileList/INITIALISE_FORM' });
                    props?.onFormCancel()
                } else {        
                    message && toast.add(message, 'warning', false)
                    payload?.delete("brandProfileDesc")
                    payload?.delete("brandProfileName")
                    payload?.delete("headerHtml")
                    payload?.delete("footerHtml")
                    payload?.delete("headerIsDefault")
                    payload?.delete("footerIsDefault")
                    payload?.delete("links")
                    payload?.delete("fileNames")
                    payload?.delete('headerTemplateRefId')
                    payload?.delete('footerTemplateRefId')
                    payload?.delete('mediaIds')
                }
            } catch (error){      
                if (error?.response.status === 412) {          
                    error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                    payload?.delete("brandProfileDesc")
                    payload?.delete("brandProfileName")
                    payload?.delete("headerHtml")
                    payload?.delete("footerHtml")
                    payload?.delete("headerIsDefault")
                    payload?.delete("footerIsDefault")
                    payload?.delete("links")
                    payload?.delete("fileNames")
                    payload?.delete('headerTemplateRefId')
                    payload?.delete('footerTemplateRefId')
                    payload?.delete('mediaIds')
                } else {
                    error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                }
            } finally {
                dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: false });
            }
        } else {
            payload.append('brandProfileId',  isEditBrandProfile.brandProfileId)
            try {  
                dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: true });
                const url = subClientID ? `${apiMappings.brandProfile.listView.updateBrandProfile}?subClientId=${subClientID}` : apiMappings.brandProfile.listView.updateBrandProfile;      
                const { data: { message, status } } = await axios.post(url, payload,  {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                }})
        
                if (status === 200) {
                    toastDispatch({type: '@@globalToast/add', payload: {message: message, icon: 'check-round', remove: false}})
                    dispatch({ type: '@@brandProfileList/INITIALISE_FORM' });
                    props?.onFormCancel()

                } else  {        
                    message && toast.add(message, 'warning', false)
                    payload?.delete("brandProfileDesc")
                    payload?.delete("brandProfileName")
                    payload?.delete("headerHtml")
                    payload?.delete("footerHtml")
                    payload?.delete("headerIsDefault")
                    payload?.delete("footerIsDefault")
                    payload?.delete("links")
                    payload?.delete("fileNames")
                    payload?.delete('brandProfileId')
                    payload?.delete('headerTemplateRefId')
                    payload?.delete('footerTemplateRefId')
                    payload?.delete('mediaIds')
                }
            } catch (error){      
                if (error?.response.status === 412) {          
                    error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                    payload?.delete("brandProfileDesc")
                    payload?.delete("brandProfileName")
                    payload?.delete("headerHtml")
                    payload?.delete("footerHtml")
                    payload?.delete("headerIsDefault")
                    payload?.delete("footerIsDefault")
                    payload?.delete("links")
                    payload?.delete("fileNames")
                    payload?.delete('brandProfileId')
                    payload?.delete('headerTemplateRefId')
                    payload?.delete('footerTemplateRefId')
                    payload?.delete('mediaIds')
                } else {
                    error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                }
            } finally {
                dispatch({ type: '@@brandProfileList/SET_FORM_LOADING', payload: false });
            }
        }
    }

    const setBrandProfileFormData = (key: string, value: any) => {
        dispatch({
            type: '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA',
            payload: { key: key, value: value }
        });
    }

    const handlePreviewMode = (mode: string) => {
        setPreviewMode(mode);
    }

    const isValidUrl = (value: string, index: number) => {
        const urlRegex= new RegExp (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\\=]*)/)
        setBrandProfileFormData(`promotionLinks-${index}.hasLinkError`, !urlRegex.test(value))
    }

    const handleSaveProfile = () => {
        setBrandProfileNameError(formData.brandProfileName === '');
        setBrandProfileDescError(formData.brandProfileDesc === '');

        if (formData.brandProfileName !== '' && formData.brandProfileDesc !== '') {

            const files = formData.promotionLinks.map((promoObj) => {
                return promoObj?.mediaDto?.filename ? promoObj.mediaDto.filename : undefined
            });
            const filteredFiles = files.filter((file) => {return file !== undefined })

            if (filteredFiles.length && filteredFiles.length < 2) { 
                toast.add(dynamicLabels?.minimumNoOfPromotionImages, 'warning', false)
            } else {
                setFileNames(filteredFiles.toString()); //useState is not setting up value immediately that's why passing in called fun handleAddBrandProfile.
                const filteredFilesCopy = filteredFiles.toString();
                if (!isEditBrandProfile || !formData.isActiveFl) {
                    handleAddBrandProfile(filteredFilesCopy);
                } else {
                    setShowUpdateConfirmationPopup(true);
                }
            }

        } else {
            const element = document.getElementById("templateDetails")
            element?.scrollIntoView({behavior: 'smooth'})
            return;
        }
    }

    return (
        <>
            <div id='toast-inject-here'></div>
            <BrandProfilePageHeader>
                <BreadCrumb options={breadCrumbOptions}/>
            </BrandProfilePageHeader>
            <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%', position: 'relative', paddingRight: '15px' }} pb='15px'>
                {/* Header */}
                <Box display='flex' justifyContent='space-between' style={{ width: '100%' }}>
                    <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: '15px' }}>
                        <Box id="templateDetails" display='flex' justifyContent='space-between' style={{ width: '100%' }}>
                            <SectionHeaderWrapper>
                                <SectionHeader headerTitle={dynamicLabels?.templateDetails ? dynamicLabels?.templateDetails : 'Template Details'} />
                            </SectionHeaderWrapper>
                        </Box>

                        <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">
                            <Grid container spacing='15px'>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <TextInput
                                        id='id-brandProfileName'
                                        name='brandProfileName'
                                        className='someClassName'
                                        value={formData.brandProfileName}
                                        onChange={(e: { target: { value: any } }) => {
                                            setBrandProfileFormData('brandProfileName', e.target.value)
                                            setBrandProfileNameError(e.target.value === '')
                                        }}
                                        label={dynamicLabels?.brandProfileName ? dynamicLabels?.brandProfileName : 'Brand Profile Name'}
                                        labelColor={'text.inputLabel.default'}
                                        placeholder={'Enter text here...'}
                                        error={brandProfileNameError}
                                        errorMessage={dynamicLabels?.brandProfileNameErrorMessage}
                                        required={true}
                                        fullWidth={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} lg={3}>
                                    <TextInput
                                        id='id-brandProfileDescription'
                                        name='brandProfileDescription'
                                        className='someClassName'
                                        value={formData.brandProfileDesc}
                                        label={dynamicLabels?.brandProfileDesc ? dynamicLabels?.brandProfileDesc : 'Brand Profile Description'}
                                        labelColor={'text.inputLabel.default'}
                                        placeholder={'Enter text here...'}
                                        error={brandProfileDescError}
                                        onChange={(e: { target: { value: any } }) => {
                                            setBrandProfileFormData('brandProfileDesc', e.target.value)
                                            setBrandProfileDescError(e.target.value === '')
                                        }}
                                        errorMessage={dynamicLabels?.brandProfileDescErrorMessage}
                                        required={true}
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} pb='15px'>
                            <SectionHeaderWrapper>
                                <SectionHeader headerTitle={dynamicLabels?.designDetails ? dynamicLabels?.designDetails : 'Design Template'} />
                            </SectionHeaderWrapper>
                        </Box>

                        <Box style={{ width: '100%', paddingRight: '15px' }}>                   
                            <Accordion id='1' expanded={expanded === '1'} onToggle={handleToggle}>
                                {{
                                header: (
                                    <>
                                    <AccordionHeaderTitle>
                                        {dynamicLabels?.headerBuilder ? dynamicLabels?.headerBuilder : 'Header Builder'}
                                    </AccordionHeaderTitle>
                                    <AccordionHeaderSubTitle>
                                        {dynamicLabels?.headerBuilderText ? dynamicLabels?.headerBuilderText : 'Build Header Builder for your customer weblinks'}
                                    </AccordionHeaderSubTitle>
                                    </>
                                ),
                                content: (
                                    <AccordionContent>
                                        <div style={{fontSize:'12px', color: "#000000"}}>HTML</div>
                                        <div style={{fontSize:'12px', color: "#767676"}}>{dynamicLabels?.htmlSubtitle}</div>
                                        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} pb='15px'>
                                            <AceEditor
                                                mode="html"
                                                ref={headerEditor}
                                                theme="xcode"
                                                onChange={onChangeHeader}
                                                name="brandProfileHeader"
                                                fontSize={14}
                                                width='100%'
                                                showPrintMargin={false}
                                                showGutter={true}
                                                highlightActiveLine={true}
                                                value={headerData}
                                                setOptions={{
                                                    enableBasicAutocompletion: false,
                                                    enableLiveAutocompletion: false,
                                                    enableSnippets: false,
                                                    showLineNumbers: true,
                                                    tabSize: 2,
                                                }}
                                                style={{margin: '15px', padding: '9px 10px 3px 7px', border: '1px solid #97979778'}}
                                            />
                                        </Box>
                                    </AccordionContent>
                                )
                                }}
                            </Accordion>
                        </Box>

                        <Box style={{ width: '100%', paddingRight: '15px'}}>
                            <Accordion id='2' expanded={expanded === '2'} onToggle={handleToggle}>
                                {{
                                header: (
                                    <>
                                    <AccordionHeaderTitle>{dynamicLabels?.promotions ? dynamicLabels?.promotions : 'Promotions'}</AccordionHeaderTitle>
                                    <AccordionHeaderSubTitle>
                                        {dynamicLabels?.promotionsText ? dynamicLabels?.promotionsText : 'Build Promotions for your customer weblinks'}
                                    </AccordionHeaderSubTitle>
                                    </>
                                ),
                                content: (
                                    <AccordionContentWraper>      
                                        <AccordionContent>
                                            {formData.promotionLinks?.map((promotionLinkObj, index) => {
                                                return (
                                                    <Grid container spacing='15px' key={`promotionLink-${index}`}>
                                                        <Grid item xs={3} sm={3} md={3} lg={3}>
                                                            <FileUpload
                                                                id={`someId-${index}`}
                                                                name={`${promotionLinkObj}-${index}`}
                                                                className='someClassName'
                                                                files={promotionLinkObj.mediaDto?.filename ? [promotionLinkObj.mediaDto] : []}
                                                                onFileClick={() => {}}
                                                                onFileRemove={(e: IFileData)=> handleFileRemove(e, index)}
                                                                label={'Image'}
                                                                labelColor={'text.inputLabel.default'}
                                                                placeholder={'Click to Upload files...'}
                                                                error={false}
                                                                errorMessage={'errorMessage'}
                                                                required={false}
                                                                fullWidth={true}
                                                                accept='.png, .jpg, .jpeg'
                                                                max = {1}
                                                                width={'auto'}
                                                                onChange={(e: any) => handleFileUpload(e, index)}
                                                            />
                                                            <BestFitTextWrapper>
                                                                {dynamicLabels.bestFitForPromotionImage || 'Best fit : 512*256'}
                                                            </BestFitTextWrapper>
                                                        </Grid>
                                                        <Grid item xs={3} sm={3} md={3} lg={3}>
                                                            <TextInput
                                                                id={`id-link_${index}`}
                                                                name='link'
                                                                className='someClassName'
                                                                label={'Link'}
                                                                value={promotionLinkObj.link}
                                                                labelColor={'text.inputLabel.default'}
                                                                placeholder={'Enter link here...'}
                                                                error={promotionLinkObj.hasLinkError}
                                                                errorMessage={dynamicLabels?.invalidLinkError}
                                                                required={false}
                                                                fullWidth={true}
                                                                onChange={(e: { target: { value: any } }) => setBrandProfileFormData(`promotionLinks-${index}.link`, e.target.value)}
                                                                onBlur={(e: { target: { value: any } }) => isValidUrl(e.target.value, index)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1} sm={1} md={1} lg={1}>
                                                            <PromotionLinkActionButtonWrapper >
                                                                {(index === 2) && <PromotionActionButton iconVariant="icomoon-close" iconSize={10} circle className="deletePromotion" onClick={() => handleRemovePromotion(index)}></PromotionActionButton>}
                                                                {(index === 1 && formData.promotionLinks.length < 3) && <PromotionActionButton iconVariant="icomoon-add" iconSize={10} circle primary onClick={() => handleAddPromotion()}></PromotionActionButton>}
                                                            </PromotionLinkActionButtonWrapper>
                                                        </Grid>
                                                    </Grid>
                                                )
                                            })}
                                        </AccordionContent>
                                    </AccordionContentWraper>
                                )
                                }}
                            </Accordion>
                        </Box>
                        <Box style={{ width: '100%', paddingRight: '15px' }}>
                            <Accordion id='3' expanded={expanded === '3'} onToggle={handleToggle}>
                                {{
                                header: (
                                    <>
                                    <AccordionHeaderTitle>
                                        {dynamicLabels?.footerBuilder ? dynamicLabels?.footerBuilder : 'Footer Builder'}
                                    </AccordionHeaderTitle>
                                    <AccordionHeaderSubTitle>
                                        {dynamicLabels?.footerBuilderText ? dynamicLabels?.footerBuilderText : 'Build footer for your customer weblinks'}
                                    </AccordionHeaderSubTitle>
                                    </>
                                ),
                                content: (
                                    <AccordionContent>
                                        <div style={{fontSize:'12px', color: "#000000"}}>HTML</div>
                                        <div style={{fontSize:'12px', color: "#767676"}}>{dynamicLabels?.htmlSubtitle}</div>
                                        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} pb='15px'>
                                            <AceEditor
                                                mode="html"
                                                theme="xcode" 
                                                ref={footerEditor}
                                                onChange={onChangeFooter}
                                                name="brandProfileFooter"
                                                fontSize={14}
                                                width='100%'
                                                value={footerData}
                                                showPrintMargin={false}
                                                showGutter={true}
                                                highlightActiveLine={true}
                                                setOptions={{
                                                    enableBasicAutocompletion: false,
                                                    enableLiveAutocompletion: false,
                                                    enableSnippets: false,
                                                    showLineNumbers: true,
                                                    tabSize: 2,
                                                }}
                                                style={{margin: '15px', padding: '9px 10px 3px 7px', border: '1px solid #97979778'}}
                                            />
                                        </Box>
                                    </AccordionContent>
                                )
                                }}
                            </Accordion>
                        </Box>
                        
                        <Box horizontalSpacing='15px' display='flex' mt='30px' fullWidth>
                            <FormActionButton id={`AddBrandingProfile-${isEditBrandProfile ? dynamicLabels.update : dynamicLabels.save}`} iconVariant='icomoon-save' disabled={ noOfErrorsInHeader > 0 || noOfErrorsInFooter > 0 } onClick={handleSaveProfile} primary>{isEditBrandProfile ? dynamicLabels.update : dynamicLabels.save}</FormActionButton>
                            <FormActionButton id='AddBrandingProfile--Preview' iconVariant='preview' disabled={ noOfErrorsInHeader > 0 || noOfErrorsInFooter > 0 } onClick={() => {setPreviewMode('desktop'); setPreviewVisible(true)}}>{dynamicLabels.preview ? dynamicLabels.preview : 'Preview'}</FormActionButton>
                        </Box>
                    </Card>
                    
                </Box>

                {isLoading && <Loader
                    center={true}
                    fadeBackground={true}
                    speed={1}
                />}                       
            </Box>
            { isPreviewVisible ? 
            
            <PreviewModal isModalOpen={isPreviewVisible} modalTitle="Preview Design" toggleHandler={setPreviewVisible}>
                <Box display="flex" justifyContent="flex-end" mb="30px" style={{overflow: 'inherit !important'}}>
                    <ButtonGroup data={previewOptions} onChange={(id: string) => handlePreviewMode(id)} />
                </Box>
                { previewMode === 'desktop' ?
                    (
                        <DesktopPreview>
                            <PreviewHeaderWrapper id='header' className="preview-header-wrapper">
                                <div dangerouslySetInnerHTML={{__html: headerData}}></div>
                                <div id='promotionImages' style={{padding: '0px 300px'}}>
                                    <Box display="flex" style={{ width: '100%' }}>
                                        <Grid container>
                                            {formData.promotionLinks?.map((promotionObj) => {
                                                return (                                                           
                                                    <Grid item xs={12} sm={12} md={formData.promotionLinks.length === 2 ? 6 : 4} lg={formData.promotionLinks.length === 2 ? 6 : 4}>
                                                        <a href={promotionObj?.link}>
                                                            <img src={promotionObj?.mediaDto?.mediaUrl} style={{ width: '100%' }}></img>
                                                        </a>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Box>
                                </div>
                                <div dangerouslySetInnerHTML={{__html: footerData}}></div>
                            </PreviewHeaderWrapper>    
                        </DesktopPreview>
                    ) : 
                    (
                        <MobilePreview>
                            <FunctionalIFrameComponent title="functional-iframe">
                                <div id='header' style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <div dangerouslySetInnerHTML={{__html: headerData}}></div>
                                    { (formData.promotionLinks[0].mediaDto.mediaUrl ||  formData.promotionLinks[1].mediaDto.mediaUrl) && 
                                    
                                        <div id='promotionImages'>
                                            <Box display="flex" style={{ width: '100%' }}>
                                                <Grid container>
                                                    {formData.promotionLinks?.map((promotionObj) => {
                                                        return (
                                                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                    <a href={promotionObj?.link}>
                                                                        <img src={promotionObj?.mediaDto?.mediaUrl} style={{width: '99%'}}></img>
                                                                    </a>
                                                                </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Box>
                                        </div>
                                    }
                                    <div dangerouslySetInnerHTML={{__html: footerData}}></div>
                                </div>
                            </FunctionalIFrameComponent>
                        </MobilePreview>

                    )
                }

            </PreviewModal> : null}

            {/* UPDATE CONFIRMATION MODAL */}
            <Modal open={!!showUpdateConfirmationPopup} onToggle={() => { }} size='md'>
                {{
                header: (
                    <ModalHeader
                    headerTitle={dynamicLabels?.updateConfirmation}
                    imageVariant='icomoon-close'
                    handleClose={() => setShowUpdateConfirmationPopup(false)}
                    />
                ),

                content: (
                    <>
                    <div style={{ fontSize: '14px' }}>
                        {dynamicLabels?.updateConfirmationMessage}
                    </div>
                    </>
                ),
                footer: (
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={()=>handleAddBrandProfile(fileNames)}>
                        {dynamicLabels.ok}
                    </IconButton>
                    <IconButton
                        iconVariant='icomoon-close'
                        iconSize={11}
                        onClick={() =>  setShowUpdateConfirmationPopup(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                    </Box>
                ),
                }}
            </Modal>
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(BrandProfileForm)), 'toast-inject-here'))