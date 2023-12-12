import styled from 'styled-components'

const ScrollOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
  background: rgba(0, 0, 0, 0);
`

export default ScrollOverlay
