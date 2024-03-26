import React from 'react'
import { Cell } from 'react-table'
import styled from 'styled-components'
import { TextInput } from 'ui-library'
import store from '../../../../../utils/redux/store'
const FieldWrapper = styled.span`
display: flex;
align-items: center;
.numberInput-input{
    min-height: 18px;
    display: inline;
    min-width: 40px;
    width: 80px;
    margin: 0;
    text-align:center
}
`
export default ({ value ,row,column}: Cell<any>) => {
    const fieldValue = store.getState().tripPlanningScheduler.form.data?.outSourcedFleet.results[row.index]?.selectedFleetCount
    return <FieldWrapper>
        <TextInput 
        type="number"
        name="selectedFleet"
        variant="basic"
        onChange={(e: any) => {
            if(e?.target?.value>value){
                e.currentTarget.value=value
            }
            else if(e?.target?.value<0){
                e.currentTarget.value =  Math.abs(e.target?.value)
            }
              column?.['cellCallback'](Math.abs(e.currentTarget?.value), {...row.original, selectedFleetCount:Math.abs(e.currentTarget?.value)}, row.id)
        }} 
          defaultValue={fieldValue}
          className="numberInput" width={50} height={18}  max={value} min={0}></TextInput> 
        &nbsp;  / &nbsp; {value || 0}
    </FieldWrapper>
}





