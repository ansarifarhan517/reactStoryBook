import React from "react";
import { ReactTooltipCustom as ReactTooltip } from "../../../utils/layouts/ReactTooltipCustom";
import { Box, IconButton } from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { TimelineContainer } from "../OrderListView/StyledOrderListView";
const OrdersNotAvailable = (props: any) => {
  const { hybridRouteTo, addPermission } = props;
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const modelType =
    localStorage.getItem("userAccessInfo") !== null && userAccessInfo?.superType
      ? userAccessInfo?.superType
      : userAccessInfo?.modelType;

  return (
    <>
      <Box
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          boxShadow: "0 2px 20px -10px #000",
          textAlign: "center",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 99,
          background: "white",
          padding: "80px",
        }}
      >
        <img
          src="images/noDataTemplate-allOrders.png"
          alt="No Data Available"
        />
        <div style={{ padding: "20px" }}>
          No Shipments present in the selected date range.
        </div>
        <Box display="flex" justifyContent="center">
          {addPermission ? (
            <>
              <IconButton
                primary={true}
                intent="page"
                data-tip
                data-for="tt_AddOrder"
                iconVariant="icomoon-add"
                onClick={() => {
                  hybridRouteTo("order/addorder");
                }}
                style={{ margin: "10px" }}
              >
                {modelType === "MIDDLEMILE"
                  ? `${dynamicLabels.add || "Add"} ${
                      dynamicLabels?.orders_mm || "Order"
                    }`
                  : dynamicLabels?.addOrder || "Add Order"}
              </IconButton>
              <ReactTooltip
                id="tt_AddOrder"
                type="info"
                effect="solid"
                place="bottom"
              >
                {`${dynamicLabels?.clickHereToAdd || "Click here to add"} ${
                  modelType === "MIDDLEMILE"
                    ? dynamicLabels?.orders_mm || "Order"
                    : dynamicLabels?.order_s || "Order"
                }`}
              </ReactTooltip>
              <div style={{ display: "flex", justifyContent: "center" }}>
                OR
              </div>
            </>
          ) : null}
          <IconButton
            intent="page"
            iconVariant="comoon-calendar"
            onClick={() => {
              document?.getElementById("orderListDateRange-input")?.click();
            }}
            style={{ margin: "10px" }}
          >
            {dynamicLabels["changeDate"] || "Change Date"}
          </IconButton>
        </Box>
        <TimelineContainer>
          <Box display="flex" justifyContent="center">
            <a href="#/adddeliverymedium">
              <div>
                <img src="images/noDataTemplate-deliveryMedium.png" />
                <span>
                  {dynamicLabels.addDeliveryBoy || "Add Delivery Boy"}
                </span>
              </div>
            </a>

            <a href={`${addPermission ? "#/order/addorder" : "#"}`}>
              <div>
                <img src="images/noDataTemplate-allOrders.png" />
                <span>
                  {modelType === "MIDDLEMILE"
                    ? `${dynamicLabels.add || "Add"} ${
                        dynamicLabels?.orders_mm || "Order"
                      }`
                    : dynamicLabels?.addOrder || "Add Order"}
                </span>
              </div>
            </a>

            <a href="#/trips/">
              <div>
                <img src="images/noDataTemplate-allTrips.png" />
                <span>{dynamicLabels.planTrip || "Plan Trip"}</span>
              </div>
            </a>

            <a href="#/trips/">
              <div>
                <img src="images/noDataTemplate-startTrip.png" />
                <span>{dynamicLabels.startTrip || "Start Trip"}</span>
              </div>
            </a>
          </Box>
        </TimelineContainer>
      </Box>
    </>
  );
};
export default OrdersNotAvailable;