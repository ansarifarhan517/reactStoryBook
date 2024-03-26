import React from "react";
import { Modal, ModalHeader, Box, IconButton } from "ui-library";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { tDeleteModalProps, tDeletePayload } from "./Notification.model";

const DeleteModal = ({
  showDeleteModal,
  setShowDeleteModal,
  data,
  setColumnsData,
  toast,
  dynamicLabels,
  currentNotification,
}: tDeleteModalProps) => {
  const handleClose = () => {
    setShowDeleteModal(false);
  };

  const updateStructure = async () => {
    try {
      const { data: response } = await axios.get(
        apiMappings.order.listView.customerNotificationTemplates,
        { params: { notificationType: currentNotification } }
      );
      if (response?.status === 200) {
        setColumnsData(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    const payload: tDeletePayload = {
      id: data?.id,
      name: data?.name,
      smsMessage: data?.smsMessage,
      emailSubject: data?.emailSubject,
      emailBody: data?.emailBody,
    };
    const deleteApi =
      apiMappings.order.listView.deleteCustomerNotificationTemplates;
    try {
      const { data: response } = await axios.put(deleteApi, [payload], {
        params: { notificationType: currentNotification },
      });
      if (response?.status === 200) {
        handleClose();
        updateStructure();
        toast.add(response?.message, "warning", false);
      }
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <Modal open={!!showDeleteModal} onToggle={() => {}} size="md">
      {{
        header: (
          <ModalHeader
            headerTitle="Deletion Confirmation"
            imageVariant="icomoon-close"
            handleClose={handleClose}
            width="100%"
          />
        ),
        content: (
          <Box className="sub-component__delete-msg">
            <div>
              {dynamicLabels?.delete_Confirmation_Warning ||
                "Are you sure you want to permanently delete selected record(s)?"}
            </div>
            <div className="sub-component__delete-msg__2">
              <i className="logi-icon icon-Product-Icons_Alert-Notification sub-component__delete-msg__icon-warning"></i>
              {dynamicLabels?.youCantUndoThisAction ||
                "You can't undo this action."}
            </div>
          </Box>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              primary
              id="btn_deviationReport_sendEmail"
              iconVariant="icomoon-delete-empty"
              style={{ padding: "0px 15px" }}
              onClick={handleDelete}
            >
              {dynamicLabels?.Delete || "Delete"}
            </IconButton>
            <IconButton
              id="btn_deviationReport_cancel"
              iconVariant="icomoon-close"
              style={{ padding: "0px 15px" }}
              onClick={handleClose}
            >
              {dynamicLabels?.cancel || "Cancel"}
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default DeleteModal;
