import React, { useState } from 'react';
import { Grid } from 'ui-library';
import './selectbox.css';
export interface IOption{
  optionDescLabel?: string
  optionDescLabelKey?: string
  optionId?: number
  optionIdentifier?: string
  optionLabel?: string
  optionLabelKey?: string
  optionValue?: string
  questionId?: number
  isIcon?: boolean,
  icon?: any
  event?: Event | undefined
  checked?: boolean
}
interface ISelectBoxProps {
  list: IOption[];
  col: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  type?: string;
  children: JSX.Element;
  style: object,
  isIcon?: boolean,
  icon?: any,
  getSelectedOption?: (IOption, boolean) => void,
  defaultSelectedValue: {
    questions : IOption[]
  },
  name?: string
  isListSelected?:boolean
  isHTML?: boolean,
  isOpeartionType?: boolean,
  inputType?:string,
}
const SelectBox: React.FunctionComponent<ISelectBoxProps> = ({
  children,
  list,
  col,
  style,
  type = 'select',
  getSelectedOption,
  isIcon = false,
  icon,
  defaultSelectedValue,
  name,
  isListSelected,
  isOpeartionType = false,
  inputType = 'dropdown',
  isHTML = false
}: ISelectBoxProps) => {
  const [selected, setSelected] = useState<number | undefined>(
    type === 'select' ? 
    defaultSelectedValue && 
    defaultSelectedValue.questions[0] && 
    list.findIndex((item) => {
      return item.optionId === defaultSelectedValue.questions[0].questionId
    }) >= 0 ? 
    defaultSelectedValue?.questions[0]?.questionId : 
    -1 
    : -1);

  React.useEffect(()=>{
    setSelected(defaultSelectedValue?.questions[0]?.questionId)
  },[defaultSelectedValue])

  return (
    <>
      <Grid container spacing={2} style={{display: isOpeartionType? 'flex' : 'inline-block', width: '100%', boxShadow: 'none'}}>
        {list.map((item, index) => {
          return (
            <Grid key={item.optionId} item xs={col} style={{...style, marginRight: index == 0 && name === 'OPERATIONS_MODE' ? "1%": "0%"}}>
              <div
                onClick={() => {
                  if(type === 'select'){
                    setSelected(item.optionId);
                    getSelectedOption(item, false);
                  }
                  // if(type === 'multiselect'){
                  //   setSelected(item.optionId);
                  // }
                }}
                id={item?.id || item?.optionId}
                className={`card__select__box ${
                  selected?.toString() === (!isListSelected && type === 'select' && item.optionId?.toString()) ? 'active' : ''
                }`}
              >
                {React.cloneElement(children as React.ReactElement<any>, {...item, getSelectedOption, defaultSelectedValue, selected: selected, isIcon: isIcon, icon: icon, isHTML: isHTML })}
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default SelectBox;
