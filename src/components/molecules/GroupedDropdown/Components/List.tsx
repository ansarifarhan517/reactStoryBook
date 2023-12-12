import React, { useEffect, useState } from 'react'
import TextInput from '../../TextInput'
import { IListProps } from '../interfaces'
import { StyledListWrapper, Option, OptionWrapper } from '../styled'

const List = ({ options, value, onChange, placeholder, label }: IListProps) => {
  const [searchValue, setSearchValue] = useState(value)
  const [optionList, setOptionList] = useState(options)

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value)
    const arr = options?.filter((f: any) => {
      return (f.labelText || f.label)
        ?.toLowerCase()
        ?.includes((e.target.value || '').toLowerCase())
    })
    arr && setOptionList([...arr])
  }

  useEffect(() => {
    setOptionList(options)
  }, [options])

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  return (
    <StyledListWrapper>
      <TextInput
        id='groupedDropdownSearch'
        name='groupedDropdownSearch'
        className='groupedDropdownSearch'
        label={label}
        placeholder={placeholder}
        fullWidth
        onChange={handleSearch}
        value={searchValue && searchValue?.label}
      />
      <OptionWrapper>
        {optionList
          ? optionList.map((o: any) => {
              return (
                <Option key={o.value} onClick={() => onChange(o)}>
                  {o.label}
                </Option>
              )
            })
          : 'No Option'}
      </OptionWrapper>
    </StyledListWrapper>
  )
}

export default List
