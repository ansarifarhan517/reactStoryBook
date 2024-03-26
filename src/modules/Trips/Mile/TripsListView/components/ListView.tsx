import React, { useEffect, useState, Dispatch, useRef } from "react";
import { IStateService } from "angular-ui-router";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { ColumnInstance } from "react-table";
import {
  IListViewColumn,
  ListView,
  useToast,
  Box,
  IconButton,
  Tooltip,
  IFilterOptions,
  ISortOptions,
  IFetchDataOptions
} from "ui-library";
import { useDispatch } from "react-redux";
import { tTripsListMileActions } from "../TripsListView.actions";
// import { ITripFilterOptions } from '../TripsListView.model'
import moment from "moment";
import { DownloadResponseModal } from "../subComponents/DownloadResponseModal";
import { cellCallbackMapping, handleActionCallback } from "./CallbackFunctions";
import {
  IActionCallback,
  ITripsListMileRowData,
  IUndeliveredTripListResponse,
  IUndeliveredTripRow,
  tTripsListMileBreadcrumbFilter,
} from "../TripsListView.model";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { ActionBar } from "../subComponents/ActionBar";
import { AxiosResponse } from "axios";
import { UndeliveredListView } from "./UndeliveredListView";
import ga, { sendGA } from "../../../../../utils/ga";
import { StyledInlinePopup, UncheckedOrdersNote } from "../TripListView.styles";
import PrintPage from "../subComponents/PrintPage";
import { handlePrint } from "../subComponents/PrintTable";
import { filterDateFormatter } from "../helper";
import { SortingRule } from "react-table";
import AdvancedFilterComponent from "../../../../common/AdvancedFilterComponent";
import { AdvancedFilterComponentActions } from "../../../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { getQueryParams } from "../../../../../utils/hybridRouting";
import InlineEditConfirmationModal from "../../../../../utils/components/InlineEditConfirmationModal";
import NoDataAvailable from "../subComponents/NoDataAvailable";
import store from "../../../../../utils/redux/store";
import PrintDRSModal from "../subComponents/PrintDRSModal";
import DownloadReportPopup from "../subComponents/DownloadReportPopup";
import TrackersListView from "../subComponents/TrackersListView";

let _ = require("underscore");
// import { AdvancedFilterLabel, AppliedFilterStrip, ButtonWrapper } from '../../../../common/AdvancedSearch/AdvancedSearch.styles';
interface ITripListViewProps {
  ngStateRouter: IStateService;
  printDRS: any;
  downloadStartedTripsReport?: any;
  considerDotCompliace: boolean;
  showDotCompliaceResult: boolean;
}
/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = {
  notify: false,
  reload: false,
  inherit: false,
  location: true,
};

