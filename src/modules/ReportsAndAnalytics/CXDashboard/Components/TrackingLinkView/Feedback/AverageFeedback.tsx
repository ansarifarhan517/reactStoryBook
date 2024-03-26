import React, { useEffect, useMemo, useState } from "react";
import { Grid, Loader, Card, SectionHeader } from "ui-library";
import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../common/DynamicLabels/useDynamicLabels";
import ChartWrapper from "../../../Layouts/ChartWrapper";
import { transformInputData } from "../../../Utils/helperFunction";
import FeedbackListView from "./FeedbackListView";

const AverageFeedback = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink.feedback.histogram.data
  );

  const {saveSvgAsPng} = props;
  const [chartData, setChartData] = useState({});
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const overallRating = dynamicLabels["overallRating"] || "Overall";
  const foodRating = dynamicLabels["foodRating"] || "Food";
  const productRating = dynamicLabels["productRating"] || "Product";
  const packagingRating = dynamicLabels["packagingRating"] || "Packaging";
  const trackingRating = dynamicLabels["trackingRating"] || "Tracking";
  const deliveryRating = dynamicLabels["deliveryRating"] || "Delivery";
  const orderingRating = dynamicLabels["orderingRating"] || "Ordering";
  const supportRating = dynamicLabels["supportRating"] || "Support";
  // const avgRating = dynamicLabels["avgRating"] || "Average";

  const feedbackList = [
    { label: overallRating, value: overallRating },
    { label: foodRating, value: foodRating },
    { label: productRating, value: productRating },
    { label: packagingRating, value: packagingRating },
    { label: trackingRating, value: trackingRating },
    { label: deliveryRating, value: deliveryRating },
    { label: orderingRating, value: orderingRating },
    { label: supportRating, value: supportRating },
    // { label: avgRating, value: avgRating },
  ];

  let tinyChartTitleList = useMemo(
    () => [
      overallRating,
      foodRating,
      productRating,
      packagingRating,
      trackingRating,
      deliveryRating,
      orderingRating,
      supportRating,
      // avgRating,
    ],
    [feedbackList]
  );

  let legendList = useMemo(
    () => [
      { name: overallRating, value: 0, active: true, color: "#006279" },
      { name: foodRating, value: 0, active: true, color: "#9b4848" },
      { name: productRating, value: 0, active: true, color: "#f05548" },
      { name: packagingRating, value: 0, active: true, color: "#f0ad48" },
      { name: trackingRating, value: 0, active: true, color: "#5238d3" },
      { name: deliveryRating, value: 0, active: true, color: "#f55d48" },
      { name: orderingRating, value: 0, active: true, color: "#345548" },
      { name: supportRating, value: 0, active: true, color: "#1198d3" },
      // { name: avgRating, value: 0, active: true, color: "#886279" },
    ],
    []
  );
  let [legendData, setLegends] = useState(() => [
    { name: overallRating, value: 0, active: true, color: "#006279" },
    { name: foodRating, value: 0, active: true, color: "#9b4848" },
    { name: productRating, value: 0, active: true, color: "#f05548" },
    { name: packagingRating, value: 0, active: true, color: "#f0ad48" },
    { name: trackingRating, value: 0, active: true, color: "#5238d3" },
    { name: deliveryRating, value: 0, active: true, color: "#f55d48" },
    { name: orderingRating, value: 0, active: true, color: "#345548" },
    { name: supportRating, value: 0, active: true, color: "#1198d3" },
    // { name: avgRating, value: 0, active: true, color: "#886279" },
  ]);
  const lineData = [{ avgPlanned: 50 }, { planned: 24 }];
  let tooltipData = useMemo(
    () => [
      overallRating,
      foodRating,
      productRating,
      packagingRating,
      trackingRating,
      deliveryRating,
      orderingRating,
      supportRating,
      // avgRating,
    ],
    [feedbackList]
  );
  const onChartChange = () => {
    console.log("Active legend Data changed");
  };
  useEffect(() => {
    console.log("Active Use Effect Tracking URL Histogram");
    if (data) {
      const trackingLinkHistogram = transformInputData(
        data,
        "feedbackhistogram"
      );
      setChartData(trackingLinkHistogram);
    }
  }, [data]);
  const handleSelectedRecords = (selectedArray) => {
    const selectedRowsSetter = new Set(selectedArray.map((a) => a.label));
    setLegends(legendList.filter((data) => selectedRowsSetter.has(data.name)));
    tinyChartTitleList = tinyChartTitleList.filter((data) =>
      selectedRowsSetter.has(data)
    );
    tooltipData = tooltipData.filter((data) => selectedRowsSetter.has(data));
  };

  return Object.keys(chartData).length > 0 ? (
    <>
      <Grid item spacing="10px" lg={12}>
        <ChartWrapper
          id={"totalFeedback"}
          header={"Feedback Trend"}
          xAxisLabel={{
            OVERALL: dynamicLabels["Date"] || "Date",
            BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
          }}
          yAxisLabel={{
            numbers: dynamicLabels["Rating"] || "Rating",
            percentage: dynamicLabels["Rating"] || "Rating",
          }}
          data={chartData}
          onChartChange={onChartChange}
          lineData={lineData}
          legendData={legendData}
          tinyChartTitleList={tinyChartTitleList}
          tooltipData={tooltipData}
          showMultiselect
          handleSelectedRecords={handleSelectedRecords}
          optionsList={feedbackList}
          saveSvgAsPng={saveSvgAsPng}
          pageName='average_feedback'
        />
      </Grid>
    </>
  ) : (
    <Grid item spacing="10px" lg={12}>
      <Card style={{ height: "400px" }}>
        <Loader center fadeBackground></Loader>
      </Card>
    </Grid>
  );
};

export default AverageFeedback;
