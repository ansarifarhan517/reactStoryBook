import styled from 'styled-components';

export const UatFormWrapper = styled.div`
  height: 40%;
  margin-top: 3px;
  padding: 0px 3px;
  margin-bottom: 3px;
  
  .grid-item {
    padding: 0px 5px;
  }
  .uatForm {
    align-self: center;
    & div{
      text-transform: capitalize;
    }
    & ::placeholder {
      text-transform: capitalize;
   }
  }
`

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`
