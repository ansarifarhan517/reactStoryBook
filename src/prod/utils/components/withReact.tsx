import React, { useEffect, useState } from 'react'
import { withToastProvider, withPopup } from 'ui-library'
import { withThemeProvider } from '../theme'
import withRedux from '../redux/withRedux'

export const withReactOptimized = <P extends object>(Component: React.ComponentType<P>, withMain:boolean = true ,toastPortalId: string = 'toast-inject-here') =>
  (props: P) => {

    const [WrappedComponent,setWrappedComponent] = useState<React.ComponentType<P>>()
    useEffect(() => {
      setWrappedComponent(() => withThemeProvider(withToastProvider(withRedux(withPopup(Component)), toastPortalId), withMain))
    }, [Component])

    // const WrappedComponent = withThemeProvider(withToastProvider(withRedux(withPopup(Component)), toastPortalId))
    return WrappedComponent ? <WrappedComponent {...props as P} /> : <div />

  }


const withReact = <P extends object>(Component: React.ComponentType<P>, toastPortalId: string = 'toast-inject-here') =>
  (props: P) => {
    const WrappedComponent = withThemeProvider(withToastProvider(withRedux(withPopup(Component)), toastPortalId))
    return <WrappedComponent {...props as P} />

  }



export default withReact