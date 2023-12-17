import React from 'react'
import { Button, TextInput } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'login-app'

const LoginApp: React.FC = () => {
  const loginHandler = () => {
    sessionStorage.setItem('userLoggedIn', 'true')
    window.location.replace('/')
  }
  return (
    <div className={blk}>
      <div className={bemClass([blk, 'content'])}>
        <h2 className={bemClass([blk, 'title'])}>Login into LogiCMS</h2>
        <TextInput type="text" label="Username" />
        <TextInput label="Password" type="password" />
        <div className={bemClass([blk, 'footer'])}>
          <Button className={bemClass([blk, 'button'])} clickHandler={loginHandler}>Login</Button>
        </div>
      </div>
    </div>
  )
}

export default LoginApp
