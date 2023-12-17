import styled from 'styled-components';

interface IStyledMap {
  loading?: boolean
}
export const StyledText = styled.div`
  display: block;
  font-style: italic;
  color: #808080;
  transform: translateY(5px);
  line-height: 15px;
  font-weight: normal;
  margin-top: -10px;
`

export const StyledMapDiv =styled.div<IStyledMap>`
  color: ${({loading}) => loading ? '#fff' :  '#000' }
`
export const PolygonMap =styled.div`
  .leaflet-container{
    width: 100%;
    height: 100%;
  }
  .leaflet-draw-section, .leaflet-control-measure {
    display: none;
  }
`
