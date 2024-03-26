import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Loader } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { CXDashboardActions } from "../../CXDashboard.actions";
import ChartWrapper from "../../Layouts/ChartWrapper";
import { transformInputData } from "../../Utils/helperFunction";

const EmailTrendHistogram = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.emailSent?.data
  );
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const emailSent = dynamicLabels["emailSent"] || "Sent";
  const emailDelivered = dynamicLabels["emailDelivered"] || "Delivered";
  const emailBounced = dynamicLabels["emailBounced"] || "Bounced";
  const {saveSvgAsPng} = props


  useEffect(() => {
    const emailHistogram = transformInputData(data, "email");
    setChartData(emailHistogram);
  }, [data]);
  const alertList =
    useTypedSelector(
      (state) => state.cxDashboardReducer?.dropdownOptions?.alertList
    ) || [];

  const tinyChartTitleList = [emailSent, emailDelivered, emailBounced];
  const legendData = [
    {
      name: emailSent,
      value: 0,
      active: true,
      color: "#5698d3",
    },
    {
      name: emailDelivered,
      active: true,
      value: 0,
      color: "#9b4848",
    },
    {
      name: emailBounced,
      active: true,
      value: 0,
      color: "#f05548",
    },
  ];
  const lineData = [{ avgPlanned: 50 }, { planned: 24 }];
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
        id={"emailhistogram"}
        header={"Email Trend Chart"}
        xAxisLabel={{
          OVERALL: dynamicLabels["Date"] || "Date",
          BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
        }}
        yAxisLabel={{
          numbers: dynamicLabels["countOfEmail"] || "Count of Email",
          percentage: dynamicLabels["countOfEmail"] || "Count of Email",
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

export default EmailTrendHistogram;
