import { tTripsListMileActions } from "../TripsListView.actions";
import { IconButton, Box, FontIcon } from "ui-library";
import { tGlobalPopupAction } from "../../../../common/GlobalPopup/GlobalPopup.reducer";
import React from "react";
import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import {
  createURLParamList,
  getQueryParams,
  hybridRouteTo,
} from "../../../../../utils/hybridRouting";
import { ITripsListMileRowData } from "../TripsListView.model";
import { IMongoField } from "../../../../../utils/mongo/interfaces";
import ga, { sendGA } from "../../../../../utils/ga";
import store from "../../../../../utils/redux/store";
import {  getUTCDateTZ } from "../../../../../utils/helper";


interface IHandleActionPayload {
  id: string;
  selectedRows: {
    [key: string]: ITripsListMileRowData;
  };
  dispatch: React.Dispatch<tTripsListMileActions>;
  globalPopupDispatch: React.Dispatch<tGlobalPopupAction>;
  dynamicLabels: {
    [key: string]: string;
  };
  toast: any;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  columnsStructure: {
    [key: string]: IMongoField;
  };
  editDetails: any;
  printDRS: any;
  considerDotCompliace?:boolean,
  showDotCompliaceResult?:boolean
}


export const handleActionCallback = ({
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
  showDotCompliaceResult
}: IHandleActionPayload) => {
  //get selected rows
  //send the selected rows to respective function to execute the
  //operation on those rows
  // const dispatch = useDispatch<Dispatch<tTripsListMileActions>>();

  // ga.event({                                     -------> AkshayK - 64613
  //   category: "Trip action button",
  //   action: `Trip - ${dynamicLabels[id]}`,
  //   label: "Trip List View",
  // });

  const printDRSTemplates = store.getState().trips.listView.mile.printDrs.templates
  const rowId = Number(Object.keys(selectedRows)[0]);
  const deleteRow = () => {
    const deleteSelectedRows = async () => {
      const listOfRowIds = Object.keys(selectedRows).map((row) => Number(row));
      globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
      try {
        const {
          data: { message, hasError },
        } = await axios.delete(apiMappings.trips.mile.listview.deleteRow, {
          data: listOfRowIds,
        });
        if (!hasError) {
          dispatch({
            type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
            payload: {},
          });
          dispatch({ type: "@@tripsListViewMile/FETCH_DATA" });
          toast.add(message, "check-round", false);
        } else {
          toast.add(message, "warning", false);
        }
      } catch (e) {
        toast.add(
          e?.response?.data?.message ? e?.response?.data?.message : e?.message,
          "warning",
          false
        );
      }
    };
    globalPopupDispatch({
      type: "@@globalPopup/SET_PROPS",
      payload: {
        isOpen: true,
        title: dynamicLabels.deletionConformation || "Confirmation",
        content: (
          <div style={{ fontSize: "14px" }}>
            <div>{dynamicLabels?.delete_Confirmation_Warning}</div>
            <br />
            <Box horizontalSpacing="5px">
              <FontIcon
                color="error.main"
                variant="icomoon-warning-circled"
                size={14}
              />
              <span>
                {dynamicLabels?.delete_Confirmation_Warning_2?.substring(
                  4,
                  dynamicLabels?.delete_Confirmation_Warning_2?.length
                ) || `You can't undo this action.`}
              </span>
            </Box>
          </div>
        ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              iconVariant="icomoon-delete-empty"
              primary
              onClick={deleteSelectedRows}
            >
              {dynamicLabels.Delete}
            </IconButton>
            <IconButton
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() =>
                globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
              }
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        ),
      },
    });
  };
  const printMultiDRS = () => {
    if (printDRSTemplates?.length > 0) {
      dispatch({type:'@@tripsListViewMile/SET_DRS_MODAL_OPEN' ,payload: true})
  } else {
      toast.add(dynamicLabels.printDrsConfigTemplate, "warning", false);
  }   

  };
  const showDRS = () => {
    dispatch({
      type: "@@tripsListViewMile/SET_LOADING",
      payload: { listViewWrapper: true },
    });

   
    const showDRSmapper = {
      milkrunid: "routePlanningId",
      selectedTripStatus: "tripStatus",
      routeName: "routeName",
      tripname: "tripName",
      tripid: "tripId",
      currDeliveryBoy: "deliveryMediumName",
      currVehicleNumber: "vehicleNo",
      currDriver: "driverName",
      dmid: "deliveryMediumId",
      branchId: "clientBranchId",
      custCount: "uniqueCustomerCount",
      flightNumber: "transportVehicleNumber",

    };
    const showDRSData = [
      { key: "milkrunid", value: "" },
      { key: "tripname", value: "" },
      { key: "tripid", value: "" },
      { key: "currDeliveryBoy", value: "" },
      { key: "currVehicleNumber", value: "" },
      { key: "currDriver", value: "" },
      { key: "routeName", value: "" },
      { key: "dmid", value: "" },
      { key: "selectedTripStatus", value: "" },
      { key: "branchId", value: "" },
      { key: "custCount", value: "0" },
      { key: "flightNumber", value: "" },
    ];
    if (selectedRows[rowId]) {
      showDRSData.forEach((element, index) => {
        if (selectedRows[rowId][showDRSmapper[element.key]]) {
          element.value = selectedRows[rowId][showDRSmapper[element.key]];
        } else {
          showDRSData.splice(index, 1);
        }
      });
    }
    if(considerDotCompliace && showDotCompliaceResult){
      showDRSData.push( { key: "considerDotCompliace", value: "true" })
      showDRSData.push( { key: "showDotCompliaceResult", value: "true" })
    }
    // upsertUrlParamList(showDRSData);
    if (showDRSData?.[0]?.value) {
      if (Object.keys(selectedRows).length > 1) {
        toast.add(dynamicLabels.pleaseSelectOnlyOneTrip, "warning", false);
      } else {
        //router.go
        const newUrl = "deliveryRunSheetList" + createURLParamList(showDRSData);
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { listViewWrapper: false },
        });
        hybridRouteTo(newUrl);
      }
    } else {
      toast.add(dynamicLabels.routePlanningIdNotAvailabe, "warning", false);
    }
  };
  const startTrip = () => {
    const startTripRows = async () => {
      const rowIds = Object.keys(selectedRows);
      globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
      try {
        const {
          data: { message, hasError },
        } = await axios.post(apiMappings.trips.mile.listview.startTrip, rowIds);
        if (!hasError) {
          toast.add(message, "check-round", false);
          dispatch({ type: "@@tripsListViewMile/FETCH_DATA" });
          dispatch({
            type: "@@tripsListViewMile/SET_SELECTED_TRIP_ROWS",
            payload: {},
          });
        } else {
          toast.add(message, "warning", false);
        }
      } catch (e) {
        toast.add(
          e?.response?.data?.message || dynamicLabels.somethingWendWrong,
          "warning",
          false
        );
      }
    };

    globalPopupDispatch({
      type: "@@globalPopup/SET_PROPS",
      payload: {
        isOpen: true,
        title: dynamicLabels.startTripConfirmation || "Confirmation",
        content: dynamicLabels.areYouSureYouWantToStartTrip,
        footer: (
          <>
            <IconButton
              iconVariant="icomoon-tick-circled"
              primary
              onClick={startTripRows}
            >
              {dynamicLabels.startLabel}
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
  };

  const updateRecord = () => {
    setEditMode(true);
    let vehiclesList = store.getState().trips.listView.mile.dropdownMapping.vehicles || [];
    let reduced = vehiclesList.reduce(function(filtered, option) {
       if (option.status == "Available") {
          var someNewValue = {
           label: option?.value,
           value: option?.value,
           id: option?.id,
           title: option?.value
         }
          filtered.push(someNewValue);
       }
       return filtered;
     }, []);
     store.dispatch({
       type: "@@tripsListViewMile/SET_AVAILABLE_FLEETDETAILS_DROPDOWN",
       payload: {
        availableVehicles : reduced
       },
     });
  };

  const saveRecords = async () => {
    const isValid = ValidatedEditDetails(
      columnsStructure,
      editDetails,
      setEditMode,
      dispatch,
      toast
    );
    const dmList = store.getState().trips?.listView?.mile?.dropdownMapping
      ?.deliveryAssociateName as any;
    const vehicles = store.getState().trips?.listView?.mile?.dropdownMapping
      ?.vehicles;
    const drivers = store.getState().trips?.listView?.mile?.dropdownMapping
      ?.drivers;
    const branches = store.getState().trips?.listView?.mile?.dropdownMapping
      ?.branches;
    dispatch({
      type: "@@tripsListViewMile/SET_LOADING",
      payload: { listViewWrapper: true },
    });
    const dmListMapper = dmList?.reduce(
      (
        aggr: { [x: string]: any },
        currentVal: { label: string | number; id: any }
      ) => {
        aggr[currentVal.label] = currentVal.id;
        return aggr;
      },
      {}
    );

    const vehiclesMapper = vehicles?.reduce(
      (aggr: { [x: string]: any }, currentVal: any) => {
        aggr[currentVal.label] = currentVal.id;
        return aggr;
      },
      {}
    );

    const driversMapper = drivers?.reduce(
      (aggr: { [x: string]: any }, currentVal: any) => {
        aggr[currentVal.label] = currentVal.id;
        return aggr;
      },
      {}
    );

    const branchesMapper = branches?.reduce(
      (aggr: { [x: string]: any }, currentVal: any) => {
        aggr[currentVal.label] = currentVal.id;
        return aggr;
      },
      {}
    );
    if (isValid) {
      const milkRunObject = {};
      const finalPayload: Partial<ITripsListMileRowData>[] = [];
      Object.values(selectedRows).forEach((row: ITripsListMileRowData) => {
        if (editDetails[row.tripId]) {
          const obj: any = {
            tripId: row.tripId,
          };
          Object.keys(columnsStructure).forEach((columnId) => {
            if (
              columnsStructure?.[columnId]?.editable &&
              !columnsStructure?.[columnId]?.customField &&
              editDetails?.[row.tripId]?.[columnId]
            ) {
              if (columnId == "tripName") {
                if (
                  editDetails?.[row.tripId]?.[columnId]?.value &&
                  editDetails?.[row.tripId]?.[columnId]?.value !== row[columnId]
                ) {
                  obj[columnId] =
                    editDetails?.[row.tripId]?.[columnId]?.value ||
                    row[columnId];
                }
              } else if (columnId === "deliveryMediumName") {
                obj[columnId] =
                  editDetails?.[row.tripId]?.[columnId]?.value || row[columnId];
                obj["deliveryMediumId"] = dmListMapper?.[obj[columnId]];
              } else if (columnId === "driverName") {
                obj[columnId] =
                  editDetails?.[row.tripId]?.[columnId]?.value || row[columnId];
                obj["driverId"] = driversMapper?.[obj[columnId]];
              } else if (columnId === "vehicleNo") {
                obj[columnId] =
                  editDetails?.[row.tripId]?.[columnId]?.value || row[columnId];
                obj["vehicleId"] = vehiclesMapper?.[obj[columnId]];
              } else if (columnId === "deliveryMediumBranch") {
                obj[columnId] =
                  editDetails?.[row.tripId]?.[columnId]?.value || row[columnId];
                obj["clientBranchId"] = branchesMapper?.[obj[columnId]];
              }else if(columnId === "estimatedStartDate" || columnId === "scheduledDepartureTime"){
                const val =  editDetails?.[row.tripId]?.[columnId]?.value;    
                const TIMEZONE = JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezone'] ||  store?.getState()?.clientProperties?.TIMEZONE?.propertyValue;
                const myTimeZoneMode = localStorage.getItem('userAccessInfo') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '' )?.['timezoneMode'] == 'MYTIMEZONE' ? true : false): false;   
                 if (!myTimeZoneMode) {
                 obj[columnId] =  getUTCDateTZ(val, '', row[columnId + 'TZ'] ? row[columnId + 'TZ'] :TIMEZONE);
                } else {
                  obj[columnId] =  getUTCDateTZ(val);   
                }
                if(editDetails?.[row.tripId]?.[columnId + "TZ"]?.value && columnId === "estimatedStartDate"){  
                  obj[columnId + 'TZ'] = editDetails?.[row.tripId]?.[columnId + "TZ"]?.value ? editDetails?.[row.tripId]?.[columnId + "TZ"]?.value:TIMEZONE;
                }
              } else {
                obj[columnId] =
                  editDetails?.[row.tripId]?.[columnId]?.value || row[columnId];
              }
            }
          });

          const payloadParams = {
            deliveryMediumName: row.deliveryMediumName,
            routePlanningId: row.routePlanningId,
            tripId: row.tripId,
          };
          if (milkRunObject[row.routeName]) {
            milkRunObject[row.routeName].push({ ...payloadParams, ...obj });
          } else {
            milkRunObject[row.routeName] = [{ ...payloadParams, ...obj }];
          }
        }
      });
      try {
        Object.entries(milkRunObject).forEach(([key, value]: [any, any]) => {
          const routePlanningId = value[0].routePlanningId;
          finalPayload.push({
            milkRun: key,
            routePlanningId: routePlanningId,
            trips: [...value],
          });
        });
        const {
          data: { message, hasError },
        } = await axios.put(
          apiMappings.trips.mile.listview.updateTrip,
          finalPayload
        );
        if (hasError) {
          toast.add(message, "warning", false);
          dispatch({
            type: "@@tripsListViewMile/SET_LOADING",
            payload: { listViewWrapper: false },
          });
        } else {
          setEditMode(false);
          toast.add(message, "check-round", false);
          dispatch({ type: "@@tripsListViewMile/CLEAR_EDIT_DETAILS" });
          dispatch({ type: "@@tripsListViewMile/FETCH_DATA" });
          dispatch({
            type: "@@tripsListViewMile/SET_LOADING",
            payload: { listViewWrapper: false },
          });
        }
      } catch (error) {
        dispatch({
          type: "@@tripsListViewMile/SET_LOADING",
          payload: { listViewWrapper: false },
        });
        toast.add(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : dynamicLabels.somethingWendWrong,
          "warning",
          false
        );
      }
    } else {
      dispatch({
        type: "@@tripsListViewMile/SET_LOADING",
        payload: { listViewWrapper: false },
      });
    }
  };

  switch (id) {
    case "delete": {
      if (
        Object.values(selectedRows).find(
          (row: any) => row.tripStatus !== "NOTSTARTED"
        )
      ) {
        toast.add(
          dynamicLabels.onlyNotStartedTripsAllowed
            ? dynamicLabels.onlyNotStartedTripsAllowed
            : "Only Not Started trips can be deleted",
          "warning",
          false
        );
      } else {
        sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);   //AkshayK - 64613
        deleteRow();
      }
      break;
    }
    case "printMultiDrs": {
      sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);     //AkshayK - 64613
      printMultiDRS();
      break;
    }
    case "showdrs": {
      sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);     //AkshayK - 64613
      showDRS();
      break;
    }
    case "startTrip": {
      sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);     //AkshayK - 64613
      startTrip();
      break;
    }
    case "update": {
      sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);     //AkshayK - 64613
      updateRecord();
      break;
    }
    case "save": {
      sendGA("Trip action button", `Trip - ${dynamicLabels[id]}`);     //AkshayK - 64613
      saveRecords();
      break;
    }

    default: {
      break;
    }
  }
};

