import React from 'react'
import { shallow, mount } from '../../../../jest.setup'
import ErrorTooltip from '.'

const message = 'test message'
describe('Error Tooltip Component', () => {
  it('No tooltip should be displayed by default', () => {
    const wrapper = mount(<ErrorTooltip message={message} />)
    expect(wrapper.text()).not.toContain(message)
  })

  it('On Hover, message provided should be displayed', () => {
    const wrapper = shallow(<ErrorTooltip message={message} />)
    expect(wrapper.find('Tooltip').prop('hover')).toBe(true)
    expect(wrapper.find('Tooltip').prop('title')).toBe(message)
  })
})
