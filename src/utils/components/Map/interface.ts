import { Map } from "leaflet"
import { ISelectedRows } from "ui-library"
import { IDeliveryRunSheet } from "../../../modules/Trips/Mile/TripsListView/TripsListView.model"

export interface IMap {
    selectedRows?: ISelectedRows
    type: string
    settingAPIParam: string
    setMapData?: (settingConfigData: ISettingConfigData) => IMarkerData
    legendConfig?: ILegendConfig
    setSettingConfigLegnds?: (legendData: ISettingOption, settingConfigData: ISettingConfigData) => ISettingConfigData
    googleApiKey: string
    mapSetting?: ISetting
    geocoding?: boolean
    searchTextData?: string
    position?: any
    getPositions?: (latLogObj: any) => any
    sendLocationOutside?: (searchFieldAddressInfo: tSearchFieldAddressInfo) => void;
    trips?: ITripData,
    showLegendWrapper?: boolean
    entityType?: string
    useFlyTo?:boolean
    isEditMode?:boolean|number,
    isVisibleSetting?: boolean,
    getLatLong?: (value: Array<number>) => void
    circle?: ICircle
    setMapProps?: React.Dispatch<React.SetStateAction<Map>>
    updateShapeBasedOnPosition?: boolean
    heremapsApiKey?: string
    heremapsObject?: Object
    modeOfTravel?: string
    shouldUpdateGeocode?:boolean
    onGeocodingSave?:(e: any) => void
    shouldReverseGeocode?: boolean
    currentPage?: string
}


export interface ITripData {
    permission: boolean,
    config: {
        mode: string,
        animation: string,
        color: string,
        weight: number,
        opacity: number,
        dashArray: Array<string>,
        pulseColor: string,
        delay: number,
        smoothFactor: number,
        backToStart: boolean,
        popupRef: string
    },
    data: Array<{
        title: string,
        id: string,
        tripNo: string,
        startTime: string,
        delayedBy: string,
        endTime: string,
        waypoints: Array<{
            id: number,
            position: Array<number>,
            title: string,
            type: string,
            iconRef: string,
            popupRef: string,
            sequence?: number
        }>
    }>,
    showLegendWrapper?: boolean,
    metaData: {
        [key: number]: IDeliveryRunSheet
    },
    noSelectedRows: {
        permission?: boolean,
        title?: string,
        showArrow?: boolean,
        showCloseIcon?: boolean
    }
}
interface ILegendConfig {
    [key: string]: any
}
export type tMapButton = 'apply' | 'save'

export interface ISettingConfigData extends ILegendConfig {
    locationSearch: boolean
    mapSource: "google" | "osm"
    mapTheme: "night" | "day"
    markerMode: "markers" | "heatmap"
    osm: boolean
    poi: boolean
    rulerControl: boolean
    terrain_google: boolean
    traffic: boolean
    transit: boolean
}
export interface ISettingOption {
    title: string
    type: string
    option: Array<IOption>
    permission?: boolean,
    label?: string
}
export interface IOption {
    name?: string
    selected?: boolean
    image?: any
    disabled?: boolean
    subOptions?: Array<IOption>
    title?: string
    id?: string
    color?: string
    checked?: boolean
    value?: string
    allow?: any
    permission?: boolean
    extraInfo?: any
    enablingToasterMessage?: string
    disablingToasterMessage?: string
    label?: string
}
export interface ISetting {
    'Map Mode': ISettingOption
    Legends?: ISettingOption
    'Map Type': ISettingOption
    Geofences: ISettingOption
    'Map Theme': ISettingOption
    Miscellaneous: ISettingOption
}

interface subProps {
    value?: string
    checked?: boolean
    permission: boolean
    iconRef?: string
    color?: string
    popupRef?: string
    allow?: (data: any) => boolean
    extraInfo?: string
    id: any
    disabled?: boolean
    image?: any
}
interface IMarkersProps {
    list: Record<string, any>
    metaData: Record<string, string>
}
interface ILgendsMap {
    [key: string]: subProps
}
interface IEntityMap {
    [key: string]: {
        permission: boolean
        label: string
        id: any
        legends: string[]
        legendsMap: ILgendsMap
        markers?: IMarkersProps
    }
}
export interface IMarkerData {
    permission: boolean
    entities: string[]
    entitiesMap: IEntityMap
}

export type tSearchFieldAddressInfo = {
    apartment?: string
    streetName?: string
    landMark?: string
    locality?: string
    stateId?: string
    state?:string
    stateName?:string
    city?: string
    pincode?: string
    country?: string
    registeredCountryIsoCode?: string
    position?: any
    isPropSearch?: any
}


export type tMapSource = "google" | "osm"
export type tMapTheme = "night" | "day"
export type tMarkerMode = "markers" | "heatmap"
export type tTiles =
    | 'osm_standard'
    | 'google_satellite'
    | 'google_roadmap'
    | 'google_terrain'
    | 'google_hybrid'
    | 'osm_humanitarian'
    | 'osm_cycle'
    | 'osm_transport'

export type tPopupRef =
    'orderIntransit'
    | 'dbIntransit'
    | 'tripIntransit'
    | 'orderTracking'
    | 'drivers'
    | 'deliveryMedium' | 'order'
    | 'deliveryMedium'
    | 'branch'
    | 'trackers'

export type tIconRef =
    'orderIntransit'
    | 'dbIntransit'
    | 'hub'
    | 'tracking'
    | 'lastTracking'
    | 'simpleBlue'
    | 'simpleRed'
    | 'simpleYellow'
    | 'locationSearch'

export interface IStyle {
    weight?: string;
    fillColor?: string;
    fillOpacity?: string;
    dashArray?: string;
    smoothFactor?: string;
}

interface editLayer {
    data: any;
    permission: boolean;
    newCoordinateKey?: string;
    orinalCoordinatesKey?: string;
}

export interface ICircle {
    permission: boolean;
    data: any;
    popupRef: string;
    toolTipKey: string;
    center: string[];
    colorKey?: string;
    radiusKey?: string;
    createPermission?: boolean;
    editLayer?: editLayer;
    styleKey?: IStyle;
    onEdit?: any,
    getPositions?: Function,
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

export interface ICustomControlProps {
    position: L.ControlPosition
    children?: React.ReactNode
    container?: React.HTMLAttributes<HTMLDivElement>
    prepend?: boolean
}
