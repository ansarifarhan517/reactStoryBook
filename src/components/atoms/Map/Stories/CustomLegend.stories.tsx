import { action } from '@storybook/addon-actions'
import { object, withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import LeafletMap from '..'
import { path } from '../..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import Settings from '../../../atoms/SettingBox/data'
import { GOOGLE_API_KEY } from '../constants/googleIntegration.constants'
import infowindowStructure from '../dummyData/Infowindow.structure.sampleData'
import markerIcons from '../dummyData/MarkerIcon.sampleData'
import sampleTripData from '../dummyData/Presentation.Trips.sampleData'
import markerLayerObj from '../dummyData/MarkerWithIcon.sampleData'

export default {
  title: `${path}/Map`,
  decorators: [withKnobs],
  component: LeafletMap
}

export const TripsMapWithLegend = () => {
  const settingConfig = Object.assign({}, Settings)
  // create legend on the basis of markers data

  // set permission false, so that map mode will be hidden
  settingConfig['Map Mode'].permission = false
  return (
    <ThemeWrapper>
      <LeafletMap
        markers={object('Marker Configuration', markerLayerObj)}
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
