import { action } from '@storybook/addon-actions'
import {
  boolean,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs'
import React from 'react'
import LeafletMap from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Settings from '../../atoms/SettingBox/data'
import { ButtonList } from '../../molecules/ShowHideColumnPopup'
import { tVariant } from '../Button'
import { IOption } from '../SettingBox/interface'
import {
  GOOGLE_API_KEY,
  HERE_MAPS_API_KEY
} from './constants/googleIntegration.constants'
import circleSampleData from './dummyData/CircleSampleData.SampleData'
import infowindowStructure from './dummyData/Infowindow.structure.sampleData'
import markerIcons from './dummyData/MarkerIcon.sampleData'
import markerLayerObj from './dummyData/Markers.sampleData'
import polyGeoFenceSampleData from './dummyData/PolyGeoFence.SampleData'
import sampleTrackingData from './dummyData/Presentation.Tracking.sampleData'
import sampleTripData from './dummyData/Presentation.Trips.sampleData'
import { updateSettingsWithLegends } from './helperMethods'
import EditPopUp from './SubComponent/EditPopUp'
import { tTheme, tTiles } from './types.d'

export default {
  title: `${path}/Map`,
  decorators: [withKnobs],
  component: LeafletMap
}

// The options which will be visible for tile-layer select in the story
const tileOptions = {
  'open-street-maps': 'osm',
  'google-satellite': 'google_satellite',
  'google-basic': 'google_roadmap',
  'google-terrain': 'google_terrain',
  'google-hybrid': 'google_hybrid'
}

const themeOptions = {
  light: 'light',
  dark: 'dark'
}

export const BaseMap = () => {
  const settingConfig = Object.assign({}, Settings)
  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[51.0, 19.0]}
        latLngBounds={[[37.09024, -95.712891]]}
        // zoom={number('Zoom', 4, { min: 1, max: 24 })}
        zoomControl={boolean('Zoom Controls', true)}
        locationSearch={boolean('Location Search Bar', true)}
        googleApiKey={GOOGLE_API_KEY}
        heremapsApiKey={HERE_MAPS_API_KEY}
        height={text('Height', '300px')}
        width={text('Width', '800px')}
        tiles={
          select('Base Tile Layer', tileOptions, 'google_roadmap') as tTiles
        }
        theme={select('Theme', themeOptions, 'light') as tTheme}
        poi={boolean('Points of interest', false)}
        settingConfig={settingConfig}
        popupRef={infowindowStructure}
        onSettingChange={action('setting changed')}
        rulerControl={boolean('rulerControl', true)}
        iconsRef={markerIcons}
        // center={array('center', ['37.7749', '-122.4194'])}
      />
    </ThemeWrapper>
  )
}

export const MarkerMap = () => {
  const settingConfig = Object.assign({}, Settings)

  // set permission true of markers if sending data,same like heatmap
  settingConfig['Map Mode'].option.forEach((option: IOption) => {
    option.permission = option.name === 'Markers'
    option.selected = option.name === 'Markers'
  })
  settingConfig['Map Mode'].permission = true

  // create legend on the basis of markers data
  updateSettingsWithLegends(settingConfig, markerLayerObj, 'Legends')

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[37.09024, -95.712891]}
        latLngBounds={[[37.09024, -95.712891]]}
        // zoom={4}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='800px'
        width='800px'
        tiles='google_roadmap'
        markers={object('Marker Configuration', markerLayerObj)}
        focusMarkerId={text('Marker Id to focus/open', '')}
        iconsRef={markerIcons}
        popupRef={infowindowStructure}
        settingConfig={settingConfig}
        onSettingChange={action('setting changed')}
        handleClosePopup={(popupRef) => action('handle Close Popup')(popupRef)}
      />
    </ThemeWrapper>
  )
}

export const HeatMapAndMarker = () => {
  const settingConfig = Object.assign({}, Settings)
  // set permission true of heatmap if sending data,same like marker
  settingConfig['Map Mode'].option.forEach((option: IOption) => {
    option.permission = true // true for both option
    option.selected = option.name === 'Markers' // markers selected first
  })
  settingConfig['Map Mode'].permission = true
  // create legend on the basis of markers data
  updateSettingsWithLegends(settingConfig, markerLayerObj, 'Legends')

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[51.0, 19.0]}
        // zoom={4}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='800px'
        width='800px'
        tiles='google_roadmap'
        heatmap={object('Heatmap configuration', {
          permission: false,
          data: markerLayerObj.entitiesMap.orders.markers.list
        })}
        settingConfig={settingConfig}
        markers={object('Marker Configuration', markerLayerObj)}
        iconsRef={markerIcons}
        popupRef={infowindowStructure}
        onSettingChange={action('setting changed')}
      />
    </ThemeWrapper>
  )
}

export const HeatMap = () => {
  const settingConfig = Object.assign({}, Settings)
  // set permission true of heatmap if sending data,same like marker
  settingConfig['Map Mode'].option.forEach((option: IOption) => {
    option.permission = option.name === 'HeatMap'
    option.selected = option.name === 'HeatMap'
  })
  settingConfig['Map Mode'].permission = true

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[51.0, 19.0]}
        // zoom={4}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='300px'
        width='800px'
        tiles='google_roadmap'
        heatmap={object('Heatmap configuration', {
          permission: true,
          data: markerLayerObj.entitiesMap.orders.markers.list
        })}
        settingConfig={settingConfig}
        onSettingChange={action('setting changed')}
      />
    </ThemeWrapper>
  )
}

