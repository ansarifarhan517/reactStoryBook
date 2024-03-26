import React, { useEffect, useState } from "react";
import { LeafletMap, useToast } from "ui-library"
import markerIcons from "../../map/icon.config"
import infowindowConfig from "../../map/infowindow.config"
import withRedux from '../../redux/withRedux';
import { updateSettingsWithLegends } from './MapHelper';
import L, { LatLngExpression } from 'leaflet';
import { settings } from './settings'
import { StyledMapDiv, StyledText } from './StyledMap';
import apiMappings from '../../apiMapping';
import axios from '../../axios';
import { IMap, IOption, ISetting, ISettingConfigData, tMapButton, tSearchFieldAddressInfo, tTiles } from './interface';
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import NoMapView from './NoMapView';
import { deepCopy } from '../../helper';



const FALLBACK_CENTER = new L.LatLng(37.09024, -95.71289100000001);
const onGeocodingSaveDefault = (e: any) => { window.alert("Geocodes Saved " + e.position?.[0] + ", " + e.position?.[1]); };


const DefaultMap = ({ useFlyTo=true,selectedRows, type, settingAPIParam, setMapData, legendConfig, getPositions, setSettingConfigLegnds, googleApiKey, mapSetting, geocoding, searchTextData, position, sendLocationOutside, showLegendWrapper = true, entityType = "orders", trips, isEditMode, isVisibleSetting = true, getLatLong, circle, setMapProps, updateShapeBasedOnPosition, heremapsApiKey, heremapsObject, modeOfTravel, onGeocodingSave = onGeocodingSaveDefault, shouldUpdateGeocode = false, shouldReverseGeocode=false, currentPage=''}: IMap) => {

    /** Redux Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING[type])
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)


    const settingLabels = { ...popupDynamicLabel, ...dynamicLabels }
    const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const _center = position || userAccessInfo?.['countryLatLng']?.split(",") || [37.09024, -95.71289100000001]
    const settingObj = {
        locationSearch: true,
        mapSource: "google",
        mapTheme: "day",
        markerMode: "markers",
        osm: false,
        poi: false,
        rulerControl: true,
        terrain_google: true,
        traffic: false,
        transit: false,
    }
    // here add your legend data {OFFLINE: true, ONLINESTRONG: true, ONLINEWEAK: true} dynamically
    const newObj = { ...settingObj, ...legendConfig } as ISettingConfigData
    const themeMapping = {
        'dark': 'night',
        'light': 'day'
    }

    // map loading which we are starting from mounting mapdefault and we are setting it false when we done with our settingbox model creation.
    const [mapLoading, setMapLoading] = useState(true);
    const [isHeatMap, setIsHeatMap] = useState(false);
    const [markerData, setMarkerData] = useState<any>(undefined)
    const [center, setCenter] = useState<LatLngExpression>(FALLBACK_CENTER);
    const [settingConfig, setSettingsConfig] = useState<ISetting>(mapSetting || settings(settingLabels));


    const [tileSubOptionLayer, settileSubOptionLayer] = useState<tTiles>('google_roadmap')
    const [settingConfigData, setSettingConfigData] = useState<ISettingConfigData>(newObj)
    // this is to ensure we create settingbox model from settingconfig data which we get from api 
    const [settingFetched, setSettingFetched] = useState<boolean>(false)

    const assignedZoom = (typeof isEditMode === "number") ? isEditMode : (isEditMode? 14 : 4)
    const applyZoomProp = (isEditMode !== undefined) ? { zoom: assignedZoom } : { }

    const toast = useToast()

    // we are assigning html
    if (infowindowConfig?.[type].definitions['_thisComponent']?.html) {
        infowindowConfig[type].definitions['_thisComponent'].html = ({ value }: { value: any }) => (
            <StyledText>{`(Tracking Received On ${value} (IST) )`}</StyledText>
        )
    }
    if (infowindowConfig?.[type]?.definitions?.phoneNumber) {
        infowindowConfig[type].definitions.phoneNumber.html = infowindowConfig?.[type] ? (({ value }: { value: any }) => (
            <div style={{ display: 'inline', color: '#0078A8' }} >
                {value ?
                <a href={`tel:+${value}`} >
                    <img src="images/call.svg" style={{ width: '10px', height: '11px', marginRight: '4px', color: '#0078A8' }} />
                    <span style={{ fontWeight: 400, color: '#0078A8' }}>{`+${value}`}</span>
                </a> : 'Not Available'}
            </div>
        )) : null
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
    }, [settingConfigData, setSettingsConfig, selectedRows])

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
            setSettingConfigData(deepCopy(newObj))
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



            configClone['Map Mode'].option.forEach((mode: any) => {
                if (settingConfigData.markerMode === 'markers') {
                    if (mode.name === 'Markers') {
                        mode.selected = true
                        setIsHeatMap(false);
                    } else {
                        mode.selected = false
                    }
                } else {
                    if (mode.name === 'HeatMap') {
                        mode.selected = true
                        setIsHeatMap(true);
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


            const newMarker = settingConfigData && setMapData && setMapData(settingConfigData)
            setCenter(new L.LatLng(Number(_center[0]),Number(_center[1])));

            setMarkerData(newMarker)
            // whenever order data updates, you replot the order markers
            newMarker && updateSettingsWithLegends(configClone, newMarker, 'Legends')
            // create legend on the basis of markers data
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
        //markers,heatmap
        const mapMode = setting['Map Mode'].option.find((entry: IOption) => entry.selected)
        settingConfigDataClone.markerMode = mapMode?.id
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
                settingConfigDataClone.locationSearch = entry.selected
            }
        })
        // new legend data need to map in config( your custom legend data you need to map as per the logic in parent)
        settingConfigDataClone && setSettingConfigLegnds && setting['Legends'] && setSettingConfigLegnds(setting['Legends'], settingConfigDataClone)
        if (type === 'save') {
            try {
                const { data } = await axios.put(`${apiMappings.common.saveSettings}${settingAPIParam}`, { data: settingConfigDataClone })
                if (data || data?.status === 200) {
                    // once you save in db, just rerender the model with new values
                    setSettingConfigData(settingConfigDataClone)
                    //  setShowModal(false)
                    toast.add('Map settings successfully saved.', 'check-round', false)
                    return
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
    
    return (
        <>
            <StyledMapDiv loading={mapLoading} className="map_pane live_pane live_pane_v2" style={{ flexGrow: 100, flexShrink: 100 }}>
                {!mapLoading ? <LeafletMap
                    currentPage={currentPage}
                    useFlyTo={useFlyTo}
                    id="leafletBaseMap"
                    markers={markerData}
                    shouldReverseGeocode={shouldReverseGeocode}
                    iconsRef={markerIcons}
                    googleApiKey={googleApiKey}
                    // google tile layer
                    tiles={tileSubOptionLayer}
                    popupRef={infowindowConfig}
                    width='100%'
                    center={center}
                    height='100%'
                    zoomControl
                    settingConfig={isVisibleSetting ? settingConfig : null}
                    latLngBounds={[_center[0], _center[1]]}
                    onSettingChange={(data: any, type: tMapButton) => handleSettingSave(data, type)}
                    //toggles
                    trips={trips}
                    heatmap={{ data: markerData?.entitiesMap[entityType]?.markers?.list, permission: isHeatMap ? true : false }}
                    poi={settingConfigData.poi}
                    locationSearch={settingConfigData.locationSearch}
                    traffic={settingConfigData.traffic}
                    rulerControl={settingConfigData.rulerControl}
                    {...applyZoomProp}
                    theme={settingConfigData.mapTheme === 'night' ? 'dark' : 'light'}
                    geocoding={{
                        permission: geocoding,

                        /** If you are passing searchText, ensure to pass the position prop as well. */
                        searchText: searchTextData,
                        // searchTextInput: searchText,
                        position: position,
                        onGeocodingSave: onGeocodingSave, 
                        onGeocodingDragEnd: (pos: [number, number]) => { getPositions && getPositions(pos); }, 
                        shouldUpdateShape: updateShapeBasedOnPosition, 
                        isSave: shouldUpdateGeocode,
                    }}
                    heremapsObject={heremapsObject}
                    heremapsApiKey={heremapsApiKey}
                    modeOfTravel={modeOfTravel}
                    sendLocationOutside={(address: tSearchFieldAddressInfo) => { sendLocationOutside && sendLocationOutside(address); }}
                    showLegendWrapper={showLegendWrapper}
                    getLatLong={getLatLong}
                    setMapProps={setMapProps}
                    circle={circle}
                /> : <NoMapView />}
            </StyledMapDiv>
        </>
    )
}




export default withRedux(DefaultMap)
