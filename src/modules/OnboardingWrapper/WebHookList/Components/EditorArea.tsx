import React from 'react'
import {EditorAreaStyled} from './styled'
import {InputLabel}  from 'ui-library'



const EditorArea = ({responseBody, label}:any) => {
    return (
        <EditorAreaStyled>
            <InputLabel bold style={{
                 backgroundColor:'transparent',
                 fontSize:'14px',
                 padding: '5px 0px',
            }}>
                {label}
            </InputLabel>
            <pre>
                {responseBody && JSON.stringify(responseBody,undefined, 2)}
            </pre>
        </EditorAreaStyled>
    )
}

export default EditorArea