export const TripsMap = () => {
  const settingConfig = Object.assign({}, Settings)
  // create legend on the basis of markers data

  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false
  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[51.0, 19.0]}
        zoom={4}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='300px'
        width='800px'
        tiles='google_roadmap'
        trips={object('Trip Configuration', sampleTripData)}
        iconsRef={markerIcons}
        popupRef={infowindowStructure}
        onSettingChange={action('setting changed')}
      />
    </ThemeWrapper>
  )
}

export const TrackingMap = () => {
  const settingConfig = Object.assign({}, Settings)

  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false
  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[33.298959, -111.9724]}
        zoom={10}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='300px'
        width='800px'
        tiles='google_roadmap'
        tracking={object('Tracking Configuration', sampleTrackingData)}
        onSettingChange={action('setting changed')}
      />
    </ThemeWrapper>
  )
}

const GeocodingMapComponent = () => {
  const settingConfig = Object.assign({}, Settings)
  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false
  // const [searchText, setSearchText] = React.useState(
  //   'Mumbai, Maharashtra, India'
  // )
  // const [position, setPosition] = React.useState([19.0759837, 72.8776559])

  return (
    <LeafletMap
      id='leafletBaseMap'
      classes='baseMap customBaseMap'
      googleApiKey={GOOGLE_API_KEY}
      settingConfig={settingConfig}
      center={[51.0, 19.0]}
      // markers={object('Marker Configuration', markerLayerObj)}
      iconsRef={markerIcons}
      zoomControl
      locationSearch
      sendLocationOutside={action('sendLocationOutside ')}
      isShowMapTileLayer={boolean('isShowMapTileLayer', false)}
      geocoding={{
        permission: true,

        /** If you are passing searchText, ensure to pass the position prop as well. */
        searchText: text('searchText', 'Mumbai'),
        // searchTextInput: searchText,
        position: [19.0759837, 72.8776559],
        isSave: boolean('isSave', true),
        onGeocodingSave: (e: any) => {
          window.alert(
            'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
          )
        },
        onGeocodingDragEnd: (pos: [number, number]) => {
          action('On Geocoding Drag End')(pos)
          // setPosition(pos)
          // setSearchText('India')
        }
      }}
      showLegendWrapper={boolean('showLegendWrapper', false)}
    />
  )
}
export const GeocodingMap = () => {
  return (
    <ThemeWrapper>
      <GeocodingMapComponent />
    </ThemeWrapper>
  )
}

export const PolygonMap = () => {
  const settingConfig = Object.assign({}, Settings)
  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false
  // const [buttonType] = useState<string | null>(null)
  // console.log(buttonType)

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[20.5937, 78.9629]}
        zoom={4}
        zoomControl={boolean('Zoom Controls', true)}
        locationSearch={boolean('Location Search Bar', true)}
        googleApiKey={GOOGLE_API_KEY}
        height={text('Height', '300px')}
        width={text('Width', '800px')}
        tiles={
          select('Base Tile Layer', tileOptions, 'google_roadmap') as tTiles
        }
        theme={select('Theme', themeOptions, 'light') as tTheme}
        poi={boolean('Points of interest', false)}
        settingConfig={settingConfig}
        polygon={object('polygon', polyGeoFenceSampleData)}
        popupRef={infowindowStructure}
        onSettingChange={action('setting changed')}
        handleClosePopup={(popupRef) => action('handle Close Popup')(popupRef)}
        editPopUpComponent={({ map }: any) => (
          <EditPopUp
            onClick={() => {
              map.closePopup()
            }}
          />
        )}
        onEdit={action('Value Edited with new Vertex')}
        popupCustomComponent={{
          tooltipButton: ({ selectedData }: any) => (
            <ButtonList
              listOfButtons={[
                {
                  variant: 'button' as tVariant,
                  children: 'Edit',
                  // intent: 'table' as tIntent,
                  iconVariant: 'edit',
                  primary: true,
                  onClick: () => console.log('Edit', selectedData)
                },
                {
                  variant: 'button' as tVariant,
                  children: 'Delete',
                  iconVariant: 'icomoon-close',
                  // intent: 'table' as tIntent,
                  onClick: () => console.log('delete', selectedData)
                }
              ]}
            />
          )
        }}
      />
    </ThemeWrapper>
  )
}

export const CircleMap = () => {
  const settingConfig = Object.assign({}, Settings)

  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false

  // create legend on the basis of markers data
  updateSettingsWithLegends(settingConfig, markerLayerObj, 'Route Mode')

  return (
    <ThemeWrapper>
      <LeafletMap
        id='leafletBaseMap'
        classes='baseMap customBaseMap'
        center={[20.5937, 78.9629]}
        zoom={4}
        zoomControl
        locationSearch
        googleApiKey={GOOGLE_API_KEY}
        height='300px'
        width='800px'
        tiles='google_roadmap'
        popupRef={infowindowStructure}
        settingConfig={settingConfig}
        onSettingChange={action('setting changed')}
        circle={object('circle', circleSampleData)}
        onEdit={action('Value Edited with new Vertex')}
        editPopUpComponent={({ map }: any) => (
          <EditPopUp
            onClick={() => {
              map.closePopup()
            }}
          />
        )}
      />
    </ThemeWrapper>
  )
}
