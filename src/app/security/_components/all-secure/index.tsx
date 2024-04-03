import React from 'react'

import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import './style.scss'


const blk = 'all-secure'

const AllSecure = () => (
  <Container className={blk}>
    <ProductInformativeContent
      title="When you are secure, you are complete"
      description={`Secure your logistics movement through totally encrypted data transfers and interactions. 
                  Guide people, processes, and protocol around industry-leading security standards and measures.
      `}
      className={bemClass([blk, 'information'])}
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary">
        Learn More
      </ModalTriggerButton>
    </ProductInformativeContent>
    <AnimatedCoverPage
      className={bemClass([blk, 'animation'])}
      containerClassName={bemClass([blk, 'animated-container'])}
      animationPath="/animation-data/all-secure.json"
    />
  </Container>
)

export default AllSecure
