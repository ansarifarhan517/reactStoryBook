import Button from '..'
import { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof meta>;

const meta: Meta<typeof Button> = {
  title: 'UI Library/Atoms/Buttons/Outline',
  component: Button,

}

export default meta

export const OutlinePrimary: Story = {
  args: {
    btn: 'outlinePrimary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlinePrimary',
  },
}

export const OutlineSecondary = {
  args: {
    btn: 'outlineSecondary',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineSecondary',
  },
}

export const OutlineError = {
  args: {
    btn: 'outlineError',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineError',
  },
}

export const OutlineSuccess = {
  args: {
    btn: 'outlineSuccess',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineSuccess',
  },
}

export const OutlineWarning = {
  args: {
    btn: 'outlineWarning',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineWarning',
  },
}
export const OutlineInfo = {
  args: {
    btn: 'outlineInfo',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineInfo',
  },
}

export const OutlineLight = {
  args: {
    btn: 'outlineLight',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineLight',
  },
}

export const OutlineDark = {
  args: {
    btn: 'outlineDark',
    variant: 'button',
    intent: 'default',
    disabled: false,
    children: 'OutlineDark',
  },
}