import React, { useEffect, useState } from "react";
import { StyledTable } from "../CheckpointsListViewStyledComponent";

const keys = [
  'deliveryOrder',
  'branchId',
  'milestoneType',
  'modeOfTransport',
  'deliveryDay',
  'unloadingStartTimeWindow',
  'unloadingEndTimeWindow',
  'unloadingTime',
  'loadingStartTimeWindow',
  'loadingEndTimeWindow',
  'loadingTime',
  'fromBranch'
];

const RouteDetailsTableView = ({ data }) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const { childNodes, forwardRouteDetails } = data || {};
    if (childNodes?.length === 0) {
      if (forwardRouteDetails) {
        const forwardRouteDetailsKeys = Object.keys(forwardRouteDetails);
        const row = {};
        forwardRouteDetailsKeys?.forEach((key) => {
          const field = forwardRouteDetails[key];
          if (field?.permission && keys.includes(field?.id)) {
            setHeaders((prevState) => [...prevState, field?.label]);
            row[field?.label] = field?.value === 0 ? '0' : field?.value
          }
        });
        if (Object.keys(row)?.length > 0) {
          setRows((prevState) => [...prevState, row]);
        }
      }
    }
    else {
      const transitPointsKeys = Object.keys(childNodes[0]?.transitPoints);
      transitPointsKeys.forEach((key) => {
        const field = childNodes[0]?.transitPoints[key];
        if (field?.permission) {
          if (!headers.includes(field.label)) {
            setHeaders((prevState) => [...prevState, field?.label]);
          }
        }
      });

      const rows = childNodes.map((childNode) => {
        const transitPoints = childNode?.transitPoints;
        const row = {};
        transitPointsKeys.forEach((key) => {
          const field = transitPoints[key];
          if (field?.permission) {
            row[field?.label] = field?.value 
          }
        });
        return row;
      });

      // Add forwardRouteDetails object to rows
      if (forwardRouteDetails) {
        const forwardRouteDetailsKeys = Object.keys(forwardRouteDetails);
        const row = {};
        forwardRouteDetailsKeys.forEach((key) => {
          const field = forwardRouteDetails[key];
          if (field?.permission && field?.label !== 'sdsd') {
            row[field.label] = field?.value
            if(field?.label === "Destination"){
              row['Branch'] = field?.value
            }
          }
        });
        rows.push(row);
      }
      setRows(rows);
    }
  }, [data]);

  return (
    <StyledTable>
      <thead>
        <tr>
          <th>
            {headers.includes("Delivery Milestone") ? "Delivery Milestone" : "#"}
          </th>
          {headers
            .filter((header) => header !== "Delivery Milestone")
            .map((header, index) => (
              <th key={`${header}-${index}`}>{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {rows &&
          rows.map((row, index) => (
            <tr key={index}>
              <td>
                {row["Delivery Milestone"] ? row["Delivery Milestone"] : index + 1}
              </td>
              {headers
                .filter((header) => header !== "Delivery Milestone")
                .map((header, subIndex) => (
                  <td key={`${header}-${subIndex}`}>
                    {row[header] || "--"}
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    </StyledTable>
  );
};

export default RouteDetailsTableView;


