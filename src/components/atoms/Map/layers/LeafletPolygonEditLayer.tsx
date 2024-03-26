import LL from 'leaflet'
import React, { useEffect, useState } from 'react'
import { FeatureGroup, useLeaflet } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { intersect, multiPolygon, area } from 'turf'
import { StyledPopUp, PolygonToast } from '../StyledMap'
import Toast from '../../../molecules/Toast/Toast'
import EditPopUp from '../SubComponent/EditPopUp'
import ReactDOMServer from "react-dom/server";
const _ = require('lodash');
interface ILeafletPolygonEditLayer {
  editLayer: any
  createPermission: boolean
  onChange: (changedObject: IChangedObject) => void
  orinalCoordinatesKey: string | undefined
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent: ({ map }: any) => React.ReactNode
  polygon: any
  setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
}
interface IChangedObject {
  coordinates: any[]
  originalCoordinates: any[]
  isChanged: boolean,
  isIntersection?:boolean,
  previousCoordinates?:any[]
  area?: number
}

const checkIntersection = (thisPolygon: any, polygonInfo: any) => {
  const polygonData = polygonInfo.data
  const positionCoordinateKey = polygonInfo.positionCoordinateKey // in data which key gives coordinates
  let intersectionFl = false
  // all polygon layers
  polygonData.forEach((polygonOption: any) => {
    const optionObj = polygonOption[positionCoordinateKey]
    const optionArray: any[] = []
    optionObj.forEach((coordinate: any) => {
      optionArray.push(Object.values(coordinate))
    }) // [[lat,long],[lat,long]]
    var otherPolygon = multiPolygon([[_createTurfCompatiblePolygon(optionObj)]])
    try {
      var intersection = intersect(thisPolygon, otherPolygon)
      if (intersection) {
        if (intersection.geometry.type === 'MultiPolygon') {
          intersectionFl = true
        }
      }
    } catch (err) {
      intersectionFl = true
    }
  })
  return intersectionFl
}

