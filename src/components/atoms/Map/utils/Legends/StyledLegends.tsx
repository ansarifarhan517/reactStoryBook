// styled component for Location search component
import styled from 'styled-components'
import { getDefaultTheme } from '../../../../../utilities/theme'
const theme = getDefaultTheme()

// style for search input
export const LegendsWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  bottom: 15px;
  left: 50%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  transform: translate(-50%, 0);
  box-shadow: ${theme?.shadows?.searchInput};
  background: white;
  padding: 5px 15px;
  .marker-connector {
    margin-left: 15px;
    margin-right: 15px;
  }
  .legend-wrapper {
    display: flex;
    flex-direction: row;
    margin-left: 5px;
    margin-right: 5px;
    overflow-x: hidden;
    max-width: 800px;
  }
`

export const StyledLegends = styled.div`
  display: flex;
  position: absolute;
  z-index: 1000;
  bottom: 15px;
  align-items: center;
  .icon-angle-left-thin {
    margin-right: 10px;
  }
  .icon-angle-right-thin {
    margin-left: 10px;
  }
`


export const SequenceIcon = styled.div`
svg{
  height:35px;
  }
`;
