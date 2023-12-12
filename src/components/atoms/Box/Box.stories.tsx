import Box from './index'
import { Meta, StoryObj } from '@storybook/react'
import { withKnobs, radios, text } from '@storybook/addon-knobs'
import { tAlignItems, tDisplay, tFlexDirection, tJustifyContent } from '../../../utilities/types'
import React from 'react'


type Story = StoryObj<typeof meta>;

const meta: Meta<typeof Box> = {
  title: 'UI Library/Atoms/Box',
  component: Box,
  decorators: [withKnobs],

}

export default meta

const radioOptions = {
  flexDirection: {
    'column': 'column',
    'row': 'row',
    'column-reverse': 'column-reverse',
    'row-reverse': 'row-reverse',
  },
  display: {
    block: 'block',
    inline: 'inline-block',
    none: 'none',
    flex: 'flex',
    'inline-flex': 'inline-flex',
  },
  justifyContent: {
    'flex-start': 'flex-start',
    'flex-end': 'flex-end',
    'space-between': 'space-between',
    'space-evenly': 'space-evenly',
    'center': 'center',
    'space-around': 'space-around',
  },
  alignItems: {
    'center': 'center',
    'flex-start': 'flex-start',
    'flex-end': 'flex-end',
    'stretch': 'stretch',
  },
}
export const FlexPlaygroundStory: Story = {
  args: {
    display: radios('Display',radioOptions.display,'flex') as tDisplay,
    flexdirection: radios(
      'flexDirection',
      radioOptions.flexDirection,
      'column',
    ) as tFlexDirection
    ,
    justifycontent: radios(
      'justifyContent',
      radioOptions.justifyContent,
      'center',
    ) as tJustifyContent,
    alignitems: radios('alignitems', radioOptions.alignItems, 'center') as tAlignItems,
    bgcolor: text('bgColor','grey.100'),
    color: text('color','black'),
    children: (
      <>
        <Box
          bgcolor="grey.300"
          m="10px"
          style={{ width: '50px', height: '30px' }}
        >
          Box 1
        </Box>
        <Box
          bgcolor="grey.300"
          m="10px"
          style={{ width: '50px', height: '50px' }}
        >
          Box 2
        </Box>
        <Box
          bgcolor="grey.300"
          m="10px"
          style={{ width: '50px', height: '40px' }}
        >
          Box 3
        </Box>
      </>
    ),
  },
}

export const MarginPlayground: Story = {
  args: {
    bgcolor: text('bgcolor', 'grey.100'),
    m: text('Outer Box - m', '2em'),
    mx: text('Outer Box - mx', 'auto'),
    my: text('Outer Box - my', ''),
    mt: text('Outer Box - mt', ''),
    mb: text('Outer Box - mb', ''),
    ml: text('Outer Box - ml', ''),
    mr: text('Outer Box - mr', ''),
    p: text('Outer Box - p', '1em'),
    px: text('Outer Box - px', ''),
    py: text('Outer Box - py', ''),
    pt: text('Outer Box - pt', ''),
    pb: text('Outer Box - pb', ''),
    pl: text('Outer Box - pl', ''),
    pr: text('Outer Box - pr', ''),
    children: (
      <>
        <Box
          bgcolor="grey.300"
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
          bgcolor="grey.300"
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
      </>
    ),
  },
}


export const ColorPlayground: Story = {
  args: {
    mx:text('Inner Box - mx','auto'),
    p:text('Inner Box - p','1em'),
    bgcolor:text('Outer Box - bgcolor', 'grey.100'),
    children:(<>
      <Box
        p="0.5em"
        mb="1em"
        color={text('Inner Box1 - color', 'primary.main')}
        bgcolor={text('Inner Box1 - bgcolor', 'grey.300')}
      >
        This is Box 1
      </Box>
      <Box
        p="0.5em"
        color={text('Inner Box2 - color', 'secondary.main')}
        bgcolor={text('Inner Box2 - bgcolor', 'grey.300')}
      >
        This is Box 2
      </Box>
    </>),
  },
}
