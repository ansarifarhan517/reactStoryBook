import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Dispatch,
} from "react";
import {
  Modal,
  ModalHeader,
  IconButton,
  Box,
  Typography,
  FontIcon,
  TextInput,
  Accordion,
  AccordionHeaderSubTitle,
  AccordionHeaderTitle,
  Toggle,
  AccordionContent,
  Grid,
  useToast,
} from "ui-library";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import SMSConfiguration from "../../Customer/CustomerListView/SubComponent/NotifyComponents/SMSConfiguration";
import EmailConfiguration from "../../Customer/CustomerListView/SubComponent/NotifyComponents/EmailConfiguration";
import {
  AccordionStyled,
  BoxWrapperWithShadow,
} from "../../Customer/CustomerListView/styled";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import IVRConfiguration from "../../Customer/CustomerListView/SubComponent/NotifyComponents/IVRConfiguration";
import { tSendNotificationParam } from "./OrderMiddleMileNotificationModal.model";
import { tGetNotifyTagsArray } from "../../Customer/CustomerListView/CustomerListView.models";
import { useDispatch } from "react-redux";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import WhatsappNotification from "../../OnboardingWrapper/NotificationConfiguration/SubComponent/WhatsappNotification";

const AccordionToggle = (props: {
  id: string;
  highlightWhenChecked: boolean;
  isActive: boolean;
  handleActive: (id: any, status: boolean) => void;
}) => {
  return (
    <Toggle
      checked={props?.isActive}
      highlightWhenChecked={props?.highlightWhenChecked}
      onChange={(e) => {
        props?.handleActive(props?.id, !props?.isActive);
      }}
    />
  );
};

const dynamicNote = (dynamicLabels: Record<string, string>) => (
  <Typography fontSize="12px" color="grey.A400">
    <FontIcon
      variant="icomoon-warning-circled"
      color="primary.main"
      size="xs"
    />
    {dynamicLabels?.typetoEnterMessages || "Type '@' to enter in messages"}
    <span className="sub-component__dynamicLabelsMessage">
      {dynamicLabels?.dynamicTags || "Dynamic Tags"}
    </span>
  </Typography>
);

