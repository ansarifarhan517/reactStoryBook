import styled from "styled-components";
import { Box } from 'ui-library'

export const FormContainer = styled.div`

.form-fields {
  padding: 0 15px!important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pr-0 {
  padding-right: 0!important;
}
.pl-0 {
  padding-left: 0!important;
}
.noLabel input + div{
  display: none;
}
.noLabel input {
  text-align: center;
}
.scanid input{
  width: 100%;
}
`
export const FormFieldWapper = styled.div`
  /* white-space: nowrap; */
label {
  display: flex;
} 
`;

export const TabButtonContainer = styled.div`
div {
  margin: 0;
  box-shadow: none;
}
span#orders, span#manifests {
  width: 120px;
  margin-right: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 11px -5px #000;
  border: unset;
  line-height: 40px;
  padding: 10px 10px;
  min-height: 40px;
  cursor: pointer;
  font-size: 13px;
}
`
export const ActionBarContainer = styled(Box)`
margin-left: 2px;
margin-top: 2px;
`;

export const AccordianTitle = styled.div`
font-size: 14px !important;
line-height: 20px;
`

export const TableContent = styled.div`
padding: 20px;

table  {
  width: 100% !important;
  table-layout: fixed;
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  tbody {
    max-height: 78vh !important;
    overflow: scroll !important;
     tr {
        height: 28px;
        th:not(.noRadio):first-child {
            width: 50px;
        }
       th {
            padding-bottom: 10px;
            font-weight: bold;
            font-size: 13px;
            padding: 5px 0;
            text-align: left;
            border-bottom: 1px solid #d3d3d3;
      }
      td {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
        padding-right: 10px;
        padding: 5px 0;
        border-bottom: 1px solid #d3d3d3;
      }
      td.empty {
        border: none;
      }
     }
  }
}
`;


export const NoDataAvailable = styled.div`    
text-align: center;
color: #636363;
height: 80px;
line-height: 80px;
font-size: 13px;
`;

export const ButtonContainer = styled(Box)`
display: flex;
padding: 15px 0;

button {
  margin-right: 15px;
  border-radius: 2px;
}
`

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 60px;
  padding: 0 15px;
`;

export const BreadCrumbContainer = styled(Box)`
  margin: 20px 0;
  background-color: #fafafa;
  padding: 10px 0;
  label {
    white-space: nowrap;
  }
`;

export const ExceptionListviewContainer = styled.div`
.variable-size-grid {
  overflow-x: hidden;
}
.columns-container > div > div > div#column-header-selectionWithEdit{
  display: none;
}
/* .pinned-left-container {
  width: 20px!important;
} */
.pinned-left-container > div > div > div > div[data-tip="true"] {
    display: none;
  }
  .pinned-left-container > div > div > div > button > i {
    display: none;
  }
`;

export const ExceptionListviewFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0px 20px 20px 20px;
  button {
    margin-left: 10px;
    border-radius: 2px;
  }
  
`
export const ListViewFonIconContainer = styled.span`
  min-width: 10px;
  color: #E65A60;
  /* margin-left: -20px; */
  margin-right: 5px;
  i {
    font-size: 10px;
    line-height: 10px;
    height: 10px;
  }
`;

export const ModalHeaderWithIcon = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
  i {
    position: absolute;
    z-index: 1;
    margin-left: 15px;
    color: #fff;
    font-size: 15px;
    height: 15px;
    line-height: 15px;
  }

  h4 {
    padding-left: 40px;
  }
  h4 + span i {
    margin-left: -20px;
  }

`

export const LinkOutIconContainer = styled.span`
  margin-left: 5px;
  cursor: pointer;
  a {
    z-index: 1;
    color: #000000;
    opacity: 0.6;
  }
`

export const NoteContainer = styled.span`

`

export const ConflictModalButtonContainer = styled.div`
  display: flex;
  button {
    margin-left: 10px;
    border-radius: 2px;
  }
`

export const ReloadRibbon = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  margin-left: -14px;
  margin-top: -20px;
  width: 1140px;
  font-size: 12px;
  color: #000;
  margin-bottom: 10px;
  background: #efc722;
  padding-left: 20px;
  span {
    text-decoration: underline;
    cursor: pointer;
    margin-right: 5px;
  }
`

export const InCompleteScanningIcon = styled.span`
  width: 15px; 
  height: 15px; 
  color: #fcb34a; 
  border: 1px solid #fcb34a; 
  text-align: center; 
  display: inline-block; 
  border-radius: 50%; 
  margin-left: 5px;
  cursor: pointer;
`;

export const CrateDetailsWrapper = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  padding: 5px;
`