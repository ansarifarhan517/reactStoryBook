import React from 'react'
import { mount } from '../../../../jest.setup'
import Radio from '.'

const fn = jest.fn()
describe('RadioInput Unit testing..', () => {
  it('is truthy', () => {
    const wrapper = mount(
      <Radio id='radio' onChange={fn} checked={false} label='label' />
    )
    expect(wrapper).toBeTruthy()
  })
})
