import React, { Dispatch, useState, useEffect } from 'react';
import withRedux from '../../../utils/redux/withRedux';
import { withThemeProvider } from '../../../utils/theme';
import Tabs from '../../../utils/components/Tabs/Tabs';
import Tab from '../../../utils/components/Tabs/Tab';
import {
  withToastProvider,
  withPopup,
  Box,
  Grid,
  Loader,
  TextInput,
  Card,
  ButtonGroup,
  FontIcon,
  useToast
} from 'ui-library';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { AlertMessageActions } from './AlertMessage.actions';
import {
  FormActionButton,
  Preview,
  BlankPreview,
  PageHeader,
  PageTitle,
  SingleTabContainer
} from './AlertMessageStyledComponents';
import AceEditor from 'react-ace-builds';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/webpack-resolver.js';
import { useDispatch } from 'react-redux';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import PreviewModal from '../../../utils/components/Preview/PreviewModal';
import DesktopPreview from '../../../utils/components/Preview/DesktopPreview';
import MobilePreview from '../../../utils/components/Preview/MobilePreview';
import PreviewIcon from '../../../utils/components/PreviewIcon/PreviewIcon';
import TestEmail from "../../../utils/components/Email/TestEmail";
import { IDefaultTemplate } from './AlertMessage.models';
import { debounce } from '../../../utils/commonFunctions/lodashFunctions';

interface IAlertMessageForm {
  onFormCancel: () => void;
  setPageType: Function
}

