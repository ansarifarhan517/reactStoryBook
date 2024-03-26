import React /*ReactNode*/ from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../../../../../utils/redux/rootReducer';

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

export interface IPercentage {
  countFirstRange: number;
  countSecondRange: number;
  countThirdRange: number;
  countFourthRange: number;
}
interface IToolTip {
  kpiAchivement: string | number | React.ReactText[] | undefined;
  // dynamicLabels: any;
  percentage: IPercentage;
}

export const StyledToolTip = styled.div`
  border: 1px solid var(--cornflower-blue);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: black;
  padding: 5px;
  opacity: 0.74;
  padding: 9px;
  width: 300px;
  div {
    font-size: 12px;
  }
  cursor: pointer;
`;

export const LegendWrapper = styled.div.attrs(props => ({
  className: `legend-wrapper ${props.className} || ''`
}))`
    display: flex;
    flex-direction: row;
    padding-bottom: 5px;
    .space-between {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;

export const TableAchivement = styled.table`
  border-collapse: separate;
  border-spacing: 0 5px;
  overflow-wrap: break-word;
  padding-left: 5px;
`;

export const TableDataAchivement = styled.td`
  width: 20px;
  height: 5px;
  margin-right: 5px;
  font-size: 11px;
`;

export const TableRow = styled.tr.attrs((props) => ({
  className: `styled-tr ${props.className} || ''`,
}))``;

export const Div = styled.div.attrs((props) => ({
  className: `styled-div ${props.className} || ''`,
}))``;

export const DivSpaceBetween = styled.div.attrs((props) => ({
  className: `styled-div ${props.className} || ''`,
}))`
display: flex;
    width: 100%;
    justify-content: space-between;

`;

export const TableRange = styled.table`
  border-collapse: separate;
  border-spacing: 0 5px;
  overflow-wrap: break-word;
  border-top: 2px solid #fff;
  margin: 10px 0 0;
  padding: 10px 0 0;
  .space-between {
    
  }
`;

export const TableHead = styled.thead.attrs((props) => ({
  className: `styled-thead ${props.className} || ''`,
}))``;

export const TableBody = styled.tbody.attrs((props) => ({
  className: `styled-tbody ${props.className} || ''`,
}))``;

export const DivInline = styled.div`
  display: inline;
`;

export const TableDataCenter = styled.td`
  text-align: center;
`;

export const TableHeaderCenter = styled.th`
  height: 15px;
  margin-right: 5px;
  text-align: center;
`;

export const TableHeaderCenterPadding = styled.th`
  text-align: center;
  padding-top: 10px;
`;

export const TableHeaderCenterMarginBottom = styled.th`
  text-align: center;
  white-space: nowrap;
  margin-bottom: 10px;
`;

export const TableDateCenterHeight = styled.td`
  height: 15px;
  margin-right: 5px;
  text-align: center;
`;

const BarChartTooltip = ({
  kpiAchivement,
  percentage,
}: IToolTip) => {
const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  return (
    <StyledToolTip className='custom-barchart-tooltip'>
      <LegendWrapper className="div-space-between">
        <TableAchivement className='barchart-achievement-table'>
          <TableRow className='barchart-achivement-row'>
            <TableDataAchivement className='barchart-achivement-row'>
              <DivSpaceBetween className='div-space-between'>
                <Div className='average-achievement'>
                  {dynamicLabels.Average} {dynamicLabels.Achievement} (%):
                </Div>
                <Div className='kpi-achievement'>{kpiAchivement}%</Div>
              </DivSpaceBetween>
            </TableDataAchivement>
          </TableRow>
        </TableAchivement>
      </LegendWrapper>
      <TableRange className='achivement-range-table'>
        <TableHead className='achivement-range-table-head'>
          <TableRow className='achivement-range-table-row'>
            <TableHeaderCenter className='th-center'>
              <DivInline className='percentage-range'>
                {dynamicLabels.Achievement} (%)
              </DivInline>
            </TableHeaderCenter>
            <TableHeaderCenterMarginBottom className='th-mb'>
              <DivInline className='percentage-range'>
                No. of {dynamicLabels.deliveryMedium}
              </DivInline>
            </TableHeaderCenterMarginBottom>
          </TableRow>
          <TableRow>
            <TableHeaderCenter className='th-center'>
              <DivInline className='percentage-range'>0% - 25%</DivInline>
            </TableHeaderCenter>
            <TableHeaderCenterPadding className='th-padding-top'>
              <DivInline className='percentage-range'>
                {percentage.countFirstRange}
              </DivInline>
            </TableHeaderCenterPadding>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableDateCenterHeight className='td-center-height'>
              <DivInline className='percentage-range'>25.01% - 50%</DivInline>
            </TableDateCenterHeight>
            <TableDataCenter>
              <DivInline className='percentage-range'>
                {percentage.countSecondRange}
              </DivInline>
            </TableDataCenter>
          </TableRow>
          <TableRow>
            <TableDateCenterHeight className='td-center-height'>
              <DivInline className='percentage-range'>50.01% - 75%</DivInline>
            </TableDateCenterHeight>
            <TableDataCenter className='td-center'>
              <DivInline className='percentage-range'>
                {percentage.countThirdRange}
              </DivInline>
            </TableDataCenter>
          </TableRow>
          <TableRow>
            <TableDateCenterHeight className='td-center-height'>
              <DivInline className='percentage-range'>75.01% - 100%</DivInline>
            </TableDateCenterHeight>
            <TableDataCenter className='td-center'>
              <DivInline className='percentage-range'>
                {percentage.countFourthRange}
              </DivInline>
            </TableDataCenter>
          </TableRow>
        </TableBody>
      </TableRange>
    </StyledToolTip>
  );
};

export default React.memo(BarChartTooltip);
