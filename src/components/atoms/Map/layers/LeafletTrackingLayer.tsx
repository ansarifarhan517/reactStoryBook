// The layer which displays a tracking - markers + trip path both

import React from 'react'
import ILeafletMapProps from '../interfaces.d'
import AntPath from 'react-leaflet-ant-path'
import TRACKING_CONFIG from '../constants/trackingConfig'
import markerIcons from '../dummyData/MarkerIcon.sampleData'
import { Marker } from 'react-leaflet'
import LL from 'leaflet'

const LeafletTrackingLayer = (props: ILeafletMapProps) => {
  // points
  const allPoints = props.tracking?.points?.map((point: any) => {
    return [point.latitude, point.longitude]
  })

  const waypoints = allPoints.filter((point: any, i: number) => {
    return (
      i !== 0 &&
      point[0] !== allPoints[i - 1][0] &&
      point[1] !== allPoints[i - 1][1]
    )
  })

  return (
    <React.Fragment>
      {props.tracking?.showDiscretePoints &&
        waypoints?.map((point: any, index: number) => {
          return (
            <Marker
              key={index}
              id={index}
              position={point}
              icon={new LL.DivIcon(markerIcons.tracking)}
            />
          )
        })}
      <AntPath positions={waypoints} options={TRACKING_CONFIG} />
    </React.Fragment>
  )
}

export default LeafletTrackingLayer
