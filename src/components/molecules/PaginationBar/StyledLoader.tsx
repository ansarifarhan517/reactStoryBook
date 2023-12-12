import styled from 'styled-components'


export const StyledLoader = styled.div`
position:relative;
width: 45px;
    .loader-element{
        width : 4px;
        height : 4px;
        background-color : ${({ theme }) => theme?.colors?.grey['A1000']};
    }
`;