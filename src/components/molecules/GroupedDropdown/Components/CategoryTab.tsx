import React from 'react'
import { StyledTab } from '../styled'
import FontIcon from '../../../atoms/FontIcon'
import { ICategoryProps, ICategory } from '../interfaces'

const CategoryTab = ({
  category,
  currentCategory,
  onTabChange
}: ICategoryProps) => (
  <>
    {category.map((c: ICategory) => {
      return (
        <StyledTab
          className={`tab ${currentCategory === c.id && 'active'}`}
          key={c.id}
          id={c.id}
          onClick={() => onTabChange(c.id)}
        >
          <span>{c.label}</span>
          <FontIcon
            variant='angle-right-thin'
            color={`tab ${currentCategory === c.id ? 'white' : 'black'}`}
            size={13}
          />
        </StyledTab>
      )
    })}
  </>
)

export default CategoryTab
