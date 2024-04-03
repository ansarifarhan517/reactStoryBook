import Image from 'next/image'
import Link from 'next/link'

import { bemClass } from '@/utils'

import HubSpotForm from '@/components/hub-spot-form'
import Text from '@/components/text'

import logo from '/public/logo.webp'

import './style.scss'

const blk = 'customer-nps'

const CustomerNps = () => (
  <div className={blk}>
    <div className={bemClass([blk, 'container'])}>
      <Link href="/" className={bemClass([blk, 'logo'])} data-auto-id="home">
        <Image src={logo} alt="logo" width={130} height={32} priority />
      </Link>
      <Text
        tag="h1"
        typography="xxl"
        fontWeight="semi-bold"
        color="gray-dark"
        className={bemClass([blk, 'title'])}
      >
        We value your feedback :)
      </Text>
      <div className={bemClass([blk, 'desc'])}>
        <Text tag="p" typography="s" fontWeight="normal" color="gray-dark">
          <Text fontWeight="bold" tag="span">
            Note:
          </Text>{' '}
          Please rate us from 1 - 10, 10 being the highest.
        </Text>
      </div>
      <HubSpotForm formId="92ee1ae6-4d6e-49e7-aab3-080378204076" />
    </div>
  </div>
)

export default CustomerNps