const TripListView = ({
  printDRS,
  ngStateRouter,
  considerDotCompliace,
  showDotCompliaceResult,
}: ITripListViewProps) => {
  const tripListData = useTypedSelector(
    (state) => state.trips.listView.mile.data
  );
  const structure = useTypedSelector(
    (state) => state.trips.listView.mile.structure
  );
  const columnsStructure = useTypedSelector(
    (state) => state.trips.listView.mile.structure.columns
  );
  const viewMode = useTypedSelector(
    (state) => state.trips.listView.mile.viewMode
  );
  const breadcrumb = useTypedSelector(
    (state) => state.trips.listView.mile.breadcrumbFilter
  );
  const startDate = useTypedSelector((state) => state.trips.listView.mile.from);
  const endDate = useTypedSelector((state) => state.trips.listView.mile.to);  
  const listParamStartDate = useTypedSelector((state) => state.trips.listView.mile.listParams.from);
  const listParamEndDate = useTypedSelector((state) => state.trips.listView.mile.listParams.to);  
  const totalCount = useTypedSelector(
    (state) => state.trips.listView.mile.totalRows
  );
  const loading = useTypedSelector(
    (state) => state.trips.listView.mile.loading
  );
  const actionBarButtons = useTypedSelector(
    (state) => state.trips.listView.mile.structure.buttons
  );
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const editDetails = useTypedSelector(
    (state) => state.trips.listView.mile.editDetails
  );
  const filterData = useTypedSelector(
    (state) => state.trips.listView.mile.filters
  );
  const listWrapperLoader = useTypedSelector(
    (state) => state.trips.listView.mile.loading.listViewWrapper
  );
  const emptyData = useTypedSelector((state) => state.advanceFilter.emptyData);
  const tripSelectedRows = useTypedSelector(
    (state) => state.trips.listView.mile.selectedRows
  );
  const advancedFilterData = useTypedSelector(
    (state) => state.advanceFilter.advancedFilterData
  );
  //UNCOMMENT WHEN NEW REPORT DOWNLOAD GOES
  const filterListPayload = useTypedSelector(
    (state) => state.advanceFilter.filterListPayload
  );

  const advanceFilterdispatch = useDispatch<
    Dispatch<AdvancedFilterComponentActions>
  >();
  const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "")?.[
    "subClients"
  ]?.[0]?.["clientId"];
  const userId = JSON.parse(localStorage.getItem("userAccessInfo") || "")
    ?.userId;

  // const filterListPayload = useTypedSelector(state => state.trips.listView.mile.filterListPayload)

  const AdvanceFilterData = {
    sectionName: "trips",
  };

  let breadcrumbValue = useRef(breadcrumb);
  let viewModeValue = useRef(viewMode);
  const toast = useToast();
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const columnsRef = useRef<IListViewColumn[]>([]);
  const [isFilterDataCalled, setIsFilterDataCalled] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>();
  const [sort, setSort] = useState<SortingRule<object>[]>();
  const [selectedRows, setSelectedRows] = useState<{
    [key: string]: ITripsListMileRowData;
  }>({});
  const [showDownloadReportPopup, setShowDownloadReportPopup] = useState(false);
  const [showDownloadSuccessModal, setShowDownloadSuccessModal] = useState(false);
  const [showTrackersModal, setShowTrackerModal] = useState(false);
  const [clickedRow, setClickedRow] = useState({} as ITripsListMileRowData);

  const selectedUndeliveredOrderRows = useRef([]);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [isPrint, setIsPrint] = useState(false);
  const [
    showCancelConfirmationModal,
    setShowCancelConfirmationModal,
  ] = useState<boolean>(false);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  const breadCrumbMapper = {
    allTrips: "ALL",
    started: "STARTED",
    notStarted: "NOTSTARTED",
    ended: "ENDED",
  };

  useEffect(() => {
    breadcrumbValue.current = breadcrumb;
    viewModeValue.current = viewMode;
    handleFetchStructure(); //xxx
    handleQueryParams();
    handleFetchFilters();
  }, [breadcrumb]);

  useEffect(() => {
    dispatch({type: "@@tripsListViewMile/FETCH_LOOKUP_DATA"})
  }, []);

  useEffect(() => {
    if (emptyData) {
      handleFetchData(fetchOptions);
    }
  }, [emptyData, startDate]);

  useEffect(() => {
    dispatch({
      type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
      payload: {},
    });
  }, [viewMode]);

  useEffect(() => {
    setSelectedRows(tripSelectedRows);
    if (!Object.keys(tripSelectedRows)?.length) {
      fetchOptions.apis?.resetSelection();
    }
  }, [tripSelectedRows]);

  useEffect(() => {
    return () => {
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
        type: "@@tripsListViewMile/SET_BREADCRUMB_FILTER",
        payload: "allTrips",
      });
    };
  }, []);

  useEffect(() => {
    if (Object.keys(columnsStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        columnsStructure,
        "trips",
        { ...cellCallbackMapping, trackerCount: handleOpenTrackersModal }
      );
      const statusTransformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        if (column.accessor === "milkRun") {
          newcolumn.hrefdata =
            "`#/planning/result?id=${row.original.routePlanningId}`";
          newcolumn.callback = cellCallbackMapping["milkRun"](
            toast,
            dynamicLabels
          );
        } else if (column.accessor === "tripName") {
          switch (breadcrumbValue.current) {
            case "allTrips": {
              newcolumn.hrefdata =
                "`#/tripHst/tripDetails?tab=allTrips&tripId=${row.original.tripId}&tripName=${row.original.tripName}&bc_key=allTrips`";
              break;
            }
            case "started": {
              newcolumn.hrefdata =
                "`#/tripHst/tripDetails?tab=started&tripId=${row.original.tripId}&tripName=${row.original.tripName}&bc_key=started`";
              break;
            }
            case "notStarted": {
              newcolumn.hrefdata =
                "`#/tripHst/tripDetails?tab=notStarted&tripId=${row.original.tripId}&tripName=${row.original.tripName}&bc_key=notStarted`";
              break;
            }
            case "ended": {
              newcolumn.hrefdata =
                "`#/tripHst/tripDetails?tab=ended&tripId=${row.original.tripId}&tripName=${row.original.tripName}&bc_key=ended`";
              break;
            }
          }
        }
        return newcolumn;
      });
      setColumns(statusTransformedColumn);
      columnsRef.current = statusTransformedColumn;
    }
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_COLUMNS_SELECTOR",
      payload: columnsStructure,
    });
  }, [columnsStructure]);

  const handleOpenTrackersModal = (row) => {
    setShowTrackerModal(true);
    setClickedRow({...row});
  }

  const handleFetchData = React.useCallback(
    ({ pageSize, pageNumber, sortOptions, filterOptions, apis }: any) => {
      let customSort = {
        STARTED: {
          sortBy: "tripStartDt",
          sortOrder: "DESC",
        },
        NOTSTARTED: {
          sortBy: "estimatedStartDate",
          sortOrder: "DESC",
        },
        ENDED: {
          sortBy: "tripEndDt",
          sortOrder: "DESC",
        },
      };
      breadCrumbMapper[breadcrumbValue.current as string];
      let searchtext = filterOptions?.searchText;
      if (
        filterOptions?.searchBy == "weightCapacity" ||
        filterOptions?.searchBy == "volumeCapacity"
      ) {
        if (isNaN(filterOptions?.searchText)) {
          searchtext = filterOptions?.searchText;
        } else {
          let metric = store.getState().globals.metrics;
          if (filterOptions?.searchBy == "weightCapacity") {
            let metricValue = metric.weight.conversionFactor;
            let convertedWeight =
              filterOptions?.searchText / Number(metricValue);
            let precision = convertedWeight?.toFixed(4);
            let x = Math.ceil(Number(precision));
            if (x - Number(precision) <= 0.002) {
              searchtext = x;
            } else {
              searchtext = precision.slice(0, -5);
            }
          }
          if (filterOptions?.searchBy == "volumeCapacity") {
            let metricValue = metric.volume.conversionFactor;
            if (metricValue == 0.0000353146624) {
              let convertedVolume =
                filterOptions?.searchText / Number(metricValue);
              searchtext = String(convertedVolume).slice(0, 1);
            } else {
              let convertedVolume =
                filterOptions?.searchText / Number(metricValue);
              let precision = convertedVolume?.toFixed(4);
              let x = Math.ceil(Number(precision));
              if (x - Number(precision) <= 0.1) {
                searchtext = x;
              } else {
                searchtext = precision.slice(0, -4);
              }
            }
          }
        }
      }
      if (filterOptions?.searchBy == "unitsCapacity") {
        searchtext = parseInt(searchtext);
      }
      const payload = {
        endDateFilter: filterDateFormatter(endDate),
        endDateFilterNonUTC: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
        pageNumber: pageNumber,
        pageSize: pageSize,
        startDateFilter: filterDateFormatter(startDate),
        startDateFilterNonUTC: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
        status: breadCrumbMapper[breadcrumbValue.current as string] || "ALL",
        searchBy: filterOptions?.searchBy,
        searchText: searchtext,
        sortBy:
          breadcrumbValue.current == "allTrips"
            ? sortOptions?.sortBy
            : sortOptions?.sortBy
            ? sortOptions?.sortBy +
              "#@#" +
              customSort[breadCrumbMapper[breadcrumbValue.current as string]]
                .sortBy
            : customSort?.[
                breadCrumbMapper?.[breadcrumbValue.current as string]
              ].sortBy,
        sortOrder:
          breadcrumbValue.current == "allTrips"
            ? sortOptions?.sortOrder
            : sortOptions?.sortOrder
            ? sortOptions?.sortOrder +
              "#@#" +
              customSort[breadCrumbMapper[breadcrumbValue.current as string]]
                .sortOrder
            : customSort[breadCrumbMapper[breadcrumbValue.current as string]]
                .sortOrder,
      };

      dispatch({ type: "@@tripsListViewMile/SET_DATA_FILTER", payload });
      dispatch({ type: "@@tripsListViewMile/FETCH_DATA", payload });

      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });
    },
    [viewMode, endDate, startDate, listParamStartDate, listParamEndDate, filterListPayload]
  );

  const handleFetchStructure = () => {
    const { view } = getQueryParams();
    dispatch({
      type: "@@tripsListViewMile/FETCH_STRUCTURE",
      payload: view && view != viewMode ? view : viewMode,
    });
  };

  const handleRowSelection = (rows: {
    [key: string]: ITripsListMileRowData;
  }) => {
    dispatch({
      type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
      payload: rows,
    });
  };

  const handleSubmitButton = async (
    data: IUndeliveredTripListResponse,
    requestPayload?: any,
    tripIds?: number[]
  ) => {
    dispatch({
      type: "@@tripsListViewMile/SET_LOADING",
      payload: { undeliveredListView: true },
    });

    const rowIds = Object.keys(selectedUndeliveredOrderRows.current);
    const finalPayload: {
      tripId: number;
      notDispatchedShipments: any;
      deliveredShipments: any;
    }[] = requestPayload ? requestPayload : [];
    const createFinalData = (
      payload: {
        tripId: number;
        notDispatchedShipments: any;
        deliveredShipments: any;
      },
      shipmentList: IUndeliveredTripRow[]
    ) => {
      shipmentList.forEach((shipment) => {
        if (rowIds.includes(shipment?.shipmentId?.toString())) {
          payload.deliveredShipments.push(shipment.shipmentId);
        } else {
          payload.notDispatchedShipments.push(shipment.shipmentId);
        }
      });
    };
    const unDeliveredTripIds = data?.results?.map((trip) => trip.tripId);
    const stopTripWithoutShipment =
      (tripIds && tripIds.filter((id) => !unDeliveredTripIds?.includes(id))) ||
      [];
    data?.results?.forEach((tripRow) => {
      const shipmentList = [...tripRow.shipments];
      const payload = {
        tripId: tripRow.tripId,
        notDispatchedShipments: [],
        deliveredShipments: [],
      };
      createFinalData(payload, shipmentList);
      finalPayload.push(payload);
    });

    stopTripWithoutShipment.forEach((tripId) => {
      const payload = {
        tripId: tripId,
        notDispatchedShipments: [],
        deliveredShipments: [],
      };
      finalPayload.push(payload);
    });

    try {
      const {
        data: { hasError, message },
      } = await axios.post(
        apiMappings.trips.mile.listview.stopTrip,
        finalPayload
      );
      if (!hasError) {
        toast.add(message, "check-round", false);
        globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
        dispatch({ type: "@@tripsListViewMile/FETCH_DATA" });
        dispatch({
          type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
          payload: {},
        });
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { undeliveredListView: false },
        });
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { listViewWrapper: false },
        });
        fetchOptions.apis?.resetSelection();
      } else {
        toast.add(message, "warning", false);
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { undeliveredListView: false },
        });
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { listViewWrapper: false },
        });
      }
    } catch (error: any) {
      toast.add(error.message, "warning", false);
      dispatch({
        type: "@@tripsListViewMile/SET_LOADING",
        payload: { undeliveredListView: false },
      });
      dispatch({
        type: "@@tripsListViewMile/SET_LOADING",
        payload: { listViewWrapper: false },
      });
    }
  };
  const handleCancel = () => {
    if (!Object.keys(editDetails).length) {
      setEditMode(false);
      fetchOptions.apis?.resetSelection();
      dispatch({
        type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
        payload: {},
      });
    } else {
      setShowCancelConfirmationModal(true);
    }
  };

  const handleReviseETA = () => {
    sendGA('manual_eta_revision', 'Trip List View Button Clicked - ReviseETA');
    const promiseArray = Object.values(tripSelectedRows)?.map((item) => {
      const payload = {
        tripId: item.tripId,
        eventName: "MANUAL"
      };
      return axios.post(
        apiMappings.trips.mile.listview.reviseETA,
        payload
      );
    });
    Promise.all(promiseArray) 
    .then(() => {
      toast.add((dynamicLabels.ETA_revision_successful_message ? dynamicLabels.ETA_revision_successful_message : "ETA revision is successful for selected trip(s)."), "check-round", false);
    })
    .catch((error) => {
      console.log(error);
      toast.add((dynamicLabels.ETA_revision_failure_message ? dynamicLabels.ETA_revision_failure_message : "ETA revision failed for selected trip(s)."), "warning", false);
    })
  };

  const handleActionBarButtonClick = (id: IActionCallback) => {
    //console.log("Event Action ->",id);          //AkshayK - 64613
    if (id === "stopTrip") {
      const stopTripRows = async () => {
        // const rowIds = Object.keys(selectedRows);
        globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { listViewWrapper: true },
        });
        const tripIds = Object.values(selectedRows).map((row) => row.tripId);

        try {
          const {
            data: { data, hasError },
          } = await axios.get<
            any,
            AxiosResponse<{
              status: number;
              message: string;
              moreResultsExists: boolean;
              data: IUndeliveredTripListResponse;
              hasError: boolean;
            }>
          >(
            apiMappings.trips.mile.listview.getUndeliveredShipmentsForTrips +
              "?tripIds=" +
              tripIds
          );

          if (!hasError && data && data?.results && data?.results?.length > 0) {
            dispatch({
              type: "@@tripsListViewMile/SET_LOADING",
              payload: { listViewWrapper: false },
            });
            globalPopupDispatch({
              type: "@@globalPopup/SET_PROPS",
              payload: {
                isOpen: true,
                title: `${dynamicLabels.pendingActions} ${data?.totalCount} ${dynamicLabels.orders} (${tripIds.length} ${dynamicLabels.trips})`,
                content: (
                  <Box>
                    <UncheckedOrdersNote>
                      {dynamicLabels.uncheckedOrdersWillBeSentto}
                    </UncheckedOrdersNote>
                    <UndeliveredListView
                      data={data}
                      setSelectedRows={selectedUndeliveredOrderRows}
                    />
                  </Box>
                ),

                footer: (
                  <>
                    <IconButton
                      iconVariant="icomoon-tick-circled"
                      primary
                      onClick={() => handleSubmitButton(data, null, tripIds)}
                    >
                      {dynamicLabels.deliver}
                    </IconButton>
                    <IconButton
                      iconVariant="icomoon-close"
                      onClick={() =>
                        globalPopupDispatch({
                          type: "@@globalPopup/CLOSE_POPUP",
                        })
                      }
                    >
                      {dynamicLabels.cancel}
                    </IconButton>
                  </>
                ),
                width: "1196px",
                size: "md",
              },
            });
          } else if (
            !hasError &&
            data &&
            data?.results &&
            !data.results.length
          ) {
            const stopTripPayload: {
              tripId: number;
              notDispatchedShipments: never[];
              deliveredShipments: never[];
            }[] = [];
            tripIds.forEach((id) => {
              stopTripPayload.push({
                tripId: id,
                notDispatchedShipments: [],
                deliveredShipments: [],
              });
            });
            handleSubmitButton({}, stopTripPayload);
          } else {
          }
        } catch (e) {}
      };

      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: dynamicLabels.stopTripConfirmation || "Confirmation",
          content: dynamicLabels.areYouSureYouWantToStopTrip,
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={stopTripRows}
              >
                {dynamicLabels.stopLabel}
              </IconButton>
              <IconButton
                iconVariant="icomoon-close"
                onClick={() =>
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
                }
              >
                {dynamicLabels.cancel}
              </IconButton>
            </>
          ),
        },
      });
    } else if (id === "cancel") {
      handleCancel();
    } else if (id === 'reviseETA') {
      handleReviseETA();
    } else {
      const handleActionPayload = {
        id,
        selectedRows,
        dispatch,
        globalPopupDispatch,
        dynamicLabels,
        toast,
        setEditMode,
        columnsStructure,
        editDetails,
        printDRS,
        considerDotCompliace,
        showDotCompliaceResult,
      };
      handleActionCallback(handleActionPayload);
    }
  };

  const debouncedhandleActionBarButtonClick = _.debounce(
    handleActionBarButtonClick,
    1000
  );

  const onSaveColumnPreferences = React.useCallback(
    async (
      visibleColumnIds: Record<string, ColumnInstance<IListViewColumn>>
    ) => {
      const columns = { ...columnsStructure };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumnIds[columnKey];
      });
      columnsRef.current.forEach((column: any) => {
        column.isVisible = !!visibleColumnIds[column.accessor];
      });
      const payload = {
        ...structure,
        columns,
      };

      try {
        const {
          data: { message },
        } = await axios.put(
          apiMappings.trips.mile[viewMode].structure[breadcrumb],
          payload
        );
        message &&
          toast.add(
            `${dynamicLabels.columnPreferenceSuccess}`,
            "check-round",
            false
          );
      } catch (error: any) {
        console.log(error, error?.response);
      }
    },
    [columnsStructure]
  );

  const onApplyColumnPrederences = (
    selectedColumns: Record<string, boolean>
  ) => {
    columnsRef.current.forEach((column: any) => {
      column.isVisible = !!selectedColumns[column.accessor];
    });
  };
  // ,
  //   [columnsStructure])

  // Handle fetch Filters
  const handleFetchFilters = async (callBackAdvanceFilter = false) => {
    if (
      (!isFilterDataCalled &&
        ((advancedFilterData.length > 0 &&
          advancedFilterData[0].sectionName != "ALL_TRIPS_LIST_VIEW") ||
          advancedFilterData?.length == 0)) ||
      callBackAdvanceFilter
    ) {
      setIsFilterDataCalled(true);
      try {
        const { data } = await axios.get(
          apiMappings.advancedSearch.getFilters,
          {
            params: {
              modelName: "TRIPS",
              pageName: "TRIPS",
              sectionName: `ALL_TRIPS_LIST_VIEW`,
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
        setIsFilterDataCalled(false);
        toast.add(dynamicLabels.updateFilterFailed, "warning", false);
      }
    }
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
    dispatch({ type: "@@tripsListViewMile/FETCH_DATA" });
    showToast &&
      toast.add(dynamicLabels?.filterRemovedSuccessfully, "check-round", false);
  };

  const handleShowDownloadReportPopup = () => {
      if ((
        filterData.endDateFilter && filterData.startDateFilter &&
        moment(filterData.endDateFilter).diff(moment(filterData.startDateFilter), "days")) > 31
    ) {
      toast.add(dynamicLabels.check31Days, "warning", false);
      return;
    }
    setShowDownloadReportPopup(true);
  }

  const handleCancelRows = React.useCallback(() => {
    setShowCancelConfirmationModal(false);
    sendGA(
      "ListView ActionBar",
      "Trip List View Button Click - Cancel - Inline Edit"
    );
    dispatch({ type: "@@tripsListViewMile/CLEAR_EDIT_DETAILS" });
    dispatch({
      type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
      payload: {},
    });
    setEditMode(false);
    fetchOptions.apis?.resetSelection();
  }, [fetchOptions]);

  // HANDLE QUERY PARAMS FOR HISTORY RETENTION
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
        temp[s] = searchText[index]?.includes("~2F")
          ? searchText[index]?.replaceAll("~2F", "/")
          : searchText[index];
      });
    setFilters(temp);

    let breadcrumbName: tTripsListMileBreadcrumbFilter = filterData?.page as tTripsListMileBreadcrumbFilter;
    dispatch({
      type: "@@tripsListViewMile/SET_BREADCRUMB_FILTER",
      payload: breadcrumbName || "allTrips",
    });
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
      page: breadcrumb,
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
      ngStateRouter.go("trip", newParams, ngStateRouterOptions);
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
      page: breadcrumb,
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
      ngStateRouter.go("trip", newParams, ngStateRouterOptions);
    }, 100);
  };

  return (
    <>
      <DownloadResponseModal
        showDownloadModal={showDownloadSuccessModal}
        setShowDownloadModal={setShowDownloadSuccessModal}
        dynamicLabels={dynamicLabels}
      />
      {/* INLINE EDIT CANCEL CONFIRMATION MODAL */}
      <InlineEditConfirmationModal
        showCancelConfirmationModal={showCancelConfirmationModal}
        setShowCancelConfirmationModal={(value: boolean) =>
          setShowCancelConfirmationModal(value)
        }
        handleCancelRows={handleCancelRows}
      />
      <PrintDRSModal  selectedRows={selectedRows}/>
      {showTrackersModal ? 
        <TrackersListView 
          open={showTrackersModal} 
          setOpen={setShowTrackerModal} 
          dynamicLabels={dynamicLabels} 
          tripReferenceId={clickedRow.referenceId} 
        /> : null
      }
      {isPrint && (
        <PrintPage
          data={tripListData}
          columns={columnsRef.current}
          handlePrint={() => handlePrint(setIsPrint)}
          isPrint={isPrint}
        />
      )}
      {emptyData && !listWrapperLoader ? (
        <NoDataAvailable />
      ) : (
        <ListView
          style={{
            height: "100%",
            overflow: "visible",
            width: viewMode === "mapview" ? "490px" : "100%",
          }}
          totalRows={totalCount}
          columns={columns}
          data={tripListData}
          hasRowSelection
          // heightBuffer={10}
          rowIdentifier="tripId"
          paginationPageSize={50}
          onFetchData={handleFetchData}
          loading={!!loading.listView}
          isColumnLoading={loading.columnList}
          onRowSelect={handleRowSelection}
          onSaveColumnPreferences={onSaveColumnPreferences}
          onApply={onApplyColumnPrederences}
          isEditMode={isEditMode}
          filters={filters}
          onFilterChange={handleFilterChange}
          sorts={sort}
          onSortChange={handleSortChange}
        >
          {viewMode == "listview"
            ? {
                IconBar: (
                  <Box display="flex" style={{ position: "relative" }}>
                    <Tooltip message={`${dynamicLabels?.print}`} hover>
                      <IconButton
                        iconVariant="print"
                        iconSize={14}
                        onlyIcon
                        style={{ color: "inherit" }}
                        onClick={() => {
                          ga.event({
                            category: "ListView Action Bar ",
                            action: "Trips Button Click - Print",
                            label: `${clientId} - ${userId}`,
                          });
                          setIsPrint(true);
                        }}
                        id="Print"
                      />
                    </Tooltip>
                    <StyledInlinePopup id='download-trip-report-popup' title="Download Reports" isOpen={showDownloadReportPopup} width={500} height={300}
                      content={
                        <DownloadReportPopup
                          filterData={filterData}
                          dynamicLabels={dynamicLabels}
                          setShowDownloadSucess={setShowDownloadSuccessModal}
                          handleShowPopup={(value: boolean) => setShowDownloadReportPopup(value)}
                        />
                      }
                    >
                      <Tooltip message={`Download All ${dynamicLabels.trip_s} Reports`} hover>
                        <IconButton
                          iconVariant="icomoon-download"
                          iconSize={16}
                          onlyIcon
                          style={{ color: "inherit" }}
                          onClick={handleShowDownloadReportPopup}
                          id='btn-download-trip-reports'
                        />
                      </Tooltip>
                    </StyledInlinePopup>
                    <AdvancedFilterComponent
                      handleFetchFilters={handleFetchFilters}
                      handleRemoveFilter={(showToast: boolean) =>
                        handleRemoveFilter(showToast)
                      }
                      handleFetchData={handleFetchData}
                      data={AdvanceFilterData}
                      needsFetchDataCall={false}
                    />
                  </Box>
                ),
                ActionBar: (
                  <ActionBar
                    isEditMode={isEditMode}
                    actionBarButtons={actionBarButtons}
                    dynamicLabels={dynamicLabels}
                    selectedRows={selectedRows}
                    handleActionBarButtonClick={
                      debouncedhandleActionBarButtonClick
                    }
                  />
                ),
              }
            : {
                IconBar: (
                  <Box display="flex" style={{ position: "relative" }}>
                    <Tooltip message={`${dynamicLabels?.print}`} hover>
                      <IconButton
                        iconVariant="print"
                        iconSize={14}
                        onlyIcon
                        style={{ color: "inherit" }}
                        onClick={() => {
                          ga.event({
                            category: "ListView Action Bar ",
                            action: "Trips Button Click - Print",
                            label: `${clientId} - ${userId}`,
                          });
                          setIsPrint(true);
                        }}
                        id="Print"
                      />
                    </Tooltip>
                  </Box>
                ),
              }}
        </ListView>
      )}{" "}
    </>
  );
};

export default React.memo(TripListView);
