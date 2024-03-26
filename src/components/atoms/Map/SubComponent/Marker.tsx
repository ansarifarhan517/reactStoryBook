import LL from 'leaflet'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Marker, Tooltip, useLeaflet, FeatureGroup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { IEntity } from '../interfaces.d'
import { StyledPopUp } from '../StyledMap'
import LeafletInfowindow from '../utils/LeafletInfowindow'
import throttle from '../../../../utilities/Throttle'
import { arrayEquals } from '../../../organisms/AdvancedFilter/components/Utils'

interface IMarker {
  entitiesMap: { [name: string]: IEntity }
  entities: string[]
  legendModel: any
  popupRef?: any
  iconsRef: any
  google: any
  focusMarkerId?: string
  geocoding: any
  focusSearchPlace: boolean
  ignoreMarkerPermission?: boolean
}
// from given metadata or users data, if status is matching with legends status like checked,allowed then show cluster
const markerPermission = (metaData: any, legends: any, legendModel: any) => {
  let permission = false
  legends?.forEach((legend: any) => {
    if (
      legendModel?.[legend]?.checked &&
      legendModel?.[legend]?.allow &&
      legendModel?.[legend]?.allow(metaData)
    ) {
      permission = true
    }
  })
  return permission
}

// const htmlDecode = (input: string) => {
//   var e = document.createElement('div')
//   e.innerHTML = input
//   return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
// }

