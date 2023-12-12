import styled from 'styled-components'

interface IInlinePopupStyled {
  width: number
  height?: number
  top?: string
  left?: string
  right?: string
}
export const InlinePopStyled = styled.div<IInlinePopupStyled>`
  width: ${({ width }) => width + 'px'}};
  // height: ${({ height }) => height + 'px'}};
  position:absolute;
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  background-color: white;

`
export const InlinePopupWrapper = styled.div`
  position: relative;
`
