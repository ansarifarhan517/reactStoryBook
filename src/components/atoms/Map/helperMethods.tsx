import L from 'leaflet'
import { LatLngBoundsExpression } from 'leaflet'
import { IOption, ISettingInputOption } from '../SettingBox/interface'
import { IMapData, tSearchFieldAddressInfo } from './interfaces.d'
import { tTheme, tTiles } from './types.d'

export const updateSettingsWithLegends = (
  settings: any,
  markers: any,
  settingKey: string
) => {
  if (markers?.permission) {
    const entities = markers?.entities //  entities: ['orders', 'dbs'],
    const entitiesMap = markers?.entitiesMap //  entitiesMap: { orders:{},dbs:{}  }
    entities.forEach((entity: any) => {
      const _entity = entitiesMap[entity] // orders:{ legends: ['notDispatched', 'delivered']}
      if (_entity?.permission) {
        // orders:{ permission:true,legends: ['notDispatched', 'delivered']}
        const optionKeys = _entity.legends
        const legendMap = _entity.legendsMap // legendsMap:{delivered:{},notDispatched:{}}
        // delivered { value:'',color:'',checked:true,....}
        const entityOption = optionKeys
          .map((option: string) => {
            const _option = legendMap[option]
            if (_option?.permission) {
              return {
                value: _option?.value,
                checked: _option?.checked,
                color: _option?.color,
                disabled: _option?.disabled,
                permission: _option?.permission,
                id: option,
                allow: _option?.allow,
                iconRef: _option.iconRef,
                popRef: _option.popRef,
                extraInfo: _option.extraInfo,
                label: _option.label,
                image: _option.image,
                icon: _option.icon,
                connect: _option.connect
              }
            }
            return undefined
          })
          .filter((item: any) => !!item)

        settings[settingKey] = {
          title: settingKey || entitiesMap[entity].label,
          type: entity.type || 'checkbox',
          option: entityOption
        }
        return entityOption
      }
    })
  }
}

/* WARNING: arrays must not contain {objects} or behavior may be undefined */
export const isArrayEqual = (a: Array<any>, b: Array<any>) =>
  JSON.stringify(a) === JSON.stringify(b)

export const setLegendMarkers = (legends: any, markers: any) => {
  const entities = markers?.entities //  entities: ['orders', 'dbs'],
  const entitiesMap = markers?.entitiesMap //  entitiesMap: { orders:{},dbs:{}  }
  entities?.forEach((entity: any) => {
    const _entity = entitiesMap[entity] // orders:{ legends: ['notDispatched', 'delivered'],legendsMap:{}}
    const legendsMap = _entity?.legendsMap // legendsMap:{delivered:{},notDispatched:{}}
    if (_entity?.permission) {
      legends.forEach((option: any) => {
        legendsMap[option?.id] = {
          ...legendsMap[option?.id],
          checked: option?.checked
        }
      })
    }
  })

  return markers
}
export const trafficMap = (_zoom: any) => {}

export const updateMapWithSettings = (
  settingConfig: ISettingInputOption,
  configurableOption: any,
  setConfigurableOption: (confurableOption: any) => void,
  _setSettingConfig: (settingConfig: ISettingInputOption) => void,
  markerConfig: IMapData | undefined,
  setmarkerConfig: (markerConfig: IMapData) => void,
  heatmap: any,
  geocoding: any,
  setGeocoding: (geocoding: any) => void,
  locationSearchProp: boolean
) => {
  let circle = configurableOption.circle
  let polygon = configurableOption.polygon
  // theme added dynamically.
  const mapTheme = settingConfig?.['Map Theme']?.option?.find(
    (option: IOption) => option.selected
  )

  // geofences added dynamically.
  const geofences = settingConfig?.Geofences?.option?.filter(
    (option: IOption) => option.selected
  )
  if (settingConfig?.Geofences?.permission) {
    // geofence available and circle object available, if user toggle true then set permission true or else false
    circle =
      configurableOption?.circle?.permission && geofences?.length > 0
        ? { ...configurableOption?.circle?.permission, permission: true }
        : { ...configurableOption?.circle?.permission, permission: false }
    // geofence available and polygon object available, if user toggle true then set permission true or else false
    polygon =
      configurableOption?.polygon?.permisssion && geofences?.length > 0
        ? { ...configurableOption?.polygon?.permission, permission: true }
        : { ...configurableOption?.polygon?.permission, permission: false }
  }

  // choose google map or open street
  const mapType = settingConfig?.['Map Type']?.option?.find(
    (option: IOption) => option.selected
  )
  // sub type of google or open street map selection
  const mapSubType = mapType?.subOptions?.find(
    (subOption: IOption) => subOption.selected
  )
  // poi, traffic,rular, search can be toggled
  const miscellaneous = settingConfig?.Miscellaneous?.option?.filter(
    (option: any) => option.selected
  )
  // traffic layer toggling
  const traffic = miscellaneous?.find(
    (option: any) => option.name === 'Traffic'
  )

  // map mode selection
  const mapMode = settingConfig?.['Map Mode']?.option?.find(
    (option: IOption) => option?.selected && option?.permission
  )
  const heatMapObj = { permission: heatmap?.permission, data: heatmap?.data }

  if (mapMode?.name === 'HeatMap') {
    heatMapObj.permission = true
  }
  let locationSearch = !!miscellaneous?.find(
    (option: any) => option.name === 'Location Search'
  )
  // check if this option exist in setting file, if no then show whatever coming as prop
  if (!settingConfig?.Miscellaneous?.option?.['Location Search']) {
    locationSearch = locationSearchProp
  }

  setConfigurableOption({
    ...configurableOption,
    theme: mapTheme?.id as tTheme, // map theme selection
    heatmap: heatMapObj, // show heatmap if selected on settings

    tiles: mapSubType?.id as tTiles, // open street and google sub type
    isOpenStreet: mapType?.name === 'Open Street Maps',
    poi: !!miscellaneous?.find(
      (option: any) => option.name === 'Point of interest'
    ),
    locationSearch,
    //  rular on map toggling
    rulerControl: !!miscellaneous?.find(
      (option: any) => option.name === 'Ruler Control'
    ),
    polygon: polygon,
    circle: circle,
    // traffic layer
    traffic: traffic?.selected ? traffic?.selected : false
  })
  // if in settings we remove location search and before that something there in searchbox should get flushed.
  if (locationSearch === false && geocoding.searchText) {
    setGeocoding({ ...geocoding, searchText: '' })
  }
  markerConfig && setmarkerConfig(markerConfig)
  // whenever settings getting updated this block should get called
  // setSettingConfig(newSettingConfig)
}

