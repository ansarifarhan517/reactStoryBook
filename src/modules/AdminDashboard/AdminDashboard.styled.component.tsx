import styled from 'styled-components'
export const Tabs = styled.div`
box-shadow: 0 2px 20px -10px #000;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
min-height: 100px;
cursor: pointer;
`


export const WhiteBoxForTable = styled.div`
box-shadow: none;
position: absolute;
background: #fff;
top: -1px;
left: 0;
height: 100%;
width: 100%;
`

export const FilterAppliedTag = styled.div`
  position: relative;
  cursor: pointer;
  background: #fff;
  display: inline-block;
  padding: 0px 10px;
  font-size: 13px;
  line-height: 26px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0px 2px 15px -6px #000;
  padding-left: 20px;
  color: #525252;
  margin-left:20px;

  &:before {
    content: '';
      left: -13px;
      position: absolute;
      width: 0;
      height: 0;
      border-top: 13px solid transparent;
      border-bottom: 13px solid transparent;
      border-right: 13px solid #fff;
  }
`

export const FilterAppliedTagLabel = styled.span`
  display:inline-block;
  &:before {
    content: '';
    height: 10px;
    width: 10px;
    background: #eee;
    position: absolute;
    left: 0;
    top: 8px;
    border-radius: 50%;
    box-shadow: inset 1px 2px 8px -4px #000;
  }
`

export const FilterAppliedTagButtonWrapper = styled.div`
  display:inline-block;
`

export const TableHeader = styled.h4`
  display:inline-block;
`

export const TooltipRow = styled.div`
  display: block;
  margin: 5px;
`
export const TooltipColumn1 = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  vericle-align: middle;
  margin-right: 10px;
  border: 1px solid #979797;
`
export const TooltipColumn2 = styled.div`
  display: inline-block;
  
  width: 40%;
  
`
export const TooltipColumn3 = styled.div`
  display: inline-block;
  width: 25%;
  text-align: center;
`
export const LegendIcon = styled.div`
cursor: pointer;
border-radius: 2px;
height: 14px;
width: 14px;
display: inline-block;
margin-right: 10px;
vertical-align: middle;
`

export const LegendIconLine = styled.div<{background: any}>`
&:before {
  position: absolute;
  top: 4px;
  height: 2px;
  width: 24px;
  left: -7px;
  background: ${({ background }) => background ? background : '#000'};
  content: ''
}
cursor: pointer;
border-radius: 50%;
height: 14px;
width: 14px;
position:relative;
display: inline-block;
margin-right: 10px;
vertical-align: middle;
`


export const ChartWrapper = styled.div`
width: 98%;
    position: relative;
    background: #fff;
    margin: 20px;
    box-shadow: 0 2px 20px -10px #000 ;
`

export const IconDropdownStyle = styled.div`
  box-shadow: 0 2px 20px -10px #000 ;
  color: black;
  padding: 1px 15px 0px 15px;
  background-color: white;
  position: relative;
  left: 7.5px;
`