import React from 'react'
import { shallow } from '../../../../jest.setup'
import Loader from '.'

describe('Test Loader Component', () => {
  it('should be Truthy', () => {
    const wrapper = shallow(<Loader center fadeBackground />)
    expect(wrapper).toBeTruthy()
  })
})
