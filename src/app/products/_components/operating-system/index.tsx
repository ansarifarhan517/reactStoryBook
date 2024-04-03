'use client'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

const blk = 'operating-system'

const OperatingSystem = () => (
  <div className={blk} data-auto-id="products_section_4">
    <Text
      tag="h2"
      typography="m"
      color="white"
      className={bemClass([blk, 'header'])}
      dataAutoId="products_section_4_title"
    >
      Operating System for Your Logistics Operations
    </Text>
    <iframe src="operating-system.html" width="100%" height="570" data-auto-id="products_section_4_operating_system_animation"></iframe>
  </div>
)

export default OperatingSystem
