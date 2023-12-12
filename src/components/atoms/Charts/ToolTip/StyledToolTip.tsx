import styled from 'styled-components'

interface IToolTip {
  color?: string
  toolTipVariant?: string
}

export const LabelWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`
export const Options = styled.div`
  padding-bottom: 10px;
  white-space: nowrap;
`
export const StyledToolTip = styled.div<IToolTip>`
  border: 1px solid var(--cornflower-blue);
  color: white;
  display: flex;
  align-items: center;
  background-color: black;
  width: 100%;

  div {
    font-size: 11px;
  }
  opacity: 0.74;
  padding: ${({ toolTipVariant }) =>
    toolTipVariant === 'default' ? '12px 16px 12px 9px' : '12px 16px 2px 9px'};
`

export const StyledColorBox = styled.div<IToolTip>`
  width: 13px;
  height: 13px;
  background-color: ${({ color }) => color};
  margin-right: 10px;
`

export const StyledCount = styled.div`
  align-content: flex-end;
  display: flex;
  margin-left: 15%;
  align-items: space-vetween;
`
