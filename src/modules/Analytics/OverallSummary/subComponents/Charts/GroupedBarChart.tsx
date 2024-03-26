import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Brush } from "recharts";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import { colors, CustomTooltip } from "../utils/utilities";

const GroupedBarChart = (delData) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  return (
    <BarChart width={1300} height={400} data={delData.delData}>
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
      <Bar dataKey="Cancelled" fill={colors[2]} />
      <Bar dataKey="Attempted" fill={colors[3]} />
      <Bar dataKey="Completed" fill={colors[4]} />
      <Bar dataKey="Missed" fill={colors[1]} />

      <Brush
        travellerWidth={0}
        startIndex={0}
        endIndex={
          delData?.delData?.length > 15 ? 14 : delData?.delData?.length - 1
        }
        dataKey="name"
      />
    </BarChart>
  );
};

export default GroupedBarChart;
