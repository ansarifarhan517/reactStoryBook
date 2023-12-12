// styled component for Location search component
import styled from 'styled-components'
import { getDefaultTheme } from '../../../../../utilities/theme'
const theme = getDefaultTheme()

// style for search input
export const SequenceWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 15px;
  left: 50%;
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  transform: translate(-50%, 0);
  box-shadow: ${theme?.shadows?.searchInput};
  background: white;
  padding: 5px 15px;
  max-width:80%;
`


export const SequenceIcon= styled.div`
svg{
  height:36px;
  padding-right:10px;
}`


export const TripIconWrapper = styled.div`
width: max-content;
overflow-y: hidden;
display:flex;
scroll-behavior: smooth;

`

