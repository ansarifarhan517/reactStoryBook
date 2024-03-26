import React from "react";
import { ExpandableListView } from "ui-library";

const BasicExpandableTable = (params: any) => {
  return (
    <ExpandableListView
      initialRows={3}
      tableData={params.data}
      headers={params.heading}
    />
  );
};

export default BasicExpandableTable;
