import { action } from '@storybook/addon-actions'
import { boolean, withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import SettingBox from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import settings from './data'

export default {
  title: `${path}/SettingBox`,
  decorators: [withKnobs],
  component: SettingBox
}

export const SettingBoxComponent = () => (
  <ThemeWrapper>
    <SettingBox
      onChange={action('Value Changed')}
      settingOption={settings}
      showModal={boolean('showModal', true)}
      handleShowModal={action('Show modal triggered')}
      setMarkers={action('Marker set')}
      heatMap={boolean('heatMap', true)}
      setFocusSearchPlace={action('Focus on searched Place')}
    />
  </ThemeWrapper>
)
