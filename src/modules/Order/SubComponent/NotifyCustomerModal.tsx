
import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Modal,
    ModalHeader,
    TextInput,
    Toggle,
    useToast,
    RichTextEditor,
    convertHTMLToDraftState,
    FontIcon,
    Grid,
    Accordion,
    AccordionContent,
    AccordionHeaderTitle,
    AccordionHeaderSubTitle,
    insertMention
} from "ui-library";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { NotifyRichTextEditorStyled } from './StyleSubComponent';
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from "draftjs-to-html";
import { userAccessInfo } from "../../../utils/constants";
import { AccordionStyled, BoxWrapperWithShadow } from "../../Customer/CustomerListView/styled";
import AttachDynamicTags from "./AttachDynamicTags";
import CustomFieldsRichTextEditor from "../../Customer/CustomerListView/SubComponent/NotifyRichTextEditor/CustomFieldsRichTextEditor";
import WhatsappNotification from "../../OnboardingWrapper/NotificationConfiguration/SubComponent/WhatsappNotification";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import "./SubComponentStyles.scss";

interface ISelectedItemData {
    clientId: number
    emailBody: string
    emailSubject: string
    id: number
    isActiveFl: boolean
    isDeleteFl: boolean
    isEmailActiveFl: boolean
    isIvrActiveFl: boolean
    isSmsActiveFl: boolean
    ivrMessage: string
    name: string
    notificationType: string
    smsMessage: string
}

