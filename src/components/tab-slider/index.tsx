'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion'

import Button from '@/components/button'
import Carousel from '@/components/carousel'
import Tabs from '@/components/tabs'
import Text from '@/components/text'

import { bemClass } from '@/utils'
import TextWithIcon from '@/components/text-with-icon'
import ImageTextButton from '@/components/image-text-button'
import PlatformContent from './components/platform-content'

import './style.scss'

type tabSliderProps = {
  page: 'home' | 'platform'
  data: any
  dataAutoId?: string
}

const blk = 'tab-slider'

const TabSlider = ({
  page,
  data,
  dataAutoId
}: tabSliderProps) => {
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
      selectedTabIndex: (activeTab.selectedTabIndex + 1) % data.length,
      direction: 'next',
    })
  }

  const handlePrevSlide = () => {
    setActiveTab({
      selectedTabIndex: (activeTab.selectedTabIndex - 1 + data.length) % data.length,
      direction: 'prev',
    })
  }

  const handleClick = (index: number) => {
    setActiveTab({
      direction: activeTab.selectedTabIndex > index ? 'prev' : 'next',
      selectedTabIndex: index,
    })
    setTabActive(true)
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setActiveTab(prev => {
        if (tabActive) {
          clearInterval(interval)
          return {
            selectedTabIndex: prev.selectedTabIndex % data.length,
            direction: 'next',
          }
        }
        return {
          selectedTabIndex: (prev.selectedTabIndex + 1) % data.length,
          direction: 'next',
        }
      })
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [tabActive, data.length])

  const { selectedTabIndex } = activeTab
  const {
    title, description = '', imageSrc, features, buttons, image: descriptionImage
  } = data[selectedTabIndex]

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

  return (
    <section className={blk}>
      <div className={bemClass([blk, 'industries-tab'])}>
        <Tabs
          active={activeTab}
          buttons={data}
          className={bemClass([blk, 'industries'])}
          handleClick={handleClick}
          dataAutoId={dataAutoId}
        />
      </div>
      <Carousel
        handleNextSlide={handleNextSlide}
        handlePrevSlide={handlePrevSlide}
        className={bemClass([blk, 'carousel-container'])}
        dataAutoId={dataAutoId}
      >
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} custom={activeTab.direction}>
            <m.div
              key={data[activeTab.selectedTabIndex].id}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
              }}
              custom={activeTab.direction}
              className={bemClass([blk, 'industries-carousel'])}
            >
              <Text
                typography="m"
                tag="h1"
                color="white"
                className={bemClass([blk, 'header'])}
              >
                {title}
              </Text>
              <div className={bemClass([blk, 'image-container'])}>
                {page === 'home' && (
                  <ImageTextButton
                    image={imageSrc}
                    title={title}
                    description={description}
                    className={bemClass([blk, 'industries-tagline'])}
                    dataAutoId={dataAutoId}
                  >
                    {buttons?.map(({ id, url, category, children }: any) => (
                      <Button
                        key={id}
                        asLink
                        target="_blank"
                        href={url}
                        category={category}
                        className={bemClass([blk, 'button'])}
                        data-auto-id={`${dataAutoId}_${id}`}
                      >
                        {children}
                      </Button>
                    ))}
                  </ImageTextButton>
                )}
                {page === 'platform' && (
                  <PlatformContent
                    image={imageSrc}
                    description={description}
                    descriptionImage={descriptionImage}
                  />
                )}
              </div>
              <div className={bemClass([blk, 'box-container'])}>
                {features.map(({ title, description, iconName }: any) => (
                  <TextWithIcon
                    key={iconName}
                    title={title}
                    description={description}
                    iconName={iconName}
                    dataAutoId={dataAutoId}
                  />
                ))}
              </div>
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Carousel>
    </section>
  )
}

export default TabSlider
