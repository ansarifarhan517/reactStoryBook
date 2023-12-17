import React from "react";
import { Cell } from "react-table";
import TextOverflowEllipsis from "../TextOverflowEllipsis";
// import { theme } from '../../theme'
import { getDefaultTheme } from 'ui-library';
import { getFormattedDate } from '../../helper';
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties';
import { StyledAnchorTextCell } from './StyledCellMapping'

export default React.memo(
  ({ value, column, row }: Cell<any>) => {
    const theme = getDefaultTheme();
    if (column?.["columnDisplayVal"]) {
      value = eval(column?.["columnDisplayVal"]);
    }
    if (!value || value == "undefined") {
      return <div></div>;
    }
    if (column?.["cellType"] == "DATE") {
      let clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
      value = getFormattedDate(
        value,
        clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
      );
    }
    let hrefdata;
    if (column?.["hrefdata"] && row && !column?.["callback"]) {
      hrefdata = eval(column?.["hrefdata"]);
    }

    return (
        <TextOverflowEllipsis title={value}>
            <StyledAnchorTextCell className="StyledAnchorTextCell">
                <a  rel="noopener noreferrer" href={hrefdata} style={{color: theme?.colors?.primary?.main || '#5698d3'}} onClick={() => column?.["callback"] && column?.["callback"](row)}>
                    {value}
                </a>
            </StyledAnchorTextCell>
        </TextOverflowEllipsis>)
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original))
