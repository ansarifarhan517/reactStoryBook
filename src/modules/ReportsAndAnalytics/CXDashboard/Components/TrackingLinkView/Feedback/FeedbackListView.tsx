import React, { useState, Dispatch, useEffect } from "react";
import {
  IFilterOptions,
  IListViewColumn,
  ListView,
  Card,
  Grid,
  Box,
  Tooltip,
  IconButton,
  useToast,
  PopupWrapper,
  SectionHeader,
  Position,
  IFetchDataOptions
} from "ui-library";
import { useDispatch } from "react-redux";
import { transformMongoListViewToColumns } from "../../../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";
import { CXDashboardActions } from "../../../CXDashboard.actions";
import DYNAMIC_LABELS_MAPPING from "../../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../../common/DynamicLabels/useDynamicLabels";
import FileSaver from "file-saver";
import axios from "../../../../../../utils/axios";
import apiMappings from "../../../../../../utils/apiMapping";
import { sendGA } from "../../../../../../utils/ga";
import { withReactOptimized } from "../../../../../../utils/components/withReact";
import DownloadMessage from "../../../../../../utils/components/DownloadMessage";
import { filterDateFormatter } from "../../../Utils/helperFunction";
import {
  ModalWrapper,
  HeaderWrapper,
  IconButtonStyled,
} from "../../../Layouts/StaticLayout.style";

