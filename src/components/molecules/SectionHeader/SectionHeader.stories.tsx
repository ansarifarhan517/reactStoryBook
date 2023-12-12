import React from 'react'
import { path } from '..'
import SectionHeader from '.'
import Checkbox from '../../atoms/Checkbox'

import { withKnobs, text, boolean } from '@storybook/addon-knobs'

import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

export default {
  title: `${path}/SectionHeader`,
  decorators: [withKnobs],
  component: SectionHeader
}

export const withPlayground = () => (
  <ThemeWrapper>
    <SectionHeader headerTitle={text('headerTitle', 'Current Address')} />
  </ThemeWrapper>
)

export const withChildren = () => (
  <ThemeWrapper>
    <SectionHeader headerTitle={text('headerTitle', 'Billing Address')}>
      <Checkbox
        id='checkboxaddress'
        checked={boolean('checked', false)}
        checkboxSize='sm'
        label={text('label', 'Same as Current Address')}
      />
    </SectionHeader>
  </ThemeWrapper>
)
