'use client'

import { useContext, useState } from 'react'

import { bemClass } from '@/utils'

import AppContext from '@/context'

import signUpPopupConfig from './config'
import PlatformCard from './component/platform-card'

import './style.scss'

const blk = 'sign-up-popup'

const SignUpPopup = () => {
  const { signUpModal, toggleSigUpModal } = useContext(AppContext)
  const [hide, hideModal] = useState<boolean>(false)

  if (!signUpModal) {
    return null
  }

  const onCloseHandler = () => {
    hideModal(true)
    setTimeout(() => {
      toggleSigUpModal()
      hideModal(false)
    }, 300)
  }

  return (
    <div className={bemClass([blk, { hide }])}>
      <button
        onClick={onCloseHandler}
        aria-label="close"
        className={bemClass([blk, 'close'])}
        data-auto-id="sign_up_popup_close"
      >
        &times;
      </button>
      <div className={bemClass([blk, 'content'])}>
        {signUpPopupConfig.map(({ id, name, description, image }) => (
          <PlatformCard
            key={id}
            id={id}
            name={name}
            description={description}
            image={image}
            closeHandler={onCloseHandler}
            dataAutoId={`sign_up_popup_card_${id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default SignUpPopup
