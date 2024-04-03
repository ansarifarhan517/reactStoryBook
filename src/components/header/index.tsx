'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { bemClass } from '@/utils'

import Logo from '../logo'
import Navigation from '../navigation'
import NewsTicker from '../news-ticker'

import './style.scss'

const blk = 'header'

const Header = () => {
  const [routeChanged, setRouteChanged] = useState<boolean>(true)
  const [showNewsTicker, setShowNewsTicker] = useState<boolean>(true)
  const [yScroll, setYSroll] = useState<number>(0)
  const pathName = usePathname()

  useEffect(() => {
    setRouteChanged(false)
    setTimeout(() => {
      setRouteChanged(true)
    }, 5)
  }, [pathName])

  const handleScroll = () => {
    setYSroll(window.scrollY)
  }

  const onNewsTickerClose = () => {
    setShowNewsTicker(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const isOpaque = yScroll > 76
  const isBlogDetailPage = pathName.indexOf('/blog/') === 0
  const isOpaqueNav = isBlogDetailPage || isOpaque

  // Do not render the header for /customernps page
  if (pathName === '/customernps') {
    return null
  }

  return (
    <header className={blk}>
      {(showNewsTicker && pathName === '/' && !isOpaque) && (
        <NewsTicker
          message="Join the LogiNext Resonance Webinar Series - "
          linkLabel="Register Now"
          href="/"
          formId="5e58b20f-d9ea-46a6-b11b-20a8d1862432"
          closeHandler={onNewsTickerClose}
        />
      )}
      <div className={bemClass([blk, 'nav', { 'opaque': isOpaqueNav }])}>
        <Logo isOpaque={isOpaqueNav} />
        {routeChanged && <Navigation isOpaque={isOpaqueNav} />}
      </div>
    </header>
  )
}

export default Header
