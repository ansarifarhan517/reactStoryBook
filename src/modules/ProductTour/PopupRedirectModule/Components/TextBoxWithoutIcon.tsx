import React, { ReactElement } from 'react'


interface IAddressGeocodingProps {
    text: string;
}


export default function AddressGeocodingComponent(
    {
text
    }: IAddressGeocodingProps): ReactElement {
    return (
        <>
<div style={{backgroundColor:'RGB(244, 247, 250)',width:'100%',padding:'20px 20px 20px 20px',fontSize:'14px',lineHeight:'1.429'}}>{text}</div>
        </>
    )
}
