'use client'

import Link from 'next/link'
import { useState } from 'react'

import { bemClass } from '@/utils'

import Modal from '../modal'
import HubSpotForm from '../hub-spot-form'
import Text from '../text'

import './style.scss'

type newsTickerProps = {
  message: string;
  linkLabel: string;
  href: string;
  formId?: string;
  closeHandler?: () => void;
  className?: string;
}

const blk = 'news-ticker'

const NewsTicker = ({
  message,
  linkLabel,
  href,
  formId = '',
  closeHandler,
  className,
}: newsTickerProps) => {
  const [showForm, setShowForm] = useState<boolean>(false)

  const toggelHusbSpotFormModal = () => {
    setShowForm(!showForm)
  }

  return (
    <>
      <div className={bemClass([blk, {}, className])} data-auto-id="news-ticker">
        <div className={bemClass([blk, 'message'])}>
          <Text tag="span" typography="m" color="white">
            {message}
          </Text>
          {formId && (
            <button
              className={bemClass([blk, 'link'])}
              onClick={toggelHusbSpotFormModal}
              data-auto-id="news-ticker-button"
            >
              {linkLabel}
            </button>
          )}
          {!formId && (
            <Link
              href={href}
              className={bemClass([blk, 'link'])}
              data-auto-id="news-ticker-link"
            >
              {linkLabel}
            </Link>
          )}
        </div>
        <button
          className={bemClass([blk, 'close'])}
          onClick={closeHandler}
        >
          &times;
        </button>
      </div>
      {showForm && (
        <Modal
          isClosable
          isCenter
          closeHandler={toggelHusbSpotFormModal}
          className={bemClass([blk, 'hubspot-form'])}
        >
          <HubSpotForm
            formId={formId}
          />
        </Modal>
      )}
    </>
  )
}

export default NewsTicker
