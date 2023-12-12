import React from 'react'

import { ThemeProvider } from 'styled-components'
import { getDefaultTheme } from '../theme'
import { withGlobalStyled } from './GlobalStyled'
// import useHoverTooltip from './useHoverTooltip'
import withPopup from './withPopup'
import { withToastProvider } from '../../components/molecules/Toast/'
import '../../assets/font-icons/styles.css'
// marker clusterer css
import 'react-leaflet-markercluster/dist/styles.min.css'

export interface IThemeWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any
}

const ThemeWrapper = ({
  children,
  theme = getDefaultTheme()
}: IThemeWrapperProps) => {
  // useHoverTooltip()

  const WrapperComponent = ({
    children
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <React.Fragment>{children}</React.Fragment>
  )
  const ConfigComponent = withToastProvider(
    withGlobalStyled(withPopup(WrapperComponent))
  )

  return (
    <ThemeProvider theme={theme}>
      <ConfigComponent>{children}</ConfigComponent>
    </ThemeProvider>
  )
}

export default ThemeWrapper
