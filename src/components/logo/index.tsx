import Image from 'next/image'
import Link from 'next/link'

import { bemClass } from '@/utils'

import logo from '/public/logo.webp'
import logoWhite from '/public/logo_red_white.webp'

import './style.scss'

type logoProps = {
  isOpaque?: boolean
}

const blk = 'logo'

const Logo = ({ isOpaque }: logoProps) => (
  <div className={blk}>
    <Link href="/" className={bemClass([blk, 'mobile', { visible: !!isOpaque }])}>
      <Image
        src={logo}
        alt="logo"
        width={130}
        height={32}
        priority
        data-auto-id="home"
      />
    </Link>
    <Link href="/" className={bemClass([blk, 'desktop', { hidden: !!isOpaque }])}>
      <Image
        src={logoWhite}
        alt="logo"
        width={130}
        height={32}
        priority
      />
    </Link>
  </div>
)

export default Logo