const _createTurfCompatiblePolygon = (coordinates: any) => {
  const newValue = coordinates.map((eachCoordinate: any) =>
    Object.values(eachCoordinate)
  )

  return newValue
}
const LeafletPolygonEditLayer = ({
  editLayer,
  createPermission,
  orinalCoordinatesKey,
  polygon,
  // createShape,
  // setCreateShape,
  editPopUpComponent,
  onChange,
  setFeatureGroupProps
}: ILeafletPolygonEditLayer) => {
  const featureGroupRef: any = React.useRef()
  const editRef: any = React.useRef()
  const createdLayerRef: any = React.useRef()
  const [removedLayer, setRemovedLayer] = useState<any[] | null>(null)
  const [showToast, setShowToast] = useState<boolean>(false)
  const colorKey = polygon.colorKey // the color of polygon
  const styleKeys = polygon?.styleKey // circle style

  const renderer: any = LL.canvas({ padding: 0.5 }) // adding renderer if canvasRenderer present in polygon


  const { map } = useLeaflet()
  const obj = document.getElementById('closePopupBtn');
  if(obj !== null){
    obj.onclick=()=>{
      map?.closePopup();
      createdLayerRef.current.unbindPopup();
    }
  }

  useEffect(() => {
    if(createdLayerRef.current && Object.keys(createdLayerRef.current)?.length > 0) {
      createdLayerRef.current.on("click popupclose", () => {
        map?.closePopup(); 
        createdLayerRef.current.unbindPopup();
      });
    }
  },[createdLayerRef.current])


  useEffect(() => {
    renderPloyLayer()
    return () => {if(createdLayerRef.current && Object.keys(createdLayerRef.current)?.length > 0){createdLayerRef.current.off("click popupclose")}}
  }, [])
  const renderPloyLayer = () => {
    // populate the leaflet FeatureGroup with the geoJson layers

    if (featureGroupRef?.current && orinalCoordinatesKey) {
      // eslint-disable-next-line
      const leafletFG =
        featureGroupRef?.current /* eslint-disable-line no-alert */
      const { leafletElement } = leafletFG
      const geoJsonData = editLayer?.data

      // suppose geoJsonData [{bhiwandi},{Dadar}]
      const coordinates = geoJsonData.map((option: any) => {
        const optionObj = option[orinalCoordinatesKey]
        const optionArray: any[] = []
        optionObj.forEach((coordinate: any) => {
          optionArray.push(Object.values(coordinate))
        }) // [[lat,long],[lat,long]]

        return optionArray
      }) // [{latitude:'',longitude:''},{latitude:'',longitude:''}]

      const polyLayers: any[] = []
      coordinates?.forEach((option: any) => {
        polyLayers.push(
          LL.polygon(option, {
            interactive: true,
            lineJoin: 'round',
            lineCap: 'round',
            fill: true,
            stroke: true,
            fillColor:
              styleKeys?.fillColor && option[styleKeys?.fillColor]
                ? option[styleKeys?.fillColor]
                : '',
            fillOpacity:
              styleKeys?.fillOpacity && option[styleKeys?.fillOpacity]
                ? option[styleKeys?.fillOpacity]
                : 0.2,
            opacity:1, 
            smoothFactor:
              styleKeys?.smoothFactor && option[styleKeys?.smoothFactor]
                ? option[styleKeys?.smoothFactor]
                : 1,
            renderer: option?.canvasRenderer ? renderer : null,
            color: option[colorKey] ? option[colorKey] : '#3388ff'
          })
        )
      })

      for (const layer of polyLayers) {
        // add polygon layer to featuregroup
        leafletElement.addLayer(layer)

        // make poly layer editable on load
        layer?.editing?.enable()
      }
      setFeatureGroupProps?.({...featureGroupRef?.current});
    }
  }

  // when creating new layer, keep it editable and remove previous all layer, only one edited layer creation is permitted
  const _onCreated = (e: any) => {
    const layer = e.layer
    layer.bindPopup(ReactDOMServer.renderToString(<EditPopUp onClick={() => { map?.closePopup()}}/>)).openPopup();
    createdLayerRef.current = layer;
    // all layer on featuregroup
    const drawnItems = featureGroupRef.current.leafletElement._layers
    // all editable layer with newly created layer on last index on array
    const drawnItemsValue = Object.keys(drawnItems)
    const latestCreatedItem = drawnItemsValue[drawnItemsValue.length - 1]
    // only created layer will remain,lat lang of that layer
    const newLatLng = drawnItems[latestCreatedItem]?._latlngs[0]
    const polyObjTurfCompatible = _createTurfCompatiblePolygon(newLatLng)
    // user created below polygon
    const thisPolygon = multiPolygon([[polyObjTurfCompatible]])
    const isInterSection = checkIntersection(thisPolygon, polygon)

    if (drawnItemsValue.length > 0) {
      drawnItemsValue.forEach((layerid) => {
        const layer = drawnItems[layerid]
        // if intersection then remove last latest layer and keep old data
        if (isInterSection) {
          if (latestCreatedItem === layerid) {
            // remove latest layer and add old layers
            featureGroupRef.current.leafletElement.removeLayer(layer)
            removedLayer &&
              removedLayer.forEach((element) => {
                featureGroupRef.current.leafletElement.addLayer(element)
              })
              setShowToast(true);
              setTimeout(()=>{
              setShowToast(false);
            }, 3000)
          }
        } else {
          // keep last, latest area,remove remaining, (we are allowing only one area to create)
          if (latestCreatedItem === layerid) {
            layer?.editing?.enable()
            editRef.current.leafletElement.recentlyEdittedLatLng = _.cloneDeep(layer._latlngs)
            return
          }
          featureGroupRef.current.leafletElement.removeLayer(layer)
        }
      })
      setFeatureGroupProps?.({...featureGroupRef?.current});
    }
    if (!isInterSection) {
      // send out to save in the form
      onChange({
        coordinates: [],
        originalCoordinates: newLatLng,
        isChanged: false,
        area: area(thisPolygon)
      })
    }
  }

  // when edited layer while creation, vertex gets changes
  const _onDrawVertex = (e: any) => {
    const originalLatLng: any[] = []
    const newLatLng: any[] = []
    const { layers }: any = e
    // if (Object.keys(layers?._layers).length > 2) {
    //   editRef.current.leafletElement._toolbars.draw._modes.polygon.handler.completeShape()
    // }
    layers?.eachLayer((_layer: any) => {
      originalLatLng.push([_layer?._origLatLng?.lat, _layer?._origLatLng?.lng])
      newLatLng.push(
        Object.values([_layer?._latlng?.lat, _layer?._latlng?.lng])
      )
    })
    onChange({
      coordinates: newLatLng,
      originalCoordinates: newLatLng,
      isChanged: true
    })
  }

  // when user clicks on create layer
  const _onDrawStart = (_e: any) => {
    //add an active class to the create button
    const mapContainer: HTMLElement = _e?.target?.getContainer();
    let createShapeButton = mapContainer.querySelector(".leaflet-draw-draw-polygon") as HTMLElement;
    if(createShapeButton) { createShapeButton.classList.add("draw-active"); }

    // all layer on featuregroup
    const drawnItems = featureGroupRef.current.leafletElement._layers
    // all editable layer with newly created layer on last index on array
    const drawnItemsValue = Object.keys(drawnItems)
    const removedLayer: any[] = []

    if (drawnItemsValue.length > 1) {
      drawnItemsValue.forEach((layerid) => {
        // remove all existing edited layer if start creating new
        const layer = drawnItems[layerid]
        removedLayer.push(layer)
        featureGroupRef.current.leafletElement.removeLayer(layer)
      })
    } 
    setFeatureGroupProps?.({...featureGroupRef?.current});
    // ret removed layer list to restore if intersection
    setRemovedLayer(removedLayer)
  }

  // when in edited mode,change in verted captured here
  const onEditVertex = (e: any) => {
    const originalLatLng: any[] = []
    const newLatLng: any[] = []
    const {target }: any = e
    target.eachLayer((_layer: any) => {
      if (Object.prototype.hasOwnProperty.call(_layer, 'edited')) {
        if (_layer.editing.latlngs[0]) {
          _layer.editing.latlngs[0][0]?.forEach((latLng: any) => {
            newLatLng.push([latLng.lat, latLng.lng])
          })
        }
      }
    })

    console.log(originalLatLng, 'originalLatLng and newLatLng', newLatLng)
    const thisPolygon = multiPolygon([[newLatLng]])
    const isInterSection = checkIntersection(thisPolygon, polygon)
    const drawnItems = featureGroupRef.current.leafletElement._layers
    const drawnItemsValue = Object.keys(drawnItems)
    const latestCreatedItem = drawnItemsValue[drawnItemsValue.length - 1]
    drawnItemsValue.forEach((layerid) => {
      const layer = drawnItems[layerid]
      // if intersection then remove last latest layer and keep old data
      if (isInterSection) {
        if (latestCreatedItem === layerid) {
          setShowToast(true);  
           setTimeout(()=>{
            setShowToast(false);
          }, 3000)
        }
      } else {
        if (latestCreatedItem === layerid) { 
          editRef.current.leafletElement.recentlyEdittedLatLng = _.cloneDeep(layer._latlngs)
          return
        }
      }
    })

    onChange({
      coordinates: newLatLng,
      originalCoordinates: newLatLng,
      isChanged: true,
      isIntersection:!(JSON.stringify(editRef.current.leafletElement.recentlyEdittedLatLng) == JSON.stringify(e.poly._latlngs)),
      previousCoordinates: editRef.current.leafletElement.recentlyEdittedLatLng?.[0],
      area: area(thisPolygon)
    })
  }

  const _DrawStop = (e:any) => {
    //remove the active class when the draw stops
    const mapContainer: HTMLElement = e?.target?.getContainer();
    let createShapeButton = mapContainer.querySelector(".leaflet-draw-draw-polygon") as HTMLElement;
    if(createShapeButton) { createShapeButton.classList.remove("draw-active"); }
  }

  return (
    <FeatureGroup ref={featureGroupRef as any}>
      <EditControl
        ref={editRef as any}
        position='bottomright'
        onCreated={_onCreated}
        onDrawVertex={_onDrawVertex}
        onDrawStart={_onDrawStart}
        onEditVertex={onEditVertex}
        onDrawStop={_DrawStop}
        draw={
          createPermission
            ? {
                rectangle: false,
                polyline: false,
                circle: false,
                marker: false,
                circlemarker: false,
                polygon: {
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
      {showToast && 
     <PolygonToast>
     <Toast  iconVariant='warning'
          removeButton={false}
          remove={()=> {}}>
           Overlaps not allowed!!
      </Toast>
      </PolygonToast>
      }
    </FeatureGroup>
  )
}

export default LeafletPolygonEditLayer
