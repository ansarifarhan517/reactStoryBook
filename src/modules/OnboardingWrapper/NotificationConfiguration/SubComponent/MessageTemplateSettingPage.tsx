import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Card,
  Accordion,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  AccordionContent,
  BreadCrumb,
  IconButton,
  TextInput,
  convertHTMLToDraftState,
  Grid,
} from "ui-library";
import { FormProvider, useForm } from "react-hook-form";
import AccordionNotificationToggle from "./AccordionNotificationToggle";
import SMSNotification from "./SMSNotification";
import EmailNotification from "./EmailNotification";
import WhatsappNotification from "./WhatsappNotification";
import { EditorState, convertToRaw } from "draft-js";
import { useDispatch } from "react-redux";
import { tGlobalPopupAction } from "../../../common/GlobalPopup/GlobalPopup.reducer";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import draftToHtml from "draftjs-to-html";
import {
  convertAllBr,
  convertNewLines,
  convertSpaces,
  stripParagraphTags,
  stripsSpaces,
  convertSingleSpace,
} from "./constants";
import IVRNotification from "./IVRNotification";
import {
  tPayload,
  tGetNotifyTagsArray,
  IBreadcrumbOptionsProps,
  tMessageTemplateSettingPageProps,
  tTagsFields,
  tOrdertags
} from "./Notification.model";
import CustomFieldsRichTextEditor from "./CustomFieldsRichTextEditor";