export const convertArrayToObject = (legend: any, key = 'id') => {
  const initialValue = {}
  if (Array.isArray(legend)) {
    return legend.reduce((obj: any, item: any) => {
      return {
        ...obj,
        [item[key]]: item
      }
    }, initialValue)
  }
  return legend
}

export const getGeoLocation = (
  latlngObj: any,
  google: any,
  data: any,
  setData: any,
  setShowLocation: any
) => {
  const newData = Object.assign(data, {})
  const geocoder = new google.maps.Geocoder()
  // find a location and update option
  geocoder.geocode({ location: latlngObj }, function (
    results: any,
    status: any
  ) {
    setShowLocation && setShowLocation(false)
    if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      // over limit error
    } else if (status === 'OK') {
      newData._thisLocation = results[0] ? results[0].formatted_address : ''
    } else {
      newData._thisLocation = 'Location not found'
    }
    setData && setData(newData)
    setShowLocation && setShowLocation(true)
    return newData._thisLocation
  })
}

export const getNewSetting = (setting: ISettingInputOption) => {
  // create a new reference of setting
  const settingOpn: ISettingInputOption = deepCopy(setting)

  return settingOpn
}

function recursiveCall(obj: any) {
  return deepCopy(obj)
}
export function deepCopy(obj: any) {
  let retObj: any = {}
  const _assignProps = (obj: any, keyIndex: any, retObj: any) => {
    const subType = Object.prototype.toString.call(obj[keyIndex])
    if (subType === '[object Object]' || subType === '[object Array]') {
      retObj[keyIndex] = recursiveCall(obj[keyIndex])
    } else {
      retObj[keyIndex] = obj[keyIndex]
    }
  }

  if (Object.prototype.toString.call(obj) === '[object Object]') {
    retObj = {}
    for (const key in obj) {
      _assignProps(obj, key, retObj)
    }
  } else if (Object.prototype.toString.call(obj) === '[object Array]') {
    retObj = []
    for (let i = 0; i < obj.length; i++) {
      _assignProps(obj, i, retObj)
    }
  }

  return retObj
}

export const getAddressInfo = (address: any) => {
  const addressObj: tSearchFieldAddressInfo = {
    apartment: '',
    streetName: '',
    landMark: '',
    locality: '',
    state: '',
    city: '',
    pincode: '',
    country: '',
    registeredCountryIsoCode: ''
  }

  address.forEach(
    (component: {
      types: string | string[]
      long_name: string | undefined
    }) => {
      if (component.types.includes('postal_code')) {
        addressObj.pincode = component.long_name
      } else if (component.types.includes('country')) {
        addressObj.country = component.long_name
      } else if (component.types.includes('administrative_area_level_1')) {
        addressObj.state = component.long_name
      } else if (component.types.includes('locality')) {
        addressObj.city = component.long_name
      } else if (component.types.includes('sublocality_level_1')) {
        addressObj.locality += ` ${component.long_name}`
        addressObj.streetName = component.long_name // only for USA
      } else if (component.types.includes('street_address')) {
        addressObj.streetName = component.long_name
        addressObj.apartment += ` ${component.long_name}` // only for USA
      } else if (component.types.includes('route')) {
        addressObj.apartment += ` ${component.long_name}` // only for USA
      } else if (component.types.includes('intersection')) {
        addressObj.streetName = component.long_name
      } else if (component.types.includes('premise')) {
        addressObj.apartment = component.long_name
      } else if (component.types.includes('subpremise')) {
        addressObj.apartment += ` ${component.long_name}`
      } else if (component.types.includes('establishment')) {
        addressObj.apartment += ` ${component.long_name}`
      } else if (component.types.includes('street_number')) {
        addressObj.apartment += ` ${component.long_name}`
      } else if (component.types.includes('point_of_interest')) {
        addressObj.landMark = component.long_name
      }
    }
  )
  return addressObj
}

//Calculate bounds explicitly for Circle data
export const getCircleLatRadius = (cRadius: number) => {
    return (cRadius / 40075017) * 360;
};

export const getCircleLngRadius = (cRadius: number, cLat: number) => {
    return getCircleLatRadius(cRadius) / Math.cos(((Math.PI / 180)) * cLat);
}

export const getCircleBounds = (cRadius: number, cLat: number, cLng: number) => {
    let lngRadius = getCircleLngRadius(cRadius, cLat);
    let latRadius = getCircleLatRadius(cRadius);
    let sw = new L.LatLng(cLat - latRadius, cLng - lngRadius);
    let ne = new L.LatLng(cLat + latRadius, cLng + lngRadius);
    return [[sw.lat, sw.lng], [ne.lat, ne.lng]] as LatLngBoundsExpression;
}
