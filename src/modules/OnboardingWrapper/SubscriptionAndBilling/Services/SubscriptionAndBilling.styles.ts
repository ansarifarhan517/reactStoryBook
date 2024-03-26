import styled from "styled-components";
import {
  IContentWrapperProps,
  IPrimaryUnderlineHyperlinkProps,
  IStatusDisplayBoxProps,
  ISubscriptionBillingMasterContainerProps,
  ITextAlignmentProps,
} from "./Subscriptionandbilling.models";

// Todo: Delete this, no longer required.

export const CurrentPlanPageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const LeftPanel = styled.div`
  width: 59%;
`;

export const BreadCrumbContainer = styled.div`
  margin: 5px 0;
`;

export const RightPanel = styled.div`
  width: 41%;
  margin-left: 15px;
`;

export const SubscriptionAndBillingMasterContainer = styled.div<ISubscriptionBillingMasterContainerProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  top: ${props => props.clientExpired ? "75px" : "-40px"};
  margin: ${props => props.clientExpired ? "0 10px" : "0px"};
`;

export const StatusDisplayBox = styled.button<IStatusDisplayBoxProps>`
  font-size: 10px;
  width: 65%;
  text-align: center;
  background: ${(props) =>
    props.payStatus === "paid"
      ? "#6fc44b"
      : props.payStatus === "void"
      ? "#b2b5b8"
      : props.payStatus === "partially_paid"
      ? "#fba729"
      : ""};
  color: white;
  padding: 3px 10px;
  border-radius: 2px;
  cursor: default;
`;

export const UAT_Account_AccessDenied = styled.img`
  height: 600px;
`;

export const PayButton = styled.button`
  background: #5698d3;
  color: white;
  border-radius: 1px;
  padding: 3px 15px;
  border: 0px;
  font-size: 13px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
`;

export const IconContainer = styled.div`
  color: #5698d3;
  cursor: pointer;
`;

export const PrimaryUnderlinedHyperlink = styled.span<IPrimaryUnderlineHyperlinkProps>`
  text-decoration: underline;
  justify-content: flex-end;
  cursor: pointer;
  padding: ${(props) => (props.padding ? props.padding : "")};
  color: ${(props) => (props.color ? props.color : "#5698d3")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "inherit")};
`;

export const ContentWrapper = styled.div<IContentWrapperProps>`
  padding: ${(props) => (props.padding ? props.padding : "")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ContentComponent = styled.div<ITextAlignmentProps>`
  display: flex;
  flex-direction: column;
  text-align: ${(props) => props.shiftRight ? "right" : ""};
  width: ${(props) => props.width ? props.width : ""};
`;



// Pricing page summary and ProgressBarPlanCard
interface IDescriptionProps{
  fontSize?: string;
}

export const Description = styled.div<IDescriptionProps>`
  color: #485465;
  font-size: ${(props)=> props.fontSize ? props.fontSize : "10px"};
  margin-top: 4px;
`;
