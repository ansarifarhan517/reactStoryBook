import styled from 'styled-components'

interface IPieChart {
  color: string
}

export const StyledToolTip = styled.div`
  border: 1px solid var(--cornflower-blue);
  width: auto;
  color: white;
  display: flex;
  align-items: center;
  background-color: black;
  padding: 8px 13px 8px 13px;
  div {
    font-size: 11px;
  }
  opacity: 0.74;
`
export const StyledCount = styled.div`
  display: inline-block;
  margin-top: 2px;
  margin-left: 75px;
`

export const StyledColorBox = styled.div<IPieChart>`
  width: 19px;
  display: inline-block;
  height: 13px;
  background-color: ${({ color }) => color};
  margin-right: 10px;
  vertical-align: middle;
  border: solid 1px #979797;
`

export const StyledPieChart = styled.div`
  display: flex;
  justify-content: space-between;
  pointer: none;
  .pie {
    cursor: pointer;
  }
`
