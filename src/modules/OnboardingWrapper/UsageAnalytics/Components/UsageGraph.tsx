import React from "react";
import { LineChart, Box } from "ui-library";
import UA_TimeGapButtonsGroup from "./UA_TimeGapButtonsGroup";
import {
  UA_Graph_HeaderContainer,
  UA_GraphContainer,
} from "../Services/UsageAnalytics.styles";
import UA_DateRangePicker from "./UA_DateRangePicker";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { getSubscriptionName } from "../Services/Utils/HelperFunctions";
import { pageValueFromKey } from "../Services/Utils/Mappings";

interface IUsageGraphProps {
  graphData: any;
  dynamicLabels: any;
}

const UsageGraph = ({ graphData, dynamicLabels }: IUsageGraphProps) => {

  const pageKey = useTypedSelector((state) => state.usageAnalytics.pageKey);
  const clientOptions = useTypedSelector((state) => state.usageAnalytics.clientOptions);
  const subscriptionOptions = useTypedSelector((state) => state.usageAnalytics.subscriptionOptions);
  const dropdownValue = useTypedSelector((state) => state.usageAnalytics?.[pageValueFromKey[pageKey]]?.selectedValue);

  const dataKeysToGraphKeysMapper = {
    index: 'index',
    deliveredOrder: dynamicLabels?.analytics_orders_delivered || "Orders Delivered",
    plannedOrder: dynamicLabels?.analytics_planned_orders || "Planned Orders",
    order: dynamicLabels?.analytics_orders_created || "Orders Created",
    date: 'name',
    email: dynamicLabels?.analytics_email_sent || "Email Sent",
    ivr: dynamicLabels?.analytics_ivr_sent || "IVR Calls Generated", // Will be used later
    sms: dynamicLabels?.analytics_sms_sent || "SMS Sent"
  };

  // For account who has bought DA should see nothing regarding orders in the graph. Thus, changing legendData for DA.
  const subscriptionName = getSubscriptionName(pageKey, pageKey === 'CLIENT' ? clientOptions : subscriptionOptions, dropdownValue);
  const legendData = subscriptionName === 'RESOURCEBASED'
    ? [
      { name: dataKeysToGraphKeysMapper['email'], color: "#F05548", active: true, },
      { name: dataKeysToGraphKeysMapper['sms'], color: "#5698D3", active: true, },
      // { name: dataKeysToGraphKeysMapper['ivr'], color: "#5238D3", active: true }, // Will be used later
      // { name: dataKeysToGraphKeysMapper['order'], color: "#48979B", active: true }, // For DA no order data to be shown
      // { name: dataKeysToGraphKeysMapper['plannedOrder'], color: "#F0AD48", active: true }, // For DA no order data to be shown
      // { name: dataKeysToGraphKeysMapper['deliveredOrder'], color: "#9B4848", active: true }, // For DA no order data to be shown
    ]
    : [
      { name: dataKeysToGraphKeysMapper['email'], color: "#F05548", active: true, },
      { name: dataKeysToGraphKeysMapper['sms'], color: "#5698D3", active: true, },
      // { name: dataKeysToGraphKeysMapper['ivr'], color: "#5238D3", active: true }, // Will be used later
      { name: dataKeysToGraphKeysMapper['order'], color: "#48979B", active: true },
      { name: dataKeysToGraphKeysMapper['plannedOrder'], color: "#F0AD48", active: true },
      { name: dataKeysToGraphKeysMapper['deliveredOrder'], color: "#9B4848", active: true }
    ];

  const ticks = [0, 25, 50, 75, 100];

  const getTransformedGraphData = (graphData) => {
    return graphData.map((eachUsage) => {
      let tranformedEachUsage = {};

      Object.keys(eachUsage).forEach((key) => {
        tranformedEachUsage[dataKeysToGraphKeysMapper[key]] = eachUsage[key];
      })

      return tranformedEachUsage;
    });
  };

  return (
    <UA_GraphContainer>
      <UA_Graph_HeaderContainer>
        <UA_TimeGapButtonsGroup dynamicLabels={dynamicLabels} />
        <UA_DateRangePicker />
      </UA_Graph_HeaderContainer>
      <Box p="4em 2.5em 4em 0" borderRadius="3px" bgColor="white">
        <LineChart
          details={getTransformedGraphData(graphData)}
          labelAngle={Object.keys(getTransformedGraphData(graphData)).length > 10 ? -30 : -10}
          height={400}
          showXaxis={true}
          xAxisLabel="Date"
          showYaxis={true}
          yAxisLabel="Activity Count"
          legendData={legendData}
          _ticks={ticks}
          tickInPercentage={false}
          showTinyChart={true}
          startWithXaxis={true}
          legendFullwidth = {true}
          magnifierStartIndex={Object.keys(getTransformedGraphData(graphData)).length > 15 ? Object.keys(getTransformedGraphData(graphData)).length - 15 : 0}
          onChange={() => console.log("Legend data changed")}
        />
      </Box>
    </UA_GraphContainer>
  );
};

export default UsageGraph;
