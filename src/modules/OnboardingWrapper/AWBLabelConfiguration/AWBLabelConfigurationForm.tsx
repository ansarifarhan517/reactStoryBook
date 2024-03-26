import React, {Dispatch, useEffect, useState, useRef} from 'react';
import { useDispatch } from 'react-redux';
import { Box, BreadCrumb, Card, Grid, TextInput, SectionHeader, FontIcon, useToast, Loader } from 'ui-library';
import Tab from '../../../utils/components/Tabs/Tab';
import Tabs from '../../../utils/components/Tabs/Tabs';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { AWBLabelConfigActions } from './AWBLabelConfiguration.actions';
import { SectionHeaderWrapper, BlankPreview, FormActionButton, TabsWrapper, EditTextWrapper, EditTemplateWrapper, IFrameWrapper, PreviewContainer, PreviewWrapper } from './StyledAwbLabelConfiguration';
import AceEditor from "react-ace-builds";
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/webpack-resolver.js'
import { orderCrateDetails, IDefaultTemplate, IPreviewProps } from './AWBLabelConfiguration.models';
import AttachDynamicTags from './SubComponents/AttachDynamicTags';
import 'ace-builds/src-noconflict/mode-html'
import "ace-builds/src-noconflict/theme-chrome";
import {Ace} from 'ace-builds'
import { setCompleters } from "ace-builds/src-noconflict/ext-language_tools";
import { closeSideMenu, openSideMenu } from '../../../utils/helper';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import { baseTemplate, extractFieldsFromHTML, replaceFieldWithData } from '../../OrderMiddleMile/PrintAwb/PrintAwb.constants';

interface IAwbLabelConfigurationForm {
    onFormCancel: () => void
}

