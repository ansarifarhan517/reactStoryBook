import React from 'react'
import { mount, shallow } from '../../../../jest.setup'
import InputLabel from '.'

describe('InputLabel Unit testing..', () => {
  it('is truthy', () => {
    expect(InputLabel).toBeTruthy()
  })

  it('should render', () => {
    const wrapper = shallow(<InputLabel>Test</InputLabel>)
    expect(wrapper.find('Typography').length).toBe(1)
  })

  it('should show * in the end if marked as required', () => {
    const wrapper = mount(<InputLabel required>Test</InputLabel>)
    expect(wrapper.text()).toContain('Test *')
  })
})
