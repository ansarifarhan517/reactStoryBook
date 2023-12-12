import React from 'react'
import { path } from '..'
import FilterMultiselect from '.'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { IFilterMultiselectOption } from './interfaces'
import { action } from '@storybook/addon-actions'
import Box from '../../atoms/Box'
import { object } from '@storybook/addon-knobs'

export default {
  title: `${path}/FilterMultiselect`,
  component: FilterMultiselect
}

const options: IFilterMultiselectOption[] = [
  { id: '1', label: 'Powai', value: 'powai', checked: true },
  { id: '2', label: 'Andheri', value: 'andheri', checked: true },
  { id: '3', label: 'Bhandup', value: 'bhandup', checked: true },
  { id: '4', label: 'Mulund', value: 'mulund', checked: true },
  { id: '5', label: 'Wadala', value: 'wadala', checked: true },
  { id: '6', label: 'Dadar', value: 'dadar', checked: true },
  { id: '7', label: 'Byculla', value: 'byculla', checked: true },
  { id: '8', label: 'Vile Parle', value: 'vileparle', checked: true },
  { id: '9', label: 'Matunga', value: 'matunga', checked: true }
]

export const withBasic = () => {
  return (
    <ThemeWrapper>
      <Box style={{ width: '100%' }}>
        <FilterMultiselect
          id='branch'
          label='Hub'
          options={object('options', options)}
          onSelectionChange={action(
            'On Change (id, isChecked, allOptions, selectedOptions)'
          )}
        />
      </Box>
    </ThemeWrapper>
  )
}
