import React from 'react'
import { ThemeProvider } from 'styled-components';

import { getDefaultTheme } from 'ui-library';
import { ComponentType } from 'react';
import MainContentContainer from './layouts/MainContentContainer';

export const theme = getDefaultTheme()

export const withThemeProvider = <P extends object = {}>(Component: ComponentType<P>, withMain = true) => (props: P) =>
(<ThemeProvider theme={theme}>
  {withMain ? (<MainContentContainer>
    <Component {...props} />
  </MainContentContainer>)
    : <Component {...props} />}
</ThemeProvider>)
