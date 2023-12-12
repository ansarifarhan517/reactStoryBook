// The layer which displays all the buttons on the map

import React from 'react'
import { ScaleControl, useLeaflet, ZoomControl } from 'react-leaflet'
import FullscreenControl from 'react-leaflet-fullscreen'
import 'react-leaflet-fullscreen/dist/styles.css'
import { tSearchFieldAddressInfo } from '../interfaces.d'
import LocationSearch from '../utils/LocationSearch/LocationSearch'
interface ILeafletControlLayer {
  zoomControl: boolean
  locationSearch: boolean
  google: any
  // On suggested location select
  onLocationSelect: (
    position: any,
    searchText?: any,
    isMarkerDragged?: boolean,
    bounds?: any,
    zoom?: any
  ) => void
  focusSearchPlace: boolean
  setIsMarkerDragged: (value: boolean) => void
  isMarkerDragged: boolean
  setSearchFieldAddressInfo: (obj: tSearchFieldAddressInfo) => void
  setIsMapSearched: (value: boolean) => void
  isMapSearched: boolean
}

const LeafletControlLayer = (props: ILeafletControlLayer) => {
  const {
    zoomControl,
    locationSearch,
    google,
    onLocationSelect,
    focusSearchPlace,
    setIsMarkerDragged,
    isMarkerDragged,
    setSearchFieldAddressInfo,
    setIsMapSearched,
    isMapSearched
  } = props

  // fullscreen show after map getting displayed
  const { map } = useLeaflet()
  return (
    <React.Fragment>
      {zoomControl && (
        <ZoomControl
          position='bottomright'
          zoomInTitle='Click here to Zoom In to the map.'
          zoomOutTitle=' Click here to Zoom Out of the map.'
        />
      )}

      {zoomControl && (
        <ScaleControl
          position='bottomleft'
          metric
          imperial
          maxWidth={100}
          updateWhenIdle
        />
      )}

      {locationSearch && (
        <LocationSearch
          google={google}
          onLocationSelect={onLocationSelect}
          focusSearchPlace={focusSearchPlace}
          setIsMarkerDragged={setIsMarkerDragged}
          isMarkerDragged={isMarkerDragged}
          setSearchFieldAddressInfo={setSearchFieldAddressInfo}
          setIsMapSearched={setIsMapSearched}
          isMapSearched={isMapSearched}
        />
      )}
      {map && (
        <FullscreenControl
          position='bottomright'
          fullscreenControl
          title='Click here to view map in full screen mode'
        />
      )}
    </React.Fragment>
  )
}

export default LeafletControlLayer
