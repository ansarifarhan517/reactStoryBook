import React from 'react'
import { path } from '..'
import Box from '.'
import { withKnobs, radios, text } from '@storybook/addon-knobs'

import {
  tDisplay,
  tFlexDirection,
  tJustifyContent,
  tAlignItems
} from '../../../utilities/types'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
// import withPropsTable from 'storybook-addon-react-docgen'
// import withDocs from '@storybook/addon-docs'

export default {
  title: `${path}/Box`,
  decorators: [withKnobs],
  component: Box
}

const radioOptions = {
  flexDirection: {
    column: 'column',
    row: 'row',
    'column-reverse': 'column-reverse',
    'row-reverse': 'row-reverse'
  },
  display: {
    block: 'block',
    inline: 'inline-block',
    none: 'none',
    flex: 'flex',
    'inline-flex': 'inline-flex'
  },
  justifyContent: {
    'flex-start': 'flex-start',
    'flex-end': 'flex-end',
    'space-between': 'space-between',
    'space-evenly': 'space-evenly',
    center: 'center',
    'space-around': 'space-around'
  },
  alignItems: {
    center: 'center',
    'flex-start': 'flex-start',
    'flex-end': 'flex-end',
    stretch: 'stretch'
  }
}

export const FlexPlayground = () => (
  <ThemeWrapper>
    <Box
      display={radios('display', radioOptions.display, 'flex') as tDisplay}
      flexDirection={
        radios(
          'flexDirection',
          radioOptions.flexDirection,
          'row'
        ) as tFlexDirection
      }
      justifyContent={
        radios(
          'justifyContent',
          radioOptions.justifyContent,
          'center'
        ) as tJustifyContent
      }
      alignItems={
        radios('alignItems', radioOptions.alignItems, 'center') as tAlignItems
      }
      bgColor='grey.100'
      style={{ width: '300px', height: '300px' }}
    >
      <Box
        bgColor='grey.300'
        m='10px'
        style={{ width: '50px', height: '30px' }}
      >
        Box 1
      </Box>
      <Box
        bgColor='grey.300'
        m='10px'
        style={{ width: '50px', height: '50px' }}
      >
        Box 2
      </Box>
      <Box
        bgColor='grey.300'
        m='10px'
        style={{ width: '50px', height: '40px' }}
      >
        Box 3
      </Box>
    </Box>
  </ThemeWrapper>
)

export const MarginPlayground = () => (
  <ThemeWrapper>
    <Box
      bgColor='grey.100'
      m={text('Outer Box - m', '2em')}
      mx={text('Outer Box - mx', 'auto')}
      my={text('Outer Box - my', '')}
      mt={text('Outer Box - mt', '')}
      mb={text('Outer Box - mb', '')}
      ml={text('Outer Box - ml', '')}
      mr={text('Outer Box - mr', '')}
      p={text('Outer Box - p', '1em')}
      px={text('Outer Box - px', '')}
      py={text('Outer Box - py', '')}
      pt={text('Outer Box - pt', '')}
      pb={text('Outer Box - pb', '')}
      pl={text('Outer Box - pl', '')}
      pr={text('Outer Box - pr', '')}
    >
      <Box
        bgColor='grey.300'
        m={text('Inner Box - m', '0.5em')}
        mx={text('Inner Box - mx', '')}
        my={text('Inner Box - my', '')}
        mt={text('Inner Box - mt', '')}
        mb={text('Inner Box - mb', '')}
        ml={text('Inner Box - ml', '')}
        mr={text('Inner Box - mr', '')}
        p={text('Inner Box - p', '1em')}
        px={text('Inner Box - px', '')}
        py={text('Inner Box - py', '')}
        pt={text('Inner Box - pt', '')}
        pb={text('Inner Box - pb', '')}
        pl={text('Inner Box - pl', '')}
        pr={text('Inner Box - pr', '')}
      >
        This is box 1
      </Box>
      <Box
        bgColor='grey.300'
        m={text('Inner Box - m', '0.5em')}
        mx={text('Inner Box - mx', '')}
        my={text('Inner Box - my', '')}
        mt={text('Inner Box - mt', '')}
        mb={text('Inner Box - mb', '')}
        ml={text('Inner Box - ml', '')}
        mr={text('Inner Box - mr', '')}
        p={text('Inner Box - p', '1em')}
        px={text('Inner Box - px', '')}
        py={text('Inner Box - py', '')}
        pt={text('Inner Box - pt', '')}
        pb={text('Inner Box - pb', '')}
        pl={text('Inner Box - pl', '')}
        pr={text('Inner Box - pr', '')}
      >
        This is box 2
      </Box>
    </Box>
  </ThemeWrapper>
)

export const ColorPlayground = () => (
  <ThemeWrapper>
    <Box mx='auto' p='1em' bgColor={text('Outer Box - bgColor', 'grey.100')}>
      <Box
        p='0.5em'
        mb='1em'
        color={text('Inner Box1 - color', 'primary.main')}
        bgColor={text('Inner Box1 - bgColor', 'grey.300')}
      >
        This is Box 1
      </Box>
      <Box
        p='0.5em'
        color={text('Inner Box2 - color', 'secondary.main')}
        bgColor={text('Inner Box2 - bgColor', 'grey.300')}
      >
        This is Box 2
      </Box>
    </Box>
  </ThemeWrapper>
)
