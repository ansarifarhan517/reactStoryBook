import React, { useEffect, useState } from "react";
import {
  ListView,
  IListViewColumn,
  IListViewRow,
  Box,
  Modal,
  ModalHeader,
  useToast,
  IconButton,
  withToastProvider,
} from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { withThemeProvider } from "../../../../utils/theme";

export interface IDAMappedListViewProps {
  isModalOpen: boolean;
  setIsModalOpen: Function;
  clickedRow?: any;
  dynamicLabels: any;
}

const DAMappedListView = ({
  isModalOpen,
  setIsModalOpen,
  clickedRow,
  dynamicLabels,
}: IDAMappedListViewProps) => {
  const toast = useToast();

  const [localStateColumns, setLocalStateColumns] = useState<IListViewColumn[]>(
    []
  );
  const [modalListData, setModalListData] = useState<IListViewRow[]>([]);
  const [totalCount, setTotalCount] = useState();

  const structureColumns = useTypedSelector(
    (state) => state.bonuses.listView.modalListViewStructure?.columns
  );
  // const compartmentRowSelector = useTypedSelector((state) => state.compartmentConfiguration.comparmentPopupListData.results);
  // const compartmentListLoading = useTypedSelector((state) => state.compartmentConfiguration.comparmentPopupListData.listLoading);

  const fetchListData = React.useCallback(
    async ({ pageSize, pageNumber, sortOptions, filterOptions }) => {
      try {
        const {
          status,
          data: {
            data: { results, totalCount },
          },
        } = await axios.post(
          apiMappings.payments.bonuses.getTaggedDAListData,
          undefined,
          {
            params: {
              bonusId: clickedRow,
              pageNumber: pageNumber,
              pageSize: pageSize,
              searchBy: filterOptions?.searchBy,
              searchText: filterOptions?.searchText,
              sortBy: sortOptions?.sortBy,
              sortOrder: sortOptions?.sortOrder,
            },
          }
        );

        if (status === 200) {
          setModalListData(results);
          setTotalCount(totalCount);
        }
      } catch (error: any) {
        console.log("Error in Fetching Data", error);
        toast.add(dynamicLabels.somethingWendWrong, "warning", false);
      }
    },
    [clickedRow]
  );

  useEffect(() => {
    const mongoStructure = structureColumns;
    if (mongoStructure && Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "daMappedToBonus",
        {}
      );
      setLocalStateColumns(newColumns);
    }
  }, [structureColumns]);

  return (
    <>
      {/* COMPARTMENTS MODAL */}
      <Modal
        open={isModalOpen}
        onToggle={() => setIsModalOpen(false)}
        width="810px"
      >
        {{
          header: (
            <ModalHeader
              headerTitle={
                dynamicLabels?.taggedDA_p ||
                "Tagged Delivery Associates"
              }
              imageVariant="icomoon-close"
              width="810px"
              handleClose={() => setIsModalOpen(false)}
            />
          ),
          content:
            localStateColumns?.length > 0 ? (
              <ListView
                rowIdentifier="deliveryMediumId"
                hasRowSelectionWithEdit={false}
                columns={localStateColumns}
                data={modalListData}
                totalRows={totalCount}
                onFetchData={fetchListData}
                loading={false}
                isColumnLoading={false}
                hideRefresh={true}
                hasSelectAllRows={false}
                style={{ height: "45vh", width: "100%" }}
              />
            ) : null,
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
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
    </>
  );
};

export default withThemeProvider(
  withToastProvider(DAMappedListView, "toast-inject-here"),
  false
);
