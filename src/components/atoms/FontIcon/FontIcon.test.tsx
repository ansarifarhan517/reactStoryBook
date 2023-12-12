import React from 'react'

import FontIcon from '.'
import { mount } from '../../../../jest.setup'

describe('Font Icon Component', () => {
  it('is truthy', () => {
    expect(FontIcon).toBeTruthy()
  })

  it('renders appropriate class element', () => {
    const wrapper = mount(<FontIcon variant='approve' />)
    expect(wrapper.find('.icon.icon-approve').length).toBe(1)
  })
})
