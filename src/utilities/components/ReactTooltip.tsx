import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

const ReactTooltipCustom = styled(ReactTooltip)`
  background: ${({ theme }) => theme?.colors?.primary?.main} !important;
  font-size: 12px;
  padding: 8px 10px;
  max-width: 300px;
  top: 30px;
  opacity: 1;
  box-shadow: 0 2px 2px 0 rgba(105, 119, 151, 0.2);
  text-align: center;
  text-transform: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-shadow: none;
  border-radius: 3px;
  color: #fff;
`

export default ReactTooltipCustom
