'use client'

import { ReactElement, FormEvent } from 'react'
import Link from 'next/link'

import { bemClass } from '@/utils'

import './style.scss'

export interface ButtonProps {
  children: ReactElement | string | number | null | undefined;
  type?: 'button' | 'submit' | 'reset';
  category?: 'primary' | 'secondary' | 'default' ;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  isBlock?: boolean;
  asLink?: boolean;
  withIcon?: boolean;
  href?: string;
  outline?: boolean;
  className?: string;
  clickHandler?: (e?: FormEvent) => void;
  target?: '_blank' | '_self'
  dataAutoId?: string
  isFlexible?: boolean
}

const blk = 'button'

const Button = ({
  children,
  type = 'button',
  category = 'default',
  size = 'medium',
  className,
  disabled,
  asLink,
  href = '/',
  isBlock,
  withIcon,
  loading,
  clickHandler,
  outline,
  target = '_self',
  dataAutoId,
  isFlexible
}: ButtonProps) => {
  const eltClassName = bemClass([
    blk,
    {
      [category]: category && !outline,
      [`${category}-outline`]: category && outline,
      [size]: size,
      loading,
      block: isBlock,
      flexible: isFlexible,
      'with-icon': withIcon,
      [`${category}-loading`]: loading && !outline,
      [`${category}-outline-loading`]: loading && outline,
      disabled,
    },
    className,
  ])

  if (asLink) {
    return (
      <Link href={href} className={eltClassName} target={target} data-auto-id={dataAutoId}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={eltClassName}
      disabled={disabled}
      onClick={clickHandler}
      data-auto-id={dataAutoId}
    >
      {children}
    </button>
  )
}

export default Button
