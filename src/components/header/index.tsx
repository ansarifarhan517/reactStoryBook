import React from 'react'
import { Button } from '@base'
import './style.scss'

const Header: React.FC = () => {
  const logOutHandler = () => {
    sessionStorage.removeItem('userLoggedIn')
    window.location.replace('/')
  }
  return (
    <div className="header">
      <h2>LogiCMS</h2>
      <Button category="secondary" clickHandler={logOutHandler}>Log out</Button>
    </div>
  )
}

export default Header
