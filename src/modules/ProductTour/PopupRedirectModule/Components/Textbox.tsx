import React, { ReactElement } from 'react'
import ButtonGroup from './Buttongroup'

interface ITextboxProps {
    obj:any;
    btnObj:any;
}


export default function Textbox(
    {
        obj,btnObj
    }: ITextboxProps): ReactElement {
        console.log(obj,btnObj,"jat")
    return (
        <>
            <div style={{ backgroundColor: 'RGB(244, 247, 250)', width: '100%', padding: '20px 20px 20px 20px', fontSize: '14px', lineHeight: '1.429' }}>
                {obj?.text}
                <div style={{ padding: '15px 0 0 0' }}>
               <ButtonGroup  obj1={btnObj}/>


                </div>
            </div>

        </>
    )
}
