import Button from '..'
import { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof meta>;

const meta: Meta<typeof Button> = {
  title: 'UI Library/Atoms/Buttons/Defaults',
  component: Button,

}

export default meta

export const Primary: Story = {
  args: {
    btn: 'primary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Primary',
  },
}

export const Secondary = {
  args: {
    btn: 'secondary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Secondary',
  },
}

export const Error = {
  args: {
    btn: 'error',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Error',
  },
}

export const Success = {
  args: {
    btn: 'success',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Success',
  },
}

export const Warning = {
  args: {
    btn: 'warning',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Warning',
  },
}
export const Info = {
  args: {
    btn: 'info',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Info',
  },
}

export const Light = {
  args: {
    btn: 'light',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Light',
  },
}

export const Dark = {
  args: {
    btn: 'dark',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'Dark',
  },
}