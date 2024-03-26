import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Loader } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { CXDashboardActions } from "../../CXDashboard.actions";
import ChartWrapper from "../../Layouts/ChartWrapper";
import { transformInputData } from "../../Utils/helperFunction";

const WhatsappTrendHistogram = (props: any) => {
  const data = useTypedSelector(
    (state) => state.cxDashboardReducer?.whatsappSent?.data
  );
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState([]);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const whatsappSent = dynamicLabels["whatsappSent"] || "Whatsapp Sent";
  const whatsappDelivered = dynamicLabels["whatsappDelivered"] || "Whatsapp Delivered";
  const whatsappRead = dynamicLabels["whatsappRead"] || "Whatsapp Read";
  const {saveSvgAsPng} = props


  useEffect(() => {
    const whatsapphistogram = transformInputData(data, "whatsapp");
    setChartData(whatsapphistogram);
  }, [data]);

  const alertList =
    useTypedSelector(
      (state) => state.cxDashboardReducer?.dropdownOptions?.alertList
    ) || [];

  const tinyChartTitleList = [whatsappSent, whatsappDelivered, whatsappRead];
  const legendData = [
    {
      name: whatsappSent,
      value: 0,
      active: true,
      color: "#5698d3",
    },
    {
      name: whatsappDelivered,
      active: true,
      value: 0,
      color: "#9b4848",
    },
    {
      name: whatsappRead,
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

  const onChartChange = () => {};

  const handleSelectedRecords = (selectedArray) => {
    const alertMasterId = selectedArray.map((selected) => selected.value);
    dispatch({ type: "@@CXDashboard/SET_FILTER", payload: { alertMasterId } });
  };

  return Object.keys(chartData).length > 0 ? (
    <Grid item spacing="10px" lg={12}>
      <ChartWrapper
        id={"whatsapphistogram"}
        header={"Whatsapp Trend Chart"}
        xAxisLabel={{
          OVERALL: dynamicLabels["Date"] || "Date",
          BYSHIPPER: dynamicLabels["Shipper"] || "Shipper",
        }}
        yAxisLabel={{
          numbers: dynamicLabels["countOfWhatsapp"] || "Count of Whatsapp",
          percentage: dynamicLabels["countOfWhatsapp"] || "Count of Whatsapp",
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
    <Loader/>
  );
};

export default WhatsappTrendHistogram;
