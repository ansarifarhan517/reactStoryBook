import moment from "moment";
import React, { Dispatch, useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Brush,
  Line,
  BarChart,
} from "recharts";
// import { Box, Grid } from 'ui-library';
import axios from "../../../../utils/axios";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import ChartContainerHeader from "./ChartContainerHeader";
import {
  ChartWrapper,
  LegendIcon,
  LegendIconLine,
} from "./../../AdminDashboard.styled.component";
import { useDispatch } from "react-redux";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import OrderUsage from "./ChartTooltip/OrderUsage";
import AllMileOrderUsage from "./ChartTooltip/AllMileOrderUsage";
import UserUsage from "./ChartTooltip/UserUsage";
import { abbreviateNumber } from "./ChartTooltip/NumberUtil";
const chartColors = [
  "#5698d3",
  "#f0ad48",
  "#f05548",
  "#48979b",
  "#b24dd9",
  "#9b4848",
];
const ChartContainer = ({region}) => {
  const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const originalChartData = useTypedSelector(
    (state) => state.adminDashboard.adminDashboard.noUsage.chartData
  );
  const [chartData, setChartData] = useState<any>([]);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [brushIndex, setBrushIndex] = useState({ startIndex: 0, endIndex: 3 });
  const [chartDataKeys, setChartDataKeys] = useState<any>([]);
  const usageMode = useTypedSelector(
    (state) => state.adminDashboard.adminDashboard.noUsage.usageMode
  );
  const dateRange = useTypedSelector(
    (state) => state.adminDashboard.adminDashboard.noUsage.dateRange
  );
  const [showMagnifier, setShowMagnifier] = useState(false);
  // const clientIds = useTypedSelector(state=>state.adminDashboard.adminDashboard.tabData.clientIds);
  const removedLegends = useTypedSelector(
    (state) => state.adminDashboard.adminDashboard.noUsage.removedLegends
  );
  const tickFormatter = (value: string) => {
    const limit = 25; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0,limit)}...`;
  };

  const yAxisTickFormatter = (value : any) => {
      return `${abbreviateNumber(value)}`
  }

  const prevDateRange = React.useMemo(() => {
    const diffDays = Math.round(
      (dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24)
    );
    return {
      startDate: moment(dateRange.startDate)
        .startOf("day")
        .subtract(diffDays > 1 ? diffDays - 1 : diffDays, "days")
        .toDate(),
      endDate: dateRange.startDate,
    };
  }, [dateRange.startDate]);
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const format = clientProperties?.DATEFORMAT?.propertyValue
    ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
    : "DD-MM-YYYY";
  const dateFormatting = `${moment(dateRange.startDate).format(
    `${format}`
  )} - ${moment(dateRange.endDate).format(`${format}`)}`;
  const dateFormatting1 = `${moment(prevDateRange?.startDate).format(
    `${format}`
  )} - ${moment(prevDateRange.endDate).format(`${format}`)}`;
  const getData = async () => {
    setChartDataLoading(true);
    const data = await axios.post(
      // "/ReportingApp/internalUser/analytics/usage/histogram" + "?region=" + region,
      "/ReportingApp/internalUser/analytics/usage/histogram",
      { usageMode: usageMode, from: dateRange.startDate, to: dateRange.endDate }
    );

    const prevData = await axios.post(
      "/ReportingApp/internalUser/analytics/usage/histogram",
      {
        usageMode: usageMode,
        from: prevDateRange.startDate,
        to: prevDateRange.endDate,
      }
    );

    if (Object.keys(data.data.data.clientDataMap).length > 5) {
      setShowMagnifier(true);
    }
    if (
      Object.keys(data.data.data.productUsage).length ||
      Object.keys(prevData.data.data.productUsage).length ||
      data.data.data.productUsage
    ) {
      setChartDataLoading(false);
    }
    const finalData = Object.values(data.data.data.productUsage).map(
      (value: any) => {
        let temp = {};
        for (let i = 0; i < prevData.data.data.usageKeys.length; i++) {
          temp[prevData.data.data.usageKeys[i] + "_line"] =
            prevData.data.data.productUsage["_" + value.clientId][
              prevData.data.data.usageKeys[i]
            ];
        }
        let newValue = { ...value, ...temp };
        return newValue;
      }
    );

    dispatch({
      type: "@@adminDashboard/CLIENT_ACTICITY/SET_CHART_DATA",
      payload: finalData,
    });
    setChartData(finalData);
    setChartDataKeys(data.data.data.usageKeys);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "@@adminDashboard/CLIENT_ACTICITY/SET_CHART_DATA",
        payload: null,
      });
      dispatch({
        type: "@@adminDashboard/SET_USAGE_MODE",
        payload: "ORDERUSAGE",
      });
    };
  }, []);
  useEffect(() => {
    getData();
  }, [usageMode, dateRange.startDate]);
  useEffect(() => {
    if (originalChartData) {
      const data = originalChartData.map((value: any) => {
        let testObj = { ...value };
        for (let i = 0; i < removedLegends.length; i++) {
          delete testObj[removedLegends[i]];
        }
        return testObj;
      });
      setChartData(data);
    }
  }, [removedLegends]);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active) {
      switch (usageMode) {
        case "ORDERUSAGE":
          return (
            <OrderUsage
              payload={payload}
              chartDataKeys={chartDataKeys}
              dateRange={dateRange}
              prevDateRange={prevDateRange}
              label={label}
            ></OrderUsage>
          );

        case "USERUSAGE":
          return (
            <UserUsage
              payload={payload}
              chartDataKeys={chartDataKeys}
              dateRange={dateRange}
              prevDateRange={prevDateRange}
              label={label}
            ></UserUsage>
          );

        default:
          return (
            <AllMileOrderUsage
              payload={payload}
              chartDataKeys={chartDataKeys}
              dateRange={dateRange}
              prevDateRange={prevDateRange}
              label={label}
            ></AllMileOrderUsage>
          );
      }
    }

    return null;
  };
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul style={{ textAlign: "right", marginBottom: "10px" }}>
        {payload
          .filter((entry: any) => {
            return chartDataKeys.includes(entry.dataKey);
          })
          .map((entry: any, index: any) => (
            <li
              style={{ display: "inline-block", margin: "10px" }}
              key={`item-${index}`}
            >
              <LegendIcon
                data-enable="true"
                onClick={(e) => legendClick(e, entry, "bar")}
                style={{
                  background: entry.color,
                  border: `2px solid ${entry.color}`,
                }}
              ></LegendIcon>
              {usageMode !== "USERUSAGE" && (
                <LegendIconLine
                  data-enable="true"
                  onClick={(e) => legendClick(e, entry, "line")}
                  background={entry.color}
                  style={{
                    background: entry.color,
                    border: `2px solid ${entry.color}`,
                  }}
                ></LegendIconLine>
              )}
              {dynamicLabels[entry.value] || entry.value}
            </li>
          ))}
      </ul>
    );
  };
  const legendClick = (e: any, payload: any, type: string) => {
    if (e.target.dataset.enable === "true") {
      e.target.dataset.enable = "false";
      e.target.style.background = "#fff";
      console.log(type, payload);
      // removedLegends.push(type==='line'? payload.dataKey+'_line': payload.dataKey);
      dispatch({
        type: "@@adminDashboard/CLIENT_ACTICITY/SET_REMOVE_LEGENDS",
        payload: [
          ...removedLegends,
          type === "line" ? payload.dataKey + "_line" : payload.dataKey,
        ],
      });
    } else {
      e.target.dataset.enable = "true";
      e.target.style.background = payload.color;
      let newList = removedLegends.filter((value: string) => {
        console.log(value, payload.dataKey);
        return (
          value !==
          (type === "line" ? payload.dataKey + "_line" : payload.dataKey)
        );
      });
      dispatch({
        type: "@@adminDashboard/CLIENT_ACTICITY/SET_REMOVE_LEGENDS",
        payload: newList,
      });
    }
  };
  return (
    <>
      <ChartWrapper>
        <ChartContainerHeader></ChartContainerHeader>
        {!chartDataLoading ? (
          <ComposedChart
            width={1350}
            height={700}
            data={chartData}
            margin={{
              top: 20,
              right: 0,
              bottom: 20,
              left: 20,
            }}
            barGap={0}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="clientName"
              height={200}
              width={200}
              angle={280}
              interval={0}
              dy={75}
              tickFormatter={tickFormatter}
              // label={{ value: "Clients", position: "centerBottom", offset: -10 }}
            >
              <Label
                value="Clients"
                offset={-10}
                position="outside"
                fontWeight={500}
                fontSize={14}
                dy={80}
              />
            </XAxis>
            <YAxis
              width={20}
              yAxisId="left"
              tick={{ fontSize: 15 }}
              axisLine={false}
              tickFormatter={yAxisTickFormatter}
            >
              <Label
                value={"Count Of Orders (" + dateFormatting + ")"}
                angle={-90}
                position="inside"
                fontSize={14}
                fontWeight={500}
                // fontStyle="italic"
              />
            </YAxis>
            <YAxis
              width={80}
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={yAxisTickFormatter}
            >
              <Label
                value={`Count Of Orders (${dateFormatting1})`}
                angle={-90}
                position="inside"
                fontSize={14}
                fontWeight={500}
                // fontStyle="italic"
              />
            </YAxis>

            <YAxis
              label={{ value: "", angle: -90, position: "insideTopRight" }}
              tickFormatter={yAxisTickFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Tooltip /> */}
            <Legend
              verticalAlign="top"
              align="right"
              content={renderLegend}
              onClick={(value, entry, index) => {
                console.log(value, entry, index);
              }}
            />
            {/* <Legend></Legend> */}
            {/* <Brush onChange={(value)=>{
                console.log(value);
              }} dataKey="clientName" startIndex={0} endIndex={3} height={30} stroke="#8884d8" > */}
            {showMagnifier && (
              <Brush
                height={50}
                fill="rgba(0, 0, 0, 0)"
                stroke="rgba(0, 0, 0, 0.24)"
                dataKey="clientName"
                data={chartData}
                onChange={(index) => {
                  setBrushIndex(index);
                }}
                startIndex={brushIndex.startIndex}
                endIndex={brushIndex.endIndex}
              >
                <BarChart data={chartData} barCategoryGap={-20}>
                  <XAxis
                    dataKey="clientName"
                    padding={{ left: 0, right: 0 }}
                    interval={0}
                    width={50}
                    height={10}
                    tick={false}
                    dx={0}
                  />

                  {chartDataKeys.map((key: string, index: any) => {
                    return (
                      <Bar
                        dataKey={key}
                        barSize={15}
                        fill={chartColors[index]}
                      />
                    );
                  })}
                </BarChart>
              </Brush>
            )}

            {chartDataKeys.map((key: string, index: any) => {
              return (
                <Bar dataKey={key} barSize={15} fill={chartColors[index]} />
              );
            })}

            {usageMode !== "USERUSAGE" &&
              chartDataKeys.map((key: string, index: any) => {
                return (
                  <Line
                    dataKey={key + "_line"}
                    type="linear"
                    stroke={chartColors[index]}
                  ></Line>
                );
              })}
          </ComposedChart>
        ) : (
          <div
            id="loader"
            style={{
              zIndex: 1,
              display: "flex",
              height: "700px",
              padding: "10px",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              width: "98%",
              position: "relative",
              top: "0px",
            }}
          >
            <div className="logi-spinner" style={{ marginTop: "20px" }}>
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        )}
      </ChartWrapper>
    </>
  );
};
export default ChartContainer;
