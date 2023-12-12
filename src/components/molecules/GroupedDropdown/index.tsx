import React, { useEffect, useState } from 'react'
import {
  IGroupedDropdownProps,
  ICategoryData,
  IData,
  ICategory
} from './interfaces'
import {
  DropdownStyled,
  CategoryTabStyled,
  GroupedDropdownWrapper
} from './styled'

import CategoryTab from './Components/CategoryTab'
import { prepareAllArray } from './utils'
import List from './Components/List'

const GroupedDropdown = ({
  category,
  data,
  width,
  handleOnChange,
  searchFieldLabel = 'Search',
  searchFieldPlaceholder = 'Search Tags',
  allLabel = 'All'
}: IGroupedDropdownProps) => {
  const [Data, setData] = useState<undefined | IData>()
  const [categoryData, setCategoryData] = useState<ICategory[]>(category)
  const [currentCategory, setCurrentCategory] = useState<string>(category[0].id)
  const [options, setOptions] = useState<ICategoryData[] | undefined>()
  const [value, setValue] = useState(undefined)

  useEffect(() => {
    const all = prepareAllArray(data, category, allLabel)
    setCategoryData(all.category)
    setCurrentCategory(all.category[0].id)
    setData(all)
  }, [data])

  useEffect(() => {
    Data && setOptions(Data.data[currentCategory])
  }, [currentCategory])

  const onTabChange = (id: string) => {
    setValue(undefined)
    setCurrentCategory(id)
  }
  const onChange = (value: ICategoryData) => {
    const categoryObj = categoryData.find(
      (m: ICategory) => m.id === currentCategory
    )
    categoryObj && handleOnChange(value, categoryObj)
  }

  return (
    <GroupedDropdownWrapper width={width}>
      <CategoryTabStyled>
        <CategoryTab
          category={categoryData && categoryData}
          onTabChange={onTabChange}
          currentCategory={currentCategory}
        />
      </CategoryTabStyled>

      {/* Dropdown */}
      <DropdownStyled
        className='d-inline-block'
        data-toggle='popover'
        data-trigger='focus'
        data-content='Search'
      >
        <List
          options={options && options}
          value={value && value}
          placeholder={searchFieldPlaceholder}
          label={searchFieldLabel}
          onChange={onChange}
        />
      </DropdownStyled>
    </GroupedDropdownWrapper>
  )
}

export default GroupedDropdown
