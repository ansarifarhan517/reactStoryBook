import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  AdvancedFilter,
  tAdvancedFilterChildren,
  Tooltip,
  IconButton,
  useToast,
} from "ui-library";
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import { sendGA } from "../../../utils/ga";
//import { convertArrayToObject } from '../../../utils/helper'
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../DynamicLabels/useDynamicLabels";
import { AdvancedFilterComponentActions } from "./AdvancedFilterComponent.actions";
import {
  AdvancedFilterWrapper,
  FilterNumber,
} from "../../../modules/OrderRequest/OrderRequestListView/StyledOrderRequestListView";
import ThirdElement from "./ThirdElement";
import { IOperationType } from "../AdvancedSearch/AdvancedSearch.reducer";
import { SaveFilterParams } from "./constant";
import moment from "moment";
import { convertArrayToObject, toCapitalized } from "../../../utils/helper";
import { AdvancedFilterButton } from "../../Analytics/OverallSummary/OverallSummary.styles";

interface IOperationDataType {
  [key: string]: IOperationType[];
}
interface SectionData {
  sectionName: string;
  saveParams?: any;
}
interface IAdvFilter {
  handleFetchFilters: (callBackAdvanceFilter: boolean) => void;
  handleRemoveFilter: (showToast: boolean) => void;
  handleFetchData: (fetchOptions: any) => void;
  needsFetchDataCall?: boolean;
  data: SectionData;
  labelButton?: boolean;
  label?: string;
  pageName ?:string
}

