import { IStateService } from "angular-ui-router";
import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SortingRule, ColumnInstance } from "react-table";
import {
  Tooltip,
  IconButton,
  Box,
  BreadCrumb,
  ListView,
  useToast,
  IFetchDataOptions,
  ISelectedRows,
  IFilterOptions,
  ISortOptions,
  IListViewColumn,
  withPopup,
  withToastProvider,
} from "ui-library";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import {
  getQueryParams,
  hybridRouteTo,
} from "../../../utils/hybridRouting";
import { transformMongoListViewToColumns } from "../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IBonusesListActions } from "./BonusesList.actions";
import {
  BodyCardContainer,
  BodyGrid,
  BodyGridItem,
  NoDataWrapper,
} from "./BonusesList.styles";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import withRedux from "../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../utils/theme";
import DAMappedListView from "./ModalListView/DAMappedList";
import InactiveModal from "./InactiveModal/InactiveModal";
import EmptyData from "../../../utils/components/EmptyData";
import { sendGA } from "../../../utils/ga";
import moment from "moment";
import useClientProperties from "../../common/ClientProperties/useClientProperties";

interface IBonusesListProps {
  ngStateRouter: IStateService;
  commonDynamicLabels: any;
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = {
  notify: false,
  reload: false,
  inherit: false,
  location: true,
};

const BonusesList = ({
  ngStateRouter,
  commonDynamicLabels,
}: IBonusesListProps) => {
  /* General Hooks */
  const toast = useToast();
  const mainListDynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.payments.bonuses.mainListView
  );
  const dispatch = useDispatch<Dispatch<IBonusesListActions>>();
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const dateFormat = `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`;

  console.log(ngStateRouter);

  // Local states
  const [listColumns, setListColumns] = useState<IListViewColumn[]>([]); // columns, setColumns
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [localBonusStartDate, setLocalBonusStartDate] = useState(new Date());

  // Add below Local states only if you have modalListView in your ListView
  const [isModalListViewOpen, setModalListViewOpen] = useState<boolean>(false);
  const [clickedRow, setClickedRow] = useState();
  // Add below local state if you have a modal on active/inactive toggle
  const [isInactiveModalOpen, setInactiveModalOpen] = useState(false);

  // Redux states
  const structure = useTypedSelector(
    (state) => state.bonuses?.listView?.structure
  ); // structure
  const structureColumns = useTypedSelector(
    (state) => state.bonuses?.listView?.structure?.columns
  ); // columnsSelector
  const structureButtons = useTypedSelector(
    (state) => state.bonuses?.listView?.structure?.buttons
  ); // actionBarButtons
  const listViewData = useTypedSelector(
    (state) => state.bonuses?.listView?.data?.results
  ); // rowsSelector
  const isDataLoading = useTypedSelector(
    (state) => state.bonuses?.listView.loading.data
  ); // columnsLoading | loading
  const isStructureLoading = useTypedSelector(
    (state) => state.bonuses?.listView.loading.structure
  ); // columnsLoading | loading
  const pageViewMode = useTypedSelector(
    (state) => state.bonuses?.listView.viewMode
  );
  const rowCount = useTypedSelector(
    (state) => state.bonuses?.listView.data.totalCount
  ); // totalRowsSelector

  const isListViewEmpty = useTypedSelector(
    (state) => state.bonuses.listView.isListViewEmpty
  );

  // Page label state
  const pageLabels = useTypedSelector(
    (state) => state.pageLabels.bonuses
  );

  const breadCrumbOptions = [
    {
      id: "payments",
      label: commonDynamicLabels.Payments || "Payments",
      disabled: true,
    },
    {
      id: "deliveryAssociate",
      label: commonDynamicLabels.deliveryboy_s || "Delivery Associate",
      disabled: true,
    },
    {
      id: "BONUS_CONFIGURATION",
      label: commonDynamicLabels.bonus_p || "Bonuses",
      disabled: true,
    },
  ];

  // Local Values
  const selectedRowKeys = Object.keys(selectedRows);

  /* CELL CALLBACKS i.e. IF CELL IS CLICKED WHAT SHOULD BE HAPPENING? Mappings with cells is done below. */
  const onDaCountClick = (row: any) => {
    setModalListViewOpen(true);
    setClickedRow(row.bonusId);
  };

  const onToggleClick = (toggleValue, row) => {
    // toggleValue is the value of toggle after your action. Eg: You turned toggle on then it's true.
    !toggleValue && setInactiveModalOpen(true);
    setLocalBonusStartDate(new Date(row.startDate));
    setClickedRow(row.bonusId);
  };

