import React from 'react'

import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

import LoaderComponent, { tLoaderSpeed } from '.'
import Position from '../../molecules/Position'
import Typography from '../Typography'
import Box from '../Box'
import { boolean, number } from '@storybook/addon-knobs'

export default {
  title: `${path}/Loader`,
  component: LoaderComponent
}

export const Loader = () => (
  <ThemeWrapper>
    <Position my='3em' p='3em' type='relative' border={1}>
      <Typography>You can use "center" Prop to center the Loader</Typography>
      <Typography>
        You can use "fadeBackground" prop to fade the background of the
        enclosing <strong>Relative</strong> Parent.
      </Typography>
      <Box my='1em' p='1em' bgColor='grey.50'>
        <Typography>
          Pro Tip1: "fadeBackground" will work only if "center" prop is true.{' '}
        </Typography>
      </Box>
      <Box my='1em' p='1em' bgColor='grey.50'>
        <Typography>
          Pro Tip2: Loader component expects its parent component to be
          positioned as <strong>Relative</strong>
        </Typography>
      </Box>

      <LoaderComponent
        center={boolean('center', false)}
        fadeBackground={boolean('fadeBackground', false)}
        speed={number('speed', 1, { min: 1, max: 5 }) as tLoaderSpeed}
      />
    </Position>
  </ThemeWrapper>
)
