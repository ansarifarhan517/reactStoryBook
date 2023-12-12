import React from 'react'
import { mount } from '../../../../jest.setup'
import CheckboxGroup from '.'

const fn = jest.fn()
const checkOptions = [
  { id: '01', value: 'Male', checked: true, disabled: true },
  { id: '02', value: 'Female', checked: true, disabled: false }
]
describe('Checkbox input Unit testing..', () => {
  it('is truthy', () => {
    expect(CheckboxGroup).toBeTruthy()
  })

  it('should render Checkbox option', () => {
    const wrapper = mount(
      <CheckboxGroup
        onChange={fn}
        orientation={false}
        spacing={10}
        checkboxSize='sm'
        checkOptions={checkOptions}
      />
    )
    expect(wrapper.find('input').length).toBe(1)
  })

  it('should render and select only selected option', () => {
    const wrapper = mount(
      <CheckboxGroup
        onChange={fn}
        orientation={false}
        spacing={10}
        checkboxSize='sm'
        checkOptions={checkOptions}
      />
    )
    expect(wrapper.find('value').at(0).prop('checked')).toBe(true)
    expect(wrapper.find('value').at(1).prop('checked')).toBe(false)
  })
})
