'use client'

import dynamic from 'next/dynamic'

import { useState, useEffect } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type animatedCoverPageProps = {
  name?: string
  className?: string
  containerClassName?: string
  animationPath?: string
  delay?: number
  hideOnMobile?: boolean
}

const LottieAnimationBanner = dynamic(() => import('../lottie-animation-banner'))

const blk = 'animated-cover-page'

const AnimatedCoverPage = ({
  name = '',
  className,
  containerClassName,
  animationPath = '',
  delay = 1000,
  hideOnMobile,
}: animatedCoverPageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const viewportWidth = window.innerWidth
    const isMobileView = viewportWidth < 480
    setIsMobile(isMobileView)

    setTimeout(() => {
      setIsLoading(false)
    }, delay)
  }, [])

  if (hideOnMobile && isMobile) {
    return null
  }

  return (
    <div
      className={bemClass([
        blk,
        { [name] : !!name },
        className
      ])}
    >
      {!isLoading && (
        <LottieAnimationBanner
          animationPath={animationPath}
          className={containerClassName}
        />
      )}
    </div>
  )
}

export default AnimatedCoverPage
