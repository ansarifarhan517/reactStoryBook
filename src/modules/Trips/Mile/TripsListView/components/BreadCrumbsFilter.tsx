import React, { useEffect, Dispatch } from "react";
import { BreadCrumb } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import {
  getQueryParams,
  createURLParams,
  hybridRouteTo,
  routeContains,
} from "../../../../../utils/hybridRouting";
import { useDispatch } from "react-redux";
import { tTripsListMileActions } from "../TripsListView.actions";
import { tTripsListMileBreadcrumbFilter } from "../TripsListView.model";

const BreadCrumbsFilter = () => {
  const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();

  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  const pageLabels = useTypedSelector((state) => state.pageLabels);
  const breadcrumbFilter = useTypedSelector(
    (state) => state.trips.listView.mile.breadcrumbFilter
  );
  const viewMode = useTypedSelector(
    (state) => state.trips.listView.mile.viewMode
  );
  // const filters = useTypedSelector(state => state.trips.listView.mile.filters);
  // const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

  useEffect(() => {
    const { page } = getQueryParams();
    dispatch({
      type: "@@tripsListViewMile/SET_BREADCRUMB_FILTER",
      payload: page || "allTrips",
    });
  }, []);

  const breadcrumbFilterLabelMapping: Record<
    tTripsListMileBreadcrumbFilter,
    string
  > = React.useMemo(
    () => ({
      allTrips: dynamicLabels.allTrips,
      started: `${dynamicLabels.started} ${dynamicLabels.trip_p}`,
      notStarted: `${dynamicLabels.notStarted} ${dynamicLabels.trip_p}`,
      ended: `${dynamicLabels.ended} ${dynamicLabels.trip_p}`,
    }),
    [dynamicLabels]
  );

  const breadCrumbsOptions = React.useMemo(() => {
    return [
      { id: "routes", label: dynamicLabels["Trip Planning"], disabled: true },
      { id: "trips", label: pageLabels.trips?.pageTitle, disabled: true },
      {
        id: breadcrumbFilter,
        disabled: false,
        label: breadcrumbFilterLabelMapping[breadcrumbFilter],
      },
    ];
  }, [dynamicLabels, pageLabels]);

  const breadCrumbsFilterOptions = React.useMemo(() => {
    return [
      {
        id: "allTrips",
        value: "allTrips",
        label: breadcrumbFilterLabelMapping.allTrips,
      },
      {
        id: "started",
        value: "started",
        label: breadcrumbFilterLabelMapping.started,
      },
      {
        id: "notStarted",
        value: "notStarted",
        label: breadcrumbFilterLabelMapping.notStarted,
      },
      {
        id: "ended",
        value: "ended",
        label: breadcrumbFilterLabelMapping.ended,
      },
    ];
  }, [dynamicLabels]);

  const handleClick = React.useCallback(
    (id: string) => {
      dispatch({
        type: "@@tripsListViewMile/SET_BREADCRUMB_FILTER",
        payload: id as tTripsListMileBreadcrumbFilter,
      });

      const routeTo = routeContains("view=")
        ? "trips/" + createURLParams("page", id)
        : "trips/" + createURLParams("page", id) + "&view=" + viewMode;
      hybridRouteTo(routeTo);
      // dispatch({ type: '@@tripsListViewMile/FETCH_DATA', payload: filters });
      // dispatch({ type: '@@tripsListViewMile/FETCH_STRUCTURE' });
    },
    [viewMode]
  );

  return (
    <BreadCrumb
      options={breadCrumbsOptions}
      optionList={breadCrumbsFilterOptions}
      onClick={handleClick}
      css={{ verticalAlign: "top" }}
    />
  );
};

export default BreadCrumbsFilter;
