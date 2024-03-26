import React, { Dispatch, useEffect, useState } from "react";
import {
  Box,
  ListView,
  Tooltip,
  IconButton,
  IListViewColumn,
  useToast,
  IFetchDataOptions,
  ISelectedRows,
  Grid,
  BreadCrumb,
  IconDropdown,
  ISortOptions,
  IFilterOptions,
} from "ui-library";
import { ColumnInstance, SortingRule } from "react-table";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../utils/redux/rootReducer";
import { tFleetTypeListViewAcions } from "./FleetTypeListView.actions";
import useDynamicLabels from "../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../common/DynamicLabels/dynamicLabels.mapping";
import WhiteCard from "../../utils/layouts/WhiteCard";
import {
  AdvancedFilterLabel,
  AppliedFilterStrip,
  BreadCrumbTagWrapper,
  FilterAppliedTag,
  FilterAppliedTagButtonWrapper,
  FilterAppliedTagLabel,
  StyledGrid,
} from "./StyledFleetTypeView";
import NoDataView from "../../utils/components/NoDataView";
import PageActionButtons from "./SubComponents/PageActionButtons";
import { getQueryParams, hybridRouteTo } from "../../utils/hybridRouting";
import DownloadFleetModal from "./SubComponents/DownloadFleetModal";
import TextOverflowEllipsis from "../../utils/components/TextOverflowEllipsis";
import iconsMapping from "../../utils/mongo/ListView/actionBarIcons.mapping";
import axios from "../../utils/axios";
import apiMappings from "../../utils/apiMapping";
import {
  IFleetTypeListViewRowData,
  tFleetStatus,
} from "./FleetTypeListView.models";
import { transformMongoListViewToColumns } from "../../utils/mongo/ListView";
import { sendGA } from "../../utils/ga";
import withReact from "../../utils/components/withReact";
import FleetTypeModals from "./SubComponents/FleetTypeModals";
import FleetMoreOptionConfirmation, {
  tMoreOption,
} from "./SubComponents/FleetMoreOptionConfirmation";
import { IStateService } from "angular-ui-router";
import { ButtonWrapper } from "./StyledFleetTypeView";
import moment from "moment";
import { metricsConversion } from "../../utils/helper";
import InlineEditConfirmationModal from "../../utils/components/InlineEditConfirmationModal";
import { AdvancedFilterComponentActions } from "../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import AdvancedFilterComponent from "../common/AdvancedFilterComponent";
import { throwError, validateRows } from "../common/InlineEdit/InlineEdit";
import CompartmentListViewModal from "../OnboardingWrapper/ModuleConfiguration/CompartmentConfiguration/Components/CompartmentListViewModal";
import capacityConversion from "../Vehicle/VehicleListView/utils/capacityConversion";

interface IFleetTypeListView {
  ngStateRouter: IStateService;
}

