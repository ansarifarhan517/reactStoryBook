import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ILine {
  color: string;
}

export interface IDetails {
  name: string;
  value?: number | undefined;
  planned?: number | undefined;
  color: string;
  active: boolean;
  payload?: IDetails;
  key?: string;
}
export interface tLineChartTooltip<T> {
  label?: string;
  selectedColor?: string;
  legendData?: Array<IDetails>;
  details?: Array<T>;
}
interface IToolTip {
  label: string;
  selectedColor: string;
  legendData: Array<IDetails>;
  details: Array<any>;
  activeKpi: string;
  dynamicLabels: any;
  lineChartTooltip?: ({
    label,
    selectedColor,
    legendData,
    details,
  }: tLineChartTooltip<any>) => ReactNode;
}

export const StyledBarChart = styled.div`
  width: 100%;
  .axis-title {
    font-weight: bold;
    color: #485465;
    font-size: 15px;
    color: #485465;
    opacity: 0.74;
  }
`;

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
`;

export const StyledColorBox = styled.div<ILine>`
  width: 19px;
  height: 13px;
  background-color: ${({ color }) => color};
  margin-right: 20%;
  margin-top: 2px;
`;

export const LegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 5px;
  .space-between {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;
export const Label = styled.div`
  padding-bottom: 5px;
  font-weight: bold;
`;

export const TextOverflowEllipsis = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 155px;
`

const TrendLineChartTooltip = ({
  activeKpi,
  label,
  selectedColor,
  legendData,
  details,
  dynamicLabels,
  lineChartTooltip: tooltip,
}: IToolTip) => {
  const newLegendData = React.useMemo(() => {
    const selectedLabelData = details.find(
      (entry: any) => entry.name === label
    );
    const newData = legendData.map((option: any) => {
      if (option.color === selectedColor) {
        option.selected = true;
      }
      if (activeKpi === 'actualBreakDuration') {
        option.value = selectedLabelData["actualBreakDuration"+option.name];
        option.planned = selectedLabelData['plannedBreakDuration'+option.name];
        } else {
        option.value = selectedLabelData[option.name];
      }
      return option;
    });
    return newData;
  }, [details, label, legendData, selectedColor]);

  return tooltip ? (
    <div>{tooltip({ label, selectedColor, legendData, details })}</div>
  ) : activeKpi === 'actualBreakDuration' ? (
    <StyledToolTip style={{ width: '110%' }}>
      <LegendWrapper>
        <div className='space-between'>
          <div style={{ width: "60%" }}>
            <Label>{label}</Label>
          </div>
          <div>
            <Label>{dynamicLabels?.actual}</Label>
          </div>
          <div>
            <Label>{dynamicLabels?.planned}</Label>
          </div>
        </div>
      </LegendWrapper>
      <div>
        {newLegendData.map((option: IDetails) => {
          return (
            <LegendWrapper key={option.name}>
              <StyledColorBox
                style={{ width: '18px', marginRight: '10px' }}
                color={option.color}
              />
              <div className='space-between'>
                <TextOverflowEllipsis>{`${option.name}`}</TextOverflowEllipsis>
                <div style={{ width: "20%", marginRight: "15px", textAlign:"right"}}>{option.value}</div>
                <div style={{ width: "20%", textAlign:"right" }}>{option.planned}</div>
              </div>
            </LegendWrapper>
          );
        })}
      </div>
    </StyledToolTip>
  ) : (
    <StyledToolTip>
      <Label>{label}</Label>
      <div>
        {newLegendData.map((option: IDetails) => {
          return (
            <LegendWrapper key={option.name}>
              <StyledColorBox
                style={{ width: '18px', marginRight: '10px' }}
                color={option.color}
              />
              <div className='space-between'>
                <TextOverflowEllipsis>{`${option.name}`}</TextOverflowEllipsis>
                <div>{option.value}</div>
              </div>
            </LegendWrapper>
          );
        })}
      </div>
    </StyledToolTip>
  );
};

export default React.memo(TrendLineChartTooltip);
