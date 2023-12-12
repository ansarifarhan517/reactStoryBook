// The marker layer which will display all the markers and marker clusters

import React, { useEffect, useState } from 'react'
import { Marker, useLeaflet } from 'react-leaflet'
import ILeafletMapProps from '../interfaces.d'
import LL from 'leaflet'
// import markerIcons from '../dummyData/MarkerIcon.sampleData'
import imgUrl from '../../../../assets/icons/Bigmarker_red.svg'
import {
  GeocodingFieldsWrapper,
  GeocodingField
} from './../utils/LocationSearch/StyledLocationSearch'
import IconButton from '../../IconButton'
import Box from '../../Box'

interface ILeafletGeocodingLayer extends ILeafletMapProps {
  focusSearchPlace: boolean
  onLocationSelect: (
    position: any,
    searchText?: any,
    isMarkerDragged?: boolean,
    bounds?: any,
    zoom?: any
  ) => void
  setIsMarkerDragged: (value: boolean) => void
  setIsMapSearched: (value: boolean) => void
  theMap: any
  zoomLGC?: number
}

// The layer with actual markers
const LeafletGeocodingLayer = (props: ILeafletGeocodingLayer) => {
  const {
    iconsRef,
    geocoding,
    // settingConfig,
    focusSearchPlace,
    setIsMarkerDragged,
    setIsMapSearched,
    theMap,
    zoomLGC=14
  } = props
  const [lat, setLat] = useState(geocoding?.position?.[0])
  const [long, setLong] = useState(geocoding?.position?.[1])
  const [isLocationChanged, setIsLocationChanged] = useState<boolean>(false)
  const oldLatLong = React.useMemo(() => {
    return { lat: geocoding?.position?.[0], long: geocoding?.position?.[1] }
  }, [])
  const oldSearchText = React.useMemo(() => geocoding?.searchText, [])

  const { map } = useLeaflet()
  let markerIcon: any = LL.icon({
    iconUrl: imgUrl
  })
  if (iconsRef?.locationSearch) {
    markerIcon = new LL.DivIcon(iconsRef?.locationSearch)
  }

  useEffect(() => {
    // if location get changed by search/dragdrop or geocoding set this flag true and show save and reset
    if (lat !== geocoding?.position?.[0] && long !== geocoding?.position?.[1]) {
      setIsLocationChanged(true)
    }
    setLat(geocoding?.position?.[0])
    setLong(geocoding?.position?.[1])
  }, [geocoding.position])

  useEffect(() => {
    // if serach text in search box and focusSearchPlace is true then set map view directly
    // we are not using flytoBound -reason is map bound giving(includes marker while caluculating bound) resulting not focusing on search place
    if (map && geocoding.searchText === '' && geocoding?.position) {
      map.setView(geocoding?.position, zoomLGC, { duration: 0.5 })
    } else if (map && geocoding.searchText && focusSearchPlace) {
      map.setView(geocoding?.position, zoomLGC, { duration: 0.5 })
    } else {
      // if nothing in search box , whatever map bound giving(includes marker while caluculating bound) just fly on that.
      const newMapBounds = map?.getBounds()
      if (map && newMapBounds && Object.keys(newMapBounds).length) {
        map.flyToBounds(newMapBounds, {
          maxZoom: 14,
          duration: 0.5,
          padding: LL.point(100, 100)
        })
      }
    }
  }, [map, focusSearchPlace, geocoding?.position])

  const markerDragend = (event: any) => {
    const curZoom = theMap?.current?.leafletElement.getZoom()
    try {
      if (props.onLocationSelect !== undefined) {
        setIsMarkerDragged(true)
        props.onLocationSelect(
          [
            Number(event.target.getLatLng()?.lat),
            Number(event.target.getLatLng()?.lng)
          ],
          '',
          true,
          null,
          curZoom
        )
      }

      props.geocoding?.onGeocodingDragEnd &&
        props.geocoding.onGeocodingDragEnd([
          Number(event.target.getLatLng()?.lat),
          Number(event.target.getLatLng()?.lng)
        ])
    } catch (e) {
      console.log(e)
    }
  }

  const onLatChange = (e: any) => {
    const newLat = parseFloat(e.target.value || lat)
    setLat(newLat)
  }
  // whenevr lat long both there on blur,send lat long to location select in map
  // there is updateGeocoding will trigger position change,
  // position change will trigger useEffect in Location search and as it dragging phenomenon(not physically writting something in input)
  // keeping separate state to capture that.So that in Location search on the basis of this key we can decide to show dragged location which coming through api or user written searchtext
  const onBlurGeoFields = () => {
    if (lat && long) {
      setIsMarkerDragged(true)
      // to tell user i searched it through map drag marker
      setIsMapSearched(false)
      setTimeout(() => {
        props.onLocationSelect([Number(lat), Number(long)], '', true, null, zoomLGC)
      }, 500)
    }
  }
  const onLongChange = (e: any) => {
    const newLong = parseFloat(e.target.value || long)
    setLong(newLong)
  }
  const onReset = () => {
    setLat(oldLatLong.lat)
    setLong(oldLatLong.long)
    props.onLocationSelect(
      [oldLatLong?.lat, oldLatLong?.long],
      oldSearchText,
      true
    )
  }

  return (
    <React.Fragment>
      {props?.geocoding?.position && (
        // props?.geocoding?.searchText &&
        /* focusSearchPlace && */
        <Marker
          draggable={props.geocoding?.permission}
          autoPan
          ondragend={(e: any) => {
            // even when we drag , we are searching indirectly through map
            setIsMapSearched(false)
            markerDragend(e)
          }}
          position={props?.geocoding?.position}
          icon={markerIcon}
        />
      )}

      {props?.geocoding?.permission && (
        <GeocodingFieldsWrapper>
          <GeocodingField
            id='map_latitude'
            className='geocodingField latitude'
            type='number'
            onChange={(e) => {
              onLatChange(e)
            }}
            placeholder='Latitude'
            onBlur={() => onBlurGeoFields()}
            value={lat || ''}
          />
          <GeocodingField
            id='map_longitude'
            className='geocodingField longitude'
            type='number'
            onChange={(e) => {
              onLongChange(e)
            }}
            onBlur={() => onBlurGeoFields()}
            placeholder='Longitude'
            value={long || ''}
          />

          {/* Save geocoding button */}
          {props.geocoding?.position?.[0] &&
            props.geocoding?.position?.[1] &&
            props.geocoding?.onGeocodingSave &&
            props.geocoding?.isSave &&
            isLocationChanged && (
              <Box
                display='flex'
                flexDirection='row'
                style={{ animation: 'fadeInUp 0.5s linear 0s' }}
              >
                <IconButton
                  iconVariant='icomoon-save'
                  primary
                  style={{ height: 35, marginRight: '10px' }}
                  onClick={() =>
                    props.geocoding?.onGeocodingSave(props.geocoding)
                  }
                  children='Save'
                />

                <IconButton
                  iconVariant='icomoon-back'
                  style={{ height: 35 }}
                  onClick={() => onReset()}
                  children='Reset'
                />
              </Box>
            )}
        </GeocodingFieldsWrapper>
      )}
    </React.Fragment>
  )
}

export default LeafletGeocodingLayer
