import React, { ReactElement } from 'react'
import {
    IconButton,

  } from "ui-library";

interface IIconButtonProps {
    icon: string;
    text: string;
}


export default function IconButtonComponent(
    {
        icon,text
    }: IIconButtonProps): ReactElement {
    return (
        <>
        <IconButton
                  primary
                  iconVariant="icomoon-save"
                  style={{ padding: "0px 15px", display:'inline-flex' }}
                
                >{text}</IconButton>
        </>
    )
}
