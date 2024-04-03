'use client'

import { m, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'

import Container from '../container'
import Text from '../text'
import ConfigurationSectionItem, { ConfigurationSectionItemProps } from '../configuration-section-item'

import './style.scss'
import { StaticImageData } from 'next/image'

type configData = {
  id: string;
  icon?: string;
  title: string;
  description: string;
  image?: StaticImageData
}

interface ConfigurationSectionProps extends Omit<ConfigurationSectionItemProps, 'icon' | 'title' | 'description'> {
  data: configData[];
  widthBg?: boolean;
  title?: string;
  className?: string;
  boxClass?:string
  dataAutoId?: string
}

const blk = 'configuration-section'

const variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.4,
    },
  },
}

const ConfigurationSection = ({
  data = [],
  widthBg = false,
  title,
  iconDivider,
  columns,
  iconAlign,
  iconColor,
  iconType,
  iconBorder,
  iconBackground,
  iconSize,
  textColor,
  hoverEffect,
  className,
  imageClass,
  boxClass,
  dataAutoId
}: ConfigurationSectionProps) => (
  <LazyMotion features={domAnimation}>
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={bemClass([blk, { 'with-bg': widthBg }, className])}
    >
      <Container className={bemClass([blk, 'container'])} dataAutoId={dataAutoId}>
        <>
          {title && (
            <Text
              tag="h2"
              typography="xxl"
              fontWeight="thin"
              color={textColor}
              className={bemClass([blk, 'title'])}
              dataAutoId={`${dataAutoId}_title`}
            >
              {title}
            </Text>
          )}
          {data.map(({ id, icon, title, description ,image },index) => (
            <ConfigurationSectionItem
              key={id}
              icon={icon}
              title={title}
              columns={columns}
              description={description}
              iconAlign={iconAlign}
              iconColor={iconColor}
              iconType={iconType}
              iconBorder={iconBorder}
              iconBackground={iconBackground}
              iconSize={iconSize}
              textColor={textColor}
              iconDivider={iconDivider}
              hoverEffect={hoverEffect}
              image= {image}
              imageClass={imageClass}
              boxClass={boxClass}
              dataAutoId={`${dataAutoId}_item_${index}`}
            />
          ))}
        </>
      </Container>
    </m.div>
  </LazyMotion>
)

export default ConfigurationSection
