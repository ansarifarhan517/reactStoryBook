// The base component - atom - of the leaflet map

import { GoogleApiWrapper } from 'google-maps-react'
import React, { useEffect, useState, createContext } from 'react'
import { Map } from 'react-leaflet'
import { LeafletStyles } from 'styled-leaflet'
import SettingBox from '../SettingBox'
import Settings from '../SettingBox/data'
import { ZOOM_500M } from './constants/googleIntegration.constants'
import {
  convertArrayToObject,
  deepCopy,
  setLegendMarkers,
  updateMapWithSettings
} from './helperMethods'
import ILeafletMapProps, {
  ILeafletMapPropsLite,
  tGeocoding,
  tSearchFieldAddressInfo
} from './interfaces.d'
import LeafletCircleLayer from './layers/LeafletCircleLayer'
import LeafletControlLayer from './layers/LeafletControlLayer'
import LeafletGeocodingLayer from './layers/LeafletGeocodingLayer'
import LeafletHeatLayer from './layers/LeafletHeatLayer'
import LeafletMarkerLayer from './layers/LeafletMarkerLayer'
import LeafletPolygonLayer from './layers/LeafletPolygonLayer'
import LeafletTileLayer from './layers/LeafletTileLayer'
import LeafletTrackingLayer from './layers/LeafletTrackingLayer'
import LeafletTripsLayer from './layers/LeafletTripsLayer'
import { LeafletOverlay } from './utils/LeafletOverlay'
import { StyledMap } from './StyledMap'
import { tTheme, tTiles } from './types.d'
import { LatLngBounds } from 'leaflet'
export interface IGeocodingContext {
  geocoding?: tGeocoding
}
export const GeocodingContext = createContext<IGeocodingContext>({})

