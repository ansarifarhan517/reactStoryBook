import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  BreadCrumb,
  Card,
  Grid,
  IconButton,
  SectionHeader,
  useToast,
  TextInput,
} from "ui-library";
import FormLoader from "../../../utils/components/FormLoader";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import FormField from "../../../utils/components/Form/FormField";
import { useForm } from "react-hook-form";
import { CheckpointsFormActions } from "./CheckpointsForm.actions";
import { useDispatch } from "react-redux";
import {
  AddFormButtonContainer,
  CheckPointFormContainer,
  FormContainer,
  SectionHeaderContainer,
} from "./CheckpointsFormStyledComponent";
import { getQueryParams, hybridRouteTo } from "../../../utils/hybridRouting";
import { tGlobalToastActions } from "../../common/GlobalToasts/globalToast.reducer";
import { withReactOptimized } from "../../../utils/components/withReact";
import CircleMap from "../../../utils/components/Map/CircleMap";
import { ICircle, IPolygon } from "../../../utils/components/Map/interface";
import { CheckpointsListViewActions } from "../CheckpointsListView/CheckpointsListView.actions";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { deepCopy } from "../../../utils/helper";
import L, { Map } from "leaflet";
import SelectMapType from "../SubComponents/SelectMapType";
import { FeatureGroup } from "react-leaflet";
import AlertSettingsModal from "./SubComponents/AlertSettingsModal";
import { debounce } from "lodash";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { handleExtractCircleCoords } from "../../../utils/components/Map/MapHelper";
import moment from "moment";
import { alertSettings } from "./SubComponents/AlertSettingsData";
import { ICircleEditData, IMapState, IPolygonEditData, IPolygonPayload, MapShapes, TSelectedDrawType, IGeocodingError} from "./CheckpointsForm.models";

