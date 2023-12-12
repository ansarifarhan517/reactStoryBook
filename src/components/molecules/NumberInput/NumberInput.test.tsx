import React from 'react'
import NumberInput from '.'
import { mount } from '../../../../jest.setup'

describe('NumberInput Unit testing..', () => {
  it('is truthy', () => {
    expect(NumberInput).toBeTruthy()
  })

  it('should render', () => {
    const wrapper = mount(<NumberInput id='someId' />)
    expect(wrapper.find('input').length).toBe(1)
  })

  it('Make sure only numbers are accepted', () => {
    const result = mount(<NumberInput id='someId' />)
    result.find('input').simulate('change', { target: { value: '1' } })
    expect(result.find('input').prop('value')).toEqual('1')
  })

  it('Make sure alphabets are rejected', () => {
    const result = mount(<NumberInput id='someId' />)
    result.find('input').simulate('change', { target: { value: 'a' } })
    expect(result.find('input').prop('value')).toEqual('')
  })

  // it('Make sure decimal values are accepted when allowDecimal is true', () => {
  //   const result = mount(<NumberInput id='someId' allowDecimal />)
  //   result.find('input').simulate('change', { target: { value: '1.1' } })
  //   expect(result.find('input').prop('value')).toEqual('1.1')
  // })

  // it('In case of Multiple decimal accept only first decimal', () => {
  //   const result = mount(<NumberInput allowDecimal />)
  //   result.find('input').simulate('change', { target: { value: '1.1.2' } })
  //   expect(result.find('input').prop('value')).toEqual('1.1')
  // })

  it('Complex aplhanumeric input should be blocked', () => {
    const result = mount(<NumberInput id='someId' />)
    result.find('input').simulate('change', { target: { value: 'abc123' } })
    expect(result.find('input').prop('value')).toEqual('123')
  })

  it('Special characters input should be blocked', () => {
    const result = mount(<NumberInput id='someId' />)
    result.find('input').simulate('change', { target: { value: '@$%^&' } })
    expect(result.find('input').prop('value')).toEqual('')
  })

  it('Special characters comma should be blocked', () => {
    const result = mount(<NumberInput id='someId' />)
    result.find('input').simulate('change', { target: { value: '10,00,000' } })
    expect(result.find('input').prop('value')).toEqual('1000000')
  })
})
