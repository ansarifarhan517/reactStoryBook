// The base layer which will display the map tiles underneath
// import LL from 'leaflet'
import React, { useEffect, useState } from 'react'
import { TileLayer, useLeaflet, withLeaflet } from 'react-leaflet'
import ReactLeafletGoogleLayer from './LeaftletGoogleLayer'
import { tGoogleMutantType, tTheme, tTiles } from '../types.d'
import DARK from './../constants/maptheme.dark'
import LIGHT from './../constants/maptheme.light'

import MeasureControl from 'react-leaflet-measure'

const measureOptions = {
  position: 'bottomright',
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: 'acres',
  activeColor: '#db4a29',
  completedColor: '#9b2d14',
  intarctive: false,
  popupOptions: {
    className: 'leaflet-measure-resultpopup',
    autoPanPadding: [10, 10]
  },
  captureZIndex: 10000,
  decPoint: '.',
  thousandsSep: ','
}

const WrappedMeasureControl = withLeaflet(MeasureControl)

const getTileUrl = (subType: string) => {
  switch (subType) {
    case 'standard':
      return 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    case 'cycle':
      return 'http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
    case 'humanitarian':
      return 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    case 'transport':
      return 'http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
    default:
      return 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
  }
}

interface ILeafletTileLayer {
  tiles: tTiles
  theme: tTheme
  poi: boolean
  googleApiKey: string
  orientation: any
  traffic: boolean
  rulerControl: boolean
}

const LeafletTileLayer = (props: ILeafletTileLayer) => {
  const { tiles, theme, poi, googleApiKey, traffic, rulerControl } = props
  const [traficLayer, setTrafficLayer] = useState<any>(null)

  const [type, setType] = useState(tiles?.split('_')[0])
  const [subtype, setSubtype] = useState(tiles?.split('_')[1])
  const [layerPermission, setLayerPermission] = useState(false)
  const [_theme, setTheme] = useState(theme)
  const [_poi, setPoi] = useState(poi)
  const { map } = useLeaflet()

  useEffect(() => {
    if (type === 'google' && map) {
      if (traffic) {
        traficLayer?.target?.addGoogleLayer('TrafficLayer')
      } else {
        traficLayer?.target?.removeGoogleLayer('TrafficLayer')
      }
    }
  }, [traffic, traficLayer])

  useEffect(() => {
    if (map) {
      // For 500 ms, remove the layer from DOM, then insert new, so that google layer gets changed
      setLayerPermission(false)

      setType(tiles?.split('_')[0])
      setSubtype(tiles?.split('_')[1])
      setTheme(theme)
      setPoi(poi)

      setTimeout(() => setLayerPermission(true), 100)
    }
  }, [tiles, theme, poi, map])

  const googleLayerAdded = (layer: any) => {
    setTrafficLayer(layer)
  }

  return map ? (
    <React.Fragment>
      {layerPermission && (
        <React.Fragment>
          {type === 'osm' && subtype && (
            <TileLayer url={getTileUrl(subtype)} attribution='' />
          )}

          {type === 'google' && subtype && (
            <ReactLeafletGoogleLayer
              useGoogMapsLoader={false}
              continuousWorld
              onAdd={(layer: any) => googleLayerAdded(layer)}
              googleMapsLoaderConf={{ KEY: googleApiKey }}
              type={subtype as tGoogleMutantType}
              styles={
                _theme && _theme === 'dark'
                  ? DARK[_poi ? 'poi' : 'noPoi']
                  : LIGHT[_poi ? 'poi' : 'noPoi']
              }
            />
          )}
          {/* Rular Layer */}
          {rulerControl && <WrappedMeasureControl {...measureOptions} />}
        </React.Fragment>
      )}
    </React.Fragment>
  ) : null
}

export default React.memo(LeafletTileLayer)
