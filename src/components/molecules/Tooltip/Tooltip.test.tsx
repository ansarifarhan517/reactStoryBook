import React from 'react'

import Tooltip from '.'
import { shallow } from '../../../../jest.setup'
import Button from '../../atoms/Button'

const tooltipTitle = 'This is a tooltip message.'
describe('Tooltip Component', () => {
  it('is truthy', () => {
    expect(Tooltip).toBeTruthy()
  })
  it('should render the child component', () => {
    const wrapper = shallow(
      <Tooltip message={tooltipTitle}>
        <Button>My Button</Button>
      </Tooltip>
    )
    expect(wrapper.find('Button').length).toBe(1)
  })
  it('should display the tooltip text correctly', () => {
    const wrapper = shallow(
      <Tooltip message={tooltipTitle}>
        <Button>My Button</Button>
      </Tooltip>
    )
    expect(wrapper.find('[data-testid="tooltipTitle"]').children().text()).toBe(
      tooltipTitle
    )
  })
  it('should not show tooltip by default in hover mode.', () => {
    const wrapper = shallow(
      <Tooltip message={tooltipTitle} hover>
        <Button>My Buttom</Button>
      </Tooltip>
    )

    expect(
      wrapper.find('[data-testid="tooltipContainer"]').exists()
    ).not.toBeTruthy()
  })

  it('should show tooltip on hover in hover mode.', () => {
    const wrapper = shallow(
      <Tooltip message={tooltipTitle} hover>
        <Button>My Buttom</Button>
      </Tooltip>
    )

    wrapper.find('[data-testid="children"]').simulate('mouseover')

    expect(
      wrapper.find('[data-testid="tooltipContainer"]').exists()
    ).toBeTruthy()

    wrapper.find('[data-testid="children"]').simulate('mouseout')
    expect(
      wrapper.find('[data-testid="tooltipContainer"]').exists()
    ).not.toBeTruthy()
  })

  it('should show tooltip by default when not in hover mode.', () => {
    const wrapper = shallow(
      <Tooltip message={tooltipTitle}>
        <Button>My Buttom</Button>
      </Tooltip>
    )

    expect(
      wrapper.find('[data-testid="tooltipContainer"]').exists()
    ).toBeTruthy()
  })
})
