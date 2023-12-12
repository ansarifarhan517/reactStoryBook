import ModalContainer from '.'
import React from 'react'
import Modal from 'styled-react-modal'
import { mount, shallow } from '../../../../jest.setup'

const fn = jest.fn()

describe('Modal Component', () => {
  it('should be Truthy', () => {
    const wrapper = shallow(
      <ModalContainer
        open={true}
        onToggle={fn}
        children={{
          content: (
            <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
              <div>Are you sure you want to delete Order Number #1231747?</div>
              <div>This action cannot be undone.</div>
            </div>
          ),
          footer: <div>footer</div>,
          triggerComponent: (
            <div>
              <button onClick={fn}>button 1</button>
            </div>
          ),
          header: <div>header</div>
        }}
        width='1171px'
      />
    )

    expect(wrapper).toBeTruthy()
    expect(wrapper.find(Modal).prop('isOpen')).toBe(true)
  })
  it('renders react-modal and check for open props, it has to be true', () => {
    const wrapper = mount(
      <ModalContainer
        open={false}
        onToggle={fn}
        children={{
          content: (
            <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
              <div>Are you sure you want to delete Order Number #1231747?</div>
              <div>This action cannot be undone.</div>
            </div>
          ),
          footer: <div>footer</div>,
          triggerComponent: (
            <div>
              <button onClick={fn}>button 1</button>
            </div>
          ),
          header: <div>header</div>
        }}
        width='1171px'
      />
    )
    expect(wrapper.find(Modal)).toHaveLength(1)
    expect(wrapper.find(Modal).prop('isOpen')).toBe(false)
  })
  it('onclick simulation', () => {
    const wrapper = mount(
      <ModalContainer
        open={false}
        onToggle={fn}
        children={{
          content: (
            <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
              <div>Are you sure you want to delete Order Number #1231747?</div>
              <div>This action cannot be undone.</div>
            </div>
          ),
          footer: <div>footer</div>,
          triggerComponent: (
            <div>
              <button onClick={fn}>button 1</button>
            </div>
          ),
          header: <div>header</div>
        }}
        width='1171px'
      />
    )
    wrapper.find('button').at(0).simulate('click')
    expect(fn).toBeCalled()
  })
})
