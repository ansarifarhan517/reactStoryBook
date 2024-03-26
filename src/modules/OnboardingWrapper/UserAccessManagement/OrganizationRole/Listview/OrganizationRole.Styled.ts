import styled from 'styled-components'
import { Grid, Button } from 'ui-library'
export const StyledGrid = styled(Grid)`
   flex-grow: 1;
   overflow: hidden;
   height:100%;
   width: 100%;
   & button[disabled] {
    opacity:0.2 !important;
    }

   .grid-customised-scroll-bar ::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    cursor: grab !important;

  }
 
  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
    -webkit-border-radius: 9px;
    border-radius: 9px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 9px !important;
    border-radius: 9px !important;
    // background-color: #dadceo !important;
    background-color: #DADCE0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    // background-color: #bdc1c6 !important;
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    // background-color: #80868b !important;
    background-color: #80868b !important;
  }
`
export const ItemButton = styled.div`
    background: #5698d3;
    color: #fff;
    line-height: initial;
    vertical-align: middle;
    padding: 3px 3px;
    padding: 3px 5px;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: none;
    margin: 0 auto;
    button[disabled] {
            opacity: 0.2 !important;
        };
`

export const StyledSquare = styled(Button)`
        background: ${({ theme }) => theme?.colors?.primary?.main || '#5698d3'} ;
        color: ${({ theme }) => theme?.colors?.white};
        line-height: initial;
        vertical-align: middle;
        padding: 3px 3px;
        padding: 3px 5px;
        border-radius: 2px;
        button[disabled] {
            opacity: 0.2 !important;
        };
        cursor: pointer;
    box-shadow: none;
    margin: 0 auto;
      
`

export const StyledAccessProfileModal = styled.div`
font-size:13px;
margin-left:15px;
margin-top:5px;
th {
  font-family: 'Gotham-Rounded-Medium', Sans-Serif !important;
  color: #46465f;
  font-size: 13px;
  text-align: left;
  position: relative;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
table tbody:not(.milkrun-table-body) {
  max-height: 78vh !important;
  overflow: scroll !important;
}
table {
  border: none;
}
table:not(.menuLockTable) {
  width: 100% !important;
}
@media (min-width: 768px)
table:not(.secondSubMenuTable) {
  table-layout: fixed;
}
tbody:before {
  content: '';
  display: block;
  height: 20px;
}
td{
  font-size:12px;
  font-weight: lighter;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 15px;
}
`

export const StyledFooter = styled.div`
button {
  i {
      margin-top: 5px;
      font-size: 16px;
  }
}
`