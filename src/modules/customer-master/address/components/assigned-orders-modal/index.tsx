import React, { useEffect, useState } from "react";
import {
  ListView,
  IListViewColumn,
  IListViewRow,
  Box,
  Modal,
  ModalHeader,
  IconButton,
  Typography,
} from "ui-library";

import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";

import { fetchListViewData } from "./api";

import "./style.css";

export interface IAssingedOrdersModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Function;
  clickedRow?: any;
  dynamicLabels: any;
  columns: any;
  onModalAction: () => void
}

const AssignedOrdersModal = ({
  isModalOpen,
  setIsModalOpen,
  clickedRow,
  dynamicLabels,
  columns,
  onModalAction
}: IAssingedOrdersModalProps) => {

  const [localStateColumns, setLocalStateColumns] = useState<IListViewColumn[]>(
    []
  );
  const [modalListData, setModalListData] = useState<IListViewRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchListData = React.useCallback(
    async ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
      setLoading(true);
      const payload = [clickedRow];

      const params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
      };

      const data = await fetchListViewData(params, payload);
      setModalListData(data);
      setLoading(false);
    },
    [clickedRow]
  );

  useEffect(() => {
    const mongoStructure = columns;
    if (mongoStructure && Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "unfulfilledOrders",
        {}
      );
      setLocalStateColumns(newColumns);
    }
  }, [columns]);

  const onProceed = async () => {
    setIsModalOpen(false);
    await onModalAction();
  };

  return (
    <Modal
      open={isModalOpen}
      onToggle={() => setIsModalOpen(false)}
      size="lg"
      width="100%"
    >
      {{
        header: (
          <ModalHeader
            headerTitle={
              dynamicLabels.addressChangeConfirmation ||
              "Update Address Confirmation"
            }
            imageVariant="icomoon-close"
            handleClose={() => setIsModalOpen(false)}
            width="100%"
          />
        ),
        content: localStateColumns?.length > 0 && (
          <>
            <Typography fontSize="13px" useStyle={false}>
              <img
                src="images/outline-warning_outline.svg"
                className="assigned-order-modal__caution-image"
              />
              {dynamicLabels.proceedWarningMessage ||
                "Click on 'Proceed' to remove all these Not Dispatched Order(s) from their Trip(s) and update the address(es). All Not Dispatched Order(s) linked with these address(es) will also be updated."}
            </Typography>
            <ListView
              rowIdentifier="shipmentId"
              hasRowSelectionWithEdit={false}
              columns={localStateColumns}
              data={modalListData}
              onFetchData={fetchListData}
              loading={loading}
              isColumnLoading={loading}
              hasSelectAllRows
              hidePaginationBar
              hideColumnSettings
              style={{ height: "45vh", width: "100%", marginTop: "15px" }}
            />
          </>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              iconVariant="icomoon-angle-right"
              iconSize={11}
              onClick={onProceed}
              primary
            >
              {dynamicLabels?.proceed || "Proceed"}
            </IconButton>
            <IconButton
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => setIsModalOpen(false)}
            >
              {dynamicLabels?.cancel || "Cancel"}
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default AssignedOrdersModal;
