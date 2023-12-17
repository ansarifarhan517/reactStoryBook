// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { createRoot } from 'react-dom/client'
import App  from './src/app'

if (process.env.IS_MOCK) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require('./mocks/handlers')
  worker.start({
    onUnhandledRequest: 'bypass',
  })
}

const rootElement = document.getElementById('app')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<App />)
}
