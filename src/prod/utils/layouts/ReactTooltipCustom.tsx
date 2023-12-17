import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

export const ReactTooltipCustom = styled(ReactTooltip)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main} !important;
  border-radius: 3px;
  font-size: 12px;
  padding: 8px 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, .3);
  opacity: 1;
`