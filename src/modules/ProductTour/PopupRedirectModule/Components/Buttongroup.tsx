import React, { ReactElement } from 'react'
import {
    IconButton,
} from "ui-library";

interface IButtongroupProps {

    obj1: Array<Object>;
}




export default function ButtonGroup(
    {
        obj1
    }: IButtongroupProps): ReactElement {
    return (
        <>
            {
                obj1.map((data: any) => {
                    console.log(data, "map", data['text'])
                    return (<span style={{ paddingRight: "20px" }}>
                        <IconButton
                            primary
                            iconVariant={data?.iconVar}
                            style={{ padding: "0px 15px", display: 'inline-flex', borderRadius: "4px" }}
                        >{data?.text}</IconButton>
                    </span>)

                })
            }

        </>
    )
}
