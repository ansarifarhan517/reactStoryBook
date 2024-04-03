'use client'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'bouncing-arrow'

const BouncingArrow = ({ id, dataAutoId }: string | any) => (
  <div className={blk}>
    <a href={`#${id}`} className={bemClass([blk, 'arrow'])} aria-label={id} data-auto-id={dataAutoId} />
  </div>
)

export default BouncingArrow