const ValidatedEditDetails = (
  columnStructure: any,
  editDetails: any,
  setEditMode: any,
  dispatch: any,
  toast: any
) => {
  try {
    Object.keys(editDetails).forEach((rowId) => {
      Object.keys(editDetails[rowId]).forEach((columnId) => {
        const validations = columnStructure?.[columnId]?.validation;
        const value = editDetails[rowId][columnId].value;

        if (validations?.required && !value) {
          throw {
            rowId,
            columnId,
            message:
              validations?.required?.message ||
              `${columnStructure[columnId].label} is required.`,
          };
        }

        if (
          validations?.minlength &&
          String(value).length < Number(validations?.minlength?.args)
        ) {
          throw {
            rowId,
            columnId,
            message:
              validations?.minlength?.message ||
              `${columnStructure[columnId].label} length must be more than ${validations?.minlength?.args} character(s).`,
          };
        }

        if (
          validations?.maxlength &&
          String(value).length > Number(validations?.maxlength?.args)
        ) {
          throw {
            rowId,
            columnId,
            message:
              validations?.maxlength?.message ||
              `${columnStructure[columnId].label} length cannot be more than ${validations?.maxlength?.args} character(s).`,
          };
        }
      });
    });
  } catch (error) {
    console.log("Inline Edit Validation Failed.", error?.message);
    setEditMode(true);
    dispatch({
      type: "@@daListView/SET_EDIT_DETAILS",
      payload: {
        rowId: error.rowId,
        columnId: error.columnId,
        value: error.value,
        hasError: true,
      },
    });

    if (error.message) {
      toast.add(error.message, "", false);
    }
    return false;
  }

  return true;
};

