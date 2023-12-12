import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { INameTooltip, IToolTip } from '../interface'
import {
  LabelWrapper,
  Options,
  StyledColorBox,
  StyledCount,
  StyledToolTip
} from './StyledToolTip'

// KPI will be provided as a part of tooltip
const KPIToolTip = ({ label, values, theme, color }: INameTooltip) => {
  return (
    <StyledToolTip>
      <div style={{ display: 'flex', width: '100%' }}>
        <StyledColorBox color={color || theme?.primary?.main} />
        <NameTooltip label={label} values={values} />
      </div>
    </StyledToolTip>
  )
}

// only name and Achievement will be shown on tooltip
const NameTooltip = ({ label, values }: INameTooltip) => {
  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <LabelWrapper>
        {label.map((option) => (
          <Options key={option}> {option}</Options>
        ))}
      </LabelWrapper>
      <LabelWrapper>
        {values.map((value, index) => {
          return (
            <div style={{ marginLeft: '3px' }} key={`${value}${index}`}>
              <Options key={`${value}${index}`}> {` ${value}`}</Options>
            </div>
          )
        })}
      </LabelWrapper>
    </div>
  )
}

// selected color of legend, name and value will be shown
const DefaultTooltip = ({ color, value, name }: IToolTip) => {
  return (
    <StyledToolTip toolTipVariant='default'>
      <div style={{ display: 'flex', width: '100%' }}>
        <StyledColorBox color={color} />
        <div style={{ whiteSpace: 'nowrap' }}>{`${name}`} </div>
      </div>
      <StyledCount>{`${value}%`}</StyledCount>
    </StyledToolTip>
  )
}

const ToolTip = ({
  value,
  name,
  color,
  legend,
  toolTipVariant = 'default',
  tooltipTitleList,
  barChartTooltip
}: IToolTip) => {
  const theme = useContext(ThemeContext)

  const ToolTipComponent = {
    default: <DefaultTooltip color={color} value={value} name={name} />,
    withKpi: (
      <KPIToolTip
        theme={theme}
        color={color}
        label={tooltipTitleList || ['KPI:', 'Branch:', 'Achievement:']}
        values={[legend, name, `${value}`]}
      />
    ),
    withoutKpi: (
      <StyledToolTip style={{ padding: '8px 16px 3px 16px' }}>
        <NameTooltip
          label={tooltipTitleList || ['Name:', 'Achievement:']}
          values={[name, `${value}%`]}
        />
      </StyledToolTip>
    )
  }
  if (barChartTooltip) {
    return barChartTooltip({ value, name, color, legend })
  } else {
    return ToolTipComponent[toolTipVariant] || null
  }
}

export default React.memo(ToolTip)
