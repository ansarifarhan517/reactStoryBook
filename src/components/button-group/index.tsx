import { ReactElement } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type buttonGroupProps = {
  children: ReactElement | ReactElement[];
  isCenter?: boolean;
  className?: string;
}

const blk = 'button-group'

const ButtonGroup = ({ children, isCenter, className }: buttonGroupProps) => (
  <div className={bemClass([blk, { 'center': isCenter }, className])}>
    {children}
  </div>
)

export default ButtonGroup
