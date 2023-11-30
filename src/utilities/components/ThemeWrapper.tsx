import React from 'react'
import { getDefaultTheme } from '../theme'
import { ThemeProvider } from 'styled-components'

interface IWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: object;
}

const ThemeWrapper: React.FC<IWrapperProps> = ({ children, theme = getDefaultTheme() }) => {
  const WrapperComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => (
    <React.Fragment>{children}</React.Fragment>
  )

  return (
    <ThemeProvider theme={theme}>
      <WrapperComponent>{children}</WrapperComponent>
    </ThemeProvider>
  )
}

export default ThemeWrapper
