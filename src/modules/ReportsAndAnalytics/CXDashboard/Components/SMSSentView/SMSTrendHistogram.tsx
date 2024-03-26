import React, { useEffect, useState } from "react";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { Grid, Loader, IMultiSelectOptions } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { CXDashboardActions } from "../../CXDashboard.actions";
import ChartWrapper from "../../Layouts/ChartWrapper";
import { transformInputData } from "../../Utils/helperFunction";
const SMSTrendHistogram = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.smsSent?.data
  );
  const {saveSvgAsPng} = props
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const alertList =
    useTypedSelector(
      (state) => state.cxDashboardReducer?.dropdownOptions?.alertList
    ) || [];
  useEffect(() => {
    if (data) {
      const smsHistogramData = transformInputData(data, "sms");
      setChartData(smsHistogramData);
    }
  }, [data]);

  const tinyChartTitleList = [
    dynamicLabels["smsSent"],
    dynamicLabels["smsDelivered"],
  ];
  const legendData = [
    {
      name: dynamicLabels["smsSent"] || "Sent",
      color: "#f05548",
      active: true,
      value: 0,
    },
    {
      name: dynamicLabels["smsDelivered"] || "Delivered",
      value: 0,
      color: "#5698d3",
      active: true,
    }
  ];
  const lineData = [{ smsSent: 50 }, { smsDelivered: 24 }];
  const tooltipData = ["KPI:", "Shipper: ", "Count: "];

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
        id={"smshistogram"}
        header={"SMS Trend Chart"}
        xAxisLabel={{
          OVERALL: dynamicLabels["Date"] || "Date",
          BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
        }}
        yAxisLabel={{
          numbers: dynamicLabels["countofSMS"] || "Count of SMS",
          percentage: dynamicLabels["countofSMS"] || "Count of SMS",
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

export default SMSTrendHistogram;
