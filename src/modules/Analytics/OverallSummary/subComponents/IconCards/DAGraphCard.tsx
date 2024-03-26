import React, { useEffect, useState } from "react";
import {
  DAGraphCardStyle,
  LegendPosition,
  RowFlexContainer,
} from "../../OverallSummary.styles";
import GroupedBarChart from "../Charts/GroupedBarChart";
import StackedBarChart from "../Charts/StackedBarChart";
import { Radio } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { colors } from "../utils/utilities";

export interface deliveryDataItem {
  name: string;
  Cancelled: Object;
  Attempted: Object;
  Completed: Object;
  Missed: Object;
}

const DAGraphCard = () => {
  const delMedData = useTypedSelector(
    (state) => state.overallSummaryListView.daGraphData
  );
  const [groupedGraph, setGroupedGraph] = useState<any>(false);
  const [cancelledLegend, setCancelledLegend] = useState<any>([
    "false",
    colors[2],
  ]);
  const [attemptedLegend, setAttemptedLegend] = useState<any>([
    "false",
    colors[3],
  ]);
  const [completedLegend, setCompletedLegend] = useState<any>([
    "false",
    colors[4],
  ]);
  const [missedLegend, setMissedLegend] = useState<any>(["false", colors[1]]);
  const [graphData, setGraphData] = useState<any>([]);
  const [attemptedItem, setAttemptedItem] = useState<any>([]);
  const [completedItem, setCompletedItem] = useState<any>([]);
  const [missedItem, setMissedItem] = useState<any>([]);
  const [cancelledItem, setCancelledItem] = useState<any>([]);

  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );

  useEffect(() => {
    setCancelledLegend(["false", colors[2]]);
    setAttemptedLegend(["false", colors[3]]);
    setCompletedLegend(["false", colors[4]]);
    setMissedLegend(["false", colors[1]]);
    setGraphData(delMedData);
  }, [delMedData]);

  const handleButtonClick = (event) => {
    switch (event.currentTarget.id) {
      case "attempted": {
        let attemptedArray: any = [];
        attemptedLegend[0] == "true"
          ? setAttemptedLegend(["false", colors[3]])
          : setAttemptedLegend(["true", "#fff"]);
        if (attemptedLegend[0] == "false") {
          delMedData.map((item) => {
            attemptedArray.push(item.Attempted);
            delete item.Attempted;
          });
          setAttemptedItem(attemptedArray);
          setGraphData(delMedData);
        } else {
          delMedData.map((item, index) => {
            item["Attempted"] = attemptedItem[index];
          });
          setGraphData(delMedData);
        }
        break;
      }

      case "completed": {
        let completedArray: any = [];
        completedLegend[0] == "true"
          ? setCompletedLegend(["false", colors[4]])
          : setCompletedLegend(["true", "#fff"]);
        if (completedLegend[0] == "false") {
          delMedData.map((item) => {
            completedArray.push(item.Completed);
            delete item.Completed;
          });
          setCompletedItem(completedArray);
          setGraphData(delMedData);
        } else {
          delMedData.map((item, index) => {
            item["Completed"] = completedItem[index];
          });
          setGraphData(delMedData);
        }
        break;
      }

      case "missed": {
        let missedArray: any = [];
        missedLegend[0] == "true"
          ? setMissedLegend(["false", colors[1]])
          : setMissedLegend(["true", "#fff"]);
        if (missedLegend[0] == "false") {
          delMedData.map((item) => {
            missedArray.push(item.Missed);
            delete item.Missed;
          });
          setMissedItem(missedArray);
          setGraphData(delMedData);
        } else {
          delMedData.map((item, index) => {
            item["Missed"] = missedItem[index];
          });
          setGraphData(delMedData);
        }
        break;
      }

      case "cancelled": {
        let cancelledArray: any = [];
        cancelledLegend[0] == "true"
          ? setCancelledLegend(["false", colors[2]])
          : setCancelledLegend(["true", "#fff"]);
        if (cancelledLegend[0] == "false") {
          delMedData.map((item) => {
            cancelledArray.push(item.Cancelled);
            delete item.Cancelled;
          });
          setCancelledItem(cancelledArray);
          setGraphData(delMedData);
        } else {
          delMedData.map((item, index) => {
            item["Cancelled"] = cancelledItem[index];
          });
          setGraphData(delMedData);
        }
        break;
      }

      default: {
        break;
      }
    }
  };
  return (
    <DAGraphCardStyle>
      <RowFlexContainer>
        <div style={{ marginLeft: "40px" }}>
          <Radio
            name="graphType"
            value="Grouped"
            label={dynamicLabels.grouped}
            radioSize="md"
            style={{ fontSize: "11px", marginLeft: "20px" }}
            color="red"
            checked={groupedGraph}
            onChange={() => {
              setGroupedGraph(true);
            }}
          />
        </div>
        <Radio
          name="graphType"
          value="stacked"
          label={dynamicLabels.stacked}
          radioSize="md"
          style={{ fontSize: "11px" }}
          color="red"
          checked={!groupedGraph}
          onChange={() => {
            setGroupedGraph(false);
          }}
        />

        <LegendPosition>
          <button
            id="cancelled"
            style={{ backgroundColor: cancelledLegend[1] }}
            className={"legendCustom"}
            onClick={handleButtonClick}
          ></button>
          <span className={"legendCustomTitle"}>{dynamicLabels.cancelled}</span>
          <button
            id="attempted"
            style={{ backgroundColor: attemptedLegend[1] }}
            className={"legendCustom"}
            onClick={handleButtonClick}
          ></button>
          <span className={"legendCustomTitle"}>{dynamicLabels.attempted}</span>
          <button
            id="completed"
            style={{ backgroundColor: completedLegend[1] }}
            className={"legendCustom"}
            onClick={handleButtonClick}
          ></button>
          <span className={"legendCustomTitle"}>{dynamicLabels.completed}</span>
          <button
            id="missed"
            style={{ backgroundColor: missedLegend[1] }}
            className={"legendCustom"}
            onClick={handleButtonClick}
          ></button>
          <span className={"legendCustomTitle"}>{dynamicLabels.missed}</span>
        </LegendPosition>
      </RowFlexContainer>
      {delMedData?.length > 0 ? (
        !groupedGraph ? (
          <StackedBarChart delData={graphData} />
        ) : (
          <GroupedBarChart delData={graphData} />
        )
      ) : (
        <div style={{ paddingTop: "180px", paddingBottom: "180px" }}>
          {dynamicLabels.noDataAvailable}
        </div>
      )}
    </DAGraphCardStyle>
  );
};

export default DAGraphCard;