  // On column Click some callback function should be called. Do the Mapping here with the key of the column which function to run.
  const cellCallbackMapping = {
    daMappedCount: onDaCountClick,
    isActiveFl: onToggleClick,
  };

  // /***** WATCHERS ******/
  useEffect(() => {
    dispatch({ type: "@@bonuses/FETCH_LISTVIEW_STRUCTURE" });
    dispatch({ type: "@@bonuses/FETCH_MODAL_LISTVIEW_STRUCTURE" });
    handleQueryParams();

    return () => {
      dispatch({ type: "@@bonuses/RESET_TO_INITIALSTATE" });
    };
  }, []);

  useEffect(() => {
    const mongoStructure = structureColumns;
    if (Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "bonuses",
        cellCallbackMapping
      );
      setListColumns(newColumns);
    }
  }, [structureColumns]);

  // List view callbacks
  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
    }: IFetchDataOptions) => {
      console.log(
        "[BonusesList.tsx] Sort Options ====>",
        sortOptions
      );
      // sortOptions = handleCustomColumnSort(sortOptions) //--> No custom columns are there.
      console.log(
        "[BonusesList.tsx] Modified Sort Options after CustomColumnsModifications ====>",
        sortOptions
      );
      console.log("[BonusesList.tsx] ====>", filterOptions);

      // API call for fetching data.
      dispatch({
        type: "@@bonuses/FETCH_LISTVIEW_DATA",
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
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
      ngStateRouter.go("bonuses", newParams, ngStateRouterOptions);
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
      ngStateRouter.go("bonuses", newParams, ngStateRouterOptions);
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

      try {
        const {
          data: { message },
        } = await axios.put(apiMappings.common.structure, payload, {
          params: {
            modelName: "BONUS_CONFIGURATIONS",
            pageName: "BONUS_CONFIGURATIONS",
            sectionName: "BONUS_MASTER_LIST_VIEW",
          },
        });
        message && toast.add(message, "check-round", false);
      } catch (error: any) {
        console.log(error, error?.response);
      }
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

  // Redirecting to Add form
  const openAddBonusForm = async () => {
    // Bonus - Add button
    sendGA("Bonus Configuration", "Add Bonus Form");
    // history.push({ pathname: "/addBonus", state: { isUpdate: false } });
    hybridRouteTo("addBonus");
  };

  // Action Bar Functions
  const handleCopy = () => {
    if (selectedRowKeys?.length === 1) {
      sendGA("Bonus Configuration", "Copy Bonus Form");
      setEditMode(true);
      hybridRouteTo(`copyBonus?bonusId=${selectedRowKeys[0]}`);
    } else {
      selectedRowKeys?.length > 1 &&
        toast.add("Cannot duplicate more than one", "warning", false);
    }
  };

  // on RoweditClick we should route to update form
  const routeToUpdateForm = async (rowId: any) => {
    sendGA("Bonus Configuration", "Update Bonus Form");
    hybridRouteTo(`updateBonus?bonusId=${rowId}`);
  };

  // API call for setting Toggle Inactive
  const setBonusInactive = async (
    date: any,
    // checkboxValue: boolean,
    bonusId: any
  ) => {
    try {
      const {
        data: { status, message },
      } = await axios.put(apiMappings.payments.bonuses.setBonusInactive, {
        endDate: date ? moment(date, dateFormat).format("YYYY-MM-DDTHH:mm:ss") : undefined,
        // notifyToDeliveryMedium: checkboxValue,
        bonusId: bonusId,
      });
      if (status === 200) {
        toast.add(
          mainListDynamicLabels.statusUpdatedSuccessfully,
          "check-round",
          false
        );
        handleFetchData(filters);
        setSelectedRows({}); // Re-render list only when it is turned off show the new toggle value
      } else {
        throw message;
      }
    } catch (error: any) {
      toast.add(
        typeof error === "string"
          ? error
          : commonDynamicLabels.somethingWendWrong,
        "",
        false
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{ width: "100%", height: "100vh", paddingTop: "64px" }}
      px="15px"
      pb="15px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ width: "100%" }}
        py="15px"
      >
        <BreadCrumb options={breadCrumbOptions} width="100%" />
        {/* Page Action Buttons -> You can make Add button Dynamic here*/}
        <Box
          display="flex"
          justifyContent="space-evenly"
        >
          {pageLabels?.buttons.add && (
            <Tooltip
              message={`${
                mainListDynamicLabels.clickHereToAdd || "Click here to Add"
              } ${commonDynamicLabels.bonus_s || "Bonus"}` }
              hover={true}
              messagePlacement="end"
            >
              <IconButton
                intent="page"
                id = "bonuses--actionbar--add"
                iconVariant="icomoon-add"
                onClick={openAddBonusForm}
              >
                {mainListDynamicLabels[pageLabels?.buttons.add] ||
                  mainListDynamicLabels.add ||
                  "Add"}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <BodyGrid container spacing={5}>
        {isListViewEmpty ? (
          <NoDataWrapper>
            <div>
              <EmptyData
                message={
                  mainListDynamicLabels.noBonusAddedYet ||
                  "No Bonus added yet. Click on the button below to add new Bonus."
                }
                imgSrc="images/Bonus/bonus-nodata.svg"
              />
              <Box display="flex" justifyContent="center" fullWidth>
                <Tooltip
                  message={`${mainListDynamicLabels.clickHereToAdd} ${commonDynamicLabels.bonus_s}`}
                  hover={true}
                >
                  <IconButton
                    primary
                    iconVariant="icomoon-add"
                    onClick={openAddBonusForm}
                    id={'listView--actionbar--add'}
                  >
                    <span style={{ fontSize: "13px" }}>
                      {`${mainListDynamicLabels.add} ${commonDynamicLabels.bonus_s}` ||
                        "Add Bonus"}
                    </span>
                  </IconButton>
                </Tooltip>
              </Box>
            </div>
          </NoDataWrapper>
        ) : (
          <>
            {/* List view here */}
            <BodyGridItem item md={12} className="grid-customised-scroll-bar">
              <BodyCardContainer className="BonusConfigListView">
                {listColumns?.length > 0 && (
                  <ListView
                    rowIdentifier="bonusId"
                    style={{
                      height: "100%",
                      overflow: "visible",
                    }}
                    columns={listColumns}
                    data={listViewData}
                    onFetchData={handleFetchData}
                    hasRowSelection={
                      !structureButtons?.["InlineEdit"]?.permission
                    } // Permission: !structureButtons?.['InlineEdit']?.permission // Only checkboxes will be there, which can be selected and later used for Actionbarbuttons.
                    hasRowSelectionWithEdit={
                      structureButtons?.["InlineEdit"]?.permission
                    } // -> Checkboxes along with the edit button that on press exectures onRowEditClick function.
                    onRowSelect={onRowSelect}
                    onSaveColumnPreferences={onSaveColumnPreferences}
                    totalRows={rowCount}
                    hideRefresh={isDataLoading || isStructureLoading}
                    isEditMode={isEditMode} // This will disable all selection options
                    onRowEditClick={(rowId) => {
                      routeToUpdateForm(rowId.bonusId);
                    }}
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
                    {pageViewMode === "listview"
                      ? {
                          ActionBar: (
                            <Box display="flex" horizontalSpacing="10px">
                              {structureButtons?.Copy?.permission && (
                                <Tooltip
                                  message={structureButtons?.Copy?.label}
                                  hover
                                  messagePlacement={"start"}
                                >
                                  <IconButton
                                    key={structureButtons?.Copy?.label}
                                    disabled={selectedRowKeys?.length !== 1}
                                    intent="table"
                                    iconVariant={"copy-empty"}
                                    id={`listView-actionBar-copy`}
                                    onClick={() => {
                                      handleCopy();
                                    }}
                                  >
                                    {structureButtons?.Copy?.label}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          ),
                        }
                      : undefined}
                  </ListView>
                )}
              </BodyCardContainer>
            </BodyGridItem>
          </>
        )}
      </BodyGrid>
      {/* MODAL LIST VIEW CONTAINER */}
      <DAMappedListView
        isModalOpen={isModalListViewOpen}
        setIsModalOpen={setModalListViewOpen}
        clickedRow={clickedRow}
        dynamicLabels={mainListDynamicLabels}
      />

      {/* INACTIVE MODAL -> This will open only if you are turning toggle off */}
      <InactiveModal
        bonusStartDate={localBonusStartDate}
        isModalOpen={isInactiveModalOpen}
        setIsModalOpen={setInactiveModalOpen}
        dynamicLabels={mainListDynamicLabels}
        clickedRow={clickedRow}
        APICall={setBonusInactive}
        dateFormat={dateFormat}
      />
    </Box>
  );
};

export default withThemeProvider(
  withToastProvider(
    withRedux(withPopup(BonusesList)),
    "toast-inject-here"
  )
);
