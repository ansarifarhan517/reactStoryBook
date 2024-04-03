
import React, { useRef, useEffect } from 'react'

const useParallax = (multiplier = 0.5) => {
  const parallaxRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset
      if (parallaxRef.current) {
        //@ts-expect-error
        const topPosition = parallaxRef.current.getBoundingClientRect().top
        const parallaxTopPosition = (scrollTop - topPosition)
        //@ts-expect-error
        parallaxRef.current.style.transform = `translate3d(0, ${topPosition + parallaxTopPosition}px, 0)`
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [multiplier])

  return parallaxRef
}

export default useParallax
