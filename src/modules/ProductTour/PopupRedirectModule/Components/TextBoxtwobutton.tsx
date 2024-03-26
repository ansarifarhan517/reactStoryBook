import React, { ReactElement } from 'react'


interface IAddressGeocodingProps {
    text: string;
}

import {
    IconButton,

} from 'ui-library';

export default function AddressGeocodingComponent(
    {
        text
    }: IAddressGeocodingProps): ReactElement {
    return (
        <>
            <div style={{ backgroundColor: 'RGB(244, 247, 250)', width: '100%', padding: '20px 20px 20px 20px', fontSize: '14px', lineHeight: '1.429' }}>
                {text}
                <div style={{ padding: '15px 0 0 0' }}>
                    <span style={{ paddingRight: '15px' }}><IconButton
                        primary
                        iconVariant="icomoon-save"
                        style={{ padding: "0px 15px", display: 'inline-flex', borderRadius: '4px' }}

                    ><div style={{ fontSize: '13px' }}>Try Now</div></IconButton></span>
                    <IconButton
                        primary
                        iconVariant="icon-notes"
                        style={{ padding: "0px 15px", display: 'inline-flex', borderRadius: '4px' }}

                    ><div style={{ fontSize: '13px' }}>Learn More</div></IconButton>
                </div>
            </div>

        </>
    )
}
