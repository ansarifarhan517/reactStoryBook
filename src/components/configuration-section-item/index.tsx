'use client'

import Image, { StaticImageData } from 'next/image'
import dynamic from 'next/dynamic'
import { m, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'

import Text from '../text'

import './style.scss'

export interface ConfigurationSectionItemProps {
  icon?: string
  title: string
  description: string
  iconDivider?: boolean
  columns?: '2' |'3' | '4'
  iconAlign?: 'left-top' | 'left-center' | 'top-left' | 'top-center'
  iconColor?:
    | 'black'
    | 'gray-darker'
    | 'gray-dark'
    | 'gray'
    | 'white'
    | 'primary'
    | 'secondary'
  iconType?: 'plain' | 'circular'
  iconBorder?: 'transparent' | 'white' | 'primary'
  iconBackground?: 'transparent' | 'white' | 'primary' | 'gray-dark'
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg' | 'xxxlg'
  textColor?: 'black' | 'gray-dark' | 'white'
  hoverEffect?: boolean
  image?: StaticImageData
  imageClass?: string
  boxClass?:string
  dataAutoId?: string
}

const menuVariant = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
}

const Icon = dynamic(() => import('../icon'), {
  ssr: false
})

const blk = 'configuration-section-item'

const ConfigurationSectionItem = ({
  icon,
  title,
  description,
  iconDivider = false,
  columns = '3',
  iconAlign = 'top-center',
  iconColor = 'gray-dark',
  iconType = 'plain',
  iconBackground = 'transparent',
  iconBorder = 'transparent',
  iconSize = 'md',
  textColor = 'gray-dark',
  hoverEffect = false,
  image,
  imageClass,
  boxClass,
  dataAutoId
}: ConfigurationSectionItemProps) => {
  const boxClassName = hoverEffect ? 'box-hover-effect' : ''
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={menuVariant}
        className={bemClass([
          blk,
          {
            [columns]: !!columns,
          },
        ])}
      >
        <div
          className={bemClass([
            blk,
            'box',
            {
              'hover-effect': hoverEffect,
              [iconAlign]: !!iconAlign,
            },
            `${boxClassName} ${boxClass}`,
          ])}
          data-auto-id={dataAutoId}
        >
          {icon && (
            <div
              className={bemClass([
                blk,
                'icon',
                {
                  [iconType]: !!iconType,
                  [`bg-${iconBackground}`]: !!iconBackground,
                  [`border-${iconBorder}`]: !!iconBorder,
                },
              ])}
            >
              <Icon name={icon} size={iconSize} color={iconColor} dataAutoId={`${dataAutoId}_icon`} />
              {iconDivider && <div className={bemClass([blk, 'divider'])} />}
            </div>
          )}
          {image && (
            <div className={bemClass([blk,'image-container', {}, imageClass])}>
              <Image
                src={image}
                alt={'image'}
                className={bemClass([blk,'image'])}
                data-auto-id={`${dataAutoId}_image`}
              />
            </div>
          )}
          <div
            className={bemClass([
              blk,
              'content',
              {
                [textColor]: !!textColor,
              },
            ])}
          >
            <Text
              tag="div"
              typography="l"
              color={textColor}
              className={bemClass([blk, 'title', { [iconAlign]: !!iconAlign }])}
              dataAutoId={`${dataAutoId}_title`}
            >
              {title}
            </Text>
            <Text tag="p" color={textColor} typography="s" dataAutoId={`${dataAutoId}_description`}>
              {description}
            </Text>
          </div>
        </div>
      </m.div>
    </LazyMotion>
  )
}

export default ConfigurationSectionItem
