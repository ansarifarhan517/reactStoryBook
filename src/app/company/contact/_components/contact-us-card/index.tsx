import React from 'react'
import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'
import Text from '@/components/text'

import './style.scss'

const blk = 'contact-us-card'

type contactUsCardProps = {
  image: StaticImageData;
  label: string;
  contact: string;
  dataAutoId?: string;
}

const ContactUsCard = ({
  image,
  label,
  contact,
  dataAutoId
}: contactUsCardProps) => (
  <a className={bemClass([blk, {}, 'slide-fade-in-delay-1'])} href={`tel:${contact}`}>
    <div className={bemClass([blk, 'container', {}, 'box-hover-effect'])}>
      <Image
        src={image}
        alt={`${label}-image`}
        className={bemClass([blk, 'image'])}
        data-auto-id={`${dataAutoId}_image`}
      />
      <Text
        tag="h2"
        typography="l"
        className={bemClass([blk, 'label'])}
        dataAutoId={`${dataAutoId}_label`}
      >
        {label}
      </Text>
      <div className={bemClass([blk, 'divider-centered'])} />
      <Text tag="p" dataAutoId={`${dataAutoId}_contact`}>
        {contact}
      </Text>
    </div>
  </a>
)

export default ContactUsCard
