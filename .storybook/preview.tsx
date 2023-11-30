import React from 'react';
import { Preview } from '@storybook/react';
import ThemeWrapper from '../src/utilities/components/ThemeWrapper';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};



export default preview;