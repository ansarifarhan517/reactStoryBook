'use client'

import { ReactElement } from 'react'

import { bemClass } from '@/utils'

import Text from '../text'

import './style.scss'

type collapsibleProps = {
  title: string;
  isExpanded?: boolean;
  clickHandler?: () => void;
  contentClassName?: string;
  children: ReactElement | string | number | null | undefined;
  dataAutoId?: string
}

const blk = 'collapsible'

const Collapsible = ({
  title,
  isExpanded = false,
  clickHandler,
  contentClassName,
  children,
  dataAutoId
}: collapsibleProps) => (
  <div className={blk}>
    <div className={bemClass([blk, 'header'])} onClick={clickHandler}>
      <Text
        className={bemClass([blk, 'heading'])}
        typography="xl"
        color="black"
        tag="h3"
        fontWeight={isExpanded ? 'bold' : 'normal'}
        dataAutoId={`${dataAutoId}_title`}
      >
        {title}
      </Text>
      <button
        aria-label="expand-collapase-arrow"
        className={bemClass([blk, 'button', { expanded : isExpanded }])}
        onClick={clickHandler}
        data-auto-id={`${dataAutoId}_arrow_button`}
      />
    </div>
    {isExpanded && (
      <div className={bemClass([blk, 'content', { expanded : isExpanded }, contentClassName])}>
        {children}
      </div>
    )}
  </div>
)

export default Collapsible
