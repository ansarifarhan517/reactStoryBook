import { GoogleAPI } from 'google-maps-react'
import LL, { LatLngExpression } from 'leaflet'
import React, { Fragment } from 'react'
import { Circle, FeatureGroup, Tooltip } from 'react-leaflet'
import { ICircle } from '../interfaces.d'
import { StyledPopUp } from '../StyledMap'
import LeafletInfowindow from '../utils/LeafletInfowindow'

interface ILeafletCirclePlottingLayer {
  circle: ICircle
  popupRef: any
  google: GoogleAPI
  popupCustomComponent: any
}

const LeafletCirclePlottingLayer = ({
  circle,
  popupRef, // popup key structure, which keys can be shown
  google, // for location finding
  popupCustomComponent
}: ILeafletCirclePlottingLayer) => {
  // as mouse over will rerender component, we show tooltip only when it gets clicked

  const popupRefType = circle?.popupRef // type which we are mapping in popupRef object
  const toolTipKey = circle?.toolTipKey // tooltip key which will be give value from option object
  const centerKey = circle?.center // circle will take [lat,lng]
  const circleData = circle?.data // circle data like name, radius
  const radiusKey = circle?.radiusKey
  const styleKeys = circle?.styleKey // circle style
  const renderer: any = LL.canvas({ padding: 0.5 }) // adding renderer if data entries more than 200

  return (
    <FeatureGroup renderer={renderer}>
      {circleData.map((option: any, dataIndex: number) => {
        const center = centerKey
          ? centerKey.map((entity: string) => option[entity])
          : [option?.latitude, option?.longitude]

        const parsedRadiusKey = radiusKey && parseFloat(option[radiusKey])

        return (
          <Fragment key={dataIndex}>
            <Circle
              fillColor={
                styleKeys?.fillColor && option[styleKeys?.fillColor]
                  ? option[styleKeys?.fillColor]
                  : '#3388ff'
              }
              stroke
              renderer={circleData.length > 200 ? renderer : undefined}
              weight={
                styleKeys?.weight && option[styleKeys?.weight]
                  ? option[styleKeys?.weight]
                  : 3
              }
              color={(circle.colorKey && option[circle.colorKey]) || '#3388ff'}
              dashArray={
                styleKeys?.dashArray && option[styleKeys?.dashArray]
                  ? option[styleKeys?.dashArray]
                  : null
              }
              fillOpacity={
                styleKeys?.fillOpacity && option[styleKeys?.fillOpacity]
                  ? option[styleKeys?.fillOpacity]
                  : 0.2
              }
              radius={
                parsedRadiusKey
                  ? parseFloat((parsedRadiusKey * 1000).toFixed(2))
                  : 200
              }
              center={center as LatLngExpression}
            >
              {/* Tooltip which shows on marker hover */}
              <Tooltip sticky direction='auto'>
                {option[toolTipKey]}
              </Tooltip>

              {/* Popup which opens up on marker click */}
              {popupRef && popupRefType && (
                <StyledPopUp keepInView>
                  <LeafletInfowindow
                    structures={popupRef}
                    popupRef={popupRefType}
                    data={option}
                    google={google} // will be needed for location using geocoder
                    latlngObj={{
                      lat: parseFloat(option.latitude),
                      lng: parseFloat(option.longitude)
                    }}
                    popupCustomComponent={popupCustomComponent}
                  />
                </StyledPopUp>
              )}
            </Circle>
          </Fragment>
        )
      })}
    </FeatureGroup>
  )
}

export default LeafletCirclePlottingLayer
