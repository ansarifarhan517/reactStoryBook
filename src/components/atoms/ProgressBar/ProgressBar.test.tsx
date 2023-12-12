import React from 'react'
import { shallow } from '../../../../jest.setup'
import ProgressBar from '.'

describe('Test ProgressBar Component', () => {
  it('should be Truthy', () => {
    const wrapper = shallow(<ProgressBar />)
    expect(wrapper).toBeTruthy()
  })
})
