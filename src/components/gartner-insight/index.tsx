import Image from 'next/image'

import { bemClass } from '@/utils'

import gartnerInsight from '/public/gartner-insight.webp'

import Text from '../text'

import './style.scss'

const blk = 'gartner-insight'

type gartnerInsightProps= {
  dataAutoId?: string
  isGartnerHorizontal?: boolean
}

const GartnerInsight = ({ dataAutoId,isGartnerHorizontal }:gartnerInsightProps) => (
  <div className={bemClass([blk, { 'horizontal': isGartnerHorizontal }, 'slide-fade-in-delay-1'])} data-auto-id = {dataAutoId}>
    <Image
      src={gartnerInsight}
      alt="Gartner insights"
      width={185}
      height={64}
      loading="eager"
      data-auto-id={`${dataAutoId}_image`}
    />
    <Text
      tag="p"
      typography="m"
      color="white"
      fontWeight="bold"
      className={bemClass([blk, 'text'])}
      dataAutoId={`${dataAutoId}_text`}
    >
      Highest rated Vehicle Routing and Scheduling
      and Last Mile Technology provider.
    </Text>
  </div>
)

export default GartnerInsight
