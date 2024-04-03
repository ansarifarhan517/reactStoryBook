'use client'

import { useContext, useEffect, useState } from 'react'
import AppContext from '@/context'

import MobileNavigation from './components/mobile-navigation'
import NavigationMenu from './components/navigation-menu'

type navigationProps = {
  isOpaque?: boolean
}

const Navigation = ({ isOpaque }: navigationProps) => {
  const {
    toggleSigUpModal,
    toggleScheduleDemoModal,
    country,
  } = useContext(AppContext)
  const [isMobile, setIsMobile] = useState(true)
  useEffect(() => {
    const handleViewportDetection = () => {
      const viewportWidth = window.innerWidth
      const isMobileView = viewportWidth < 1200
      setIsMobile(isMobileView)
    }

    handleViewportDetection()
    window.addEventListener('resize', handleViewportDetection)
    return () => {
      window.removeEventListener('resize', handleViewportDetection)
    }
  }, [])

  if (isMobile) {
    return (
      <MobileNavigation
        toggleSigUpModal={toggleSigUpModal}
        toggleScheduleDemoModal={toggleScheduleDemoModal}
        isIndia={!country || country === 'IN'}
      />
    )
  }

  return (
    <NavigationMenu
      toggleSigUpModal={toggleSigUpModal}
      toggleScheduleDemoModal={toggleScheduleDemoModal}
      isOpaque={isOpaque}
      isIndia={!country || country === 'IN'}
    />
  )
}

export default Navigation
