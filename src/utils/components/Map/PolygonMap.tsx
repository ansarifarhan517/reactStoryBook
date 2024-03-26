import React, { useEffect, useState } from "react";
import { LeafletMap, useToast } from "ui-library"
import markerIcons from "../../map/icon.config"
import infowindowConfig from "../../map/infowindow.config"
import withRedux from '../../redux/withRedux';
// import  { LatLngExpression } from 'leaflet';
import { settings } from './PolygonSettings'
import { PolygonMap } from './StyledMap';
import apiMappings from '../../apiMapping';
import axios from '../../axios';
import { IOption, ISetting, tMapButton, tMapSource, tMapTheme, tTiles } from './interface';
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import NoMapView from './NoMapView';
import { deepCopy } from '../../helper';
import EditPopUp from "../../../modules/Terriotory/TerritoryListView/SubComponents/Popups/EditPopup";
import { ButtonList } from "../../../modules/Terriotory/TerritoryListView/SubComponents/Popups/ButtonList";


interface IPolygonMap {
    type: string
    settingAPIParam: string
    mapSetting?: any
    geocoding?: {
        permission: boolean
        position: [number, number]
        searchText: string
    },
    polyGeoFenceData: any
    editTerritory: Function
    deleteTerritory: Function
    rowsSelector?: any
    zoom?:number
    polygonCenter?:[number, number]
    customPopupRef?:string //to show which details to be shown on pupup
    hideEditDeleteOnPopup?:boolean // to hide edit delete option on popup
}

export type tVariant = 'button' | 'link'


