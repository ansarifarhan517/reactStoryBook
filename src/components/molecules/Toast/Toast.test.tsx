import React from 'react'
import { shallow } from '../../../../jest.setup'
import Themewrapper from '../../../utilities/components/ThemeWrapper'
import { useToast } from '.'
import Button from '../../atoms/Button'

const TriggerToast = () => {
  const toast = useToast()

  const fn = jest.fn(toast.add('This is a Toast message', 'check-round', false))

  return (
    <div>
      <Button variant='button' onClick={fn}>
        Show me a toast
      </Button>
    </div>
  )
}

describe('Toast Component', () => {
  it('should be Truthy', () => {
    const wrapper = shallow(
      <Themewrapper>
        <TriggerToast />
      </Themewrapper>
    )
    expect(wrapper).toBeTruthy()
  })

  it('should Mount component Toast on calling add function', () => {
    const wrapper = shallow(
      <Themewrapper>
        <TriggerToast />
      </Themewrapper>
    )
    wrapper.simulate('click')
    expect('Toast').toBeTruthy()
  })

  it('should be able to access context value ', () => {})
  it('should be executing add funtion on click', () => {})
  it('should be executing remove funtion', () => {})
})
