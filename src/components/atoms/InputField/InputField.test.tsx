import React from 'react'
import { mount } from '../../../../jest.setup'
import InputField from '.'

describe('InputField Unit testing..', () => {
  it('is truthy', () => {
    expect(InputField).toBeTruthy()
  })

  it('should render input tag', () => {
    const wrapper = mount(<InputField />)
    expect(wrapper.find('input').length).toBe(1)
  })
})