const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const PolygonMapComponent = ({ type, settingAPIParam, mapSetting, polyGeoFenceData, editTerritory, deleteTerritory, rowsSelector, zoom, polygonCenter, customPopupRef, hideEditDeleteOnPopup=false }: IPolygonMap) => {

    /** Redux Hooks */

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING[type])
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)
    const googleKey = 'AIzaSyCjiaID1JW2sH7unnqrtsIlopaCU959-GA'


    const settingLabels = { ...popupDynamicLabel, ...dynamicLabels }
    const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const _center = userAccessInfo?.['countryLatLng']?.split(",").map((x:string)=>parseFloat(x)) || FALLBACK_CENTER

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    const [polyGeoFenceSampleData, setPolyGeoFenceSampleData] = useState<any>({
        permission: true,
        data: polyGeoFenceData,
        popupRef: customPopupRef ?  customPopupRef : (showDeleteConfirmation ? 'territory': 'territoryList'),
        toolTipKey: 'geofenceName',
        colorKey: 'color',
        positionCoordinateKey: 'polygonCoordinates',
        createPermission: true,
        styleKey: {
        smoothFactor: 'smoothFactor',
        fillColor: 'fillColor',
            fillOpacity: 'fillOpacity',
        }
    })

    const settingObj = {
        locationSearch: true,
        mapSource: "google" as tMapSource,
        mapTheme: "night" as tMapTheme,
        osm: false,
        poi: false,
        rulerControl: true,
        terrain_google: true,
        traffic: false,
        transit: false,
        polygonMaker: true,
    }
    const themeMapping = {
        'dark': 'night',
        'light': 'day'
    }

    useEffect(() => {
        let sampleDate: object = {
            permission: true,
            data: polyGeoFenceData,
            popupRef:customPopupRef ?  customPopupRef : (showDeleteConfirmation ? 'territory' : 'territoryList'),
            toolTipKey: 'geofenceName',
            positionCoordinateKey: 'polygonCoordinates',
            createPermission: false,
            styleKey: {
                smoothFactor: 'smoothFactor',
                fillColor: 'fillColor',
                fillOpacity: 'fillOpacity'
            }
        }

        if (polyGeoFenceData?.length !== rowsSelector?.length) {
            sampleDate = { ...sampleDate, styleKey: { fillColor: undefined } }
        }
        setPolyGeoFenceSampleData(sampleDate)
    }, [polyGeoFenceData, showDeleteConfirmation])
         

    // map loading which we are starting from mounting mapdefault and we are setting it false when we done with our settingbox model creation.
    const [mapLoading, setMapLoading] = useState(true);
    // const [center, setCenter] = useState<number[]>(FALLBACK_CENTER);
    const [settingConfig, setSettingsConfig] = useState<ISetting>(mapSetting || settings(settingLabels));


    const [tileSubOptionLayer, settileSubOptionLayer] = useState<tTiles>('google_roadmap')
    const [settingConfigData, setSettingConfigData] = useState<any>(settingObj)
    // this is to ensure we create settingbox model from settingconfig data which we get from api 
    const [settingFetched, setSettingFetched] = useState<boolean>(false)


    const toast = useToast()

    if (infowindowConfig?.[type].definitions['_deleteComponent'].html) {
        infowindowConfig[type].definitions['_deleteComponent'].html = () => (
            <div>{`${dynamicLabels.deleteGeofenceDisclaimer} ${dynamicLabels.deleteGeofenceConfirm}`}</div>
        )
    }


    //this call needs to be called only once
    useEffect(() => {
        getSetting()
    }, [])


    // whenevr this call gets update ,update setttingconfig -only once
    //settingConfigData- data coming from api, whenever it gets change,change  our settingConfig(setting box data) accordingly
    // even though selected row gets change.again create a setting for them with plotting new markers 
    useEffect(() => {
        updateSettings()
    }, [settingConfigData, setSettingsConfig])

    const getSetting = async () => {
        setMapLoading(true)
        try {
            const { data: { data: resultData } } = await axios.get(`${apiMappings.common.getSettings}${settingAPIParam}`)
            setSettingFetched(true)
            setSettingConfigData(resultData)

        } catch (errorMessage) {
            // if in case api fails, show default one
            setSettingFetched(true)
            // create a new reference of newObj so that our component rerenders
            setSettingConfigData(deepCopy(settingObj))
        }

    }

    const updateSettings = async () => {
        // setting fetched from api
        if (settingConfigData && settingFetched) {
            const keys = Object.keys(settingConfigData)
            let selectedTileLayer = ''
            keys.forEach((key: string) => {
                const keySplit = key.split('_')
                if (keySplit.length === 2 && (key.includes('google') || key.includes('osm'))) {
                    const newTileLayerName = `${keySplit[1]}_${keySplit[0]}`
                    selectedTileLayer = newTileLayerName
                    settileSubOptionLayer(newTileLayerName as tTiles)
                }
            })

            const configClone = deepCopy(settingConfig)

            // in setting google is already selected.so only if mode not equal to google then only change

            configClone['Map Type'].option.forEach((mode: any) => {
                if (settingConfigData.mapSource === 'google') {
                    if (mode.name === 'Google') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                } else {
                    if (mode.name === 'Open Street Maps') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                }
            })


            // in setting theme day is already selected.so only if mode not equal to day then only change

            configClone['Map Theme'].option.forEach((mode: any) => {
                if (settingConfigData.mapTheme === 'day') {
                    if (mode.name === 'Day') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                } else {
                    if (mode.name === 'Night') {
                        mode.selected = true
                    } else {
                        mode.selected = false
                    }
                }
            })

            // google,osm - mode
            configClone['Map Type'].option.forEach((mode: any) => {
                mode?.subOptions?.forEach((suboption: any) => {
                    if (settingConfigData.mapSource === 'google') {
                        // if selected tile layer from google then only for suboptions google select suboption and remianing set to false
                        if (selectedTileLayer.includes('google') && mode?.id === 'google') {
                            if (suboption.id === selectedTileLayer) {
                                suboption.selected = true
                            } else {
                                suboption.selected = false
                            }
                        }

                    } else if (settingConfigData.mapSource === 'osm') {
                        // if selected tile layer from osm then only for suboptions osm select suboption and remianing set to false
                        if (selectedTileLayer.includes('osm') && mode?.id === 'osm') {
                            if (suboption.id === selectedTileLayer) {
                                suboption.selected = true
                            } else {
                                suboption.selected = false
                            }
                        }
                    } else {
                        // if sub option is google then it will go to first if and for osm layer all sub option select false
                        // same ways if sub option is osm then it will go to second if and for google layer all sub option select false
                        suboption.selected = false

                    }
                })

            })

            configClone['Miscellaneous'].option.find((entry: any) => {
                if (entry.name === 'Point of interest') {
                    entry.selected = settingConfigData.poi
                } else if (entry.name === 'Traffic') {
                    entry.selected = settingConfigData.traffic
                } else if (entry.name === 'Ruler Control') {
                    entry.selected = settingConfigData.rulerControl
                }
            })



            // setCenter((_center[0], _center[1]));
            setSettingsConfig(deepCopy(configClone))
            setMapLoading(false);

        }

    }

    const onSaveChange = async (setting: ISetting, type: tMapButton) => {
        //const setting = Object.assign({}, settingConfig)
        const settingConfigDataClone: any = {
            actualRoute: true,
            circleMaker: false,
            geocoder: false,
            locationSearch: true,
            overspeedViolation: false,
            plannedRoute: false,
            polygonMaker: false,
            showAllGeofences: false,
            showTrackingPoints: false,
            speedSensitivePoints: false,
            transit: false
        }
        //google , osm
        const mapSource = setting['Map Type'].option.find((entry: any) => entry.selected)
        const googleSubOptions = setting['Map Type'].option[0]?.subOptions
        const osmSubOptions = setting['Map Type'].option[1]?.subOptions
        settingConfigDataClone.mapSource = mapSource?.id
        if (mapSource?.id === 'osm') {
            settingConfigDataClone.osm = true
            settingConfigDataClone.google = false
            const selectedOption = osmSubOptions?.find((subOpt: any) => subOpt.selected)
            const keySplit = selectedOption?.id?.split('_')
            const newTileLayerName = `${keySplit?.[1]}_${keySplit?.[0]}`
            //roadmap_google=true
            settingConfigDataClone[newTileLayerName] = true
        } else {
            settingConfigDataClone.google = true
            settingConfigDataClone.osm = false
            const selectedOption = googleSubOptions?.find((subOpt: any) => subOpt.selected)
            const keySplit = selectedOption?.id?.split('_')
            const newTileLayerName = `${keySplit?.[1]}_${keySplit?.[0]}`
            settingConfigDataClone[newTileLayerName] = true
        }

        // day ,night
        const mapTheme = setting['Map Theme'].option.find((entry: IOption) => entry.selected)
        if (mapTheme?.id) {
            settingConfigDataClone.mapTheme = themeMapping[mapTheme?.id]
        }

        setting['Miscellaneous'].option.find((entry: IOption) => {
            if (entry.name === 'Point of interest') {
                settingConfigDataClone.poi = entry.selected
            } else if (entry.name === 'Traffic') {
                settingConfigDataClone.traffic = entry.selected
            } else if (entry.name === 'Ruler Control') {
                settingConfigDataClone.rulerControl = entry.selected
            }
        })
        if (type === 'save') {
            try {
                const { data } = await axios.put(`${apiMappings.common.saveSettings}${settingAPIParam}`, { data: settingConfigDataClone })
                if (data || data?.status === 200) {
                    console.log('data.........', data)
                    // once you save in db, just rerender the model with new values
                    setSettingConfigData(settingConfigDataClone)
                    //  setShowModal(false)
                    toast.add('Map settings successfully saved.', 'check-round', false)
                    return
                }
                else {
                    toast.add(data.message, 'warning', false)
                }
            } catch (errorMessage) {
                toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)

            }
        } else {
            // on only apply dont save in db jst change config and accordigly make settingconfig object
            setSettingConfigData(settingConfigDataClone)
        }
    }

    // whenevr user clicks on save/apply settings
    const handleSettingSave = (data: ISetting, type: tMapButton) => {
        onSaveChange(data, type)
    }

    const renderButtons = (selectedData: any) => {
        if(showDeleteConfirmation) {
            return [    
                {
                    variant: 'button' as tVariant,
                    children: 'Delete',
                    // intent: 'table' as tIntent,
                    iconVariant: 'icomoon-delete-empty',
                    primary: true,
                    onClick: () => { deleteTerritory(selectedData) }
                },
                {
                    variant: 'button' as tVariant,
                    children: 'Cancel',
                    iconVariant: 'icomoon-close',
                    // intent: 'table' as tIntent,
                    onClick: () => {setShowDeleteConfirmation(false)}
                }
            ]
        } else {
            return [    
                {
                    variant: 'button' as tVariant,
                    children: 'Edit',
                    // intent: 'table' as tIntent,
                    iconVariant: 'edit',
                    primary: true,
                    onClick: () => { editTerritory(selectedData) }
                },
                {
                    variant: 'button' as tVariant,
                    children: 'Delete',
                    iconVariant: 'icomoon-delete-empty',
                    // intent: 'table' as tIntent,
                    onClick: () => {setShowDeleteConfirmation(true)}
                }
            ]
        }
    }


    return (
        <>
            <PolygonMap className="map_pane live_pane live_pane_v2" style={{ flexGrow: 100, flexShrink: 100 }}>
                {!mapLoading ? <LeafletMap
                    id="leafletBaseMap"
                    markers={{ permission: false }}
                    heatmap={{ permission: false }}
                    iconsRef={markerIcons}
                    googleApiKey={googleKey}
                    // google tile layer
                    tiles={tileSubOptionLayer}
                    popupRef={infowindowConfig}
                    width='100%'
                    center={polygonCenter? polygonCenter : [_center[0], _center[1]]}
                    height='100%'
                    zoomControl
                    settingConfig={settingConfig}
                    latLngBounds={polygonCenter? polygonCenter : [_center[0], _center[1]]}
                    onSettingChange={(data: any, type: tMapButton) => handleSettingSave(data, type)}
                    //toggles
                    poi={settingConfigData.poi}
                    locationSearch
                    traffic={settingConfigData.traffic}
                    rulerControl={settingConfigData.rulerControl}
                    zoom={zoom? zoom : 4}
                    theme={settingConfigData.mapTheme === 'night' ? 'dark' : 'light'}
                    polygon={polyGeoFenceSampleData? polyGeoFenceSampleData: false}
                    editPopUpComponent={({ map }: any) => (
                        <EditPopUp
                          onClick={() => {
                            map.closePopup()
                          }}
                        />
                    )}
                    handleClosePopup={(popupRef?: string) =>  {
                        if (popupRef === 'territory') {
                            setShowDeleteConfirmation(false)
                        }
                    }}
                    popupCustomComponent={!hideEditDeleteOnPopup? {
                    tooltipButton: ({ selectedData }: any) => (
                        <ButtonList
                        listOfButtons={renderButtons(selectedData)}
                        />
                    )
                    }: null}
                /> : <NoMapView />}
            </PolygonMap>
        </>
    )
}




export default withRedux(PolygonMapComponent)
