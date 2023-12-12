import styled from 'styled-components'

interface ILine {
  color: string
}

export const StyledLineChart = styled.div`
  width: 100%;
  .axis-title {
    font-size: 13px !important;
    font-family: 'Roboto-Medium', Arial, 'Gotham-Rounded-Medium';
    font-weight: 500 !important;
  }
  .recharts-cartesian-axis-tick-line {
    display: none;
  }
  .recharts-cartesian-axis-line {
    color: #070707;
  }
  .recharts-cartesian-axis-tick-value {
    color: #485465;
  }
  .yAxis {
    font-size: 11px;
  }
  .xAxis {
    font-size: 10px;
  }
`

export const StyledToolTip = styled.div`
  border: 1px solid var(--cornflower-blue);
  color: white;
  align-items: center;
  background-color: black;
  padding: 5px;
  opacity: 0.74;
  padding: 9px;
  div {
    font-size: 12px;
  }
  cursor: pointer;
`

export const StyledColorBox = styled.div<ILine>`
  width: 19px;
  height: 13px;
  background-color: ${({ color }) => color};
  margin-right: 20%;
  margin-top: 2px;
`

export const LegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 5px;
  .space-between {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`
export const Label = styled.div`
  padding-bottom: 5px;
  font-weight: bold;
`
