import React, { Dispatch, useState, useEffect } from "react";
import moment from "moment-timezone";
import { useDispatch } from "react-redux";
import {
  Box,
  BreadCrumb,
  ButtonGroup,
  IconButton,
  Tooltip,
  useToast,
} from "ui-library";
import { getBreadCrumbOptions } from "../OrderListOptionData/data";

import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IOrderFetchDataOptions, tStatus } from "./OrderListView.models";
import { hybridRouteTo } from "../../../utils/hybridRouting";
import {
  FilterAppliedTag,
  FilterAppliedTagLabel,
  FilterAppliedTagButtonWrapper,
} from "./StyledOrderListView";
import { ReactTooltipCustom as ReactTooltip } from "../../../utils/layouts/ReactTooltipCustom";
import useClientProperties from "../../../modules/common/ClientProperties/useClientProperties";
import DateRangePickerComponent from "../SubComponent/DateRangePicker";
import { ISetViewMode, OrderListViewActions } from "./OrderListView.actions";
// import { getUrlVars } from "../OrderListOptionData/utils";
import UploadExcel from "../../../utils/wrapper/uploadExcel";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { sendGA } from "../../../utils/ga";

interface IOrderHeader {
  handleFetchData: any;
  setSelectedStatus: any;
  selectedStatus: string;
  filterListPayload: any;
  ngStateRouter: any;
  fetchOptions: any;
}
const OrderListHeader = (props: IOrderHeader) => {
  const toast = useToast();
  const {
    handleFetchData,
    setSelectedStatus,
    selectedStatus,
    filterListPayload,
  } = props;
  const [fetchOptions, setFetchOptions] = useState<IOrderFetchDataOptions>({});
  const advanceFilterdispatch = useDispatch<
    Dispatch<AdvancedFilterComponentActions>
  >();
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels); // Use type select
  const breadCrumbList = [
    {
      id: "orders",
      label: dynamicLabels["orders"] || "Orders",
      disabled: true,
    },
  ];
  const dispatch = useDispatch<Dispatch<OrderListViewActions>>();
  const currentFilter = useTypedSelector(
    (state) => state.advanceFilter.currentFilter
  );
  const breadCrumbOptionList = React.useMemo(
    () => getBreadCrumbOptions(dynamicLabels),
    [dynamicLabels]
  );

  const dynamicBreadcrumbHeader = breadCrumbOptionList.find(
    (option: any) => option.value.toLowerCase() === selectedStatus.toLowerCase()
  );
  dynamicBreadcrumbHeader &&
    breadCrumbList.push({
      id: dynamicBreadcrumbHeader?.id || "",
      label: dynamicBreadcrumbHeader?.label || "",
      disabled: false,
    });

  const breadCrumbOptions = breadCrumbList;
  const pageLabels = useTypedSelector((state) => state.pageLabels.orders);
  const handleBreadcrumbChange = (value: string) => {
    dispatch({
      type: "@@orderListView/FETCH_STRUCTURE_SUCCESS",
      payload: { columns: {}, buttons: {} },
    });
    const date = dateRangePickerText && dateRangePickerText.trim().split(" - ");

    const sDate = moment(date[0]).format(`YYYY-MM-DD HH:mm:ss`);
    const edDate = moment(date[1]).format(`YYYY-MM-DD HH:mm:ss`);
    // this has to be mapped with api in camel case.eg: 'notDispatched'
    // const id = breadCrumbOptionList.find(
    //     (option: any) => option.value.toLowerCase() === value.toLowerCase()
    // )?.id
    setSelectedStatus(value as tStatus);
    hybridRouteTo(
      `order?page=${value}&stDate=${sDate}&eDate=${edDate}&view=listview`
    );
  };
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  const format = clientProperties?.DATEFORMAT?.propertyValue
    ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
    : " YYYY-MM-DD";
  const startDate = useTypedSelector(
    (state) => state.order.listView.dateRange.startDate
  );
  const endDate = useTypedSelector(
    (state) => state.order.listView.dateRange.endDate
  );
  const dateFormatting = `${moment(startDate).format(
    `${format} hh:mm A`
  )} - ${moment(endDate).format(`${format} hh:mm A`)}`;
  const [dateRangePickerText, setDateRangePickerText] = useState<string>(
    dateFormatting
  );

  const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false);

  useEffect(() => {
    const dateFormatting = `${moment(startDate).format(
      `${format} hh:mm A`
    )} - ${moment(endDate).format(`${format} hh:mm A`)}`;
    setDateRangePickerText(dateFormatting);
  }, [clientProperties]);
  const viewMode = useTypedSelector((state) => state.order.listView.viewMode);
  /** Variables */
  const ButtonGroupData = React.useMemo(
    () =>
      pageLabels?.viewOptions
        ? Object.keys(pageLabels?.viewOptions).map((key: string) => ({
            id: key,
            label: pageLabels?.viewOptions[key].toUpperCase(),
            selected: key === viewMode,
            icon: key === "mapview" ? "default-marker" : "menu",
            tooltipText:
              key === "mapview"
                ? `${dynamicLabels.showsTheCurrentLocationOfThe} ${dynamicLabels.orders} ${dynamicLabels.onAMap}`
                : `${dynamicLabels.showsTheListViewOfAllThe} ${dynamicLabels.orders}`,
          }))
        : [],
    [pageLabels, viewMode, dynamicLabels]
  );

  const filterDateFormatter = React.useCallback((date?: Date) => {
    const format = clientProperties?.DATEFORMAT?.propertyValue
      ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
      : " YYYY-MM-DD";
    return moment.tz(date, format).utc().format("YYYY-MM-DD HH:mm:ss");
  }, []);

  const handleOpenAdvancedFilter = () => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: true,
    });
  };

  const handleRemoveFilters = () => {
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
    // handleFetchData(fetchOptions);
    toast.add(dynamicLabels?.filterRemovedSuccessfully, "check-round", false);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      style={{ width: "100%" }}
      py="15px"
    >
      {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
      <div style={{ marginLeft: "5px", marginBottom: "-15px" }}>
        <BreadCrumb
          options={breadCrumbOptions}
          onClick={(value: string) => {
            handleBreadcrumbChange(value);
          }}
          optionList={breadCrumbOptionList}
          width="165px"
        />
        {filterListPayload && (
          <Tooltip
            maxWidth={600}
            tooltipDirection="bottom"
            messagePlacement="center"
            hover
            message={
              <div style={{ textAlign: "left", fontSize: 12 }}>
                <Box mb="10px">
                  Filters are applied on{" "}
                  {filterListPayload.operationLogic === "AND" ? "ALL" : "ANY"}{" "}
                  of the the following conditions:
                </Box>
                {currentFilter &&
                  currentFilter?.filters &&
                  currentFilter?.filters.map((f: any, i: any) => {
                    return (
                      <Box mb="5px">{`${i + 1}. ${f.fieldLabelKey} ${
                        f?.labelValue || f?.operationSymbol
                      } ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
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
                  onClick={() => handleRemoveFilters()}
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
      <Box
        display="flex"
        justifyContent="space-evenly"
        horizontalSpacing="10px"
        style={{ marginRight: "-20px" }}
      >
        {pageLabels?.buttons.add && (
          <>
            <IconButton
            id="orders--actionbar--add"
              intent="page"
              data-tip
              data-for="tt_AddOrder"
              iconVariant="icomoon-add"
              onClick={() => {
                sendGA("Event New", "Orders - Add order btn");
                hybridRouteTo("order/addorder");
              }}
            >
              {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
            </IconButton>
            <ReactTooltip
              id="tt_AddOrder"
              type="info"
              effect="solid"
              place="bottom"
            >
              {`${dynamicLabels.add_order}`}
            </ReactTooltip>
          </>
        )}

        {pageLabels?.buttons.upload && (
          <>
            <IconButton
             id="orders--actionbar--upload"
              data-tip
              data-place="bottom"
              // data-offset="{'top': 10, 'left': 10}"
              data-for="tt_UploadOrder"
              intent="page"
              style={{ marginRight: "10px" }}
              iconVariant="icomoon-upload"
              onClick={() => {
                sendGA("Event New", "Orders - Upload order excel");

                setShowUploadPopup(true);
              }}
            >
              {dynamicLabels[pageLabels?.buttons.upload] ||
                dynamicLabels.Upload}
            </IconButton>
            <ReactTooltip
              id="tt_UploadOrder"
              type="info"
              effect="solid"
              place="bottom"
            >
              <div
              // style={{
              //     maxWidth: "100px",
              //     lineHeight: "20px",
              //     textAlign: "center",
              // }}
              >
                {`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.orders}`}
              </div>
            </ReactTooltip>
          </>
        )}

        {ButtonGroupData.length > 0 && (
          <ButtonGroup
            data={ButtonGroupData}
            onChange={(id) => {
              sendGA(
                "Event New",
                `Orders - ${id == "listview" ? "list view" : "map view"}`
              );
              dispatch({
                type: "@@orderListView/SET_VIEW_MODE",
                payload: id,
              } as ISetViewMode);
            }}
          />
        )}

        <DateRangePickerComponent
          startDate={startDate}
          endDate={endDate}
          setDateRangePickerText={setDateRangePickerText}
          handleFetchData={handleFetchData}
          fetchOptions={fetchOptions}
          filterDateFormatter={filterDateFormatter}
          dateRangePickerText={dateRangePickerText}
          setFetchOptions={setFetchOptions}
          dynamicLabels={dynamicLabels}
        />
        <UploadExcel
          isOpen={showUploadPopup}
          featureName="order"
          onSuccess={() => {
            setShowUploadPopup(false);
            handleFetchData(fetchOptions);
          }}
          onClose={() => setShowUploadPopup(false)}
        />
      </Box>
    </Box>
  );
};

export default OrderListHeader;
