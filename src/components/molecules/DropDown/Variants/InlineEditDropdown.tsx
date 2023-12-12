import React, { useMemo } from 'react'
import Select, { components, InputActionMeta } from 'react-select'
import { EditedDropdownIndicator, Option } from '../CustomComponent'
import { InlineEditStyled } from '../Styles'
import { IDefaultProps } from '../interface'
import Position from '../../Position'

const InlineEditDropdown = ({
  defaultProps
}: {
  defaultProps: IDefaultProps
}) => {
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

  const [input, setInput] = React.useState<any>();
  const resultLimit = limitOptionsList  || 25;
  let i = 0


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
          DropdownIndicator: (props) => <EditedDropdownIndicator {...props} />,
          LoadingIndicator: () => null,
          Option,
          Menu: (props) => (
            <components.Menu {...props} className='menuAnimate' />
          )
        }}
        styles={InlineEditStyled()}
        options={optionsMemo}
        value={value}
        isLoading={isLoading}
        placeholder={placeholder}
        onInputChange={onInputChangeWrapper}
        onChange={(input: any) => {
          i = 0;
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
    </Position>
  )
}

export default InlineEditDropdown
