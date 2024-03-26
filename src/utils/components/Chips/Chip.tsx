import styled from 'styled-components'

const Chip = styled.div.attrs(props => `sc-chip ${props.className || ''}`)`
  display: inline-block;
  padding: 0px 10px;
  font-size: 13px;
  border-radius: 2px;
  background-color: white;
  color: #525252;
  line-height: 26px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: default;
  box-shadow: 0 2px 15px -6px #000;
`

export default Chip