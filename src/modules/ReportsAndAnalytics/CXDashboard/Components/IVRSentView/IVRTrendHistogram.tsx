import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Loader } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { CXDashboardActions } from "../../CXDashboard.actions";
import ChartWrapper from "../../Layouts/ChartWrapper";
import { transformInputData } from "../../Utils/helperFunction";

const IVRTrendHistogram = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.ivrSent?.data
  );
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const alertList =
    useTypedSelector(
      (state) => state.cxDashboardReducer?.dropdownOptions?.alertList
    ) || [];
  const ivrAnswered = dynamicLabels["ivrAnswered"] || "Answered";
  const ivrSent = dynamicLabels["ivrSent"] || "Sent";
  const tinyChartTitleList = [ivrAnswered, ivrSent];
  const {saveSvgAsPng} = props

  const legendData = [
    {
      name: ivrSent,
      color: "#f05548",
      active: true,
      value: 0,
    },
    {
      name: ivrAnswered,
      value: 0,
      color: "#5698d3",
      active: true,
    }
  ];
  const lineData = [{ avgPlanned: 50 }, { planned: 24 }];
  const tooltipData = ["KPI:", "Shipper: ", "Count: "];

  useEffect(() => {
    console.log("Active Use Effect IVR Histogram");
    if (data) {
      const ivrHistogram = transformInputData(data, "ivr");
      setChartData(ivrHistogram);
    }
  }, [data]);

  useEffect(() => {
    const temp: any = [];
    alertList.forEach((a) => {
      temp.push({
        label: a.name,
        value: a.alertMasterId,
      });
    });
    setOptions(temp);
  }, [alertList]);

  const onChartChange = () => {
    console.log("Active legend Data changed");
  };
  const handleSelectedRecords = (selectedArray) => {
    const alertMasterId = selectedArray.map((selected) => selected.value);
    dispatch({ type: "@@CXDashboard/SET_FILTER", payload: { alertMasterId } });
  };

  return Object.keys(chartData).length > 0 ? (
    <Grid item spacing="10px" lg={12}>
      <ChartWrapper
        id={"ivrhistogram"}
        header={"IVR Trend Chart"}
        xAxisLabel={{
          OVERALL: dynamicLabels["Date"] || "Date",
          BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
        }}
        yAxisLabel={{
          numbers: dynamicLabels["countOfIVR"] || "Count of IVR",
          percentage: dynamicLabels["countOfIVR"] || "Count of IVR",
        }}
        data={chartData}
        onChartChange={onChartChange}
        lineData={lineData}
        legendData={legendData}
        tinyChartTitleList={tinyChartTitleList}
        tooltipData={tooltipData}
        showMultiselect
        handleSelectedRecords={handleSelectedRecords}
        optionsList={options}
        saveSvgAsPng={saveSvgAsPng}
      />
    </Grid>
  ) : (
    <Loader></Loader>
  );
};

export default IVRTrendHistogram;
