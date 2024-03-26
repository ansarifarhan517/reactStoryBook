import React, { Dispatch, useMemo, useState, useEffect } from "react";
import { Box, Grid } from "ui-library";
import { tActionCard } from "../CXDashboard.model";
import InfoCard from "./InfoCard";
import SMSTrendHistogram from "../Components/SMSSentView/SMSTrendHistogram";
import IVRTrendHistogram from "../Components/IVRSentView/IVRTrendHistogram";
import EmailTrendHistogram from "../Components/EmailSentView/EmailTrendHistogram";
import TrackingTrendHistogram from "../Components/TrackingLinkView/TrackingTrendHistogram";
import { useDispatch } from "react-redux";
import { CXDashboardActions } from "../CXDashboard.actions";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import WhatsappTrendHistogram from "../Components/WhatsappSentView/WhatsappTrendHistogram";

var _ = require("underscore");

const StaticLayout = (props: any) => {
  const [selected, setSelected] = useState<tActionCard>(
    "trackinglinkhistogram"
  );

  const {saveSvgAsPng} = props
 
  const cardDetails = useTypedSelector(
    (state) => state.cxDashboardReducer?.cardData
  );
  const dateFilter = useTypedSelector(
    (state) => state.cxDashboardReducer?.calendar
  );
  const branchId = useTypedSelector(
    (state) => state.cxDashboardReducer?.filterOptions?.branchId
  );
  const subClientId = useTypedSelector(
    (state) => state.cxDashboardReducer?.filterOptions?.subClientId
  );
  const alertMasterId = useTypedSelector(
    (state) => state.cxDashboardReducer?.filterOptions?.alertMasterId
  );

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);

  const groupBy = useTypedSelector((state) => state.cxDashboardReducer.groupBy);
  const alertList = useTypedSelector(
    (state) => state.cxDashboardReducer.dropdownOptions.alertList
  );
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_CHART_DATA",
      payload: selected,
    });
    if (selected === "trackinglinkhistogram") {
      // dispatch({
      //   type: "@@CXDashboard/GET_CARD_DATA",
      //   payload: "feedback",
      // });
      // dispatch({
      //   type: "@@CXDashboard/GET_CARD_DATA",
      //   payload: "promotion",
      // });
    } else {
      if (!(alertList && alertList.length > 0)) {
        dispatch({ type: "@@CXDashboard/GET_ALERTLIST_DATA" });
      }
    }
  }, [dateFilter, groupBy, branchId, subClientId, alertMasterId]);
  const handleClick = async (id: tActionCard) => {
    if (id !== selected) {
      await dispatch({
        type: "@@CXDashboard/SET_FILTER",
        payload: {
          alertMasterId: [],
        },
      });
      dispatch({
        type: "@@CXDashboard/GET_CHART_DATA",
        payload: id as tActionCard,
      });
      // if (id === "trackinglinkhistogram") {
      //   dispatch({
      //     type: "@@CXDashboard/GET_CARD_DATA",
      //     payload: "feedback",
      //   });
      //   dispatch({
      //     type: "@@CXDashboard/GET_CARD_DATA",
      //     payload: "promotion",
      //   });
      // }
      if (!(alertList && alertList.length > 0)) {
        console.log("StaticLayout.tsx", alertList);
        dispatch({ type: "@@CXDashboard/GET_ALERTLIST_DATA" });
      }
      setTimeout(() => {
        setSelected(id);
      }, 200);
      console.log("callback called");
    }
  };

  const debouncedhandleClick = _.debounce(handleClick, 200);
  const SelectableCardDetails = useMemo(
    () => [
      {
        id: "trackinglinkhistogram",
        text: cardDetails.trackingLinkOpen || "0",
        desc: dynamicLabels.trackingLinkOpen || "Tracking Link Open",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "trackinglinkhistogram",
      },
      {
        id: "smshistogram",
        text: cardDetails.smsSent || "0",
        desc: dynamicLabels.smsSent || "SMS Sent",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "smshistogram",
      },
      {
        id: "ivrhistogram",
        text: cardDetails.ivrSent || "0",
        desc: dynamicLabels.ivrSent || "IVR Sent",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "ivrhistogram",
      },
      {
        id: "emailhistogram",
        text: cardDetails.emailSent || "0",
        desc: dynamicLabels.emailSent || "Email Sent",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "emailhistogram",
      },
      {
        id: "whatsapphistogram",
        text: cardDetails?.whatsappSent || "0",
        desc: dynamicLabels.whatsappSent || "Whatsapp Sent",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "whatsapphistogram",
      },
    ],
    [selected, cardDetails]
  );

  return (
    <Box style={{ margin: "15px" }}>
      <Grid container spacing="5px">
        <Grid item spacing="5px" sm={6} style={{ width: "100%" }}>
          <InfoCard
            percentage={cardDetails.orderCreatedTrend || "0"}
            text={cardDetails.orderCreated || "0"}
            desc={dynamicLabels.ordersCreated || "Orders Created"}
          />
        </Grid>
        <Grid item spacing="5px"  sm={6}>
          <InfoCard
            percentage={cardDetails.customerCreatedTrend || "0"}
            text={
              cardDetails.customer || "0"
            }
            desc={dynamicLabels.customers || "Customers"}
          />
        </Grid>
        {SelectableCardDetails.map((card) => {
          return (
            <Grid item spacing="5px" xl={2} key={card.id}>
              <InfoCard
                id={card.id as tActionCard}
                text={card.text}
                desc={card.desc}
                isSelectable={card.isSelectable}
                handleCallback={card.handleCallback}
                selected={card.selected}
              />
            </Grid>
          );
        })}
        {selected === "trackinglinkhistogram" && <TrackingTrendHistogram  saveSvgAsPng={saveSvgAsPng}/>}
        {selected === "smshistogram" && <SMSTrendHistogram saveSvgAsPng={saveSvgAsPng} />}
        {selected === "ivrhistogram" && <IVRTrendHistogram saveSvgAsPng={saveSvgAsPng} />}
        {selected === "emailhistogram" && <EmailTrendHistogram saveSvgAsPng={saveSvgAsPng}/>}
        {selected === "whatsapphistogram" && <WhatsappTrendHistogram saveSvgAsPng={saveSvgAsPng}/>}

      </Grid>
    </Box>
  );
};

export default StaticLayout;
