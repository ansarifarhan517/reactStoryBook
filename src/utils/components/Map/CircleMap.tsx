import React, { useEffect, useMemo, useState } from "react";
import { LeafletMap, useToast } from "ui-library"
import markerIcons from "../../map/icon.config"
import infowindowConfig from "../../map/infowindow.config"
import withRedux from '../../redux/withRedux';
// import  { LatLngExpression } from 'leaflet';
import { settings } from './settings'
import { StyledMapDiv } from './StyledMap';
import apiMappings from '../../apiMapping';
import axios from '../../axios';
import { ICircle, ICustomControlProps, IOption, IPolygon, ISetting, ISettingConfigData, tMapButton, tMapSource, tMapTheme, tMarkerMode, tTiles } from './interface';
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import NoMapView from './NoMapView';
import { deepCopy } from '../../helper';
import { getGoogleAPIKey } from "./MapHelper";
import { LatLngExpression, Map } from 'leaflet';
import { MapWrapper } from "../../../modules/Checkpoints/CheckpointsListView/CheckpointsListViewStyledComponent";
import { ButtonList } from "../../../modules/Terriotory/TerritoryListView/SubComponents/Popups/ButtonList";
import { FeatureGroup } from "react-leaflet";
import { IGeocodingError } from "../../../modules/Checkpoints/CheckpointsForm/CheckpointsForm.models";

export type tVariant = 'button' | 'link'

interface ICircleMap {
    type: string
    settingAPIParam: string
    circleData: ICircle
    polygonData: IPolygon
    handleMapEdit: Function
    geocoding?: boolean
    position?: [number, number]
    radius?: number
    setMapProps?: React.Dispatch<React.SetStateAction<Map>>
    setFeatureGroupProps?: React.Dispatch<React.SetStateAction<FeatureGroup>>
    setLocationSearched?: React.Dispatch<React.SetStateAction<string>>
    editCheckpoint?: Function
    deleteCheckpoint?: Function
    center?: LatLngExpression
    setErrorGeocoding?: React.Dispatch<React.SetStateAction<IGeocodingError>>

}

type ICustomControlType = { allowCustomControl?: false, customControlProps?: never } | { allowCustomControl: true, customControlProps: ICustomControlProps }

type mapProps = ICircleMap & ICustomControlType;


