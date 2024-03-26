import React, { Fragment, useEffect } from "react";
import { IListViewColumn } from "ui-library";
import { ITripsListMileRowData } from "../TripsListView.model";
import { StyledPrintPage } from "../TripListView.styles";
import { filterDateFormatter } from "../helper";

const PrintPage = ({ columns, data, handlePrint, isPrint }: any) => {
  const columnList = columns?.filter((column: any) => column.isVisible);
  const headerList = columnList?.map((column: any) => column.Header);
  const columnPropertyList = columnList?.map(
    (column: IListViewColumn) => column.accessor
  );
  const logoS3Path = JSON.parse(localStorage?.getItem("userAccessInfo") || "")[
    "clientLogo"
  ];

  useEffect(() => {
    if (isPrint) {
      handlePrint();
    }
  }, [isPrint]);

  const body = data?.map((row: ITripsListMileRowData) => {
    return (
      <tr key={row.tripId}>
        {columnPropertyList.map((columnKey: string, index: number) => {
          if (columnKey === "customFieldsJSONString" && row[columnKey]) {
            //"[{"type": "checkbox", "field": "cf_xcvbnm", "value": "N"}, {"type": "checkbox", "field": "cf_sdfghj", "value": "N"}, {"type": "text", "field": "cf_commission", "value": "9"}]"
            const groupOfProperties = JSON.parse(row[columnKey] || "[]");
            groupOfProperties.map((customProperty: any) => {
              if (columnPropertyList.includes(customProperty?.field)) {
                //td
                return (
                  <td key={customProperty.field + row.tripId}>
                    {customProperty.value || ""}
                  </td>
                );
              }
              return <Fragment key={customProperty.field + row.tripId} />;
            });
          } else if (typeof columnKey === "object" && row[columnKey]) {
            // { tripId: 243129, type: "LOGOUT"}
            const objectTypePropKeys = Object.keys(row[columnKey]);
            Object.values((nestedProp: any, index: number) => {
              if (columnPropertyList.includes(objectTypePropKeys[index])) {
                //td
                return (
                  <td key={nestedProp + row.tripId + index}>{nestedProp}</td>
                );
              }
              return <Fragment key={nestedProp + row.tripId + index} />;
            });
          } else if (
            columnKey == "lastTrackingDate" ||
            columnKey == "tripStartDt" ||
            columnKey == "tripEndDt" ||
            columnKey == "estimatedEndDate" ||
            columnKey == "estimatedStartDate"
          ) {
            return (
              <td
                key={row.tripId + index}
                style={{ minWidth: "fit-content", width: "150px" }}
              >
                {row[columnKey] ? filterDateFormatter(row[columnKey]) : ""}
              </td>
            );
          }
          //td
          return (
            <td key={row.tripId + index}>
              {row[columnKey] ? row[columnKey] : ""}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <StyledPrintPage id="printTable" style={{ display: "none" }}>
      <img
        src={logoS3Path}
        alt="logo"
        style={{
          fontSize: "13px",
          color: "#555",
          padding: "10px 0px 10px 0px",
          display: "block",
          height: "60px",
          width: "80px",
        }}
      />
      <table style={{ overflow: "auto" }}>
        <thead>
          <tr>
            {headerList?.map((header: string, index: number) => {
              return <th key={header + index}>{header} </th>;
            })}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </StyledPrintPage>
  );
};

export default PrintPage;
