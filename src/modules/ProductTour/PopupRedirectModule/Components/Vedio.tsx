import React, { ReactElement } from 'react'


interface IAddressGeocodingProps {
    Url: string;
}


export default function AddressGeocodingComponent(
    {
        Url
    }: IAddressGeocodingProps): ReactElement {
    return (
        <>
        
<iframe height={399}  src={Url}>
</iframe>
        </>
    )
}
