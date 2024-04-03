import { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { bemClass } from '@/utils'

import './style.scss'

export interface TextProps extends HTMLAttributes<HTMLOrSVGElement> {
  tag: ElementType;
  children: ReactElement | ReactElement[] | ReactNode | string | number | null | undefined;
  typography?: 'xxs'| 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  fontWeight?: 'thin' | 'normal' | 'semi-bold' | 'bold';
  color?: 'black' | 'gray-darker' | 'gray-dark' | 'gray' | 'gray-light' | 'white' | 'primary' | 'secondary';
  className?: string;
  dataAutoId?: string
}

const blk = 'text'

const Text = ({
  tag: Tag,
  typography = 'm',
  fontWeight = 'normal',
  color = 'gray-dark',
  children,
  className,
  dataAutoId
}: TextProps) => {
  const eltClass = bemClass([
    blk,
    {
      [typography]: typography,
      [color]: color,
      [fontWeight]: fontWeight,
    },
    className,
  ])

  return (
    <Tag className={eltClass} data-auto-id={dataAutoId}>{children}</Tag>
  )
}

export default Text
