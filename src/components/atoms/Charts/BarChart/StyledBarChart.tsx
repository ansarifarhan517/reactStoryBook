import styled from 'styled-components'

export const StyledBarChart = styled.div`
  width: 100%;
  cursor: pointer;
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