// const handleRouteNameClick = (row: ITripsListMileRowData) => {
//     hybridRouteTo(
//         `planning/result?id=${row.routePlanningId}`,
//     );
// }

// const handleTripNameClick = (row: ITripsListMileRowData) => {
//     const queryParams = getQueryParams();
//     const viewMode = queryParams?.page || 'allTrips';
//     hybridRouteTo(
//         `tripHst/tripDetails?tab=${viewMode}&tripId=${row.tripId}&tripName=${row.tripName}&bc_key=${viewMode}`,
//     );
// }

const handlelastTrackingClick = (row: ITripsListMileRowData) => {
  const queryParams = getQueryParams();
  const viewMode = queryParams?.page || "allTrips";
  hybridRouteTo(
    `trip/locationHistory?tab=${viewMode}&tripId=${row.tripId}&trackingDt=${row.lastTrackingDate}&tripName=${row.tripName}&startDt=${row.estimatedStartDate}&bc_key=${viewMode}`
  );
};

const handleRouteNameClick = (toast: any, dynamicLabels: any) => {
  return function (row: ITripsListMileRowData) {
    if (row.original.milkRun == "DEFAULT") {
      toast.add(dynamicLabels.historyNotAvailable);
    } else {
      hybridRouteTo(`planning/result?id=${row.original.routePlanningId}`);
    }
  };
};

export const cellCallbackMapping = {
  lastTrackingDate: handlelastTrackingClick,
  milkRun: handleRouteNameClick,
};