const AdvancedFilterComponent = ({
  handleFetchFilters,
  handleRemoveFilter,
  handleFetchData,
  pageName,
  data,
  needsFetchDataCall = true,
  labelButton = false,
  label = ''
}: IAdvFilter) => {
  const dynamicLabels = useDynamicLabels(
    DYNAMIC_LABELS_MAPPING[data?.sectionName]
  );
  const dispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
  const toast = useToast();

  const firstLoad = useTypedSelector((state) => state.advanceFilter.firstLoad);
  const filterListPayload = useTypedSelector(
    (state) => state.advanceFilter.filterListPayload
  );
  const openAdvFilter = useTypedSelector(
    (state) => state.advanceFilter.openAdvFilter
  );

  const advancedFilterData = useTypedSelector(
    (state) => state.advanceFilter.advancedFilterData
  );
  const columnsSelector = useTypedSelector(
    (state) => state.advanceFilter.columnsSelector
  );
  const operations = useTypedSelector(
    (state) => state.advancedSearch.operations
  );
  const currentFilter = useTypedSelector(
    (state) => state.advanceFilter.currentFilter
  );
  const fetchOptions = useTypedSelector(
    (state) => state.advanceFilter.fetchOptions
  );
  const [operationManipulated, setOperationManipulated] = useState<
    undefined | IOperationDataType
  >();
  const dropdownOptions: any = React.useMemo(() => {
    if (data?.sectionName == "contract") {
      const excludeColumns = ["branchCount"];
      const newDropdownColumns = Object.values(columnsSelector).filter(
        (column) => !excludeColumns.includes(column.id)
      );
      return convertArrayToObject(newDropdownColumns);
    } else if (data?.sectionName == "fleet_p") {
      const newDropdownColumns = { ...columnsSelector };
      delete newDropdownColumns.breakStartTimeWindow;
      delete newDropdownColumns.breakEndTimeWindow;
      return newDropdownColumns;
    } else if (data?.sectionName == "order") {
      const advancedFilterExcludeColumns = [
        "lastTrackingDt",
        "networkStatus",
        "deliveryProcess",
        "isGeocoded",
        "trackNow",
        "deviceStatus",
        "customerName",
        "customerPhoneNo",
        "destClientNodeName",
        "timeWindowConfirmedBy",
      ];
      const newDropdownColumns = Object.values(columnsSelector).filter(
        (column) => !advancedFilterExcludeColumns.includes(column.id)
      );
      return convertArrayToObject(newDropdownColumns);
    } else {
      return columnsSelector;
    }
  }, [columnsSelector]);

  const prepareAppliedFilterData = (filterObject: any) => {
    let payload = {};
    let filters = filterObject.filters.map((o: any) => ({
      ...o,
      customField: false,
    }));
    let operationLogic =
      filterObject.operationLogic === "ALL"
        ? "AND"
        : filterObject.operationLogic === "ANY"
        ? "OR"
        : filterObject.operationLogic;
    
      filters.map(function (data: any) {
        if (data?.sectionName == "order") {
        if (
          data.fieldId == "orderDate" ||
          data.fieldId == "startTimeWindow" ||
          data.fieldId == "endTimeWindow" ||
          data.fieldId == "pickupStartTimeWindow" ||
          data.fieldId == "pickupEndTimeWindow" ||
          data.fieldId == "deliverStartTimeWindow" ||
          data.fieldId == "deliverEndTimeWindow" ||
          data.fieldId == "eta" ||
          data.fieldId == "lastTrackingDt" ||
          data.fieldId == "startDt" ||
          data.fieldId == "actualArrivalTime"
        ) {
          let filterDataArr = data.filterData.split(",");
          let sDate: any = "";
          let eDate: any = "";
          switch (filterDataArr[0]) {
            case "LAST30DAYS":
              sDate = moment(new Date()).subtract(29, "days");
              eDate = moment(new Date());
              break;
            case "LAST7DAYS":
              sDate = moment(new Date()).subtract(6, "days");
              eDate = moment(new Date());
              break;
            case "THISWEEK":
              sDate = moment(
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate() - new Date().getDay()
                )
              );
              eDate = moment(new Date());
              break;
            case "YESTERDAY":
              sDate = moment(new Date()).subtract(1, "days");
              eDate = moment(new Date()).subtract(1, "days");
              break;
            case "TOMORROW":
              sDate = moment(new Date()).add(1, "days");
              eDate = moment(new Date()).add(1, "days");
              break;
            case "TODAY":
              sDate = moment(new Date());
              eDate = moment(new Date());
              break;
            default:
              sDate = new Date(filterDataArr[0]);
              eDate = new Date(filterDataArr[1]);
          }
          data.filterData = `${moment(new Date(sDate))
            .startOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")},${moment(new Date(eDate))
            .endOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")}`;
        }
      }
      if (data.fieldId.indexOf("cf_") > -1) {
          data.customField = true;
          data.fieldLabelKey = `CUSTOM_${data.fieldId}`;
      }
      });
      payload = filterObject.sortCriteria
      ? {
          filters: filters,
          operationLogic: operationLogic,
          sortCriteria: filterObject.sortCriteria,
        }
      : {
          filters: filters,
          operationLogic: operationLogic,
        };
    return payload;
  };

  useEffect(() => {
    if (advancedFilterData !== undefined && !firstLoad) {
      /**  CHECK IF ANY FAVOURITE FILTER AVAILBLE, IF YES THEN APPLY IT***/
      const filterObject = advancedFilterData?.find((f: any) =>
        f?.isFavourite &&
        f?.favouriteSections?.length > 0 &&
        f?.favouriteSections?.find((e: string) => e === "list")
          ? f
          : false
      );
      if (filterObject) {
        let payload = prepareAppliedFilterData(filterObject);
        dispatch({
          type: "@@advanceFilter/SET_CURRENT_FILTERS",
          payload: { ...filterObject } as any,
        });
        dispatch({
          type: "@@advanceFilter/SET_FILTERLIST_PAYLOAD",
          payload,
        });
        dispatch({
          type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
          payload: false,
        });
        // dispatch({
        //   type: "@@advanceFilter/UPDATE_FIRST_LOAD",
        //   payload: true,
        // });
      }
      dispatch({
        type: "@@advanceFilter/SET_ADV_FILTER_LOADING",
        payload: true,
      });
      if (data?.sectionName) {
        dispatch({
          type: "@@advanceFilter/SET_SECTIONNAME",
          payload: data.sectionName,
        });
      }
      
    }
    if (data?.sectionName) {
      dispatch({
        type: "@@advanceFilter/SET_SECTIONNAME",
        payload: data.sectionName,
      });
    }
  }, [advancedFilterData]);

  useEffect(() => {
    if (window.location.hash === '#/deliverymedium/') {
      const operationsData = { ...operations };
      operationsData["skillsetfield"] = [
        {
          labelKey: "filterOpEquals",
          labelValue: "is",
          operation: "equals",
          operationSymbol: "="
        },
        {
          labelKey: "filterNotOpEquals",
          labelValue: "is not",
          operation: "isNotEquals",
          operationSymbol: "!=",
        },
        {
          labelKey: "contains",
          labelValue: "Contains",
          operation: "contains",
          operationSymbol: "rlike"
        },
        {
          labelKey: "filterOpIn",
          labelValue: "is any of",
          operation: "in",
          operationSymbol: "in"
        },
        {
          labelKey: "filterOpNotIn",
          labelValue: "is not any of",
          operation: "notin",
          operationSymbol: "not in"
        }
      ];
      setOperationManipulated(operationsData);
    } else {
      const operationsData = { ...operations };
      operationsData["customfieldnodecount"] = [
        {
          operation: "equals",
          operationSymbol: "=",
          labelKey: "filterOpEquals",
          labelValue: "is",
        },
      ];
      setOperationManipulated(operationsData);
    }
  }, [operations]);

  // Handle Save filters

  const handleSaveFilters = async (filterObject: any) => {
    sendGA(
      "ListView ActionBar",
      toCapitalized(data?.sectionName) +
        " List View Button Click - Save - Advanced Filter"
    );
    let payload: any = {};
    if (data?.sectionName == "fleet_p" || data?.sectionName == "orderRequest") {
      payload = {
        ...filterObject,
        ...data?.saveParams,
        id: filterObject.id == "draft" ? "" : filterObject.id,
      };
    } else if (data?.sectionName === "deliveryMedium") {
      if (filterObject && filterObject.filters !== undefined) {
        filterObject.filters.map((i: any) => {
          if (i.fieldId === "deliveryMediumMasterTypeCd" && (i.operationLabelKey === "filterOpEquals" || 
          i.operationLabelKey === "filterNotOpEquals" || i.operationLabelKey === "contains")) {
            i.filterData = i.filterData?.value ? i.filterData?.value : i.filterData;
          i.filterDataLabel = i.filterDataLabel?.value ? i.filterDataLabel?.value : i.filterDataLabel;
          }
       })
      }
      payload = {
        ...filterObject,
        ...SaveFilterParams[data?.sectionName],
        id: filterObject.id == "draft" ? "" : filterObject.id,
      };
    } else {
      payload = {
        ...filterObject,
        ...SaveFilterParams[data?.sectionName],
        id: filterObject.id == "draft" ? "" : filterObject.id,
      };
    }

    try {
      const {
        data: { message, status },
      } = await axios.post(apiMappings.advancedSearch.saveFilter, payload);
      if (status === 200) {
        await handleFetchFilters(true);
        toast.add(message, "check-round", false);
        return;
      }
      throw message;
    } catch (errorMessage) {
      console.log(dynamicLabels.saveFilterFailed, errorMessage);
      toast.add(dynamicLabels.saveFilterFailed, "warning", false);
    }
  };

  // Handle Update filters
  const handleUpdateFilter = async (filterObject: any) => {
    // Added code for opeartionLogic issue Bug #53074
    if (filterObject && filterObject["operationLogic"]) {
      filterObject["operationLogic"] =
        filterObject["operationLogic"] === "ALL"
          ? "AND"
          : filterObject["operationLogic"] === "ANY"
          ? "OR"
          : "AND";
    }
    let filterObjectCopy: any = filterObject;
    if (data?.sectionName) {
      filterObjectCopy = {
        ...filterObject,
        ...SaveFilterParams[data?.sectionName],
      };
    }

    const payload = [filterObjectCopy];
    try {
      const {
        data: { message, status },
      } = await axios.put(apiMappings.advancedSearch.updateFilter, payload);
      if (status === 200) {
        await handleFetchFilters(true);
        toast.add(message, "check-round", false);
        return;
      }
      throw message;
    } catch (errorMessage) {
      console.log(dynamicLabels.saveFilterFailed, errorMessage);
      toast.add(dynamicLabels.saveFilterFailed, "warning", false);
    }
  };

  // Handle delete filters
  const handleDeleteFilter = async (id: any) => {
    try {
      const {
        data: { message, status },
      } = await axios.delete(apiMappings.advancedSearch.deleteFilters, {
        data: [id.toString()],
      });
      if (status === 200) {
        await handleFetchFilters(true);
        toast.add(message, "check-round", false);
        handleRemoveFilter(false);
        return;
      }
      throw message;
    } catch (errorMessage) {
      console.log(dynamicLabels.deleteFilterFailed, errorMessage);
      toast.add(dynamicLabels.deleteFilterFailed, "warning", false);
    }
  };

  const handleApplyFilter = async (obj: any) => {
    sendGA(
      "ListView ActionBar",
      toCapitalized(data?.sectionName) +
        " List View Button Click - Apply - Advanced Filter"
    );
    const newObjCopy1 = { ...obj };
    const newObjCopy2 = { ...obj };
    if (obj.id === "draft") {
      newObjCopy1.id = "";
      newObjCopy2.id = "";
    }
    const advancedFilterDataCopy = advancedFilterData.filter(
      (e: { id: string }) => e.id != "draft"
    );
    if (newObjCopy1.id === "") {
      newObjCopy1.id = "draft";
    }

    let payload: any = prepareAppliedFilterData(obj);
    if (payload && payload.filters !== undefined) {
      payload.filters.map((i: any) => {
        if (i.fieldId === "deliveryMediumMasterTypeCd" && (i.operationLabelKey === "filterOpEquals" || 
        i.operationLabelKey === "filterNotOpEquals" || i.operationLabelKey === "contains")) {
          i.filterData = i.filterData?.value ? i.filterData?.value : i.filterData;
          i.filterDataLabel = i.filterDataLabel?.value ? i.filterDataLabel?.value : i.filterDataLabel;
        }
     })
    }
    dispatch({ type: "@@advanceFilter/SET_OPEN_ADV_FILTER", payload: false });
    dispatch({
      type: "@@advanceFilter/SET_CURRENT_FILTERS",
      payload: { ...newObjCopy1 },
    });
    dispatch({
      type: "@@advanceFilter/SET_FILTERLIST_PAYLOAD",
      payload: payload,
    });

    toast.add(
      dynamicLabels?.filterAppliedSuccessfully
        ? dynamicLabels?.filterAppliedSuccessfully
        : "Filter Applied Successfully.",
      "check-round",
      false
    );
    await handleFetchFilters(true);

    // take id and add property filterId in the applied filter object
    // send this id to AdvancedFilter
    if (newObjCopy2.id === "") {
      dispatch({
        type: "@@advanceFilter/SET_ADV_FILTER_DATA",
        payload: [...advancedFilterDataCopy, { ...newObjCopy1 }],
      });
    }
    dispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: false,
    });
    if (needsFetchDataCall)
      handleFetchData(fetchOptions);
  };

  return (
    <AdvancedFilterWrapper>
      <AdvancedFilter
        backButton={false}
        masterCondition
        allowSort
        allowFavourites
        allowMultipleFilters
        backButtonCallback={() => {}}
        chipsArray={advancedFilterData}
        dropDownOptions={dropdownOptions}
        fieldOperation={
          operationManipulated ? operationManipulated : operations
        }
        onApply={handleApplyFilter}
        onRemove={() => handleRemoveFilter(true)}
        onDelete={handleDeleteFilter}
        onSave={handleSaveFilters}
        onUpdate={handleUpdateFilter}
        onFavourite={handleUpdateFilter}
        ThirdElement={ThirdElement}
        showOpen={openAdvFilter}
        onAddFilter={() =>
          sendGA(
            "ListView ActionBar",
            toCapitalized(data?.sectionName) +
              " List View Button Click - Add - Advanced Filter"
          )
          
        }
        appliedFilterId={currentFilter && currentFilter?.id}
        // tooltips
        saveTooltip={`${dynamicLabels.save}`}
        markAsfavouriteTooltip={`${dynamicLabels.markAsFavourite}`}
        removeFavouriteTooltip={`${dynamicLabels.removeFavourite}`}
        cancelTooltip={`${dynamicLabels.cancel}`}
        duplicateTooltip={`${dynamicLabels.duplicate}`}
        style={{
          position: "absolute",
          right: 0,
          top: 25,
          zIndex: 999,
        }}
      >
        {({ open, setOpen }: tAdvancedFilterChildren) => (
          <Tooltip
            message={`${
              dynamicLabels?.clickHeretoApplyFiltersonList ||
              "Click here to apply filters on the list of"
            } ${dynamicLabels?.[data?.sectionName]}.`}
            hover={true}
            hide={open}
            tooltipDirection="bottom"
            arrowPlacement="center"
            messagePlacement="end"
          >
            { !labelButton ? ( <IconButton
              onClick={() => {
                if (open) {
                  sendGA(
                    "ListView ActionBar",
                    toCapitalized(data?.sectionName) +
                      " List View Button Click - Open - Advanced Filter"
                  );
                }
                dispatch({
                  type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
                  payload: !open,
                });
                setOpen && setOpen(!open);
              }}
              id={`${pageName}-actionBar-filter`}
              onlyIcon
              intent="default"
              iconVariant="icomoon-funel"
              iconSize={14}
              style={{ color: "inherit" }}
              /> ):
              (
                <AdvancedFilterButton 
                onClick={() => {
                  if (open) {
                    sendGA(
                      "ListView ActionBar",
                      toCapitalized(data?.sectionName) +
                        " List View Button Click - Open - Advanced Filter"
                    );
                  }
                  dispatch({
                    type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
                    payload: !open,
                  });
                  setOpen && setOpen(!open);
                }}>
                  <IconButton
                  id="tripSummary-actionBar-filter"
                  onlyIcon
                  iconVariant="icomoon-funel"
                  iconSize={11}
                  style={{fontSize : '3px', position: 'relative', top: '3px'}}
                  />
                  {label}
                  </AdvancedFilterButton>

              )  
              }
            {filterListPayload && (
              <FilterNumber>
                {(filterListPayload?.filters
                  ? filterListPayload?.filters?.length
                  : 0) +
                  (filterListPayload?.sortCriteria
                    ? filterListPayload?.sortCriteria?.length
                    : 0)}
              </FilterNumber>
            )}
          </Tooltip>
        )}
      </AdvancedFilter>
      {/* )} */}
    </AdvancedFilterWrapper>
  );
};
export default AdvancedFilterComponent;
