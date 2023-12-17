import styled from 'styled-components'
import { Card } from 'ui-library'

const WhiteCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  padding-right: 0;
  padding-bottom: 0;
  box-shadow: 0px 2px 20px -10px #000 !important;
  &.fullWidth {
    width: 100%;
  }

  &.fullHeight {
    height: 100%;
  }
`

export default WhiteCard