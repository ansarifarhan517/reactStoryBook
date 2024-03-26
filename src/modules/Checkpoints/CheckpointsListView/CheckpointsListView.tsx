import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import withRedux from "../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../utils/theme";
import {
  withToastProvider,
  withPopup,
  Box,
  BreadCrumb,
  IconButton,
  ListView,
  Tooltip,
  Grid,
  IListViewColumn,
  ISelectedRows,
  IFetchDataOptions,
  useToast,
  IconDropdown,
} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { useDispatch } from "react-redux";
import { CheckpointsListViewActions } from "./CheckpointsListView.actions";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { ColumnInstance } from "react-table";
import { IRowData } from "./CheckpointsListView.models";
import CheckPointsListMap from "./CheckpointsListMap";
import { BoxWrapper, StyledCard, StyledGrid } from "./CheckpointsListViewStyledComponent";
import { IStateService } from "angular-ui-router";
import PageActionButtons from "../SubComponents/PageActionButton";
import UploadExcel from "../../../utils/wrapper/uploadExcel";
import DeleteConfirmationModal from "../../../utils/components/DeleteConfirmationModal";
import iconsMapping from "../../../utils/mongo/ListView/actionBarIcons.mapping";
import ActivateDeactivateModal from "../../../utils/components/ActivateDeactivateModal";
import { CheckpointsFormActions } from "../CheckpointsForm/CheckpointsForm.actions";
import DownloadMessage from "../../../utils/components/DownloadMessage";
import AdvancedFilterComponent from "../../common/AdvancedFilterComponent";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { getSocketConnection } from "./utils";
import { difference } from "lodash";
import RoutesMappedPopupView from "./ModalDetailsView/RoutesMappedPopup";
import {
  AdvancedFilterLabel,
  AppliedFilterStrip,
  ButtonWrapper,
  FilterAppliedTag,
  FilterAppliedTagButtonWrapper,
  FilterAppliedTagLabel,
} from "../../OrderRequest/OrderRequestListView/StyledOrderRequestListView";
import { hybridRouteTo } from "../../../utils/hybridRouting";

export interface ICheckpointsListViewProp {
  ngStateRouter: IStateService;
}

