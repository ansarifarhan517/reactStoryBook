import styled from "styled-components";
import { Box, Grid, Position, Card } from 'ui-library';

export const StyledCard = styled(Card).attrs(props => ({ className: `sc-card ${props.className || ''}` }))`
  position: relative;
  background-color: white;
  height: 100%;
  width: 100%;
  padding: 15px;
  .tracker-delete-action {
    font-size: 17px !important;
    cursor: pointer;
    color: #5698d3;
  }
  .accordion__header__container {
    min-height: 55px;
  }

`
export const BorderButton = styled.div.attrs(props => ({ className: `sc-border-button ${props.className || ''}` }))`
  height: 40px;
  padding: 0px 15px;
  line-height: 38px;
  border-radius: 3px;
  border-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 2px dashed ${({ theme }) => theme?.colors?.primary?.main};
  cursor: pointer;
  background-white: transparent;
  text-align: center;

  &:hover {
    background-color: white;
  }
`
export const CustomDropDown = styled.div`
.item-wrp {
  text-align: left;height: 34px;display: flex;flex-direction: row;align-items: center;
}
.item-img {
  height: 22px;cursor: move;transform: translate(-50%);
}
`
export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0px;
`;

export const BreadCrumbContainer = styled(Box)`
  margin: 10px 0;
  background-color: #fafafa;
  padding: 10px 0;
  label {
    white-space: nowrap;
  }
`;
export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;
export const TableCSS = styled(Grid)`
table.sortable-table tr,
table.sortable-table thead {
  border-bottom: 1px solid #ddd;
}
table.sortable-table tr:last-child {
  border: none;
}
table.sortable-table th,
table.sortable-table td {
  padding: 5px 15px;
  color: #525252;
  font-size: 13px;
  word-wrap: break-word;
}
table.sortable-table th {
  font-family: "Gotham-Rounded-Medium";
  vertical-align: top;
  color: #000;
  font-size: 14px;
  padding: 15px 15px;
}
table.sortable-table.table-border {
  border: 1px solid #ddd;
}
table.sortable-table .dotted-input {
  width: 100%;
}
table.sortable-table .delete-action i {
  font-size: 17px !important;
  cursor: pointer;
  color: #5698d3;
}
table.sortable-table tbody div {
  display: contents;
}
`;
