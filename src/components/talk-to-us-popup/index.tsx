'use client'

import dynamic from 'next/dynamic'

import { useContext } from 'react'
import AppContext from '@/context'

const Modal = dynamic(() => import('../modal'))
const HubSpotForm = dynamic(() => import('../hub-spot-form'))

import './style.scss'

const blk = 'talk-to-us-popup'

const TalkTousPopup = () => {
  const {
    talkToUs,
    toggleTalkToUsModal,
  } = useContext(AppContext)

  if (!talkToUs) {
    return null
  }

  return (
    <Modal
      isClosable
      isCenter
      closeHandler={toggleTalkToUsModal}
      className={blk}
    >
      <HubSpotForm
        formId="3fab426f-b333-4073-a009-84feef71cab9"
      />
    </Modal>
  )
}

export default TalkTousPopup
