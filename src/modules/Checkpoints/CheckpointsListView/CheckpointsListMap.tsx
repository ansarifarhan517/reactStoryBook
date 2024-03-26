import React, { useState, useEffect, Dispatch } from 'react'
import { IconButton } from "ui-library";
import CircleMap from "../../../utils/components/Map/CircleMap";
import { ICircle, IPolygon } from "../../../utils/components/Map/interface";
import { Map } from "leaflet";
import { getCircleBounds, handleExtractCircleCoords, handleExtractPolygonCoords } from "../../../utils/components/Map/MapHelper";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { PromptStyle } from './CheckpointsListViewStyledComponent';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { IMapState, MapShapes } from '../CheckpointsForm/CheckpointsForm.models';
import { ICheckpointsListMap } from './CheckpointsListView.models';

const CheckpointsListMap = ({ lastSelectedRow, deleteCheckpoint }: ICheckpointsListMap) => {

  const FALLBACK_CENTER = [37.09024, -95.71289100000001];
  const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
  const _center = userAccessInfo?.['countryLatLng']?.split(",").map((x: string) => parseFloat(x)) || FALLBACK_CENTER;
  const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.checkpoints}`);


  const initialCircleMapState: ICircle = {
    permission: true,
    popupRef: "checkpointsCircle",
    toolTipKey: "checkpointName",
    radiusKey: "radiusInKms",
    center: [
      "latitude",
      "longitude"
    ],
    data: [],
  }
  const initialPolygonMapState: IPolygon = {
    permission: true,
    popupRef: 'checkpointsPolygon',
    toolTipKey: 'checkpointName',
    colorKey: 'color',
    positionCoordinateKey: 'polygonCoordinates',
    styleKey: {
      smoothFactor: 'smoothFactor',
      fillColor: 'fillColor',
      fillOpacity: 'fillOpacity'
    },
    data: [],
  }

  const [mapProps, setMapProps] = useState<Map>({} as Map);
  const [mapData, setMapData] = useState<IMapState>({ circle: initialCircleMapState, polygon: initialPolygonMapState });
  const [showEditConfirmation, setShowEditConfirmation] = useState<boolean>(false);
  const [checkpointId, setCheckpointId] = useState<number>(0);
  const { data } = useTypedSelector((state) => state.checkpoints.listView);
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  const handleCreateMapData = (data: any) => {
    let createCircleMapData: any = [], createPolygonMapData: any = [];
    data.forEach(d => {
      if (d?.shapeType?.toUpperCase() === MapShapes.CIRCLE) {
        const coordinates = handleExtractCircleCoords(d?.checkpointCoordinates);
        const circle = {
          checkpointStatus: d?.isActiveFl.toString(),
          checkpointCode: d?.checkpointCode,
          checkpointName: d?.checkpointName,
          checkpointCategory: d?.checkpointCategory,
          checkpointId: d?.checkpointId,
          centerCords: d?.checkpointCoordinates,
          shapeTypeCode: MapShapes.CIRCLE,
          radiusInKms: d?.radiusInKms,
          latitude: coordinates?.latitude,
          longitude: coordinates?.longitude,
        }
        createCircleMapData.push(circle);
      } else if (d?.shapeType.toUpperCase() === MapShapes.POLYGON) {
        const coordinates = handleExtractPolygonCoords(d?.checkpointCoordinates);
        const polygon = {
          checkpointStatus: d?.isActiveFl.toString(),
          checkpointCode: d?.checkpointCode,
          checkpointName: d.checkpointName,
          checkpointCategory: d?.checkpointCategory,
          checkpointId: d?.checkpointId,
          shapeTypeCode: MapShapes.POLYGON,
          radiusInKms: d?.radiusInKms,
          polygonCoordinates: coordinates,
        }
        createPolygonMapData.push(polygon);
      }
    });
    const sortCircleDescByRadius = createCircleMapData.sort((a, b) =>  b.radiusInKms - a.radiusInKms);
    const sortPolygonDescByRadius = createPolygonMapData.sort((a, b) =>  b.radiusInKms - a.radiusInKms);
    setMapData({ polygon: { ...mapData.polygon, data: [...sortPolygonDescByRadius] }, circle: { ...mapData.circle, data: [...sortCircleDescByRadius] } });
  }

  const handleSetView = (selectedRow: any) => {
    const { shapeType, checkpointCoordinates, radiusInKms } = selectedRow;
    if (shapeType.toUpperCase() === MapShapes.POLYGON) {
      const coordinates = handleExtractPolygonCoords(checkpointCoordinates);
      const bounds: any = coordinates.map(obj => Object.values(obj));
      mapProps?.fitBounds(bounds);
    } else if (shapeType.toUpperCase() === MapShapes.CIRCLE) {
      const radiusInMtrs = radiusInKms * 1000;
      const coordinates = handleExtractCircleCoords(checkpointCoordinates);
      const bounds = getCircleBounds(radiusInMtrs, coordinates?.latitude as number, coordinates?.longitude as number);
      mapProps?.fitBounds(bounds);
    }
  }

  const redirectToEdit = (checkpointId: number) => { hybridRouteTo(`updateCheckpoint?Id=${checkpointId}`) }

  const handleEditCheckpoint = (checkpoint: any) => {
    setShowEditConfirmation(true);
    setCheckpointId(checkpoint?.checkpointId);
  }

  const handleDeleteCheckpoint = async (checkpoint: any) => {
    deleteCheckpoint(checkpoint?.checkpointId);
    // remove popup
    const mapContainer: HTMLElement = mapProps?.getContainer();
    const leafletPopPaneElement = mapContainer.querySelector(".leaflet-popup-pane") as HTMLElement;
    const leafletPopUpElement = mapContainer.querySelector(".leaflet-popup") as HTMLElement;
    if (leafletPopPaneElement && leafletPopUpElement) { leafletPopPaneElement.removeChild(leafletPopUpElement); }
  }

  useEffect(() => {
    if (data?.results && data?.results?.length > 0) {
      handleCreateMapData(data?.results)
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(mapProps).length > 0 && lastSelectedRow) {
      Object.values(lastSelectedRow).length > 0 ? handleSetView(lastSelectedRow) : mapProps?.setZoom(3, { animate: true });
    }
  }, [lastSelectedRow, mapProps]);

  useEffect(() => {
    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: showEditConfirmation,
        title: dynamicLabels.leavePage ? dynamicLabels.leavePage : "Leave Page",
        onClose: () => { setShowEditConfirmation(false) },
        content: (
          <PromptStyle>{dynamicLabels.checkpointEditor ? dynamicLabels.checkpointEditor : "Are you sure you want to leave this page and open the Checkpoint Editor?"}</PromptStyle>
        ),
        footer: (<>
          <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); redirectToEdit(checkpointId) }}>{dynamicLabels.confirm ? dynamicLabels.confirm : "Confirm"}</IconButton>
          <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => { globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' }); setShowEditConfirmation(false) }}>{dynamicLabels.cancel ? dynamicLabels.cancel : "Cancel"}</IconButton>
        </>
        )
      }
    })
  }, [showEditConfirmation])

  return (
    <>
      <CircleMap
        circleData={mapData.circle}
        polygonData={mapData.polygon}
        type="checkpoints"
        settingAPIParam="checkpointMasterList" 
        handleMapEdit= {() => {}}
        setMapProps={setMapProps}
        editCheckpoint={handleEditCheckpoint}
        deleteCheckpoint={handleDeleteCheckpoint}
        center={_center}
      />
    </>
  )
}

export default CheckpointsListMap