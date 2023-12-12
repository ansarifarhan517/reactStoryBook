import React from 'react'

const LayerContext: any = React.createContext({})

const LayerContextProvider = ({ children }: any) => {
  const defaultValue = {}

  return (
    <LayerContext.Provider value={defaultValue}>
      {children}
    </LayerContext.Provider>
  )
}

export { LayerContext, LayerContextProvider }