const FleetTypeListView = ({ ngStateRouter }: IFleetTypeListView) => {
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>();
  const advanceFilterdispatch = useDispatch<
    Dispatch<AdvancedFilterComponentActions>
  >();
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.fleet);

  const columnsSelector = useTypedSelector(
    (state) => state.fleet.listView.structure.columns
  );
  const rowsSelector = useTypedSelector(
    (state) => state.fleet.listView.data.results
  );
  const totalRowsSelector = useTypedSelector(
    (state) => state.fleet.listView.data.totalCount
  );
  const structure = useTypedSelector((state) => state.fleet.listView.structure);

  const editDetails = useTypedSelector(
    (state) => state.fleet.listView.editDetails
  );
  const selectedRows = useTypedSelector(
    (state) => state.fleet.listView.selectedRows
  );
  const fetchOptions = useTypedSelector(
    (state) => state.fleet.listView.fetchOptions
  );
  const isEditMode = useTypedSelector(
    (state) => state.fleet.listView.isEditMode
  );
  const actionBarButtons = useTypedSelector(
    (state) => state.fleet.listView.structure.buttons
  );
  const loading = useTypedSelector(
    (state) => state.fleet.listView.loading.listView
  );
  const isSaveClicked = useTypedSelector(
    (state) => state.fleet.listView.isSaveClicked
  );
  const emptyData = useTypedSelector((state) => state.fleet.listView.emptyData);
  const breadcrumbFilter = useTypedSelector(
    (state) => state.fleet.listView.breadcrumbFilter
  );
  const clientMetric = useTypedSelector(
    (state) => state.fleet.listView.clientMetric
  );
  const filterListPayload = useTypedSelector(
    (state) => state.advanceFilter.filterListPayload
  );
  const currentFilter = useTypedSelector(
    (state) => state.advanceFilter.currentFilter
  );
  const openAdvFilter = useTypedSelector(
    (state) => state.advanceFilter.openAdvFilter
  );
  const advancedFilterData = useTypedSelector(
    (state) => state.advanceFilter.advancedFilterData
  );
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const toast = useToast();
  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false);
  const [
    updateConfirmationModal,
    setUpdateConfirmationModal,
  ] = useState<boolean>(false);
  const [moreOptionConfirmation, setMoreOptionConfirmation] = useState<{
    activeRequest: boolean;
    selectionType: tMoreOption | string;
  }>({
    activeRequest: false,
    selectionType: "",
  });
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [filters, setFilters] = useState<Record<string, string>>();
  const [isCompartmentListModalVisible, setCompartmentListModalVisible] = useState<boolean>(false);
  const [selectedFleet, setSelectedFleet] = useState<IFleetTypeListViewRowData>();

  //TODO: toggle selectRow 
  // const [ toggleSelectRowHide, setToggleSelectRowHide] = useState<boolean>(false);

  const AdvanceFilterData = {
    sectionName: "fleet_p",
    saveParams: {
      pageName: "DELIVERYMEDIUM",
      sectionName:
        breadcrumbFilter === "ALL"
          ? "FLEET_TYPE_MASTER_LIST_VIEW"
          : `FLEET_TYPE_MASTER_LIST_VIEW_${breadcrumbFilter}`,
    },
  };

  useEffect(() => {
    const firstEntry = Object.values(rowsSelector)?.[0];
    if (firstEntry?.type) {
      setShowColumnShimmer(false);
    }
  }, [rowsSelector]);

  /** Watchers */
  useEffect(() => {
    const firstEntry = Object.values(columnsSelector)?.[0];
    const isShimmer = !firstEntry?.id;
    handleQueryParams();
    setShowColumnShimmer(isShimmer);

    dispatch({ type: "@@fleetTypeListView/FETCH_STRUCTURE" });
    dispatch({ type: "@@fleetTypeListView/INITIAL_LOAD" });
    handleFetchFilters();
    advanceFilterdispatch({
      type: "@@advanceFilter/UPDATE_FIRST_LOAD",
      payload: false,
    });
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
    return () => {
      dispatch({
        type: "@@fleetTypeListView/RESET_INITIAL_STATE",
      });
    };
  }, []);

  useEffect(() => {
    const firstEntry = Object.values(columnsSelector)?.[0];
    if (columnsSelector && firstEntry?.id) {
      const mongoStructure = columnsSelector;
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(
          mongoStructure,
          "fleet",
          cellCallbackMapping
        );
        setColumns(newColumns);
      }
      advanceFilterdispatch({
        type: "@@advanceFilter/SET_COLUMNS_SELECTOR",
        payload: columnsSelector,
      });
      // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data

      if (firstEntry?.id) {
        setTimeout(() => {
          setShowColumnShimmer(false);
        }, 100);
      }
    }
  }, [columnsSelector]);

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = () => {
    const filterData: Record<string, string> = getQueryParams();
    // if no current filter then dont apply filter
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

    let breadcrumb: tFleetStatus = filterData?.page as tFleetStatus;

    dispatch({
      type: "@@fleetTypeListView/SET_BREADCRUMB_STATE",
      payload: breadcrumb || "ALL",
    });
  };

  const getBreadCrumbOptions = () => {
    return [
      {
        label: dynamicLabels.fleet_p
          ? `All ${dynamicLabels.fleet_p}`
          : "All Fleet Types",
        value: "ALL",
        id: "ALL",
        toolTipMessage: `Click here to sort the list of ${dynamicLabels.fleet_p} on the basis of Status.`,
      },
      {
        label: dynamicLabels.fleet_p
          ? `Active ${dynamicLabels.fleet_p}`
          : "Active Fleet Type",
        value: "ACTIVE",
        id: "ACTIVE",
        //tooltipText:
      },
      {
        label: dynamicLabels.fleet_p
          ? `Inactive ${dynamicLabels.fleet_p}`
          : "Inactive Fleet Type",
        value: "INACTIVE",
        id: "INACTIVE",
        //tooltipText:
      },
    ];
  };
  const breadCrumbOptionList = React.useMemo(() => getBreadCrumbOptions(), [
    dynamicLabels,
  ]);

  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      {
        id: "fleet",
        label: dynamicLabels?.Resources || "Fleets",
        disabled: true,
      },
      {
        id: "fleetTypes",
        label: dynamicLabels.fleet_p || "Fleet Types",
        disabled: true,
      },
    ];
    const dynamicBreadcrumbHeader: any = breadCrumbOptionList.find(
      (option: any) => option.value === breadcrumbFilter
    );

    dynamicBreadcrumbHeader &&
      list.push({
        label: dynamicBreadcrumbHeader?.label,
        value: dynamicBreadcrumbHeader?.value,
        id: dynamicBreadcrumbHeader?.value,
        toolTipMessage: dynamicBreadcrumbHeader?.toolTipMessage,
        disabled: false,
      });
    return list;
  }, [dynamicLabels, breadcrumbFilter]);

  const handleBreadcrumbChange = (id: string) => {
    if (id !== breadcrumbFilter && !emptyData) {
      dispatch({
        type: "@@fleetTypeListView/SET_BREADCRUMB_STATE",
        payload: (id || "ALL") as tFleetStatus,
      });
      handleCancelRows();
      /** Clear other filters & sorts when Breadcrumb Filter changes */
      setTimeout(() => {
        ngStateRouter.go(
          "fleetTypeMaster",
          { page: id || "ALL" },
          { notify: false, reload: false, inherit: false, location: true }
        );
      }, 1000);

      setShowColumnShimmer(true);
      dispatch({ type: "@@fleetTypeListView/FETCH_STRUCTURE" });
      dispatch({
        type: "@@fleetTypeListView/FETCH_DATA",
        payload: { isLoading: true },
      });
    }
  };
  /********  FILTER CHANGE **************/
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
      page: breadcrumbFilter,
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
      ngStateRouter.go("fleetTypeMaster", newParams, {
        notify: false,
        reload: false,
        inherit: false,
        location: true,
      });
    }, 100);
  };
  /********  SORT  CHANGE **************/
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
      page: breadcrumbFilter,
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
      ngStateRouter.go("fleetTypeMaster", newParams, {
        notify: false,
        reload: false,
        inherit: false,
        location: true,
      });
    }, 100);
  };

  const handleActiveFlChange = (
    isChecked: boolean,
    { id }: IFleetTypeListViewRowData,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const fleetDetails = {
      [id]: true,
    };
    dispatch({
      type: "@@fleetTypeListView/SET_FLEET_ACTIVATION",
      payload: {
        activeRequest: isChecked,
        showModal: true,
        id: fleetDetails,
        failureCallback,
      },
    });
  };
  const handleNumberOfCompartments = (row: IFleetTypeListViewRowData) => {
      dispatch({ type: '@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE'});
      setSelectedFleet(row)
      setCompartmentListModalVisible(true);
  }
  const cellCallbackMapping = {
    isActiveFl: handleActiveFlChange,
    compartmentCount: handleNumberOfCompartments
  };

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      sendGA(
        "Event New",
        "Fleet type ListView - Save & Apply column preferences"
      );
      const columns = { ...columnsSelector };
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
        } = await axios.put(apiMappings.common.structure, payload, {
          params: {
            modelName: "DELIVERYMEDIUM",
            pageName: "DELIVERYMEDIUM",
            sectionName:
              breadcrumbFilter === "ALL"
                ? "FLEET_TYPE_MASTER_LIST_VIEW"
                : `FLEET_TYPE_MASTER_LIST_VIEW_${breadcrumbFilter}`,
          },
        });
        message && toast.add(message, "check-round", false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector, breadcrumbFilter]
  );

  /** Inline Edit */
  const validateSelectedRows = () => {
    const columnStructure = columnsSelector;

    try {
      validateRows(editDetails, columnStructure);
    } catch (error) {
      console.log("Inline Edit Validation Failed.", error?.message);
      dispatch({
        type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
        payload: false,
      });
      dispatch({ type: "@@fleetTypeListView/SET_IS_EDITABLE", payload: true });
      throwError(error);

      if (error.message) {
        toast.add(error.message, "", false);
      }
      return false;
    }

    return true;
  };

  const handleSaveRows = async () => {
    dispatch({
      type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
      payload: true,
    });
    const isValid = validateSelectedRows();
    if (isValid) {
      const payload: Partial<IFleetTypeListViewRowData>[] = [];
      Object.values(selectedRows as ISelectedRows).forEach((row) => {
        if (editDetails[row.id]) {
          const obj: any = {
            id: row.id,
          };
          Object.keys(columnsSelector).forEach((columnId) => {
            if (
              columnsSelector?.[columnId]?.editable &&
              !columnsSelector?.[columnId]?.customField
            ) {
              if (editDetails?.[row.id]?.[columnId]) {
                obj[columnId] =
                  editDetails?.[row.id]?.[columnId]?.value || row[columnId];
              }
            }
            switch (columnId) {
              case "minCapacityUtilizationInVolume":
              case "capacityInVolume": {
                const clientObj = clientMetric?.["volume"];
                const emptyValue = editDetails?.[row.id]?.[columnId]?.value;

                const val =
                  emptyValue !== undefined &&
                  metricsConversion(
                    parseFloat(editDetails?.[row.id]?.[columnId]?.value),
                    "POST",
                    clientObj?.conversionFactor
                  );

                const val2 = metricsConversion(
                  parseFloat(row[columnId]),
                  "POST",
                  clientObj?.conversionFactor
                );
                obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0;

                break;
              }
              case "minCapacityUtilizationInWeight":
              case "capacityInWeight": {
                const clientObj = clientMetric?.["weight"];
                const emptyValue = editDetails?.[row.id]?.[columnId]?.value;

                const val =
                  emptyValue !== undefined &&
                  metricsConversion(
                    parseFloat(editDetails?.[row.id]?.[columnId]?.value),
                    "POST",
                    clientObj?.conversionFactor
                  );

                const val2 = metricsConversion(
                  parseFloat(row[columnId]),
                  "POST",
                  clientObj?.conversionFactor
                );
                obj[columnId] = emptyValue === undefined ? val2 : val ? val : 0;

                break;
              }
              case 'minSpeed' :
              case 'maxSpeed': {
                  const clientObj = clientMetric?.["speed"];
                  const emptyValue = editDetails?.[row.id]?.[columnId]?.value
                  const val = emptyValue !== undefined && capacityConversion(parseFloat(emptyValue), 'POST', clientObj?.conversionFactor)
                  const val2 = capacityConversion(parseFloat(row[columnId]), 'POST', clientObj?.conversionFactor)
                  obj[columnId] = emptyValue === undefined ? val2 : val ? val : undefined
                  break;
                }
              case "skillSet": {
                obj[columnId] = editDetails?.[row.id]?.[columnId]?.value
              }
            }
          });
          if (obj.breakStartTimeWindow) {
            const startTime = moment(obj.breakStartTimeWindow, "HH:mm")
              .utc()
              .format("HH:mm:ss");
            obj.breakStartTimeWindow = startTime;
            obj.shiftStartTime = startTime;
            //obj.shiftStartTime = row.shiftStartTime ? row.shiftStartTime : startTime
          }
          if (obj.breakEndTimeWindow) {
            const endTime = moment(obj.breakEndTimeWindow, "HH:mm")
              .utc()
              .format("HH:mm:ss");
            obj.breakEndTimeWindow = endTime;
            obj.shiftEndTime = endTime;
            // obj.shiftEndTime = row?.shiftEndTime ? row?.shiftEndTime : endTime
          }
          if (typeof obj.weeklyOffList === "string") {
            obj.weeklyOffList = obj.weeklyOffList.split(",");
          }
          if (typeof obj.skillSet === "string") {
            obj.skillSet = obj.skillSet.split(",");
          }

          const newObj = {
            ...row,
            ...obj,
          } as Partial<IFleetTypeListViewRowData>;
          // if both present and start time greater than end time show error
          if (
            moment(newObj.breakStartTimeWindow) >
            moment(newObj.breakEndTimeWindow)
          ) {
            handleCancelRows();
            toast.add("Please enter valid Start Break time", "warning", false);
            return;
          }
          payload.push(newObj);
        }
      });

      if (!payload.length) {
        handleCancelRows();
        return;
      }

      try {
        const {
          data: { message, status },
        } = await axios.put(apiMappings.fleet.listView.inlineUpdate, payload);
        if (status === 200) {
          dispatch({
            type: "@@fleetTypeListView/FETCH_DATA",
            payload: {
              pageNumber: fetchOptions?.pageNumber,
              pageSize: fetchOptions?.pageSize,
              searchBy: fetchOptions?.filterOptions?.searchBy,
              searchText: fetchOptions?.filterOptions?.searchText,
              sortBy: fetchOptions?.sortOptions?.sortBy,
              sortOrder: fetchOptions?.sortOptions?.sortOrder,
              isLoading: true,
            },
          });
          dispatch({
            type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
            payload: false,
          });
          dispatch({
            type: "@@fleetTypeListView/SET_IS_EDITABLE",
            payload: false,
          });
          fetchOptions.apis?.resetSelection();
          dispatch({
            type: "@@fleetTypeListView/SET_SELECTED_ROWS",
            payload: {},
          });
          dispatch({ type: "@@fleetTypeListView/CLEAR_EDIT_DETAILS" });
          toast.add(message, "check-round", false);
          return;
        }
        throw message;
      } catch (errorMessage) {
        dispatch({
          type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
          payload: false,
        });
        dispatch({
          type: "@@fleetTypeListView/SET_IS_EDITABLE",
          payload: true,
        });
        const message = errorMessage?.response?.data?.message;

        toast.add(
          message || dynamicLabels.somethingWendWrong,
          "warning",
          false
        );
      }
    }
  };

  const handleSave = () => {
    handleSaveRows();
  };

  const handleCancelRows = React.useCallback(() => {
    setUpdateConfirmationModal(false);
    dispatch({
      type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
      payload: false,
    });
    dispatch({ type: "@@fleetTypeListView/CLEAR_EDIT_DETAILS" });
    dispatch({ type: "@@fleetTypeListView/SET_IS_EDITABLE", payload: false });
    fetchOptions.apis?.resetSelection();
    dispatch({ type: "@@fleetTypeListView/SET_SELECTED_ROWS", payload: {} });
  }, [fetchOptions, editDetails]);

  const handleActionBarButtonClick = (id: string) => {
    switch (id) {
      case "update":
        sendGA("Event New", "Fleet type ListView - update record");
        dispatch({
          type: "@@fleetTypeListView/SET_IS_EDITABLE",
          payload: true,
        });
        break;
    }
  };
  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    try {
      if (
        (!isFilterDataCalled &&
          ((advancedFilterData.length > 0 &&
            advancedFilterData[0].sectionName !=
              "FLEET_TYPE_MASTER_LIST_VIEW" &&
            advancedFilterData[0].sectionName !=
              `FLEET_TYPE_MASTER_LIST_VIEW_${breadcrumbFilter}`) ||
            advancedFilterData?.length == 0)) ||
        callBackAdvanceFilter
      ) {
        setIsFilterDataCalled(true);
        const { data } = await axios.get(
          apiMappings.advancedSearch.getFilters,
          {
            params: {
              pageName: "DELIVERYMEDIUM",
              sectionName:
                breadcrumbFilter === "ALL"
                  ? "FLEET_TYPE_MASTER_LIST_VIEW"
                  : `FLEET_TYPE_MASTER_LIST_VIEW_${breadcrumbFilter}`,
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
      }

      return;
    } catch (errorMessage) {
      console.log(dynamicLabels.updateFilterFailed, errorMessage);
      toast.add(dynamicLabels.updateFilterFailed, "warning", false);
    }
  };
  const getSearchText = (filterOptions: IFilterOptions) => {
    const searchByQueries = filterOptions?.searchBy?.split("#@#");
    let searchText = filterOptions?.searchText;
    let searchTextQueries = searchText?.split("%23@%23");
    const indexOfBreakStart = searchByQueries?.indexOf("breakStartTimeWindow");
    const indexOfBreakEnd = searchByQueries?.indexOf("breakEndTimeWindow");

    if (
      searchTextQueries &&
      indexOfBreakStart !== undefined &&
      indexOfBreakStart !== -1
    ) {
      const breakstartTime = searchTextQueries?.[indexOfBreakStart];
      //searchTextQueries[indexOfBreakStart]= breakstartTime
      searchTextQueries[indexOfBreakStart] = moment(breakstartTime, "HH:mm")
        .utc()
        .format("HH:mm");
    }
    if (
      searchTextQueries &&
      indexOfBreakEnd !== undefined &&
      indexOfBreakEnd !== -1
    ) {
      const breakEndTime = searchTextQueries?.[indexOfBreakEnd];
      // searchTextQueries[indexOfBreakEnd]= breakEndTime
      searchTextQueries[indexOfBreakEnd] = moment(breakEndTime, "HH:mm")
        .utc()
        .format("HH:mm:ss");
    }
    searchText = searchTextQueries ? searchTextQueries?.join("%23@%23") : "";
    return searchText;
  };
  /** List View Callbacks */
  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis,
    }: IFetchDataOptions) => {
      dispatch({
        type: "@@fleetTypeListView/SET_FETCH_OPTIONS",
        payload: { pageSize, pageNumber, sortOptions, filterOptions, apis },
      });
      let searchText = filterOptions ? getSearchText(filterOptions) : "";
      dispatch({
        type: "@@fleetTypeListView/FETCH_DATA",
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          isLoading: true,
        },
      });
    },
    [filterListPayload]
  );

  const isUpdateEnable =
    Object.values(selectedRows as ISelectedRows).length !== 0;

  const enableStatus = {
    update: isUpdateEnable,
  };
  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    dispatch({ type: "@@fleetTypeListView/SET_SELECTED_ROWS", payload: s });
  }, []);

  const handleCancelRowsChange = React.useCallback(() => {
    const propertyLength = Object.keys(editDetails)?.length;

    // anything newly edited then this flag will become true
    if (propertyLength !== 0) {
      setUpdateConfirmationModal(true);
    } else {
      // nothing edited just clear all the selection.
      dispatch({
        type: "@@fleetTypeListView/SET_IS_SAVE_CLICKED",
        payload: false,
      });
      dispatch({ type: "@@fleetTypeListView/SET_IS_EDITABLE", payload: false });
      dispatch({ type: "@@fleetTypeListView/CLEAR_EDIT_DETAILS" });
      fetchOptions.apis?.resetSelection();
      dispatch({ type: "@@fleetTypeListView/SET_SELECTED_ROWS", payload: {} });
      dispatch({
        type: "@@fleetTypeListView/SET_EDIT_CONFIRMATION_MODAL",
        payload: false,
      });
    }
  }, [fetchOptions, editDetails, selectedRows]);
  const buttonList = React.useMemo(() => {
    const buttonArray: any = [];
    actionBarButtons &&
      Object.keys?.(actionBarButtons)?.forEach((buttonKey) => {
        if (actionBarButtons?.[buttonKey]?.permission) {
          buttonArray.push(buttonKey);
        }
      });
    return buttonArray;
  }, [actionBarButtons]);

  const MoreButtonOptionList = React.useMemo(
    () => [
      {
        value: "active",
        label: "Mark As Active",
        tooltipText: "Mark Status as Active.",
      },
      {
        value: "inactive",
        label: "Mark As Inactive",
        tooltipText: "Mark Status As Inactive.",
      },
    ],
    [dynamicLabels]
  );

  const buttonToolTipTextList = {
    update: `Click here to update the selected ${dynamicLabels?.fleet_p}.`,
    more: `Click here to update status of the selected ${dynamicLabels?.fleet_p}.`,
  };
  const handleMoreOptions = async (id: string) => {
    sendGA(
      "ListView ActionBar",
      `Fleet Type ListView Button Click - More Option - ${id}`
    );
    setMoreOptionConfirmation({
      ...moreOptionConfirmation,
      activeRequest: true,
      selectionType: id,
    });
  };

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
    showToast && toast.add(dynamicLabels ?.filterRemovedSuccessfully, 'check-round', false);
  };
  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: !openAdvFilter,
    });
  };

  return (
    <>
      <Box
        display="flex"
        mt="64px"
        flexDirection="column"
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
        px="15px"
        pb="15px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          py="15px"
        >
          <BreadCrumbTagWrapper>
            <BreadCrumb
              options={breadCrumbOptions}
              optionList={breadCrumbOptionList}
              width="260px"
              onClick={handleBreadcrumbChange}
            />
            {filterListPayload && (
              <Tooltip
                tooltipDirection="bottom"
                messagePlacement="center"
                hover
                message={
                  <div style={{ textAlign: "left", fontSize: 12 }}>
                    <Box mb="10px">
                      Filters are applied on{" "}
                      {filterListPayload.operationLogic === "AND"
                        ? "ALL"
                        : "ANY"}{" "}
                      of the the following conditions:
                    </Box>
                    {currentFilter &&
                      currentFilter?.filters &&
                      currentFilter?.filters.map((f, i) => {
                        return (
                          <Box mb="5px">{`${i + 1}. ${f.fieldLabelKey} ${
                            f?.labelValue || f?.operationLabelKey
                          } ${f.filterData}`}</Box>
                        );
                      })}
                  </div>
                }
              >
                <FilterAppliedTag>
                  <FilterAppliedTagLabel onClick={handleOpenAdvancedFilter}>
                    {currentFilter?.filterName?.trim() || "Filter Applied"}
                  </FilterAppliedTagLabel>
                  <FilterAppliedTagButtonWrapper>
                    <IconButton
                      onClick={handleRemoveFilter}
                      onlyIcon
                      iconVariant="close"
                      iconSize={10}
                      color="error.main"
                    />
                  </FilterAppliedTagButtonWrapper>
                </FilterAppliedTag>
              </Tooltip>
            )}
          </BreadCrumbTagWrapper>

          {/* <button onClick={()=>{setToggleSelectRowHide(!toggleSelectRowHide)}}>Custom Click</button> */}
          <PageActionButtons ngStateRouter={ngStateRouter} />
        </Box>
        <StyledGrid
          container
          spacing={15}
          style={{ boxShadow: "0 2px 20px -10px #000" }}
        >
          <Grid
            className="grid-customised-scroll-bar"
            item
            md={12}
            style={{ display: "flex", overflow: "hidden" }}
          >
            {filterListPayload && (
              <AppliedFilterStrip>
                <AdvancedFilterLabel>
                  Advanced Filter Applied
                </AdvancedFilterLabel>
                <ButtonWrapper onClick={handleRemoveFilter}>
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

            <WhiteCard>
              {emptyData ? (
                <NoDataView
                  image="images/fleetType.png"
                  message={`No ${dynamicLabels?.fleet_s} added yet. Click on the button below to add ${dynamicLabels?.fleet_s}.`}
                  buttonList={[
                    {
                      name: `Add ${dynamicLabels?.fleet_s}`,
                      icon: "icomoon-add",
                      href: "fleetTypeForm",
                    },
                  ]}
                />
              ) : (
                <ListView
                  // fleetType unique name
                  rowIdentifier="id"
                  style={{
                    height: "100%",
                    overflow: "hidden",
                    boxShadow: "0px 2px 20px -10px #000 !important",
                  }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  hasRowSelection={
                    !actionBarButtons?.["InlineEdit"]?.permission
                    // toggleSelectRowHide
                  }
                  hasRowSelectionWithEdit={
                    actionBarButtons?.["InlineEdit"]?.permission
                  }
                  onRowSelect={onRowSelect}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  totalRows={totalRowsSelector}
                  loading={showColumnShimmer || loading}
                  hideRefresh={loading || showColumnShimmer}
                  isColumnLoading={showColumnShimmer}
                  isEditMode={isEditMode}
                  paginationPageSize={50}
                  onApply={() => {
                    sendGA(
                      "Event New",
                      "Fleet type ListView -  Apply column preferences "
                    );
                  }}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sorts={sort}
                  onSortChange={handleSortChange}
                  permanentColumns={{
                    clientName: true,
                    make: true,
                    type: true,
                    isActiveFl: true,
                  }}
                  onRowEditClick={(row) => {
                    hybridRouteTo(`updateFleetType/?fleetId=${row?.id}`);
                  }}
                >
                  {{
                    IconBar: (
                      <Box display="flex" style={{ position: "relative" }}>
                        <DownloadFleetModal />
                        <AdvancedFilterComponent
                          pageName="fleet_type"
                          handleFetchFilters={handleFetchFilters}
                          handleRemoveFilter={handleRemoveFilter}
                          handleFetchData={handleFetchData}
                          data={AdvanceFilterData}
                          needsFetchDataCall={false}
                        />
                      </Box>
                    ),

                    ActionBar: (
                      <Box display="flex" horizontalSpacing="10px">
                        {isEditMode ? (
                          <>
                            <Tooltip
                              message={`Click here to save the selected ${dynamicLabels.fleet_s}.`}
                              hover={true}
                              messagePlacement="start"
                            >
                              <IconButton
                                intent="table"
                                id="listView-actionBar-save"
                                iconVariant="icomoon-save"
                                onClick={handleSave}
                                disabled={
                                  !Object.keys(selectedRows as ISelectedRows)
                                    .length || isSaveClicked
                                }
                              >
                                {dynamicLabels?.save}
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              message={`Click here to cancel the selected ${dynamicLabels.fleet_p}.`}
                              hover={true}
                            >
                              <IconButton
                                intent="table"
                                id="listView-actionBar-cancel"
                                iconVariant="icomoon-close"
                                onClick={handleCancelRowsChange}
                                disabled={
                                  !Object.keys(selectedRows as ISelectedRows)
                                    .length || isSaveClicked
                                }
                              >
                                {dynamicLabels?.cancel}
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          Object.keys(actionBarButtons).map(
                            (buttonKey) =>
                              actionBarButtons[buttonKey].permission &&
                              (buttonKey === "more" ? (
                                <IconDropdown
                                  id="fleet_type--actionbar--more"
                                  key={buttonKey}
                                  intent="table"
                                  variant={"button-dropdown"}
                                  optionList={MoreButtonOptionList}
                                  width="120px"
                                  tooltipMessage={`${
                                    actionBarButtons[buttonKey].tooltipLabel
                                      ? actionBarButtons[buttonKey].tooltipLabel
                                      : buttonToolTipTextList[buttonKey]
                                      ? buttonToolTipTextList[buttonKey]
                                      : buttonKey
                                  }`}
                                  iconButtonDetails={[
                                    "icomoon-funnel-options",
                                    actionBarButtons[buttonKey].label,
                                    "icomoon-angle-bottom",
                                  ]}
                                  // if no selection or in selected rows  intransit status there then only disable
                                  disabled={
                                    Object.keys(selectedRows as ISelectedRows)
                                      .length === 0
                                  }
                                  tooltipProps={{ messagePlacement: "start" }}
                                  onChange={handleMoreOptions}
                                  isSingleClickOption
                                />
                              ) : (
                                buttonKey !== "InlineEdit" && (
                                  <Tooltip
                                    messagePlacement={
                                      buttonList[0] === buttonKey ||
                                      buttonKey === "update"
                                        ? "start"
                                        : "center"
                                    }
                                    hover={true}
                                    message={`${
                                      buttonToolTipTextList[buttonKey]
                                        ? buttonToolTipTextList[buttonKey]
                                        : buttonKey
                                    }`}
                                    key={buttonKey}
                                  >
                                    <IconButton
                                      key={buttonKey}
                                      disabled={!enableStatus[buttonKey]}
                                      intent="table"
                                      iconVariant={iconsMapping[buttonKey]}
                                      id={`listView-actionBar-${buttonKey}`}
                                      onClick={() =>
                                        handleActionBarButtonClick(buttonKey)
                                      }
                                    >
                                      <TextOverflowEllipsis>
                                        {actionBarButtons[buttonKey].label}
                                      </TextOverflowEllipsis>
                                    </IconButton>
                                  </Tooltip>
                                )
                              ))
                          )
                        )}
                      </Box>
                    ),
                  }}
                </ListView>
              )}
            </WhiteCard>
          </Grid>
        </StyledGrid>
      </Box>
      <FleetTypeModals />
      {moreOptionConfirmation.activeRequest && (
        <FleetMoreOptionConfirmation
          moreOptionConfirmation={moreOptionConfirmation}
          setFleetMoreOptionConfirmation={setMoreOptionConfirmation}
          resetSelctedRows={handleCancelRows}
        />
      )}
      {updateConfirmationModal && (
        <InlineEditConfirmationModal
          showCancelConfirmationModal={updateConfirmationModal}
          setShowCancelConfirmationModal={(value: boolean) =>
            setUpdateConfirmationModal(value)
          }
          handleCancelRows={handleCancelRows}
        />
      )}
      <CompartmentListViewModal
        isCompartmentListModalVisible={isCompartmentListModalVisible}
        setCompartmentListModalVisible={setCompartmentListModalVisible}
        selectedRow={selectedFleet}
        moduleName={'FLEET_TYPE'}
      />
    </>
  );
};

export default withReact(FleetTypeListView);
