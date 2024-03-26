import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Card, Grid, TextInput, SectionHeader, FontIcon, useToast, BreadCrumb } from 'ui-library'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { DRSTemplateConfigActions } from "./DRSTemplateConfiguration.actions";
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { BlankPreview, EditTemplateWrapper, EditTextWrapper, FormActionButton, IFrameWrapper, SectionHeaderWrapper, TabsWrapper } from "./StyledDrsLabelConfiguration";
import Tabs from "../../../../utils/components/Tabs/Tabs";
import Tab from "../../../../utils/components/Tabs/Tab";
import AceEditor from "react-ace-builds";
import { IDefaultTemplate, IPreviewProps } from "./DRSTemplateConfiguration.models";
import { PreviewContainer, PreviewWrapper } from "../../AWBLabelConfiguration/StyledAwbLabelConfiguration";
import { closeSideMenu, openSideMenu } from "../../../../utils/helper";
import { baseTemplate, extractFieldsFromHTML, replaceFieldWithData } from "../../../OrderMiddleMile/PrintAwb/PrintAwb.constants";
import { setCompleters } from "ace-builds/src-noconflict/ext-language_tools";
import { Ace } from 'ace-builds'
import AttachDynamicTags from "./SubComponents/AttachDynamicTags";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { tGlobalToastActions } from "../../../common/GlobalToasts/globalToast.reducer";
import { orderData, drsData,tripData , customerData,crateData ,defaultHTML }from './DefaultHtmlData/index'
import {replacingHtmlTagwithHtmlData} from './DRSTemplateConfiguration.utils';
import { debounce } from "../../../../utils/commonFunctions/lodashFunctions";

interface IDrsTemplateConfigurationForm {
    onFormCancel: () => void
}

