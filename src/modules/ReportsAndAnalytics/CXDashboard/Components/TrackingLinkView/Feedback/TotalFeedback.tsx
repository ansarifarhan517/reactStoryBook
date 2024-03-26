import React, { useEffect, useState } from "react";
import { Grid, Loader, Card, SectionHeader } from "ui-library";
import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../common/DynamicLabels/useDynamicLabels";
import ChartWrapper from "../../../Layouts/ChartWrapper";
import { transformInputData } from "../../../Utils/helperFunction";
import FeedbackListView from "./FeedbackListView";
// import SimpleCloud from "./TagCloud";

const TotalFeedback = (props :any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink.feedback.histogram.data
  );
  const [chartData, setChartData] = useState({});
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const feedbackCount = dynamicLabels["feedbackCount"] || "Feedback Count";
  const tinyChartTitleList = [feedbackCount];
  const {saveSvgAsPng} = props;

  const legendData = [
    { name: feedbackCount, value: 0, active: true, color: "#5698d3" },
  ];
  const lineData = [{ avgPlanned: 50 }, { planned: 24 }];
  const tooltipData = ["KPI:", feedbackCount];
  const onChartChange = () => {
    console.log("Active legend Data changed");
  };
  useEffect(() => {
    console.log("Active Use Effect Tracking URL Histogram");
    if (data) {
      const trackingLinkHistogram = transformInputData(data, "totalFeedback");
      setChartData(trackingLinkHistogram);
    }
  }, [data]);

  return Object.keys(chartData).length > 0 ? (
    <>
      <Grid item spacing="10px" lg={12}>
        <ChartWrapper
          id={"totalFeedback"}
          header={"Total Feedback"}
          xAxisLabel={{
            OVERALL: dynamicLabels["Date"] || "Date",
            BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
          }}
          yAxisLabel={{
            numbers: dynamicLabels["countOfFeedback"] || "Count of Feedback",
            percentage: dynamicLabels["countOfFeedback"] || "Count of Feedback",
          }}
          data={chartData}
          onChartChange={onChartChange}
          lineData={lineData}
          legendData={legendData}
          tinyChartTitleList={tinyChartTitleList}
          tooltipData={tooltipData}
          saveSvgAsPng = {saveSvgAsPng}
        />
      </Grid>
      <FeedbackListView />
      {/* <SimpleCloud></SimpleCloud> */}
    </>
  ) : (
    <Grid item spacing="10px" lg={12}>
      <Card style={{ height: "400px" }}>
        <Loader center fadeBackground></Loader>
      </Card>
    </Grid>
  );
};

export default TotalFeedback;
