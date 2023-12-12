import React, { useState } from 'react'
import {
  StyledTextFilter,
  StyledInput,
  SyledSearch,
  StyledCross
} from './StyledTextFilter'
import FontIcon from '../FontIcon'

export interface ITextFilter extends React.HTMLAttributes<HTMLInputElement> {
  onEnter?: (value: string) => void
  width?: string
  onClear?: () => void
  type?: string
  onClick?: () => void
  value?: string
  readOnly?: boolean
}

const TextFilter = ({
  onEnter = () => {},
  width = '100%',
  onClear = () => {},
  value: propValue = '',
  readOnly = false,
  ...rest
}: ITextFilter) => {
  const [value, setValue] = useState<string>(propValue)

  React.useEffect(() => {
    setValue(propValue)
  }, [propValue])

  const handleSearch = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.charCode === 13) {
      onEnter(value)
    }
  }
  return (
    <StyledTextFilter>
      <SyledSearch>
        <FontIcon variant='icomoon-search' size={10} color='text.hint' />
      </SyledSearch>
      <StyledInput
        readOnly={readOnly}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setValue(e.currentTarget.value)
        }
        width={width}
        type='text'
        inputMode='search'
        value={value}
        onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => handleSearch(e)}
        {...rest}
      />
      {value && (
        <StyledCross
          onClick={() => {
            setValue('')
            onEnter('')
            onClear()
          }}
        >
          <FontIcon
            variant='close'
            size={9}
            color='text.secondary'
            hoverColor='black'
          />
        </StyledCross>
      )}
    </StyledTextFilter>
  )
}

export default TextFilter