const LeafletMapWrapper = (props: ILeafletMapProps) => {
  const {
    markers,
    theme,
    heatmap,
    tiles,
    poi,
    popupRef,
    onEdit,
    editPopUpComponent,
    popupCustomComponent,
    circle,
    polygon,
    locationSearch = true,
    rulerControl,
    traffic,
    zoomControl = true,
    sendLocationOutside,
    isShowMapTileLayer = true,
    handleClosePopup,
    showLegendWrapper = true,
    useFlyTo = true
  } = props
  const [markerConfig, setmarkerConfig] = useState(markers)
  const [settingConfig, setSettingConfig] = useState(
    props?.settingConfig || Settings
  )
  const [_isShowTileLayer, setIsShowTileLayer] = useState<boolean>(
    isShowMapTileLayer
  )
  const [createShape, setCreateShape] = useState(false)
  const [mapRef, setMapRef] = useState<any>(React.createRef())
  const maxZoomConst = { google: 20, osm: 18 }
  const [localZoom, setLocalZoom] = useState(props.zoom)
  const selectedTile = tiles?.split('_')[0]
  // this to decide when to zoom on search place in searchbox or markers.
  const [focusSearchPlace, setFocusSearchPlace] = useState<boolean>(false)
  const [searchFieldAddressInfo, setSearchFieldAddressInfo] = useState<
    tSearchFieldAddressInfo | Partial<tSearchFieldAddressInfo>
  >({})

  // create a legend model for marker layer
  const [legend, setLegend] = useState(settingConfig?.Legends?.option)

  // legends in setting will be array of object
  const [legendModel, setLegendModel] = useState(
    convertArrayToObject(settingConfig?.Legends?.option)
  )
  // for settings needed configuration
  const [configurableOption, setConfigurableOption] = useState({
    theme: theme, // map theme
    heatmap: heatmap, // if heatmap or marker choice
    tiles: tiles, // of type tTiles
    isOpenStreet: false,
    poi: poi, // point of intrest toggle
    locationSearch: locationSearch, // weather to show search or not
    rulerControl: !!rulerControl, // weather to show rular or not
    circle,
    polygon,
    traffic: !!traffic
  })

  // on setting open modal and fade background
  const [showModal, setShowModal] = useState(false)

  // this is to determine weather user searched through search input in map
  const [isMapSearched, setIsMapSearched] = useState<boolean>(false)

  const [orientation, setOrientation] = useState({
    zoom: props.zoom,
    center: props.center,
    latLngBounds: props.latLngBounds
  })

  const [geocoding, setGeocoding] = useState<tGeocoding>(
    props.geocoding
      ? props.geocoding
      : {
          permission: false,
          position: props?.geocoding?.position,
          searchText: props?.geocoding?.searchText,
          isSave: props?.geocoding?.isSave
        }
  )
  // marker drag or geocoding field change will create dragged pheonomenon,so set it true
  // wherever user not physically writting search text is dagged pheonomenon
  const [isMarkerDragged, setIsMarkerDragged] = useState<boolean>(false)

  const geocodingContextValue = React.useMemo(() => ({ geocoding }), [
    geocoding
  ])
  const setMarkers = (legends: any) => {
    // current legends is not euqal to old legend then set false to serach place zooming  i.e. legends will zoom
    if (JSON.stringify(legend) !== JSON.stringify(legends)) {
      setFocusSearchPlace(false)
    }
    // create a legend model for marker layer
    setLegend && setLegend(deepCopy(legends)) // this is needed for settingconfig updation
    setLegendModel(deepCopy(convertArrayToObject(legends))) // this is needed for marker legend model updation

    const newMarker =
      markerConfig &&
      setLegendMarkers(deepCopy(legends), deepCopy(markerConfig))

    setmarkerConfig && setmarkerConfig(newMarker)
  }
  useEffect(() => {
    setIsShowTileLayer(isShowMapTileLayer)
  }, [isShowMapTileLayer])

  useEffect(() => {
    if (props?.settingConfig && props?.settingConfig?.Legends) {
      const newSettingConfig = deepCopy(settingConfig)
      // change setting on the basis of new marker legends
      newSettingConfig.Legends.option = legend
      setSettingConfig(newSettingConfig)
    }
  }, [legend])

  useEffect(() => {
    if (props?.settingConfig) {
      setSettingConfig(deepCopy(props?.settingConfig))
      setOrientation({
        ...orientation,
        zoom: props.zoom
      })
    }
  }, [props?.settingConfig])

  useEffect(() => {
    if (
      props?.geocoding?.permission &&
      props?.geocoding?.position &&
      JSON.stringify(props?.geocoding?.position[0]) !==
        JSON.stringify(geocoding?.position[0]) &&
      JSON.stringify(props?.geocoding?.position[1]) !==
        JSON.stringify(geocoding?.position[1])
    ) {
      setGeocoding({
        ...geocoding,
        position: [
          Number(props?.geocoding?.position[0]),
          Number(props?.geocoding?.position[1])
        ]
      })
      // beacuse search/position coming from props and once something in search input we need to focus the field
      setFocusSearchPlace(true)
    }
  }, [props?.geocoding?.position])

  useEffect(() => {
    if (
      props?.geocoding?.permission &&
      props?.geocoding?.searchText
      // props?.geocoding?.searchText !== geocoding?.searchText
    ) {
      setIsMapSearched(false)
      setGeocoding({
        ...geocoding,
        searchText: props?.geocoding?.searchText
      })
      // beacuse search coming from props and once something in search input we need to focus the field
      setFocusSearchPlace(true)
    }
  }, [props?.geocoding?.searchText])

  useEffect(() => {
    setConfigurableOption({ ...configurableOption, heatmap })
  }, [heatmap])

  useEffect(() => {
    setConfigurableOption({ ...configurableOption, polygon })
  }, [polygon, polygon?.popupRef])

  useEffect(() => {
    if (configurableOption?.heatmap?.permission) {
      // if heatmap true then hide makers
      //  setmarkerConfig({ ...markerConfig, permission: false })
    } else {
      if (configurableOption?.heatmap && markerConfig) {
        // if heatmap is false then make makers true
        const newConfig = Object.assign({}, configurableOption)
        newConfig.heatmap.permission = false
        setConfigurableOption(newConfig)
        setmarkerConfig({ ...markerConfig, permission: true })
      }
    }
  }, [configurableOption?.heatmap?.permission])

  useEffect(() => {
    // change in config
    setConfigurableOption({
      ...configurableOption,
      locationSearch: !!props.locationSearch,
      poi: props.poi,
      rulerControl: !!props.rulerControl,
      tiles: tiles
    })
    const newSettig = deepCopy(settingConfig)
    // change in setting data structure
    newSettig?.Miscellaneous?.option?.find((entry: any) => {
      if (entry.name === 'Point of interest') {
        entry.selected = !!poi
      } else if (entry.name === 'Traffic') {
        entry.selected = !!traffic
      } else if (entry.name === 'Ruler Control') {
        entry.selected = !!rulerControl
      } else if (entry.name === 'Location Search') {
        entry.selected = !!locationSearch
      }
    })
  }, [locationSearch, poi, rulerControl, traffic, tiles])

  useEffect(() => {
    setOrientation({
      ...orientation,
      zoom: props.zoom
    })
    // render it on change in setting, legend change which will need for mapping marker layer and setting
    // markerconfig updation on change in legends on map or setting  and toggled setting legend into legendmodel required for marker layer
    updateMapWithSettings(
      settingConfig,
      configurableOption,
      setConfigurableOption,
      setSettingConfig,
      markerConfig,
      setmarkerConfig,
      heatmap,
      geocoding,
      setGeocoding,
      locationSearch
    )
  }, [settingConfig, legend, legendModel])

  useEffect(() => {
    // if rows data selected from list view is not equal to markerConfig means we trigger list selection then make focust serach place false
    if (JSON.stringify(markers) !== JSON.stringify(markerConfig)) {
      setFocusSearchPlace(false)
    }
    // update the map state once the input markers are changed
    setmarkerConfig(markers)
  }, [markers])

  useEffect(() => {
    setMapRef(mapRef)
    const contextValueMap = mapRef?.current?.contextValue?.map as any
    // as we get map inside map we are moving flying bound functionality here
    if (contextValueMap) {
      contextValueMap?.invalidateSize(true)
      contextValueMap?.doubleClickZoom.enable()
      contextValueMap?.boxZoom.enable()
      contextValueMap?.scrollWheelZoom.enable()
      contextValueMap?.dragging.enable()
      if(configurableOption.polygon?.permission){
        let bounds= new LatLngBounds([])
        let boundsData= configurableOption.polygon.editLayer? configurableOption.polygon.editLayer.data: configurableOption.polygon.data
        boundsData && boundsData.length && boundsData.map((poly:any)=>{
          let latllnf= poly.polygonCoordinates.map((lt:any)=> {
            return [lt.latitude,lt.longitude]
          })
          const Latlng= new LatLngBounds(latllnf)
          bounds.extend(Latlng)
        })
        if(Object.values(bounds)?.length){
          contextValueMap?.fitBounds(bounds)
        } 
      }

    }
  }, [mapRef])

  useEffect(() => {
    if (
      searchFieldAddressInfo &&
      Object.keys(searchFieldAddressInfo).length > 0 &&
      searchFieldAddressInfo?.position
    ) {
      // while searching this keeps getting trigger so make sure whatevr searching field and (geocoding api)response searchfield should have same value
      // even above condition not filling and user dragging/changing geocode field then as well send that info outside
      // if (
      //   geocoding.searchText === searchFieldAddressInfo.searchText ||
      //   isMarkerDragged
      // ) {
      // dont touch this code, whenever we address from locationSelect(geocoding done in useEffect),this use effect will get called
      // isMapSearched : true - whenevr user search through input in map search places it will go true
      sendLocationOutside &&
        sendLocationOutside({
          ...searchFieldAddressInfo,
          isPropSearch: isMapSearched
        })
      // }
    }
  }, [searchFieldAddressInfo])

  const updateGeocoding = (position: any, searchText?: any, bounds?: any, recentZoom?: number) => {
    setGeocoding({ ...geocoding, position: position, searchText: searchText })
    if (!recentZoom) setLocalZoom(14)
    setOrientation({
      ...orientation,
      center: position,
      latLngBounds: bounds,
      zoom: recentZoom || 14
    })
  }
  // whenever any location is selected or updated, this function is called and focus place variable to true
  const onLocationSelect = (
    position: any,
    searchText?: any,
    isMarkerDragged?: boolean,
    bounds?: any,
    _zoom?: number
    // isCustomSearch?: boolean
  ) => {
    // if marker is not dragged or geocoding fields got changed and automatically got search value then use whatevr coming from props as a searchtext
    // but use position caluclated in locationSeach which will come in callback args
    // isMapSearched : false meaning search text coming from prop
    if (_zoom) setLocalZoom(_zoom)
    if (
      geocoding?.searchText !== searchText &&
      !isMarkerDragged &&
      !isMapSearched
    ) {
      updateGeocoding(
        [Number(position?.[0]), Number(position?.[1])],
        geocoding?.searchText,
        bounds, 
        _zoom
      )
    } else {
      updateGeocoding(position, searchText, bounds, _zoom)
    }
    setFocusSearchPlace(true)
  }

  // on LL popup close

  const onhandlePopupClose = (_e: { popup: any }) => {
    handleClosePopup && handleClosePopup(polygon?.popupRef)
  }

  return (
    <GeocodingContext.Provider value={geocodingContextValue}>
      {/* Import the static-styling component of the map required by leaflet */}
      <LeafletStyles />

      {/* This is the main map component */}

      <StyledMap
        createShape={createShape}
        isOpenStreet={configurableOption.isOpenStreet} // show google sign at bottom when google map selected
        showModal={showModal}
        onMouseDown={(e: any) => {
          const isLefaletClassName =
            e?.target?.className &&
            typeof e?.target?.className === 'string' &&
            e?.target?.className?.includes('leaflet')

          if (isLefaletClassName || e?.target?.id === props.id) {
            setShowModal(false)
            // as we get map inside map we are moving flying bound functionality here
            const contextValueMap = mapRef?.current?.contextValue?.map as any
            contextValueMap?.invalidateSize(true)
            contextValueMap?.doubleClickZoom.enable()
            contextValueMap?.boxZoom.enable()
            contextValueMap?.scrollWheelZoom.enable()
            contextValueMap?.dragging.enable()
          }
        }}
      >
        <Map
          ref={mapRef as any}
          id={props.id}
          className={'leafletMap ' + props.classes}
          zoom={orientation.zoom || props.zoom || ZOOM_500M}
          center={orientation.center || props.center}
          style={{
            height: props.height ? props.height : '100%',
            width: props.width ? props.width : '100%',
            background: showModal
              ? '#333'
              : configurableOption.theme === 'dark' &&
                !configurableOption.isOpenStreet
              ? '#18273c'
              : '#ebe9e4'
          }}
          maxNativeZoom={selectedTile === 'google' ? 21 : 19} // this to stop dancing map
          maxZoom={maxZoomConst[selectedTile || 'google'] || 18} // this is to stop blacking out on map
          scrollWheelZoom={false}
          zoomControl={false}
          animate
          useFlyTo={useFlyTo}
          duration={1}
          worldCopyJump={false} // double copy of map restict
          attributionControl={false} // leaflet text in bottom hidding
          onPopupClose={onhandlePopupClose}
        >
          {/* Map settings - map mode, theme,legends,control */}
          {props?.settingConfig && (
            <SettingBox
              onChange={(settingConfigs: any) =>
                setSettingConfig(settingConfigs)
              }
              isOpenStreet={configurableOption.isOpenStreet}
              settingOption={settingConfig}
              showModal={showModal}
              handleShowModal={(showModal: boolean) => setShowModal(showModal)}
              setMarkers={(legend: any) => setMarkers(legend)}
              heatMap={!!configurableOption?.heatmap?.permission}
              settingButtonTitle={props.settingButtonTitle}
              onSettingChange={props?.onSettingChange}
              legend={legend}
              setFocusSearchPlace={setFocusSearchPlace}
              geocoding={geocoding}
            />
          )}

          {/* Layers in the map */}
          {/* Geo coding and location search layer */}
          <LeafletGeocodingLayer
            {...props}
            position={[props.geocoding?.lat, props.geocoding?.lng]}
            geocoding={geocoding}
            onLocationSelect={onLocationSelect}
            settingConfig={settingConfig}
            focusSearchPlace={focusSearchPlace}
            setIsMarkerDragged={setIsMarkerDragged}
            setIsMapSearched={setIsMapSearched}
            zoomLGC={localZoom}
            theMap={mapRef}
          />
          {/* The layer which displays all the buttons on the map */}
          <LeafletControlLayer
            zoomControl={zoomControl}
            google={props.google}
            locationSearch={configurableOption.locationSearch}
            onLocationSelect={onLocationSelect}
            focusSearchPlace={focusSearchPlace}
            setIsMarkerDragged={setIsMarkerDragged}
            isMarkerDragged={isMarkerDragged}
            setSearchFieldAddressInfo={setSearchFieldAddressInfo}
            setIsMapSearched={setIsMapSearched}
            isMapSearched={isMapSearched}
          />
          {/* The base layer which will display the map tiles underneath */}
          {props.google && _isShowTileLayer && (
            <LeafletTileLayer
              googleApiKey={props.googleApiKey}
              tiles={configurableOption.tiles as tTiles}
              poi={!!configurableOption.poi}
              theme={configurableOption.theme as tTheme}
              orientation={orientation}
              traffic={configurableOption.traffic}
              rulerControl={!!configurableOption.rulerControl}
            />
          )}

          {/* The marker layer which will display all the markers and marker clusters */}
          {(markerConfig?.permission ||
            configurableOption?.heatmap?.permission) &&
            !props.trips?.permission && (
              <LeafletMarkerLayer
                iconsRef={props.iconsRef}
                popupRef={props.popupRef}
                marker={markerConfig}
                google={props.google}
                geocoding={geocoding}
                updateMarkers={(legends: any) => {
                  setFocusSearchPlace(false)
                  // legend change has to be saved ,so that we can update it into settings
                  setLegend && setLegend(legends)
                  setLegendModel &&
                    setLegendModel(convertArrayToObject(legends))

                  // legends gets changed in marker layer, we update our marker layer based on new legends
                  const newMarker =
                    markerConfig &&
                    setLegendMarkers(deepCopy(legends), deepCopy(markerConfig))

                  setmarkerConfig && setmarkerConfig(newMarker)
                }}
                showModal={showModal}
                legendModel={legendModel}
                focusMarkerId={props.focusMarkerId}
                heatMap={!!configurableOption?.heatmap?.permission}
                focusSearchPlace={focusSearchPlace}
                showLegendWrapper={showLegendWrapper}
              />
            )}

          {/* The heat layer which will display all the heatmap */}
          {configurableOption?.heatmap?.permission && (
            <LeafletHeatLayer
              legend={legend}
              heatmap={configurableOption?.heatmap}
              heatMapData={heatmap?.data}
            />
          )}
          {/* The trips layer which will display all the path */}
          {props.trips?.permission &&
            (props.trips?.data?.length > 0 &&
            !props?.trips?.noSelectedRows?.permission ? (
              <LeafletTripsLayer
                {...props}
                {...configurableOption}
                showModal={showModal}
                heatMap={!!configurableOption.heatmap}
                focusSearchPlace={focusSearchPlace}
              />
            ) : props?.trips?.noSelectedRows?.permission ? (
              <LeafletOverlay
                title={props?.trips?.noSelectedRows?.title}
                showArrow={props?.trips?.noSelectedRows?.showArrow}
                showCloseIcon={props?.trips?.noSelectedRows?.showCloseIcon}
              />
            ) : null)}
          {/* The tracking layer which will display all the tracking */}
          {props.tracking?.permission && (
            <LeafletTrackingLayer {...props} {...configurableOption} />
          )}
          {/* Leaflet layer polygon */}
          {configurableOption.polygon?.permission && (
            <LeafletPolygonLayer
              polygon={configurableOption.polygon}
              popupRef={popupRef} // object to map popupRef
              google={props.google}
              createShape={createShape}
              setCreateShape={setCreateShape}
              editPopUpComponent={editPopUpComponent}
              onEdit={onEdit}
              popupCustomComponent={popupCustomComponent}
            />
          )}
          {configurableOption.circle?.permission && (
            <LeafletCircleLayer
              circle={configurableOption.circle} // circle with -data,permission,tooltipKey,popupRefType
              popupRef={popupRef} // object to map popupRef
              google={props.google} // google, for geocoder location find
              createShape={createShape}
              setCreateShape={setCreateShape}
              editPopUpComponent={editPopUpComponent}
              onEdit={onEdit}
            />
          )}
        </Map>
      </StyledMap>
    </GeocodingContext.Provider>
  )
}
const LeafletMap = GoogleApiWrapper((props: ILeafletMapPropsLite) => ({
  apiKey: props.googleApiKey
}))(LeafletMapWrapper)
// default props for the leaflet map
LeafletMap.defaultProps = {
  height: '400px',
  width: '700px',
  theme: 'light',
  poi: false,
  center: [51.0, 19.0],
  zoom: 4,
  zoomControl: true,
  locationSearch: true,
  tiles: 'google_roadmap'
} as Partial<ILeafletMapPropsLite>

export default LeafletMap
