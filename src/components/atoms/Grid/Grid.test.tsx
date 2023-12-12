import React from 'react'

import Grid from '.'
import { shallow } from '../../../../jest.setup'

describe('Grid Component', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Grid container>
        <Grid item>Column 1</Grid>
        <Grid item>Column 2</Grid>
        <Grid item>Column 3</Grid>
      </Grid>
    )
    expect(wrapper).toBeTruthy()
  })
})
