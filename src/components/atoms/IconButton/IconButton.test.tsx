import React from 'react'
import { mount } from '../../../../jest.setup'
import IconButtonComponent from '.'
const fn = jest.fn()

describe('IconButton Unit testing..', () => {
  it('is truthy', () => {
    expect(IconButtonComponent).toBeTruthy()
  })

  it('should the render', () => {
    const wrapper = mount(
      <IconButtonComponent iconVariant='add' iconSize='xs'>
        Test
      </IconButtonComponent>
    )

    expect(wrapper.find('button').length).toBe(1)
  })

  it('should be clickable ', () => {
    const wrapper = mount(
      <IconButtonComponent iconVariant='add' iconSize='xs' onClick={fn}>
        Test
      </IconButtonComponent>
    )
    wrapper.find('Button').simulate('click')
    expect(fn).toBeCalled()
  })

  it(' if disabled, should not be clickable ', () => {
    const wrapper = mount(
      <IconButtonComponent
        iconVariant='add'
        iconSize='xs'
        onClick={fn}
        disabled
      >
        Test
      </IconButtonComponent>
    )
    expect(wrapper.find('button').prop('disabled')).toBe(true)
  })
})
