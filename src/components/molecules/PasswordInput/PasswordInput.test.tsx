import React from 'react'
import { mount } from '../../../../jest.setup'
import PasswordInput from '.'

describe('PasswordInput Unit testing..', () => {
  it('is truthy', () => {
    expect(PasswordInput).toBeTruthy()
  })

  it('should render input tag', () => {
    const wrapper = mount(<PasswordInput />)
    expect(wrapper.find('input[type="password"]').length).toBe(1)
  })

  it('should trigger change event', () => {
    const fn = jest.fn()
    const wrapper = mount(<PasswordInput onChange={fn} />)
    wrapper.find('input').simulate('change')
    expect(fn).toBeCalled()
  })
})
