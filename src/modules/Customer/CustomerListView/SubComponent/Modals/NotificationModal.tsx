import React, { useEffect, useState } from 'react'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import { Box, TextInput, Accordion, AccordionContent, AccordionHeaderTitle,AccordionHeaderSubTitle, Toggle, IconButton, FontIcon, Typography } from 'ui-library'
import { StyledCard, AccordionStyled, StyledNote, BoxWrapperWithShadow } from '../../styled'
import SMSConfiguration from '../NotifyComponents/SMSConfiguration'
import EmailConfiguration from '../NotifyComponents/EmailConfiguration'
import axios from '../../../../../utils/axios'
import apiMappings from '../../../../../utils/apiMapping'
import WhatsappNotification from '../../../../OnboardingWrapper/NotificationConfiguration/SubComponent/WhatsappNotification'

import "../SubComponentStyles.scss";

const AccordionToggle = (props: { id: string, highlightWhenChecked: boolean, isActive: boolean, handleActive: (id: string, status: boolean) => void, disabled: boolean }) => {
  return <Toggle
    checked={props.isActive}
    highlightWhenChecked={props.highlightWhenChecked}
    onChange={(e) => {
      props.handleActive(props.id, !props.isActive)
    }}
    disabled={!props.disabled}
  />
}

const validateSelectedRows = (rows: any, dynamicLabels: any) => {
  let flag = {
    SMS: true,
    Email: true,
    message: '',
    Whatsapp: true
  }

  Object.values(rows).every((c: any) => {
    if (c?.mobileNumber && c?.emailAddress) {
      flag.SMS = true
      flag.Email = true
      flag.Whatsapp = c?.whatsappOptin == "Y" ? true : false
      flag.message = c?.whatsappOptin == "Y" ? ``:`${dynamicLabels.WhatsAppOptinErrorMessage || `Whatsapp Optin is not enabled.`}`
      return true
    } else if (!c?.mobileNumber && c?.emailAddress) {
      flag.SMS = false
      flag.Email = true
      flag.Whatsapp = false
      flag.message = `${dynamicLabels.primaryContactNumberNotAvailable}. `
      return true
    } else if (!c?.emailAddress && c?.mobileNumber) {
      flag.SMS = true
      flag.Email = false
      flag.Whatsapp = c?.whatsappOptin == "Y" ? true : false
      flag.message = `${dynamicLabels.emailIdNotAvailable}.`
      return true
    } else {
      flag.SMS = false
      flag.Email = false
      flag.Whatsapp = false
      flag.message = `${dynamicLabels.primaryContactNumberNotAvailable}. ${dynamicLabels.emailIdNotAvailable}.`
      return false
    }
  })
  return flag
}

const dynamicNote = (dynamicLabels: any) => (
    <Typography
    fontSize='12px'
    color='grey.A400'
    >
      <FontIcon
        variant='icomoon-warning-circled'
        color='primary.main'
        size='xs'
      />
      {dynamicLabels?.typetoEnterMessages || "Type '@' to enter in messages"}
      <span
        className='sub-component__dynamicLabelsMessage'
      > {dynamicLabels?.dynamicTags || "Dynamic Tags"}</span>
    </Typography>
)


