import React, { useEffect, useState } from "react";
import { Grid, Card, Loader } from "ui-library";
import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../common/DynamicLabels/useDynamicLabels";
import ChartWrapper from "../../../Layouts/ChartWrapper";
import { transformInputData } from "../../../Utils/helperFunction";
import PromotionsListView from "./PromotionListView";
const Promotion = (props : any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink.promotions.histogram.data
  );
  const [chartData, setChartData] = useState({});
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const promotionView = dynamicLabels["promotionView"] || "View";
  const promotionClick = dynamicLabels["promotionClick"] || "Click";
  const tinyChartTitleList = ["promotionView", "promotionClick"];
   const {saveSvgAsPng} = props;

  const legendData = [
    { name: promotionView, value: 0, active: true, color: "#5698d3" },
    { name: promotionClick, value: 0, active: true, color: "#f05548" },
  ];
  const lineData = [{ avgPlanned: 50 }, { planned: 24 }];
  const tooltipData = ["KPI:", promotionView, promotionClick];
  const onChartChange = () => {
    console.log("Active legend Data changed");
  };
  useEffect(() => {
    console.log("Active Use Effect Promotions Histogram");
    if (data) {
      const trackingLinkHistogram = transformInputData(data, "promotions");
      setChartData(trackingLinkHistogram);
    }
  }, [data]);

  return Object.keys(chartData).length > 0 ? (
    <>
      <Grid item spacing="10px" lg={12}>
        <ChartWrapper
          id={"promotionhistogram"}
          header={"Promotions"}
          xAxisLabel={{
            OVERALL: dynamicLabels["Date"] || "Date",
            BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
          }}
          yAxisLabel={{
            numbers:
              dynamicLabels["countOfImpressions"] || "Count",
            percentage:
              dynamicLabels["countOfImpressions"] || "Count",
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
      <PromotionsListView />
    </>
  ) : (
    <Grid item spacing="10px" lg={12}>
      <Card style={{ height: "400px" }}>
        <Loader center fadeBackground></Loader>
      </Card>
    </Grid>
  );
};

export default Promotion;