const FeedbackListView = () => {
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [flag, setFlag] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<any>();
  const [
    isDownloadReportDisabled,
    setDownloadReportDisabled,
  ] = useState<boolean>(false);
  const [showDownloadMessage, setShowDownloadMessage] = useState<boolean>(
    false
  );
  const Header = ({ setShowDownload }: any) => (
    <HeaderWrapper type="relative" display="block" id="header">
      <span style={{ marginLeft: "40%" }}> Download Report</span>
      <IconButtonStyled
        onClick={() => setShowDownload(false)}
        intent="default"
        iconVariant="close"
        onlyIcon
        iconSize="xs"
        color="white"
        hoverFeedback={false}
      />
    </HeaderWrapper>
  );
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const toast = useToast();
  const feebackListData = useTypedSelector(
    (state) => state.cxDashboardReducer?.trackingLink?.feedback?.listview?.data
  );
  const columnsStructure = useTypedSelector(
    (state) =>
      state.cxDashboardReducer?.trackingLink?.feedback?.listview?.structure
        ?.columns
  );
  const loading = useTypedSelector(
    (state) => state.cxDashboardReducer?.loading?.LISTVIEW
  );
  const dateFilter = useTypedSelector(
    (state) => state.cxDashboardReducer.calendar
  );
  const feedbackListCount =  useTypedSelector((state) => state.cxDashboardReducer?.listCount);
  

  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_FEEDBACK_STRUCTURE",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_FEEDBACK_DATA",
    });
  }, [dateFilter]);

  useEffect(() => {
    if (columnsStructure && Object.keys(columnsStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        columnsStructure,
        "cxDashboard_FeedbackList",
        {}
      );
      newColumns[newColumns.length - 1].width = 140;

      setColumns(newColumns);
    }
  }, [columnsStructure]);

  const handleFilterDataWrapper = React.useCallback(() => {
    if (flag) {
      setFlag(false);
      return;
    }
    function handleFilterData(combinedFilters: IFilterOptions) {
      setFilterOptions(combinedFilters);
      dispatch({
        type: "@@CXDashboard/GET_FEEDBACK_DATA",
        payload: {
          searchBy: combinedFilters?.searchBy || "",
          searchText: combinedFilters?.searchText || "",  
          pageSize: 1,
          pageNumber: 100 
        },
      });
    }

    return handleFilterData;
  }, [flag]);

  const handleFetchData = React.useCallback(({pageSize, pageNumber}: IFetchDataOptions) => {

    dispatch({
      type: '@@CXDashboard/GET_FEEDBACK_DATA',
      payload: {
        searchText: "string",
        searchBy: "string",
        pageNumber: pageNumber,
        pageSize: pageSize
      },
    });
  }, []);

  const handleDownloadReport = () => {
    sendGA("Feedback action button", "Feedback List View Download Report");
    setShowDownloadModal(true);
    setDownloadReportDisabled(true);
    // let payload = breadcrumbOptions[breadcrumbState]
  };

  const handleDownloadReportType = async (id: string) => {
    setShowDownloadMessage(true);
    setShowDownloadModal(false);
    try {
      const { data } = await axios.post(
        apiMappings.reports.cxDashboard.feedbackListDownload,
        {
          startDateFilter: filterDateFormatter(dateFilter.from),
          endDateFilter: filterDateFormatter(dateFilter.to),
          searchBy: filterOptions?.searchBy || "",
          searchText: filterOptions?.searchText || "",
          feedbackReportDownloadType: id,
        },
        {
          responseType: "arraybuffer",
        }
      );
      FileSaver.saveAs(
        new Blob([data], { type: "application/vnd.ms-excel xlsx" }),
        `${
          dynamicLabels.cxDashboardFeedbackReport ||
          "Customer Experience Feedback Report"
        }.csv`
      );
      setDownloadReportDisabled(false);
    } catch {
      toast.add(dynamicLabels.somethingWendWrong, "warning", false);
    }
  };

  return (
    <Grid item spacing="10px" lg={12}>
      <Card style={{ backgroundColor: "#fff" }}>
        <div style={{ fontSize: "13px" }}>{"Feedback List View"}</div>
        <ListView
          columns={columns}
          data={feebackListData}
          onFetchData = {handleFetchData}
          style={{ height: 400 }}
          isColumnLoading={loading}
          loading={loading}
          hideRefresh={loading}
          hideColumnSettings
          heightBuffer={10}
          rowIdentifier="orderNo"
          onFilterChange={handleFilterDataWrapper()}
          paginationPageSize={100}
           totalRows = {feedbackListCount}
        >
          {{
            IconBar: (
              <Box display="flex" style={{ position: "relative" }}>
                <Tooltip
                  message={`${dynamicLabels.download} ${dynamicLabels.feedbackReport}`}
                  hover
                  messagePlacement="end"
                >
                  <IconButton
                    key={"tt_DownloadVehicle"}
                    disabled={isDownloadReportDisabled}
                    iconVariant="icomoon-download"
                    iconSize={16}
                    onlyIcon
                    style={{ color: "inherit" }}
                    onClick={handleDownloadReport}
                  />
                </Tooltip>
              </Box>
            ),
          }}
        </ListView>
      </Card>
      {/* DOWNLOAD RESPONSE MODAL */}

      {showDownloadModal && (
        <ModalWrapper>
          <PopupWrapper
            header={<Header setShowDownload={setShowDownloadModal} />}
            content={
              <div style={{ margin: "15px" }}>
                {"Click on the below buttons to download the Feedback reports."}
              </div>
            }
            footer={
              <Box
                horizontalSpacing="10px"
                display="flex"
                justifyContent="flex-end"
                p="15px"
              >
                <IconButton
                  iconVariant="icomoon-download"
                  primary
                  iconSize={11}
                  onClick={() => handleDownloadReportType("overview")}
                >
                  <span style={{ fontSize: "13px" }}>Overview Report</span>
                </IconButton>
                <IconButton
                  iconVariant="icomoon-download"
                  primary
                  iconSize={11}
                  onClick={() => handleDownloadReportType("questionrating")}
                >
                  <span style={{ fontSize: "13px" }}>
                    Question Rating Report
                  </span>
                </IconButton>
              </Box>
            }
          />
        </ModalWrapper>
      )}
      {
        <DownloadMessage
          showInfoModal={showDownloadMessage}
          onToggle={setShowDownloadMessage}
        />
      }
    </Grid>
  );
};

export default FeedbackListView;
