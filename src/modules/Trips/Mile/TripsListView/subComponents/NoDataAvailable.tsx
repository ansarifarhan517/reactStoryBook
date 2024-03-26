import React, { ReactElement } from "react";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import NoDataView from "../../../../../utils/components/NoDataView";
import { Box } from "ui-library";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

interface INoDataAvailable {}

export default function NoDataAvailable({}: INoDataAvailable): ReactElement {
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);

  const openCalendar = () => {
    document?.getElementById("id-tripdateRangeInputField-input")?.click();
  };
  const payload = {
    image: "images/noDataTemplate-allTrips.png",
    message: dynamicLabels.noDataTemplate_trips,
    buttonList: [
      {
        name: dynamicLabels.planTrip,
        icon: "icomoon-add",
        href: "planning",
      },
      {
        name: dynamicLabels.changeDateRange,
        icon: "icomoon-calendar",
        onButtonClick: openCalendar,
      },
    ],
    timelineContainer: [
      {
        href: "#/adddeliverymedium",
        image: "images/noDataTemplate-deliveryMedium.png",
        label: dynamicLabels.addDeliveryBoy,
        id: dynamicLabels.addDeliveryBoy,
      },

      {
        href: "#/order/addorder",
        image: "images/noDataTemplate-allOrders.png",
        label: dynamicLabels.addOrder,
        id: dynamicLabels.addOrder,
      },
      {
        href: "#/planning/",
        image: "images/noDataTemplate-allTrips.png",
        label: dynamicLabels.planTrip,
        id: dynamicLabels.planTrip,
      },
    ],
  };

  const styledClassess = {
    primaryImage: {
      width: "400px",
      height: "224px",
    },
    styledButtons: {
      maxHeight: "40px",
    },
  };

  return (
    <div>
      <Box>
        <NoDataView
          image={payload.image}
          message={payload.message}
          buttonList={payload.buttonList}
          styledClassess={styledClassess}
          parentMargin={"3%"}
          timelineContainer={payload.timelineContainer}
        />
      </Box>
    </div>
  );
}
