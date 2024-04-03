'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'
import SectionTitle from '@/components/section-title'

import ProductCard from '../product-card'
import { productCards } from '../../_data'

import './style.scss'

const blk = 'products-carousel'

const ProductsCarousel = () => {

  const variants = {
    enter: {
      x: '100%',
    },
    center: {
      x: '0%',
    },
    exit: {
      x: '-100%',
    },
  }

  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    let interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % productCards.length)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [activeTab])

  return (
    <section className={blk} data-auto-id="products_section_5">
      <SectionTitle
        category="secondary"
        className={bemClass([blk, 'section-title'])}
        color="white"
        dataAutoId="products_section_5_title"
      >
        Products
      </SectionTitle>

      <div className={bemClass([blk, 'products-carousel-contanier'])} data-auto-id="products_section_5_carousel_container">
        <div className={bemClass([blk, 'cards-container'])}>
          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false}>
              <m.div
                key={productCards[activeTab]?.id}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.5,
                }}
                className={bemClass([blk, 'product-cards'])}
                data-auto-id="products_section_5_carousel_cards"
              >
                {productCards[activeTab]['products']?.map(({ id, image, description, url ,title },index) => (
                  <ProductCard
                    key={id}
                    image={image}
                    description={description}
                    title={title}
                    url={url}
                    imageDataAutoId={`products_section_5_carousel_card_${index}_image`}
                    descriptionDataAutoId={`products_section_5_carousel_card_${index}_description`}
                    buttonDataAutoId={`products_section_5_carousel_card_${index}_button`}
                  />
                ))}
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </section>
  )
}

export default ProductsCarousel
