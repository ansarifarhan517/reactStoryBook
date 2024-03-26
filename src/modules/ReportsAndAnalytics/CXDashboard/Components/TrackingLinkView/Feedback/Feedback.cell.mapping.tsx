import React, { ComponentType } from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../../../../../../utils/components/TextOverflowEllipsis";

export interface ICellMapping {
  [key: string]: ComponentType<Cell>;
}

const FEEDBACK_CELL_MAPPING = {
  rating: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis >
          {console.log(value && value !== "NaN" , "sad")}
         {(value && value !== "NaN" ? value.toFixed(2) : 0) + "/5"}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  branchName:React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={(value)}>
        {(value)}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),

  dmName:React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={(value)}>
        {(value)}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  
  subClientName:React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={(value)}>
        {(value)}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
 


  feedback: React.memo(
    ({ value }: Cell<any>) => {
      return (
        <TextOverflowEllipsis title={(value)}>
          {(value)}
        </TextOverflowEllipsis>
      );
    },
    (p, n) => p.value === n.value
  ),
  
};

export default FEEDBACK_CELL_MAPPING;
