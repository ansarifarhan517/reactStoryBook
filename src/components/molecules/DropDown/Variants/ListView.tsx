import React, { useMemo } from 'react'
import Select, { components, InputActionMeta } from 'react-select'
import { DropdownIndicator, Option } from '../CustomComponent'
import { ListViewStyled } from '../Styles'
import { StyledFont } from '../StyledDropDown'
import FontIcon from '../../../atoms/FontIcon'
import { IListView } from '../interface'
import Position from '../../Position'

const ListView = ({
  setIsCrossVisible,
  isCrossVisible,
  defaultProps,
  handleCloseChange
}: IListView) => {
  const {
    options,
    value,
    isLoading,
    placeholder,
    onInputChange,
    onChange,
    onFocus,
    isSearchable,
    disabled,
    limitOptionsList

  } = defaultProps
  const resultLimit = limitOptionsList  || 25;
  let i = 0
  const [input, setInput] = React.useState<any>();

  const onInputChangeWrapper = (newValue: string, actionMeta: InputActionMeta) =>{
    setInput(newValue);
    onInputChange && onInputChange(newValue, actionMeta);
  }
  
  const optionsMemo = useMemo(() => {
    return options?.filter((dropdownOption: { label: string }) => {
      if(typeof input ==='number' && input){
        return dropdownOption?.label?.toLowerCase().indexOf(input?.toString()?.toLowerCase()) >= 0 && i++ < resultLimit;
      }else if(input){
        return dropdownOption?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0 && i++ < resultLimit;
      }else{
        return i++ < resultLimit;
      }
    });
  }, [input,options])

  return (
    <Position type='relative' mt='-0.25em'>
      <Select
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator,
          LoadingIndicator: () => null,
          Option,
          Menu: (props) => (
            <components.Menu {...props} className='menuAnimate' />
          )
        }}
        onMenuOpen={() => setIsCrossVisible(false)}
        onMenuClose={() => {
          value && setIsCrossVisible(true)
        }}
        styles={ListViewStyled()}
        options={optionsMemo}
        value={value}
        isLoading={isLoading}
        placeholder={placeholder}
        onInputChange={onInputChangeWrapper}
        onChange={(input: any) => {
          i = 0
          const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
          obj?.forEach((e) => {
            e.remove()
          })
          onChange && onChange(input)
        }}
        onFocus={onFocus}
        isSearchable={isSearchable}
        isDisabled={disabled}
        menuPlacement='auto'
       
      />
      {isCrossVisible && (
        <StyledFont
          onMouseDown={(e) => {
            handleCloseChange(e)
          }}
        >
          <FontIcon
            variant='close'
            size={7}
            color='grey.800'
            hoverColor='primary.main'
            style={{
              opacity: '0.66'
            }}
          />
        </StyledFont>
      )}
    </Position>
  )
}

export default ListView
