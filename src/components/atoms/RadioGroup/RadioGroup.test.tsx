import React from 'react'
import { mount } from '../../../../jest.setup'
import RadioGroup from '.'
import Radio from '../Radio'

describe('RadioInput Unit testing..', () => {
  it('is truthy', () => {
    expect(RadioGroup).toBeTruthy()
  })
  it('should render Radio input', () => {
    const wrapper = mount(
      <RadioGroup id='GenderGroup'>
        <Radio id='female' name='gender' value='female' />
        <Radio id='male' name='gender' value='male' />
      </RadioGroup>
    )
    expect(wrapper.find('input').length).toBe(2)
  })

  it('should render Radio as selected option', () => {})
})
