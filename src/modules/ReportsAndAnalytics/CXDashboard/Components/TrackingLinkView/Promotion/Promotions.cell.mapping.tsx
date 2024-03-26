import React, { ComponentType } from "react";
import { Cell } from "react-table";
 import { IconButton } from "ui-library";
import AnchorTextCell from "../../../../../../utils/components/CellMapping/AnchorTextCell";
// import NumberCount from "../../../../../../utils/components/CellMapping/NumberCountCell";
import TextOverflowEllipsis from "../../../../../../utils/components/TextOverflowEllipsis";
// import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";

export interface ICellMapping {
  [key: string]: ComponentType<Cell>;
}




const PROMOTIONS_CELL_MAPPING = {
  actionLink: AnchorTextCell,

  brandProfileName: React.memo(({ row }: Cell<any>) => {
    return <TextOverflowEllipsis title={row.original.promotionId}>{row?.original?.promotionId}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),

  displayImg: React.memo(({ value, column, row }: Cell<any>) => {

    return <a  data-value={value} style={{ textAlign: 'center', width: 'inherit' }} 
    onClick={() =>{
      var newWin = open("");  
      newWin?.document.open("text/html");
      newWin?.document.write("<html><head>");
      newWin?.document.write(`<img style="height:100%;width:100%" src="${row.original.displayImg}" </img>`)
      newWin?.document.write("</head><body>");
    }}>
      
      <IconButton iconVariant="icon icon-icomoon-location-approve" iconSize={16} onlyIcon style={{ color: "#5698d3", margin: '0  17px' }} /></a>
  }, (p, n) => p.value === n.value),

  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
};

export default PROMOTIONS_CELL_MAPPING;
