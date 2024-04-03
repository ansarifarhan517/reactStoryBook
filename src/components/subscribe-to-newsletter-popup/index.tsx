'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

import AppContext from '@/context'

import { bemClass } from '@/utils'

import Modal from '../modal'
import Text from '../text'

import './style.scss'

const NewsletterPRForm = dynamic(() => import('../newsletter-pr-form'))

const blk = 'subscribe-to-newsletter'

const SubscribeToNewsletter = () => {
  const router = useRouter()
  const {
    subscribeToNewsletter,
    toggleSubscribeToNewsletterModal,
  } = useContext(AppContext)

  if (!subscribeToNewsletter) {
    return null
  }

  const successCallback = () => {
    toggleSubscribeToNewsletterModal()
    router.push('/thank-you')
  }

  return (
    <Modal
      isClosable
      isCenter
      closeHandler={toggleSubscribeToNewsletterModal}
      className={blk}
    >
      <div className={bemClass([blk, 'container'])}>
        <Text
          tag="div"
          typography="xl"
          fontWeight="semi-bold"
          className={bemClass([blk, 'title'])}
        >
          SUBSCRIBE TO OUR NEWSLETTER
        </Text>
        <NewsletterPRForm successCallback={successCallback} />
      </div>
    </Modal>
  )
}

export default SubscribeToNewsletter
