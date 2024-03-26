import React from "react";
import { withReactOptimized } from "../../../../utils/components/withReact";
import { Box, Typography, FontIcon } from "ui-library";
import styled from "styled-components";
import { PrimaryUnderlinedHyperlink } from "../Services/SubscriptionAndBilling.styles";
import { hybridRouteTo } from "../../../../utils/hybridRouting";

export const Iconstyle = styled.div`
        border-radius: 50%;
        width: 24px;
        height: 24px; 
        margin: 0 15px 6px 0;
        background-color: #5698d3;
        padding-top: 2px;
}
`;

export const Display = styled.div`
  display: flex;
  flex-direction: row;
`;


const Supportticket = () => {

  return (
    <Box
      bgColor="white"
      mt={"1em"}
      p={"1em"}
      style={{
        boxShadow:
          "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
        padding: "20px",
        borderRadius: "3px",
      }}
    >
      <Display>
        <Iconstyle>
          <FontIcon
            variant="icomoon-question-mark"
            color="white"
            size="lg"
          />
        </Iconstyle>
        <Typography useStyle={false} fontSize="15px" color="grey.900" fontWeight={600} lineHeight="1.25">
          If you are a large enterprise looking to manage a huge volume of orders/delivery associates or if you have any queries,&nbsp;
          <PrimaryUnderlinedHyperlink
            fontSize="15px"
            onClick={() => {
              hybridRouteTo("ticketing");
            }}
          >
            raise a support ticket
          </PrimaryUnderlinedHyperlink>&nbsp;and we will assist you.
        </Typography>
      </Display>
    </Box>
  );
};

export default withReactOptimized(Supportticket, false);
