import { GoogleAPI } from 'google-maps-react'
import { LatLngBoundsExpression, LatLngExpression, Map } from 'leaflet'
import { tMapButton } from '../SettingBox/interface'
import { tTheme, tTiles } from './types.d'
import React from 'react';
import { FeatureGroup } from 'react-leaflet';

// This is the main interface of the LeafletMap component we have
// It will be inherited in main map component + children components of the map

export interface IMapData {
  permission: boolean
  entities?: string[]
  entitiesMap?: { [name: string]: IEntity }
}

export interface IEntity {
  permission: boolean
  label?: string
  id?: any
  legends?: string[]
  legendsMap?: { [name: string]: IStatus }
  markers: IMarkers
}
export interface IMarkers {
  list: any
  metaData?: any
}
export interface IStatus {
  value: boolean
  checked: boolean
  id: any
  permission: boolean
  iconRef: string
  color: string
  popupRef: string
  allow: (metadata: any) => boolean
}
interface ILeafletMapProps {
  // (required) identifier of the map
  id: string

  // google map API reference
  google: GoogleAPI

  // (optional) class list to be appended to the map wrapper
  classes?: string

  // (optional) height & width of the map
  height?: string

  // (optional) width of the map
  width?: string

  // (required) the base tile layer - Google or OSM
  tiles?: tTiles

  // optional - the google theme - Light or dark
  theme?: tTheme

  // optional - do we want to show points of interest in map
  poi?: boolean

  // (required) the google API key used by the map for tile layers, geocoding and location search
  googleApiKey: string

  // (optional) the Here maps API key to be used
  heremapsApiKey?: string

  // (optional) the HERE maps object
  heremapsObject?: object
  
  // (optional) mode of travel selected during trip planning
  modeOfTravel?: string
  

  // (optional) showing markers on the map, this is the layer which will take care of that
  markers?: any

  // (optional) showing heatmap on the map, this is the layer which will take care of that
  heatmap?: any

  // to show the trips on the map
  trips?: any

  // to show the tracking on the map
  tracking?: any

  // (optional)  lat lang for center
  center?: LatLngExpression

  // lat lng bounds for the current viewport
  latLngBounds?: LatLngBoundsExpression

  // (optional) default zoom of the map
  zoom?: number

  position?: LatLngExpression

  getLatLong?:(value: Array<number>) => void

  // (optional) want zoom buttons on the map
  zoomControl?: boolean

  // (optional) location search on the map
  locationSearch?: boolean

  geocoding?: any

  shouldReverseGeocode?: boolean

  iconsRef?: any

  popupRef?: any

  settingConfig?: any

  legend?: any

  legendModel?: any

  marker?: any

  circle?: ICircle

  rulerControl?: boolean

  currentPage?: string

  traffic?: boolean

  // the markerId which the map should focus on/open a popup by default
  focusMarkerId?: string

  editPopUpComponent?: ({ map }: any) => React.ReactNode

  popupCustomComponent?: any

  setLegend?: (legend: any) => void
  markerConfig?: IMapData
  setmarkerConfig?: (markerConfig: IMapData) => void

  configurableOption?: any
  setSettingConfig?: (setting: any) => void
  // this is to show polygon on map
  polygon?: IPolygon
  // On suggested location select
  onLocationSelect?: (
    position: any,
    searchText?: any,
    isMarkerDragged?: boolean,
    bounds?: any,
    zoom?: any
  ) => void
  // setting button hover title
  settingButtonTitle?: string
  isShowMapTileLayer?: boolean
  onSettingChange?: (newSetting: any, type: tMapButton) => void

  onEdit?: (data: IEditedData) => void // in edit polygon and circle
  onGeocodingSave?: () => void
  onGeocodingDragEnd?: (position: [number, number]) => void
  onGeocodingReset?: () => void
  onGeocodingCancel?: () => void
  sendLocationOutside?: (
    searchFieldAddressInfo: tSearchFieldAddressInfo
  ) => void
  handleClosePopup?: (popupRef?: string) => void
  showLegendWrapper?: boolean
  useFlyTo?: boolean
  //(optional) - allow custom components to be added to the map
  allowCustomControl?: boolean
  //(optional) - props for the custom component
  customControlProps?: ICustomControlProps
  //(optional) - map control props
  setMapProps?: React.Dispatch<React.SetStateAction<Map>>
  //(optional) - featureGroup props for circle/polygon
  setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
  //(optional) - location searched using search input
  setLocationSearched?: React.Dispatch<React.SetStateAction<string>>
}

export interface ICustomControlProps {
  position?: L.ControlPosition
  children?: React.ReactNode
  container?: React.HTMLAttributes<HTMLDivElement>
  prepend?: boolean
}

export interface IEditedData {
  coordinates: any[]
  originalCoordinates: any[]
  isChanged: boolean
  isIntersection?:boolean
  previousCoordinates?:any[]

}

export interface IPolygon {
  permission: boolean
  data: any
  popupRef: string
  toolTipKey: string
  positionCoordinateKey: string
  createPermission?: boolean
  editLayer?: editLayer
  colorKey?: string
  styleKey?: IStyle
}
interface editLayer {
  data: any
  permission: boolean
  newCoordinateKey?: string
  orinalCoordinatesKey?: string
}

// Lighter interface for exposed leaflet map
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export interface ILeafletMapPropsLite
  extends Omit<ILeafletMapProps, 'google'> {}

export default ILeafletMapProps

export interface ICircle {
  permission: boolean
  data: any
  popupRef: string
  toolTipKey: string
  center: string[]
  colorKey?: string
  radiusKey?: string
  createPermission?: boolean
  editLayer?: editLayer
  styleKey?: IStyle
}
export interface IStyle {
  weight?: string
  fillColor?: string
  fillOpacity?: string
  dashArray?: string
  smoothFactor?: string
}

export type tGeocoding = {
  permission: boolean
  position: [number, number]
  searchText: string
  isSave?: boolean
  disableDefaultFlyToBounds?: boolean
  shouldUpdateShape?: boolean
  customFields?: ICustomField[]
  setErrorGeocoding?: React.Dispatch<React.SetStateAction<{lat: boolean, lng: boolean}>>
}

export interface ICustomField {
  name: string;
  placeholder: string;
  type: string;
  value: any;
}

export type tSearchFieldAddressInfo = {
  apartment?: string
  streetName?: string
  landMark?: string
  locality?: string
  state?: string
  city?: string
  pincode?: string
  country?: string
  registeredCountryIsoCode?: string
  position?: any
  isPropSearch?: boolean
  searchText?: string
}
