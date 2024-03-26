import React from "react";
import TextOverflowEllipsis from "../../../../../../utils/components/TextOverflowEllipsis";
import { Cell } from "react-table";
import { StyledAnchorTextCell } from "../../../../../../utils/components/CellMapping/StyledCellMapping";

const arePropsEqual = (prevProps, newProps) =>
  prevProps.value === newProps.value &&
  prevProps.column?.["cellCallback"] === newProps.column?.["cellCallback"] &&
  JSON.stringify(prevProps.row.original) ===
    JSON.stringify(newProps.row.original);

export default React.memo(({ value, row, column }: Cell<any>) => {
  console.log(column, "textcell");
  return (
    <TextOverflowEllipsis>
      <StyledAnchorTextCell>
        <a
          rel="noopener noreferrer"
          onClick={() =>
            column?.["cellCallback"] &&
            column?.["cellCallback"](row, column?.id)
          }
        >
          {value}
        </a>
      </StyledAnchorTextCell>
    </TextOverflowEllipsis>
  );
}, arePropsEqual);
