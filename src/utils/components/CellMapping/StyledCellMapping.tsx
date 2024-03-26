import styled from 'styled-components';
import { Button } from 'ui-library'

interface IMultiSelect {
    isMenuOpen?:boolean
}


export const StyledBoxSkill = styled.div`
    border: 1px solid #ccc;
    padding: 3px;
    margin: 0px 2px;
    border-radius: 3px;
`
export const StyledSquare = styled(Button)`
        background: ${({ theme }) => theme?.colors?.primary?.main || '#5698d3'} ;
        color: ${({ theme }) => theme?.colors?.white};
        line-height: initial;
        vertical-align: middle;
        padding: 3px 3px;
        padding: 3px 5px;
        border-radius: 2px;
        button[disabled] {
            opacity: 0.65 !important;
        }
      
`

export const StyledMultiSelect = styled.div<IMultiSelect>`
    position:relative;
    width:100%;
    display:flex;
    .multiselct-input{
        padding-right: 21px;
        /* color:${({isMenuOpen})=> isMenuOpen ? '#fff' : '#000'}; */
        background-color: #fff;
    }
`

export const StyledAnchorTextCell = styled.div`
    a {
        color: ${({ theme }) =>theme?.colors?.primary?.main || '#5698d3'} !important;
        background: none  !important;
    }
`