const CircleMapComponent = ({ 
    type,
    settingAPIParam,
    circleData,
    polygonData,
    handleMapEdit,
    geocoding = false,
    position,
    radius,
    allowCustomControl,
    customControlProps,
    setMapProps,
    setFeatureGroupProps,
    setLocationSearched,
    editCheckpoint,
    deleteCheckpoint,
    center,
    setErrorGeocoding
}: mapProps) => {

    /** Redux Hooks */

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING[type])
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)
    const GOOGLE_API_KEY = getGoogleAPIKey();


    const settingLabels = { ...popupDynamicLabel, ...dynamicLabels }

    const settingObj: ISettingConfigData = {
        locationSearch: true,
        mapSource: "google" as tMapSource,
        mapTheme: "day" as tMapTheme,
        markerMode: "marker" as tMarkerMode,
        osm: false,
        poi: false,
        rulerControl: false,
        terrain_google: true,
        traffic: false,
        transit: false,
        polygonMaker: true,
        circleMaker: true,
    }
    const themeMapping = {
        'dark': 'night',
        'light': 'day'
    }
         

    // map loading which we are starting from mounting mapdefault and we are setting it false when we done with our settingbox model creation.
    const [mapLoading, setMapLoading] = useState(true);
    const [settingConfig, setSettingsConfig] = useState<ISetting>(settings(settingLabels));


    const [tileSubOptionLayer, settileSubOptionLayer] = useState<tTiles>('google_roadmap')
    const [settingConfigData, setSettingConfigData] = useState<any>(settingObj)
    // this is to ensure we create settingbox model from settingconfig data which we get from api 
    const [settingFetched, setSettingFetched] = useState<boolean>(false)


    const toast = useToast()

    //this call needs to be called only once
    useEffect(() => {
        getSetting();
    }, []);


    // whenevr this call gets update ,update setttingconfig -only once
    //settingConfigData- data coming from api, whenever it gets change,change  our settingConfig(setting box data) accordingly
    // even though selected row gets change.again create a setting for them with plotting new markers 
    useEffect(() => {
      updateSettings();
    }, [settingConfigData, setSettingsConfig])

    const getSetting = async () => {
        setMapLoading(true)
        try {
            const { data: { data: resultData } } = await axios.get(`${apiMappings.common.getSettings}${settingAPIParam}`);
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
                } else if (entry.name === 'Location Search') {
                    entry.selected = settingConfigData.locationSearch
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
            } else if (entry.name === 'Location Search') {
                settingConfigData.locationSearch = entry.selected
            }
        })
        
        if (type === 'save') {
            try {
                const { data } = await axios.put(`${apiMappings.common.saveSettings}${settingAPIParam}`, { data: settingConfigDataClone })
                if (data || data?.status === 200) {
                    // once you save in db, just rerender the model with new values
                    setSettingConfigData(settingConfigDataClone)
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

    const renderMapViewButtons = (selectedData?: any) => {
        if (showDeleteConfirmation) {
            return [
                {
                    variant: 'button',
                    children: 'Delete',
                    iconVariant: 'icomoon-delete-empty',
                    primary: true,
                    onClick: () => { deleteCheckpoint?.(selectedData) }
                },
                {
                    variant: 'button',
                    children: 'Cancel',
                    iconVariant: 'icomoon-close',
                    onClick: () => { setShowDeleteConfirmation(false) }
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
                    onClick: () => { editCheckpoint?.(selectedData); }
                },
                {
                    variant: 'button',
                    children: 'Delete',
                    iconVariant: 'icomoon-delete-empty',
                    // intent: 'table' as tIntent,
                    onClick: () => { setShowDeleteConfirmation(true) }
                }
            ]
        }
    }


    const customFields = useMemo(() => [{ name: "radius", value: radius, placeholder: "Radius (meters)", type: "number" }] ,[radius]);

    return (
        <StyledMapDiv loading={false as boolean} className="map_pane live_pane live_pane_v2" style={{ flexGrow: 100, flexShrink: 100 }}>
          {!mapLoading ? 
                <MapWrapper>
                    <LeafletMap
                        setMapProps={setMapProps}
                        setFeatureGroupProps={setFeatureGroupProps}
                        useFlyTo={true}
                        id="leafletBaseMap"
                        markers={{ permission: false }}
                        circle={{ ...circleData, popupRef: showDeleteConfirmation ? "checkpointsDeletePrompt" : "checkpointsCircle" }}
                        polygon={{ ...polygonData, popupRef: showDeleteConfirmation ? "checkpointsDeletePrompt" : "checkpointsPolygon" }}
                        heatmap={{ permission: false }}
                        iconsRef={markerIcons}
                        googleApiKey={GOOGLE_API_KEY}
                        // google tile layer
                        tiles={tileSubOptionLayer}
                        popupRef={infowindowConfig}
                        width='100%'
                        center={[center?.[0], center?.[1]]}
                        height='100%'
                        zoomControl
                        settingConfig={settingConfig}
                        latLngBounds={[center?.[0], center?.[1]]}
                        onSettingChange={(newSetting: any, type: tMapButton) => handleSettingSave(newSetting, type)}
                        //toggles
                        poi={settingConfigData.poi}
                        locationSearch={settingConfigData.locationSearch}
                        traffic={settingConfigData.traffic}
                        rulerControl={settingConfigData.rulerControl}
                        zoom={4}
                        theme={settingConfigData.mapTheme === 'night' ? 'dark' : 'light'}
                        onEdit={(data) => handleMapEdit(data)}
                        // sendLocationOutside={(data) => { onLocationSearch(data) }}
                        geocoding={{
                            permission: geocoding,
                            /** If you are passing searchText, ensure to pass the position prop as well. */
                            searchText: "",
                            shouldUpdateShape: true,
                            disableDefaultFlyToBounds: true,
                            customFields: customFields,
                            position: geocoding ? position : undefined,
                            setErrorGeocoding: setErrorGeocoding,
                            // onGeocodingSave: (e: any) => { },
                            // onGeocodingDragEnd: (pos: [number, number]) => { },

                        }}
                        handleClosePopup={(popupRef?: string) => {
                            setTimeout(() => {
                                if (popupRef === "checkpointsDeletePrompt") {
                                    setShowDeleteConfirmation(false);
                                } 
                            },100)
                        }}
                        popupCustomComponent={{
                            tooltipButton: ({ selectedData }: any) => (
                                <ButtonList
                                    listOfButtons={renderMapViewButtons(selectedData)}
                                />
                            )
                        }}
                        allowCustomControl={allowCustomControl}
                        customControlProps={customControlProps}
                        setLocationSearched={setLocationSearched}
                    />
                </MapWrapper>
              : <NoMapView />
            }
        </StyledMapDiv>
    )
};




export default withRedux(CircleMapComponent)
