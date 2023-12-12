import React from 'react'
import { withKnobs, boolean, object } from '@storybook/addon-knobs'
import Modal from '.'
import { path } from '..'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import Header from '../ModalHeader'
import { action } from '@storybook/addon-actions'
import Confirmation from './Confirmation'
import ButtonList from '../ButtonList'

export default {
  title: `${path}/Modal`,
  decorators: [withKnobs],
  component: Modal
}

export const ModalComponent = () => {
  return (
    <ThemeWrapper>
      <Modal
        open={boolean('open', true)}
        onToggle={action('Popup Open Close handled')}
        children={{
          triggerComponent: (
            <div>
              <button onClick={action('Button1 Clicked')}>button 1</button>
              <button onClick={action('Button2 Clicked')}> button 2</button>
              <button onClick={action('Button3 Clicked')}>button 3</button>
            </div>
          ),
          header: (
            <Header
              headerTitle='Confirmation'
              handleClose={action('Close Modal Clicked')}
              imageVariant='close'
            />
          ),
          content: (
            <div style={{ fontSize: '14px', color: '#4c4c4c' }}>
              <div>Are you sure you want to delete Order Number #1231747?</div>
              <div>This action cannot be undone.</div>
            </div>
          ),
          footer: (
            <ButtonList
              listOfButtons={object('listOfButtons', [
                {
                  variant: 'button',
                  children: 'Cancel',
                  intent: 'page',
                  primary: true,
                  onClick: action('Cancel Clicked')
                },
                {
                  variant: 'button',
                  children: 'Ok',
                  intent: 'page',
                  onClick: action('Ok Clicked')
                }
              ])}
            />
          )
        }}
        width='1171px'
      />
    </ThemeWrapper>
  )
}

export const ConfirmationModal = () => (
  <ThemeWrapper>
    <Confirmation />
  </ThemeWrapper>
)
