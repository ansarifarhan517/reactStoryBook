'use client'

import { useContext, FormEvent, useCallback } from 'react'
import AppContext from '@/context'

import Button, { ButtonProps } from '../button'

interface ModalTriggerButtonProps extends ButtonProps {
  modalType: 'sign-up' | 'talk-to-us' | 'schedule-a-demo' | 'join-pr-list' | 'subscribe-to-newsletter';
  dataAutoId?: string;
}

const ModalTriggerButton = ({
  modalType,
  children,
  dataAutoId,
  ...rest
}: ModalTriggerButtonProps) => {
  const {
    toggleSigUpModal,
    toggleTalkToUsModal,
    toggleScheduleDemoModal,
    toggleJoinPrListModal,
    toggleSubscribeToNewsletterModal,
    country
  } = useContext(AppContext)

  const btnClickHandler = useCallback((e?: FormEvent) => {
    switch (modalType) {
    case 'sign-up': {
      toggleSigUpModal(e)
      break
    }
    case 'schedule-a-demo': {
      toggleScheduleDemoModal(e)
      break
    }
    case 'talk-to-us': {
      toggleTalkToUsModal(e)
      break
    }
    case 'join-pr-list': {
      toggleJoinPrListModal(e)
      break
    }
    case 'subscribe-to-newsletter': {
      toggleSubscribeToNewsletterModal(e)
      break
    }
    default: {
      return null
    }
    }
  }, [modalType, toggleSigUpModal, toggleTalkToUsModal, toggleScheduleDemoModal, toggleJoinPrListModal, toggleSubscribeToNewsletterModal])

  if ((country && country !== 'IN') || modalType === 'talk-to-us' || modalType === 'join-pr-list' || modalType === 'subscribe-to-newsletter') {
    return (
      <Button
        {...rest}
        clickHandler={btnClickHandler}
        dataAutoId={dataAutoId}
      >
        {children}
      </Button>
    )
  }

  return null
}

export default ModalTriggerButton
