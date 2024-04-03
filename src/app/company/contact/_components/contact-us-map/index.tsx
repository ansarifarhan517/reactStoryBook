import React from 'react'
import Image from 'next/image'

import { bemClass } from '@/utils'

import contactFooterBg from '/public/company-navigation/contact-us/contact-footer-bg.webp'

import './style.scss'

const blk = 'contact-us-map'

type contactUsMapProps = {
  dataAutoId?: string
}

const ContactUsMap = ({ dataAutoId }: contactUsMapProps) => (
  <div className={bemClass([blk])}>
    <Image
      src={contactFooterBg}
      alt="Contact us location map"
      className={bemClass([blk, 'image'])}
      data-auto-id={`${dataAutoId}_image`}
    />
    <div className={bemClass([blk, 'location', ['location-1']])} data-auto-id={`${dataAutoId}_location_1`} />
    <div className={bemClass([blk, 'location', ['location-2']])} data-auto-id={`${dataAutoId}_location_2`} />
    <div className={bemClass([blk, 'location', ['location-3']])} data-auto-id={`${dataAutoId}_location_3`} />
    <div className={bemClass([blk, 'location', ['location-4']])} data-auto-id={`${dataAutoId}_location_4`} />
    <div className={bemClass([blk, 'location', ['location-5']])} data-auto-id={`${dataAutoId}_location_5`} />
    <div className={bemClass([blk, 'location', ['location-6']])} data-auto-id={`${dataAutoId}_location_6`} />
    <div className={bemClass([blk, 'location', ['location-7']])} data-auto-id={`${dataAutoId}_location_7`} />
    <div className={bemClass([blk, 'location', ['location-8']])} data-auto-id={`${dataAutoId}_location_8`} />
    <div className={bemClass([blk, 'location', ['location-9']])} data-auto-id={`${dataAutoId}_location_9`} />
  </div>
)

export default ContactUsMap
