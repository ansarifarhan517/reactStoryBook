'use client'

import { StaticImageData } from 'next/image'
import React, { useEffect, useState } from 'react'
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'

import TextWithIcon from '@/components/text-with-icon'
import ImageTextButton from '@/components/image-text-button'
import Carousel from '@/components/carousel'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ButtonGroup from '../button-group'

import { carouselItem, featureTag } from './types'

import './style.scss'

const blk = 'feature-carousel'

type featureCarouselProps = {
  dataAutoId?: string
  carouselItems: carouselItem[]
  featureTag: featureTag
  imageSrc: StaticImageData
}

const FeatureCarousel = ({
  dataAutoId,
  carouselItems,
  featureTag,
  imageSrc
}:featureCarouselProps) => {
  const [activeTab, setActiveTab] = useState<{
    selectedTabIndex: number
    direction: 'next' | 'prev'
  }>({
    selectedTabIndex: 0,
    direction: 'next',
  })
  const [tabActive, setTabActive] = useState<boolean>(false)

  const handleNextSlide = () => {
    setActiveTab({
      selectedTabIndex: (activeTab.selectedTabIndex + 1) % carouselItems.length,
      direction: 'next',
    })
    setTabActive(true)
  }

  const handlePrevSlide = () => {
    setActiveTab({
      selectedTabIndex:
        (activeTab.selectedTabIndex - 1 + carouselItems.length) %
        carouselItems.length,
      direction: 'prev',
    })
    setTabActive(true)
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setActiveTab(prev => {
        if (tabActive) {
          clearInterval(interval)
          return {
            selectedTabIndex: prev.selectedTabIndex % carouselItems.length,
            direction: 'next',
          }
        }
        return {
          selectedTabIndex: (prev.selectedTabIndex + 1) % carouselItems.length,
          direction: 'next',
        }
      })
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [tabActive, carouselItems.length])

  const variants = {
    enter: (direction: string) => ({
      x: direction === 'prev' ? '-100%' : '100%',
    }),
    center: {
      x: '0%',
    },
    exit: (direction: string) => ({
      x: direction === 'prev' ? '100%' : '-100%',
    }),
  }

  const { id, features } = carouselItems[activeTab.selectedTabIndex]
  const { title, description } = featureTag

  return (
    <div className={bemClass([blk])} data-auto-id={dataAutoId}>
      <div className={bemClass([blk, 'image_container'])}>
        <ImageTextButton
          image={imageSrc}
          title={title}
          description={description}
          showTitle={true}
          className={bemClass([blk, 'feature-tagline'])}
          dataAutoId={`${dataAutoId}_feature_tagline`}
        >
          <ButtonGroup>
            <ModalTriggerButton
              modalType="talk-to-us"
              category="secondary"
              size="large"
              dataAutoId={`${dataAutoId}_talk_to_us`}
            >
              TALK TO US
            </ModalTriggerButton>
            <ModalTriggerButton
              modalType="schedule-a-demo"
              category="primary"
              size="large"
              dataAutoId={`${dataAutoId}_schedule_a_demo`}
            >
              SCHEDULE A DEMO
            </ModalTriggerButton>
          </ButtonGroup>
        </ImageTextButton>
      </div>
      <Carousel
        handleNextSlide={handleNextSlide}
        handlePrevSlide={handlePrevSlide}
        className={bemClass([blk, 'carousel-container'])}
        dataAutoId={`${dataAutoId}_carousel_container`}
      >
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} custom={activeTab.direction}>
            <m.div
              key={id}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
              }}
              custom={activeTab.direction}
              className={bemClass([blk, 'box_container'])}
              data-auto-id={`${dataAutoId}_box_container`}
            >
              {features.map(({ title, description, iconName },index) => (
                <TextWithIcon
                  key={iconName}
                  title={title}
                  description={description}
                  iconName={iconName}
                  dataAutoId={`${dataAutoId}_feature_${index}`}
                  iconWeight="semi-bolder"
                />
              ))}
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Carousel>
    </div>
  )
}

export default FeatureCarousel
