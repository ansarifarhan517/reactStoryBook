import { IStateService } from "angular-ui-router";
import React, { useEffect, Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import { ColumnInstance } from "react-table";
import {
  Card,
  Box,
  ListView,
  IListViewColumn,
  IFetchDataOptions,
  withPopup,
  IconButton,
  withToastProvider,
  useToast,
  ISelectedRows,
  ButtonGroup,
  Grid,
  BreadCrumb,
  Tooltip,
  DateRangePicker,
  TextInput,
} from "ui-library";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import { sendGA } from "../../../../../utils/ga";
import { handleCustomColumnSort } from "../../../../../utils/helper";
import { transformMongoListViewToColumns } from "../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import withRedux from "../../../../../utils/redux/withRedux";
import { withThemeProvider } from "../../../../../utils/theme";
import { cellCallbackMapping } from "../../../../Trips/Mile/TripsListView/components/CallbackFunctions";
import { ListViewWrapper, StyledGrid } from "./OverallSummaryList.styled";
import { OverallSummaryListViewActions } from "../../OverallSummary.actions";
import OverallDownloadModal from "../utils/OverallDownloadModal";
import firebaseRef from "../../../../../utils/firebase";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import FileSaver from "file-saver";
import {
  AdvancedFilterLabel,
  AppliedFilterStrip,
} from "../../../../OrderRequest/OrderRequestListView/StyledOrderRequestListView";
import { ButtonWrapper } from "../../OverallSummary.styles";
import moment from "moment";

interface IOverallSummaryListViewProps {
  ngStateRouter: IStateService;
  selectedDate: any;
  handleRemoveFilters: Function;
}

const overallSummaryListView = ({
  ngStateRouter,
  selectedDate,
  handleRemoveFilters,
}: IOverallSummaryListViewProps) => {
  const dispatch = useDispatch<Dispatch<OverallSummaryListViewActions>>();
  const structure = useTypedSelector(
    (state) => state.overallSummaryListView.structure
  );
  const columnsSelector = useTypedSelector(
    (state) => state.overallSummaryListView.structure.columns
  );
  const rowsSelector = useTypedSelector(
    (state) => state.overallSummaryListView.data.results
  );
  const totalRowsSelector = useTypedSelector(
    (state) => state.overallSummaryListView.data.totalCount
  );
  const loading = useTypedSelector(
    (state) => state.overallSummaryListView.loading.listView
  );
  const columnsLoading = useTypedSelector(
    (state) => state.overallSummaryListView.loading.columns
  );
  const filterListPayload = useTypedSelector(
    (state) => state.advanceFilter.filterListPayload
  );

  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const toast = useToast();
  const viewMode = "listview";
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING.overallSummary + ",Resources"
  );
  const hitStampNow = Date.now().toString();

  // useEffect(() => {
  //   dispatch({ type: "@@OverallSummaryListAction/SET_DATES",
  //    payload: {
  //      minDate : selectedDate.startDate,
  //      maxDate: selectedDate.endDate
  //    }
  //   })
  // },[selectedDate])

  useEffect(() => {
    dispatch({ type: "@@OverallSummaryListAction/FETCH_STRUCTURE" });
    handleFetchData(fetchOptions);
  }, []);

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (Object.keys(mongoStructure)?.length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "tripSummaryList",
        cellCallbackMapping
      );
      const transformedColumn = newColumns.map((column: any) => {
        const newcolumn = column;
        return newcolumn;
      });
      setColumns(transformedColumn);
    }
  }, [columnsSelector]);

  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis,
    }: IFetchDataOptions) => {
      sortOptions = handleCustomColumnSort(sortOptions);
      dispatch({
        type: "@@OverallSummaryListAction/SET_LOADING",
        payload: { listView: true },
      });

      setFetchOptions({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis,
      });

      dispatch({
        type: "@@OverallSummaryListAction/FETCH_DATA",
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
    [selectedDate, filterListPayload]
  );

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s);
  }, []);

  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      sendGA(
        "Column Preference Action",
        "Trip Summary List View Save & Apply column"
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
        } = await axios.put(
          apiMappings.overallSummary.listview.structure,
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
    [columnsSelector]
  );

  const getSocketConnection = (timestamp: any) => {
    let timeStampString = timestamp.toString();
    let accessToken = localStorage.getItem("userAccessInfo");
    accessToken = accessToken ? JSON.parse(accessToken).token : null;
    const driverCreateRef = firebaseRef
      .database()
      .ref(`sockets/triplistreport/${accessToken}/${timeStampString}`);

    driverCreateRef.on("value", function (snapshot) {
      if (snapshot.val()) {
        var reportURL = snapshot.val().value;
        if (reportURL && reportURL == "dynamicreport_FAILED") {
          toast.add(
            dynamicLabels["internal.server.error"] != null
              ? dynamicLabels["internal.server.error"]
              : "Internal Server Error",
            "error",
            false
          );
        } else if (reportURL && reportURL.length > 0) {
          console.log('Download OverallSummary Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
          window.location.href = reportURL;
        }
        driverCreateRef.off("value");
      }
    });
  };

  const handleDownloadReport = async () => {
    sendGA(
      "Overall Summary List View Action Button",
      `Overall Summary List View  - Normal Download Report`
    );
    if (moment(selectedDate?.endDate).diff(moment(selectedDate?.startDate), 'days') > 30) {
      toast.add(dynamicLabels.dateRange31DayValidationMsg, 'warning', false);
    }else{
    const payload = {};

    const searchString =
      fetchOptions.filterOptions?.searchBy &&
      fetchOptions.filterOptions?.searchText
        ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}`
        : "";
    const sortString =
      fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder
        ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}`
        : "";

    try {
      console.log('Download OverallSummary Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
      const { data } = await axios.post(
        `${apiMappings.overallSummary.downloadTripExcelFMLM}?&endTimeWindow=${selectedDate.endDate}&startTimeWindow=${selectedDate.startDate}&hitStamp=${hitStampNow}${searchString}${sortString}`,
        payload,
        { responseType: "arraybuffer" }
      );

      getSocketConnection(hitStampNow);
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  }
  };

  const handleEsignDownloadReport = async () => {
    sendGA(
      "Overall Summary List View Action Button",
      `Overall Summary List View  - Normal Download Report`
    );
    if (moment(selectedDate?.endDate).diff(moment(selectedDate?.startDate), 'days') > 30) {
      toast.add(dynamicLabels.dateRange31DayValidationMsg, 'warning', false);
    }else{
    const payload = {};

    const searchString =
      fetchOptions.filterOptions?.searchBy &&
      fetchOptions.filterOptions?.searchText
        ? `&searchBy=${fetchOptions.filterOptions?.searchBy}&searchText=${fetchOptions.filterOptions?.searchText}`
        : "";
    const sortString =
      fetchOptions.sortOptions?.sortBy && fetchOptions.sortOptions?.sortOrder
        ? `&sortBy=${fetchOptions.sortOptions?.sortBy}&sortOrder=${fetchOptions.sortOptions?.sortOrder}`
        : "";

    try {
      const { data } = await axios.post(
        `${apiMappings.overallSummary.downloadTripEPOD}?&endTimeWindow=${selectedDate.endDate}&startTimeWindow=${selectedDate.startDate}${searchString}${sortString}`,
        payload,
        { responseType: "arraybuffer" }
      );

      FileSaver.saveAs(
        new Blob([data], { type: "application/zip" }),
        `EPOD.zip`
      );
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  }
  };

  return (
    <>
      <div id="toast-inject-here"></div>
      <Box
        display="flex"
        flexDirection="column"
        style={{ width: "100%", height: "100vh", paddingTop: "32px" }}
        px="15px"
        pb="15px"
      >
        <StyledGrid
          container
          spacing={5}
          style={{
            boxShadow: viewMode === "listview" ? "0 2px 20px -10px #000" : "",
          }}
        >
          <>
            <Grid
              className="grid-customised-scroll-bar"
              item
              md={viewMode === "listview" ? 12 : 4}
              style={{ display: "flex", overflow: "hidden" }}
            >
              <Card
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  width: "100%",
                  paddingRight: 0,
                  paddingBottom: 0,
                }}
              >
                {filterListPayload && (
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>
                      Advanced Filter Applied
                    </AdvancedFilterLabel>
                    <ButtonWrapper onClick={() => handleRemoveFilters(true)}>
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

                {columns?.length > 0 && (
                  <ListViewWrapper>
                    <ListView
                      rowIdentifier="tripId"
                      style={{ height: "100%", overflow: "visible" }}
                      columns={columns}
                      data={rowsSelector}
                      onFetchData={handleFetchData}
                      totalRows={totalRowsSelector}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      hideRefresh={loading || columnsLoading}
                    >
                      {viewMode === "listview"
                        ? {
                            IconBar: (
                              <Box
                                display="flex"
                                style={{ position: "relative" }}
                              >
                                <Tooltip
                                  message={dynamicLabels.downloadReport}
                                  hover
                                  messagePlacement="end"
                                >
                                  <IconButton
                                    id="OverallSumary-list-download"
                                    key={"tt_DownloadHiredDA"}
                                    disabled={false}
                                    iconVariant="icomoon-download"
                                    iconSize={16}
                                    onlyIcon
                                    style={{ color: "inherit" }}
                                    onClick={() => {
                                      setShowDownloadModal(true);
                                    }}
                                  />
                                </Tooltip>
                              </Box>
                            ),
                          }
                        : undefined}
                    </ListView>
                  </ListViewWrapper>
                )}

                {showDownloadModal && (
                  <OverallDownloadModal
                    handleClose={setShowDownloadModal}
                    handleReportDownload={handleDownloadReport}
                    handleEsignReportDownload={handleEsignDownloadReport}
                  />
                )}
              </Card>
            </Grid>
          </>
        </StyledGrid>
      </Box>
    </>
  );
};

export default withThemeProvider(
  withToastProvider(
    withRedux(withPopup(overallSummaryListView)),
    "toast-inject-here"
  )
);
