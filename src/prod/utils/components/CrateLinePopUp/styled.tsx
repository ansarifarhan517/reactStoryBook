import styled from 'styled-components'
import { IExpandedProp }  from './interfaces'

export const ICrateLinePopUpWrapper = styled.div`
    width:100%;
`

export const StyledCrate  = styled.div`
    height: 50px;
    line-height: 50px;
    width: 100%;
    font-size: 15px;
    margin-bottom: 10px !important;
    padding: 0 10px;
    color: #5698d3;
    text-align: center;
    background: #fff !important;
    border: 2px dashed #5698d3 !important;
`

export const CrateLineHeaderWrapper = styled.div`
    color:#424242;
    display:flex;
    justify-content: space-between;
    & > * {
        align-self:center;
    }
`

export const ButtonWrapperStyled = styled.div`
    display:flex;
    justify-content: flex-end;

    & > button {
        margin:10px;
    }
`
export const StyledAccordionHeaders = styled.div<IExpandedProp>`
    color: ${({expanded}) => expanded ? 'white' : '#424242' }
`

export const FormDataWrapper= styled.div`
    
    & > div {
        display:inline-block;
        width: 100%;
        max-width:250px;
        margin:10px;
    }
    
`
export const CrateLineWrapper = styled.div`
    width: 1000px;
    height:400px;
    overflow:scroll;
`

export const ReadOnlyWrapper = styled.div`
    width:300px;
    padding:20px;
    & div {
        padding : 5px;
    }
    
`