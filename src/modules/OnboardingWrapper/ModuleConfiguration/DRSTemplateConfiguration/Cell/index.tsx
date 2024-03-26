import React from 'react';
import {Cell} from 'react-table'
import TextOverflowEllipsis from '../../../../../utils/components/TextOverflowEllipsis';
import {Position,Toggle} from 'ui-library'
export const DRS_Template_Configuration_CELL_MAPPING ={
    default: React.memo(
        ({value}:Cell<any>) =>{
            return<TextOverflowEllipsis title= {value}>{value}</TextOverflowEllipsis>
        },
        (p,n)=>p.value === n.value
    ),
    isActiveFl: React.memo(
        ({value,column,row}:Cell)=>{
            const [active,setActive]=React.useState<boolean>(value)

            React.useEffect(()=>{
                setActive(value)
            },[value]);
            return(
                <Position type='absolute' top= '0.4em' left ='1em'>
                    <Toggle checked={active}
                    onChange={({
                            target:{checked},
                    }:React.ChangeEvent<HTMLInputElement>)=>{
                        setActive(checked);
                        column?.['cellCallback'](checked,row.original,setActive)
                    }}
                    disabled = {row?.original?.clientId === 0 ? true : false}
                    />
                </Position>
            );
        },
        (p,n)=> p.value=== n.value && p.column?.['cellCallBack'] ===n.column?.['cellCallback'] && 
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
    isFavourite: React.memo(
        ({ value }: Cell) => {
          return (
            <Position type="absolute" top="0em" left="1em">
              <Toggle checked={value} disabled />
            </Position>
          );
        },
        (p, n) =>
          p.value === n.value &&
          p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
          JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
      ),
}