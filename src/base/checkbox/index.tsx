import React, { useCallback } from 'react'
import { bemClass } from '@utils'
import { ICheckboxProps } from './checkbox.model'
import './style.scss'

const blk = 'checkbox'

const Checkbox: React.FC<ICheckboxProps> = ({
  label,
  id,
  name,
  checked,
  disabled,
  onChangeHandler,
  className,
}) => {
  const onClickHandler: React.MouseEventHandler<HTMLInputElement> = useCallback((event: React.MouseEvent) => {
    const isChecked = (event.target as HTMLInputElement).checked
    onChangeHandler({ [name]: isChecked })
  }, [name, onChangeHandler])
  const eltClass = bemClass([blk, { active: checked }, className])

  return (
    <div className={eltClass}>
      <label className={bemClass([blk, 'label'])}>
        {label}
      </label>
      <input
        type="checkbox"
        name={name}
        id={id}
        className={bemClass([blk, 'input'])}
        defaultChecked={checked}
        disabled={disabled}
        onClick={onClickHandler}
      />
    </div>
  )
}

export default Checkbox
