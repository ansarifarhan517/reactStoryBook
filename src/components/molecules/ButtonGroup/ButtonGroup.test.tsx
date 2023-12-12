import React from 'react'
import { mount } from '../../../../jest.setup'
import ButtonGroupComponent from '.'

const fn = jest.fn()
describe('ButtonGroup Unit testing..', () => {
  it('is truthy', () => {
    expect(ButtonGroupComponent).toBeTruthy()
  })

  it('should render', () => {
    const wrapper = mount(
      <ButtonGroupComponent
        data={[
          { id: 'year', label: 'Year', selected: true },
          { id: 'month', label: 'Month' }
        ]}
        onChange={fn}
      />
    )
    expect(wrapper.find('span').length).toBe(2)
  })
  it('should render and select only selected option', () => {
    const wrapper = mount(
      <ButtonGroupComponent
        onChange={fn}
        data={[
          { id: 'year', label: 'Year' },
          { id: 'month', label: 'Month', selected: true }
        ]}
      />
    )
    expect(wrapper.find('#month').at(0).prop('selected')).toBe(true)
  })
  it('onchange should get called', () => {
    const wrapper = mount(
      <ButtonGroupComponent
        onChange={fn}
        data={[
          { id: 'year', label: 'Year' },
          { id: 'month', label: 'Month', selected: true }
        ]}
      />
    )
    wrapper.find('#year').at(0).simulate('click', { id: 'year' })
    expect(fn).toBeCalled()
  })
})
