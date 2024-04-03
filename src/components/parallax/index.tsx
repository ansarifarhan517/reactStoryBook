'use client'

import {
  useState, useRef, useLayoutEffect, ReactNode
} from 'react'
import {
  LazyMotion, domAnimation, m, useScroll,
  useTransform, useSpring, useReducedMotion,
} from 'framer-motion'

type parallaxProps = {
  children: ReactNode;
  offset?: number;
  className?: string;
};

const Parallax = ({
  children,
  offset = 50,
  className
}: parallaxProps) => {
  const prefersReducedMotion = useReducedMotion()
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const ref = useRef(null)

  const { scrollY } = useScroll()

  const initial = elementTop - clientHeight
  const final = elementTop + offset

  const yRange = useTransform(scrollY, [initial, final], [offset, -offset])
  const y = useSpring(yRange, {
    stiffness: 400,
    damping: 90
  })

  useLayoutEffect(() => {
    const element = ref.current
    const onResize = () => {
      setElementTop(
        //@ts-ignore
        element.getBoundingClientRect().top + window.scrollY ||
          window.pageYOffset
      )
      setClientHeight(window.innerHeight)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ref])

  // Don't parallax if the user has "reduced motion" enabled
  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div ref={ref} className={className} style={{ y }}>
        {children}
      </m.div>
    </LazyMotion>
  )
}

export default Parallax
