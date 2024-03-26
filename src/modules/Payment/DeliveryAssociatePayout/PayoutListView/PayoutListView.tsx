import React, { Dispatch, useEffect, useState } from "react";
import withRedux from "../../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../../utils/theme";
import {
  withToastProvider,
  withPopup,
  IListViewColumn,
  ISelectedRows,
  useToast,
  Box,
  BreadCrumb,
  IconButton,
  ListView,
  IFetchDataOptions,
  Tooltip,
  IFilterOptions,
  ISortOptions,
} from "ui-library";
import { SortingRule, ColumnInstance } from "react-table";
import { useDispatch } from "react-redux";
// import { tGlobalToastActions } from "../../../common/GlobalToasts/globalToast.reducer";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import {
  BodyCardContainer,
  BodyGrid,
  BodyGridItem,
  NoDataWrapper,
} from "./styles";
import EmptyData from "../../../../utils/components/EmptyData";
import { getQueryParams, hybridRouteTo } from "../../../../utils/hybridRouting";
import { IStateService } from "angular-ui-router";
import { tPayoutProfilesActions } from "./Store/PayoutProfile.actions";
import { sendGA } from "../../../../utils/ga";

interface IPayoutListProps {
  ngStateRouter: IStateService;
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = {
  notify: false,
  reload: false,
  inherit: false,
  location: true,
};

const PayoutListView = ({
  ngStateRouter,
}: IPayoutListProps) => {
  const dispatch = useDispatch<Dispatch<tPayoutProfilesActions>>();
  // const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const pageLabels = useTypedSelector(
    (state) => state.pageLabels?.payouts
  );
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.payments.deliveryAssociatePayout.listView
  );

  const structure = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.structure
  );
  const structureColumns = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.structure?.columns
  );
  const structureButtons = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.structure?.buttons
  );
  const rowCount = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.data.totalCount
  );
  const listViewData = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.data.results
  );
  const loading = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.loading.listView // listview -> loading
  );
  const columnsLoading = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.loading.columns // columns -> columnsLoading
  );

  const isListViewEmpty = useTypedSelector(
    (state) => state.deliveryAssociatePayout.listView.isListViewEmpty
  );

  //**************** LOCAL STATES *******************//
  const [listColumns, setListColumns] = useState<IListViewColumn[]>([]); // columns, setColumns
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [isEditMode, setIsEditMode] = useState(false);

  // Branch Modal
  const toast = useToast();

  // Local Values
  const selectedRowKeys = Object.keys(selectedRows);

  const cellCallbackMapping = {};
  
