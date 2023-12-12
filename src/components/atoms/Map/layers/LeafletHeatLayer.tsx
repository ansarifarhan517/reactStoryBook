// The heat layer which will display all the densitites

import React, { useEffect, useState } from 'react'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

interface ILeafletHeatLayer {
  heatmap: any
  legend: any
  heatMapData: any
}
// The layer with actual heatmap
const LeafletHeatLayer = (props: ILeafletHeatLayer) => {
  const { heatmap, legend, heatMapData } = props
  const [heatData, setHeatData] = useState(heatmap?.data)
  // only till we don't use props properly

  useEffect(() => {
    const heatMap: any = []
    if (legend.length !== 0) {
      heatMapData?.forEach((row: any) => {
        legend.forEach((legendEntry: any) => {
          // if legend entry is cheked and whatever condition we mentioned in marekr config in allow that is true then create position array [lat,lng]
          if (
            legendEntry?.checked &&
            legendEntry.allow(row) &&
            row?.lat &&
            row?.lng
          ) {
            // this is default intensity in product -100
            const pos = [row?.lat, row?.lng, '100']
            heatMap.push(pos)
          }
        })
      })
    } else {
      // if there is no legend then push all info in [[lat,lng],[]]form
      heatMapData?.forEach((row: any) => {
        if (row?.lat && row?.lng) {
          // this is default intensity in product -100
          const pos = [row?.lat, row?.lng, '100']
          heatMap.push(pos)
        }
      })
    }
    setHeatData(heatMap)
  }, [legend, heatMapData])

  return (
    <React.Fragment>
      {props.heatmap && (
        <HeatmapLayer
          fitBoundsOnLoad
          scaleRadius
          fitBoundsOnUpdate
          points={heatData}
          longitudeExtractor={(m: any) => m[1]}
          latitudeExtractor={(m: any) => m[0]}
          intensityExtractor={(m: any) => parseFloat(m[2])}
        />
      )}
    </React.Fragment>
  )
}

export default LeafletHeatLayer
