import styled from 'styled-components';

interface IMultiSelect {
    isMenuOpen?:boolean
}

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