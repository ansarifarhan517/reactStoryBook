import React, { ReactElement } from "react";
import { BarChart, LineChart, Loader } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IChartCardProps } from "../CXDashboard.model";

function ChartCard({
  id,
  data,
  dataType,
  mode,
  legendData,
  lineData,
  onChartChange,
  tinyChartTitleList,
  xAxisLabel,
  yAxisLabel,
  tooltipData,
}: IChartCardProps): ReactElement {
  const histogramMapper = {
    OVERALL_PERCENTAGE: "overallPerc",
    OVERALL_NUMBERS: "overallCount",
    BYSHIPPER_PERCENTAGE: "byShipperPerc",
    BYSHIPPER_NUMBERS: "byShipperCount",
  };
  const loading = useTypedSelector(
    (state) => state.cxDashboardReducer.loading.COUNTHISTOGRAM
  );
  const labelData:any = {
    viewBox : {
      x : -20,
      y : 5,
      width : 100,
      height : 150
    }
  }
  const magnifyStartIndex=data[histogramMapper["OVERALL_" + dataType.toUpperCase()]].length>15 ? data[histogramMapper["OVERALL_" + dataType.toUpperCase()]].length-15 : 0
  const magnifyEndIndex=data[histogramMapper["BYSHIPPER_" + dataType.toUpperCase()]].length>10 ? 9 : data[histogramMapper["BYSHIPPER_" + dataType.toUpperCase()]].length-1 
  return (
    <>
      {loading ? (
        <div style={{ height: "330px" }}>
          <Loader center={true} fadeBackground={true} speed={1} />
        </div>
      ) : mode === "BYSHIPPER" ? (
        <BarChart
          details={data[histogramMapper["BYSHIPPER_" + dataType.toUpperCase()]]}
          barGap={0}
          labelAngle={-30}
          showXaxis={true}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          legendData={legendData}
          lineData={lineData}
          showYaxis={true}
          height={330}
          toolTipVariant={"withKpi"}
          onChange={onChartChange}
          tinyChartData={
            data[histogramMapper["BYSHIPPER_" + dataType.toUpperCase()]]
          }
          convertoPercent={dataType.toUpperCase() === "PERCENTAGE"}
          tinyChartTitleList={tinyChartTitleList}
          tinyChartLabelAngle={330}
          showTinyChart={
            data[histogramMapper["BYSHIPPER_" + dataType.toUpperCase()]]?.length
              ? true
              : false
          }
          disableClick
          tooltipTitleList={tooltipData}
          magnifierEndIndex={magnifyEndIndex}
          legendFullwidth
          tooltipWidth={300}
          _ticks={
            id === "totalFeedback" && dataType.toUpperCase() !== "PERCENTAGE"
              ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
              : undefined
          }
          domain={
            id === "totalFeedback" && dataType.toUpperCase() !== "PERCENTAGE"
              ? [0, 5]
              : undefined
          }
          yAxisLabelData = {labelData}
        />
      ) : (
        <LineChart
          details={data[histogramMapper["OVERALL_" + dataType.toUpperCase()]]}
          labelAngle={-30}
          showXaxis={true}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          legendData={legendData}
          showYaxis={true}
          height={330}
          onChange={onChartChange}
          showTinyChart={true}
          startWithXaxis={true}
          tickInPercentage={false}
          legendFullwidth
          _ticks={
            id === "totalFeedback" && dataType.toUpperCase() !== "PERCENTAGE"
              ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
              : undefined
          }
          convertoPercent={dataType.toUpperCase() === "PERCENTAGE"}
          domain={
            id === "totalFeedback" && dataType.toUpperCase() !== "PERCENTAGE"
              ? [0, 5]
              : undefined
          }
          yAxisLabelData = {labelData}
          magnifierStartIndex={magnifyStartIndex}
        />
      )}
    </>
  );
}

export default ChartCard;