const NotifyCustomerModal = (props: any) => {
    const toast = useToast();
    const { showNoitfyCustomer, selectedOption, selectedRows, setCustomerNotifyType, selectedNotificationData, setSelectedRows, fetchOptions } = props
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING?.customer?.all_customers);
    const selectedType = selectedOption ? selectedOption : 'Update Address'
    const [notifyModalKeys, setNotifyModalKeys] = useState<any>(undefined)
    const [getNotifyTagsArray, setGetNotifyTagsArray] = useState([]);

    const [toggleStates, setToggleStates] = useState<any>({
        isActiveSms: selectedNotificationData.isSmsActiveFl,
        isActiveIvr: selectedNotificationData.isIvrActiveFl,
        isActiveEmail: selectedNotificationData.isEmailActiveFl,
        isActiveWhatsapp: selectedNotificationData.isWhatsappActiveFl
    })
    const [messages, setMessages] = useState<any>({
        emailSubject: '',
        ivrMessage: '',
        smsMessage: '',
        emailMessage: '',
    })
    const [mentionSuggestionsFromAPI, setMentionSuggestionsFromAPI] = useState([{
        text: '',
        value: 'key.key.substring(1, key.key.length - 1)',
        url: '#'
    }]);
    let mentionSuggesstionsProp: any = {}
    const [mention, setMention] = useState({});
    const [tags, setTags] = useState<any>({});
    const mentionSuggesstionsValueMap: Record<string, string> = {}
    const getNotificationInfo = async () => {
        let notificationType;
        if (userAccessInfo.superType === "MIDDLEMILE") {
            notificationType = '?notificationType=MILESTONE';
        }
        else {
            notificationType = '?notificationType=ORDER';
        }
        const { data: { data } } = await axios.get(apiMappings.order.listView.templates+notificationType);
        let notifyData:any=[];
        try{
        data.map((value:any)=>{
            if(value.isActiveFl){
                notifyData.push(value)
            }
        })
    }
    catch (err){
        console.log(err)
    }
        // selected notification
        const notifyType: ISelectedItemData = notifyData?.find((option: any) => option?.name === selectedType)
        // messages  for sms,email and ivr
        setMessages({ ...messages, emailMessage: notifyType?.emailBody, emailSubject: notifyType?.emailSubject, ivrMessage: notifyType?.ivrMessage, smsMessage: notifyType?.smsMessage })
        // each message has toggle to make it editable
        // setToggleStates({ ...toggleStates, isActiveSms: notifyType?.isSmsActiveFl, isActiveEmail: notifyType?.isEmailActiveFl, isActiveIvr: notifyType?.isIvrActiveFl })
        // each message key mapped here
        const keys = await axios.get(apiMappings.order.listView.templateKey+notificationType);
        setTags(keys?.data);
        // const keyObj = convertArrayToObject(keys?.data?.notificationKeys, 'key')
        let arr: any = [];
        keys?.data?.notificationKeys.forEach(function (key: any) {
            arr.push({
                text: key.labelValue,
                value: key.key.substring(1, key.key.length - 1),
                url: '#'
            })
        })
        setMentionSuggestionsFromAPI(arr);
        setNotifyModalKeys({ 'mentionSuggesstionsProp': mentionSuggesstionsProp, 'mentionSuggestionsFromAPI': mentionSuggestionsFromAPI })
    }
    useEffect(()=> {
        const getNotifyTags = async () => {
            try {
              const { data: response } = await axios.get(
                apiMappings.order.listView.templateKey,
                { params: { notificationType: selectedNotificationData?.notificationType } }
              );
              setGetNotifyTagsArray(response?.notificationKeys);
            } catch (error) {
              console.log(error);
            }
          };
          getNotifyTags();
    },[selectedNotificationData?.notificationType])
    
    useEffect(() => {
        /** Text & Value should have same content when sent to React-Draft */
        if (notifyModalKeys && tags) {
          notifyModalKeys.mentionSuggesstionsProp = tags?.notificationKeys?.map(
            (m: any) => {
              mentionSuggesstionsValueMap[m.labelValue] = m?.key?.substring(
                1,
                m?.key.length - 1
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
          setMention(mentionSuggesstionsValueMap);
        }
      }, [notifyModalKeys, tags]);

    useEffect(() => {
        setCustomerNotifyType(showNoitfyCustomer)
        getNotificationInfo()
    }, [showNoitfyCustomer])

    const handleSend = async () => {
        const { templateName, templateId, whatsappMessage, templateLanguage, templateDynamicTags } = selectedNotificationData
        const payload = {
            notification: {
                emailMessage: emailHTMLOutput,
                emailSubject: emailSubjectHTMLOutput,
                emailToBeSent: toggleStates.isActiveEmail,
                ivrMessage: ivrHTMLOutput,
                ivrToBeSent: toggleStates.isActiveIvr,
                smsMessage: smsHTMLOutput,
                smsToBeSent: toggleStates.isActiveSms,
                whatsappToBeSent: toggleStates.isActiveWhatsapp,
                templateName,
                templateId,
                whatsappMessage,
                templateLanguage,
                templateDynamicTags
            },
            shipmentIds: Object.values(selectedRows)?.map((row: any) => row.shipmentId),
            shipmentOrderTypeMap: Object.values(selectedRows)?.map((row: any) => {return {orderId:row.orderId, type:row.movementType}})
        }
        try {
            const { data: response } = await axios.post(apiMappings.order.listView.customerNotificationSend, payload)
            if (response?.status === 200 || response?.status === 201) {
                /** Success Message */
                toast.add(response.message ? response.message : 'Notification sent successfully', 'check-round', false);
                setCustomerNotifyType(false);
                fetchOptions.apis?.resetSelection();
                setSelectedRows({});
            } else {
                toast.add(response.message ? response.message : 'Notification sent successfully', 'warning', false);
                setCustomerNotifyType(false);
                fetchOptions.apis?.resetSelection();
                setSelectedRows({});
            }
        } catch (errorResponse) {
            console.log('Failed to send notification: ', errorResponse)
            toast.add(errorResponse.message, "", false);
        }

    }

    // Editor State for Email
    const [emailSubjectEditorState, setEmailSubjectEditorState] = React.useState(
        EditorState.createEmpty()
    )
    const [emailEditorState, setEmailEditorState] = React.useState(
        EditorState.createEmpty()
    )

    // Editor state for SMS
    const [smsEditorState, setSmsEditorState] = React.useState(
        EditorState.createEmpty()
    )

    // Editor state for IVR
    const [ivrEditorState, setIvrEditorState] = React.useState(
        EditorState.createEmpty()
    )

      // -----------------------------------------------------------------------------------------------
      const [charCount, setCharCount] = React.useState<number>(0)

      React.useEffect(() => {
          setCharCount(smsEditorState.getCurrentContent().getPlainText('\u0001').length)
        }, [smsEditorState])
      // ------------------------------------------------------------------------------------------------
  
    useEffect(() => {

        if (selectedNotificationData.emailBody) {
            
            setEmailEditorState(convertHTMLToDraftState(selectedNotificationData?.emailBody, notifyModalKeys.mentionSuggestionsFromAPI))
            
            
        }
        if(selectedNotificationData.emailSubject){
            setEmailSubjectEditorState(convertHTMLToDraftState(selectedNotificationData?.emailSubject, notifyModalKeys.mentionSuggestionsFromAPI))
        }
        if(selectedNotificationData?.smsMessage){
            setSmsEditorState(convertHTMLToDraftState(selectedNotificationData?.smsMessage, notifyModalKeys.mentionSuggestionsFromAPI))
        }
        if(selectedNotificationData?.ivrMessage){
            setIvrEditorState(convertHTMLToDraftState(selectedNotificationData?.ivrMessage, notifyModalKeys.mentionSuggestionsFromAPI))
        }
    }, [selectedNotificationData, notifyModalKeys])

    useEffect(() => {
        setToggleStates({
            isActiveSms: selectedNotificationData.isSmsActiveFl,
            isActiveIvr: selectedNotificationData.isIvrActiveFl,
            isActiveEmail: selectedNotificationData.isEmailActiveFl,
            isActiveWhatsapp: selectedNotificationData.isWhatsappActiveFl
        })
    }, [selectedNotificationData])

    const emailHTMLOutput = React.useMemo(
        () =>
            draftToHtml(
                convertToRaw(emailEditorState.getCurrentContent()),
                undefined,
                false,
                (entity, _text) =>
                    mention[entity?.data?.value]
                    ? `<${mention[entity?.data?.value]}>`
                    : entity?.data?.value

            ),
        [emailEditorState]
    )

    const emailSubjectHTMLOutput = React.useMemo(
        () =>
            draftToHtml(
                convertToRaw(emailSubjectEditorState.getCurrentContent()),
                undefined,
                false,
                (entity, _text) =>
                    mention[entity?.data?.value]
                    ? `<${mention[entity?.data?.value]}>`
                    : entity?.data?.value

            ),
        [emailSubjectEditorState]
    )

    const smsHTMLOutput = React.useMemo(
        () =>
            draftToHtml(
                convertToRaw(smsEditorState.getCurrentContent()),
                undefined,
                false,
                (entity, _text) =>
                    mention[entity?.data?.value]
                    ? `<${mention[entity?.data?.value]}>`
                    : entity?.data?.value
            ),
        [smsEditorState]
    )

    const ivrHTMLOutput = React.useMemo(
        () =>
            draftToHtml(
                convertToRaw(ivrEditorState.getCurrentContent()),
                undefined,
                false,
                (entity, _text) =>
                    mention[entity?.data?.value]
                    ? `<${mention[entity?.data?.value]}>`
                    : entity?.data?.value

            ),
        [ivrEditorState]
    )

    const [expandedAccordionNotificationID, setExpandedAccordionNotificationID] = useState<string>("SMS");

    const handleAccordionNoticiationToggle = useCallback((id: string, isExpanded?: boolean) => {
            setExpandedAccordionNotificationID(isExpanded ? id : "");
        },
        [setExpandedAccordionNotificationID]
    );

    return <Modal
        open={showNoitfyCustomer}
        onToggle={(value) => {
            setCustomerNotifyType(value);
        }}
        size='lg'
        width="1200px"
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels['orderNotificationMessage']}
                    handleClose={() => setCustomerNotifyType(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'

                />
            ),
            content: (
                <Box>
                    <div className="sub-components__modal-content">
                        <div style={{ marginRight: '15px', marginBottom: '15px' }}>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextInput
                                        id="notification-box"
                                        name="Notification Name"
                                        label="Notification Name"
                                        labelColor="text.inputLabel.default"
                                        placeholder={selectedType}
                                        required={true}
                                        fullWidth={true}
                                        disabled={true}
                                        value={selectedNotificationData?.name}
                                    />
                                </Grid>
                            </Grid>
                            {/*  SMS */}
                            <BoxWrapperWithShadow>
                                <Accordion
                                    key={"SMS"}
                                    id={"SMS"}
                                    expanded={expandedAccordionNotificationID === "SMS"}
                                    onToggle={handleAccordionNoticiationToggle}
                                >
                                    {{
                                    header: (
                                        <Box display="flex" justifyContent="space-between">
                                            <Box flexGrow={1}>
                                                <AccordionHeaderTitle>{dynamicLabels?.sms_s || "SMS"}</AccordionHeaderTitle>
                                                <AccordionHeaderSubTitle>
                                                {dynamicLabels?.configureSMSMsg || "Configure SMS Message"}
                                                </AccordionHeaderSubTitle>
                                            </Box>
                                            <Box>
                                                <Toggle
                                                    id={"sms"}
                                                    checked={toggleStates.isActiveSms}
                                                    onChange={() => {
                                                        // e.preventDefault()
                                                        setToggleStates({
                                                        ...toggleStates,
                                                        isActiveSms: !toggleStates.isActiveSms,
                                                        });
                                                    }}
                                                    disabled={false}
                                                />
                                            </Box>
                                        </Box>
                                    ),
                                    content: (
                                        <AccordionContent>
                                            <AccordionStyled isDisabled={!toggleStates.isActiveSms}>
                                            <AttachDynamicTags
                                                onSelect={(label: string, value: string = "") => {
                                                    setSmsEditorState(
                                                        insertMention(
                                                            smsEditorState,
                                                            { text: label, value: value },
                                                            false
                                                        )
                                                    );
                                                }}
                                                show={
                                                    notifyModalKeys?.mentionSuggesstionsProp?.length > 0
                                                        ? undefined
                                                        : false
                                                }
                                                tags={tags}
                                                active={toggleStates.isActiveSms}
                                            >
                                                <NotifyRichTextEditorStyled>
                                                    <RichTextEditor
                                                        label="SMS"
                                                        id="sms"
                                                        className="sms"
                                                        editorState={smsEditorState}
                                                        mention={{
                                                            separator: " ",
                                                            trigger: "@",
                                                            suggestions: notifyModalKeys?.mentionSuggesstionsProp,
                                                        }}
                                                        onEditorStateChange={(state) => { 
                                                            setSmsEditorState(state)
                                                        }}
                                                        placeholder="Enter Message"
                                                        toolbarHidden={true}
                                                        readOnly={!toggleStates.isActiveSms}
                                                    />
                                                </NotifyRichTextEditorStyled>
                                            </AttachDynamicTags>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                style={{
                                                    color: "#808080",
                                                    fontSize: "12px",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                <div>
                                                    <FontIcon
                                                        color="primary.main"
                                                        variant="icomoon-warning-circled"
                                                        size={14}
                                                    />
                                                    {" Type '@' to enter "}
                                                    <span style={{color: "#5698d3"}}>
                                                        {dynamicLabels?.dynamicTags ||  "Dynamic Tags" }
                                                    </span>
                                                    {" in messages."}
                                                    </div>
                                                    <div>
                                                    <FontIcon
                                                        variant="chat"
                                                        color="grey.A300"
                                                        size="xs"
                                                    />
                                                    SMS Count: {Math.ceil(charCount / 160)} (
                                                    {charCount}) Characters
                                                </div>
                                            </Box>
                                            </AccordionStyled>
                                        </AccordionContent>
                                    ),
                                    }}
                                </Accordion>
                            </BoxWrapperWithShadow>

                            {/* Email */}
                            <BoxWrapperWithShadow>
                                <Accordion
                                    key={"EMAIL"}
                                    id={"EMAIL"}
                                    expanded={expandedAccordionNotificationID === "EMAIL"}
                                    onToggle={handleAccordionNoticiationToggle}
                                >
                                    {{
                                    header: (
                                        <Box display="flex" justifyContent="space-between">
                                            <Box flexGrow={1}>
                                                <AccordionHeaderTitle>{dynamicLabels?.email || "Email"}</AccordionHeaderTitle>
                                                <AccordionHeaderSubTitle>
                                                {dynamicLabels?.configureEmailMsg || "Configure Email Message"}
                                                </AccordionHeaderSubTitle>
                                            </Box>
                                            <Box>
                                            <Toggle id={"email"}
                                                checked={toggleStates.isActiveEmail}
                                                onChange={() => {
                                                    // e.preventDefault()
                                                    setToggleStates({ ...toggleStates, isActiveEmail: !toggleStates.isActiveEmail })
                                                }}
                                                disabled={false}
                                            />
                                            </Box>
                                        </Box>
                                    ),
                                    content: (
                                        <AccordionContent>
                                            <AccordionStyled isDisabled={!toggleStates.isActiveEmail}>
                                            <div className="sub-components__email-subject-container">
                                                <AttachDynamicTags
                                                    onSelect={(label: string, value: string = "") => {
                                                        setEmailSubjectEditorState(
                                                            insertMention(
                                                                emailSubjectEditorState,
                                                                { text: label, value: value },
                                                                false
                                                            )
                                                        );
                                                    }}
                                                    show={
                                                        notifyModalKeys?.mentionSuggesstionsProp?.length > 0 && toggleStates.isActiveEmail
                                                            ? undefined
                                                            : false
                                                    }
                                                    tags={tags}
                                                    active={toggleStates.isActiveEmail}
                                                >
                                                    <NotifyRichTextEditorStyled>
                                                        <RichTextEditor
                                                            label='Subject'
                                                            id='emailSubject'
                                                            className='emailSubject'
                                                            editorState={emailSubjectEditorState}
                                                            mention={{
                                                                separator: ' ',
                                                                trigger: '@',
                                                                suggestions: notifyModalKeys?.mentionSuggesstionsProp
                                                            }}
                                                            onEditorStateChange={(state) => {
                                                                setEmailSubjectEditorState(state)
                                                            }}
                                                            placeholder='Enter Subject'
                                                            toolbarHidden={true}
                                                            readOnly={!toggleStates.isActiveEmail}
                                                        />
                                                    </NotifyRichTextEditorStyled>
                                                </AttachDynamicTags>
                                            </div>
                                            <AttachDynamicTags
                                                onSelect={(label: string, value: string = "") => {
                                                    setEmailEditorState(
                                                        insertMention(
                                                            emailEditorState,
                                                            { text: label, value: value },
                                                            false
                                                        )
                                                    );
                                                }}
                                                show={
                                                    notifyModalKeys?.mentionSuggesstionsProp?.length > 0 && toggleStates.isActiveEmail
                                                        ? undefined
                                                        : false
                                                }
                                                tags={tags}
                                                active={toggleStates.isActiveEmail}
                                            ><div>
                                                <NotifyRichTextEditorStyled>
                                                    <RichTextEditor
                                                        label='Email Body'
                                                        id='emailBody'
                                                        className='emailBody'
                                                        editorState={emailEditorState}
                                                        mention={{
                                                            separator: ' ',
                                                            trigger: '@',
                                                            suggestions: notifyModalKeys?.mentionSuggesstionsProp
                                                        }}
                                                        onEditorStateChange={(state) => {
                                                            // console.log(state)
                                                            setEmailEditorState(state);
                                                        }}
                                                        placeholder='Enter Email Body'
                                                        readOnly={!toggleStates.isActiveEmail}
                                                    />
                                                </NotifyRichTextEditorStyled>
                                                </div>
                                            </AttachDynamicTags>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                style={{
                                                    color: "#808080",
                                                    fontSize: "12px",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                <div>
                                                    <FontIcon
                                                        color="primary.main"
                                                        variant="icomoon-warning-circled"
                                                        size={14}
                                                    />
                                                    {" Type '@' to enter "}
                                                    <span style={{color: "#5698d3"}}>
                                                        {dynamicLabels?.dynamicTags ||  "Dynamic Tags" }
                                                    </span>
                                                    {" in messages."}
                                                    </div>
                                            </Box>
                                            </AccordionStyled>
                                        </AccordionContent>
                                    ),
                                    }}
                                </Accordion>
                                
                            </BoxWrapperWithShadow>

                            {/* IVR */}
                            <BoxWrapperWithShadow>
                                <Accordion
                                    key={"IVR"}
                                    id={"IVR"}
                                    expanded={expandedAccordionNotificationID === "IVR"}
                                    onToggle={handleAccordionNoticiationToggle}
                                >
                                    {{
                                    header: (
                                        <Box display="flex" justifyContent="space-between">
                                            <Box flexGrow={1}>
                                                <AccordionHeaderTitle>{dynamicLabels?.ivr || "IVR"}</AccordionHeaderTitle>
                                                <AccordionHeaderSubTitle>
                                                {dynamicLabels?.configureIVRCall || "Configure IVR Call"}
                                                </AccordionHeaderSubTitle>
                                            </Box>
                                            <Box>
                                            <Toggle id={"ivr"}
                                                checked={toggleStates.isActiveIvr}
                                                onChange={() => {
                                                    // e.preventDefault()
                                                    setToggleStates({ ...toggleStates, isActiveIvr: !toggleStates.isActiveIvr })
                                                }}
                                                disabled={false}

                                            />
                                            </Box>
                                        </Box>
                                    ),
                                    content: (
                                        <AccordionContent>
                                            <AccordionStyled isDisabled={!toggleStates.isActiveIvr}>
                                            <AttachDynamicTags
                                                onSelect={(label: string, value: string = "") => {
                                                    setIvrEditorState(
                                                        insertMention(
                                                            ivrEditorState,
                                                            { text: label, value: value },
                                                            false
                                                        )
                                                    );
                                                }}
                                                show={
                                                    notifyModalKeys?.mentionSuggesstionsProp?.length > 0 && toggleStates.isActiveIvr
                                                        ? undefined
                                                        : false
                                                }
                                                tags={tags}
                                                active={toggleStates.isActiveIvr}
                                            >
                                                <NotifyRichTextEditorStyled>
                                                    <RichTextEditor
                                                        label='IVR Call'
                                                        id='ivrCall'
                                                        className='ivrCall'
                                                        editorState={ivrEditorState}
                                                        mention={{
                                                            separator: ' ',
                                                            trigger: '@',
                                                            suggestions: notifyModalKeys?.mentionSuggesstionsProp
                                                        }}
                                                        onEditorStateChange={(state) => {
                                                            setIvrEditorState(state)
                                                        }}
                                                        placeholder='Enter Ivr Message'
                                                        toolbarHidden={true}
                                                        readOnly={!toggleStates.isActiveIvr}
                                                    />
                                                </NotifyRichTextEditorStyled>
                                            </AttachDynamicTags>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                style={{
                                                    color: "#808080",
                                                    fontSize: "12px",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                <div>
                                                    <FontIcon
                                                        color="primary.main"
                                                        variant="icomoon-warning-circled"
                                                        size={14}
                                                    />
                                                    {" Type '@' to enter "}
                                                    <span style={{color: "#5698d3"}}>
                                                        {dynamicLabels?.dynamicTags ||  "Dynamic Tags" }
                                                    </span>
                                                    {" in messages."}
                                                    </div>
                                            </Box>
                                            </AccordionStyled>
                                        </AccordionContent>
                                    ),
                                    }}
                                </Accordion>
                            </BoxWrapperWithShadow>



                            { /* Whatsapp */}
                            <BoxWrapperWithShadow>
                                <Accordion
                                    key={"WhatsApp"}
                                    id={"WhatsApp"}
                                    expanded={expandedAccordionNotificationID === "WhatsApp"}
                                    onToggle={handleAccordionNoticiationToggle}
                                >
                                    {{
                                    header: (
                                        <Box display="flex" justifyContent="space-between">
                                            <Box flexGrow={1}>
                                                <AccordionHeaderTitle>{"WhastsApp"}</AccordionHeaderTitle>
                                                <AccordionHeaderSubTitle>
                                                {"Configure WhatsApp Template"}
                                                </AccordionHeaderSubTitle>
                                            </Box>
                                            <Box>
                                            <Toggle id={"WhatsApp"}
                                                checked={toggleStates.isActiveWhatsapp}
                                                onChange={() => {
                                                    // e.preventDefault()
                                                    setToggleStates({ ...toggleStates, isActiveWhatsapp: !toggleStates.isActiveWhatsapp })
                                                }}
                                                disabled={false}

                                            />
                                            </Box>
                                        </Box>
                                    ),
                                    content: (
                                         <WhatsappNotification isViewMode templateName={selectedNotificationData?.templateName} templateId={selectedNotificationData?.templateId} whatsappMessage={selectedNotificationData?.whatsappMessage} templateLanguage={selectedNotificationData?.templateLanguage} templateDynamicTags={selectedNotificationData?.templateDynamicTags} getNotifyTagsArray={getNotifyTagsArray} /> 
                                    ),
                                    }}
                                </Accordion>
                            </BoxWrapperWithShadow>





                            {/*** SMS message box */}
                            {/* <MessageCard
                                label='SMS'
                                subjectLabel='SMS Message'
                                subject={messages?.smsMessage}
                                isEditable={toggleStates.isActiveSms}
                                notifyModalKeys={notifyModalKeys}
                                onToggleChange={() => {
                                    setToggleStates({ ...toggleStates, isActiveSms: !toggleStates.isActiveSms })
                                }
                                }
                                onSubjectChange={(data: string) => {
                                    setMessages({ ...messages, smsMessage: data })
                                }}
                            />
                            {/*** Email message box */}
                            {/* <MessageCard
                                label='Email'
                                subjectLabel='Subject'
                                bodyLabel='Subject'
                                subject={messages?.emailSubject}
                                body={messages?.emailMessage}
                                isEditable={toggleStates.isActiveEmail}
                                notifyModalKeys={notifyModalKeys}
                                onToggleChange={() => {
                                    setToggleStates({ ...toggleStates, isActiveEmail: !toggleStates.isActiveEmail })
                                }}
                                onSubjectChange={(data: string) => {
                                    setMessages({ ...messages, emailSubject: data })
                                }}
                                onBodyChange={(data: string) => {
                                    setMessages({ ...messages, emailMessage: data })
                                }}

                            /> */}
                            {/*** IVR message box */}
                            {/* <MessageCard
                                label='Ivr Alert'
                                subjectLabel='Ivr Message'
                                subject={messages?.ivrMessage}
                                isEditable={toggleStates.isActiveIvr}
                                notifyModalKeys={notifyModalKeys}
                                onToggleChange={() => {
                                    setToggleStates({ ...toggleStates, isActiveIvr: !toggleStates.isActiveIvr })
                                }}
                                onSubjectChange={(data: string) => {
                                    setMessages({ ...messages, ivrMessage: data })
                                }}

                            />  */}
                        </div>
                    </div>
                </Box>
            ),
            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    style={{ paddingRight: '15px', paddingBottom: '15px' }}
                >
                    <IconButton
                        id='NotifyCustomer-OrderModal-button-Send'
                        iconVariant="icomoon-ribbon-tick"
                        primary
                        color='white'
                        disabled={(toggleStates.isActiveEmail == false && toggleStates.isActiveIvr == false && toggleStates.isActiveSms == false && toggleStates.isActiveWhatsapp == false)}
                        onClick={handleSend}
                    >
                        {dynamicLabels.send || "Send"}
                    </IconButton>
                    <IconButton
                         id='NotifyCustomer-OrderModal-button-Cancel'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => setCustomerNotifyType(false)}
                    >
                        {dynamicLabels.cancel || "Cancel"}
                    </IconButton>
                </Box>
            ),
        }}

    />


}


// const MessageCard = ({ label, subjectLabel, bodyLabel, subject, body, isEditable, notifyModalKeys, onToggleChange, onSubjectChange, onBodyChange }: IMessageCard) => {
//     const [isFieldFocused, setIsFieldFocused] = useState<boolean>(false)
//     const [characterCount, setCharacterCount] = useState<number>(0)
//     const [editable, setEditable] = useState(isEditable)

//     useEffect(() => {
//         setEditable(isEditable)
//     }, [isEditable, subject])

//     let newSubject = subject
//     let newBody = body
//     notifyModalKeys && Object.keys(notifyModalKeys).forEach((key: string) => {
//         newSubject = newSubject?.replaceAll(key, `@${notifyModalKeys[key].labelValue}`)
//     })
//     notifyModalKeys && Object.keys(notifyModalKeys).forEach((key: string) => {
//         newBody = newBody?.replaceAll(key, `@${notifyModalKeys[key].labelValue}`)
//     })
//     const NewSubject = () => <div>{newSubject}</div>
//     newBody = newBody?.replace(/<\/?[^>]+(>|$)/g, "");
//     console.log(editable, 'editable')


//     return <StyledSmsCard p="15px" >
//         <StyledSms >
//             <div style={{ letterSpacing: '0.3px', color: '#000', fontWeight: 'lighter' }}>{label}</div>
//             {/*** toggle to make field editable */}
//             <Toggle id={label}
//                 checked={editable}
//                 onChange={(e: any) => {
//                     e.preventDefault()
//                     onToggleChange()
//                 }}
//                 disabled={false}

//             />
//         </StyledSms>
//         <div style={{ padding: '0px 15px' }}>
//             <div style={{ marginTop: '-15px' }}>
//                 {/*** Subject box */}
//                 {subjectLabel && <TextInput
//                     id='subject'
//                     name={subjectLabel}
//                     label={subjectLabel}
//                     labelColor='text.inputLabel.default'
//                     placeholder='Insert text here ...'
//                     required={false}
//                     fullWidth={true}
//                     value={NewSubject}
//                     className='subject-field'
//                     variant='textArea'
//                     contentEditable={isEditable}
//                     onChange={(e: any) => {
//                         // make it true only once
//                         if (!isFieldFocused) {
//                             setIsFieldFocused(true)
//                         }
//                         setCharacterCount(e?.target?.textContent?.length)
//                     }}
//                     onBlur={(e: any) => {
//                         onSubjectChange && onSubjectChange(e?.target?.textContent)
//                     }}
//                 />}
//             </div>
//             <div style={{ marginTop: '-15px' }}>
//                 {/*** Body box */}
//                 {bodyLabel && <> <TextInput
//                     id='body'
//                     name={bodyLabel}
//                     label={bodyLabel}
//                     labelColor={isEditable ? 'text.inputLabel.default' : 'grey.250'}
//                     placeholder='Insert text here ...'
//                     value={newBody}
//                     required={false}
//                     fullWidth={true}
//                     className='body-field'
//                     variant='textArea'
//                     contentEditable={isEditable}
//                     onBlur={(e: any) => {
//                         onBodyChange && onBodyChange(e?.target?.textContent)
//                     }}
//                     onChange={(e: any) => {
//                         // make it true only once
//                         if (!isFieldFocused) {
//                             setIsFieldFocused(true)
//                         }
//                         setCharacterCount(e?.target?.textContent?.length)
//                     }}
//                 />

//                 </>}
//             </div>
//             <DynamicTypingLabel
//                 characterCount={characterCount}
//                 isFieldFocused={isFieldFocused}
//                 label={label}
//             />
//         </div>

//     </StyledSmsCard >
// }


// const DynamicTypingLabel = ({ characterCount, isFieldFocused, label }: IDynamicTypingLabel) => {
//     return <Box>
//         <div style={{
//             display: 'flex', justifyContent: 'space-between', marginTop: '-10px',
//             marginBottom: '10px'
//         }}>
//             {isFieldFocused && <div>
//                 <FontIcon variant='icomoon-warning-circled' className='message-count' color='primary.main' size={12} style={{ paddingRight: '2px', paddingTop: '2px' }} />
//                 <span className='message-count'>Type '@' to enter <a>@Dynamic Tags</a> in messages</span>
//             </div>}
//             {label === 'SMS' && <div>
//                 <img src='../../../../images/chat.svg' className='chat' />
//                 <span className='message-count'>{`SMS Count :${characterCount === 0 ? 0 : Math.ceil(characterCount / 160)} (${characterCount} Characters)`}</span>
//             </div>}
//         </div>
//     </Box>

// }
export default NotifyCustomerModal