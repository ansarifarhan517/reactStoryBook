import styled from 'styled-components';
import { Grid } from 'ui-library'

interface IRejectionList {
  reason?: string
}

export const StyledGrid = styled(Grid)`
   flex-grow: 1;
   overflow: hidden;
   width: 100%;
   height: 100%;
   
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

export const StyledRejectList = styled.div<IRejectionList>`
   font-size: 13px;
   & div[class$='placeholder'] {
     font-size: 13px;
     color:${({ theme }) => theme?.colors?.text?.inputLabel?.grey};
     font-weight: lighter;
   }
   & div[class$='singleValue'] {
      div {
        div {
        display: none !important;
        }
      }
  }
   & div[class$='option'] {
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.grey?.['150']};
    font-weight: 400;
    font-family: 'Gotham-Rounded', Sans-Serif;
  }
  & div[id$='option-0'] {
    ${({ reason, theme }) => {
    return reason ? `background-color: ${theme?.colors?.white} !important;` :
      `background-color: ${theme?.colors?.primary?.main} !important;`
  }}
    div{
    ${({ reason, theme }) => {
    return reason ? `color:${theme?.colors?.grey?.['150']} !important;` :
      `color: #fff !important;`
  }}
}
  }
  
`

export const StyledNoOFUsers = styled.div`
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

