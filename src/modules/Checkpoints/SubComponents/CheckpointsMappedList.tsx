import React, { Dispatch, useCallback, useEffect, useState } from "react";
import {
  ListView,
  IListViewColumn,
  Box,
  Modal,
  ModalHeader,
  useToast,
  IconButton,
  IFetchDataOptions,
  ISelectedRows
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import store from "../../../utils/redux/store";
import { withReactOptimized } from "../../../utils/components/withReact";
import { CheckpointsListViewActions } from "../CheckpointsListView/CheckpointsListView.actions";
import { useDispatch } from "react-redux";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { ILogiAPIResponse } from "../../../utils/api.interfaces";
import { ListViewWrapper } from "../CheckpointsListView/CheckpointsListViewStyledComponent";

const CheckpointsMappedList = ({onReload}) => {
  const dispatch = useDispatch<Dispatch<CheckpointsListViewActions>>();
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});

  const {
    checkpointsMappedToRoutesModal,
    checkpointsMappedRoutesListStructure,
    checkpointsMappedRoutesListData,
    rowIds
  } = useTypedSelector((state) => state.checkpoints.listView);

  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const toast = useToast();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.checkpoints);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});

  useEffect(() => {
    dispatch({type :'@@checkpointsListView/FETCH_DROPDOWN_OPTIONS'})
  }, [])

  useEffect(() => {
    const mongoStructure = checkpointsMappedRoutesListStructure.columns;
    if (mongoStructure && Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "checkpoints",
        {}
      );
      setColumns(newColumns);
    }
  }, [checkpointsMappedRoutesListStructure.columns]);

  const fetchListData = useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {

      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });

      filterOptions.searchBy = filterOptions?.searchBy ? filterOptions?.searchBy.concat('#@#isActiveFl') : 'isActiveFl';
      filterOptions.searchText = filterOptions?.searchText ? filterOptions?.searchText.concat('#@#Y') : 'Y';
      dispatch({
        type: "@@checkpointsListView/FETCH_CHECKPOINTS_MAPPED_ROUTES_LIST_DATA",
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions.searchBy,
          searchText: filterOptions.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
        },
      });
    },
    []
  );

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  const handleSave = async () => {
    try {
      const { data: response } = await axios.post<ILogiAPIResponse<boolean>>(
        apiMappings.checkpoints.checkpointsMappedToRoutes.addCheckpoint,
        {
          routeConfigIds : rowIds,
          checkpointIds : Object.keys(selectedRows).map(key => parseInt(key))
        }
      );

      if (!response.hasError && response.status === 200) {
        toast.add(response.message, "check-round", false);
        dispatch({
          type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL",
          payload: false,
        });
        onReload(true)
      }
    } catch (errorResponse: any) {
      console.log(errorResponse);
      toast.add(
        errorResponse?.message ||
          errorResponse?.response?.message ||
          dynamicLabels.somethingWentWrong ? dynamicLabels.somethingWentWrong : "Something Went Wrong",
        "warning",
        false
      );
    }
  };

  return (
    <>
      {/* Checkpoints Modal */}
      <Modal
        open={checkpointsMappedToRoutesModal}
        onToggle={() =>
          store.dispatch({
            type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL",
            payload: false,
          })
        }
        width="810px"
      >
        {{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels.checkpoint_p ? dynamicLabels.checkpoint_p : "Checkpoints"}
              imageVariant="icomoon-close"
              width="810px"
              handleClose={() =>
                store.dispatch({
                  type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL",
                  payload: false,
                })
              }
            />
          ),
          content:
            columns?.length > 0 ? (
              <ListViewWrapper>
                <ListView
                  rowIdentifier="checkpointId"
                  hasRowSelectionWithEdit={false}
                  columns={columns}
                  data={checkpointsMappedRoutesListData?.results}
                  totalRows={checkpointsMappedRoutesListData?.totalCount}
                  onFetchData={fetchListData}
                  onRowSelect={onRowSelect}
                  loading={false}
                  isColumnLoading={false}
                  hasSelectAllRows={true}
                  hideRefresh={false}
                  hasRowSelection={true}
                  className="listView"
                />
              </ListViewWrapper>
            ) : null,
          footer: (
            <Box
              horizontalSpacing="10px"
              display="flex"
              justifyContent="flex-end"
              p="15px"
            >
              <IconButton
                iconVariant="icomoon-save"
                primary
                iconSize={11}
                onClick={() => handleSave()}
                id="routesListView--addCheckpoints--save"
              >
                {dynamicLabels.save ? dynamicLabels.save : "Save"}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                primary
                iconSize={11}
                onClick={() =>
                  store.dispatch({
                    type: "@@checkpointsListView/SET_CHECKPOINTS_MAPPED_TO_ROUTES_MODAL",
                    payload: false,
                  })
                }
                id="routesListView--addCheckpoints--cancel"
              >
                {dynamicLabels.cancel ? dynamicLabels.cancel : "Cancel"}
              </IconButton>
            </Box>
          ),
        }}
      </Modal>
    </>
  );
};

export default withReactOptimized(CheckpointsMappedList, false);
