import type { Meta, StoryObj } from '@storybook/react'
import Button from '..' // Update the import path accordingly


const meta: Meta<typeof Button> = {
  title: 'UI Library/Atoms/Buttons/Light',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>;

export const LightPrimary: Story = {
  args: {
    btn: 'lightPrimary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Primary',
  },
}



export const lightSecondary = {
  args: {
    btn: 'lightSecondary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Secondary',
  },
}

export const lightError = {
  args: {
    btn: 'lightError',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Error',
  },
}

export const lightSuccess = {
  args: {
    btn: 'lightSuccess',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Success',
  },

}

export const lightWarning = {
  args: {
    btn: 'lightWarning',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Warning',
  },
}