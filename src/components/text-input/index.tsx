import { ChangeEvent } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type inputTextProps = {
  label: string;
  name: string;
  value?: string;
  changeHandler?: (valueObj: Record<string, any>) => void;
  blurHandler?: (fieldName: string, value: string) => void
  invalid?: boolean
  errorMessage?: string;
  className?: string;
  dataAutoId?: string
};

const blk = 'text-input'

const TextInput = ({
  label,
  value,
  name,
  changeHandler,
  blurHandler = () => {},
  invalid,
  errorMessage = '',
  className,
  dataAutoId
}: inputTextProps) => {

  const onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = ({ target: { value } }) => {
    if (changeHandler) {
      changeHandler({
        [name]: value
      })
    }
  }

  const onBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = ({ target: { value } }) => {
    blurHandler(name, value)
  }

  return (
    <div className={bemClass([blk, {}, className])}>
      <input
        type="text"
        name={name}
        value={value}
        className={bemClass([blk, 'control', { invalid }])}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label className={bemClass([blk, 'label', { 'has-value': !!value }])} data-auto-id={dataAutoId}>
        {label}
      </label>
      <div className={bemClass([blk, 'bar', { invalid }])} />
      {invalid && (
        <span data-auto-id={`${dataAutoId}_error`} className={bemClass([blk, 'error'])} dangerouslySetInnerHTML={{ __html: errorMessage }} />)}
    </div>
  )
}

export default TextInput
