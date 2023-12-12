import React from 'react'
import { mount } from '../../../../jest.setup'
import Button from '.'

describe('Button Unit testing..', () => {
  it('is truthy', () => {
    expect(Button).toBeTruthy()
  })

  it('should render', () => {
    const wrapper = mount(<Button>Test</Button>)
    expect(wrapper.find('button').length).toBe(1)
  })

  it('is clickable', () => {
    const fn = jest.fn()
    const wrapper = mount(<Button onClick={fn}>Test</Button>)
    wrapper.simulate('click')
    expect(fn).toBeCalled()
  })

  it('if disabled, should not be clickable', () => {
    const fn = jest.fn()
    const wrapper = mount(
      <Button onClick={fn} disabled>
        Test
      </Button>
    )
    wrapper.simulate('click')
    expect(fn).not.toHaveBeenCalled()
  })
})
