'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion'

import Container from '@/components/container'
import Carousel from '@/components/carousel'

import { bemClass } from '@/utils'

import { whyLoginextCardsData } from '../../data'

import WhyLoginextCard from '../why-loginext-card'

import './style.scss'

type whyLogiNextProps = {
  dataAutoId?: string
}

const blk = 'why-loginext'

const WhyLoginext = ({ dataAutoId }: whyLogiNextProps) => {
  const [activeTab, setActiveTab] = useState<{
    selectedTabIndex: number
    direction: 'next' | 'prev'
  }>({
    selectedTabIndex: 0,
    direction: 'next',
  })

  const [visibleCard, setVisibleCard] = useState<number>(1)

  useEffect(() => {
    const cardContainer = document.querySelector('#cardContainer')
    const listItemWidth = cardContainer?.querySelectorAll('a')[0]?.clientWidth || 298
    const containerWidth = cardContainer?.clientWidth || 1080
    const visibleCards = Math.floor(containerWidth / listItemWidth)
    setVisibleCard(visibleCards)
  }, [])

  const handleNextSlide = () => {
    setActiveTab({
      selectedTabIndex:
        (activeTab.selectedTabIndex + 1) % whyLoginextCardsData.length,
      direction: 'next',
    })
  }

  const handlePrevSlide = () => {
    setActiveTab({
      selectedTabIndex:
        (activeTab.selectedTabIndex - 1 + whyLoginextCardsData.length) %
        whyLoginextCardsData.length,
      direction: 'prev',
    })
  }

  const variants = {
    enter: (direction: string) => ({
      x: direction === 'prev' ? `-${100 / visibleCard}%` : `${100 / visibleCard}%`,
    }),
    center: {
      x: '0%',
    },
    exit: (direction: string) => ({
      x: direction === 'prev' ? `${100 / visibleCard}%` : `-${100 / visibleCard}%`,
    }),
  }

  return (
    <Container className={blk}>
      <Carousel
        handleNextSlide={handleNextSlide}
        handlePrevSlide={handlePrevSlide}
        className={bemClass([blk, 'carousel-container'])}
        dataAutoId={dataAutoId}
      >
        <div className={bemClass([blk, 'cards-container'])}>
          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false} custom={activeTab.direction}>
              <m.div
                key={whyLoginextCardsData[activeTab?.selectedTabIndex]?.id}
                variants={variants}
                custom={activeTab.direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                }}
                className={bemClass([blk, 'cards'])}
                id="cardContainer"
              >
                {whyLoginextCardsData[activeTab?.selectedTabIndex]['data']?.map(
                  ({ id, icon, description, url, title }) => (
                    <WhyLoginextCard
                      key={id}
                      icon={icon}
                      description={description}
                      title={title}
                      url={url}
                      dataAutoId={`${dataAutoId}_${id}`}
                    />
                  )
                )}
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </div>
      </Carousel>
    </Container>
  )
}

export default WhyLoginext
