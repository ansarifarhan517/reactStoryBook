import React, { useContext } from 'react'
import { TooltipPayload } from 'recharts'
import { ThemeContext } from 'styled-components'
import { StyledColorBox, StyledCount, StyledToolTip } from './StyledPieChart'

interface IToolTip {
  value?: string | number | React.ReactText[]
  name: string | number | React.ReactText[]
  entry: TooltipPayload
  total: number
}
interface IPayload {
  payload: Array<IToolTip>
}
const isDecimal = (num: number) => {
  return num * 100 !== Math.floor(num) * 100
}

const PieChartTooltip = ({
  payload,
  total
}: {
  payload: IPayload
  total: number
}) => {
  const details = payload[0]
  const theme = useContext(ThemeContext)
  const percentage = details.value && ((details.value as number) / total) * 100

  return (
    <StyledToolTip style={{ padding: '8px' }}>
      <div
        style={{ display: 'flex', width: '100%', alignItems: 'space-betweeb' }}
      >
        <div style={{ whiteSpace: 'nowrap' }}>
          <StyledColorBox
            color={details?.payload?.color || theme?.primary?.main}
          />
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              marginTop: '2px'
            }}
          >
            {`${details?.value ?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') | 0} - ${details?.name}`}
          </div>
        </div>
        <StyledCount>{`${
          isDecimal(percentage) ? percentage.toFixed(2) : percentage
        }%`}</StyledCount>
      </div>
    </StyledToolTip>
  )
}

export default React.memo(PieChartTooltip)
