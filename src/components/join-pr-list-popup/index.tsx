'use client'

import dynamic from 'next/dynamic'
import { useContext, useState } from 'react'

import AppContext from '@/context'

import { bemClass } from '@/utils'

import Modal from '../modal'
import Text from '../text'

import './style.scss'

const JoinPrListPopupForm = dynamic(() => import('../join-pr-list-popup-form'))

const blk = 'join-pr-list'

const JoinPrListPopup = () => {
  const {
    joinPrList,
    toggleJoinPrListModal,
  } = useContext(AppContext)

  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)

  if (!joinPrList) {
    return null
  }

  const closeHandler = () => {
    toggleJoinPrListModal()
    setIsFormSubmitted(false)
  }

  const successCallback = () => {
    setIsFormSubmitted(true)
  }

  return (
    <Modal
      isClosable
      isCenter
      closeHandler={closeHandler}
      className={blk}
    >
      {!isFormSubmitted ?
        (
          <div className={bemClass([blk, 'container'])}>
            <Text
              tag="div"
              typography="xl"
              fontWeight="semi-bold"
              className={bemClass([blk, 'title'])}
            >
            SUBSCRIBE TO OUR PR LIST
            </Text>
            <JoinPrListPopupForm successCallback={successCallback} />
          </div>
        ) : (
          <div>
            <Text
              tag="div"
              typography="xxl"
              fontWeight="semi-bold"
              color="black"
              className={bemClass([blk, 'thank-you-title'])}
            >
            THANK YOU
            </Text>
            <Text
              tag="div"
              typography="s"
              className={bemClass([blk, 'thank-you-desc'])}
            >
              <p>You have successfully subscribed to our PR list.</p>
              <p>Our representative would soon get in touch with you.</p>
            </Text>
          </div>
        )
      }
    </Modal>
  )
}

export default JoinPrListPopup
