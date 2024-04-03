'use client'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type caseStudyFilterDropDownProps = {
  placeHolder?: string
  selected?: string
  selectedValue?: string
  isMainMenu?: boolean
  options?: Record<string, any>[]
  selectHandler: (valueObj: Record<string, string>) => void
  className?: string
  dataAutoId?: string
}

const blk = 'case-study-filter-drop-down'

const CaseStudyFilterDropDown = ({
  selected,
  selectedValue,
  options,
  selectHandler,
  isMainMenu = false,
  className,
  dataAutoId
}: caseStudyFilterDropDownProps) => (
  <div className={bemClass([blk, {}, className])}>
    <button className={bemClass([blk, 'button'])} data-auto-id={dataAutoId}>
      <Text
        tag="span"
        typography="s"
        color={isMainMenu ? 'primary' : 'gray-dark'}
        fontWeight="bold"
      >
        {selectedValue}
      </Text>
    </button>
    <ul className={bemClass([blk, 'list'])}>
      {options?.map((option) => {
        const { key, value } = option
        return (
          <li key={key} className={bemClass([blk, 'list-item'])}>
            <button
              className={bemClass([
                blk, 'list-button',
                { active: key === selected }
              ])}
              onClick={() => {
                selectHandler(option)
              }}
              data-auto-id={`${dataAutoId}_${key}`}
            >
              <Text tag="span">{value}</Text>
            </button>
          </li>
        )
      })}
    </ul>
  </div>
)

export default CaseStudyFilterDropDown
