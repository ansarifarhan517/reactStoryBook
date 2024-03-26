import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { Grid, Loader, Card, SectionHeader } from "ui-library";
import AverageFeedback from "./Feedback/AverageFeedback";
import Promotion from "./Promotion/Promotion";
import TotalFeedback from "./Feedback/TotalFeedback";
import { tActionDetailCard } from "../../CXDashboard.model";
import ChartWrapper from "../../Layouts/ChartWrapper";
import InfoCard from "../../Layouts/InfoCard";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { transformInputData } from "../../Utils/helperFunction";
import { useDispatch } from "react-redux";
import { CXDashboardActions } from "../../CXDashboard.actions";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
var _ = require("underscore");

const TrackingTrendHistogram = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink?.data
  );
  const feedbackhistogram = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink?.feedback.histogram.data
  );

  const promotionhistogram = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink?.promotions.histogram.data
  );

  const {saveSvgAsPng} = props
  const [chartData, setChartData] = useState({});
  const [selected, setSelected] = useState<tActionDetailCard>(
    "feedbackhistogram"
  );
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const dateFilter = useTypedSelector(
    (state) => state.cxDashboardReducer?.calendar
  );
  const branchId = useTypedSelector(
    (state) => state.cxDashboardReducer.filterOptions?.branchId
  );
  const subClientId = useTypedSelector(
    (state) => state.cxDashboardReducer.filterOptions?.subClientId
  );

  const groupBy = useTypedSelector(
    (state) => state.cxDashboardReducer?.groupBy
  );
  const cardData = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingCardDetails
  );
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const handleClick = async (id: tActionDetailCard) => {
    if (id !== selected) {
      dispatch({
        type: "@@CXDashboard/GET_CHART_DATA",
        payload: id as tActionDetailCard,
      });
      dispatch({
        type: "@@CXDashboard/GET_TAGCLOUD_DATA",
      });
      setTimeout(() => {
        setSelected(id);
      }, 200);
      console.log("callback called");
    }
    console.log("handle click");
  };

  const debouncedhandleClick = _.debounce(handleClick, 200);
  const SelectableCardDetails = useMemo(
    () => [
      {
        id: "promotionhistogram",
        text: cardData.noOfPromotions || "0",
        desc: dynamicLabels.promotions || "Promotion",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "promotionhistogram",
      },
      {
        id: "feedbackhistogram",
        text: (Number(cardData.avgRating)?.toFixed(1) || 0) + "/5",
        desc: dynamicLabels.averageFeedbackRating || "Average Feedback Rating",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "feedbackhistogram",
        rating: Number(cardData.avgRating)?.toFixed(0),
      },
      {
        id: "totalFeedback",
        text: cardData.totalFeedback || "0",
        desc: dynamicLabels.totalCustomerFeedback || "Total Customer Feedback",
        isSelectable: true,
        handleCallback: debouncedhandleClick,
        selected: selected === "totalFeedback",
      },
    ],
    [selected, cardData]
  );

  const tinyChartTitleList = useMemo(
    () => [
      dynamicLabels["totalTrackingLinkOpen"] || "Total Tracking Link Open",
      dynamicLabels["uniqueTrackingLinkOpen"] || "Unique Tracking Link Open",
    ],
    [dynamicLabels]
  );

  const legendData = useMemo(
    () => [
      {
        name:
          dynamicLabels["totalTrackingLinkOpen"] || "Total Tracking Link Open",
        color: "#5698d3",
        active: true,
        value: 0,
      },
      {
        name:
          dynamicLabels["uniqueTrackingLinkOpen"] ||
          "Unique Tracking Link Open",
        value: 0,
        color: "#f05548",
        active: true,
      },
    ],
    []
  );

  const lineData = useMemo(() => [{ avgPlanned: 50 }, { planned: 24 }], []);
  const tooltipData = ["KPI:", "Shipper: ", "Count: "];
  const onChartChange = () => {
    console.log("Active legend Data changed");
  };
  useEffect(() => {
    if (data) {
      const trackingLinkHistogram = transformInputData(data, "trackingLink");
      setChartData(trackingLinkHistogram);
    }
  }, [data]);
  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_CHART_DATA",
      payload: selected,
    });
    dispatch({
      type: "@@CXDashboard/GET_TRACKINGCARD_DATA",
      payload: "feedback",
    });
    dispatch({
      type: "@@CXDashboard/GET_TRACKINGCARD_DATA",
      payload: "promotion",
    });
  }, [dateFilter, groupBy, branchId, subClientId]);

  return Object.keys(chartData).length > 0 ? (
    <>
      <Grid item spacing="10px" lg={12}>
        <ChartWrapper
          id={"trackinglinkhistogram"}
          header={"Tracking Link Trend"}
          xAxisLabel={{
            OVERALL: dynamicLabels["Date"] || "Date",
            BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
          }}
          yAxisLabel={{
            numbers: dynamicLabels["countofLinksOpen"] || "Count of Links Open",
            percentage:
              dynamicLabels["percentofLinksOpen"] || "Percentage of Links Open",
          }}
          data={chartData}
          onChartChange={onChartChange}
          lineData={lineData}
          legendData={legendData}
          tinyChartTitleList={tinyChartTitleList}
          tooltipData={tooltipData}
          saveSvgAsPng= {saveSvgAsPng}
          pageName ={'trackinglinkhistogram'}
        />
      </Grid>
      <>
        {SelectableCardDetails.map((card) => {
          return (
            <Grid item spacing="10px" md={4} key={card.id}>
              <InfoCard
                id={card.id as tActionDetailCard}
                text={card.text}
                desc={card.desc}
                isSelectable={card.isSelectable}
                handleCallback={card.handleCallback}
                selected={card.selected}
                displayRating={
                  card.id === "feedbackhistogram" ? card.rating : undefined
                }
              />
            </Grid>
          );
        })}
        {selected === "feedbackhistogram" && <AverageFeedback saveSvgAsPng={saveSvgAsPng} />}
        {selected === "promotionhistogram" && <Promotion saveSvgAsPng={saveSvgAsPng} />}
        {selected === "totalFeedback" && <TotalFeedback saveSvgAsPng={saveSvgAsPng} />}
      </>
    </>
  ) : (
    <Grid item spacing="10px" lg={12}>
      <Card style={{ height: "330px" }}>
        <Loader center fadeBackground></Loader>
      </Card>
    </Grid>
  );
};

export default TrackingTrendHistogram;
