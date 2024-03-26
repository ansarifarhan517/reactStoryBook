import React, { useState, Dispatch, useEffect } from "react";
import {
  IListViewColumn,
  ListView,
  Card,
  Grid,
  IFilterOptions,
  Box,
  Tooltip,
  IconButton,
  useToast,
  SectionHeader,
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

const PromotionsListView = () => {
  const promotionListData =
    useTypedSelector(
      (state) =>
        state.cxDashboardReducer?.trackingLink?.promotions?.listview?.data
    ) || [];
  const columnsStructure = useTypedSelector(
    (state) =>
      state.cxDashboardReducer?.trackingLink?.promotions?.listview?.structure
        ?.columns
  );
  const dateFilter = useTypedSelector(
    (state) => state.cxDashboardReducer.calendar
  );

  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const [flag, setFlag] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<any>();
  const [
    isDownloadReportDisabled,
    setDownloadReportDisabled,
  ] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0]);
  const toast = useToast();
  const handlelActionLinkClick = (row: any) => {
    window.open(row.values.actionLink, "_blank");
  };
  const cellCallbackMapping = {
    actionLink: handlelActionLinkClick,
  };
  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_PROMOTION_STRUCTURE",
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: "@@CXDashboard/GET_PROMOTION_DATA",
    });
  }, [dateFilter]);
  React.useEffect(() => {
    if (columnsStructure && Object.keys(columnsStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        columnsStructure,
        "cxDashboard_PromotionList",
        cellCallbackMapping
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
        type: "@@CXDashboard/GET_PROMOTION_DATA",
        payload: {
          searchBy: combinedFilters?.searchBy || "",
          searchText: combinedFilters?.searchText || "",
        },
      });
    }

    return handleFilterData;
  }, [flag]);

  const handleDownloadReport = async () => {
    sendGA("Feedback action button", "Feedback List View Download Report");

    setShowDownloadModal(true);
    setDownloadReportDisabled(true);
    // let payload = breadcrumbOptions[breadcrumbState]

    // new logic ends

    try {
      const { data } = await axios.post(
        apiMappings.reports.cxDashboard.promotionsListDownload,
        {
          startDateFilter: filterDateFormatter(dateFilter.from),
          endDateFilter: filterDateFormatter(dateFilter.to),
          searchBy: filterOptions?.searchBy || "",
          searchText: filterOptions?.searchText || "",
        },
        {
          responseType: "arraybuffer",
        }
      );
      FileSaver.saveAs(
        new Blob([data], { type: "application/vnd.ms-excel xlsx" }),
        `${
          dynamicLabels.cxDashboardPromotionsReport ||
          "Customer Experience Promotions Report"
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
        <div style={{ fontSize: "13px" }}>{"Promotion List "}</div>
        <ListView
          columns={columns}
          data={promotionListData}
          style={{
            height: 400,
          }}
          // style={{ height: 400 }}
          hideRefresh
          hideColumnSettings
          heightBuffer={10}
          rowIdentifier="orderId"
          onFilterChange={handleFilterDataWrapper()}
          paginationPageSize={100}
        >
          {{
            IconBar: (
              <Box display="flex" style={{ position: "relative" }}>
                <Tooltip
                  message={`${dynamicLabels.download} ${dynamicLabels.promotionsList}`}
                  hover
                  messagePlacement="end"
                >
                  <IconButton
                    key={"tt_DownloadCXPromotionList"}
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
      <DownloadMessage
        showInfoModal={showDownloadModal}
        onToggle={setShowDownloadModal}
      />
    </Grid>
  );
};

export default PromotionsListView;
