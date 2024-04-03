'use client'
import { bemClass } from '@/utils'

import Button from '@/components/button'
import ModalTriggerButton from '@/components/modal-trigger-button'

import './style.scss'

const blk = 'footer-actions'

const FooterActions = () => (
  <div className={bemClass([blk])}>
    <ModalTriggerButton modalType="subscribe-to-newsletter" category="primary">
      SUBSCRIBE TO OUR NEWSLETTER
    </ModalTriggerButton>
    <Button
      type="button"
      category="secondary"
      disabled={false}
      asLink
      href="https://www.loginextsolutions.com/blog"
    >
      LOGINEXT BLOG
    </Button>
  </div>
)

export default FooterActions
