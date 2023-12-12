import React, { useState } from 'react'
import Modal from '.'
import { tVariant, tIntent } from '../../atoms/Button'
import Header from '../ModalHeader'
import ButtonList from '../ButtonList'

const Confirmation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onToggle = (value: boolean) => {
    setIsOpen(value)
  }

  return (
    <Modal
      open={isOpen}
      onToggle={(value: boolean) => {
        setIsOpen(value)
      }}
      children={{
        content: (
          <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
            <div>Are you sure you want to delete Order Number #1231747?</div>
            <div>This action cannot be undone.</div>
          </div>
        ),
        footer: (
          <ButtonList
            listOfButtons={[
              {
                variant: 'button' as tVariant,
                children: 'Cancel',
                intent: 'page' as tIntent,
                primary: true,
                onClick: () => onToggle(false)
              },
              {
                variant: 'button' as tVariant,
                children: 'OK',
                intent: 'page' as tIntent,
                onClick: () => console.log('onclick')
              }
            ]}
          />
        ),
        triggerComponent: (
          <div>
            <button onClick={() => onToggle(true)}>button 1</button>
            <button onClick={() => onToggle(true)}> button 2</button>
            <button onClick={() => onToggle(true)}>button 3</button>
          </div>
        ),
        header: (
          <Header
            headerTitle='Confirmation'
            handleClose={() => onToggle(false)}
            imageVariant='close'
          />
        )
      }}
      width='1171px'
    />
  )
}

export default Confirmation
