import React from "react";
import styled from "styled-components";
import { Box, Typography, IconButton } from "ui-library";

import { withReactOptimized } from "../../../../utils/components/withReact";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

export const Discountmessgestyle = styled.div`
  height: 13px;
  width: 157px;
  background: #6fc44b;
`;

export const Tytpstyle = styled.div`
  padding: 10px 0;
`;

const GrabOffer = () => {
  const currentPlanData = useTypedSelector((state)=> state.subscriptionBilling.currentplandata);

  let grabtheoffer = "Limited offer just for you, grab now !!";
  let discountmessge = "Save 15% on yearly subscription";
  let buysub = "Buy a subscription to avail the offer";
  return (
    <>
      <Box
        bgColor="white"
        mt={"1em"}
        p={"1em"}
        style={{
          boxShadow: "0 10px 15px -8px rgba(0, 0, 0, 0.24), 0 0 11px 1px rgba(0, 0, 0, 0.12)",
          // width: "100%",
          height: "100%",
          padding: "20px",
          borderRadius: "3px",
        }}
      >
        <Tytpstyle>
          <Typography
          useStyle={false}
            fontSize="15px"
            color="black"
            bold={true}
            fontWeight={600}
          >
            {grabtheoffer}
          </Typography>
        </Tytpstyle>
        <Discountmessgestyle>
          <Typography  useStyle={false} fontSize="11px" color="white">
            {discountmessge}
          </Typography>
        </Discountmessgestyle>
        <Tytpstyle>
          <Typography useStyle={false} fontSize="10px" color="black">
            {buysub}
          </Typography>
        </Tytpstyle>
        {currentPlanData?.planType === "TRIAL" ? (
          <IconButton
            primary
            onClick={() => {}}
            iconVariant={"up-arrow"}
            style={{
              borderRadius: "2px",
            }}
          >
            <Typography useStyle={false} fontSize="12px" color="white" align="left">
              {"Upgrade Now"}
            </Typography>
          </IconButton>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

export default withReactOptimized(GrabOffer, false);
