import styled from 'styled-components'

const NoDataFound = styled.div`
  color: ${({ theme }) => theme?.colors?.grey?.['800']};
  font-size: 15px;
  opacity: 0.7;
  position: absolute;
  top: 50%;
  left: 45%;
`

export default NoDataFound
