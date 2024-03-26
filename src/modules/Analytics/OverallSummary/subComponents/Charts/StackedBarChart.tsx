import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  Legend,
} from "recharts";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { colors, CustomTooltip } from "../utils/utilities";

const StackedBarChart = (delData) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={delData.delData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          label={{
            value: dynamicLabels.deliveryBoyGraph,
            position: "insideBottom",
            fontSize: "11px",
          }}
          tick={{ fontSize: 8.75 }}
          tickMargin={0}
        />
        <YAxis
          label={{
            value: dynamicLabels.numOfOrders,
            angle: -90,
            position: "insideLeft",
            fontSize: "11px",
          }}
          allowDecimals={false}
          tick={{ fontSize: 8.75 }}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Bar dataKey="Cancelled" stackId="a" fill={colors[2]} />
        <Bar dataKey="Attempted" stackId="a" fill={colors[3]} />
        <Bar dataKey="Completed" stackId="a" fill={colors[4]} />
        <Bar dataKey="Missed" stackId="a" fill={colors[1]} />
        <Brush
          startIndex={0}
          travellerWidth={0}
          endIndex={
            delData?.delData?.length > 15 ? 14 : delData?.delData?.length - 1
          }
          dataKey="name"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;