const MarkerComponent = ({
  entitiesMap,
  entities,
  legendModel,
  iconsRef,
  popupRef,
  focusMarkerId,
  focusSearchPlace,
  ignoreMarkerPermission
}: IMarker) => {
  const { map } = useLeaflet()

  const featureGroupRef = React.useRef<any>()
  const featureHubGroupRef = React.useRef<any>()

  // mapping of the <entity>_<markerId> with the leaflet layer
  const [idLayerMapping, setIdLayerMapping] = useState<any>({})
  const newIdLayerMapping = useRef<any>({})
  const throttledSetLayer = throttle(() => {
    console.log('The new Id layer mapping is - ', idLayerMapping)
    setIdLayerMapping(newIdLayerMapping.current)
  }, 2000)
  const onMarkerAdd = (entity: string, id: string, layer: any) => {
    newIdLayerMapping.current[entity + '__' + id] = layer
    throttledSetLayer()
  }

  const onFeatureGroupAdd = (entity: string, layer: any) => {
    const newIdLayerMapping = { ...idLayerMapping }
    newIdLayerMapping[entity] = layer
    setIdLayerMapping(newIdLayerMapping)
    // console.log('The new Id layer mapping is - ', idLayerMapping)
  }

  const cluster = entities?.map((entity: string, index: number) => {
    const markers = entitiesMap?.[entity]?.markers?.list || []
    const hubsList: any = []
    const markerList: any = []

    markers
      ?.filter(
        (markerObj: any) =>
          !arrayEquals(markerObj?.position, [-200, -200]) &&
          markerObj?.lat !== -200 &&
          markerObj?.lng !== -200
      )
      ?.forEach((marker: any) => {
        if (entity === 'trips' && marker.entity === 'hub') {
          hubsList.push(marker)
        } else {
          markerList.push(marker)
        }
      })

    if (!entitiesMap?.[entity].permission) {
      return null
    }

    return (
      <React.Fragment key={entity + '_' + index}>
        <FeatureGroup ref={featureGroupRef as any}>
          <MarkerClusterGroup
            key={entity}
            spiderfyOnMaxZoom
            onAdd={(e: any) => onFeatureGroupAdd(entity, e?.target)}
            showCoverageOnHover={false}
            zoomToBoundsOnClick
            removeOutsideVisibleBounds
            maxClusterRadius={markerList.length > 100 ? 100 : 30}
            chunkedLoading
            chunkDelay={500}
          >
            {markerList.map((marker: any) => {
              if (
                markerPermission(
                  entitiesMap?.[entity]?.markers?.metaData?.[marker.id],
                  entitiesMap?.[entity]?.legends,
                  legendModel
                ) ||
                ignoreMarkerPermission
              ) {
                const customIcon = marker.icon
                  ? new LL.DivIcon({
                      ...marker.icon
                    })
                  : new LL.DivIcon(iconsRef?.[marker.iconRef])

                return (
                  <Marker
                    key={marker.id}
                    id={marker.id}
                    onClick={() => map?.doubleClickZoom.disable()}
                    onAdd={(e: any) =>
                      onMarkerAdd(entity, marker.id, e?.target)
                    }
                    position={marker.position}
                    icon={customIcon}
                  >
                    <Tooltip sticky direction='auto'>
                      <span>
                        {entitiesMap?.[entity]?.markers?.metaData?.[marker.id]
                          ?.title || marker.title}
                      </span>
                    </Tooltip>
                    {popupRef && marker.popupRef && (
                      <StyledPopUp
                        keepInView
                        onOpen={() => map?.panTo(marker.position)}
                      >
                        <LeafletInfowindow
                          structures={popupRef}
                          popupRef={marker.popupRef}
                          google={google}
                          latlngObj={{
                            lat: parseFloat(
                              entitiesMap?.[entity]?.markers?.metaData?.[
                                marker.id
                              ]?.lat
                            ),
                            lng: parseFloat(
                              entitiesMap?.[entity]?.markers?.metaData?.[
                                marker.id
                              ]?.lng
                            )
                          }}
                          data={
                            entitiesMap?.[entity]?.markers?.metaData?.[
                              marker.id
                            ]
                          }
                        />
                      </StyledPopUp>
                    )}
                  </Marker>
                )
              } else {
                return null
              }
            })}
          </MarkerClusterGroup>
        </FeatureGroup>

        {entity === 'trips' && hubsList.length > 0 && (
          <FeatureGroup
            key={entity + '_hub_' + index}
            ref={featureHubGroupRef as any}
          >
            {hubsList.map((marker: any) => {
              if (
                markerPermission(
                  entitiesMap?.[entity]?.markers?.metaData?.[marker.id],
                  entitiesMap?.[entity]?.legends,
                  legendModel
                ) ||
                ignoreMarkerPermission
              ) {
                const customIcon = marker.icon
                  ? new LL.DivIcon({
                      ...marker.icon
                    })
                  : new LL.DivIcon(iconsRef?.[marker.iconRef])
                return (
                  <Marker
                    key={marker.id}
                    id={marker.id}
                    onClick={() => map?.doubleClickZoom.disable()}
                    position={marker.position}
                    icon={customIcon}
                  >
                    <Tooltip sticky direction='auto'>
                      <span>{marker.title}</span>
                    </Tooltip>
                  </Marker>
                )
              } else {
                return null
              }
            })}
          </FeatureGroup>
        )}
      </React.Fragment>
    )
  })

  const zoomToAllMarkers = () => {
    const newMapBounds = featureGroupRef.current.leafletElement.getBounds()
    if (map && newMapBounds && Object.keys(newMapBounds).length) {
      map.fitBounds(featureGroupRef?.current?.leafletElement.getBounds(), {
        maxZoom: 14,
        duration: 0.5,
        padding: LL.point(100, 100),
        animate: true
      })
    }
  }

  useEffect(() => {
    // fly the map to all the marker bounds in the map
    if (map && featureGroupRef?.current?.leafletElement && !focusSearchPlace) {
      if (focusMarkerId && idLayerMapping && idLayerMapping[focusMarkerId]) {
        const entityLayer =
          focusMarkerId.split('__')[0] &&
          idLayerMapping[focusMarkerId.split('__')[0]]

        const markerLayer = idLayerMapping[focusMarkerId]

        if (entityLayer && markerLayer && map.hasLayer(markerLayer)) {
          entityLayer.zoomToShowLayer(markerLayer, function () {
            markerLayer.fireEvent('click').fireEvent('mouseout')
          })
        } else {
          zoomToAllMarkers()
        }
      } else {
        // in the default state, pan to the full layer containing all the markers
        zoomToAllMarkers()
      }
    }
  }, [entities, legendModel, focusMarkerId, focusSearchPlace])

  return <Fragment>{cluster}</Fragment>
}

export default React.memo(MarkerComponent)