const OrderMiddleMileNotificationModal = ({
  showNoitfyOrderModal,
  handleClose,
  notifyObject,
  selectedRows,
}: any) => {
  const [notifyObjectData, setNotifyObjectData] = useState({});
  const [notificationChannel, setNotificationChannel] = useState<any>({
    sms: notifyObject?.smsMessage,
    subject: notifyObject?.emailSubject,
    body: notifyObject?.emailBody,
    ivr: notifyObject?.ivrMessage,
  });
  const [tags, setTags] = useState<any>({});
  const [getNotifyTagsArray, setGetNotifyTagsArray] = useState<any>([]);
  const [mentions, setMentions] = useState({});
  const [notificationAllMile, setNotificationAllMile] = useState(false);
  const [deliveryNotifyFlag, setDeliveryNotifyFlag] = useState(false);
  const [pickedupNotifyFlag, setPickedupNotifyFlag] = useState(false);
  const [active, setActive] = useState({
    SMS: notifyObject?.isSmsActiveFl,
    Email: notifyObject?.isEmailActiveFl,
    IVR: notifyObject?.isIvrActiveFl,
    Whatsapp: notifyObject?.isWhatsappActiveFl
  });
  const [ivrAccess, setIvrAccess] = useState(false);
  const [expanded, setExpanded] = useState<string>("0");

  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING?.customer?.all_customers);

  useEffect(() => {
    if (notifyObject) {
      setNotificationChannel({
        sms: notifyObject?.smsMessage,
        subject: notifyObject?.emailSubject,
        body: notifyObject?.emailBody,
        ivr: notifyObject?.ivrMessage,
      });
      setNotifyObjectData(notifyObject);
      setActive({
        SMS: notifyObject?.isSmsActiveFl,
        Email: notifyObject?.isEmailActiveFl,
        IVR: notifyObject?.isIvrActiveFl,
        Whatsapp: notifyObject?.isWhatsappActiveFl
      });
    }
  }, [notifyObject]);

  useEffect(() => {
    getNotifyTags();
    getIvrAccess();
  }, []);

  useEffect(() => {
    tags &&
      setMentions(
        tags?.notificationKeys?.map((mentionProp: tGetNotifyTagsArray) => {
          return {
            id: mentionProp?.key,
            text: mentionProp?.labelValue,
            value: mentionProp?.key?.substring(1, mentionProp?.key?.length - 1),
            url: "#",
          };
        })
      );
  }, [tags]);

  useEffect(() => {
    if (selectedRows && Object.keys(selectedRows)?.length > 0) {
      Object.values(selectedRows)?.forEach((row: any) => {
        //Add ISP2P condition Here
        if (
          row?.orderSubTypeCd == "FMMMLM" ||
          row?.orderSubTypeCd == "FMLM" ||
          row?.isP2POrder
        ) {
          setNotificationAllMile(true);
          setDeliveryNotifyFlag(true);
          setPickedupNotifyFlag(true);
        }
      });
    }
  }, [selectedRows]);

  const ACCORDION_DATA = useMemo(
    () => [
      {
        id: "SMS",
        title: dynamicLabels?.sms_s,
        description: "Configure SMS Message",
        isVisible: true,
        content: (
          <SMSConfiguration
            content={notifyObject}
            handleChange={handleSMSChange}
            mentions={mentions}
            active={active?.SMS}
            dynamicNote={dynamicNote(dynamicLabels)}
            tags={tags}
            setSms={(updatedNotificationValue) =>
              setNotificationChannel((prevState) => ({
                ...prevState,
                sms: updatedNotificationValue,
              }))
            }
          />
        ),
      },
      {
        id: "Email",
        title: dynamicLabels?.email,
        description: "Configure Email Message",
        isVisible: true,
        content: (
          <EmailConfiguration
            content={notifyObject}
            handleSubjectChange={handleSubjectChange}
            handleBodyChange={handleBodyChange}
            mentions={mentions}
            active={active?.Email}
            dynamicNote={dynamicNote(dynamicLabels)}
            tags={tags}
            setBody={(updatedNotificationValue) =>
              setNotificationChannel((prevState) => ({
                ...prevState,
                body: updatedNotificationValue,
              }))
            }
            setSubject={(updatedNotificationValue) =>
              setNotificationChannel((prevState) => ({
                ...prevState,
                subject: updatedNotificationValue,
              }))
            }
          />
        ),
      },
      {
        id: "IVR",
        title: dynamicLabels?.ivr || "IVR",
        description: "Configure IVR Call",
        isVisible: ivrAccess,
        content: (
          <IVRConfiguration
            content={notifyObject}
            handleChange={handleIVRChange}
            mentions={mentions}
            active={active?.IVR}
            dynamicNote={dynamicNote(dynamicLabels)}
            tags={tags}
            setIvr={(updatedNotificationValue) =>
              setNotificationChannel((prevState) => ({
                ...prevState,
                ivr: updatedNotificationValue,
              }))
            }
          />
        ),
      },
       {
        id: "Whatsapp",
        isVisible: true,
        title: dynamicLabels?.whatsapp_s || "Whatsapp",
        description: dynamicLabels?.whatsapp_description || "Configure WhatsApp Template" ,
        content: (
           <WhatsappNotification
            isViewMode
            templateName={notifyObject?.templateName} 
            whatsappMessage={notifyObject?.whatsappMessage} 
            templateId={notifyObject?.templateId} 
            templateLanguage={notifyObject?.templateLanguage} 
            templateDynamicTags={notifyObject?.templateDynamicTags} 
            getNotifyTagsArray={getNotifyTagsArray}/> 
        ),
      },
    ],
    [
      dynamicLabels,
      notifyObject,
      tags,
      active,
      getNotifyTagsArray,
      mentions,
      notifyObjectData,
      ivrAccess,
    ]
  );

  const getIvrAccess = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.customerNotification.ivrPermission
      );
      response?.propertyValue === "Y"
        ? setIvrAccess(true)
        : setIvrAccess(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotifyTags = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.templateKey,
        { params: { notificationType: "ORDER_ALLMILE" } }
      );
      setTags(response);
      setGetNotifyTagsArray(response?.notificationKeys);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : "");
  };

  const handleSMSChange = (e: string) => {
    setNotificationChannel({ ...notificationChannel, sms: e.trim() });
  };

  const handleSubjectChange = (e: string) => {
    setNotificationChannel({ ...notificationChannel, subject: e.trim() });
  };

  const handleBodyChange = (e: string) => {
    setNotificationChannel({ ...notificationChannel, body: e.trim() });
  };

  const handleIVRChange = (e: string) => {
    setNotificationChannel({ ...notificationChannel, ivr: e.trim() });
  };

  const sendNotification = async (payload) => {
    try {
      const url = apiMappings.order.listView.customerNotificationSend;
      const { data: response } = await axios.post(url, payload);
      if (response?.status === 200) {
        toastDispatch({
          type: "@@globalToast/add",
          payload: {
            message: response?.message || response?.data?.message,
            icon: "check-round",
          },
        });
        setNotificationAllMile(false);
        handleClose();
      } else {
        toast.add(response?.message, "warning", false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = useCallback(() => {
    if (selectedRows && Object.keys(selectedRows)?.length > 0) {
      const customerIds: any = [];

      Object.values(selectedRows)?.forEach((row: any) => {
        if (row?.orderTypeCd != "ALLMILE") {
          customerIds.push({ orderId: row?.orderId, type: row?.movementType });
        } else {
          if (
            row?.orderSubTypeCd == "FMMMLM" ||
            row?.orderSubTypeCd == "FMLM"
          ) {
            if (pickedupNotifyFlag)
              customerIds.push({ orderId: row?.orderId, type: "FMOH" });
            if (deliveryNotifyFlag)
              customerIds.push({ orderId: row?.orderId, type: "DHLM" });
          } else if (row?.orderSubTypeCd == "FMMM") {
            customerIds.push({
              orderId: row?.orderId,
              type: row?.movementType,
            });
          } else if (row?.orderSubTypeCd == "MMLM") {
            customerIds.push({
              orderId: row?.orderId,
              type: row?.movementType,
            });
          } else if (row?.orderSubTypeCd == "MM") {
            toast.add(
              dynamicLabels?.BranchToBranchOrdersCannotNotify,
              "warning",
              false
            );
          }
        }
      });

      const param: tSendNotificationParam = {
        smsToBeSent: active?.SMS,
        smsMessage: notificationChannel?.sms,
        emailToBeSent: active?.Email,
        emailSubject: notificationChannel?.subject,
        emailMessage: notificationChannel?.body,
        whatsappToBeSent: active?.Whatsapp,
        templateName: notifyObject?.templateName,
        templateId: notifyObject?.templateId,
        whatsappMessage: notifyObject?.whatsappMessage,
        templateLanguage: notifyObject?.templateLanguage,
        templateDynamicTags: notifyObject?.templateDynamicTags

      };
      if (ivrAccess) {
        param.ivrToBeSent = active?.IVR;
        param.ivrMessage = notificationChannel?.ivr;
      }

      var payload = {
        notification: param,
        shipmentOrderTypeMap: customerIds,
      };
      sendNotification(payload);
    }
  }, [
    selectedRows,
    notificationChannel?.sms,
    notificationChannel?.body,
    notificationChannel?.subject,
    active,
    ivrAccess,
    notificationChannel?.ivr,
  ]);

  const handleActive = (id: "SMS" | "Email" | "IVR" | "Whatsapp", status: boolean) => {
    setActive((prevActive) => ({
      ...prevActive,
      [id]: status,
    }));
  };

  const handleToggleNotify = (id: string) => {
    if (id === "pickedupNotify") {
      setPickedupNotifyFlag((state) => !state);
    } else if (id === "deliveryNotify") {
      setDeliveryNotifyFlag((state) => !state);
    }
  };

  return (
    <Modal open={showNoitfyOrderModal} onToggle={() => {}} width="1200px">
      {{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels?.orderNotificationMessage}
            handleClose={handleClose}
            imageVariant="icomoon-close"
            headerStyle={{ fontSize: "15px" }}
            width="100%"
          />
        ),
        content: (
          <div className="order-middlmile-modal__content">
            <div className="order-middlmile-modal__main-content">
              <Grid container>
                <Grid item xs={12} sm={6} md={3}>
                  <TextInput
                    id="notification-box"
                    name="Notification Name"
                    label="Notification Name"
                    labelColor="text.inputLabel.default"
                    placeholder="selectedType"
                    required={true}
                    fullWidth={true}
                    disabled={true}
                    value={notifyObject?.name}
                  />
                </Grid>
              </Grid>

              {Object.keys(notifyObject)?.length > 0 &&
                mentions &&
                active &&
                ACCORDION_DATA?.map((data, index) =>
                  data?.isVisible ? (
                    <BoxWrapperWithShadow key={data?.id}>
                      <Accordion
                        key={data?.id}
                        id={index?.toString()}
                        expanded={expanded == index?.toString()}
                        onToggle={handleToggle}
                      >
                        {{
                          header: (
                            <Box display="flex">
                              <Box flexGrow={1}>
                                <AccordionHeaderTitle>
                                  {data?.id}
                                </AccordionHeaderTitle>
                                <AccordionHeaderSubTitle>
                                  {data?.description}
                                </AccordionHeaderSubTitle>
                              </Box>
                              <AccordionToggle
                                highlightWhenChecked={true}
                                id={data?.id}
                                isActive={active[data?.id]}
                                handleActive={handleActive}
                              />
                            </Box>
                          ),
                          content: (
                            <AccordionContent>
                              <AccordionStyled isDisabled={!active[data?.id]}>
                                {data?.isVisible && data?.content}
                              </AccordionStyled>
                            </AccordionContent>
                          ),
                        }}
                      </Accordion>
                    </BoxWrapperWithShadow>
                  ) : (
                    <></>
                  )
                )}
            </div>
          </div>
        ),
        footer: (
          <>
            {notificationAllMile && (
              <Box display="flex" flexDirection="row" p="15px">
                <Box mr="15px">
                  <Toggle
                    id="pickedupNotify"
                    checked={pickedupNotifyFlag}
                    label={dynamicLabels?.NotifyPickupCustomer || "Notify Pickup Customer"}
                    onChange={() => handleToggleNotify("pickedupNotify")}
                  />
                </Box>
                <Box mr="15px">
                  <Toggle
                    id="deliveryNotify"
                    checked={deliveryNotifyFlag}
                    label={dynamicLabels?.NotifyDeliveryCustomer || "Notify Delivery Customer"}
                    onChange={() => handleToggleNotify("deliveryNotify")}
                  />
                </Box>
              </Box>
            )}
            <Box
              style={{ padding: "0px 20px 20px 0px" }}
              horizontalSpacing="15px"
              display="flex"
              justifyContent="flex-end"
              className="footer-cont"
            >
              <IconButton
                primary
                iconVariant="icomoon-ribbon-tick"
                style={{ padding: "0px 15px" }}
                onClick={handleSend}
                id="NotifyCustomer-OrderMiddleMileModal-button-Send"
                disabled={!active?.SMS && !active?.Email && !active?.IVR && !active?.Whatsapp}
              >
                {dynamicLabels?.send || "Send"}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                style={{ padding: "0px 15px" }}
                onClick={handleClose}
                id="NotifyCustomer-OrderMiddleMileModal-button-Cancel"
              >
                {dynamicLabels?.cancel || "Cancel"}
              </IconButton>
            </Box>
          </>
        ),
      }}
    </Modal>
  );
};

export default OrderMiddleMileNotificationModal;
