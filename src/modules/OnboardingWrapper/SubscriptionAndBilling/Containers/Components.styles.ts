import styled from "styled-components";

// UpdateSubscriptionComponent and Addons
export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

// Used in Addons Add Popup
export const PricingTabs = styled.div`
  box-shadow: 0 10px 15px -8px rgba(0, 0, 0, 0.24),
    0 0 11px 1px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 3px;
  margin-right: 10px;
  padding: 15px;
  min-width: 90px;
  min-height: 90px;
`;