const MessageTemplateSettingPage = ({
  stateUpdated,
  setUpdateState,
  updatedObj,
  setUpdatedObj,
  setMessageTemplateSetting,
  toast,
  getColumnsData,
  dynamicLabels,
  currentNotification,
  ivrAccess,
  currentStep,
  columnsData,
}: tMessageTemplateSettingPageProps) => {
  const [smsToggle, setSmsToggle] = useState<boolean>(false);
  const [emailToggle, setEmailToggle] = useState<boolean>(false);
  const [ivrToggle, setIvrToggle] = useState<boolean>(false);

  const [whatsappToggle, setWhatsappToggle] = useState<boolean>(false);
  const [templateName,setTemplateName] = useState<string | undefined>("")
  const [templateId, setTemplateId] = useState<string | undefined>("")
  const [whatsappMessage, setWhatsappMessage] = useState<string | undefined>("")
  const [templateLanguage, setTemplateLanguage] = useState<string | undefined>("")
  const [templateDynamicTags, setTemplateDynamicTags] = useState<Record<string, string> | undefined>({})
  const [orderTagList, setOrderTagList] = useState<tOrdertags[]| undefined>([]);
  const [multiCreate, setMultiCreate] = useState<boolean>(false);
  const [notificationName, setNotificationName] = useState<string | undefined>(
    ""
  );
  const [hasNotificationNameError, setHasNotificationNameError] =
    useState<boolean>(false);
  const [getNotifyTagsArray, setGetNotifyTagsArray] = useState([]);
  const [tags, setTags] = useState<tTagsFields | any>({});

  const [editorStateSMS, setEditorStateSMS] = useState(
    EditorState.createEmpty()
  );
  const [editorStateIVR, setEditorStateIVR] = useState(
    EditorState.createEmpty()
  );
  const [editorStateEmailSubject, setEditorStateEmailSubject] = useState(
    EditorState.createEmpty()
  );
  const [editorStateEmailBody, setEditorStateEmailBody] = useState(
    EditorState.createEmpty()
  );

  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const formInstance = useForm<Record<string, string | number | boolean>>({
    mode: "onTouched",
    shouldUnregister: true,
  });

  const isPageDirty = useMemo(() => {
    return formInstance.formState.isDirty || stateUpdated;
  }, [formInstance.formState.isDirty, stateUpdated]);

  const resetState = () => {
    setUpdateState(false);
    setUpdatedObj({});
    setEditorStateSMS(EditorState.createEmpty());
    setEditorStateEmailBody(EditorState.createEmpty());
    setEditorStateEmailSubject(EditorState.createEmpty());
    setEditorStateIVR(EditorState.createEmpty());
    setMessageTemplateSetting(false);
    setHasNotificationNameError(false);
  };

  const breadCrumbOptions = useMemo(
    () => [
      {
        id: currentStep?.stepName,
        label: currentStep?.headerLabel,
        disabled: false,
      },
      {
        id: "notificationName",
        label:
          Object.keys(updatedObj).length === 0
            ? "Notification Name"
            : updatedObj?.name,
        disabled: true,
      },
    ],
    [updatedObj, currentStep]
  );

  const handleBreadCrumbClick = (id: string) => {
    switch (id) {
      case currentStep?.stepName:
        handleCancel();
    }
  };

  const handleChangeNotificationName = (e) => {
    setNotificationName(e.target.value);
    if (e.target.value.length === 0) {
      setHasNotificationNameError(true);
    } else {
      setHasNotificationNameError(false);
    }
  };

  const SMSEditorOnChange = (newEditorState: EditorState) => {
    setUpdateState(true);
    setEditorStateSMS(newEditorState);
  };
  const IVREditorOnChange = (newEditorState: EditorState) => {
    setUpdateState(true);
    setEditorStateIVR(newEditorState);
  };
  const EmailSubjectEditorOnChange = (newEditorState: EditorState) => {
    setUpdateState(true);
    setEditorStateEmailSubject(newEditorState);
  };
  const EmailBodyEditorOnChange = (newEditorState: EditorState) => {
    setUpdateState(true);
    setEditorStateEmailBody(newEditorState);
  };

  const handleNotificationNameFocus = () => {
    setUpdateState(true);
  };

  const mentionSuggesstionsValueMap: Record<string, string> = {};

  const mentionSuggesstionsProp = tags?.notificationKeys?.map(
    (m: tGetNotifyTagsArray) => {
      mentionSuggesstionsValueMap[m.labelValue] = m?.key?.substring(
        1,
        m?.key?.length - 1
      );
      tags?.tagGroupMappingList?.map((group: any) => {
        if (m["tagGroupId"] == group.value) {
          m["groupName"] = group.label;
        }
      });
      return {
        text: m?.isCustomField ? (
          <CustomFieldsRichTextEditor mentionObj={m} />
        ) : (
          m?.labelValue
        ),
        value: m?.labelValue,
        url: m?.url,
      };
    }
  );

  const optionList = tags?.notificationKeys?.map(
    (tag: tGetNotifyTagsArray) => {
    return {value: tag?.key, label: tag?.labelValue, title: tag?.labelValue}
    }
  );

  const generateHTML = (editorState: EditorState) =>
    draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
      undefined,
      false,
      (entity, _text) =>
        mentionSuggesstionsValueMap[entity?.data?.value]
          ? `<${mentionSuggesstionsValueMap[entity?.data?.value]}>`
          : entity?.data?.value
    );

  const finalSmsText = convertAllBr(
    convertNewLines(
      convertSpaces(stripParagraphTags(generateHTML(editorStateSMS)))
    )
  );
  const emailSubject = stripParagraphTags(
    generateHTML(editorStateEmailSubject)
  );
  const trimmedEmailSubject = emailSubject.trim();
  const finalEmailSubject = stripsSpaces(
    convertSingleSpace(trimmedEmailSubject)
  );

  const finalEmailBody = convertAllBr(
    convertNewLines(
      convertSpaces(stripParagraphTags(generateHTML(editorStateEmailBody)))
    )
  );
  const finalIVRText = convertAllBr(
    convertNewLines(
      convertSpaces(stripParagraphTags(generateHTML(editorStateIVR)))
    )
  );

  useEffect(() => {

    if (getNotifyTagsArray.length !== 0) {
      if (Object.keys(updatedObj).length !== 0) {
        setNotificationName(updatedObj?.name);
        setSmsToggle(updatedObj?.isSmsActiveFl);
        setEmailToggle(updatedObj?.isEmailActiveFl);
        setWhatsappToggle(updatedObj?.isWhatsappActiveFl);
        setTemplateName(updatedObj?.templateName);
        setTemplateId(updatedObj?.templateId);
        setWhatsappMessage(updatedObj?.whatsappMessage);
        setTemplateLanguage(updatedObj?.templateLanguage);
        setTemplateDynamicTags(updatedObj?.templateDynamicTags)
        const data = updatedObj?.templateDynamicTags &&  Object.entries(updatedObj?.templateDynamicTags).map(([key, value]) => ({ key, value }));
        setOrderTagList(data);
        

        setEditorStateSMS(
          convertHTMLToDraftState(
            updatedObj?.smsMessage,
            getNotifyTagsArray.map((m: tGetNotifyTagsArray) => {
              return {
                value: m?.key?.substring(1, m?.key?.length - 1),
                text: m?.labelValue,
                url: m?.url,
              };
            })
          )
        );
        setEditorStateEmailBody(
          convertHTMLToDraftState(
            updatedObj?.emailBody,
            getNotifyTagsArray.map((m: tGetNotifyTagsArray) => {
              return {
                value: m?.key?.substring(1, m?.key?.length - 1),
                text: m?.labelValue,
                url: m?.url,
              };
            })
          )
        );
        setEditorStateEmailSubject(
          convertHTMLToDraftState(
            updatedObj?.emailSubject,
            getNotifyTagsArray.map((m: tGetNotifyTagsArray) => {
              return {
                value: m?.key?.substring(1, m?.key?.length - 1),
                text: m?.labelValue,
                url: m?.url,
              };
            })
          )
        );
        if (
          ivrAccess &&
          (currentNotification === "ORDER_ALLMILE" ||
            currentNotification === "ORDER" ||
            currentNotification === "MILESTONE")
        ) {
          setIvrToggle(updatedObj?.isIvrActiveFl);
          if (updatedObj?.ivrMessage) {
            setEditorStateIVR(
              convertHTMLToDraftState(
                updatedObj?.ivrMessage,
                getNotifyTagsArray.map((m: tGetNotifyTagsArray) => {
                  return {
                    value: m?.key?.substring(1, m?.key?.length - 1),
                    text: m?.labelValue,
                    url: m?.url,
                  };
                })
              )
            );
          } else {
            setEditorStateIVR(EditorState.createEmpty());
          }
        }
      }
    }
  }, [updatedObj, getNotifyTagsArray]);

  const getNotifyTags = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.templateKey,
        { params: { notificationType: currentNotification } }
      );
      console.log("response for TAG structure",response);
      setGetNotifyTagsArray(response?.notificationKeys);
      setTags(response);
    } catch (error) {
      console.log(error);
    }
  };

  const ACCORDION_DATA = useMemo(
    () => [
      {
        id: "SMS",
        isVisible: true,
        title: dynamicLabels?.sms_s || "SMS",
        description: dynamicLabels?.sms_s || "SMS",
        currentState: smsToggle,
        setCurrentState: setSmsToggle,
        content: (
          <SMSNotification
            editorStateSMS={editorStateSMS}
            SMSEditorOnChange={SMSEditorOnChange}
            mentionSuggesstionsProp={mentionSuggesstionsProp}
            dynamicLabels={dynamicLabels}
            tags={tags}
            setEditorStateSMS={setEditorStateSMS}
          />
        ),
      },
      {
        id: "EMAIL",
        isVisible: true,
        title: dynamicLabels?.Email || "EMAIL",
        description: dynamicLabels?.Email,
        currentState: emailToggle,
        setCurrentState: setEmailToggle,
        content: (
          <EmailNotification
            editorStateEmailSubject={editorStateEmailSubject}
            EmailSubjectEditorOnChange={EmailSubjectEditorOnChange}
            editorStateEmailBody={editorStateEmailBody}
            EmailBodyEditorOnChange={EmailBodyEditorOnChange}
            mentionSuggesstionsProp={mentionSuggesstionsProp}
            dynamicLabels={dynamicLabels}
            tags={tags}
            setEditorStateEmailBody={setEditorStateEmailBody}
            setEditorStateEmailSubject={setEditorStateEmailSubject}
          />
        ),
      },
      {
        id: "IVR",
        isVisible:
          ivrAccess &&
          (currentNotification === "ORDER_ALLMILE" ||
            currentNotification === "ORDER" ||
            currentNotification === "MILESTONE")
            ? true
            : false,
        title: "IVR",
        description: "IVR",
        currentState: ivrToggle,
        setCurrentState: setIvrToggle,
        content: (
          <IVRNotification
            editorStateIVR={editorStateIVR}
            IVREditorOnChange={IVREditorOnChange}
            mentionSuggesstionsProp={mentionSuggesstionsProp}
            dynamicLabels={dynamicLabels}
            tags={tags}
            setEditorStateIVR={setEditorStateIVR}
          />
        ),
      },
      {
        id: "WHATSAPP",
        isVisible: true,
        title: dynamicLabels?.whatsapp_s || "Whatsapp",
        description: dynamicLabels?.whatsapp_description || "Configure Whatsapp Template",
        currentState: whatsappToggle,
        setCurrentState: setWhatsappToggle,
        content: (
          <WhatsappNotification
            whatsappToggle = {whatsappToggle}
            optionList={optionList}
            orderTagList={orderTagList}
            setOrderTagList={setOrderTagList}
            templateName={templateName}
            setTemplateName={setTemplateName}
            templateId = {templateId}
            setTemplateId = {setTemplateId}
            templateLanguage={templateLanguage}
            setTemplateLanaguage={setTemplateLanguage}
            whatsappMessage={whatsappMessage}
            setWhatsappMessage={setWhatsappMessage}
            getNotifyTagsArray={getNotifyTagsArray}
            dynamicLabels={dynamicLabels}
            setUpdateState={setUpdateState}
          />
          
        ),
      },
    ],
    [
      updatedObj,
      smsToggle,
      emailToggle,
      ivrToggle,
      whatsappToggle,
      editorStateSMS,
      editorStateEmailBody,
      templateName,
      templateLanguage,
      editorStateEmailSubject,
      mentionSuggesstionsProp,
      templateDynamicTags,
      ivrAccess,
      editorStateIVR,
    ]
  );

  const [expandedAccordionNotificationID, setExpandedAccordionNotificationID] =
    useState<string>(ACCORDION_DATA[0].id);

  const handleAccordionNoticiationToggle = useCallback(
    (id: string, isExpanded?: boolean) => {
      setExpandedAccordionNotificationID(isExpanded ? id : "");
    },
    [setExpandedAccordionNotificationID]
  );

  const handleCancel = () => {
    const handleClose = () => {
      globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
    };

    const handleOk = () => {
      handleClose();
      resetState();
    };

    if (!isPageDirty) {
      handleOk();
    } else {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={handleOk}
              >
                {dynamicLabels.ok || "Ok"}
              </IconButton>
              <IconButton iconVariant="icomoon-close" onClick={handleClose}>
                {dynamicLabels.cancel || "Cancel"}
              </IconButton>
            </>
          ),
        },
      });
    }
  };

  const getFotmattedDynamicTags = (orderTagList) => {
    const outputObject = orderTagList && orderTagList.reduce((acc, obj, index) => {
      acc[index + 1] = obj.value;
      return acc;
    }, {});
    return outputObject
  }

  const saveCurrentObj = async (payload: tPayload) => {
    try {
      const url = apiMappings.order.listView.customerNotificationTemplates;
      const { data: response } = await axios.post(url, [payload], {
        params: { notificationType: currentNotification },
      });
      if (response?.status === 200) {
        resetState();
        getColumnsData();
        toast.add(response?.message, "check-round", false);
      } else {
        resetState();
        toast.add(response?.message, "warning", false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCurrentNotification = async (payload: tPayload) => {
    try {
      const url = apiMappings.order.listView.customerNotificationTemplates;
      const { data: response } = await axios.put(url, [payload], {
        params: { notificationType: currentNotification },
      });
      if (response?.status === 200) {
        resetState();
        getColumnsData();
        toast.add(response?.message, "check-round", false);
      } else {
        resetState();
        toast.add(response?.message, "warning", false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultiCreate = () => {
  const orderedDynamicTags = getFotmattedDynamicTags(orderTagList);

    if (Object.keys(updatedObj).length === 0) {
      const payload: tPayload = {
        name: notificationName,
        smsMessage: finalSmsText,
        emailSubject: finalEmailSubject,
        emailBody: finalEmailBody,
        isActiveFl: updatedObj?.isActiveFl,
        isSmsActiveFl: smsToggle,
        isEmailActiveFl: emailToggle,
        isWhatsappActiveFl: whatsappToggle,
        templateName: templateName,
        templateId: templateId,
        whatsappMessage: whatsappMessage,
        templateLanguage: templateLanguage,
        templateDynamicTags : orderedDynamicTags,
      };
      if (
        ivrAccess &&
        (currentNotification === "ORDER_ALLMILE" ||
          currentNotification === "ORDER" ||
          currentNotification === "MILESTONE")
      ) {
        payload.ivrMessage = finalIVRText;
        payload.isIvrActiveFl = ivrToggle;
      }
      saveCurrentObj(payload);
    }
    const commonFunc = (notifyData: tPayload) => {
      const payload = {
        name: notifyData.name,
        smsMessage: notifyData.smsMessage,
        emailSubject: notifyData.emailSubject,
        emailBody: notifyData.emailBody,
        isActiveFl: notifyData.isActiveFl,
        isSmsActiveFl: notifyData.isSmsActiveFl,
        isEmailActiveFl: notifyData.isEmailActiveFl,
        isWhatsappActiveFl: notifyData.isWhatsappActiveFl,
        templateName: notifyData.templateName,
        templateId: notifyData.templateId,
        whatsappMessage: notifyData.whatsappMessage,
        templateLanguage: notifyData.templateLanguage,
        templateDynamicTags : notifyData.orderedDynamicTags,
      };
      setMultiCreate(false);
      saveCurrentObj(payload);
    };
    columnsData?.map((notifyData) => {
      if (notifyData.name !== notificationName) {
        commonFunc(notifyData);
      }
    });
  };

  const handleSave = useCallback(() => {
    if (notificationName === undefined || notificationName.length === 0) {
      setHasNotificationNameError(true);
      return;
    }
    if (whatsappToggle && (!templateLanguage || !templateName?.trim() || formInstance.errors?.WHATSAPP?.templateName)) {
      if(!templateLanguage){
        formInstance.setError('WHATSAPP.languageCode',{ type: 'required' })
      }
      if (!templateName || !templateName.trim()) {
        formInstance.setError('WHATSAPP.templateName',{ type: 'required' })
     }
      return;
    }
  
    if (!isPageDirty) {
      resetState();
      return;
    }
    const orderedDynamicTags = getFotmattedDynamicTags(orderTagList);
    if (Object.keys(updatedObj).length === 0) {
      const payload: tPayload = {
        name: notificationName,
        smsMessage: finalSmsText,
        emailSubject: finalEmailSubject,
        emailBody: finalEmailBody,
        isActiveFl: updatedObj?.isActiveFl,
        isSmsActiveFl: smsToggle,
        isEmailActiveFl: emailToggle,
        isWhatsappActiveFl: whatsappToggle,
        templateName: templateName,
        templateId: templateId,
        whatsappMessage: whatsappMessage,
        templateLanguage: templateLanguage,
        templateDynamicTags : orderedDynamicTags,
      };
      if (
        ivrAccess &&
        (currentNotification === "ORDER_ALLMILE" ||
          currentNotification === "ORDER" ||
          currentNotification === "MILESTONE")
      ) {
        payload.ivrMessage = finalIVRText;
        payload.isIvrActiveFl = ivrToggle;
      }
      saveCurrentObj(payload);
    } else {
      const payload: tPayload = {
        id: updatedObj?.id,
        name: updatedObj?.name,
        smsMessage: finalSmsText,
        emailSubject: finalEmailSubject,
        emailBody: finalEmailBody,
        isActiveFl: updatedObj?.isActiveFl,
        isSmsActiveFl: smsToggle,
        isEmailActiveFl: emailToggle,
        isWhatsappActiveFl: whatsappToggle,
        templateName: templateName,
        templateId: templateId,
        whatsappMessage: whatsappMessage,
        templateLanguage: templateLanguage,
        templateDynamicTags : orderedDynamicTags,
      };

      if (
        ivrAccess &&
        (currentNotification === "ORDER_ALLMILE" ||
          currentNotification === "ORDER" ||
          currentNotification === "MILESTONE")
      ) {
        payload.ivrMessage = finalIVRText;
        payload.isIvrActiveFl = ivrToggle;
      }
      updateCurrentNotification(payload);
    }
  }, [
    editorStateSMS,
    editorStateEmailSubject,
    editorStateEmailBody,
    updatedObj,
    smsToggle,
    emailToggle,
    notificationName,
    ivrToggle,
    editorStateIVR,
    whatsappToggle,
    templateName,
    templateId,
    templateLanguage,
    orderTagList,
  ]);

  useEffect(() => {
    getNotifyTags();
    columnsData.map((data) => {
      if (data.clientId === 0) {
        setMultiCreate(true);
      }
    });
  }, []);

  return (
    <FormProvider {...formInstance}>
      <div className="customer-notification__box__page-header">
        <BreadCrumb
          options={breadCrumbOptions as IBreadcrumbOptionsProps[]}
          onClick={handleBreadCrumbClick}
        />
      </div>
      <Box flexGrow={1}>
        <Card className="customer-notification__box__content">
          <Grid container>
            <Grid item xs={12} sm={6} md={3}>
              <TextInput
                id="notificationName"
                onFocus={handleNotificationNameFocus}
                label={dynamicLabels?.notificationName || "Notification Name"}
                value={notificationName}
                onChange={handleChangeNotificationName}
                required={true}
                disabled={Object.keys(updatedObj).length > 0}
                error={hasNotificationNameError}
                errorMessage={
                  dynamicLabels?.notificationValidateErrorMessage ||
                  "Please enter Notification Name"
                }
                fullWidth={true}
              />
            </Grid>
          </Grid>
          {ACCORDION_DATA.map((data) =>
            data.isVisible ? (
              <Accordion
                key={data.id}
                id={data.id}
                expanded={expandedAccordionNotificationID === data.id}
                onToggle={handleAccordionNoticiationToggle}
              >
                {{
                  header: (
                    <Box display="flex" justifyContent="space-between">
                      <Box flexGrow={1}>
                        <AccordionHeaderTitle>
                          {data.title}
                        </AccordionHeaderTitle>
                        <AccordionHeaderSubTitle>
                          {data.description}
                        </AccordionHeaderSubTitle>
                      </Box>
                      <Box>
                        <AccordionNotificationToggle
                          id={data.id}
                          currentState={data.currentState}
                          setCurrentState={data.setCurrentState}
                          setUpdateState={setUpdateState}
                        />
                      </Box>
                    </Box>
                  ),
                  content: (
                    <AccordionContent>
                      <Box pb="10px">{data.content}</Box>
                    </AccordionContent>
                  ),
                }}
              </Accordion>
            ) : (
              <></>
            )
          )}
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-start"
            p="0"
            pt="15px"
            fullWidth
            className="action-container"
          >
            <IconButton
              id="notificationSave-actionBar-save"
              iconVariant="icomoon-save"
              primary
              // disabled={!formInstance.formState.isDirty && !isPageDirty}
              onClick={multiCreate ? handleMultiCreate : handleSave}
            >
              {Object.keys(updatedObj).length === 0
                ? dynamicLabels?.save || "Save"
                : dynamicLabels?.update || "Update"}
            </IconButton>
            <IconButton
              id="notificationCancel-actionBar-cancel"
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={handleCancel}
            >
              {dynamicLabels?.cancel || "Cancel"}
            </IconButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
};

export default MessageTemplateSettingPage;
