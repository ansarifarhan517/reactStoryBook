import LL from 'leaflet'
import React, { Fragment } from 'react'
import { FeatureGroup, Polygon, Tooltip } from 'react-leaflet'
import { StyledPopUp } from '../StyledMap'
import LeafletInfowindow from '../utils/LeafletInfowindow'
import { ILeafletShapeLayer } from './LeafletPolygonLayer'

const LeafletPolygonPlottingLayer = ({
  polygon,
  popupRef,
  google,
  popupCustomComponent
}: ILeafletShapeLayer) => {
  const polyGeoFenceData = polygon.data // geofence data
  const popupRefType = polygon.popupRef // type which we are mapping in popupRef object
  const toolTipKey = polygon.toolTipKey // tooltip key to be shown
  const positionCoordinateKey = polygon.positionCoordinateKey // in data which key gives coordinates
  const colorKey = polygon.colorKey // the color of polygon
  const styleKeys = polygon?.styleKey // circle style
  const renderer: any = LL.canvas({ padding: 0.5 }) // adding renderer if canvasRenderer present in polygon
  return (
    <FeatureGroup color='#3388ff'>
      {polyGeoFenceData.map((option: any, dataIndex: number) => {
        const coordinates = option[positionCoordinateKey]
        const pointPositions = coordinates.map((entity: any) => {
          const pointCoordinate = [entity?.latitude, entity?.longitude]
          return pointCoordinate
        })

        return (
          <Fragment key={dataIndex}>
            <Polygon
              color={colorKey ? option[colorKey] : '#3388ff'}
              positions={pointPositions}
              stroke
              weight={1.5}
              riseOnHover
              fillColor={
                styleKeys?.fillColor && option[styleKeys?.fillColor]
                  ? option[styleKeys?.fillColor]
                  : ''
              }
              fillOpacity={
                styleKeys?.fillOpacity && option[styleKeys?.fillOpacity]
                  ? option[styleKeys?.fillOpacity]
                  : 0.2
              }
              smoothFactor={
                styleKeys?.smoothFactor && option[styleKeys?.smoothFactor]
                  ? option[styleKeys?.smoothFactor]
                  : 1
              }
              renderer={option?.canvasRenderer ? renderer : null}
            >
              <Tooltip sticky direction='auto'>
                <span>{option[toolTipKey]}</span>
              </Tooltip>
              {/* Popup which opens up on marker click */}
              {popupRef && popupRefType && (
                <StyledPopUp keepInView>
                  <LeafletInfowindow
                    structures={popupRef}
                    popupRef={popupRefType}
                    data={option}
                    google={google}
                    popupCustomComponent={popupCustomComponent}
                  />
                </StyledPopUp>
              )}
            </Polygon>
          </Fragment>
        )
      })}
    </FeatureGroup>
  )
}

export default LeafletPolygonPlottingLayer
