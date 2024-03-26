// The marker layer which will display all the markers and marker clusters

import React, { useEffect, useState } from 'react'
import { Marker, useLeaflet } from 'react-leaflet'
import ILeafletMapProps, { ICustomField } from '../interfaces.d'
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
    zoom?: any,
    radius?: number,
    getLatLong?: (value : Array<number>) => void
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
    zoomLGC=14,
    getLatLong
  } = props
  const [lat, setLat] = useState<number>(geocoding?.position?.[0])
  const [long, setLong] = useState<number>(geocoding?.position?.[1])
  const [customFieldValues, setCustomFieldValues] = useState<{[key:string]: any}>({}); 
  const [isLocationChanged, setIsLocationChanged] = useState<boolean>(false)
  const [latError, setLatError] = useState<boolean>(false)
  const [longError, setLongError] = useState<boolean>(false)
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
    if ((geocoding?.searchText && geocoding?.searchText.length > 0) || geocoding.position) {
      if(latError) { setLatError(false)}
      if(longError) { setLongError(false)}
    }
  }, [geocoding?.searchText, geocoding.position])

  useEffect(() => {
    if(geocoding?.setErrorGeocoding) {
      geocoding?.setErrorGeocoding({ lat: latError, lng: longError});
    }
  },[latError, longError]);

  useEffect(() => {
    if(geocoding?.customFields && geocoding?.customFields?.length > 0) {
      let updatedFormValues = geocoding.customFields.reduce(
        (result: {[key:string]: unknown}, field: ICustomField) => ({ ...result, [field.name]: field.value }),
        {}
        );
      setCustomFieldValues({...updatedFormValues});
      if(latError) { setLatError(false); setLat(geocoding?.position?.[0]); }
      if(longError) {  setLongError(false); setLong(geocoding?.position?.[1]); }
    }
  }, [geocoding.customFields]);

  useEffect(() => {
    // if serach text in search box and focusSearchPlace is true then set map view directly
    // we are not using flytoBound -reason is map bound giving(includes marker while caluculating bound) resulting not focusing on search place
    if (map && geocoding.searchText === '' && geocoding?.position) {
      map.setView(geocoding?.position, zoomLGC, { duration: 0.5, animate: true })
    } else if (map && geocoding.searchText && focusSearchPlace) {
      map.setView(geocoding?.position, zoomLGC, { duration: 0.5, animate: true  })
    } else {
        // if nothing in search box , whatever map bound giving(includes marker while caluculating bound) just fly on that.
        const newMapBounds = map?.getBounds()
        if (map && newMapBounds && Object.keys(newMapBounds).length && !geocoding?.disableDefaultFlyToBounds) {
          map.flyToBounds(newMapBounds, {
            maxZoom: 14,
            duration: 0.5,
            padding: LL.point(100, 100)
          })
        }
     }
  }, [map, focusSearchPlace, geocoding?.position])

  useEffect(() => {
    if(!geocoding.shouldUpdateShape || latError || longError) { return; }
    if((lat && lat !== geocoding?.position?.[0]) || (long && long !== geocoding?.position?.[1])) {
      setIsMarkerDragged(true);
      setIsMapSearched(false);
      props.onLocationSelect([Number(lat), Number(long)], '', true, null, zoomLGC, customFieldValues?.radius)
    }    
  },[lat, long, latError, longError]);

  useEffect(() => {
    if(!geocoding.shouldUpdateShape || latError || longError) { return; }
    const radius = geocoding?.customFields?.find((obj:ICustomField) => obj.name === "radius")?.value;
    if(customFieldValues?.radius && (customFieldValues?.radius !== radius)) {
      props.onLocationSelect([Number(lat), Number(long)], '', true, null, 0, customFieldValues?.radius);
    } else if(typeof customFieldValues?.radius !== "undefined" && isNaN(customFieldValues?.radius)) {
      props.onLocationSelect([Number(lat), Number(long)], '', true, null, 0, 0);
    }
  },[customFieldValues?.radius, latError, longError]);

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
          curZoom,
          customFieldValues?.radius
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

  const validLatCharsRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
  const validLongCharsRegex = /^[-+]?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/

  const isValidLatitude = (lat: any) => {
    return validLatCharsRegex.test(lat)
  }

  const isValidLongitude = (lng: any) => {
    return validLongCharsRegex.test(lng)
  }

  const onLatChange = (e: any) => {
    const newLat = parseFloat(e.target.value)
    if (isValidLatitude(newLat)) {
      setLatError(false)
    } else {
      setLatError(true)
    }
    setLat(newLat)
    getLatLong && getLatLong([newLat,long])
  }
  // whenevr lat long both there on blur,send lat long to location select in map
  // there is updateGeocoding will trigger position change,
  // position change will trigger useEffect in Location search and as it dragging phenomenon(not physically writting something in input)
  // keeping separate state to capture that.So that in Location search on the basis of this key we can decide to show dragged location which coming through api or user written searchtext
  const onBlurGeoFields = () => {
    if (lat && long && !geocoding.shouldUpdateShape) {
      setIsMarkerDragged(true)
      // to tell user i searched it through map drag marker
      setIsMapSearched(false)
      setTimeout(() => {
        props.onLocationSelect([Number(lat), Number(long)], '', true, null, zoomLGC, customFieldValues?.radius)
      }, 500)
    }
  }
  const onLongChange = (e: any) => {
    const newLong = parseFloat(e.target.value)
    if (isValidLongitude(newLong)) {
      setLongError(false)
    } else {
      setLongError(true)
    }
    setLong(newLong)
    getLatLong && getLatLong([lat,newLong])
  }
  const onReset = () => {
    setLat(oldLatLong.lat)
    setLong(oldLatLong.long)
    props.onLocationSelect(
      [oldLatLong?.lat, oldLatLong?.long],
      oldSearchText,
      true
    )
    setIsLocationChanged(false)
  }

  const handleCustomFieldsChange = (e: any) => {
    const { name, value } = e.target;
    setCustomFieldValues({...customFieldValues, [name]: parseFloat(value)})
  }

  const onKeyChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keysArray = ['+', '-', 'e', 'E']
    if (keysArray.includes(e.key)) {
      e.preventDefault()
    }
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
          {/* Latitude field should not be seen if lat is -200 */}
          {lat !== -200 && <GeocodingField
            autoComplete='off'
            id='map_latitude'
            className='geocodingField latitude'
            type='number'
            onChange={(e) => {
              onLatChange(e)
            }}
            placeholder='Latitude'
            onBlur={() => onBlurGeoFields()}
            value={lat || (lat === 0 ? 0 : '')}
            error={latError}
            errorMessage={latError ? 'Invalid latitude' : ''}
          />}
          {/* Longitude field should not be seen if lat is -200 */}
          {long !== -200 && <GeocodingField
            autoComplete='off'
            id='map_longitude'
            className='geocodingField longitude'
            type='number'
            onChange={(e) => {
              onLongChange(e)
            }}
            onBlur={() => onBlurGeoFields()}
            placeholder='Longitude'
            value={long || (long === 0 ? 0 : '')}
            error={longError}
            errorMessage={longError ? 'Invalid longitude' : ''}
          />}
          {geocoding?.customFields?.length > 0 ? 
            <>
              {geocoding?.customFields?.map((field: ICustomField) => {
                return (
                  <GeocodingField
                    autoComplete='off'
                    key={field.name}
                    id={`geocoding-${field.name}`}
                    className='geocodingField'
                    type={field.type}
                    name={field.name}
                    onChange={handleCustomFieldsChange}
                    placeholder={field.placeholder}
                    value={customFieldValues[field.name] || ''}
                    onKeyPress={onKeyChange}
                  />
                )
                })
              }
            </>
          : null}

          {/* Save geocoding button */}
          {props.geocoding?.position?.[0] &&
            props.geocoding?.position?.[1] &&
            props.geocoding?.onGeocodingSave &&
            props.geocoding?.isSave &&
            isLocationChanged ? (
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
                {/* Logic: If reset lat lng is -200 then we should not allow to reset lat lng. */}
                {oldLatLong?.lat !== -200 && oldLatLong?.long !== -200 && (
                  <IconButton
                    iconVariant='icomoon-back'
                    style={{ height: 35 }}
                    onClick={() => onReset()}
                    children='Reset'
                  />
                )}
              </Box>
            ): null}
        </GeocodingFieldsWrapper>
      )}
    </React.Fragment>
  )
}

export default LeafletGeocodingLayer
