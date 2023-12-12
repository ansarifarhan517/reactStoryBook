import styled from 'styled-components'
import Grid from '../../../atoms/Grid'

interface ICard {
  isPositive?: boolean
  isSelected?: boolean
  subTitle?: boolean
}

export const CardTitle = styled.div<ICard>`
  display: flex;
  font-size: 14px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme?.colors?.white : theme?.colors?.grey['A100']};
  letter-spacing: 0.14px;
  justify-content: space-between;
  padding: 16px 17px 0px 17px;
`
export const PieChartWrapper = styled.div`
  padding: 9px 17px 20px 17px;
`
export const Fulfilment = styled.span<ICard>`
  font-size: 14px;
  letter-spacing: 0.14px;
  text-align: right;
  font-weight: 500;
  color: ${({ isPositive, theme, isSelected }) => {
    if (isSelected) {
      return theme?.colors?.white
    }
    return isPositive ? theme?.colors?.green : theme?.colors?.charts?.red
  }};
`

export const Divider = styled.div<ICard>`
  padding-top: ${({ subTitle }) => (subTitle ? '25px' : '57px')};
  margin: 0px 17px 0px 17px;
  border-bottom: 0.5px solid ${({ theme }) => theme?.colors?.grey['A800']};
`
export const SyledGrid = styled(Grid)`
  @media only screen and (min-width: 960px) and (max-width: 1280px) {
    flex-basis: 50%;
    max-width: 50%;
  }
`
export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.14px;
  color: #545454;
`
export const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.14px;
  color: #545454;
`