const CheckpointsListView = ({ ngStateRouter }: ICheckpointsListViewProp) => {
  // Hooks
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [isDownloadReportDisabled, setDownloadReportDisabled] =
    useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [checkpointActivationRequest, setCheckpointActivationRequest] =
    useState<
      | {
          activeRequest: boolean;
          rowIds: Record<number, boolean>;
          message?: string | undefined;
          failureCallback?: React.Dispatch<React.SetStateAction<boolean>>;
        }
      | undefined
    >();
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState<boolean>(false);
  const [isModalListViewOpen, setModalListViewOpen] = useState<boolean>(false);
  const [lastSelectedRow, setLastSelectedRow] = useState<any>(null);
  const rowSelectedOrder = useRef<Set<string>>(new Set());
  const [popupRouteDetails, setPopupRouteDetails] = useState([]);

  //Custom Hooks
  const dispatch = useDispatch<Dispatch<CheckpointsListViewActions>>();
  const formDispatch = useDispatch<Dispatch<CheckpointsFormActions>>();
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.checkpoints}`);
  const toast = useToast();

  const { structure, loading, data, viewMode, uploadModal } = useTypedSelector(
    (state) => state.checkpoints.listView
  );

  //filter related states
  const advanceFilterdispatch =
    useDispatch<Dispatch<AdvancedFilterComponentActions>>();

  const { filterListPayload, openAdvFilter, advancedFilterData, currentFilter } = useTypedSelector(
    (state) => state.advanceFilter
  );
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);

  // use Effects
  useEffect(() => {
    handleFetchFilters();
    dispatch({
      type: "@@checkpointsListView/SET_COLUMNS_LOADING",
      payload: { columns: true },
    }),
      dispatch({
        type: "@@checkpointsListView/FETCH_MODAL_LISTVIEW_STRUCTURE",
      });
    dispatch({ type: "@@checkpointsListView/FETCH_DROPDOWN_OPTIONS" });
    dispatch({
      type: "@@checkpointsListView/SET_FORM_EDITABLE",
      payload: false,
    });
  }, []);

  useEffect(() => {
    if (viewMode === "listview") {
      dispatch({ type: "@@checkpointsListView/FETCH_STRUCTURE" });
    } else {
      dispatch({ type: "@@checkpointsListView/FETCH_MAP_VIEW_STRUCTURE" });
    }
  }, [viewMode]);

  useEffect(() => {
    let mongoStructure = structure?.columns;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "checkpoints",
        cellCallbackMapping
      );
      setColumns(newColumns);
    }
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_COLUMNS_SELECTOR",
      payload: structure?.columns,
    });
  }, [structure?.columns]);

  const handleActiveFlChange = (
    isChecked: boolean,
    { checkpointId }: IRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const checkpointIds = { [checkpointId]: true };
    setCheckpointActivationRequest({
      activeRequest: isChecked,
      rowIds: checkpointIds,
      failureCallback,
    });
  };

  const onDaCountClick = async (row: any) => {
    try {
      const {
        data: { data },
      } = await axios.get(
        `${apiMappings.checkpoints.listView.associatedRoute}${row?.checkpointId}`
      );
      data.length > 0
        ? (setPopupRouteDetails(data), setModalListViewOpen(true))
        : toast.add(dynamicLabels.noDataAvailable ? dynamicLabels.noDataAvailable : "No Data Available", "warning", false);
    } catch (error) {
      console.log("error", error);
      toast.add(dynamicLabels.somethingWentWrong ? dynamicLabels.somethingWentWrong : "Something Went Wrong!", "warning", false);
    }
  };

  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange,
    routeCount: onDaCountClick,
  };

  const breadCrumbOptions = useMemo(
    () => [
      {
        id: "routes",
        label: dynamicLabels.route_p ? dynamicLabels.route_p : "Routes",
      },
      {
        id: "checkpointsListView",
        label: dynamicLabels.allCheckpoints ? dynamicLabels.allCheckpoints : "All Checkpoints",
      },
    ],
    [dynamicLabels]
  );

  //handleFetchData() fetches the data of the listView.
  const handleFetchData = useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
      dispatch({
        type: "@@checkpointsListView/SET_DATA_LOADING",
        payload: { listView: true },
      });
      advanceFilterdispatch({
        type: "@@advanceFilter/SET_FETCH_OPTIONS",
        payload: { pageSize, pageNumber, sortOptions, filterOptions, apis },
      });

      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });

      dispatch({
        type: "@@checkpointsListView/FETCH_DATA",
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy === "checkpointRadiusOrArea" ? "radiusInKms" : filterOptions?.searchBy,
          searchText: filterOptions?.searchText ,
          sortBy: sortOptions?.sortBy === "checkpointRadiusOrArea" ? "radiusInKms" : sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
        },
      });
    },
    []
  );

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);

    const rowsKeys = Object.keys(s);
    //find unselected indices
    const deselectedIndex = difference(
      Array.from(rowSelectedOrder?.current),
      rowsKeys
    );
    //remove the unselected indices
    if (deselectedIndex?.length === rowsKeys?.length) {
      rowSelectedOrder?.current.clear();
    } else {
      rowSelectedOrder?.current.forEach((r) => {
        if (deselectedIndex.includes(r)) {
          rowSelectedOrder.current.delete(r);
        }
      });
    }
    //add the selected indices
    rowsKeys?.map((r) => {
      if (!rowSelectedOrder?.current.has(r)) {
        rowSelectedOrder?.current.add(r);
      }
    });
    const lastIndex = parseInt(
      Array.from(rowSelectedOrder?.current).pop() as string
    );
    setLastSelectedRow({ ...s[lastIndex] });
  }, []);

  const onSaveColumnPreferences = useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      const columns = { ...structure.columns };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });
      const payload = {
        ...structure,
        columns,
      };
      try {
        const {
          data: { message },
        } = await axios.put(
          apiMappings.checkpoints.listView.structure,
          payload
        );
        message && toast.add(message, "check-round", false);
      } catch (error) {
        console.log(error, "An error occured");
      }
    },
    [structure?.columns]
  );

  const onRowEditClick = (row: IRowData) => {
    dispatch({
      type: "@@checkpointsListView/SET_FORM_EDITABLE",
      payload: true,
    });
    hybridRouteTo(`updateCheckpoint?Id=${row.checkpointId}`);
    formDispatch({
      type: "@@checkpointsForm/SET_DATA",
      payload: row,
    });

    setSelectedRows({});
  };

  const deleteSelectedRows = async (id?: number) => {
    setShowDeletionConfirmation(false);
    try {
      const payload = !isNaN(id as number) ? [id] : Object.keys(selectedRows).map((key) => Number(key));
      const { data: data } = await axios.delete(
        apiMappings.checkpoints.listView.deleteRequest,
        { data: payload }
      );

      if (data.status === 200) {
        toast.add(`${data?.message}`, "check-round", false);
        setSelectedRows({});
        fetchOptions.apis?.resetSelection();
        handleFetchData(fetchOptions);
        return;
      }
      throw toast.add(`${data?.message}`, "warning", false);
    } catch (errorMessage) {
      toast.add(dynamicLabels.checkpointFailedToDelete ? dynamicLabels.checkpointFailedToDelete : "Checkpoint Failed To Delete", "warning", false);
    }
  };

  const buttonToolTipTextList = {
    delete: `${dynamicLabels?.clickheretoDeleteTheSelected} ${dynamicLabels?.geofence_p}.`,
  };

  const buttonList = React.useMemo(() => {
    const buttonArray: any = [];
    structure?.buttons &&
      Object.keys?.(structure?.buttons)?.forEach((buttonKey) => {
        if (structure?.buttons?.[buttonKey]?.permission) {
          buttonArray.push(buttonKey);
        }
      });
    return buttonArray;
  }, [structure?.buttons]);

  const handleDownloadReport = async () => {
    const hitStamp = Date.now().toString();
    getSocketConnection(hitStamp, "checkpointreport", dynamicLabels, toast);
    setDownloadReportDisabled(true);
    setShowInfoModal(true);

    const params: any = {
      pageNumber: fetchOptions?.pageNumber,
      pageSize: fetchOptions?.pageSize,
      searchBy:
        fetchOptions?.filterOptions?.searchBy === "checkpointRadiusOrArea"
          ? "radiusInKms"
          : fetchOptions?.filterOptions?.searchBy,
      searchText: fetchOptions?.filterOptions?.searchText,
      sortBy:
        fetchOptions?.sortOptions?.sortBy === "checkpointRadiusOrArea"
          ? "radiusInKms"
          : fetchOptions?.sortOptions?.sortBy,
      sortOrder: fetchOptions?.sortOptions?.sortOrder,
      hitStamp: hitStamp,
    };

    try {
      await axios.post(
        apiMappings.checkpoints.listView.downloadReport,
        {},
        {
          params,
        }
      );
      setDownloadReportDisabled(false);
    } catch {
      setDownloadReportDisabled(false);
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  };

  /* Advance Filter */
  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    if (
      (!isFilterDataCalled &&
        ((advancedFilterData.length > 0 &&
          advancedFilterData[0].sectionName != "CHECKPOINTS_LIST_VIEW") ||
          advancedFilterData?.length == 0)) ||
      callBackAdvanceFilter
    ) {
      setIsFilterDataCalled(true);
      try {
        const { data } = await axios.get(
          apiMappings.advancedSearch.getFilters,
          {
            params: {
              modelName: "CHECKPOINTS",
              pageName: "CHECKPOINTS",
              sectionName:
                viewMode === "listview"
                  ? "CHECKPOINTS_LIST_VIEW"
                  : "GEOFENCEMASTER_MAP_VIEW",
            },
          }
        );
        if (data) {
          setIsFilterDataCalled(false);
          const isFavouriteFilter = data.find(
            (filter: { isFavourite: boolean }) => filter?.isFavourite
          );
          if (isFavouriteFilter) {
            advanceFilterdispatch({
              type: "@@advanceFilter/SET_APPLIED_ADV_FILTER_DATA",
              payload: isFavouriteFilter?.filters,
            });
          }
          advanceFilterdispatch({
            type: "@@advanceFilter/SET_ADV_FILTER_DATA",
            payload: data,
          });
        }
        return;
      } catch (errorMessage) {
        toast.add(dynamicLabels.updateFilterFailed, "warning", false);
      }
    }
  };

  // Handle Remove filters
  const handleRemoveFilter = (showToast: boolean) => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_FILTERLIST_PAYLOAD",
      payload: undefined,
    });
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_CURRENT_FILTERS",
      payload: undefined,
    });
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: false,
    });
    dispatch({
      type: "@@checkpointsListView/FETCH_DATA",
      payload: { isLoading: true },
    });
    showToast &&
      toast.add(dynamicLabels?.filterRemovedSuccessfully ? dynamicLabels?.filterRemovedSuccessfully : "Filter Removed Successfully.", "check-round", false);
  };

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: !openAdvFilter,
    });
  };

  const AdvanceFilterData = {
    sectionName: "checkpoints",
  };

  const MoreButtonOptionList = React.useMemo(() => {
    const moreButtonsArray: any = [];
    structure.buttons &&
      structure.buttons?.["more"]?.["childNodes"] &&
      Object.keys?.(structure.buttons["more"]["childNodes"])?.forEach(
        (buttonKey) => {
          moreButtonsArray.push({
            value: buttonKey,
            label: structure.buttons["more"]?.["childNodes"]?.[buttonKey].label,
            tooltipText:
              structure.buttons["more"]?.["childNodes"]?.[buttonKey]?.label,
          });
        }
      );
    return moreButtonsArray;
  }, [dynamicLabels, structure.buttons]);

  const handleMoreOptions = React.useCallback(
    async (id: string) => {
      const selectedRowValues = Object.values(selectedRows);
      switch (id) {
        case "inActive":
        case "active":
          {
            /** Validate for marking already Active or Inactive tracker */
            const hasInvalidRequest = selectedRowValues.some((row) => {
              if (
                (id === "inActive" && !row.isActiveFl) ||
                (id === "active" && row.isActiveFl)
              ) {
                return true;
              }
              return false;
            });

            if (hasInvalidRequest) {
              toast.add(
                id === "active"
                  ? (dynamicLabels.checkpointAlreadyActive ? dynamicLabels.checkpointAlreadyActive : "Checkpoint(s) Already Active")
                  : (dynamicLabels.checkpointAlreadyInactive ? dynamicLabels.checkpointAlreadyInactive : "Checkpoint(s) Already Inactive"),
                "warning",
                false
              );
              return;
            }

            let checkpointIdsArray = [];
            let checkpointIds = {};
            selectedRowValues.forEach((row) => {
              const data = {};
              data["checkpointId"] = row.checkpointId;
              checkpointIdsArray.push(data);
              checkpointIds[row.checkpointId] = true;
            });
            setCheckpointActivationRequest({
              activeRequest: id === "active",
              rowIds: checkpointIds,
            });
          }
          break;
      }
    },
    [selectedRows, dynamicLabels]
  );

  return (
    <>
      <div id="toast-inject-here"></div>
      <BoxWrapper>
        <Box
          display="flex"
          mt="64px"
          flexDirection="column"
          px="15px"
          pb="15px"
          className="listViewBox"
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            py="15px"
            className="boxInsideBox"
          >
            <div>
              <BreadCrumb options={breadCrumbOptions} onClick={() => {}} />
              {filterListPayload && (
                <Tooltip
                  tooltipDirection="bottom"
                  messagePlacement="center"
                  hover
                  message={
                    <div className="tooltipDiv">
                      <Box mb="10px">
                        Filters are applied on{" "}
                        {filterListPayload.operationLogic === "AND"
                          ? "ALL"
                          : "ANY"}{" "}
                        of the the following conditions:
                      </Box>
                      {currentFilter &&
                        currentFilter?.filters &&
                        currentFilter?.filters.map((f: any, i) => {
                          return (
                            <Box key={f} mb="5px">{`${i + 1}. ${f.fieldLabelKey} ${
                              f?.labelValue || f?.operationLabelKey
                            } ${
                              f.filterDataLabel ? f.filterDataLabel : f.filterData
                            }`}</Box>
                          );
                        })}

                      <div>
                        {currentFilter?.sortCriteria &&
                          currentFilter?.sortCriteria[0] && (
                            <Box mb="5px">
                              {currentFilter?.sortCriteria[0]?.fieldLabelKey +
                                " " +
                                currentFilter?.sortCriteria[0]?.operationSymbol}
                            </Box>
                          )}
                      </div>
                    </div>
                  }
                >
                  <FilterAppliedTag>
                    <FilterAppliedTagLabel onClick={handleOpenAdvancedFilter}>
                      {currentFilter?.filterName?.trim() || "Filter Applied"}
                    </FilterAppliedTagLabel>
                    <FilterAppliedTagButtonWrapper>
                      <IconButton
                        onClick={() => handleRemoveFilter(true)}
                        onlyIcon
                        iconVariant="close"
                        iconSize={10}
                        color="error.main"
                      />
                    </FilterAppliedTagButtonWrapper>
                  </FilterAppliedTag>
                </Tooltip>
              )}
            </div>

            {/* Page Action Buttons */}
            <PageActionButtons ngStateRouter={ngStateRouter} />
          </Box>
          <StyledGrid
            container
            spacing={15}
            style={{
              boxShadow: viewMode === "listview" ? "0 2px 20px -10px #000" : "",
            }}
          >
            <Grid
              className="grid-customised-scroll-bar gridDisplay"
              sm={viewMode === "listview" ? 12 : 4}
              lg={viewMode === "listview" ? 12 : 4}
              md={viewMode === "listview" ? 12 : 4}
              item
            >
              {filterListPayload && (
                <AppliedFilterStrip>
                  <AdvancedFilterLabel>
                    Advanced Filter Applied
                  </AdvancedFilterLabel>
                  <ButtonWrapper onClick={() => handleRemoveFilter(true)}>
                    <IconButton
                      onlyIcon
                      iconVariant="close"
                      iconSize={8}
                      color="grey"
                    />
                    <span>Clear Filter</span>
                  </ButtonWrapper>
                </AppliedFilterStrip>
              )}
              <StyledCard>
                <ListView
                  rowIdentifier="checkpointId"
                  columns={columns}
                  data={data?.results}
                  totalRows={data?.totalCount}
                  onFetchData={handleFetchData}
                  onRowSelect={onRowSelect}
                  loading={loading?.listView || false}
                  isColumnLoading={loading?.columns}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  hasSelectAllRows={true}
                  hasRowSelection={ !structure?.buttons?.['update']?.permission}
                  hasRowSelectionWithEdit={structure?.buttons?.['update']?.permission}
                  onRowEditClick={onRowEditClick}
                  hideRefresh={loading?.listView}
                  className="listView"
                >
                  {viewMode === "listview"
                    ? {
                        IconBar: (
                          <>
                            <Tooltip
                              message={`${dynamicLabels.download} ${dynamicLabels.report}.`}
                              hover={true}
                              tooltipDirection="bottom"
                              arrowPlacement="center"
                              messagePlacement="end"
                            >
                              <IconButton
                                onlyIcon
                                primary={false}
                                disabled={isDownloadReportDisabled}
                                onClick={handleDownloadReport}
                                iconSize={16}
                                iconVariant="icomoon-download"
                                intent="page"
                                className="color"
                                id="checkpointsListView--actionBar-download"
                              />
                            </Tooltip>

                            <AdvancedFilterComponent
                              handleRemoveFilter={handleRemoveFilter}
                              handleFetchData={handleFetchData}
                              data={AdvanceFilterData}
                              handleFetchFilters={handleFetchFilters}
                              pageName="checkpointsListView"
                            />
                          </>
                        ),
                        ActionBar: (
                          <Box display="flex" horizontalSpacing="10px">
                            {structure.buttons &&
                              Object.keys(structure.buttons).map(
                                (buttonKey, index) =>
                                  buttonKey === "more" ? (
                                    <div
                                      key={buttonKey}
                                    >
                                      <IconDropdown
                                        variant={"button-dropdown"}
                                        optionList={MoreButtonOptionList}
                                        width="120px"
                                        iconButtonDetails={[
                                          "icomoon-funnel-options",
                                          structure.buttons[buttonKey].label,
                                          "icomoon-angle-bottom",
                                        ]}
                                        disabled={
                                          !Object.keys(selectedRows).length
                                        }
                                        intent="table"
                                        onChange={handleMoreOptions}
                                        isSingleClickOption
                                        tooltipMessage={structure?.buttons[buttonKey].label}
                                        id="checkpointsListView--actionBar-more"
                                      />
                                    </div>
                                  ) : (
                                    structure.buttons[buttonKey].permission &&
                                    buttonKey === "delete" && (
                                      <Tooltip
                                        key={buttonKey}
                                        message={`Click here to ${structure?.buttons[buttonKey].labelKey} the selected ${dynamicLabels.checkpoint_p}`}
                                        hover
                                        messagePlacement={
                                          index === 0 ? "start" : "center"
                                        }
                                      >
                                        <IconButton
                                          key={buttonKey}
                                          disabled={
                                            !Object.keys(selectedRows).length
                                          }
                                          intent="table"
                                          iconVariant={iconsMapping[buttonKey]}
                                          id={`listView-actionBar-${buttonKey}`}
                                          onClick={() => {
                                            setShowDeletionConfirmation(true);
                                          }}
                                        >
                                          {structure.buttons[buttonKey].label}
                                        </IconButton>
                                      </Tooltip>
                                    )
                                  )
                              )}
                          </Box>
                        ),
                      }
                    : undefined}
                </ListView>
              </StyledCard>
            </Grid>
            {viewMode === "mapview" && (
              <Grid item md={8} className="mapView">
                <CheckPointsListMap
                  lastSelectedRow={lastSelectedRow}
                  deleteCheckpoint={deleteSelectedRows}
                />
              </Grid>
            )}
          </StyledGrid>
        </Box>
      </BoxWrapper>
      {/* ACTIVATION CONFIRMATION MODAL */}
      {checkpointActivationRequest && (
        <ActivateDeactivateModal
          activationRequest={checkpointActivationRequest}
          setActivationRequest={setCheckpointActivationRequest}
          fetchOptions={fetchOptions}
          handleFetchData={handleFetchData}
          setSelectedRows={setSelectedRows}
          url={apiMappings.checkpoints.listView.activationRequest}
          setEditMode={setEditMode}
        />
      )}
      <UploadExcel
        isOpen={uploadModal}
        featureName="checkpoints"
        onSuccess={() => {
          dispatch({
            type: "@@checkpointsListView/SET_UPLOAD_MODAL",
            payload: false,
          });
          handleFetchData(fetchOptions);
        }}
        onClose={() => {
          dispatch({
            type: "@@checkpointsListView/SET_UPLOAD_MODAL",
            payload: false,
          });
        }}
      />
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) =>
          setShowDeletionConfirmation(value)
        }
        deleteSelectedRows={deleteSelectedRows}
      />
      {isModalListViewOpen && (
        <RoutesMappedPopupView
          popupRouteDetails={popupRouteDetails}
          isModalOpen={isModalListViewOpen}
          setIsModalOpen={setModalListViewOpen}
          dynamicLabels={dynamicLabels}
        />
      )}
      {showInfoModal && (
        <DownloadMessage
          showInfoModal={showInfoModal}
          onToggle={setShowInfoModal}
        />
      )}
    </>
  );
};

export default withThemeProvider(
  withToastProvider(
    withRedux(withPopup(CheckpointsListView)),
    "toast-inject-here"
  )
);
