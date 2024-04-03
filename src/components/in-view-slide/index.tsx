'use client'

import { ReactElement, ReactPortal } from 'react'

import { bemClass } from '@/utils'

import useElementInView from '@/hooks/use-element-in-view'

import './style.scss'

type inViewSlideProps = {
  children?: string | number | ReactElement | ReactElement[] | ReactPortal | boolean | null | undefined;
  className?: string;
  dataAutoId?: string
}

const blk = 'in-view-slide'

const InViewSlide = ({
  children,
  className,
  dataAutoId
}: inViewSlideProps) => {
  const [ containerRef, isVisible ]: any = useElementInView({
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  })

  const eltClass = bemClass([blk, {
    visible: isVisible
  }, className])

  return (
    <div
      ref={containerRef}
      className={eltClass}
      data-auto-id={dataAutoId}
    >
      {children}
    </div>
  )
}

export default InViewSlide