const AlertMessageForm = (props: IAlertMessageForm) => {
  const [templateNameError, setTemplateNameError] = useState<boolean>(false);
  const [payload] = useState<any>(new FormData());
  const [previewMode, setPreviewMode] = useState<string>('desktop');
  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<string>('template');

  const toast = useToast();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const dispatch = useDispatch<Dispatch<AlertMessageActions>>();

  const formData = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.alertMessageFormData
  );

  const selectedTemplate = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.selectedTemplate
  );

  const defaultSelectedTemplate = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.defaultSelectedTemplate
  );

  const isLoading = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.isLoading
  );

  const isEditAlertMessage = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.isEditAlertMessage
  );

  const defaultTemplates = useTypedSelector(
    (state) => state.settings.alertMessageTemplate.defaultTemplates
  );
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.alertMessageTemplate);
  const clientLogo =  JSON.parse(localStorage.getItem('userAccessInfo') || '{}').clientLogo || "https://f.hubspotusercontent20.net/hubfs/2704626/Capterra_LP/LN-Email%20Logo.jpg";

  const previewOptions = [
    {
      id: 'desktop',
      label: dynamicLabels.desktop,
      selected: previewMode === 'desktop',
      tooltipText: dynamicLabels.desktop,
      icon: "desktop"
    },
    {
      id: "mobile",
      label: dynamicLabels.mobile,
      selected: previewMode === 'mobile',
      tooltipText: dynamicLabels.mobile,
      icon: "mobile"
    },
  ];

  const setAlertMessageFormData = (key: string, value: any) => {
    dispatch({
      type: '@@alertMessage/SET_ALERT_MESSAGE_FORM_DATA',
      payload: { key: key, value: value },
    });
  };

  useEffect(() => {
    if (selectedTemplate.emailTemplateName !== '') {
      setAlertMessageFormData(
        'emailTemplateId',
        selectedTemplate.emailTemplateId
      );
      setAlertMessageFormData(
        'emailTemplateName',
        selectedTemplate.emailTemplateName
      );
      setAlertMessageFormData(
        'emailTemplateDesc',
        selectedTemplate.emailTemplateDesc
      );
      if(selectedTemplate.isDefault){
        selectedTemplate.htmlData = selectedTemplate.htmlData.replace('#@--dynamic_logo--@#',clientLogo)
      }
      setAlertMessageFormData('htmlData', selectedTemplate.htmlData);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (defaultSelectedTemplate.structureReferenceId !== '') {
      setAlertMessageFormData('htmlData', defaultSelectedTemplate.htmlData);
    }
  }, [defaultSelectedTemplate]);

  useEffect(() => {
    if(!isEditAlertMessage) {
      dispatch({ type: '@@alertMessage/FETCH_DEFAULT_TEMPLATE_LIST' });
    }
  }, [isEditAlertMessage]);

  useEffect(() => {
    if (!!defaultTemplates) {
      if( defaultTemplates[0] &&  defaultTemplates[0].htmlData && defaultTemplates[1] && defaultTemplates[1].htmlData){
        defaultTemplates[0].htmlData = defaultTemplates[0].htmlData.replace('#@--dynamic_logo--@#',clientLogo)
        defaultTemplates[1].htmlData = defaultTemplates[1].htmlData.replace('#@--dynamic_logo--@#',clientLogo)
      }
      dispatch({
        type: '@@alertMessage/SET_DEFAULT_SELECTED_TEMPLATE',
        payload: defaultTemplates[0],
      });
    }
  }, [defaultTemplates]);


  useEffect(() => {
    setTimeout(() => {
      const noOfErrors = document.querySelectorAll(
        '#alertMessageTemplate .ace_error'
      ).length;
      setErrorCount(noOfErrors);
    }, 500);
  }, [formData.htmlData]);

  useEffect(()=>{return () => {
    dispatch({ type: '@@alertMessage/RESET_FORMDATA' })
  }},[])

  const handleHtmlChange = (html: string) => {
    setAlertMessageFormData('htmlData', html);
  };

  const setDefaultTemplate = (template: IDefaultTemplate) => {
    dispatch({
      type: '@@alertMessage/SET_DEFAULT_SELECTED_TEMPLATE',
      payload: template,
    });
  };

  const handleAddAlertTemplate = debounce( async () => {
    setTemplateNameError(formData.emailTemplateName === '');

    if (formData.emailTemplateName !== '') {
      dispatch({ type: '@@alertMessage/SET_FORM_LOADING', payload: true });

      payload.append('emailTemplateId', formData.emailTemplateId);
      payload.append('emailTemplateName', formData.emailTemplateName);
      payload.append('emailTemplateDesc', formData.emailTemplateDesc);
      payload.append('htmlData', formData.htmlData);
      /*Update template*/
      if (!!isEditAlertMessage) {
        try {
          const {
            data: { message, status },
          } = await axios.post(
            apiMappings.alertMessage.listView.updateTemplate,
            payload,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          if (status === 200) {
            props?.onFormCancel();
            props?.setPageType('list')
            toastDispatch({ type: '@@globalToast/add', payload: { message: message, icon: 'check-round', remove: false } })
            payload.delete('emailTemplateId', formData.emailTemplateId);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', formData.htmlData);
            dispatch({
              type: '@@alertMessage/SET_DATA',
              payload: {
                key: 'isEditAlertMessage',
                value: undefined,
              },
            });
            setAlertMessageFormData(
              'emailTemplateId',
              ''
            );
            setAlertMessageFormData(
              'emailTemplateName',
              ''
            );
            setAlertMessageFormData(
              'emailTemplateDesc',
              ''
            );
            setAlertMessageFormData('htmlData', '');
            setDefaultTemplate({
              isActiveFl: false,
              structureReferenceId: '',
              isDefault: false,
              htmlData: ''
            });
            dispatch({ type: '@@alertMessage/RESET_SELECTED_TEMPLATE' })

          } else {
            message && toast.add(message, 'warning', false);
            payload.delete('emailTemplateId', formData.emailTemplateId);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', '');
          }
        } catch (error) {
          if (error?.response.status === 412) {
            error.response.data.message &&
              toast.add(error?.response?.data?.message, 'warning', false);
            payload.delete('emailTemplateId', formData.emailTemplateId);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', formData.htmlData);
          } else {
            error &&
              toast.add(
                error?.response?.data?.message ||
                dynamicLabels.somethingWendWrong,
                'warning',
                false
              );
          }
        } finally {
          dispatch({ type: '@@alertMessage/SET_FORM_LOADING', payload: false });
        }
      } else {
        /*create template*/
        try {
          const {
            data: { message, status },
          } = await axios.post(
            apiMappings.alertMessage.listView.createTemplate,
            payload,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          if (status === 200) {
            toastDispatch({ type:'@@globalToast/add', payload: { message: message, icon: 'check-round', remove: false } });
            props?.onFormCancel();
            props?.setPageType('list')
            toastDispatch({type: '@@globalToast/add', payload: { message: message, icon: 'check-round', remove: false } })
            payload.delete('emailTemplateId', formData.emailTemplateId);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', formData.htmlData);
            dispatch({
              type: '@@alertMessage/SET_DATA',
              payload: {
                key: 'isEditAlertMessage',
                value: undefined,
              },
            });
            setAlertMessageFormData(
              'emailTemplateId',
              ''
            );
            setAlertMessageFormData(
              'emailTemplateName',
              ''
            );
            setAlertMessageFormData(
              'emailTemplateDesc',
              ''
            );
            setAlertMessageFormData('htmlData', '');
            setDefaultTemplate({
              isActiveFl: false,
              structureReferenceId: '',
              isDefault: false,
              htmlData: ''
            });
            dispatch({type: '@@alertMessage/RESET_SELECTED_TEMPLATE' })
          } else {
            message && toast.add(message, 'warning', false);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', formData.htmlData);
          }
        } catch (error) {
          if (error?.response.status === 412) {
            error.response.data.message &&
            toast.add(error?.response?.data?.message, 'warning', false);
            payload.delete('emailTemplateName', formData.emailTemplateName);
            payload.delete('emailTemplateDesc', formData.emailTemplateDesc);
            payload.delete('htmlData', formData.htmlData);
          } else {
            error &&
              toast.add(
                error?.response?.data?.message ||
                dynamicLabels.somethingWendWrong,
                'warning',
                false
              );
          }
        } finally {
          dispatch({ type: '@@alertMessage/SET_FORM_LOADING', payload: false });
        }
      }
    } else {
      toast.add(`${dynamicLabels.templateName}${dynamicLabels.isRequired}`, 'warning', false);
    }
  }, 500);

  const handlePreviewMode = (mode: string) => {
    setPreviewMode(mode);
  };

  const handleEmailTest = async (email: string) => {

    let payload = new FormData();
    payload.append("emailId", email);
    payload.append("message", formData.htmlData);
    try {
      const {
        data: { message, status },
      } = await axios.post(
        apiMappings.alertMessage.listView.testEmail,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (status === 200) {
        message && toast.add(message, 'check-round', false);
      } else {
        message && toast.add(message, 'warning', false);
      }
    } catch (error) {
      if (error?.response.status === 412) {
        error.response.data.message &&
          toast.add(error?.response?.data?.message, 'warning', false);
      } else {
        error &&
          toast.add(
            error?.response?.data?.message ||
            dynamicLabels.somethingWendWrong,
            'warning',
            false
          );
      }
    } finally {
      dispatch({ type: '@@alertMessage/SET_FORM_LOADING', payload: false });
    }
  }

  return (
    <>
      <div id='toast-inject-here'></div>
      <Box
        display='flex'
        flexDirection='column'
        style={{ width: '100%', height: '100%' }}
        px='15px'
        pb='15px'
      >

        {/* <BreadCrumb options={breadCrumbOptions} onClick={() => { }} /> */}
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            backgroundColor: '#fff',
            overflow: 'hidden',
            width: '100%',
            paddingRight: 0,
            paddingBottom: '15px',
          }}
        >
          {/*template description*/}
          <Box
            display='flex'
            flexDirection='column'
            style={{ width: '100%', paddingTop: 25 }}
            justifyContent='space-between'
          >
            <Grid container spacing='15px'>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextInput
                  id='templateName'
                  name='templateName'
                  className='templateName'
                  value={formData.emailTemplateName}
                  maxLength={255}
                  onChange={(e: { target: { value: any } }) => {
                    setAlertMessageFormData(
                      'emailTemplateName',
                      e.target.value
                    );
                    setTemplateNameError(e.target.value === '');
                  }}
                  label={
                    dynamicLabels?.templateName
                      ? dynamicLabels?.templateName
                      : 'Template Name'
                  }
                  labelColor={'text.inputLabel.default'}
                  placeholder={'Enter text here...'}
                  error={templateNameError}
                  errorMessage={`${dynamicLabels?.templateName}${dynamicLabels.isRequired}`}
                  required={true}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TextInput
                  id='templateDesc'
                  name='templateDesc'
                  className='templateDesc'
                  value={formData.emailTemplateDesc}
                  label={
                    dynamicLabels?.templateDesc
                      ? dynamicLabels?.templateDesc
                      : 'Template Description'
                  }
                  labelColor={'text.inputLabel.default'}
                  placeholder={'Enter text here...'}
                  onChange={(e: { target: { value: any } }) => {
                    setAlertMessageFormData(
                      'emailTemplateDesc',
                      e.target.value
                    );
                  }}
                  fullWidth={true}
                />
              </Grid>
            </Grid>
          </Box>
          {/*template description*/}

          {/*Page header*/}
          <PageHeader className="page-header">
            <PageTitle className="page-title">{dynamicLabels.designTemplate}</PageTitle>
          </PageHeader>

          {/*template editor*/}
          <Box
            display='flex'
            flexDirection='column'
            style={{ width: '100%' }}
            justifyContent='space-between'
          >
            <Grid container spacing='15px'>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                {!!isEditAlertMessage ? (
                  <SingleTabContainer className="single-html-tab">
                  <Tabs selected='html' onSelect={setSelectedTab}>
                    <Tab id='html' icon={<FontIcon variant="html-editor" size={15} />} label={dynamicLabels.htmlEditor}>
                      <AceEditor
                        mode='html'
                        theme='xcode' // monokai kuroir
                        onChange={handleHtmlChange}
                        name='alertMessageTemplate'
                        fontSize={14}
                        width='100%'
                        height="700px"
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={formData.htmlData}
                        setOptions={{
                          enableBasicAutocompletion: false,
                          enableLiveAutocompletion: false,
                          enableSnippets: false,
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                        style={{
                          padding: '9px 10px 3px 7px',
                          border: '1px solid #97979778',
                        }}
                      />
                    </Tab>
                    <></>
                  </Tabs>
                  </SingleTabContainer>
                ) : (
                  <Tabs selected={selectedTab} onSelect={setSelectedTab}>
                    <Tab id='template' icon={<FontIcon variant="template" size={15} />} label={dynamicLabels.predefinedTemplates}>
                      {defaultTemplates &&
                        defaultTemplates.map((template: IDefaultTemplate) => {
                          return (
                            <PreviewIcon
                              className={
                                template.structureReferenceId ===
                                  defaultSelectedTemplate.structureReferenceId
                                  ? 'preview-container-active'
                                  : 'preview-container'
                              }
                              key={template.structureReferenceId}
                              onClick={() => {
                                setDefaultTemplate(
                                  defaultTemplates.filter(
                                    (htmlTemplate: IDefaultTemplate) =>
                                      htmlTemplate.structureReferenceId ===
                                      template.structureReferenceId
                                  )[0]
                                );
                                setSelectedTab('html');
                              }}
                            >
                              <div
                                style={{
                                  transform: 'scale(.20)',
                                  position: 'absolute',
                                  height: 'auto',
                                  zIndex: 1,
                                  filter: 'grayscale(1)',
                                  marginTop: 0,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: template.htmlData,
                                }}
                                className='preview-icon'
                              ></div>
                            </PreviewIcon>
                          );
                        })}
                      <PreviewIcon
                        className={
                          defaultSelectedTemplate.htmlData === ''
                            ? 'preview-container-active'
                            : 'preview-container'
                        }
                        onClick={() => {
                          setSelectedTab('html');
                          setAlertMessageFormData('htmlData', '');
                          setDefaultTemplate({
                            isActiveFl: false,
                            structureReferenceId: '',
                            isDefault: false,
                            htmlData: '',
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
                      <AceEditor
                        mode='html'
                        theme='xcode' // monokai kuroir
                        onChange={handleHtmlChange}
                        name='alertMessageTemplate'
                        fontSize={14}
                        width='100%'
                        height='625px'
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={formData.htmlData}
                        setOptions={{
                          enableBasicAutocompletion: false,
                          enableLiveAutocompletion: false,
                          enableSnippets: false,
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                        style={{
                          margin: '0px',
                          padding: '9px 10px 3px 7px',
                          border: '1px solid #97979778',
                        }}
                      />
                    </Tab>
                  </Tabs>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                {!!formData.htmlData ? (
                  <Box mr="50px" >
                    <Preview
                      dangerouslySetInnerHTML={{ __html: formData.htmlData }}
                    />
                  </Box>
                ) : (
                  <BlankPreview>{dynamicLabels.htmlPreview}</BlankPreview>
                )}
              </Grid>
            </Grid>
          </Box>
          {/*template editor*/}

          {/*button wrapper*/}
          <Box
            horizontalSpacing='15px'
            display='flex'
            mt='30px'
            pl='15px'
            fullWidth
          >
            <FormActionButton
              id={`customizeEmailTemplate-form-${isEditAlertMessage ? dynamicLabels.update : dynamicLabels.save}`}
              iconVariant='icomoon-save'
              onClick={handleAddAlertTemplate}
              primary
              disabled={errorCount > 0 || selectedTemplate.isDefault || formData.htmlData === ''}
            >
              {isEditAlertMessage ? dynamicLabels.update : dynamicLabels.save}
            </FormActionButton>
            <FormActionButton
               id="customizeEmailTemplate-form-preview"
              iconVariant='preview'
              disabled={errorCount > 0}
              onClick={() => {
                setPreviewMode('desktop');
                setPreviewVisible(true);
              }}
            >
              {dynamicLabels.preview ? dynamicLabels.preview : 'Preview'}
            </FormActionButton>
          </Box>
          {/*button wrapper*/}
        </Card>
      </Box>
      {isLoading && <Loader center={true} fadeBackground={true} speed={1} />}
      {isPreviewVisible ? (
        <PreviewModal
          isModalOpen={isPreviewVisible}
          modalTitle={dynamicLabels.previewAndTestTemplate}
          toggleHandler={setPreviewVisible}
        >
          <Box
            display='flex'
            justifyContent='space-between'
            mb='30px'
            pt="35px"
            style={{ overflow: 'inherit !important' }}
          >
            <TestEmail onClick={handleEmailTest} />
            <ButtonGroup
              data={previewOptions}
              onChange={(id: string) => handlePreviewMode(id)}
            />
          </Box>
          {previewMode === 'desktop' ? (
            <DesktopPreview>
              <html lang='en'>
                <head>
                  <meta charSet='UTF-8' />
                  <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                  />
                  <title>Document</title>
                </head>
                <body>
                  <Preview
                    dangerouslySetInnerHTML={{ __html: formData.htmlData }}
                  />
                </body>
              </html>
            </DesktopPreview>
          ) : (
            <MobilePreview>
              <html lang='en'>
                <head>
                  <meta charSet='UTF-8' />
                  <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                  />
                  <title>Document</title>
                </head>
                <body>
                  <Preview
                    dangerouslySetInnerHTML={{ __html: formData.htmlData }}
                  />
                </body>
              </html>
            </MobilePreview>
          )}
        </PreviewModal>
      ) : null}
    </>
  );
};

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(AlertMessageForm)), 'toast-inject-here')
);