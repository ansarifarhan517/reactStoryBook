import React, { useState, useEffect } from "react";
import { ColumnInstance } from 'react-table';
import {
  PieChartList,
  Loader,
  Card,
  ListView,
  IListViewColumn,
  Box,
  IconButton,
  ISortOptions,
  Tooltip
  // IFetchDataOptions,
} from "ui-library";
import moment from "moment";
import { getTotalOrdersComplaince, convertEpochToDateTimeZone } from "../../../../../utils/helper";
import { transformMongoListViewToColumns } from '../../../../../utils/mongo/ListView'
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { colorCodes } from "../../../colorCodes";
import DownloadReportModal from "../DownloadReportModal";
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';

const TotalOrders = (props: any) => {
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const [isReportModalVisible, setReportModalVisible] = useState<boolean>(false);
  const [params, setParams] = useState<any>("");
  const { totalOrdersReports, dynamicLabels, filterData, fetchTotalOrderReports, fetchTotalOrderComplianceReport, updateTotalOrdersColumnPreferences, handleComplianceReportDownload, reLoadComponent } = props;
  const { selectedBranches, selectedDates, selectedSkills } = filterData;
  const orderDetails: any =
    Object.keys(totalOrdersReports).length === 6 &&
    getTotalOrdersComplaince(totalOrdersReports, dynamicLabels, colorCodes);

  useEffect(() => {
    fetchTotalOrderReports();
    const payload = {
      size: 25,
      searchBy: "",
      searchText: "",
      sortBy: "tripName",
      sortOrder: "desc",
      searchAfter: null
    }
    fetchTotalOrderComplianceReport(payload);
  }, [selectedBranches, selectedDates, selectedSkills, reLoadComponent])

  useEffect(() => {
    if(reLoadComponent) {
      fetchTotalOrderReports();
      const payload = {
        size: 25,
        searchBy: "",
        searchText: "",
        sortBy: "tripName",
        sortOrder: "desc",
        searchAfter: null
      }
      fetchTotalOrderComplianceReport(payload);
    }
  }, [reLoadComponent])
  const isListViewLoading = useTypedSelector(state => state.analytics.driverComplianceAnalytics.listview.totalOrders);
  const structure = useTypedSelector(state => state.analytics.driverComplianceAnalytics.structure)
  const columnsSelector = useTypedSelector(state => state.analytics.driverComplianceAnalytics.structure.columns);
  const rowsSelector = useTypedSelector(state => state.analytics.driverComplianceAnalytics.totalOrdersComplianceSummaryData.results);

  const totalRowsSelector = useTypedSelector(state => state.analytics.driverComplianceAnalytics.totalOrdersComplianceSummaryData.totalCount)
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [pageOptions, setPageOptions] = useState<Array<object>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const calenderFields = ["estimatedStartDate", "estimatedEndDate", "actualStartDate", "actualEndDate", "pickupCheckIn", "pickupCheckOut", "pickupGeofenceEntry", "pickupGeofenceExit", "deliveryCheckIn", "deliveryCheckOut"];

  const cellCallbackMapping = {};

  useEffect(() => {
    const mongoStructure = columnsSelector

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'analyticsDACompliance', cellCallbackMapping)
      setColumns(newColumns)
    }

  }, [rowsSelector, columnsSelector]);

  const valueRef = React.useRef(rowsSelector);
  const currentPagevalueRef = React.useRef(rowsSelector);

  useEffect(() => {
    valueRef.current = rowsSelector;
  }, [rowsSelector])

  useEffect(() => {
    currentPagevalueRef.current = currentPage;
  }, [currentPage])

  const handlePageChange = (pageNumber: any, pageOpt: any) => {
    setPageOptions(pageOpt);
    setCurrentPage(pageNumber);
  }

  const handleFetchData = React.useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions
    }) => {
      const sortBy = sortOptions && Object.keys(sortOptions).length !== 0 ? sortOptions.sortBy : "tripName";

      const last = valueRef.current.length && valueRef.current[valueRef.current.length - 1];
      let searchAfter = null;
      const PageOpt = pageOptions;
      if (pageNumber === 1) {
        searchAfter = null;
        setPageOptions([]);
      } else if (currentPagevalueRef.current < pageNumber) {
        const temp = PageOpt.filter((option) => option["pageNum"] === pageNumber - 1);
        !temp[0] && PageOpt.push({
          pageNum: pageNumber - 1,
          sortBy: last[sortBy],
          shipmentId: last["shipmentId"],
        });
        searchAfter = [last[sortBy], last["shipmentId"]];

      } else {
        // const temp = Object.keys(PageOpt).filter((key)=>pageOptions[key].pageNum===pageNumber-1);
        const temp = PageOpt.filter((option) => option["pageNum"] === pageNumber - 1);
        searchAfter = [temp[0]["sortBy"], temp[0]["shipmentId"]];
      }
      handlePageChange(pageNumber, PageOpt);
      const payload = {
        size: pageSize,
        searchBy: filterOptions && Object.keys(filterOptions).length !== 0 ? filterOptions.searchBy : "",
        searchText: filterOptions && Object.keys(filterOptions).length !== 0 ? calenderFields.includes(filterOptions.searchBy) ? convertEpochToDateTimeZone(filterOptions.searchText) : filterOptions.searchText : "",
        sortBy: sortOptions && Object.keys(sortOptions).length !== 0 ? sortOptions.sortBy : "tripName",
        sortOrder: sortOptions && Object.keys(sortOptions).length !== 0 ? sortOptions?.sortOrder : "desc",
        searchAfter: searchAfter
      }
      setParams(payload);
      fetchTotalOrderComplianceReport(payload);
    },
    []
  );


  const onSaveColumnPreferences = React.useCallback((visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    const columns = { ...columnsSelector }
    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columns
    }
    updateTotalOrdersColumnPreferences(payload)
  }, [columnsSelector])


  const onSortChange = React.useCallback((sortBy: ISortOptions) => {
    console.log("Sort Changed: ", sortBy);
  }, []);

  const handleOrderCompianceReportDownload = (reportType: any) => {
    handleComplianceReportDownload(reportType, params)
  }

  return (
    <>
      {orderDetails.length === 6 && (
        <div className="total-order-chart-wrapper">
          <div className="totalOrderWrapper">
            <PieChartList
              isClickable={false}
              orderDetails={orderDetails}
              height={150}
              onLegendClick={(e: any) => console.log(e)}
              onClick={(e: any) => console.log(e)}
            />
          </div>
        </div>
      )}

      {(orderDetails.length !== 6 || columns.length === 0) && (
        <Card
          style={{
            flexGrow: 1,
            backgroundColor: colorCodes.transparent,
            overflow: 'hidden',
            width: '100%',
            marginTop: 0,
            height: '600px',
            position: "relative"
          }}
        >
          <Loader center={true} fadeBackground={true} speed={1} />
        </Card>
      )}

      <Card
        style={{
          width: '100%',
          background: colorCodes.white,
          padding: '20px 10px',
          margin: '15px 0',
          display: 'flex',
          minHeight: '400px',
          position: 'relative',
        }}
      >
        <Box
          className="total-order-report-title"
          display="flex"
          horizontalSpacing="10px"
        >
          <h3>
            {dynamicLabels.order_s} {dynamicLabels.report}{' '}
            <span>
              ({moment(selectedDates.startDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - {moment(selectedDates.endDate).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())})
            </span>
          </h3>
        </Box>
        {columns.length > 0 && (
          <ListView
            rowIdentifier="shipmentId"
            className="total-orders-compliance-report"
            columns={columns}
            data={rowsSelector}
            totalRows={totalRowsSelector}
            isColumnLoading={isListViewLoading}
            loading={isListViewLoading}
            onSortChange={onSortChange}
            onSaveColumnPreferences={onSaveColumnPreferences}
            onFetchData={handleFetchData}
            style={{ height: '90vh', width: '100%' }}
          >
            {{
              IconBar: 
              <Tooltip message={`${dynamicLabels.download} ${dynamicLabels.order_s} ${dynamicLabels.report}`} hover messagePlacement='end'>
              <IconButton
                id="DACompliance-listview-download"
                intent="page"
                onlyIcon
                iconVariant="icomoon-download"
                iconSize={16} 
                style={{ color: 'inherit' }}
                onClick={() => setReportModalVisible(true)}
                className="ordersReportDownloadBtn"
              />
              </Tooltip>
            }}
          </ListView>
        )}

        {isReportModalVisible &&
          <DownloadReportModal
            title={`${dynamicLabels.download} ${dynamicLabels.report}`}
            style={{ marginTop: 70 }}
            handleClose={setReportModalVisible}
            handleComplianceReportDownload={handleOrderCompianceReportDownload}
            selectedKPIs={[]}
            params={params}
            complianceReport={true}
            trackingReport={false}
            complianceReportButtonTitle={`${dynamicLabels.order_s} ${dynamicLabels.Compliance} ${dynamicLabels.summary}`}
            position={{ right: "0px", top: "50px" }}
            dynamicLabels={dynamicLabels}
          />
        }
      </Card>
    </>
  );
};

export default TotalOrders;