'use client'

import {
  useState, useRef, useEffect,
  useCallback, ReactElement
} from 'react'

import { bemClass } from '@/utils'

import Container from '../container'

import './style.scss'

type sliderProps = {
  id: string;
  className?: string;
  children: ReactElement | ReactElement[]
  dataAutoId?: string
}

const blk = 'slider'

const Slider = ({
  children,
  className,
  dataAutoId
}: sliderProps) => {
  const [counter, setCounter] = useState<number>(0)
  const [noOfSlides, setNoOfSlides] = useState<number>(1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wrapperRef.current) {
      const listWrapper = wrapperRef.current
      const totalItems = listWrapper.querySelectorAll('li').length
      const listItemWidth = listWrapper.querySelectorAll('li')[0].clientWidth
      const slides = Math.floor(listWrapper.clientWidth / listItemWidth)
      const noOfSlides = Math.ceil(totalItems / slides)
      setNoOfSlides(noOfSlides)
    }
  }, [])

  const prevHandler = useCallback(() => {
    const newCounter = counter - 1
    setCounter(newCounter)
  }, [counter])

  const nextHandler = useCallback(() => {
    const newCounter = counter + 1
    setCounter(newCounter)
  }, [counter])

  const isPrevDisabled = counter === 0
  const isNextDisabled = counter === (noOfSlides - 1)

  return (
    <Container className={bemClass([blk, {}, className])} dataAutoId={dataAutoId}>
      <>
        <button
          aria-label="previous"
          disabled={isPrevDisabled}
          className={bemClass([
            blk,
            'arrow',
            {
              'prev': true,
              disabled: isPrevDisabled,
            }
          ])}
          onClick={prevHandler}
          data-auto-id={`${dataAutoId}_prev`}
        />
        <div className={bemClass([blk, 'list-wrapper'])} ref={wrapperRef}>
          <ul
            className={bemClass([blk, 'list'])}
            style={{
              left: `${counter * 100 * -1}%`
            }}
            data-auto-id={`${dataAutoId}_items`}
          >
            {children}
          </ul>
        </div>
        <button
          aria-label="next"
          disabled={isNextDisabled}
          className={bemClass([
            blk,
            'arrow',
            {
              'next': true,
              disabled: isNextDisabled,
            }
          ])}
          onClick={nextHandler}
          data-auto-id={`${dataAutoId}_next`}
        />
      </>
    </Container>
  )
}

export default Slider
