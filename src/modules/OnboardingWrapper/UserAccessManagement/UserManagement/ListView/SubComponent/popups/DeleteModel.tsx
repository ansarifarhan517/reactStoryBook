import React from "react";
import { Box, FontIcon, Modal, ModalHeader, IconButton } from "ui-library";
import ga from "../../../../../../../utils/ga";
import { useTypedSelector } from "../../../../../../../utils/redux/rootReducer";
import withRedux from "../../../../../../../utils/redux/withRedux";
import DYNAMIC_LABELS_MAPPING from "../../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../../common/DynamicLabels/useDynamicLabels";
import { IDeleteModal } from "../SubComponent.models";

const DeleteModal = ({
  showDeletionConfirmation,
  setShowDeletionConfirmation,
  deleteSelectedRows,
}: IDeleteModal) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.settings.users);

  // const clientId = useTypedSelector(
  //   (state) => state.settings.userManagement.listView.clientId
  // );
  const userId = useTypedSelector(
    (state) => state.settings.userManagement.listView.selectedRows
  );

  const deleteConfirmEvent = () =>
    ga.event({
      category: "Event New",
      action: `User - Delete confirmed'`,
      label: `${userId}`,
    });
  const deleteCancelEvent = () =>
    ga.event({
      category: "Event New",
      action: "User - Delete confirmed",
      label: `${userId}`,
    });

  return (
    <Modal
      open={showDeletionConfirmation}
      onToggle={(value) => {
        setShowDeletionConfirmation(value);
      }}
      width="600px"
      children={{
        header: (
          <ModalHeader
            headerTitle={dynamicLabels?.deletionConformation}
            handleClose={() => setShowDeletionConfirmation(false)}
            imageVariant="icomoon-close"
            headerStyle={{ fontSize: "15px" }}
          />
        ),
        content: (
          <div style={{ fontSize: "14px" }}>
            <div>{dynamicLabels?.delete_Confirmation_Warning}</div>
            <br />
            <Box horizontalSpacing="5px">
              <FontIcon
                color="error.main"
                variant="icomoon-warning-circled"
                size={14}
              />
              <span>
                {dynamicLabels?.delete_Confirmation_Warning_2?.substring(
                  4,
                  dynamicLabels?.delete_Confirmation_Warning_2?.length
                )}
              </span>
            </Box>
          </div>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              id='UserListView-Modal-delete'
              iconVariant="icomoon-delete-empty"
              primary
              onClick={(e) => {
                deleteSelectedRows(e);
                deleteConfirmEvent();
              }}
            >
              {dynamicLabels?.Delete || "Delete"}
            </IconButton>
            <IconButton
              id='UserListView-Modal-cancel'
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => {
                setShowDeletionConfirmation(false);
                deleteCancelEvent();
              }}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        ),
      }}
    />
  );
};

export default withRedux(DeleteModal);
