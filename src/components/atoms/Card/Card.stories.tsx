import { Meta, StoryObj } from "@storybook/react";
import Card from ".";
import { text, withKnobs } from "@storybook/addon-knobs";


type Story = StoryObj<typeof meta>;

const meta: Meta<typeof Card> = {
  title: 'UI Library/Atoms/Card',
  component: Card,
  decorators: [withKnobs],

}

export default meta

export const CardStory:Story = {
    args: {
        children:text('children','This is Card')
    }
} 