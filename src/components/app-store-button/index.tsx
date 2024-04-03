import Link from 'next/link'

import { bemClass } from '@/utils'

import PlayStore from './play-store'
import AppStore from './app-store'

import './style.scss'

type appStoreButtonProps = {
  category?: 'primary' | 'secondary'
  align?: 'vertical' | 'hozironatal',
  className?: string;
  dataAutoId?:string
}

const blk = 'app-store-button'

const AppStoreButton = ({
  category = 'primary',
  align = 'vertical',
  className,
  dataAutoId
}: appStoreButtonProps) => (
  <div
    className={bemClass([
      blk,
      {
        [category]: !!category,
        [align]: !!align,
      },
      className
    ])}
  >
    <Link
      href="https://play.google.com/store/apps/dev?id=8560142974951141462&hl=en"
      target="_blank"
      className={bemClass([blk, 'link'])}
      aria-label="google play store"
      rel="nofollow"
      data-auto-id={`${dataAutoId}_google_play_store`}
    >
      <PlayStore />
    </Link>
    <Link
      href="https://apps.apple.com/in/app/loginext-driver-app/id1628477504"
      target="_blank"
      className={bemClass([blk, 'link'])}
      aria-label="apple app store"
      rel="nofollow"
      data-auto-id={`${dataAutoId}_apple_app_store`}
    >
      <AppStore />
    </Link>
  </div>
)

export default AppStoreButton
