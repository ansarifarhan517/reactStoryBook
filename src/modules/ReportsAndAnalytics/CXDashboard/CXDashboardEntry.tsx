import React, { Dispatch, useState, useEffect, useMemo } from "react";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { BreadCrumb, useToast } from "ui-library";
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { useDispatch } from "react-redux";
// import AdvancedFilterComponent from "../../common/AdvancedFilterComponent";
import { withReactOptimized } from "../../../utils/components/withReact";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import AnalyticsCXFilters from "./Layouts/AnalyticsCXFilters";
import {
  DashboardWrapper,
  FilterContainter,
  FilterWrapper,
} from "./CXDashboard.style";
// import SMSTrendHistogram from "./Components/SMSSentView/SMSTrendHistogram";
import StaticLayout from "./Layouts/StaticLayout";
import { CXDashboardActions } from "./CXDashboard.actions";
import DateRangeFilter from "./Layouts/DateRangeFilter";
import GroupByButtons from "./Layouts/GroupByButtons";
import DROPDOWN_FILTER_OPTIONS_MAPPING from "../../../utils/mongo/ListView/dropdownFilterOptions.mapping";

const CXDashboardEntry = (props: any) => {
  // Hooks
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.cxDashboard);
  const toast = useToast();
  const { saveSvgAsPng } = props


  const advanceFilterdispatch = useDispatch<
    Dispatch<AdvancedFilterComponentActions>
  >();
  const dispatch = useDispatch<Dispatch<CXDashboardActions>>();
  const dateFilter = useTypedSelector(
    (state) => state.cxDashboardReducer.calendar
  );
  const branchId = useTypedSelector(
    (state) => state.cxDashboardReducer?.filterOptions?.branchId
  );

  
  const subClientId = useTypedSelector(
    (state) => state.cxDashboardReducer?.filterOptions?.subClientId
  );
  const groupBy = useTypedSelector((state) => state.cxDashboardReducer.groupBy);

  //   State Variables
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  // adv filter

  const columnStructure = useMemo(() => {
    return {
      shipper: {
        label: "shipper",
        fieldName: "input",
        fieldType: "dropdown",
        permission: true,
        id: "shipper",
        required: false,
        childLength: 0,
        rowSpan: 2,
        colSpan: 0,
        childNodes: {},
        labelKey: "shipper",
        excelDropDownHidden: false,
        editable: false,
        searchable: true,
        sortable: true,
        customField: false,
        allowed: false,
        infoFlag: true,
        options: [],
      },
      branchName: {
        label: "Branch",
        fieldName: "input",
        fieldType: "select",
        permission: false,
        id: "branchName",
        required: false,
        childLength: 0,
        rowSpan: 2,
        colSpan: 0,
        childNodes: {},
        labelKey: "Branch",
        tooltipLabel: "newterdeo",
        descLabel: "newterdeo",
        excelDropDownHidden: false,
        editable: true,
        searchable: true,
        sortable: true,
        customField: false,
        allowed: false,
        infoFlag: false,
        options: [],
      },
    };
  }, []);

  const fetchDropdownOptions = async () => {
    const shipper =
      DROPDOWN_FILTER_OPTIONS_MAPPING?.["cxDashboard"]?.["shipper"];
    const branchName =
      DROPDOWN_FILTER_OPTIONS_MAPPING?.["cxDashboard"]?.["branchName"];
    try {
      const shipperOptions = await shipper();
      const branchNameOptions = await branchName();
      console.log(shipperOptions, branchNameOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const breadCrumbOptions = React.useMemo(
    () => [
      { id: "Analytics", label: dynamicLabels.analytics, disabled: true },
      {
        id: "customerExperience",
        label: dynamicLabels.customerExperienceSummary
          ? dynamicLabels.customerExperienceSummary
          : "Customer Experience Summary",
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  useEffect(() => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_COLUMNS_SELECTOR",
      payload: columnStructure,
    });
    fetchDropdownOptions();
  }, [columnStructure]);

  useEffect(() => {
    dispatch({ type: "@@CXDashboard/GET_CARD_DATA", payload: "overall" });
  }, [dateFilter, groupBy, branchId, subClientId]);

  const handleFilterSubmit = ({ selectedBranches, selectedShippers }) => {
    dispatch({
      type: "@@CXDashboard/SET_FILTER",
      payload: {
        branchId: selectedBranches.map((branch) => Number(branch)),
        subClientId: selectedShippers.map((shipper) => Number(shipper)),
      },
    });
  };

  return (
    <DashboardWrapper>
      <FilterWrapper>
        <BreadCrumb options={breadCrumbOptions} onClick={() => {}} />
        <FilterContainter>
          <GroupByButtons />
          <AnalyticsCXFilters
            dynamicLabels={dynamicLabels}
            isFilterVisible={isFilterVisible}
            setFilterVisible={setFilterVisible}
            handleFilterSubmit={handleFilterSubmit}
            onClick={() => {
              setFilterVisible(true);
            }}
          />
          <DateRangeFilter />
        </FilterContainter>
      </FilterWrapper>

      <StaticLayout  
       saveSvgAsPng={saveSvgAsPng}
      />
    </DashboardWrapper>
  );
};

export default withReactOptimized(CXDashboardEntry);
