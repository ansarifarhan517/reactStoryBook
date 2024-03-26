import styled from "styled-components";
import { theme } from "../../../../utils/theme";
import { IFlexContainer } from "./UsageAnalytics.models";

export const HyperLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: ${theme.colors.primary.main};
`;

export const PieContainer = styled.div`
  border-top: 1px solid #979797;
`;

export const UsagePieCard = styled.div`
  padding: 15px;
  border-radius: 3px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
    0px 0px 11px rgba(0, 0, 0, 0.12);
`;

export const FlexContainer = styled.div<IFlexContainer>`
  display: flex;
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : "row"};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : ""};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "")};
  padding: ${(props) => (props.padding ? props.padding : "")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  color: ${(props) => (props.color ? props.color : "black")};
  margin: ${(props) => props.margin ? props.margin : ""};
  gap: ${(props) => props.gap ? props.gap : ""};
  height: ${(props) => props.height ? props.height : ""};
`;

// export const DropDownContainer = styled.div`
//   box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
//   padding: 0 6px;
//   height: 30px;
//   background-color: white;
// `;

export const UA_PageContainer = styled.div`
  position: relative;
  bottom: 60px;
`;

export const UA_GraphContainer = styled.div`
  background-color: white;
  margin-top: 20px;
  border-radius: 3px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
    0px 0px 11px rgba(0, 0, 0, 0.12);
`;

export const UA_Graph_HeaderContainer = styled.div`
  padding: 1.5em 3em 1em;
  display: flex;
  justify-content: flex-end;
`;


export const UA_DateRangePickerContainer = styled.div`
  box-shadow: 0 2px 11px -5px #000;
  max-height: 30px;
  margin-left: 10px;
  /* width: 220px; */
`