import styled from "styled-components";

export const BillingCycle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
`;

interface IPricingSummaryBorderBottomProps {
  padding?: string;
}
export const BorderBottom = styled.div<IPricingSummaryBorderBottomProps>`
  border-bottom: 1px solid grey;
  padding: ${(props) => (props.padding ? props.padding : "10px 0")};
`;
