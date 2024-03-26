import React, { useState, useEffect } from 'react'
import { IFilterMultiselectProps, IFilterMultiselectOption } from './interfaces'
import Typography from '../../atoms/Typography'
import styled from 'styled-components'
import Box from '../../atoms/Box'
import Checkbox from '../../atoms/Checkbox'

const SelectAllContainer = styled.div`
  margin-top: 5px;
  border: 1px solid ${({ theme }) => theme?.colors?.grey?.['510']};
  border-bottom: unset;
`
const OptionsContainer = styled.div`
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: overlay;
  border: 1px solid ${({ theme }) => theme?.colors?.grey?.['510']};
`
const SearchField = styled.input`
  padding: 12px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  background-color: #fff;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  border: 1px solid ${({ theme }) => theme?.colors?.grey?.inputBorder};
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
  color: #555;
`
const FilterMultiselect = ({
  id = 'FilterMultiselect',
  label = '',
  options = [],
  onSelectionChange = () => {},
  handleSearch = () => {},
  ...rest
}: IFilterMultiselectProps) => {
  const [optionsList, setOptionsList] = useState<IFilterMultiselectOption[]>([])
  const [isSelectAll, setSelectAll] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setOptionsList(options)
    const hasSomeUnchecked = options.some((o) => !o.checked)
    setSelectAll(!hasSomeUnchecked)
  }, [options])

  const handleSelectAll = ({
    target: { checked }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(checked)
    setOptionsList((list) => {
      const newList = list.map((option) => ({ ...option, checked }))
      setTimeout(() => {
        onSelectionChange(
          'selectAll',
          checked,
          newList,
          checked ? optionsList : []
        )
      }, 100)
      return newList
    })
  }

  const handleSearchFieldChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value)
    setTimeout(() => {
      handleSearch(value, isSelectAll)
    }, 100)
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setOptionsList((list) => {
      let isSelectAll = true
      const selected: IFilterMultiselectOption[] = []
      const newList = list.map((o) => {
        if (isSelectAll && !(o.id === id ? checked : o.checked)) {
          isSelectAll = false
        }
        if ((o.id === id && checked) || (o.id !== id && o.checked)) {
          selected.push({ ...o, checked: true })
        }
        return o.id === id ? { ...o, checked } : o
      })

      setSelectAll(isSelectAll)
      setTimeout(() => {
        onSelectionChange(id, checked, newList, selected)
      }, 100)
      return newList
    })
  }

  return (
    <Box {...rest} fullWidth style={{ boxSizing: 'border-box' }}>
      <Typography fontSize='14px' color='grey.A500'>
        {label}
      </Typography>
      <SearchField
        type='text'
        id={`${id}-SearchField`}
        value={searchValue}
        onChange={handleSearchFieldChange}
        placeholder='Search'
      />
      <SelectAllContainer>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          py='7px'
          px='15px'
        >
          <Box flexGrow={1}>
            <label
              htmlFor={`${id}-selectAll`}
              style={{
                display: 'inline-block',
                width: '100%',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13
              }}
            >
              Select All
            </label>
          </Box>
          <Checkbox
            checked={isSelectAll}
            onChange={handleSelectAll}
            id={`${id}-selectAll`}
          />
        </Box>
      </SelectAllContainer>
      <OptionsContainer>
        {optionsList
          .filter(
            (option) =>
              !searchValue ||
              option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
          )
          .map((option) => (
            <Box
              display='flex'
              alignItems='center'
              justifyContent='flex-start'
              key={option.id}
              py='10px'
              px='15px'
            >
              <Box
                flexGrow={1}
                pr='12px'
                style={{
                  overflowX: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
                title={option.label}
              >
                <label
                  htmlFor={`${id}-${option.label}-${option.id}`}
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    cursor: 'pointer',
                    color: '#969caa',
                    fontWeight: 700,
                    fontSize: '13px',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {option.label}
                </label>
              </Box>
              <Checkbox
                checked={!!option.checked}
                id={`${id}-${option.label}-${option.id}`}
                onChange={(e) =>
                  handleCheckboxChange(option.id, e.target.checked)
                }
              />
            </Box>
          ))}
      </OptionsContainer>
    </Box>
  )
}

export default FilterMultiselect
