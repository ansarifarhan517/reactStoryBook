import { ReactElement } from 'react'
import { bemClass } from '@/utils'

import Container from '../container'

import './style.scss'

type cardGridLayoutProps = {
  children: ReactElement | ReactElement[];
  className?: string;
}

const blk = 'card-grid-layout'

const CardGridLayout = ({ children, className }: cardGridLayoutProps) => (
  <Container className={bemClass([blk, {}, className])}>
    <ul className={bemClass([blk, 'content'])}>
      {children}
    </ul>
  </Container>
)

export default CardGridLayout
