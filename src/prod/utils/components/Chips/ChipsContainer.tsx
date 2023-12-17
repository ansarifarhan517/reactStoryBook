import styled from 'styled-components'

const ChipsContainer = styled.div.attrs(props => `sc-chips-container ${props.className || ''}`)`
  background: ${({ theme }) => theme?.colors?.grey?.['50'] || '#fafafa'};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme?.colors?.grey?.['450'] || '#ddd'};;
  box-sizing: content-box;
`

export default ChipsContainer