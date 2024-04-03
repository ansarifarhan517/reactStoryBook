'use client'

import { ElementType, ReactElement } from 'react'

import useElementInView from '@/hooks/use-element-in-view'

type loadWhenInViewProps = {
  tag?: ElementType
  children: ReactElement
  className?: string
  dataAutoId?: string
}

const LoadWhenInView = ({
  tag: Tag = 'div',
  children,
  className,
  dataAutoId
}: loadWhenInViewProps) => {

  const [ containerRef, isVisible ]: any = useElementInView({
    root: null,
    rootMargin: '10px',
    threshold: 0
  })

  return (
    <Tag
      ref={containerRef}
      className={className}
      data-auto-id={dataAutoId}
    >
      {isVisible && children}
    </Tag>
  )
}

export default LoadWhenInView
