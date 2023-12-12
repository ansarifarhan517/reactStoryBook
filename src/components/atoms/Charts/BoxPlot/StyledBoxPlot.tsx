import styled from 'styled-components'

export const StyledBoxPlot = styled.div`
  font-weight: bold;
  color: #485465;
  font-size: 15px;
  color: #485465;
  padding-left: 25px;

  .highcharts-root {
    font-family: inherit !important;
  }

  .highcharts-legend-item {
    .highcharts-graph {
      display: none;
    }
    .highcharts-point {
      width: 11px;
      height: 11px;
      margin: 1px 8px 1px 0;
    }
    tspan {
      margin: 0 0 0 8px;
      font-size: 11px;
      letter-spacing: -0.07px;
      color: #485465;
    }
  }
  .highcharts-tick {
    display: none;
  }
  .highcharts-xaxis-labels {
    font-weight: normal;
  }
  .highcharts-yaxis-labels {
    font-weight: normal;
  }
  .highcharts-tooltip {
    width: 400px;
    table {
      overflow: auto;
      tr {
        width: 100px;
        white-space: normal !important;
      }
      .text {
        display: inline;
        white-space: pre-wrap !important;
        width: 100px;
      }

      .color-box {
        height: 12px !important;
        width: 12px !important;
        margin-right: 5px;
      }
    }
  }
`
