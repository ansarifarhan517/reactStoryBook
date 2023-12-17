import React from 'react'
import styled from 'styled-components'
import { Box } from 'ui-library'

const StyledDiv = styled.div`
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    padding:10px;
`

interface IEmptyData {
    message: string
    imgSrc: string
}
const EmptyData = ({message, imgSrc}:IEmptyData) => {
 return (
    <StyledDiv>
        <img src={imgSrc} width='auto' height='224px'/>
        <Box m='30px'>
            {message}
        </Box>
    </StyledDiv>
    )
}

export default EmptyData