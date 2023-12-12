import React, { useMemo } from 'react'
import Select, { components } from 'react-select'
import FontIcon from '../../../../atoms/FontIcon'
import { CustomStyles, StyledSelectWrapper } from './styled'

const AdvFiterDropdown = ({ options, value, onChange,limitOptionsList = 25 }: any) => {
  // console.log(value)
  const resultLimit = limitOptionsList;
  let i = 0
  const [input, setInput] = React.useState<any>();

  const onInputChangeWrapper = (newValue: string) =>{
    setInput(newValue);
  }
  
  const optionsMemo = useMemo(() => {
    return options?.filter((dropdownOption: { label: any }) => {
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
    <StyledSelectWrapper>
      <Select
        className='basic-single'
        classNamePrefix='react-select'
        // defaultValue={value}
        value={value}
        onInputChange={onInputChangeWrapper}
        isSearchable
        name='color'
        components={{
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
          DropdownIndicator: DownArrowIndicator,
          Option: (props) => (
            <div title={props.data.label}>
              <components.Option {...props} />
            </div>
          )
        }}
        options={optionsMemo}
        onChange={(e)=>{ i = 0;onChange(e)}}
        styles={CustomStyles()}
        valueKey='id'
        menuPlacement='auto'
       
      />
    </StyledSelectWrapper>
  )
}
export default AdvFiterDropdown

const DownArrowIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props} style={{ margin: '5px' }}>
      <FontIcon
        size={10}
        color='black'
        variant='triangle-down'
        hoverColor='black'
      />
    </components.DropdownIndicator>
  )
}
