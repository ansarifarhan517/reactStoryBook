import { ReactElement, ReactPortal } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type containerProps = {
  children: string | number | ReactElement | ReactElement[] | ReactPortal | boolean | null | undefined;
  fluid?: boolean;
  className?: string;
  id?: string;
  dataAutoId?: string;
}

const blk = 'container'

const Container = ({ children, fluid , className, id, dataAutoId }: containerProps) => (
  <div className={bemClass([blk, { fluid },className])} id={id } data-auto-id={dataAutoId}>
    {children}
  </div>
)

export default Container