const NotificationModal = ({ notifyObject, mentions, handleCancel, handleSend, selectedRows }: any) => {

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customer.all_customers)

  const [active, setActive] = useState({
    SMS: notifyObject?.isSmsActiveFl,
    Email: notifyObject?.isEmailActiveFl,
    Whatsapp: notifyObject?.isWhatsappActiveFl
  })

  const validate = React.useMemo((() => {
    return validateSelectedRows(selectedRows, dynamicLabels)
  }), [selectedRows])

  const [notificationChannel, setNotificationChannel] = useState<any>({
    sms: notifyObject?.smsMessage,
    subject: notifyObject?.emailSubject,
    body: notifyObject?.emailBody,
  })

  const [expanded, setExpanded] = useState("0");
  const [getNotifyTagsArray, setGetNotifyTagsArray] = useState([]);
  const [tags, setTags] = useState({})

  useEffect(() => {
    getNotifyTags();
  }, []);

  const getNotifyTags = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.templateKey,
        { params: { notificationType: notifyObject?.notificationType } }
      );
      setTags(response);
      setGetNotifyTagsArray(response?.notificationKeys);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : '')
  }

  const handleSMSChange = (e: string) => {
    setNotificationChannel({...notificationChannel, sms: e.trim()});
  }

  const handleSubjectChange = (e: string) => {
    setNotificationChannel({...notificationChannel, subject: e.trim()});
  }

  const handleBodyChange = (e: string) => {
    setNotificationChannel({...notificationChannel, body: e.trim()});
  }

  const handleSendNotify = () => {
    const payload: Record<string, any> = {};

    if (active?.Email) {
        payload.emailMessage = notificationChannel?.body;
        payload.emailSubject = notificationChannel?.subject;
        payload.emailToBeSent = true;
    }

    if (active?.SMS) {
        payload.smsMessage = notificationChannel?.sms;
        payload.smsToBeSent = true;
    }

    if (active.Whatsapp) {
      payload.whatsappToBeSent = validate?.Whatsapp ? true : false
      payload.templateName = notifyObject?.templateName;
      payload.templateId = notifyObject?.templateId;
      payload.whatsappMessage = notifyObject?.whatsappMessage;
      payload.templateLanguage = notifyObject?.templateLanguage;
      payload.templateDynamicTags = notifyObject?.templateDynamicTags;
  }

    handleSend(payload);
};

  const handleActive = (id: string, status: boolean) => {
    if (id === 'SMS' && validate?.SMS) {
      setActive({
        ...active,
        [id]: status
      })
    } else if (id === 'Email' && validate?.Email) {
      setActive({
        ...active,
        [id]: status
      })
    } else if(id === "Whatsapp" && validate?.Whatsapp){
      setActive({
        ...active,
        [id]: status
      })
    }


  }


  const ACCORDION_DATA = React.useMemo(() => [
    { id: 'SMS', title: dynamicLabels.sms_s, description:"Configure SMS Message", content: <SMSConfiguration content={notifyObject} handleChange={handleSMSChange} mentions={mentions} active={validate.SMS && active.SMS} dynamicNote={dynamicNote(dynamicLabels)} tags={tags} setSms={(updatedNotificationValue) => setNotificationChannel(prevState => ({ ...prevState, sms: updatedNotificationValue }))}/> },
    { id: 'Email', title: dynamicLabels.email, description: "Configure Email Message", content: <EmailConfiguration content={notifyObject} handleSubjectChange={handleSubjectChange} handleBodyChange={handleBodyChange} mentions={mentions} active={validate.Email && active.Email} dynamicNote={dynamicNote(dynamicLabels)} tags={tags} setBody={(updatedNotificationValue) => setNotificationChannel(prevState => ({ ...prevState, body: updatedNotificationValue }))} setSubject={(updatedNotificationValue) => setNotificationChannel(prevState => ({ ...prevState, subject: updatedNotificationValue }))}/> },
    { id: 'Whatsapp', title: dynamicLabels.whatsapp_description||"Configure Whatsapp Template" , description: dynamicLabels.whatsapp_description||"Configure Whatsapp Template", content: <WhatsappNotification isViewMode templateName={notifyObject?.templateName} templateId={notifyObject?.templateId} whatsappMessage={notifyObject?.whatsappMessage} templateLanguage={notifyObject?.templateLanguage} templateDynamicTags={notifyObject?.templateDynamicTags} getNotifyTagsArray={getNotifyTagsArray}/> },
  ], [dynamicLabels, active, notifyObject,getNotifyTagsArray])


  return (
    <Box flexGrow={1} >
      <StyledCard style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Box className='message-configuration-container'>
          {
            <TextInput
              id='someId'
              name='someName'
              className='notify Message'
              label='Notification Name'
              required
              value={notifyObject.label}
              style={
                {
                  cursor: 'not-allowed',
                  width: '20%'
                }
              }
            />
          }
          <StyledNote>
            {validate?.message !== '' ?
              <> <FontIcon
                variant='icomoon-warning-circled'
                color='error.main'
                size='xs'
              /> {validate?.message}
              </> : ''}
          </StyledNote>
            {ACCORDION_DATA?.map((d,index) => (
              <BoxWrapperWithShadow>
                <Accordion key={d?.id} id={index?.toString()} expanded={expanded == index?.toString()} onToggle={handleToggle}  >

                  {{
                    header: <Box display='flex'>
                      <Box flexGrow={1}>
                      <AccordionHeaderTitle>{d.id}</AccordionHeaderTitle>
                      <AccordionHeaderSubTitle>
                        {d?.description}
                      </AccordionHeaderSubTitle>
                      </Box>
                      <AccordionToggle highlightWhenChecked={true} id={d.id} isActive={active[d.id]} handleActive={handleActive} disabled={validate[d.id]} />
                    </Box>,
                    content:
                      <AccordionContent>
                        <AccordionStyled isDisabled={!validate[d.id] ? true : !active[d.id]}>
                        
                          {d?.content}
                        </AccordionStyled>
                      </AccordionContent>
                  }}
                </Accordion>
              </BoxWrapperWithShadow>
            ))}

        </Box>
        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='0' pt='15px' fullWidth className='action-container'>
          <IconButton
            id='CustomerList-NotifyModal-button-Send'
            iconVariant='icomoon-ribbon-tick'
            primary
            disabled={!(active?.SMS || active?.Email || active?.Whatsapp) || !validate?.SMS && !validate?.Email && !validate?.Whatsapp}
            onClick={handleSendNotify}
          >
            {dynamicLabels.send}
          </IconButton>
          <IconButton id='CustomerList-NotifyModal-button-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={handleCancel}>
            {dynamicLabels.cancel}
          </IconButton>
        </Box>
      </StyledCard>
    </Box >
  )
}

export default NotificationModal