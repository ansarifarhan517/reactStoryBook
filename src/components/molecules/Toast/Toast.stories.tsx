import React from 'react'
import { path } from '..'
import { useToast } from '.'
import Themewrapper from '../../../utilities/components/ThemeWrapper'
import Button from '../../atoms/Button'
import { IToastProps } from './interfaces'

import { withKnobs, text, boolean } from '@storybook/addon-knobs'

export default {
  title: `${path}/Toast`,
  decorators: [withKnobs]
}

export const withBasic = () => {
  return (
    <Themewrapper>
      <TriggerToast />
    </Themewrapper>
  )
}

const TriggerToast = () => {
  const toast = useToast()

  const showToast = () =>
    toast.add(
      text('Message', 'This is a Toast message'),
      text('Icon Variant', 'check-round'),
      boolean('RemoveButton', true)
    ) as IToastProps

  return (
    <Themewrapper>
      <Button variant='button' onClick={showToast}>
        Show me a toast
      </Button>
    </Themewrapper>
  )
}
