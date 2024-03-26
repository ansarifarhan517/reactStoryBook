import React, { Dispatch, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { SortingRule, ColumnInstance } from "react-table";

import {
  IconButton,
  Box,
  ListView,
  useToast,
  IFetchDataOptions,
  ISelectedRows,
  IFilterOptions,
  ISortOptions,
  IListViewColumn,
  Tooltip,
  Typography,
} from "ui-library";

import { getQueryParams } from "../../../../../utils/hybridRouting";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import {
  throwError,
  validateRows,
} from "../../../../common/InlineEdit/InlineEdit";
import {
  IMongoColumnOnlyStructure,
  IMongoListViewStructure,
} from "../../../../../utils/mongo/interfaces";

import AdditionalContactsModal from "./components/additional-contacts-modal";
import { IAllAddressListActions } from "./redux/action";
import { dummyColumns, dummyResult, ngStateRouterOptions } from "./utils";
import { BodyCardContainer, BodyGrid, BodyGridItem } from "./style";
import {
  fetchListViewData,
  fetchListViewStructure,
  putActiveInactiveStatus,
  putListViewStructure,
  fetchModalStructure,
  putInlineAddressUpdates,
} from "./api";

import "./style.css";

const AddressList = ({ dynamicLabels, ngStateRouter }) => {
  const toast = useToast();

  const dispatch = useDispatch<Dispatch<IAllAddressListActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  // Redux states
  const addressType = useTypedSelector(
    (state) => state.all_addresses.listView.addressType
  );
  const weekDays = useTypedSelector(
    (state) => state.all_addresses.listView.weekDays
  );
  const inlineEdits = useTypedSelector(
    (state) => state.all_addresses.listView.inlineEdits
  );

  // Local states
  const [listColumns, setListColumns] = useState<IListViewColumn[]>([]); // columns, setColumns
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [structure, setStructure] = useState<IMongoListViewStructure>({
    buttons: {},
    columns: dummyColumns,
  });

  const [modalStructure, setModalStructure] =
    useState<IMongoColumnOnlyStructure>({ columns: {} });

  const [loading, setLoading] = useState({
    data: true,
    structure: true,
  });

  const [listViewResponse, setListViewResponse] = useState({
    results: dummyResult,
    totalCount: -1,
  });

  // Modal States
  const [modalVisibility, setModalVisibility] = useState(false);
  const [clickedRow, setClickedRow] = useState();

  // Local Values
  const structureColumns = structure?.columns;
  const structureButtons = structure?.buttons;

  const listViewData = listViewResponse?.results;
  const rowCount = listViewResponse?.totalCount;

  const isStructureLoading = loading?.structure;
  const isDataLoading = loading?.data;

  /* CELL CALLBACKS i.e. IF CELL IS CLICKED WHAT SHOULD BE HAPPENING? Mappings with cells is done below. */
  const onAlternateContactClick = (row: any) => {
    setModalVisibility(true);
    setClickedRow(row.clientNodeId);
  };

  const onStatusConfirmation = async (
    isActiveFl: boolean,
    selectedClientNodeId: string | number,
    rowData: any
  ) => {
    globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
    const payload = {
      clientNodeId: selectedClientNodeId,
      isactive: isActiveFl,
    };
    const { response, isError } = await putActiveInactiveStatus(payload);

    !isError &&
      setListViewResponse((prevList) => {
        return {
          ...prevList,
          results: prevList.results?.map((row) => {
            if (row.clientNodeId === selectedClientNodeId) {
              return { ...rowData, isActiveFl: isActiveFl };
            } else return row;
          }),
        };
      });
    toast.add(response, isError ? "warning" : "check-round", false);
  };

  const onToggleClick = (toggleValue, row, setActive) => {
    // toggleValue is the value of toggle after your action. Eg: You turned toggle on then it's true.
    globalPopupDispatch({
      type: "@@globalPopup/SET_PROPS",
      payload: {
        isOpen: true,
        title: dynamicLabels.statusConfirmation || "Status Confirmation",
        content: (
          <div className="all-addresses__status-modal-content">
            {toggleValue
              ? dynamicLabels.areYouSureYouWantToMarkAsAcitve ||
                "Are you sure you want to mark as Active?"
              : dynamicLabels.areYouSureYouWantToMarkAsInactive ||
                "Are you sure you want to mark as Inactive?"}
            <div className="all-addresses__status-modal-note">
              <strong>Note:</strong>{" "}
              {dynamicLabels.thisWillNotImpactExistingOrdersCreatedForThisAddress ||
                "This will not impact existing Orders created for this Address"}
            </div>
          </div>
        ),
        footer: (
          <>
            <IconButton
              iconVariant="icomoon-tick-circled"
              primary
              onClick={() =>
                onStatusConfirmation(toggleValue, row.clientNodeId, row)
              }
            >
              {dynamicLabels.ok || "Ok"}
            </IconButton>
            <IconButton
              iconVariant="icomoon-close"
              onClick={() => {
                setActive(!toggleValue);
                globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
              }}
            >
              {dynamicLabels.cancel || "Cancel"}
            </IconButton>
          </>
        ),
      },
    });
  };

  // On column Click some callback function should be called. Do the Mapping here with the key of the column which function to run.
  const cellCallbackMapping = {
    addressContactCount: onAlternateContactClick,
    isActiveFl: onToggleClick,
  };

  // INLINE EDIT FUNCTIONS
  const validateSelectedRows = () => {
    const columnStructure = structureColumns;
    try {
      validateRows(inlineEdits, columnStructure);
    } catch (error: any) {
      throwError(error);
      if (error.message) {
        toast.add(error.message, "", false);
      }
      return false;
    }
    return true;
  };

  const onUpdateClick = () => {
    setEditMode(true);
  };

  const onSaveClick = async () => {
    // setEditMode(false);

    const isValid = validateSelectedRows();

    if (!isValid) {
      return;
    }

    const payload: Partial<any>[] = [];
    Object.values(selectedRows).forEach((row) => {
      if (inlineEdits?.[row.clientNodeId]) {
        const obj: any = {
          clientNodeId: row.clientNodeId,
        };
        Object.keys(structureColumns).forEach((columnId) => {
          if (
            structureColumns?.[columnId]?.editable &&
            !structureColumns?.[columnId]?.customField
          ) {
            if (columnId === "weeklyOffString") {
              obj["weeklyOff"] =
                inlineEdits?.[row.clientNodeId]?.[columnId]?.value?.split(
                  ","
                ) || row[columnId].split(",");
            }
            obj[columnId] =
              inlineEdits?.[row.clientNodeId]?.[columnId]?.value ||
              row[columnId];
          }
        });

        payload.push(obj);
      }
    });

    if (!payload.length) {
      onCancelClick();
      return;
    }

    const { message, hasError } = await putInlineAddressUpdates(payload);

    if (!hasError) {
      handleFetchData(fetchOptions);
      setEditMode(false);
      setSelectedRows({});
      fetchOptions.apis?.resetSelection();
      dispatch({ type: "@@ALL_ADDRESSES/CLEAR_INLINE_EDITS" });
      toast.add(message, "check-round", false);
      return;
    } else {
      toast.add(message || dynamicLabels.somethingWendWrong, "warning", false);
    }
  };

  const onCancelClick = React.useCallback(() => {
    dispatch({ type: "@@ALL_ADDRESSES/CLEAR_INLINE_EDITS" });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
    setSelectedRows({});
  }, [fetchOptions]);

  useEffect(() => {
    (async () => {
      const response = await fetchListViewStructure();
      dispatch({
        type: "@@ALL_ADDRESSES/SET_LISTVIEW_COLUMN_STRUCTURE",
        payload: response?.columns,
      });
      setStructure({ ...response });
      setLoading((prevState) => {
        return { ...prevState, structure: false };
      });
    })();

    (async () => {
      const response = await fetchModalStructure();
      setModalStructure({ ...response });
      setLoading((prevState) => {
        return { ...prevState, structure: false };
      });
    })();

    !addressType && dispatch({ type: "@@ALL_ADDRESSES/GET_ADDRESS_TYPE" });
    !weekDays && dispatch({ type: "@@ALL_ADDRESSES/GET_WEEK_DAYS" });

    handleQueryParams();
  }, []);

  useEffect(() => {
    const mongoStructure = structureColumns;
    if (Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "all_addresses",
        cellCallbackMapping
      );
      setListColumns(newColumns);
    }
  }, [structureColumns]);

  // List view callbacks
  const handleFetchData = useCallback(
    async ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis,
    }: IFetchDataOptions) => {
      console.log("[AllAddressList.tsx] Sort Options ====>", sortOptions);
      console.log(
        "[AllAddressList.tsx] Modified Sort Options after CustomColumnsModifications ====>",
        sortOptions
      );
      console.log("[AllAddressList.tsx] ====>", filterOptions);
      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });
      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
      };
      setLoading((prevState) => {
        return { ...prevState, data: true };
      });
      const response = await fetchListViewData(payload);
      setListViewResponse(response);
      setLoading((prevState) => {
        return { ...prevState, data: false };
      });
    },
    []
  );

  const onRowSelect = useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  //  /********  FILTER CHANGE **************/
  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    let existingParams = getQueryParams();

    /** Do not push to history when there is no change. */
    if (
      (!combinedFilters.searchBy && !existingParams.searchBy) ||
      (combinedFilters.searchBy === existingParams.searchBy &&
        combinedFilters.searchText === existingParams.searchText)
    ) {
      return;
    }

    const newParams = {
      ...(existingParams.sortBy
        ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder }
        : {}),
      ...(combinedFilters.searchBy
        ? {
            searchBy: combinedFilters.searchBy,
            searchText: combinedFilters.searchText,
          }
        : {}),
    };

    setTimeout(() => {
      ngStateRouter.go("address", newParams, ngStateRouterOptions);
    }, 2000);
  };

  // /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams();

    /** Do not push to history when there is no change. */
    if (
      (!sortOptions.sortBy && !existingParams.sortBy) ||
      (sortOptions.sortBy === existingParams.sortBy &&
        sortOptions.sortOrder === existingParams.sortOrder)
    ) {
      return;
    }

    /** Construct new set of Query Params */
    const newParams = {
      ...(sortOptions.sortBy
        ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder }
        : {}),
      ...(existingParams.searchBy
        ? {
            searchBy: existingParams.searchBy,
            searchText: existingParams.searchText,
          }
        : {}),
    };

    setTimeout(() => {
      ngStateRouter.go("address", newParams, ngStateRouterOptions);
    }, 2000);
  };

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      Object.keys(structureColumns)?.forEach((columnKey) => {
        structureColumns[columnKey].permission = !!visibleColumns[columnKey];
      });

      const payload = {
        ...structure,
        columns: { ...structureColumns },
      };

      const responseMessage = await putListViewStructure(payload);
      responseMessage && toast.add(responseMessage, "check-round", false);
    },
    [structureColumns]
  );

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();

    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split("#@#");
    let sortOrder = filterData?.sortOrder?.split("#@#");

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === "DESC",
      };
      sort.push(temp);
    });
    sort && setSort(sort);

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split("#@#");
    let searchText = filterData?.searchText?.split("#@#");

    let temp: Record<string, string> = {};
    searchBy &&
      searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index];
      });

    setFilters(temp);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{ width: "100%", height: "82vh" }}
    >
      <BodyGrid container spacing={5}>
        <BodyGridItem item md={12} className="grid-customised-scroll-bar">
          <BodyCardContainer className="BonusConfigListView">
            {listColumns?.length > 0 && (
              <ListView
                rowIdentifier="clientNodeId"
                style={{
                  height: "100%",
                  overflow: "visible",
                }}
                columns={listColumns}
                data={listViewData}
                onFetchData={handleFetchData}
                hasRowSelection // Permission: !structureButtons?.['InlineEdit']?.permission // Only checkboxes will be there, which can be selected and later used for Actionbarbuttons.
                onRowSelect={onRowSelect}
                onSaveColumnPreferences={onSaveColumnPreferences}
                totalRows={rowCount}
                hideRefresh={isDataLoading || isStructureLoading}
                isEditMode={isEditMode} // This will disable all selection options
                permanentColumns={{
                  code: true,
                  isActiveFl: true,
                  name: true,
                }} // count of this matters, user cannot have less than 5 columns at a time.
                filters={filters}
                onFilterChange={handleFilterChange}
                sorts={sort}
                onSortChange={handleSortChange}
                isColumnLoading={isStructureLoading}
                loading={isDataLoading || isStructureLoading}
              >
                {{
                  ActionBar: (
                    <Box display="flex" horizontalSpacing="10px">
                      {isEditMode ? (
                        <>
                          <div className="all-addresses__action-button">
                            <IconButton
                              intent="table"
                              id="listView-actionBar-cancel"
                              iconVariant="icomoon-close"
                              onClick={onCancelClick}
                              disabled={!Object.keys(selectedRows).length}
                            >
                              <Typography fontSize="12px">
                                {dynamicLabels.cancel || "Cancel"}
                              </Typography>
                            </IconButton>
                          </div>
                          <div className="all-addresses__action-button">
                            <IconButton
                              intent="table"
                              id="listView-actionBar-save"
                              iconVariant="icomoon-save"
                              onClick={onSaveClick}
                              disabled={!Object.keys(selectedRows).length}
                            >
                              <Typography fontSize="12px">
                                {dynamicLabels.save || "Save"}
                              </Typography>
                            </IconButton>
                          </div>
                        </>
                      ) : (
                        structureButtons?.update?.permission && (
                          <div className="all-addresses__action-button">
                            <Tooltip
                              message={structureButtons?.update?.label}
                              hover
                              messagePlacement="start"
                            >
                              <IconButton
                                key={structureButtons?.Copy?.label}
                                disabled={
                                  Object.keys(selectedRows)?.length < 1
                                }
                                intent="table"
                                iconVariant="icomoon-edit-empty"
                                id="listView-actionBar-update"
                                onClick={onUpdateClick}
                                iconSize={11}
                              >
                                <Typography fontSize="12px">
                                  {structureButtons?.update?.label ||
                                    "Update"}
                                </Typography>
                              </IconButton>
                            </Tooltip>
                          </div>
                        )
                      )}
                    </Box>
                  ),
                }}
              </ListView>
            )}
            {modalVisibility && (
              <AdditionalContactsModal
                clientNodeId={clickedRow}
                structure={modalStructure}
                modalVisibility={modalVisibility}
                setModalVisibility={setModalVisibility}
                dynamicLabels={dynamicLabels}
              />
            )}
          </BodyCardContainer>
        </BodyGridItem>
      </BodyGrid>
    </Box>
  );
};

export default AddressList;
