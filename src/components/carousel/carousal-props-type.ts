import { StaticImageData } from 'next/image'
import { MouseEventHandler, ReactElement } from 'react'
import { ButtonProps } from '../button'

export type feature = {
  iconName: string
  title: string
  description?: string
}

interface carouselButton extends ButtonProps{
  id: string;
  url: string
}
export type carouselItem = {
  id: string
  imageSrc: StaticImageData
  features: feature[]
  description?: string
  title: string
  buttons?: carouselButton[]
}

export type carouselProps = {
  handlePrevSlide: MouseEventHandler
  handleNextSlide: MouseEventHandler
  children: ReactElement | ReactElement[] | string | number | null | undefined;
  className?: string
  dataAutoId?: string
}
export type carouselItemsProps = {
  activeTab: {
    selectedTabIndex: number
    direction: string
  }
  carouselItems: carouselItem[]
  children: ReactElement | ReactElement[] | string | number | null | undefined;
}
