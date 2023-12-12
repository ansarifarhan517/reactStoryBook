import LL from 'leaflet'
import React, { useEffect } from 'react'
import { FeatureGroup, useLeaflet } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { ICircle } from '../interfaces.d'
import { StyledPopUp } from '../StyledMap'

interface ILeafletCircleEditLayer {
  onChange: (changedObject: IChangedObject) => void
  createShape: boolean
  setCreateShape: (createShape: boolean) => void
  editPopUpComponent: any
  circle: ICircle
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
  onChange
}: ILeafletCircleEditLayer) => {
  const featureGroupRef: any = React.useRef()
  const renderer: any = LL.canvas({ padding: 0.5 }) // adding renderer if data entries more than 200
  const radiusKey = circle?.radiusKey
  const styleKeys = circle?.styleKey // circle style
  const editLayer = circle?.editLayer
  const createPermission = circle?.createPermission || false
  const orinalCoordinatesKey = circle?.center

  const { map } = useLeaflet()

  useEffect(() => {
    renderPloyLayer()
  }, [])
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
    }
  }

  // when creating new layer, keep it editable and remove previous all layer, only one edited layer creation is permitted
  const _onCreated = (e: any) => {
    const layer = e.layer
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

  return (
    <FeatureGroup ref={featureGroupRef as any} renderer={renderer}>
      <EditControl
        position='bottomright'
        onCreated={_onCreated}
        onDrawStart={_onDrawStart}
        onEditMove={onEditMove}
        onEditResize={onEditResize}
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

      <StyledPopUp keepInView>
        {editPopUpComponent && editPopUpComponent({ map })}
      </StyledPopUp>
    </FeatureGroup>
  )
}

export default LeafletCircleEditLayer
