import React from 'react'
import { path } from '..'
import Grid, { tGridSize } from '.'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'

import Box, { IBoxProps } from '../Box'
import Typography from '../Typography'
import { number, text } from '@storybook/addon-knobs'

export default {
  title: `${path}/Grid`,
  component: Grid
}

const DisplayBox = ({ children, ...rest }: IBoxProps) => (
  <Box
    bgColor='grey.200'
    p='0.5em'
    justifyContent='center'
    alignItems='center'
    my='auto'
    {...rest}
  >
    <Typography align='center'>{children}</Typography>
  </Box>
)

export const withSizes = () => (
  <ThemeWrapper>
    <Box bgColor='grey.50' p='1em'>
      <Grid container spacing='.5em'>
        <Grid item xs={number('xs', 6, { min: 1, max: 12 }) as tGridSize}>
          <DisplayBox>xs={number('xs', 6, { min: 1, max: 12 })}</DisplayBox>
        </Grid>
        <Grid item sm={number('sm', 6, { min: 1, max: 12 }) as tGridSize}>
          <DisplayBox>sm={number('sm', 6, { min: 1, max: 12 })}</DisplayBox>
        </Grid>
        <Grid item md={number('md', 4, { min: 1, max: 12 }) as tGridSize}>
          <DisplayBox>md={number('md', 4, { min: 1, max: 12 })}</DisplayBox>
        </Grid>
        <Grid item lg={number('lg', 3, { min: 1, max: 12 }) as tGridSize}>
          <DisplayBox>lg={number('lg', 3, { min: 1, max: 12 })}</DisplayBox>
        </Grid>
        <Grid item xl={number('xl', 1, { min: 1, max: 12 }) as tGridSize}>
          <DisplayBox>xl={number('xl', 1, { min: 1, max: 12 })}</DisplayBox>
        </Grid>
        <Grid item>
          <DisplayBox>Remaining Space</DisplayBox>
        </Grid>
      </Grid>
    </Box>
  </ThemeWrapper>
)

export const withSpacing = () => (
  <ThemeWrapper>
    <Box bgColor='grey.50' p='1em'>
      <Grid container spacing={text('spacing', '1em')}>
        <Grid item xs={2}>
          <DisplayBox>1</DisplayBox>
        </Grid>
        <Grid item xs={3}>
          <DisplayBox>2</DisplayBox>
        </Grid>
        <Grid item xs={4}>
          <DisplayBox>3</DisplayBox>
        </Grid>
        <Grid item xs={1}>
          <DisplayBox>4</DisplayBox>
        </Grid>
        <Grid item xs={2}>
          <DisplayBox>5</DisplayBox>
        </Grid>
        <Grid item xs={5}>
          <DisplayBox>6</DisplayBox>
        </Grid>
        <Grid item>
          <DisplayBox>7</DisplayBox>
        </Grid>
        <Grid item>
          <DisplayBox>8</DisplayBox>
        </Grid>
      </Grid>
    </Box>
  </ThemeWrapper>
)

export const withNesting = () => (
  <ThemeWrapper>
    <Box bgColor='grey.50' p='1em'>
      <Grid container spacing='0.25em'>
        <Grid item xs={5}>
          <DisplayBox
            display='flex'
            alignItems='center'
            style={{ height: '100%' }}
          >
            xs=5
          </DisplayBox>
        </Grid>
        <Grid container item xs={7} spacing='0.5em'>
          <Grid item xs={4}>
            <DisplayBox bgColor='primary.light'>xs=4</DisplayBox>
          </Grid>
          <Grid item xs={3}>
            <DisplayBox bgColor='primary.light'>xs=3</DisplayBox>
          </Grid>
          <Grid item>
            <DisplayBox bgColor='primary.light'>Remaining</DisplayBox>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </ThemeWrapper>
)