const CheckpointsForm = ({}) => {
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });
  const { handleSubmit, setValue, watch, reset } = formInstance;
  const dispatch = useDispatch<Dispatch<CheckpointsFormActions>>();
  const listDispatch = useDispatch<Dispatch<CheckpointsListViewActions>>();
  const toast = useToast();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const dynamicLabels = useDynamicLabels(
    `${DYNAMIC_LABELS_MAPPING.checkpoints}`
  );
  const checkpointCategory = watch("checkpointCategory");
  const {
    structure,
    loading,
    toggleState,
    alertsData,
    fetchFormStructureSuccessFlag,
    updatedToggleState,
    checkpointData,
    categoryList,
    fleetTypeList,
    vehicleTypeList,
    hubList,
    fetchDropdownSuccessFlag
  } = useTypedSelector((state) => state.checkpoints.form);
  const isCheckpointEditable = useTypedSelector(
    (state) => state.checkpoints.listView.isCheckpointEditable
  );

  const FALLBACK_CENTER = [37.09024, -95.71289100000001];
  const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
  const _center = userAccessInfo?.['countryLatLng']?.split(",").map((x:string)=>parseFloat(x)) || FALLBACK_CENTER;

  const initialCircleMapState: ICircle = {
    permission: false,
    popupRef: "checkpointsCircle",
    toolTipKey: "checkpointName",
    radiusKey: "radiusInKms",
    center: ["latitude", "longitude"],
    createPermission: false,
    editLayer: { permission: false, data: [], newCoordinateKey: "coordinate" },
    data: [],
    onEdit: {},
  };

  const initialPolygonMapState: IPolygon = {
    permission: false,
    popupRef: "checkpointsPolygon",
    toolTipKey: "checkpointName",
    colorKey: "color",
    positionCoordinateKey: "polygonCoordinates",
    styleKey: {
      smoothFactor: "smoothFactor",
      fillColor: "fillColor",
      fillOpacity: "fillOpacity",
    },
    createPermission: false,
    editLayer: {
      permission: false,
      data: [],
      newCoordinateKey: "coordinate",
      orinalCoordinatesKey: "polygonCoordinates",
    },
    data: [],
  };

  // Local States
  const [mapData, setMapData] = useState<IMapState>({
    circle: initialCircleMapState,
    polygon: initialPolygonMapState,
  });
  const [selectedShape, setSelectedShape] = useState<TSelectedDrawType>("");
  const [mapProps, setMapProps] = useState<Map>({} as Map);
  const [featureGroupProps, setFeatureGroupProps] = useState<FeatureGroup>(
    {} as FeatureGroup
  );
  const initialCircleEditData: ICircleEditData = {
    position: [_center[0], _center[1]],
    radius: 0,
  };
  const [circleEditData, setCircleEditData] = useState<ICircleEditData>(
    initialCircleEditData
  );
  const [drawActive, setDrawActive] = useState<boolean>(true);
  const [locationSearched, setLocationSearched] = useState<string>("");
  const [polygonEditData, setPolygonEditData] = useState<IPolygonEditData | null>(null);
  const [errorGeocoding, setErrorGeocoding] = useState<IGeocodingError>({lat: false, lng: false});
  const [isAlertSettingsModal, setIsAlertSettingsModal] = useState(false);
  const [isNoDriveZone, setIsNoDriveZone] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  const { Id: checkPointId } = getQueryParams();

  useEffect(() => {
    if (checkPointId) {
      dispatch({
        type: "@@checkpointsForm/FETCH_CHECKPOINT_BY_ID",
        payload: checkPointId,
      });
      listDispatch({
        type: "@@checkpointsListView/SET_FORM_EDITABLE",
        payload: true,
      });
    }
  }, [checkPointId]);

  const showHide = (newStructure) => {
    if (checkpointCategory?.clientRefMasterCd == "No Drive Zone") {
      newStructure["checkpoint details"].vehicleType.permission = true;
      newStructure["checkpoint details"].fleetType.permission = true;
      if (
        newStructure["checkpoint details"]["checkpointNameSelect"].permission
      ) {
        newStructure["checkpoint details"]["checkpointName"].permission = true;
        newStructure["checkpoint details"]["checkpointNameSelect"].permission =
          false;
      }

      setIsNoDriveZone(true);
      dispatch({
        type: "@@checkpointsForm/SET_FORM_STRUCTURE",
        payload: newStructure,
      });
    } else if (checkpointCategory?.clientRefMasterCd == "Hub") {
      if (newStructure["checkpoint details"]["checkpointName"].permission) {
        newStructure["checkpoint details"]["checkpointName"].permission = false;
        newStructure["checkpoint details"]["checkpointNameSelect"].permission =
          true;
      }

      if (
        newStructure["checkpoint details"].vehicleType?.permission &&
        newStructure["checkpoint details"].fleetType?.permission
      ) {
        newStructure["checkpoint details"].vehicleType.permission = false;
        newStructure["checkpoint details"].fleetType.permission = false;
      }
      dispatch({
        type: "@@checkpointsForm/SET_FORM_STRUCTURE",
        payload: newStructure,
      });
    } else {
      newStructure["checkpoint details"].vehicleType.permission = false;
      newStructure["checkpoint details"].fleetType.permission = false;
      if (
        newStructure["checkpoint details"]["checkpointNameSelect"].permission
      ) {
        newStructure["checkpoint details"]["checkpointName"].permission = true;
        newStructure["checkpoint details"]["checkpointNameSelect"].permission =
          false;
      }
      dispatch({
        type: "@@checkpointsForm/SET_FORM_STRUCTURE",
        payload: newStructure,
      });
      setIsNoDriveZone(false);
    }
  };
  const breadCrumbOptions = useMemo(
    () => [
      {
        id: "routes",
        label: dynamicLabels.route_p ? dynamicLabels.route_p : "Routes",
      },
      {
        id: "checkpointsListView",
        label: dynamicLabels.allCheckpoints ? dynamicLabels.allCheckpoints : "All Checkpoints",
        disabled: false,
      },
      {
        id: "checkpointsForm",
        label: isCheckpointEditable
          ? (dynamicLabels.updateCheckpoint ? dynamicLabels.updateCheckpoint : "Update Checkpoint")
          : (dynamicLabels.addCheckpoint ? dynamicLabels.addCheckpoint : "Add Checkpoint"),
      },
    ],
    [dynamicLabels]
  );

  useEffect(() => {
    dispatch({ type: "@@checkpointsForm/FETCH_FORM_STRUCTURE" });
    dispatch({ type: "@@checkpointsForm/FETCH_ALERT_FORM_STRUCTURE" });
    dispatch({ type: "@@checkpointsForm/FETCH_DROPDOWN_OPTIONS" });
    setValue("checkpointStatusFl", "Y");
    return () => {
      dispatch({ type: "@@checkpointsForm/RESET_STATE" });
    };
  }, []);

  useEffect(() => {
    Object.keys(structure).length && showHide(structure);
  }, [fetchFormStructureSuccessFlag]);

  const generateDataToFill = (
    data
  ) => {
    const { checkpointName, checkpointCode } = data;
    const category = categoryList?.find(
      (category) =>
        category.clientRefMasterCd == checkpointData?.checkpointCategory
    );

    const fleetTypesIDs = checkpointData?.alertParams
      ? checkpointData?.alertParams.map((item) => item.fleetTypeIds)
      : [];

    const fleetTypesIdList = fleetTypesIDs?.map((item) => item);

    const fleetTypes = fleetTypesIdList[0]?.map((id) =>
      fleetTypeList?.find((fleet) => fleet?.id == id)
    )?.map((selectedFleet)=> {return {...selectedFleet , name: selectedFleet?.type, label: selectedFleet?.type}});

    const vehicleTypesIDs =  checkpointData?.alertParams ? checkpointData?.alertParams.map((item)=>item?.vehicleTypes) : []
    const vehicleTypes = vehicleTypesIDs?.length > 0 ? Object.keys(vehicleTypesIDs[0])?.map((id)=> vehicleTypeList?.find((vehicle)=>vehicle?.id == id)).map((selectedVehicle) => {return {...selectedVehicle, id: selectedVehicle?.name}}) : []

    const hub = hubList?.find(
      (hub) => hub.name == checkpointData?.checkpointName
    );

    let _dataToBeFilled = {
      checkpointCode: checkpointCode,
      checkpointStatusFl: checkpointData?.isActiveFl === true ? "Y" : "N",
      checkpointCategory: category,
      fleetType: fleetTypes,
      vehicleType: vehicleTypes,
      checkpointName:
        category?.clientRefMasterCd == "Hub" ? "" : checkpointName,
      checkpointNameSelect: category?.clientRefMasterCd == "Hub" ? hub : {},
    };
    return _dataToBeFilled;
  };

  // Function to Convert to Backend timings to Form Field
  const prepareShiftTimingsToFill = (timeSlotsArray) => {
    return timeSlotsArray?.map((eachSlab, index: number) => {
      return {
        id: index.toString(),
        fromValue: moment.utc(eachSlab?.startTime, "HH:mm:ss").toDate(),
        toValue: moment.utc(eachSlab?.endTime, "HH:mm:ss").toDate(),
      };
    });
  };

  const fillShiftTimings = (preferenceArray) => {
    preferenceArray?.forEach((preference, index) => {
      dispatch({
        type: "@@checkpointsForm/SET_SHIFT_TIMINGS",
        key: `pref${index}`,
        payload: prepareShiftTimingsToFill(preference?.timeSlots),
      });
    });
  };

 
  useEffect(() => {
    const settingDataToForm = async () => {
      if (isCheckpointEditable && Object.keys(checkpointData)?.length) {
       

        setSelectedShape(checkpointData.shapeType);
        const _dataToFill = {
          ...generateDataToFill(
            checkpointData
          ),
        };
        reset({ ..._dataToFill });
        // Dispatching action to change the shift Timings.
        fillShiftTimings(checkpointData?.alertParams);
        const [hrs, mins] = checkpointData?.maxHaltTimeInHrsMins ? checkpointData?.maxHaltTimeInHrsMins.split(":") : ["",""];
        dispatch({
          type: "@@checkpointsForm/SET_ALERTS_DATA",
          payload: {alertsPayloadData: checkpointData?.alertParams, hrs: hrs, mins: mins},
        });

        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "checkpointEntry",
            value: checkpointData?.checkpointEntryAlertFl == "Y" ? true : false,
          },
        });
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "checkpointExit",
            value: checkpointData?.checkpointExitAlertFl == "Y" ? true : false,
          },
        });
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "maximumHaltTime",
            value: checkpointData?.haltTimeAlertFl == "Y" ? true : false,
          },
        });
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "fleetMovementStopped",
            value:
              checkpointData?.fleetMovementStoppedAlertFl == "Y" ? true : false,
          },
        });
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "fleetMovementResumed",
            value:
              checkpointData?.fleetMovementResumedAlertFl == "Y" ? true : false,
          },
        });
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: {
            key: "restrictedTime",
            value: checkpointData?.restrictedTimeAlertFl == "Y" ? true : false,
          },
        });
        // handleAlertCount(toggleState)
        if (checkpointCategory?.clientRefMasterCd == "No Drive Zone") {
          setAlertCount(0);
        } else {
          setAlertCount(0);
          alertSettings.forEach((item) => {
            if (checkpointData[item.toggleFlag] == "Y") {
              setAlertCount((count) => count + 1);
            }
          });
        }
      } else {
        setSelectedShape(MapShapes.POLYGON);
      }
      dispatch({type:'@@checkpointsForm/UPDATE_TOOGLE_STATE', payload:toggleState})
    };
    settingDataToForm();
  }, [isCheckpointEditable, checkpointData ,fetchDropdownSuccessFlag]);

  useEffect(() => {
    const newStructure = deepCopy(structure);
    if (checkpointCategory?.clientRefMasterCd == "No Drive Zone") {
      setAlertCount(0);
    } else {
      setAlertCount(0);
      alertSettings.forEach((item) => {
        if (updatedToggleState[item.toggleLabelKey]) {
          setAlertCount((count) => count + 1);
        }
      });
    }
    Object.keys(newStructure).length && showHide(newStructure);
  }, [checkpointCategory?.clientRefMasterCd]);

  const handleSetDrawActive = () => {
    !drawActive && setDrawActive(true);
  };

  const handleSetDrawInActive = () => {
    setDrawActive(false);
  };

  const handleEnableDraw = () => {
    const mapContainer: HTMLElement = mapProps?.getContainer();
    //check if draw control is active
    let createShapeButton: HTMLElement | null = null,
      isDrawActive: boolean = false;
    if (selectedShape === MapShapes.CIRCLE) {
      createShapeButton = mapContainer.querySelector(
        ".leaflet-draw-draw-circle"
      ) as HTMLElement;
      isDrawActive = createShapeButton?.classList?.contains("draw-active");
    } else if (selectedShape === MapShapes.POLYGON) {
      createShapeButton = mapContainer.querySelector(
        ".leaflet-draw-draw-polygon"
      ) as HTMLElement;
      isDrawActive = createShapeButton?.classList?.contains("draw-active");
    }
    //enable draw
    if (!isDrawActive) {
      createShapeButton?.click();
      handleSetDrawActive();
    }
  };

  const handleRemoveLayers = () => {
    const layers = featureGroupProps?.leafletElement?.getLayers();
    if (Object.keys(layers).length > 0) {
      featureGroupProps?.leafletElement?.clearLayers();
    }
  };

  const handleDrawStopEvent = () => {
    if (mapProps && Object.keys(mapProps).length > 0) {
      mapProps.on("draw:drawstop", handleSetDrawInActive);
    }
  };

  useEffect(() => {
    return () => {
      if (mapProps && Object.keys(mapProps).length > 0) {
        mapProps.off("draw:drawstop", handleSetDrawInActive);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedShape === MapShapes.CIRCLE) {
      let coordinates;
      if (isCheckpointEditable && selectedShape === checkpointData?.shapeType) {
        coordinates = handleExtractCircleCoords(
          checkpointData?.checkpointCoordinates
        );
        const circleEditData: ICircleEditData = {
          position: [
            coordinates?.latitude as number,
            coordinates?.longitude as number,
          ],
          radius: checkpointData?.radiusInKms * 1000,
        };
        setCircleEditData({ ...circleEditData });
      }
      const newMapData = {
        polygon: initialPolygonMapState,
        circle: {
          ...mapData.circle,
          permission: true,
          createPermission: true,
          editLayer: {
            permission: true,
            data:
              isCheckpointEditable && selectedShape === checkpointData?.shapeType
                ? [
                    {
                      centerCords: checkpointData?.checkpointCoordinates,
                      shapeTypeCode: checkpointData?.shapeType,
                      radiusInKms: checkpointData?.radiusInKms,
                      latitude: coordinates?.latitude as number,
                      longitude: coordinates?.longitude as number,
                    },
                  ]
                : [],
            newCoordinateKey: "coordinate",
          },
        },
      };
      setPolygonEditData(null);
      setMapData(newMapData);
    } else if (selectedShape === MapShapes.POLYGON) {
      if (isCheckpointEditable && selectedShape === checkpointData?.shapeType) {
    
        const polygonEditData: IPolygonEditData = {
         coordinates : checkpointData?.polygonCoordinates,
          area: checkpointData?.radiusInKms * 1000000,
        };
        setPolygonEditData({ ...polygonEditData });
      }
      const newMapData = {
        circle: initialCircleMapState,
        polygon: {
          ...mapData.polygon,
          permission: true,
          createPermission: true,
          editLayer: {
            permission: true,
            data:
              isCheckpointEditable && selectedShape === checkpointData?.shapeType
                ? [
                    {
                      shapeTypeCode: checkpointData?.shapeType,
                      radiusInKms: checkpointData?.radiusInKms,
                      polygonCoordinates:
                        checkpointData?.polygonCoordinates,
                    },
                  ]
                : [],
            newCoordinateKey: "coordinate",
            orinalCoordinatesKey: "polygonCoordinates",
          },
        },
      };
      setCircleEditData(initialCircleEditData);
      setMapData(newMapData);
    }
  }, [selectedShape, checkpointData]);

  useEffect(() => {
    if (Object.keys(mapProps)?.length > 0 && selectedShape?.length > 0) {
      if (!isCheckpointEditable) {
        handleEnableDraw();
      } else {
        isCheckpointEditable && selectedShape === checkpointData?.shapeType
          ? handleSetDrawInActive()
          : handleEnableDraw();
      }
      handleDrawStopEvent();
    }
  }, [selectedShape, mapProps]);

  useEffect(() => {
    if (
      Object.keys(featureGroupProps)?.length > 0 &&
      Object.keys(mapProps)?.length > 0 &&
      locationSearched &&
      locationSearched?.length > 0
    ) {
      handleRemoveLayers();
      handleEnableDraw();
    }
  }, [locationSearched]);

  const resetForm = () => {
    hybridRouteTo("checkpoints");
    listDispatch({
      type: "@@checkpointsListView/SET_FORM_EDITABLE",
      payload: false,
    });
  };

  const onCancel = () => {
    if (!formInstance.formState.isDirty) {
      resetForm();
    } else {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: dynamicLabels.navigationConfirmation,
          content: dynamicLabels.dataLostWarningMsg,
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={() => {
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
                  resetForm();
                }}
              >
                {dynamicLabels.ok}
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
    }
  };

  const saveCheckpoint = async (data) => {
    if (errorGeocoding.lat || errorGeocoding.lng) { toast.add("Invalid Latitude/Longitude", "warning", false); return; }
    let circlePayload = {}, polygonPayload = {};
    circlePayload = {
      shapeType: "CIRCLE",
      radiusInKms: circleEditData?.radius * 0.001, //Convert m to km
      checkpointCoordinates: `POINT(${circleEditData?.position[0]} ${circleEditData?.position[1]})`,
    };
    polygonPayload = {
      shapeType: "POLYGON",
      radiusInKms: (polygonEditData?.area as number) / 1000000, //Convert Sq.m to Sq.km
      polygonCoordinates: polygonEditData?.coordinates,
    };
    let payload = {
      checkpointId: Number(checkPointId),
      checkpointName:
        data?.checkpointCategory?.name == "Hub"
          ? data?.checkpointNameSelect.name
          : (data?.checkpointName).trim(),
      checkpointCode: (data?.checkpointCode).trim(),
      checkpointCategory: data?.checkpointCategory?.name,
      noDriveZoneAlertFl:
        data?.checkpointCategory?.name == "No Drive Zone" ? "Y" : "N",
      checkpointEntryAlertFl: toggleState?.checkpointEntry ? "Y" : "N",
      checkpointExitAlertFl: toggleState?.checkpointExit ? "Y" : "N",
      haltTimeAlertFl: toggleState?.maximumHaltTime ? "Y" : "N",
      maxHaltTimeInHrsMins: toggleState?.maximumHaltTime
        ? `${alertsData?.hrs}:${alertsData?.mins}`
        : "",
      fleetMovementStoppedAlertFl: toggleState?.fleetMovementStopped
        ? "Y"
        : "N",
      fleetMovementResumedAlertFl: toggleState?.fleetMovementResumed
        ? "Y"
        : "N",
      restrictedTimeAlertFl: toggleState?.restrictedTime ? "Y" : "N",
      isActiveFl: data?.checkpointStatusFl == "Y" ? true : false,
      alertParams:
        data?.checkpointCategory?.name == "No Drive Zone"
          ? [
              {
                vehicleTypes: data?.vehicleType
                  ? data?.vehicleType.reduce(
                      (acc, selectedVehicle) => {
                        return {
                          ...acc,
                          [selectedVehicle?.clientRefMasterId]:
                            selectedVehicle?.name,
                        };
                      },
                      {}
                    )
                  : {},
                fleetTypeIds: data?.fleetType
                  ? data?.fleetType.map((obj) => obj?.id)
                  : [],
                fleetGroupSequence: 1,
              },
            ]
          : alertsData?.alertsPayloadData,
    };
    payload =
      selectedShape == "CIRCLE"
        ? { ...circlePayload, ...payload }
        : { ...polygonPayload, ...payload };
    try {
      if((circleEditData?.radius <= 0 && !polygonEditData )){ 
        toast.add(dynamicLabels.drawCheckpointWarning ? dynamicLabels.drawCheckpointWarning : "Please draw the checkpoint in the map", "warning", false);
      } else {
        const { data: response } = isCheckpointEditable
          ? await axios.put(
              apiMappings.checkpoints.form.updateCheckpoint,
              payload
            )
          : await axios.post(
              apiMappings.checkpoints.form.createCheckpoint,
              payload
            );
        if (!response.hasError) {
          toastDispatch({
            type: "@@globalToast/add",
            payload: {
              message: response.message,
              icon: "check-round",
            },
          });
          hybridRouteTo("checkpoints");
        }
      }
    } catch (error: any) {
      toast.add(error.response.data.message, "warning", false);
    }
  };

  const debouncedMapEdit = debounce((position, radius) => {
    setCircleEditData({ position: position, radius: radius });
  }, 300);

  const handleMapEdit = useCallback(
    (data) => {
      if (selectedShape === MapShapes.CIRCLE) {
        const { center, originalCenter, radius, originalRadius } = data;
        const finalCenter: [number, number] =  center && center.length > 0 ? center : originalCenter && originalCenter.length > 0 ? originalCenter: center;
        const finalRadius = radius ? radius : originalRadius;
        debouncedMapEdit(finalCenter, finalRadius);
      } else {
        if (data?.originalCoordinates.length > 2) {
          const polygonCoordinates = data?.originalCoordinates.map((obj) =>
            Array.isArray(obj)
              ? {
                  latitude: obj[0],
                  longitude: obj[1],
                }
              : {
                  latitude: obj["lat"],
                  longitude: obj["lng"],
                }
          );
          polygonCoordinates.push({
            latitude: Array.isArray(data?.originalCoordinates[0])
              ? data?.originalCoordinates[0][0]
              : data?.originalCoordinates[0].lat,
            longitude: Array.isArray(data?.originalCoordinates[0])
              ? data?.originalCoordinates[0][1]
              : data?.originalCoordinates[0].lng,
          });
          if (!isNaN(data?.area)) {
            setPolygonEditData({
              coordinates: polygonCoordinates as Array<IPolygonPayload>,
              area: data?.area,
            });
          }
        }
      }
    },
    [selectedShape]
  );

  const handleDeleteShape = () => {
    if (
      Object.keys(featureGroupProps)?.length > 0 &&
      Object.keys(mapProps)?.length > 0
    ) {
      handleRemoveLayers();
      if (selectedShape === MapShapes.CIRCLE) {
        setCircleEditData({ ...circleEditData, radius: 0 });
      } else {
        setPolygonEditData(null);
      }
    }
  };

  const handleAlertSetting = () => {
    if (checkpointCategory?.name == "No Drive Zone") {
      setIsAlertSettingsModal(false);
    } else {
      setIsAlertSettingsModal(true);
      dispatch({
        type: "@@checkpointsForm/SET_OPEN_ALERT_SETTINGS",
        payload: true,
      });
    }
  };

  const handleAlertCount = (toggleState) => {
    setAlertCount(0);
    for (let key in toggleState) {
      if (toggleState[key]) {
        setAlertCount((count) => count + 1);
      }
    }
  };

  return (
    <>
      <div id="toast-inject-here"></div>
      <CheckPointFormContainer
        display="flex"
        flexDirection="column"
        px="15px"
        pb="15px"
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          className="form-header"
        >
          <BreadCrumb
            options={breadCrumbOptions}
            onClick={() => {
              hybridRouteTo("checkpoints");
            }}
          />
        </Box>
        {/* <FormMapWrapper > */}
        {loading ? (
          <FormLoader />
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            className="box-container"
          >
            <Card className="card-container">
              {loading ? (
                <FormLoader />
              ) : (
                <div>
                  {Object.keys(structure).length > 0 &&
                    Object.keys(structure).map((sectionName) => (
                      <FormContainer key={sectionName}>
                        <SectionHeaderContainer>
                          <SectionHeader
                            headerTitle={dynamicLabels.checkpointDetails ? dynamicLabels.checkpointDetails : "Checkpoint Details"}
                          />
                        </SectionHeaderContainer>
                        <Grid
                          container
                          spacing="10px"
                          className="bottom-spacing"
                        >
                          {Object.keys(structure[sectionName]).map(
                            (fieldName) => {
                              const meta = structure[sectionName][fieldName];
                              if (
                                isCheckpointEditable &&
                                fieldName === "checkpointCode"
                              ) {
                                meta.editable = false;
                              }
                              if (meta.id === "checkpointCategory") {
                                return (
                                  <Grid
                                    item
                                    key={fieldName}
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    className="category-item"
                                  >
                                    <FormField
                                      name={fieldName}
                                      meta={meta}
                                      formInstance={formInstance}
                                    />
                                  </Grid>
                                );
                              }
                              if (meta.id === "alertSettings") {
                                return (
                                  <Grid
                                    item
                                    key={fieldName}
                                    xs={6}
                                    sm={6}
                                    md={12}
                                    className="alertSetting-item"
                                  >
                                    <TextInput
                                      value={alertCount}
                                      size={200}
                                      id="alertSettings"
                                      variant="withIcon"
                                      iconVariant="add"
                                      iconSize="xs"
                                      color="primary.main"
                                      border={true}
                                      placeholder="Alert Settings"
                                      label={meta.label}
                                      onIconClick={handleAlertSetting}
                                      disabled={
                                        checkpointCategory?.clientRefMasterCd ==
                                        "No Drive Zone"
                                          ? true
                                          : false
                                      }
                                    />
                                  </Grid>
                                );
                              }
                              return (
                                meta.permission && (
                                  <Grid
                                    item
                                    key={fieldName}
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    className="grid-item"
                                  >
                                    <FormField
                                      name={fieldName}
                                      meta={meta}
                                      formInstance={formInstance}
                                    />
                                  </Grid>
                                )
                              );
                            }
                          )}
                        </Grid>
                      </FormContainer>
                    ))}
                  <Grid container spacing="15px">
                    <AddFormButtonContainer item xs={6} sm={6} md={6}>
                      <IconButton
                        primary
                        iconVariant="icomoon-save"
                        onClick={handleSubmit((data) => saveCheckpoint(data))}
                        id="checkpointsForm--actionBar--save"
                      >
                        {isCheckpointEditable
                        ? (dynamicLabels.update ? dynamicLabels.update : "Update")
                        : dynamicLabels.save ? dynamicLabels.save : "Save"}
                      </IconButton>
                      <IconButton
                        iconVariant="cancel-button"
                        onClick={onCancel}
                        id="checkpointsForm--actionBar--cancel"
                      >
                        {dynamicLabels.cancel ? dynamicLabels.cancel : "Cancel"}
                      </IconButton>
                    </AddFormButtonContainer>
                  </Grid>
                </div>
              )}
            </Card>

            <Card className="circle-map-card">
              <CircleMap
                type="checkpoints"
                settingAPIParam="checkpointMasterList"
                key={selectedShape}
                center={_center}
                circleData={mapData.circle}
                polygonData={mapData.polygon}
                geocoding={selectedShape === MapShapes.POLYGON ? false : true}
                handleMapEdit={handleMapEdit}
                position={circleEditData.position}
                radius={circleEditData.radius}
                setMapProps={setMapProps}
                setLocationSearched={setLocationSearched}
                setFeatureGroupProps={setFeatureGroupProps}
                allowCustomControl={true}
                setErrorGeocoding={setErrorGeocoding}
                customControlProps={{
                  position: "bottomright" as L.ControlPosition,
                  prepend: true,
                  children: (
                    <SelectMapType
                      selectedShape={selectedShape}
                      setSelectedShape={setSelectedShape}
                      drawActive={drawActive}
                      enableDraw={handleEnableDraw}
                      deleteShape={handleDeleteShape}
                    />
                  ),
                }}
              />
            </Card>
          </Box>
        )}
      </CheckPointFormContainer>

      <AlertSettingsModal
        isAlertSettingsModal={isAlertSettingsModal}
        setIsAlertSettingsModal={setIsAlertSettingsModal}
        isCheckpointEditable={isCheckpointEditable}
        handleAlertCount={handleAlertCount}
        toggleState={toggleState}
        dynamicLabels={dynamicLabels}
      />
    </>
  );
};
export default withReactOptimized(CheckpointsForm);
