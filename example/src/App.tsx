import React from 'react'

import { Button, getDefaultTheme } from 'ui-library'
import 'ui-library/dist/index.css';
import 'ui-library/dist/font-icons/styles.css'
// import './font-icons/styles.css';
import { ThemeProvider } from 'styled-components';

const App = () => {
  return (
    <ThemeProvider theme={getDefaultTheme()}>
      {/* <ExampleComponent text="Create React Library Example 😄" /> */}
      <Button primary underline variant="link">Hello World</Button>
      <i className="icon icon-approve" style={{color: '#000'}}></i>
    </ThemeProvider>)
}

export default App