const DRSTemplateConfigurationForm = (props: IDrsTemplateConfigurationForm) => {

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.drsTemplateConfiguration)
    const [drsTemplateNameError, setDrsTemplateNameError] = useState<boolean>(false);
    const dispatch = useDispatch<Dispatch<DRSTemplateConfigActions>>()
    const [selectedTab, setSelectedTab] = useState<string>('template');
    const templateEditor = useRef(null);
    const [editorInstance, setEditorInstance] = useState<any>();
    const [errorCount, setErrorCount] = useState<number>(0);
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const toast = useToast()
    const { drsTemplateConfigFormData, isEditDrsTemplate, defaultTemplates, defaultSelectedTemplate, tags } = useTypedSelector(state => state.drsTemplateConfiguration)
    const NALabel = useTypedSelector(state => state.dynamicLabels['NA.htmlTemplateField'] || '')

    const PreviewIcon = ({ children, className, onClick }: IPreviewProps) => {
        return (
            <PreviewContainer onClick={onClick} className={`${className}`}>
                <PreviewWrapper>
                    {children}
                </PreviewWrapper>
            </PreviewContainer>
        )

    }
    const templateImgMap = {
        'Predefined Template 1': 'drsTemplateConfig1.png',
        'Predefined Template 2': 'drsTempConfig2.png'
    }

    useEffect(() => {
        closeSideMenu();
        dispatch({ type: '@@drsTemplateConfig/GET_TAGS' })
        if (isEditDrsTemplate) {
            dispatch({ type: '@@drsTemplateConfig/GET_DRS_TEMPLATE_DETAILS_DATA', payload: { templateId: isEditDrsTemplate?.templateId, type: 'DRS_TEMPLATE' } })
            setDefaultTemplate({
                isActiveFl: false,
                templateName: '',
                isDefault: false,
                htmlData: {
                    orderHTML: '',
                    crateHTML: '',
                    itemHTML: '',
                    tripHTML: '',
                    customerHTML: ''
                }
            });
        }
        else {
            dispatch({ type: '@@drsTemplateConfig/INITIALISE_FORM' })

        }
    }, [])
    useEffect(() => {
        if (!isEditDrsTemplate) {
            dispatch({ type: '@@drsTemplateConfig/GET_DEFAULT_TEMPLATE_LIST' })
        }
    }, [isEditDrsTemplate])

    useEffect(() => {
        if (!!defaultTemplates && !isEditDrsTemplate) {
            dispatch({
                type: '@@drsTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE',
                payload: defaultTemplates[0],
            });
        }
    }, [defaultTemplates]);

    useEffect(() => {
        const completer = {
            getCompletions: function (editor: Ace.Editor, session: Ace.EditSession, pos: Ace.Point, prefix: string, callback: Ace.CompleterCallback) {
                console.log(editor, session, pos, prefix);
                var completions = tags.dynamicTagKeys.map(o => {
                    return {
                        caption: o.dynamicTagLabelValue,
                        snippet: '@' + o.dynamicTagLabelValue,
                        type: "snippet",
                        value: o.dynamicTagKey,
                        score: 0
                    }
                })
                callback(null, completions);
            }
        };
        setCompleters([completer]);
    }, [tags]);

    useEffect(() => {
        if (Object.keys(defaultSelectedTemplate).length && defaultSelectedTemplate.templateName !== '') {
            replacingHtmlTagwithHtmlData(defaultSelectedTemplate?.htmlData)
            tags.dynamicTagKeys.forEach((key) => {
                defaultSelectedTemplate.htmlData.orderHTML = defaultSelectedTemplate.htmlData.orderHTML.replaceAll(key.dynamicTagKey, `@${key.dynamicTagLabelValue}`)
            });
            setFormData('orderHTML', defaultSelectedTemplate?.htmlData?.orderHTML)
        }

    }, [defaultSelectedTemplate])

    useEffect(() => {
        if (Object.keys(defaultSelectedTemplate).length) {
            let htmlData = drsTemplateConfigFormData.orderHTML;
            tags.dynamicTagKeys.forEach((key) => {
                htmlData = htmlData.replaceAll(`@${key.dynamicTagLabelValue}`, (key.dynamicTagKey?.includes('cf_') ? 'custom_field' : key.dynamicTagKey))
            });
            handleHtmlRendering(htmlData)
        }
        editorInstance?.getSession().setUseWorker(false);
        editorInstance?.getSession().on("changeAnnotation", function () {
            const annot = editorInstance.getSession().getAnnotations();
            const noOfErrors = annot.length;
            setErrorCount(noOfErrors);
        });

    }, [drsTemplateConfigFormData.orderHTML])

    const setFormData = (key: string, value: any) => {
        dispatch({
            type: '@@drsTemplateConfig/SET_FORM_DATA',
            payload: { key: key, value: value }
        });
    }

    const breadCrumbOptions = React.useMemo(() => [
        {
            id: 'drsTemplateConfiguration',
            label: dynamicLabels?.DRS_TEMPLATE_CONFIGURATION ? dynamicLabels?.DRS_TEMPLATE_CONFIGURATION : 'DRS Template Configuration',
            disabled: false,
        },
        {
            id: 'addDrsTemplate',
            label: isEditDrsTemplate ? (dynamicLabels?.editDrsTemplate || 'Update DRS Template') : (dynamicLabels.addDrsTemplate || 'Add DRS Template'),
            disabled: true,
        },
    ], [dynamicLabels])

    const onLoad = (editor: any) => {
        setEditorInstance(editor);
        editor.commands.bindKey("@", "startAutocomplete")
        editor.commands.bindKey("ctrl-space", null)
    }

    const setDefaultTemplate = (template: IDefaultTemplate) => {
        dispatch({
            type: '@@drsTemplateConfig/SET_DEFAULT_SELECTED_TEMPLATE',
            payload: template
        })
    }

    const handleHtmlChange = (html: String) => {
        setFormData('orderHTML', html)
    }

    const handleBreadcrumbClick = () => {
        openSideMenu();
        dispatch({ type: '@@drsTemplateConfig/INITIALISE_FORM' });
        setTimeout(() => {
            props?.onFormCancel();
        }, 100)
    }
    const handleSaveTemplate = debounce (async () => {
        let htmlData = editorInstance.getValue();
        tags.dynamicTagKeys.forEach((key) => {
            htmlData = htmlData.replaceAll(`@${key.dynamicTagLabelValue}`, key.dynamicTagKey)
        })
        setDrsTemplateNameError(drsTemplateConfigFormData.templateName === '')
        if (drsTemplateConfigFormData.templateName !== '') {
            let templateData = htmlData;
            if (htmlData.includes('<OrderDetails>')) {
                let tripHtml = htmlData.split("<OrderDetails>")[1].split("</OrderDetails>")[0];
                templateData = htmlData.replace(`<OrderDetails>${tripHtml}</OrderDetails>`, '<OrderDetails />')
                drsTemplateConfigFormData.tripHTML = tripHtml
            }
            if (htmlData.includes('<CrateDetails>')) {
                let crateHtml = templateData !== '' ? templateData.split("<CrateDetails>")[1].split("</CrateDetails>")[0] : htmlData.split("<CrateDetails>")[1].split("</CrateDetails>")[0];
                templateData = templateData !== '' ? templateData.replace(`<CrateDetails>${crateHtml}</CrateDetails>`, '<CrateDetails />') : htmlData.replace(`<CrateDetails>${crateHtml}</CrateDetails>`, '<CrateDetails />')
                if (crateHtml.includes('<ItemDetails>')) {
                    const itemHtml = crateHtml.split("<ItemDetails>")[1].split("</ItemDetails>")[0];
                    crateHtml = crateHtml.replace(`<ItemDetails>${itemHtml}</ItemDetails>`, '<ItemDetails />')
                    drsTemplateConfigFormData.itemHTML = itemHtml
                }
                drsTemplateConfigFormData.crateHTML = crateHtml
            }
            if (htmlData.includes('<CustomerDetails>')) {
                let customerHtml = templateData !== '' ? templateData.split("<CustomerDetails>")[1].split("</CustomerDetails>")[0] : htmlData.split("<CustomerDetails>")[1].split("</CustomerDetails>")[0];
                templateData = templateData !== '' ? templateData.replace(`<CustomerDetails>${customerHtml}</CustomerDetails>`, '<CustomerDetails />') : htmlData.replace(`<CustomerDetails>${customerHtml}</CustomerDetails>`, '<CustomerDetails />')
                drsTemplateConfigFormData.customerHTML = customerHtml
            }
           
            const htmlRequestObj = {
                orderHTML: templateData,
                crateHTML: drsTemplateConfigFormData.crateHTML,
                itemHTML: drsTemplateConfigFormData.itemHTML,
                tripHTML: drsTemplateConfigFormData.tripHTML,
                customerHTML: drsTemplateConfigFormData.customerHTML
            }
            let payload: any = {
                htmlData: htmlRequestObj,
                templateName: drsTemplateConfigFormData.templateName,
                templateDesc: drsTemplateConfigFormData.templateDesc,
                type: "DRS_TEMPLATE"
            }

            if (!isEditDrsTemplate) {
                try {
                    dispatch({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: true })
                    const url = apiMappings.drsTemplateConfiguration.listView.saveDrsTemplate;
                    const { data: { message, status } } = await axios.post(url, payload);
                    if (status == 200) {
                        toastDispatch({ type: '@@globalToast/add', payload: { message: dynamicLabels.drsTemplateAddedSuccessfully || message, icon: 'check-round', remove: false } })
                        dispatch({ type: '@@drsTemplateConfig/INITIALISE_FORM' })
                        openSideMenu();
                        setTimeout(() => {
                            props?.onFormCancel();
                        }, 100)
                    } else {
                        message && toast.add(message, 'warning', false)
                    }
                } catch (error: any) {
                    if (error?.response.status === 412) {
                        error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                    } else {
                        error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                    }
                }
                finally {
                    dispatch({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: false });
                }
            }
            else {
                payload = {
                    templateId: isEditDrsTemplate?.templateId,
                    htmlData: htmlRequestObj,
                    templateName: drsTemplateConfigFormData.templateName,
                    templateDesc: drsTemplateConfigFormData.templateDesc,
                    type: "DRS_TEMPLATE"
                }
                try {
                    dispatch({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: true });
                    const url = apiMappings.drsTemplateConfiguration.listView.updateAwbTemplate;
                    const { data: { message, status } } = await axios.post(url, payload,);
                    if (status === 200) {
                        toastDispatch({ type: '@@globalToast/add', payload: { message: dynamicLabels.drsTemplateUpdatedSuccessfully || message, icon: 'check-round', remove: false } })
                        dispatch({ type: '@@drsTemplateConfig/INITIALISE_FORM' });
                        openSideMenu();
                        setTimeout(() => {
                            props?.onFormCancel();
                        }, 100)
                    } else {
                        message && toast.add(message, 'warning', false)
                    }
                } catch (error: any) {
                    if (error?.response.status === 412) {
                        error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                    } else {
                        error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                    }
                } finally {
                    dispatch({ type: '@@drsTemplateConfig/SET_FORM_LOADING', payload: false });
                }
            }
        } else {
            const element = document.getElementById("drsBreadcrumbs")
            element?.scrollIntoView({ behavior: 'smooth' })
            return;
        }
    },500)

    const handleHtmlRendering = (templateData: string) => {
        let combinedOrderPrintContent = '';
        let orderHTML: string = '', itemHTML: string = '', crateHTML: string = '', tripHTML: string = '', customerHTML: string = '';
        orderHTML = templateData;
        if (templateData.includes('<OrderDetails>')) {
            tripHTML = templateData.split('<OrderDetails>')[1].split('</OrderDetails>')[0];
            orderHTML = orderHTML.replace(`<OrderDetails>${tripHTML}</OrderDetails>`, '<OrderDetails />')
        }
        if (templateData.includes('<CrateDetails>')) {
            crateHTML = templateData.split('<CrateDetails>')[1].split('</CrateDetails>')[0];
            orderHTML = orderHTML.replace(`<CrateDetails>${crateHTML}</CrateDetails>`, '<CrateDetails />')
            if (crateHTML.includes('<ItemDetails>')) {
                itemHTML = crateHTML.split("<ItemDetails>")[1].split("</ItemDetails>")[0];
                crateHTML = crateHTML.replace(`<ItemDetails>${itemHTML}</ItemDetails>`, '<ItemDetails />')
            }
        }
        if (templateData.includes('<CustomerDetails>')) {
            customerHTML = templateData.split('<CustomerDetails>')[1].split('</CustomerDetails>')[0];
            orderHTML = orderHTML.replace(`<CustomerDetails>${customerHTML}</CustomerDetails>`, '<CustomerDetails />')
        }

        /** Extract Dynamic Fields from orderHTML template */
        const orderTemplateFields = extractFieldsFromHTML(orderHTML);
        const crateTemplateFields = extractFieldsFromHTML(crateHTML);
        const itemTemplateFields = extractFieldsFromHTML(itemHTML);
        const tripTemplateFields = extractFieldsFromHTML(tripHTML);
        const customerTemplateFields = extractFieldsFromHTML(customerHTML);

        drsData.forEach((orderObj: any) => {
            const customFields: Record<string, string> = {}
            orderObj.customFieldList?.forEach(({ field, value }) => {
                customFields[field] = value || ''
            })
            const orderDetail = { ...orderObj, ...customFields, ...orderData }
            let previewContent = `${orderHTML}`
            orderTemplateFields.forEach((field) => {
                previewContent = replaceFieldWithData(previewContent, field, orderDetail[field] || NALabel)
            })
            if (previewContent.includes('<OrderDetails />')) {
                let tripContent = ''
                tripData.deliveryRunSheet?.forEach((tripObj: any) => {
                    tripContent += tripHTML
                    const tripDetail = { ...tripObj }
                    tripTemplateFields.forEach((field) => {
                        tripContent = replaceFieldWithData(tripContent, field, tripDetail[field] || NALabel)
                    })
                })
            }
            if (previewContent.includes('<CustomerDetails />')) {
                let customerContent = ''
                customerContent += customerHTML
                const customerDetail = { ...customerData }
                customerTemplateFields.forEach((field) => {
                    customerContent = replaceFieldWithData(customerContent, field, customerDetail[field] || NALabel)
                })

            }
            /** Find if <CrateDetails /> exist & replace it with Crate Templates (x) times - x: Number of Crates for the order */
            if (previewContent.includes('<CrateDetails />')) {

                let crateContent = ''
                crateContent += crateHTML
                const crateDetail = { ...orderDetail, ...crateData }
                crateTemplateFields.forEach((field) => {
                    crateContent = replaceFieldWithData(crateContent, field, crateDetail[field] || NALabel)
                })

                /** Find if <ItemDetails /> exist & replace it with Item Templates (x) times - x: Number of Items for the Crate */
                if (crateContent.includes('<ItemDetails />') && crateDetail.shipmentlineitems.length) {
                    let itemContent = ''

                    crateDetail.shipmentlineitems.forEach((itemObj) => {
                        itemContent += itemHTML
                        const itemDetail = { ...crateDetail, ...itemObj }
                        itemTemplateFields.forEach((field) => {
                            itemContent = replaceFieldWithData(itemContent, field, itemDetail[field] as string || NALabel)
                        })
                    })
                    crateContent = crateContent.replace(/<ItemDetails \/>/g, itemContent)
                } else {
                    crateContent = crateContent.replace(/<ItemDetails \/>/g, '')
                }
                /** If yes, Render Crates HTML template in place of <crates /> */
                previewContent = previewContent.replace(/<CrateDetails \/>/g, crateContent)
            }
            else {
                previewContent = previewContent.replace(/<CrateDetails \/>/g, '')
            }
            combinedOrderPrintContent += previewContent
        })

        let finalPrintContent: string = baseTemplate.replace(':dynamic-content', combinedOrderPrintContent)
        if (finalPrintContent) {
            var iframe = document.getElementById('templateFrame') as HTMLIFrameElement,
                iframeDoc = iframe?.contentDocument;
            iframeDoc?.open()
            iframeDoc?.write(finalPrintContent);
            setTimeout(() => {
                iframe.width = '';
                iframe.width = iframeDoc?.documentElement?.scrollWidth && iframeDoc?.documentElement?.scrollWidth > 550 ? '550' : (iframeDoc?.documentElement?.scrollWidth && iframeDoc?.documentElement?.scrollWidth > 425 ? iframeDoc?.documentElement.scrollWidth + 15 + 'px' : '425px');
                iframeDoc?.close()
            }, 300)

        }

    }
    const handleCancel = () => {
        openSideMenu();
        dispatch({ type: '@@drsTemplateConfig/INITIALISE_FORM' });
        setTimeout(() => {
            props?.onFormCancel();
        }, 100)
    }

    const handleDisable = () => {
        if (Object.keys(defaultSelectedTemplate).length && defaultSelectedTemplate.templateName !== '') {
            return false;
        } else {
            if (errorCount > 0 || drsTemplateConfigFormData.orderHTML === '') {
                return true;
            } else {
                return false;
            }
        }
    }

    const setTags = (label: string) => {
        editorInstance.session.insert(editorInstance.getCursorPosition(), `@${label}`);
        const isTooltipVisible = document.getElementsByClassName('ui-tooltip');
        if (isTooltipVisible.length) {
            isTooltipVisible[0].remove();
        }
    }

    return (
        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%', position: 'relative', paddingRight: '15px' }} px='15px' pb='15px'>
            <Box id="drsBreadcrumbs" display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '20px' }}>
                <BreadCrumb options={breadCrumbOptions} onClick={handleBreadcrumbClick} />
            </Box>
            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: '15px', paddingBottom: '15px', marginTop: '20px', paddingTop: '35px', paddingLeft: '15px' }}>
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">
                    <Grid container spacing='15px'>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <TextInput
                                id='id-drsTemplateName'
                                name='templateName'
                                className="drstextinput"
                                value={drsTemplateConfigFormData.templateName}
                                onChange={(e: { target: { value: string } }) => {
                                    setFormData('templateName', e.target.value)
                                    setDrsTemplateNameError(e.target.value === '')
                                }}
                                label={'DRS Template Name'}
                                labelColor={'text.inputLabel.default'}
                                placeholder={'Enter text here...'}
                                error={drsTemplateNameError}
                                errorMessage={dynamicLabels?.drsTemplateNameErrorMessage}
                                required={true}
                                fullWidth={true}
                                maxLength={255}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <TextInput
                                id='id-drsTemplateDesc'
                                name='templateDesc'
                                className='someClassName'
                                value={drsTemplateConfigFormData.templateDesc}
                                label={'DRS Template Description'}
                                labelColor={'text.inputLabel.default'}
                                placeholder={'Enter text here...'}
                                onChange={(e: { target: { value: string } }) => {
                                    setFormData('templateDesc', e.target.value)
                                }}
                                fullWidth={true}
                                maxLength={255}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} pb='15px'>
                    <SectionHeaderWrapper>
                        <SectionHeader headerTitle={dynamicLabels?.designDetails} />
                    </SectionHeaderWrapper>
                </Box>
                <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} pb='15px' className="1">
                    <Grid container spacing='15px' className="2">
                        <Grid item xs={12} sm={6} md={6} lg={6} className="3">
                            {!!isEditDrsTemplate ? (
                                <EditTemplateWrapper>
                                    <EditTextWrapper>Edit HTML</EditTextWrapper>
                                    <AttachDynamicTags onSelect={(label: string) => { setTags(label) }} show={true}>
                                        <AceEditor
                                            mode='html'
                                            theme='xcode'
                                            ref={templateEditor}
                                            onLoad={onLoad}
                                            onChange={handleHtmlChange}
                                            name='drsTemplate'
                                            fontSize={14}
                                            width='100%'
                                            height='600px'
                                            showPrintMargin={false}
                                            showGutter={true}
                                            highlightActiveLine={true}
                                            value={drsTemplateConfigFormData.orderHTML}
                                            setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: false,
                                                enableSnippets: true,
                                                showLineNumbers: true,
                                                tabSize: 2,
                                            }}
                                            style={{ margin: '0px', top: '25px', padding: '9px 10px 3px 7px', border: '1px solid #97979778' }}
                                        />
                                    </AttachDynamicTags>
                                </EditTemplateWrapper>
                            ) :
                                (<TabsWrapper className="tabs-wrapper">
                                    <Tabs selected={selectedTab} onSelect={setSelectedTab}>
                                        <Tab id='template' icon={<FontIcon variant="template" size={15} />} label={dynamicLabels.predefinedTemplates}>
                                            {
                                                defaultTemplates &&
                                                defaultTemplates?.map((template: IDefaultTemplate) => {
                                                    return (
                                                        <PreviewIcon
                                                            className={
                                                                template.templateName ===
                                                                    defaultSelectedTemplate.templateName
                                                                    ? 'preview-container-active'
                                                                    : 'preview-container'
                                                            }
                                                            key={template.templateName}
                                                            onClick={
                                                                () => {

                                                                    const filterValue = defaultTemplates.filter((htmlTemplate: IDefaultTemplate) => htmlTemplate.templateName === template.templateName);
                                                                    setDefaultTemplate(filterValue[0]);

                                                                    setSelectedTab('html');
                                                                }
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    height: 'auto',
                                                                    zIndex: 1,
                                                                    filter: 'grayscale(1)',
                                                                    marginTop: 0,
                                                                }}
                                                                className='preview-icon'
                                                            >
                                                                <img width="300px" height="320px" src={`images/${templateImgMap[template.templateName] ? templateImgMap[template.templateName] : 'transguard.png'}`}></img>
                                                            </div>

                                                        </PreviewIcon>
                                                    )
                                                })
                                            }
                                            <PreviewIcon
                                                className={
                                                    defaultSelectedTemplate?.htmlData?.orderHTML === ''
                                                        ? 'preview-container-active'
                                                        : 'preview-container'
                                                }
                                                onClick={() => {
                                                    setSelectedTab('html');
                                                    setFormData('orderHTML', defaultHTML);
                                                    setDefaultTemplate({
                                                        isActiveFl: false,
                                                        templateName: '',
                                                        isDefault: false,
                                                        htmlData: {
                                                            orderHTML: '',
                                                            crateHTML: '',
                                                            itemHTML: '',
                                                            tripHTML: '',
                                                            customerHTML: ''
                                                        }
                                                    });
                                                }}
                                            >
                                                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" style={{ textAlign: "center", fontSize: 9 }}>
                                                    <FontIcon size={48} variant="html" style={{
                                                        color: "#b9b9b9!important"
                                                    }} />
                                                    <p>{dynamicLabels.createNewHtmlCode}</p>
                                                </Box>
                                            </PreviewIcon>
                                        </Tab>
                                        <Tab id='html' icon={<FontIcon variant="html-editor" size={15} />} label={dynamicLabels.htmlEditor}>
                                            <EditTextWrapper>Edit HTML</EditTextWrapper>
                                            <AttachDynamicTags onSelect={(label: string) => { setTags(label) }} show={true}>
                                                <AceEditor
                                                    mode='html'
                                                    theme='xcode'
                                                    ref={templateEditor}
                                                    onLoad={onLoad}
                                                    onChange={handleHtmlChange}
                                                    name='drsTemplate'
                                                    fontSize={14}
                                                    width='100%'
                                                    height='600px'
                                                    showPrintMargin={false}
                                                    showGutter={true}
                                                    highlightActiveLine={true}
                                                    value={drsTemplateConfigFormData.orderHTML}
                                                    setOptions={{
                                                        enableBasicAutocompletion: true,
                                                        enableLiveAutocompletion: false,
                                                        enableSnippets: true,
                                                        showLineNumbers: true,
                                                        tabSize: 2,
                                                    }}
                                                    style={{ margin: '0px', top: '25px', padding: '9px 10px 3px 7px', border: '1px solid #97979778' }}
                                                />
                                            </AttachDynamicTags>
                                        </Tab>
                                    </Tabs>
                                </TabsWrapper>)
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            {!!drsTemplateConfigFormData.orderHTML ? (
                                <Box mr="50px" style={{ height: isEditDrsTemplate ? '645px' : '100%', margin: '0 auto', backgroundColor: "#f0f0f0", padding: '17px 0' }}>
                                    <IFrameWrapper className="iframe-wrapper">
                                        <iframe id="templateFrame" style={{ margin: '0 auto', display: 'block' }} width="100%" height="100%"></iframe>
                                    </IFrameWrapper>
                                </Box>
                            ) : (
                                <BlankPreview>{dynamicLabels.htmlPreview}</BlankPreview>

                            )}
                        </Grid>
                    </Grid>
                </Box>
                <Box horizontalSpacing='15px' display='flex' mt='30px' fullWidth>
                    <FormActionButton id={isEditDrsTemplate ? 'DRSTemplateForm-button-Update' : 'DRSTemplateForm-button-save'}iconVariant='icomoon-save' disabled={handleDisable()} onClick={handleSaveTemplate} primary>{isEditDrsTemplate ? dynamicLabels.update : dynamicLabels.save}</FormActionButton>
                    <FormActionButton iconVariant='icomoon-close' onClick={handleCancel}>{dynamicLabels.cancel}</FormActionButton>
                </Box>
            </Card>
        </Box>
    )
}

export default DRSTemplateConfigurationForm