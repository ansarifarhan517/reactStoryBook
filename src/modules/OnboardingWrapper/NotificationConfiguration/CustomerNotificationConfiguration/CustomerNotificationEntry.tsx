import React, { useEffect, useState } from "react";
import CustomerNotification from "./CustomerNotification";
import withReact from "../../../../utils/components/withReact";
import { useToast } from "ui-library";

import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import {
  tUpdatedObj,
  tCustomerNotificationEntryProps,
} from "../SubComponent/Notification.model";

const CustomerNotificationEntry = ({
  currentStep,
  currentNotification,
}: tCustomerNotificationEntryProps) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.notifications);

  const [isLoading, setIsLoading] = useState(false);
  const [structureColumns, setStructureColumns] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const [showAccordion, setShowAccordion] = useState(false);

  const [expanded, setExpanded] = useState("0");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [messageTemplateSetting, setMessageTemplateSetting] =
    useState<boolean>(false);
  const [ivrAccess, setIvrAccess] = useState<boolean>(false);

  const [stateUpdated, setUpdateState] = useState<boolean>(false);
  const [updatedObj, setUpdatedObj] = useState<tUpdatedObj | {}>({});

  const toast = useToast();
  const handleToggle = (accordianId: string, isExpanded?: boolean) => {
    setExpanded(isExpanded ? accordianId : "");
    setShowAccordion(false);
  };

  const getColumnStructure = async () => {
    setIsLoading(true);
    try {
      const { data: response } = await axios.get(
        apiMappings.customerNotification.getCustomerNotificationTableStructure
      );
      setStructureColumns(Object.values(response?.columns));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getColumnsData = async () => {
    setIsLoading(true);
    const param = {
      notificationType: currentNotification,
    };
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.customerNotificationTemplates,
        { params: param }
      );
      if (response?.status === 200) {
        setColumnsData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getIvrAccess = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.customerNotification.ivrPermission
      );
      response?.propertyValue === "Y"
        ? setIvrAccess(true)
        : setIvrAccess(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getColumnStructure();
    getColumnsData();
    setShowAccordion(true);
    getIvrAccess();
  }, []);

  return (
    <CustomerNotification
      currentStep={currentStep}
      dynamicLabels={dynamicLabels}
      isLoading={isLoading}
      structureColumns={structureColumns}
      columnsData={columnsData}
      showAccordion={showAccordion}
      expanded={expanded}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      messageTemplateSetting={messageTemplateSetting}
      setMessageTemplateSetting={setMessageTemplateSetting}
      stateUpdated={stateUpdated}
      setUpdateState={setUpdateState}
      updatedObj={updatedObj}
      setUpdatedObj={setUpdatedObj}
      toast={toast}
      handleToggle={handleToggle}
      setColumnsData={setColumnsData}
      getColumnsData={getColumnsData}
      currentNotification={currentNotification}
      ivrAccess={ivrAccess}
    />
  );
};

export default withReact(CustomerNotificationEntry);
