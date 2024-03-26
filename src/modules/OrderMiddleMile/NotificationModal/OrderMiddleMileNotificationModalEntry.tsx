import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import withReact from "../../../utils/components/withReact";
import OrderMiddleMileNotificationModal from "./OrderMiddleMileNotificationModal";

import "./OrderMiddleMileNotificationModalStyles.scss";
import { tOrderMiddleMileNotificationModalEntryProps } from "./OrderMiddleMileNotificationModal.model";

const OrderMiddleMileNotificationModalEntry = ({
  selectedRows,
  templateDataIndex,
  openModal = false,
  onClose,
}: tOrderMiddleMileNotificationModalEntryProps) => {

  const [selectedTheRows, setSelectedRows] = useState(selectedRows);

  const [notifyTemplateData, setNotifyTemplateData] = useState([]);

  const getStructureData = async () => {
    try {
      const url =
        apiMappings.order.listView.templates +
        "?notificationType=ORDER_ALLMILE";
      const { data: response } = await axios.get(url);
      setNotifyTemplateData(response?.data[templateDataIndex]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStructureData();
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {notifyTemplateData && Object.keys(notifyTemplateData)?.length && (
        <OrderMiddleMileNotificationModal
          showNoitfyOrderModal={openModal}
          handleClose={handleClose}
          notifyObject={notifyTemplateData}
          selectedRows={selectedTheRows}
        />
      )}
    </>
  );
};

export default withReact(OrderMiddleMileNotificationModalEntry);
