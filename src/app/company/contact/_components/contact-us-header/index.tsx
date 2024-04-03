import React from 'react'

import Container from '@/components/container'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'contact-us-header'

type contactUsHeaderProps = {
  dataAutoId?: string
}

const ContactUsHeader = ({ dataAutoId }: contactUsHeaderProps) => (
  <Container className={bemClass([blk])}>
    <>
      <Text
        tag="h1"
        typography="xxxl"
        fontWeight="bold"
        color="white"
        dataAutoId={`${dataAutoId}_title`}
      >
        We&apos;d love to hear from you
      </Text>
      <Text typography="m" tag="p" color="white" className={bemClass([blk, 'sub-heading'])} dataAutoId={`${dataAutoId}_desc`}>
        We are eager to discuss your business needs and answer any questions you
        may have.
      </Text>
    </>
  </Container>
)

export default ContactUsHeader
