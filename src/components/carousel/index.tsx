'use client'

import { bemClass } from '@/utils'

import { carouselProps } from './carousal-props-type'

import './style.scss'

const blk = 'carousel'

const Carousel = ({
  handleNextSlide,
  handlePrevSlide,
  children,
  className,
  dataAutoId
}: carouselProps) => (
  <>
    <div className={bemClass([blk,{},className])}>
      <span
        className={bemClass([blk, 'button', ['prev']])}
        onClick={handlePrevSlide}
        data-auto-id={`${dataAutoId}_prev`}
      />
      {children}
      <span
        className={bemClass([blk, 'button', ['next']])}
        onClick={handleNextSlide}
        data-auto-id={`${dataAutoId}_next`}
      />
    </div>
  </>
)

export default Carousel
