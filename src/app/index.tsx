import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import '../sass/global.scss'

const LoginApp = lazy(async () => await import(/* webpackChunkName: "loginApp" */'./login-app'))
const BrowseApp = lazy(async () => await import(/* webpackChunkName: "browseApp" */'./browse-app'))

const App: React.FC = () => {
  const isUserLoggedIn = !!sessionStorage.getItem('userLoggedIn')
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename="/">
        { isUserLoggedIn ? <BrowseApp /> : <LoginApp />}
      </Router>
    </Suspense>
  )
}

export default App
