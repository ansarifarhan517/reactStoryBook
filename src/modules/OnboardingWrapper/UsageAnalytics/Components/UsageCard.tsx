import React, { Dispatch, useState, useEffect } from "react";
import { theme } from "../../../../utils/theme";
import {
  UsagePieCard,
  FlexContainer,
  HyperLink,
  PieContainer,
} from "../Services/UsageAnalytics.styles";
import {
  IconButton,
  Modal,
  ModalHeader,
  Box,
  TextInput,
  PieChartComponent,
  ProgressBarDraggable
} from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { IUsageAnalyticsActions } from "../Services/UsageAnalytics.actions";
import {
  IUpdateThresholdDataPayload,
  IUsageCardProps,
} from "../Services/UsageAnalytics.models";
import { pageValueFromKey } from "../Services/Utils/Mappings";

const UsageCard = ({ cardData, cardKey, dynamicLabels }: IUsageCardProps) => {
  const pageKey = useTypedSelector((state) => state.usageAnalytics.pageKey);
  const selectedValue = useTypedSelector(state => state.usageAnalytics?.[pageValueFromKey[pageKey]]?.selectedValue);
  const clientIdForClientPage = useTypedSelector((state) => state.usageAnalytics.clientPage.selectedValue);
  const subscriptionId = useTypedSelector((state) => state.usageAnalytics.subscriptionPage.subscriptionId);

  const thresholdData = useTypedSelector(state => state.usageAnalytics?.[pageValueFromKey[pageKey]]?.thresholdData);
  const keyThresholdData = thresholdData[cardKey]; 

  const usageAlertLabel = dynamicLabels.usageAlert || "Usage Alert";

  const cardKeyToLabelsMapping = {
    ORDERLIMIT: {
      keyLabel: dynamicLabels.order_p || "Orders",
      sentLabel: dynamicLabels.ordersCreated || "Orders Created",
      remainingLabel: `${dynamicLabels.order_p} ${dynamicLabels.remaining}` || "Orders Remaining",
      limitLabel: dynamicLabels.orderLimit || "Order Limit"
    },
    TOTALSMSLIMIT: {
      keyLabel: dynamicLabels.sms_p || "SMSs",
      sentLabel: dynamicLabels.analytics_sms_sent || "SMSs Sent",
      remainingLabel: `${dynamicLabels.sms_p} ${dynamicLabels.remaining}` || "SMSs Remaining",
      limitLabel: dynamicLabels.smsLimit || "SMS Limit"
    },
    TOTALIVRLIMIT: {
      keyLabel: dynamicLabels.ivr_p || "IVRs",
      sentLabel: dynamicLabels.analytics_ivr_sent || "IVRs Sent",
      remainingLabel: `${dynamicLabels.ivr_p} ${dynamicLabels.remaining}` || "IVRs Remaining",
      limitLabel: dynamicLabels.ivrLimit || "IVR Call Limit"
    },
    TOTALEMAILLIMIT: {
      keyLabel: dynamicLabels.email_p || "Emails",
      sentLabel: dynamicLabels.analytics_email_sent || "Emails Sent",
      remainingLabel: `${dynamicLabels.email_p} ${dynamicLabels.remaining}` || "Emails Remaining",
      limitLabel: dynamicLabels.emailLimit || "Email Limit"
    },
    RESOURCELIMIT: {
      keyLabel: dynamicLabels.deliveryboy_p || "Delivery Associates",
      sentLabel: dynamicLabels.analytics_deliveryboys_active || "Delivery Associates Active",
      remainingLabel: `${dynamicLabels.deliveryboy_p} ${dynamicLabels.remaining}` || "Delivery Associates Remaining",
      limitLabel: dynamicLabels.deliveryboysLimit || "Delivery Associates Limit"
    }
  }

  const {keyLabel, sentLabel, remainingLabel, limitLabel} = cardKeyToLabelsMapping[cardKey];
  const { totalLimit, limitExhausted } = cardData;

  const pieDetails = [
    {
      name: remainingLabel,
      value: totalLimit - limitExhausted,
      color: "#d9d9d9",
      active: true,
    },
    {
      name: sentLabel,
      value: limitExhausted,
      color: "#82b8e5",
      active: true,
    }
  ];

  // Local States
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [usageEmailIds, setUsageEmailIds] = useState(keyThresholdData?.usageEmailIds || "");
  const [usageContactNumbers, setUsageContactNumbers] = useState<any>(keyThresholdData?.usageContactNumbers || "");

  const cardSubLabel = pageKey === 'SUBSCRIPTION' ? totalLimit : limitExhausted;


  const getThresholdValue = () => {
    if(keyThresholdData?.thresholdLimit){
      return keyThresholdData?.thresholdLimit;
    }else{
      if(pageKey === 'CLIENT'){
        return 0;
      }else{
        return 75;
      }
    }
  }

  // Dispatching Actions
  const dispatch = useDispatch<Dispatch<IUsageAnalyticsActions>>();

  const percentageUsedLabel = totalLimit ? `${((limitExhausted / totalLimit) * 100).toFixed(2)}%(${limitExhausted})` : 'No Data Found';
  const [thresholdPayloadValue, setThresholdPayloadValue] = useState<any>(getThresholdValue());

  useEffect(() => {
    setThresholdPayloadValue(getThresholdValue());
    setUsageEmailIds(keyThresholdData?.usageEmailIds || "");
    setUsageContactNumbers(keyThresholdData?.usageContactNumbers || "");
  }, [keyThresholdData])


  // Utils Functions
  const sendPutRequestForThresholdUpdate = () => {
    let payload: IUpdateThresholdDataPayload = {
      usageDetail: {
        key: pageKey,
        identifier: pageKey === "CLIENT" ? clientIdForClientPage : subscriptionId,
        type: cardKey
      },
      usageThreshold: {
        thresholdLimit: thresholdPayloadValue,
        usageEmailIds: usageEmailIds,
        usageContactNumbers: usageContactNumbers,
        usageExhaustedNotified: keyThresholdData?.usageExhaustedNotified,
        extGatewayUsageExhaustedNotified: keyThresholdData?.extGatewayUsageExhaustedNotified,
        usageThresholdNotified: keyThresholdData?.usageThresholdNotified,
        extGatewayUsageThresholdNotified: keyThresholdData?.extGatewayUsageThresholdNotified,
        isThresholdLimitPercentage: keyThresholdData?.isThresholdLimitPercentage
      }
    };

    dispatch({
      type: "@@usageAnalytics/PUT_THRESHOLD_UPDATED_DATA",
      payload,
    });
  };

  const subscriptionUsageAlertClicked = () => {
    dispatch({ type: "@@usageAnalytics/FETCH_THRESHOLD_DATA", payload: { key: "SUBSCRIPTION", identifier: subscriptionId, type: cardKey } });
    setIsModalOpen(true);
  };

  const clientUsageAlertClicked = () => {
    dispatch({ type: "@@usageAnalytics/FETCH_THRESHOLD_DATA", payload: { key: pageKey, identifier: selectedValue, type: cardKey } });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setThresholdPayloadValue(thresholdPayloadValue);
    sendPutRequestForThresholdUpdate();
    setIsModalOpen(false);
  };

  return (
    <UsagePieCard>
      <FlexContainer
        fontSize="14px"
        justifyContent="space-between"
        color={theme.colors.grey.A100}
        padding="0 0 10px 0"
      >
        <span style={{ fontWeight: 600 }}>{pageKey === 'SUBSCRIPTION' ? limitLabel : sentLabel}</span>
        <span style={{ fontWeight: 600 }}>{cardSubLabel}</span>
      </FlexContainer>


      {pageKey === "SUBSCRIPTION" ?
        <>
          <FlexContainer padding="0 0 25px 0" justifyContent="space-between">
            <HyperLink onClick={subscriptionUsageAlertClicked}>{usageAlertLabel}</HyperLink>
            <span style={{ color: theme.colors.red }}>
              {percentageUsedLabel}
            </span>
          </FlexContainer>
          <PieContainer>
            <PieChartComponent details={pieDetails} height={150} />
          </PieContainer>
        </>
        :
        <FlexContainer padding="0 0 25px 0" justifyContent="space-between">
          <HyperLink onClick={clientUsageAlertClicked}>{usageAlertLabel}</HyperLink>
        </FlexContainer>}


      <Modal open={isModalOpen} onToggle={() => { }} size="md">
        {{
          header: (
            <ModalHeader
              headerTitle={`${keyLabel} Limit Creation`}
              imageVariant="icomoon-close"
              handleClose={() => setIsModalOpen(false)}
              width="100%"
            />
          ),

          content: (
            <>
              {pageKey === "SUBSCRIPTION" ?
                <FlexContainer flexDirection="row" alignItems="center" gap="10px" padding="10px 0">
                  <ProgressBarDraggable
                    completedPercent={thresholdPayloadValue}
                    thickness={6}
                    withDragThumb={true}
                    notifySliderChange={(percentage) => setThresholdPayloadValue(percentage)}
                  />
                  {thresholdPayloadValue + '%'}
                </FlexContainer> : <TextInput
                  id="thresholdPayloadValue"
                  name={`${keyLabel} sent count`}
                  label={`${keyLabel} sent count`}
                  placeholder={`Enter ${keyLabel} sent count here...`}
                  required={false}
                  fullWidth={true}
                  type="number"
                  value={thresholdPayloadValue}
                  onChange={(e) => setThresholdPayloadValue(isNaN(parseInt(e.target.value)) ? "" : parseInt(e.target.value))}
                />}
              <TextInput
                id="usageEmailIds"
                name="Notify Email"
                label={"Notify Email"}
                placeholder={"Enter Email here..."}
                value={usageEmailIds}
                required={false}
                fullWidth={true}
                onChange={(e) => setUsageEmailIds(e.target.value)}
              />
              <TextInput
                id="usageContactNumbers"
                name="Notify SMS"
                label={"Notify SMS"}
                value={usageContactNumbers}
                placeholder={"Enter mobile number..."}
                required={false}
                type="number"
                fullWidth={true}
                onChange={(e) => setUsageContactNumbers(isNaN(parseInt(e.target.value)) ? "" : parseInt(e.target.value))}
              />
            </>
          ),
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
              <IconButton
              id="usage_analytics--usage_alertt--save"
                iconVariant="icomoon-save"
                style={{ padding: "0px 15px" }}
                onClick={handleSave}
                primary
              >
                Save
              </IconButton>
              <IconButton
              id="usage_analytics--usage_alertt--cancel"
                iconVariant="icomoon-close"
                style={{ padding: "0px 15px" }}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
    </UsagePieCard>
  );
};

export default UsageCard;