const AWBLabelConfigurationForm = (props : IAwbLabelConfigurationForm) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.awbLabelConfiguration)
    const dispatch = useDispatch<Dispatch<AWBLabelConfigActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const toast = useToast();

    const formData = useTypedSelector(state => state.awbLabelConfiguration.awbLabelConfigFormData);
    const defaultTemplates = useTypedSelector(state => state.awbLabelConfiguration.defaultTemplates);
    const defaultSelectedTemplate = useTypedSelector(state => state.awbLabelConfiguration.defaultSelectedTemplate);
    const isEditAwbLabel = useTypedSelector(state => state.awbLabelConfiguration.isEditAwbLabel);
    const tags = useTypedSelector(state => state.awbLabelConfiguration.tags);
    const isLoading = useTypedSelector(state => state.awbLabelConfiguration.isLoading);
    const NALabel = useTypedSelector(state => state.dynamicLabels['NA.htmlTemplateField'] || '')


    const [awbTemplateNameError, setAwbTemplateNameError] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('template');
    const [errorCount, setErrorCount] = useState<number>(0);
    const [editorInstance, setEditorInstance]= useState<any>();
    const [payload] = useState<any>(new FormData());
    const templateEditor = useRef(null);

    const templateImgMap = {
        'Predefined Template 2' : 'Transguard.png',
        'Predefined Template 1' : 'Hungry-harvest.png'
    }

    const defaultHTML = `<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
    </head>
    <body>
        <div style="width:auto; border:1px solid white;">
            <svg class="awbBarcode-@Order Number-BarcodePlaceHolder"></svg>
            <div style="font-family: HelveticaNeue-bold !important;font-size: 14px !important;line-height: 14px;font-weight:bold;font-style:normal;text-align:left;margin-left:7px; ">
                Order No. : @Order Number</div>
            <p>@Deliver Customer Name</p>
        </div>
        <script>
            JsBarcode('.awbBarcode-@Order Number-BarcodePlaceHolder', '@Order Number', { displayValue: false, height: 70, width: 1 });
        </script>
    </body>
</html>`;

    const PreviewIcon = ({children, className, onClick}: IPreviewProps) => {
        return (
        <PreviewContainer onClick={onClick} className={`${className}`}>
            <PreviewWrapper>
            {children} 
            </PreviewWrapper>
        </PreviewContainer>
        )
    }

    useEffect(() => {
        closeSideMenu();
        dispatch({ type: '@@awbLabelConfig/FETCH_PROPERTY_TYPE' })
        dispatch({ type: '@@awbLabelConfig/FETCH_TAGS' })
        if (isEditAwbLabel) {
            dispatch({ type: '@@awbLabelConfig/GET_AWB_TEMPLATE_DETAILS_DATA', payload: {awbTemplateId : isEditAwbLabel?.awbTemplateId} })
            setDefaultTemplate({
                isActiveFl: false,
                awbTemplateName: '',
                isDefault: false,
                htmlData: {
                    orderHTML: '',
                    crateHTML: '',
                    itemHTML: ''
                }
            });
        } else {
            dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' });
        }
    }, [])

    useEffect(() => {
        const completer = {
            getCompletions: function(editor: Ace.Editor, session: Ace.EditSession, pos: Ace.Point, prefix: string, callback: Ace.CompleterCallback) {
                console.log(editor,session,pos,prefix)
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
        if (!isEditAwbLabel) {
            dispatch({type: '@@awbLabelConfig/FETCH_DEFAULT_TEMPLATE_LIST'})
        }
      }, [isEditAwbLabel])

    useEffect(() => {
        if (!!defaultTemplates && !isEditAwbLabel) {
          dispatch({
            type: '@@awbLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE',
            payload: defaultTemplates[0],
          });
        }
    }, [defaultTemplates]);

    useEffect(() => {
        if (Object.keys(defaultSelectedTemplate).length && defaultSelectedTemplate.awbTemplateName !== '') {
            if (defaultSelectedTemplate.htmlData.orderHTML.includes('<Crate />')) {
                if (defaultSelectedTemplate.htmlData.crateHTML.includes('<Item />')) {
                    defaultSelectedTemplate.htmlData.crateHTML = defaultSelectedTemplate.htmlData.crateHTML.replace('<Item />', `<Item>${defaultSelectedTemplate.htmlData.itemHTML}</Item>`)
                }
                defaultSelectedTemplate.htmlData.orderHTML = defaultSelectedTemplate.htmlData.orderHTML.replace('<Crate />', `<Crate>${defaultSelectedTemplate.htmlData.crateHTML}</Crate>`)
            }
            tags.dynamicTagKeys.forEach((key) => {
                defaultSelectedTemplate.htmlData.orderHTML = defaultSelectedTemplate.htmlData.orderHTML.replaceAll(key.dynamicTagKey, `@${key.dynamicTagLabelValue}`)
            });
            setFormData('orderHTML', defaultSelectedTemplate?.htmlData?.orderHTML);
        }
      }, [defaultSelectedTemplate]);

      useEffect(() => {
        if (Object.keys(defaultSelectedTemplate).length) {
            let htmlData = formData.orderHTML;
            tags.dynamicTagKeys.forEach((key) => {
                htmlData = htmlData.replaceAll(`@${key.dynamicTagLabelValue}`, (key.dynamicTagKey?.includes('cf_') ? 'custom_field' : key.dynamicTagKey))
            });
            handleHtmlRendering(htmlData)
        }
        editorInstance?.getSession().on("changeAnnotation", function () {
            const annot = editorInstance.getSession().getAnnotations();
            const noOfErrors = annot.length;
            setErrorCount(noOfErrors);
        });
    },[formData.orderHTML])

    const breadCrumbOptions = React.useMemo(() => [
        {
          id: 'awbLabelConfiguration',
          label: dynamicLabels?.AWB_LABEL_CONFIGURATION ? dynamicLabels.AWB_LABEL_CONFIGURATION : 'AWB Label Configuration',
          disabled: false,
        },
        {
          id: 'addAwbLabelTemplate',
          label: isEditAwbLabel ? dynamicLabels.editAwbLabelTemplate : dynamicLabels.addAwbLabelTemplate,
          disabled: true,
        },
    ], [dynamicLabels])

    const setFormData = (key: string, value: any) => {
        dispatch({
            type: '@@awbLabelConfig/SET_FORM_DATA',
            payload: { key: key, value: value }
        });
    }

    const handleHtmlChange = (html: string) => {
        setFormData('orderHTML', html);
    };

    const setDefaultTemplate = (template: IDefaultTemplate) => {
        dispatch({
          type: '@@awbLabelConfig/SET_DEFAULT_SELECTED_TEMPLATE',
          payload: template,
        });
    };

    const handleSaveTemplate = async () => {
        let htmlData = editorInstance.getValue();
        tags.dynamicTagKeys.forEach((key) => {
            htmlData = htmlData.replaceAll(`@${key.dynamicTagLabelValue}`, key.dynamicTagKey)
        });
        setAwbTemplateNameError(formData.awbTemplateName === '');
        if (formData.awbTemplateName !== '') {
            let templateData = '';
            if (htmlData.includes('<Crate>') && htmlData.includes('<Item>')) {
                let crateHtml = htmlData.split("<Crate>")[1].split("</Crate>")[0];
                templateData = htmlData.replace(`<Crate>${crateHtml}</Crate>`, '<Crate />')
                if (crateHtml.includes('<Item>')) {
                    const itemHtml = crateHtml.split("<Item>")[1].split("</Item>")[0];
                    crateHtml = crateHtml.replace(`<Item>${itemHtml}</Item>`, '<Item />')
                    formData.itemHTML = itemHtml
                }
                formData.crateHTML = crateHtml
            } else {
                templateData = htmlData;
            }
            const htmlRequestObj = {
                orderHTML: templateData,
                crateHTML: formData.crateHTML,
                itemHTML: formData.itemHTML
            }
            payload.append('htmlData', JSON.stringify(htmlRequestObj))
            payload.append('awbTemplateName', formData.awbTemplateName);
            payload.append('awbTemplateDesc', formData.awbTemplateDesc);
    
            if (!isEditAwbLabel) {
                try {
                    dispatch({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: true });
                    const url = apiMappings.awbLabelConfiguration.listView.saveAwbTemplate;
                    const { data: { message, status } } = await axios.post(url, payload, {headers: { 'Content-Type': 'multipart/form-data'}});
                    if (status == 200) {
                        toastDispatch({type: '@@globalToast/add', payload: {message: message, icon: 'check-round', remove: false}})
                        dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' });  
                        openSideMenu();
                        setTimeout(() => {
                            props?.onFormCancel();
                        }, 100)                
                    } else {        
                        message && toast.add(message, 'warning', false)
                        payload?.delete('awbTemplateName')
                        payload?.delete('awbTemplateDesc')
                        payload?.delete('htmlData')
                    }
                } catch(error) {
                    if (error?.response.status === 412) {
                        error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                        payload?.delete('awbTemplateName')
                        payload?.delete('awbTemplateDesc')
                        payload?.delete('htmlData')
                    } else {
                        error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                    }             
                } finally {
                    dispatch({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: false });
                }
            } else {
                payload.append('awbTemplateId', isEditAwbLabel.awbTemplateId)
                try {
                    dispatch({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: true });
                    const url = apiMappings.awbLabelConfiguration.listView.updateAwbTemplate;
                    const { data: { message, status } } = await axios.post(url, payload, {headers: { 'Content-Type': 'multipart/form-data'}});
    
                    if (status === 200) {
                        toastDispatch({type: '@@globalToast/add', payload: {message: message, icon: 'check-round', remove: false}})
                        dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' });
                        openSideMenu();
                        setTimeout(() => {
                            props?.onFormCancel();
                        }, 100)
    
                    } else  {        
                        message && toast.add(message, 'warning', false)
                        payload?.delete('awbTemplateName')
                        payload?.delete('awbTemplateDesc')
                        payload?.delete('itemHTML')
                        payload?.delete('htmlData')
                    }
                } catch(error) {
                    if (error?.response.status === 412) {          
                        error.response.data.message && toast.add(error?.response?.data?.message, 'warning', false)
                        payload?.delete('awbTemplateName')
                        payload?.delete('awbTemplateDesc')
                        payload?.delete('htmlData')
                        payload?.append('awbTemplateId')
                    } else {
                        error && toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                    }
                } finally {
                    dispatch({ type: '@@awbLabelConfig/SET_FORM_LOADING', payload: false });
                }
            }
        } else {
            const element = document.getElementById("awbBreadcrumbs")
            element?.scrollIntoView({behavior: 'smooth'})
            return;
        }
    }

    const setTags = (label: string) => {
        editorInstance.session.insert(editorInstance.getCursorPosition(), `@${label}`);
        const isTooltipVisible = document.getElementsByClassName('ui-tooltip');
        if (isTooltipVisible.length) {
            isTooltipVisible[0].remove();
        }
    }

    const onLoad = (editor: any) => {
        setEditorInstance(editor);
        editor.commands.bindKey("@", "startAutocomplete")
        editor.commands.bindKey("ctrl-space", null)
    }

    const handleBreadcrumbClick = () => {
        openSideMenu(); 
        dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' }); 
        setTimeout(() => {
            props?.onFormCancel();
        }, 100)
    }

    const handleCancel = () => {
        openSideMenu(); 
        dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' }); 
        setTimeout(() => {
            props?.onFormCancel();
        }, 100)
    }


    const handleHtmlRendering = (templateData: string) => {
        
        let combinedOrderPrintContent = '';
        let orderHTML: string = '', itemHTML: string = '', crateHTML: string = '';
        
        orderHTML = templateData;
        if (templateData.includes('<Crate>')) {
            crateHTML = templateData.split("<Crate>")[1].split("</Crate>")[0];
            orderHTML = orderHTML.replace(`<Crate>${crateHTML}</Crate>`, '<Crate />')
            if (crateHTML.includes('<Item>')) {
                itemHTML = crateHTML.split("<Item>")[1].split("</Item>")[0];
                crateHTML = crateHTML.replace(`<Item>${itemHTML}</Item>`, '<Item />')
            }
        }

        /** Extract Dynamic Fields from orderHTML template */
        const orderTemplateFields = extractFieldsFromHTML(orderHTML);
        const crateTemplateFields = extractFieldsFromHTML(crateHTML);
        const itemTemplateFields = extractFieldsFromHTML(itemHTML);

        orderCrateDetails.forEach((orderObj) => {
            const customFields: Record<string, string> = {}
            orderObj.customFieldList?.forEach(({field, value}) => {
              customFields[field] = value || ''
            })
        

            const orderDetail = { ...orderObj, ...customFields }


            let previewContent = `${orderHTML}`

            orderTemplateFields.forEach((field) => {
                previewContent = replaceFieldWithData(previewContent, field, orderDetail[field] || NALabel)
            })

                /** Find if <Crate /> exist & replace it with Crate Templates (x) times - x: Number of Crates for the order */
            if (previewContent.includes('<Crate />') && orderDetail.crates?.length) {
                let crateContent = ''

                orderDetail.crates && orderDetail.crates.forEach((crateObj) => {
                crateContent += crateHTML
                const crateDetail = { ...orderDetail, ...crateObj }

                crateTemplateFields.forEach((field) => {
                    crateContent = replaceFieldWithData(crateContent, field, crateDetail[field] || NALabel)
                })

                /** Find if <Item /> exist & replace it with Item Templates (x) times - x: Number of Items for the Crate */
                if (crateContent.includes('<Item />') && crateDetail.shipmentlineitems.length) {
                    let itemContent = ''

                    crateDetail.shipmentlineitems.forEach((itemObj) => {
                    itemContent += itemHTML
                    const itemDetail = { ...crateDetail, ...itemObj }

                    itemTemplateFields.forEach((field) => {
                        itemContent = replaceFieldWithData(itemContent, field, itemDetail[field] as string || NALabel)
                    })
                    })
                    crateContent = crateContent.replace(/<Item \/>/g, itemContent)
                } else {
                    crateContent = crateContent.replace(/<Item \/>/g, '')
                }
                })

                /** If yes, Render Crates HTML template in place of <crates /> */
                previewContent = previewContent.replace(/<Crate \/>/g, crateContent)
            } else {
                previewContent = previewContent.replace(/<Crate \/>/g, '')
            }
            combinedOrderPrintContent += previewContent
        })

        let finalPrintContent: string = baseTemplate.replace(':dynamic-content', combinedOrderPrintContent)

        if (finalPrintContent) {  
                var iframe = document.getElementById('templateFrame') as HTMLIFrameElement,
                iframeDoc = iframe?.contentDocument;
                iframeDoc?.open();
                iframeDoc?.write(finalPrintContent);
                setTimeout(() => {
                    iframe.width = '';
                    iframe.width = iframeDoc?.documentElement?.scrollWidth &&  iframeDoc?.documentElement?.scrollWidth > 550 ? '550' : (iframeDoc?.documentElement?.scrollWidth && iframeDoc?.documentElement?.scrollWidth > 425 ? iframeDoc?.documentElement.scrollWidth + 15 + 'px' : '425px');
                    iframeDoc?.close();
                }, 300)
        } 
    }

    const handleDisable = () => {
        if (Object.keys(defaultSelectedTemplate).length && defaultSelectedTemplate.awbTemplateName !== '') {
            return true;
        } else {
            if (errorCount > 0 || formData.orderHTML === '') {
                return true;
            } else {
                return false;
            }
        }
    }

    return(
        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%', position: 'relative', paddingRight: '15px' }} px='15px' pb='15px'>
            <Box id="awbBreadcrumbs" display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '20px' }}>
                <BreadCrumb options={breadCrumbOptions} onClick={ handleBreadcrumbClick } />
            </Box>

            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: '15px', paddingBottom: '15px', marginTop: '20px', paddingTop: '35px', paddingLeft: '15px' }}>
                <Box display='flex' flexDirection='column' style={{ width: '100%' }} justifyContent="space-between">
                    <Grid container spacing='15px'>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <TextInput
                                id='id-awbTemplateName'
                                name='awbTemplateName'
                                className='someClassName'
                                value={formData.awbTemplateName}
                                onChange={(e: { target: { value: string } }) => {
                                    setFormData('awbTemplateName', e.target.value)
                                    setAwbTemplateNameError(e.target.value === '')
                                }}
                                label={dynamicLabels?.awbTemplateName}
                                labelColor={'text.inputLabel.default'}
                                placeholder={'Enter text here...'}
                                error={awbTemplateNameError}
                                errorMessage={dynamicLabels?.awbTemplateNameErrorMessage}
                                required={true}
                                fullWidth={true}
                                maxLength={255}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <TextInput
                                id='id-awbTemplateDesc'
                                name='awbTemplateDesc'
                                className='someClassName'
                                value={formData.awbTemplateDesc}
                                label={dynamicLabels?.awbTemplateDesc}
                                labelColor={'text.inputLabel.default'}
                                placeholder={'Enter text here...'}
                                onChange={(e: { target: { value: string } }) => {
                                    setFormData('awbTemplateDesc', e.target.value)
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
                            {!!isEditAwbLabel ? (
                                <EditTemplateWrapper>
                                    <EditTextWrapper>Edit HTML</EditTextWrapper>
                                    <AttachDynamicTags onSelect={(label : string) => {setTags(label)}} show={true}>                  
                                    <AceEditor
                                        mode='html'
                                        theme='xcode'
                                        ref={templateEditor}
                                        onLoad={onLoad}
                                        onChange={handleHtmlChange}
                                        name='awbLabelTemplate'
                                        fontSize={14}
                                        width='100%'
                                        height='600px'
                                        showPrintMargin={false}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={formData.orderHTML}
                                        setOptions={{
                                            enableBasicAutocompletion: true,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: true,
                                            showLineNumbers: true,
                                            tabSize: 2,
                                        }}
                                        style={{margin: '0px', top: '25px', padding: '9px 10px 3px 7px', border: '1px solid #97979778'}}
                                    /> 
                                    </AttachDynamicTags>
                                </EditTemplateWrapper>
                            ) : (

                                <TabsWrapper className="tabs-wrapper">
                                    <Tabs selected={selectedTab} onSelect={setSelectedTab}>
                                        <Tab id='template' icon={<FontIcon variant="template" size={15} />} label={dynamicLabels.predefinedTemplates}>
                                            {defaultTemplates &&
                                                defaultTemplates.map((template: IDefaultTemplate) => {
                                                return (
                                                    <PreviewIcon
                                                    className={
                                                        template.awbTemplateName ===
                                                        defaultSelectedTemplate.awbTemplateName
                                                        ? 'preview-container-active'
                                                        : 'preview-container'
                                                    }
                                                    key={template.awbTemplateName}
                                                    onClick={() => {
                                                        setDefaultTemplate(
                                                        defaultTemplates.filter(
                                                            (htmlTemplate: IDefaultTemplate) =>
                                                            htmlTemplate.awbTemplateName ===
                                                            template.awbTemplateName
                                                        )[0]
                                                        );
                                                        setSelectedTab('html');
                                                    }}
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
                                                        <img width="300px" height="320px" src={`images/${templateImgMap[template.awbTemplateName] ? templateImgMap[template.awbTemplateName] : 'transguard.png'}`}></img>
                                                    </div>
                                                    </PreviewIcon>
                                                );
                                                })}
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
                                                    awbTemplateName: '',
                                                    isDefault: false,
                                                    htmlData: {
                                                        orderHTML: '',
                                                        crateHTML: '',
                                                        itemHTML: ''
                                                    }
                                                });
                                                }}
                                            >
                                                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" style={{textAlign: "center", fontSize: 9}}>
                                                <FontIcon size={48} variant="html" style={{
                                                color:"#b9b9b9!important"
                                                }} />
                                                <p>{dynamicLabels.createNewHtmlCode}</p>
                                                </Box>
                                            </PreviewIcon>
                                        </Tab>
                                        <Tab id='html' icon={<FontIcon variant="html-editor" size={15} />} label={dynamicLabels.htmlEditor}> 
                                            <EditTextWrapper>Edit HTML</EditTextWrapper>
                                            <AttachDynamicTags onSelect={(label : string) => {setTags(label)}} show={true}>                  
                                            <AceEditor
                                                mode='html'
                                                theme='xcode'
                                                ref={templateEditor}
                                                onLoad={onLoad}
                                                onChange={handleHtmlChange}
                                                name='awbLabelTemplate'
                                                fontSize={14}
                                                width='100%'
                                                height='600px'
                                                showPrintMargin={false}
                                                showGutter={true}
                                                highlightActiveLine={true}
                                                value={formData.orderHTML}
                                                setOptions={{
                                                    enableBasicAutocompletion: true,
                                                    enableLiveAutocompletion: false,
                                                    enableSnippets: true,
                                                    showLineNumbers: true,
                                                    tabSize: 2,
                                                }}
                                                style={{margin: '0px', top: '25px', padding: '9px 10px 3px 7px', border: '1px solid #97979778'}}
                                            /> 
                                            </AttachDynamicTags>
                                        </Tab>
                                    </Tabs>
                                </TabsWrapper>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>                
                            {!!formData.orderHTML ? (
                            <Box mr="50px" style={{height: isEditAwbLabel ? '645px' : '100%', margin: '0 auto', backgroundColor:"#f0f0f0", padding:'17px 0'}}>
                                <IFrameWrapper className="iframe-wrapper">
                                    <iframe id="templateFrame" style={{margin: '0 auto', display: 'block'}} width="100%" height="100%"></iframe>
                                </IFrameWrapper>
                            </Box>
                            ) : (
                                <BlankPreview>{dynamicLabels.htmlPreview}</BlankPreview>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <Box horizontalSpacing='15px' display='flex' mt='30px' fullWidth>
                    <FormActionButton iconVariant='icomoon-save' disabled={ handleDisable() } onClick={handleSaveTemplate} primary>{isEditAwbLabel ? dynamicLabels.update : dynamicLabels.save}</FormActionButton>
                    <FormActionButton iconVariant='icomoon-close' onClick={ handleCancel}>{dynamicLabels.cancel}</FormActionButton>
                </Box>
            </Card>
            {isLoading && <Loader center={true} fadeBackground={true} speed={1} />}   
        </Box>
    )
}
export default AWBLabelConfigurationForm