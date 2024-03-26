import React from 'react'
import {ITab} from "./TabModel";


const Tab: React.FC<ITab> = ({ children }) => {
  return <div>{children}</div>
}

export default Tab;