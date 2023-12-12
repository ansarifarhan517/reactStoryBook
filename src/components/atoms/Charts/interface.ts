import { ReactNode } from 'react'
import { AxisDomain } from 'recharts'

export type tTooltipVariant = 'default' | 'withKpi' | 'withoutKpi'

export interface IBoxPlotTooltip {
  first: string
  last: string
  q1: string
  q3: string
  median: string
  category?: string
}
export interface IScatterTooltip {
  key?: string
  value: string
}
export interface IDetails {
  name: string // pie chart section and legend name
  value?: number | undefined // each sections value
  color: string // sections color
  active: boolean // whenever we can hmake section active inactive by toggling legend
  payload?: IDetails // whenever we hover on section, tooltip will come in this format
  key?: string
}

export interface IToolTip {
  value: string | number | React.ReactText[]
  name: string | number | React.ReactText[]
  color?: string
  legend?: string
  toolTipVariant?: string
  tooltipTitleList?: string[] | undefined
  barChartTooltip?: ({
    value,
    name,
    color,
    legend
  }: tBarChartTooltip) => ReactNode
}
export interface INameTooltip {
  label: Array<any>
  values: Array<any>
  theme?: any
  color?: string
}

export interface ILegends {
  details: Array<IDetails>
  isRow?: boolean
  onChange: (option: IDetails) => void
  font?: string
  size?: string
  color?: string
  isActive?: boolean
  isFullWidth?: boolean
}

export interface IReferenceLine {
  value: number
  color: string
}
export interface IBarChart {
  details: Array<any> // to make bar option configurable
  barGap?: number
  showXaxis?: boolean
  xAxisLabel: string
  yAxisLabel: string
  legendData: Array<IDetails>
  lineData: Array<object>
  showYaxis?: boolean
  height?: number
  _ticks?: Array<number>
  convertoPercent?: boolean
  toolTipVariant: tTooltipVariant
  tooltipWidth?: number
  tinyChartData: Array<any>
  tinyChartTitleList: Array<any>
  onChange: (option: IDetails) => void
  tinyChartLabelAngle: number
  labelAngle: number
  showTinyChart?: boolean
  onClick?: (data: any) => void
  onLineClick?: (data: any) => void
  disableClick?: boolean
  tooltipTitleList?: string[]
  inactiveBarOpacity?: number
  magnifierEndIndex?: number
  xAxisTickCharLimit?: number
  barChartTooltip?: ({
    value,
    name,
    color,
    legend
  }: tBarChartTooltip) => ReactNode
  selectedBarIndex?: number
  selectedBarName?: string
  legendFullwidth?: boolean
  yAxisLabelData ?: any
  domain?: [AxisDomain, AxisDomain]
}

export interface tBarChartTooltip {
  value?: string | number | React.ReactText[]
  name?: string | number | React.ReactText[]
  color?: string
  legend?: string
}
export interface tLineChartTooltip {
  label?: string
  selectedColor?: string
  legendData?: Array<IDetails>
  details?: Array<any>
}
export interface ILineChart {
  details: Array<any> // to make bar option configurable
  labelAngle: number
  xAxisLabel: string
  yAxisLabel: string
  legendData: Array<IDetails>
  showYaxis?: boolean
  showXaxis?: boolean
  height?: number
  _ticks?: Array<number>
  onChange: (option: IDetails) => void
  tooltipWidth?: number
  showTinyChart?: boolean
  startWithXaxis?: boolean
  onClick?: (option: IDetails, data: any) => void
  tickInPercentage?: boolean
  lineChartTooltip?: ({
    label,
    selectedColor,
    legendData,
    details
  }: tLineChartTooltip) => ReactNode
  magnifierStartIndex?: number
  xAxisTickCharLimit?: number
  legendFullwidth?: boolean
  convertoPercent?: boolean
  yAxisLabelData?:any
  domain?: [AxisDomain, AxisDomain]
}
export interface IPieChart {
  details: Array<IDetails>
  height?: number
  onLegendClick?: null | ((legend: IDetails) => void)
  onPieClick?: null | ((legend: any) => void)
}

export interface IBoxPlot {
  xAxisLabel: string
  yAxisLabel: string
  height?: number
  _ticks?: Array<number>
  xAxisTicks: string[]
  yAxisTickInterval?: number
  onClick?: (boxplotData: IBoxplotData) => void
  disableClick?: boolean
  boxPlotData: Array<Array<number>>
  scatterPlotData?: Array<Array<number>>
  lineData?: Array<any>
  scatterPlotName: string
  boxPlotName: string
  lineName: string
  yAxisTick?: Array<any>
  tooltipData: { [name: string]: IBoxPlotPart }
  boxPlotPartColor: IBoxPlotColor
  boxPlotToolTip?: ({
    first,
    last,
    q1,
    q3,
    median,
    category
  }: IBoxPlotTooltip) => string
  scrattorTooltip?: ({ key, value }: IScatterTooltip) => string
  selectedCategoryName?: string
}
interface IBoxPlotPart {
  first?: string
  last?: string
  q1?: string
  q3?: string
  median?: string
}
export interface IBoxPlotColor {
  first?: string
  q1?: string
  q3?: string
  median?: string
  box?: string
  highLight?: string
}

interface IBoxplotData {
  category: string // x axis
  whiskerLow: string // start of whisker
  q1: string // start of box
  median: string // middle value
  q3: string // end of box
  whiskerHigh: string // end of whisker
  event: any
}
