'use client'
import React, { useCallback } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type toggleProps = {
    name: string;
    onChangeHandler: (e: any) => void;
    checked: boolean;
    className?: string;
    dataAutoId?: string;
}

const blk = 'toggle'

const Toggle = ({
  name,
  checked,
  onChangeHandler,
  className,
  dataAutoId
}: toggleProps) => {

  const onClickHandler = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked
    onChangeHandler({ [name] : isChecked })
  },[onChangeHandler, name])

  return (
    <div className={bemClass([blk, {}, className])} data-auto-id={dataAutoId}>
      <input
        type="checkbox"
        name={name}
        className={bemClass([blk, 'checkbox'])}
        onClick={onClickHandler}
        defaultChecked={checked}
        data-auto-id={`${dataAutoId}_input`}
        id="pricing-toggle"
        aria-label="pricing-toggle"
      />
      <label
        className={bemClass([blk, 'switch'])}
        htmlFor="pricing-toggle"
        data-auto-id={`${dataAutoId}_label`}
      />
    </div>
  )
}

export default Toggle
