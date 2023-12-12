import styled from 'styled-components'
import { DatePickerStyled } from '../DatePicker/Styles/DatePicker.styles'
import { IStyledStatusColorProps, ISlotSelected } from './interfaces'
import { Box } from '../../..'

export const StyledDatePickWrapper = styled(Box)`
  display: flex;
  width: auto;
  background-color: white;
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  max-width: 530px;
  align-items: stretch;

  .react-datepicker {
    box-shadow: none;
  }
`

export const StyledDateTimeSlotPicker = styled(DatePickerStyled)`
  position: relative;
  box-shadow: none;

  .react-datepicker__day {
    position: relative;
    width: 40px;
  }
  .none::after {
    left: 40%;
    content: '';
    height: 1px;
    border-radius: 50%;
    width: 3px;
    position: absolute;
    top: 25px;
    background-color: ${({ theme }) => theme?.colors?.grey?.A800};
  }
  .greenDay::after {
    left: 40%;
    content: '';
    height: 5px;
    border-radius: 50%;
    width: 5px;
    position: absolute;
    top: 25px;
    background-color: #87b66b;
  }
  .redDay::after {
    left: 40%;
    content: '';
    height: 5px;
    border-radius: 50%;
    width: 5px;
    position: absolute;
    top: 25px;
    background-color: #f28f69;
  }
`

export const StyledSlotBlockWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme?.colors?.grey['50']};
  justify-items: unset;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
`

export const StyledSlotLabel = styled.div`
  color: ${({ theme }) => theme?.colors?.grey?.A800};
`
export const DateTimeSlotPicker = styled.div`
  display: block;
`

export const StyledPreferenceDropdownWrapper = styled.div`
  & > div {
    display: inline-block;
  }
  & div[class$='-control'] {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
  }

  span {
    color: ${({ theme }) => theme?.colors?.grey?.A800};
    font-size: 12px;
  }
`
export const StyledFooterButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0px;
  background-color: white;

  & > button {
    margin: 0px 10px;
  }
`
export const StyledTime = styled.div`
  font-size: 18px;
  color: grey;
`
export const StyledPreferenceWrapper = styled.div`
  font-size: 12px;
  color: grey;
`
export const StyledSlotCard = styled.div<ISlotSelected>`
  background-color: ${({ selected, theme }) =>
    selected
      ? theme?.colors?.primary.main
      : theme?.colors?.primary.contrastText};
  & * {
    color: ${({ selected }) => (selected ? 'white' : 'inherit')};
  }
  color: ${({ selected }) => (selected ? 'white' : 'inherit')};
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
  cursor: pointer;
`

export const StyledStatusLabel = styled.div<IStyledStatusColorProps>`
  font-size: 12px;
  color: ${({ color, selected }) =>
    !selected ? (color === 'green' ? '#87b66b' : '#f28f69') : 'white'};
  align-self: center;
  font-style: italic;
`
export const SlotPickerStyled = styled.div`
  overflow: auto;
`