/***** WATCHERS ******/
  useEffect(() => {
    dispatch({ type: "@@PAYOUTS/FETCH_LISTVIEW_STRUCTURE" });
    dispatch({ type: '@@PAYOUTS/FETCH_ATTACHED_BRANCH' })
    handleQueryParams();

    return () => {
      dispatch({ type: "@@PAYOUTS/RESET_TO_INITIALSTATE" });
    };
  }, []);

  useEffect(() => {
    const mongoStructure = structureColumns;
    if (mongoStructure && Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "payouts",
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
      // API call for fetching data.
      dispatch({
        type: "@@PAYOUTS/FETCH_LISTVIEW_DATA",
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
        },
      });

      dispatch({type: "@@PAYOUTS/SET_LIST_PARAMS", payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
      }})
    },[]);

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
      ngStateRouter.go("payouts", newParams, ngStateRouterOptions);
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
      ngStateRouter.go("payouts", newParams, ngStateRouterOptions);
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
            modelName: "PAYOUT_CONFIGURATION",
            pageName: "PAYOUT_CONFIGURATION",
            sectionName: "PAYOUT_PROFILES_LIST_VIEW",
          },
        });
        message && toast.add(message, "check-round", false);
      } catch (error: any) {
        toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong,'warning', false)
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
  const openAddPayoutForm = async () => {
    sendGA('Payout Configuration','Add Payout Profile Form')
    hybridRouteTo("addPayout");
  };

  // on RoweditClick we should route to update form
  const routeToUpdateForm = async (profileId: number) => {
    sendGA('Payout Configuration', 'Update Payout Profile Form');
    hybridRouteTo(`updatePayout?payoutId=${profileId}`);
  };

  const breadCrumbOptions = [
    {
      id: "payments",
      label: "Payments",
      disabled: true,
    },
    {
      id: "deliveryAssociate",
      label: dynamicLabels?.deliveryboy_s || "Delivery Associates",
      disabled: true,
    },
    {
      id: "PAYOUTS",
      label: dynamicLabels?.payout_p || "Payouts",
      disabled: true,
    },
  ];

  const setAsFavourite = async (row: ISelectedRows) => {
    setIsEditMode(true);
    
    const firstSelectedRow = Object.keys(row)?.[0];
    try {
      const {
        data: { message, status },
      } = await axios.put(
        `${apiMappings.payments.deliveryAssociatePayout.updateFavourite}`, undefined,
        { params: { profileId: firstSelectedRow } }
      );
      if (status === 200) {
        toast.add(
          message || dynamicLabels?.[message] || "Payout Profile marked as Favourite Successfully.",
          "check-round",
          false
        );

        setSelectedRows && setSelectedRows({});
        setIsEditMode(false);
        handleFetchData(filters);
        return;
      }
      throw message;
    } catch (errorMessage: any) {
      toast.add(errorMessage?.response?.data?.message || dynamicLabels.somethingWendWrong, "warning", false);
      setIsEditMode(false);
    }
  };
  
  return (
    <>
      <div id="toast-inject-here"></div>
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: "100%", height: "100vh", paddingTop: "64px" }}
        px="15px"
        pb="5px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          py="15px"
        >
          <BreadCrumb options={breadCrumbOptions} />
          {/* Page Action Buttons */}
          {pageLabels?.buttons.add && (
            <Tooltip
              tooltipDirection="bottom"
              arrowPlacement="center"
              messagePlacement="end"
              message={`${dynamicLabels.clickHereToAdd || "Click here to add"} ${dynamicLabels?.payout_s || "Payout"} Profile`}
              hover={true}
            >
              <IconButton
                id = "payouts--actionbar--add"
                intent="page"
                iconVariant="icomoon-add"
                onClick={openAddPayoutForm}
              >
                {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* LIST VIEW CONTAINER */}
        <BodyGrid container spacing={5}>
          {isListViewEmpty ? (
            <NoDataWrapper>
              <div>
                <EmptyData
                  message={
                    dynamicLabels.noPayoutAddedYet ||
                    "No Payout added yet. Click on the button below to add new Payout."
                  }
                  imgSrc="images/List-Empty/payouts.svg"
                />
                <Box display="flex" justifyContent="center" fullWidth>
                  <Tooltip
                    message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels.payout_s}`}
                    hover={true}
                  >
                    <IconButton
                      primary
                      iconVariant="icomoon-add"
                      onClick={openAddPayoutForm}
                      id={'listView--actionbar--add'}
                    >
                      <span style={{ fontSize: "13px" }}>
                        {`${dynamicLabels.add || "Add"} ${dynamicLabels.payout_s || "Payout"}`}
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
                <BodyCardContainer className="PayoutListView">
                  {listColumns?.length > 0 && (
                    <ListView
                      rowIdentifier="id"
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
                      hideRefresh={loading || columnsLoading}
                      isEditMode={isEditMode} // This will disable all selection options
                      onRowEditClick={(rowData) => {
                        routeToUpdateForm(rowData.id);
                      }}
                      permanentColumns={{
                        frequency: true,
                        payoutProfileName: true,
                        linkedBranchIds: true,
                      }} // count of this matters, user cannot have less than 5 columns at a time.
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      sorts={sort}
                      onSortChange={handleSortChange}
                      loading={loading}
                      isColumnLoading={columnsLoading}
                      showFavouriteStar={true}
                    >
                      {{
                        ActionBar: (
                          <Box display="flex" horizontalSpacing="10px">
                            {structureButtons?.markAsFavourite?.permission && (
                              <Tooltip
                                message={
                                  structureButtons?.markAsFavourite?.label
                                }
                                hover
                                messagePlacement={"start"}
                              >
                                <IconButton
                                  key={structureButtons?.markAsFavourite?.label}
                                  disabled={selectedRowKeys?.length !== 1}
                                  intent="table"
                                  iconVariant={"star-filled"}
                                  id={`listView-actionBar-markAsFavourite`}
                                  onClick={() => {
                                    setAsFavourite(selectedRows);
                                  }}
                                >
                                  {structureButtons?.markAsFavourite?.label}
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        ),
                      }}
                    </ListView>
                  )}
                </BodyCardContainer>
              </BodyGridItem>
            </>
          )}
        </BodyGrid>
      </Box>
    </>
  );
};
export default withThemeProvider(
  withToastProvider(
    withRedux(withPopup(PayoutListView)),
    "toast-inject-here"
  )
);
