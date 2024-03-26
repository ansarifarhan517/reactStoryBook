import React, { Dispatch } from "react";
import withReactOptimized from "../../../../utils/components/withReact";
import LayoutAdjustment from "../../../../utils/layouts/LayoutAdjustment";
import {
  ListViewHeader,
  ListViewContent,
} from "../../../../utils/layouts/ListViewStyles";
import { Box, IconButton, useToast, Loader, Tooltip } from "ui-library";
import WhiteCard from "../../../../utils/layouts/WhiteCard";
import SelectViewMode from "./components/SelectViewMode";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import BreadCrumbsFilter from "./components/BreadCrumbsFilter";
import DateRangeFilter from "./components/DateRangeFilter";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import MapView from "./components/MapView";
import TripListView from "./components/ListView";
import { useGlobalPopup } from "../../../common/GlobalPopup/useGlobalPopup";
import { useDispatch } from "react-redux";
import { tTripsListMileActions } from "./TripsListView.actions";
import {
  AdvancedFilterLabel,
  AppliedFilterStrip,
  ButtonWrapper,
  FilterAppliedTag,
  FilterAppliedTagLabel,
  FilterAppliedTagButtonWrapper,
} from "../../../common/AdvancedSearch/AdvancedSearch.styles";

import { AdvancedFilterComponentActions } from "../../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";
import { hybridRouteTo } from "../../../../utils/hybridRouting";
import { sendGA } from "../../../../utils/ga";

const TripsListViewEntry = ({
  printDRS,
  ngStateRouter,
  downloadStartedTripsReport,
  considerDotCompliace,
  showDotCompliaceResult,
  considerBackToHub
}: any) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.trips);
  const pageLabels = useTypedSelector(state => state.pageLabels)
  const viewMode = useTypedSelector(
    (state) => state.trips.listView.mile.viewMode
  );
  const clientProperties = useTypedSelector((state) => state.clientProperties);
  const listWrapperLoader = useTypedSelector(
    (state) => state.trips.listView.mile.loading.listViewWrapper
  );

  const openAdvFilter = useTypedSelector(
    (state) => state.advanceFilter.openAdvFilter
  );

  const filterListPayload = useTypedSelector(
    (state) => state.advanceFilter.filterListPayload
  );
  const currentFilter = useTypedSelector(
    (state) => state.advanceFilter.currentFilter
  );

  const globalPopup = useGlobalPopup();
  const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();
  const advanceFilterdispatch = useDispatch<
    Dispatch<AdvancedFilterComponentActions>
  >();
  const toast = useToast();

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
    showToast && toast.add(dynamicLabels?.filterRemovedSuccessfully, "check-round", false);
  };
  const handleToggleAdvancedFilter = () => {
    advanceFilterdispatch({
      type: "@@advanceFilter/SET_OPEN_ADV_FILTER",
      payload: !openAdvFilter,
    });
  };

  return (
    <LayoutAdjustment>
      <ListViewHeader>
        <BreadCrumbsFilter />
        {filterListPayload && viewMode === "listview" && (
          <Tooltip
            tooltipDirection="bottom"
            messagePlacement="center"
            hover
            message={
              <div style={{ textAlign: "left", fontSize: 12 }}>
                {currentFilter &&
                  currentFilter?.filters &&
                  currentFilter?.filters?.length > 0 && (
                    <>
                      <Box mb="10px">
                        Filters are applied on{" "}
                        {filterListPayload.operationLogic === "AND"
                          ? "ALL"
                          : "ANY"}{" "}
                        the following:
                      </Box>
                      {currentFilter &&
                        currentFilter?.filters?.map((f: any, i: any) => {
                          return (
                            <Box mb="5px">{`${i + 1}. ${f.fieldLabelKey} ${
                              f.labelValue
                                ? f.labelValue
                                : dynamicLabels[f.operationLabelKey]
                            } ${f.filterDataLabel ? f.filterDataLabel :f.filterData}`}</Box>
                          );
                        })}
                    </>
                  )}
                <div>
                  {currentFilter?.sortCriteria &&
                    currentFilter?.sortCriteria[0] && (
                      <>
                        <Box mb="10px" mt="10px">
                          Sorted by :
                        </Box>
                        <Box mb="5px">
                          {currentFilter?.sortCriteria[0]?.fieldLabelKey +
                            " in " +
                            currentFilter?.sortCriteria[0]?.operationSymbol}
                        </Box>
                      </>
                    )}
                </div>
              </div>
            }
          >
            <FilterAppliedTag>
              <FilterAppliedTagLabel onClick={handleToggleAdvancedFilter}>
                {currentFilter?.filterName?.trim() || "Filter Applied"}
              </FilterAppliedTagLabel>
              <FilterAppliedTagButtonWrapper>
                <IconButton
                  onClick={() => {
                    handleRemoveFilter();
                  }}
                  onlyIcon
                  iconVariant="close"
                  iconSize={10}
                  color="error.main"
                />
              </FilterAppliedTagButtonWrapper>
            </FilterAppliedTag>
          </Tooltip>
        )}
        <Box flexGrow={50} display='flex' justifyContent='flex-end'>
          {pageLabels.trips?.buttons?.add_create_trip && (
            <Tooltip message={`Click here to add ${dynamicLabels?.trip_s}.`} hover={true}>
              <IconButton
                intent='page'
                iconVariant='icomoon-add'
                onClick={() => {
                  sendGA('Navigation', 'Trip Button Click - Add Mile Trip')
                  hybridRouteTo('createTrip');
                }}
              >
                {dynamicLabels.add}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box flexGrow={1} display="flex" justifyContent="flex-end">
          <SelectViewMode />
        </Box>
        <Box ml="5px">
          {clientProperties?.DATEFORMAT && <DateRangeFilter />}
        </Box>
      </ListViewHeader>

      <ListViewContent>
        {listWrapperLoader && (
          <Loader center={true} fadeBackground={true} speed={1} />
        )}
        <>
          <Box flexGrow={1} fullWidth={viewMode === "listview"}>
            <WhiteCard
              style={{
                position: viewMode == "listview" ? "relative" : "initial",
              }}
              className="grid-customised-scroll-bar fullWidth fullHeight"
            >
              <>
                {globalPopup}
                {filterListPayload && viewMode === "listview" && (
                  <AppliedFilterStrip>
                    <AdvancedFilterLabel>
                      Advanced Filter Applied
                    </AdvancedFilterLabel>
                    <ButtonWrapper onClick={() => handleRemoveFilter()}>
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
                <TripListView
                  printDRS={printDRS}
                  ngStateRouter={ngStateRouter}
                  downloadStartedTripsReport={downloadStartedTripsReport}
                  considerDotCompliace={considerDotCompliace}
                  showDotCompliaceResult ={showDotCompliaceResult}
                ></TripListView>
              </>
            </WhiteCard>
          </Box>
          {viewMode === "mapview" && (
            // <Box style={{ width: "67%" }}>
            //   <WhiteCard className="fullWidth fullHeight">

            //   </WhiteCard>
            // </Box>
            <MapView considerBackToHub={considerBackToHub}></MapView>
          )}
        </>
      </ListViewContent>
    </LayoutAdjustment>
  );
};

export default withReactOptimized(TripsListViewEntry);
