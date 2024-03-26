import LL from 'leaflet'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FeatureGroup, useLeaflet } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { IGeocodingContext, GeocodingContext } from '..'
import { getCircleBounds } from '../helperMethods'
import { ICircle, tGeocoding } from '../interfaces.d'
import { StyledPopUp } from '../StyledMap'

interface ILeafletCircleEditLayer {
  onChange: (changedObject: IChangedObject) => void
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent: any
  circle: ICircle
  setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
}
interface IChangedObject {
  center: any[]
  originalCenter: any[]
  isChanged: boolean
  radius: string | number
  originalRadius: string | number
}

const LeafletCircleEditLayer = ({
  // createShape,
  // setCreateShape,
  circle,
  editPopUpComponent,
  onChange,
  setFeatureGroupProps
}: ILeafletCircleEditLayer) => {
  const featureGroupRef: any = React.useRef()
  const layerRef: any = useRef({});
  const renderer: any = LL.canvas({ padding: 0.5 }) // adding renderer if data entries more than 200
  const radiusKey = circle?.radiusKey
  const styleKeys = circle?.styleKey // circle style
  const editLayer = circle?.editLayer
  const createPermission = circle?.createPermission || false
  const orinalCoordinatesKey = circle?.center
  const geocodingContext: IGeocodingContext = useContext(GeocodingContext);
  const { shouldUpdateShape, customFields, position} = geocodingContext?.geocoding as tGeocoding;
  const radius = customFields && customFields.length > 0 ? customFields.find(field => field.name === "radius")?.value : 0
  const [center, setCenter] = useState(position);
  const [cRadius, setCRadius] = useState(radius);

  const { map } = useLeaflet()

  useEffect(() => {
    renderPloyLayer()
  }, [])

  const handleFitBoundsPosition = (radius: number, lat:number, lng:number) => {
    if(map && Object.keys(map).length > 0 && layerRef.current.editing._map && Object.keys(layerRef.current.editing?._map)?.length > 0) {
        const circleBounds = layerRef.current.getBounds();
        const southWest = circleBounds.getSouthWest();
        const northEast = circleBounds.getNorthEast();
        const paddedBounds = LL.latLngBounds([southWest.lat, southWest.lng],[northEast.lat, northEast.lng]);
        const bounds = getCircleBounds(radius, lat, lng);
        const zoom = map.getBoundsZoom(bounds);
        map?.setView(paddedBounds.getCenter(), zoom, {animate: true });
      }
  }

  useEffect(() => {
    if(shouldUpdateShape && layerRef.current && Object.keys(layerRef.current)?.length > 0 && ((center?.[0] !== position?.[0]) || (center?.[1] !== position?.[1]))) {
      layerRef.current?.setLatLng(position);
      onChange({ center: position, originalCenter: center, isChanged: true, radius: '', originalRadius: radius});
      handleFitBoundsPosition(radius, position[0], position[1]);
      handleRelocateMarker(layerRef.current);
      setCenter(position);
    }
  },[position]);

  const handleFitBoundsRadius = (radius: number, lat:number, lng:number) => {
    if(map && Object.keys(map).length > 0) {
      const bounds = getCircleBounds(radius, lat, lng);
      map?.fitBounds(bounds, {padding: LL.point(100, 100)});
    }
  }

  const handleValidRadius = (radius: number) => {
    layerRef.current?.setRadius(radius);
    onChange({ center: [], originalCenter: position, isChanged: false, radius: radius, originalRadius: cRadius });
    handleFitBoundsRadius(radius, position[0], position[1]);
    handleRelocateMarker(layerRef.current);
    setCRadius(radius);
  }

  const handleInvalidRadius = (leafletElement: any) => {
    onChange({ center: [], originalCenter: position, isChanged: false, radius: 0, originalRadius: 0 });
    leafletElement.clearLayers(); 
    setCRadius(0);
  }

  useEffect(() => {
    if(!shouldUpdateShape || Object.keys(featureGroupRef?.current)?.length === 0) { return; }
    const { leafletElement }  = featureGroupRef?.current
    const layers = leafletElement.getLayers(); 
    if(Object.keys(layers)?.length > 0) {
      radius > 0 ? handleValidRadius(radius) : handleInvalidRadius(leafletElement);
    } else if(radius) {
      const circle: any = LL.circle(position as [number,number], {
          interactive: true,
          lineJoin: 'round',
          lineCap: 'round',
          fill: true,
          stroke: true,
          fillColor: '#5698d3',
          radius: parseFloat((radius).toFixed(2))
        });
      circle.originalCenter = position;
      circle.originalRadius = parseFloat((radius).toFixed(2));
      circle?.editing?.enable();
      leafletElement.addLayer(circle);
      layerRef.current = circle;
      onChange({ center: [], originalCenter: position, isChanged: false, radius: "", originalRadius: radius });
      handleFitBoundsRadius(radius, position[0], position[1]);
    }
  },[radius]);

  const handleRelocateMarker = (layer: any) => {
    if(layer && Object.keys(layer).length > 0) {   
      const { editing } = layer;
      if(editing?._map && Object.keys(editing?._map)?.length > 0) {
        editing?._markerGroup?.clearLayers();
        // Create center marker
		    editing._createMoveMarker();
        // Create edge marker
        editing._createResizeMarker();
      }
    }
  }

  const renderPloyLayer = () => {
    // populate the leaflet FeatureGroup with the geoJson layers

    if (featureGroupRef?.current) {
      // eslint-disable-next-line
      const leafletFG =
        featureGroupRef?.current /* eslint-disable-line no-alert */
      const { leafletElement } = leafletFG
      const geoJsonData = editLayer?.data

      // suppose geoJsonData [{bhiwandi},{Dadar}]
      const coordinates = geoJsonData.map((option: any) => {
        const optionObj = orinalCoordinatesKey.map((key: string) => option[key])
        // [lat,long]
        return [optionObj]
      }) // [[],[]]

      const circleLayer: any[] = []
      coordinates?.forEach((option: any, index: number) => {
        const currentData = geoJsonData[index]
        const parsedRadiusKey = radiusKey && parseFloat(currentData[radiusKey])
        const circle = LL.circle(option[index], {
          interactive: true,
          lineJoin: 'round',
          lineCap: 'round',
          fill: true,
          stroke: true,
          fillColor: '#5698d3',
          radius: parsedRadiusKey
            ? parseFloat((parsedRadiusKey * 1000).toFixed(2))
            : 200,
          weight:
            styleKeys?.weight && currentData[styleKeys?.weight]
              ? currentData[styleKeys?.weight]
              : 3,
          dashArray:
            styleKeys?.dashArray && currentData[styleKeys?.dashArray]
              ? currentData[styleKeys?.dashArray]
              : null,
          fillOpacity:
            styleKeys?.fillOpacity && currentData[styleKeys?.fillOpacity]
              ? currentData[styleKeys?.fillOpacity]
              : 0.2,

          renderer: geoJsonData.length > 200 ? renderer : undefined
        })

        circleLayer.push(circle)
      })

      circleLayer.forEach((layer: any, index: number) => {
        const currentData = geoJsonData[index]
        const parsedRadiusKey = radiusKey && parseFloat(currentData[radiusKey])
        const optionObj = orinalCoordinatesKey.map(
          (key: string) => currentData[key]
        )
        // manually adding initial radius and center
        layer.originalCenter = optionObj
        layer.originalRadius =
          parsedRadiusKey && parseFloat((parsedRadiusKey * 1000).toFixed(2))
        // add circle layer to featuregroup
        leafletElement.addLayer(layer)
        // make circle layer editable on load
        layer?.editing?.enable()
      })
      layerRef.current = circleLayer[0];
      setFeatureGroupProps?.({...featureGroupRef.current})
    }
  }

  // when creating new layer, keep it editable and remove previous all layer, only one edited layer creation is permitted
  const _onCreated = (e: any) => {
    const layer = e.layer
    layerRef.current = e.layer;
    // on creation make it editable
    layer?.editing?.enable()
    // all layer on featuregroup
    const drawnItems = featureGroupRef.current.leafletElement._layers
    // all editable layer with newly created layer on last index on array
    const drawnItemsValue = Object.keys(drawnItems)
    const latestCreatedItem = drawnItemsValue[drawnItemsValue.length - 1]
    if (drawnItemsValue.length > 1) {
      drawnItemsValue.forEach((layerid) => {
        // keep last, latest area,remove remaining, (we are allowing only one area to create)
        if (latestCreatedItem === layerid) return
        const layer = drawnItems[layerid]
        featureGroupRef.current.leafletElement.removeLayer(layer)
      })
    }
    setFeatureGroupProps?.({...featureGroupRef.current});
    // bind popup and open it once created

    // only created layer will remain,lat lang of that layer {lat: ,long:}
    const newLatLng = drawnItems[latestCreatedItem]?._latlng

    // send out to save in the form
    onChange({
      center: [],
      originalCenter: Object.values(newLatLng),
      isChanged: false,
      radius: '',
      originalRadius: layer._mRadius
    })
  }

  // when user clicks on create layer
  const _onDrawStart = (_e: any) => {  
    //add an active class to the create button
    const mapContainer: HTMLElement = _e?.target?.getContainer();
    let createShapeButton = mapContainer.querySelector(".leaflet-draw-draw-circle") as HTMLElement;
    if(createShapeButton) { createShapeButton.classList.add("draw-active"); }

    // all layer on featuregroup
    const drawnItems = featureGroupRef.current.leafletElement._layers
    // all editable layer with newly created layer on last index on array
    const drawnItemsValue = Object.keys(drawnItems)

    if (drawnItemsValue.length > 1) {
      drawnItemsValue.forEach((layerid) => {
        // remove all existing edited layer if start creating new
        const layer = drawnItems[layerid]
        featureGroupRef.current.leafletElement.removeLayer(layer)
      })
    }
    setFeatureGroupProps?.({...featureGroupRef.current})
  }

  // when edited or created circle moves from center
  const onEditMove = (e: any) => {
    const layer = e.layer
    // if original and changed center coordinates different teh  go inside
    if (layer.originalCenter !== Object.values(layer._latlng)) {
      // on creation make it editable
      layer?.editing?.enable()
      onChange({
        center: Object.values(layer._latlng),
        originalCenter: layer.originalCenter,
        isChanged: true,
        radius: '',
        originalRadius: layer._mRadius
      })
    }
  }
  // when edited or created circle radius changes
  const onEditResize = (e: any) => {
    const layer = e.layer
    // on creation make it editable
    layer?.editing?.enable()

    const newRadius = layer?._mRadius
    onChange({
      center: layer.originalCenter ? Object.values(layer._latlng) : [], // if original center(edition going on) present then newer will come here
      originalCenter: layer.originalCenter
        ? layer.originalCenter
        : Object.values(layer._latlng), // if original center(edition going on) present then original will be original or show new coordinates (creation)
      isChanged: false,
      radius: layer.originalRadius ? newRadius : '',
      originalRadius: layer.originalRadius ? layer.originalRadius : newRadius
    })
  }

  const _DrawStop = (e:any) => {
    //remove the active class when the draw stops
    const mapContainer: HTMLElement = e?.target?.getContainer();
    let createShapeButton = mapContainer.querySelector(".leaflet-draw-draw-circle") as HTMLElement;
    if(createShapeButton) { createShapeButton.classList.remove("draw-active"); }
  }

  return (
    <FeatureGroup ref={featureGroupRef as any} renderer={renderer}>
      <EditControl
        position='bottomright'
        onCreated={_onCreated}
        onDrawStart={_onDrawStart}
        onEditMove={onEditMove}
        onEditResize={onEditResize}
        onDrawStop={_DrawStop}
        draw={
          createPermission
            ? {
                rectangle: false,
                polyline: false,
                polygon: false,
                marker: false,
                circlemarker: false,
                circle: {
                  allowIntersection: false,
                  showArea: true,
                  clickable: true
                }
              }
            : false
        }
        edit={{
          remove: false,
          allowIntersection: false,
          edit: false,
          toolbar: false
        }}
      />
      {editPopUpComponent && <StyledPopUp keepInView>{editPopUpComponent({ map })}</StyledPopUp>}
    </FeatureGroup>
  )
}

export default React.memo(LeafletCircleEditLayer)
