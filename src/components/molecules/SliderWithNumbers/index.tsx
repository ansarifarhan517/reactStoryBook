import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import Typography from '../../atoms/Typography'
import ProgressBarDraggable from '../../atoms/ProgressBarDraggable'
import NumberInput from '../NumberInput'
import Position from '../Position'
import useDebounce from '../../../utilities/useDebounce'
export interface ISliderWithNumbersProps {
  children?: ReactNode
  minRange: number
  maxRange: number
  selectedRange: number
  errorMessage?: string
  resetOutOfBounds: boolean
  resetInterval?: number
  setFinalData ?:any
}

const SliderWithNumbersStyled = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.grey['200']};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 0;
  & > * {
    display: inline-block;
    padding: 0px 5px;
  }
  & > div {
    letter-spacing: 0.6px;
  }
`

const SliderWithNumbers = ({
  children,
  minRange = 0,
  maxRange = 100,
  selectedRange = 0,
  resetOutOfBounds = false,
  resetInterval = 200,
  setFinalData,
  ...rest
}: ISliderWithNumbersProps) => {
  const [progressPercent, setProgressPercent] = React.useState(0);  // for slider value between 0 to 100
  const [selectionNumberState, setSelectionNumber] = React.useState(selectedRange); 
  let debounceTime = resetOutOfBounds? resetInterval : 0
  const selectionNumber = useDebounce(selectionNumberState, debounceTime)
  

  useEffect(() => {
    setSelectionNumber(selectedRange)
  }, [selectedRange])

  useEffect(() => {
    if (selectionNumber >= minRange &&  selectionNumber <= maxRange) {
      setProgressPercent(Math.round((selectionNumber-minRange)/(maxRange-minRange) * 100));
    } else if (selectionNumber < minRange) {
      setProgressPercent(0)
      resetOutOfBounds && resetTextBox(true)
    } else if (selectionNumber > maxRange) {
      setProgressPercent(100)
      resetOutOfBounds && resetTextBox(false)
    }
  }, [selectionNumber])


  
  const resetTextBox = (toMin: boolean) => {
    if (toMin) {
      setSelectionNumber(minRange)
      setFinalData(minRange)
    } else {
      setSelectionNumber(maxRange)
      setFinalData(maxRange)
    }
  }

  const handleTextChange = (txtField: string) => {
    let newRangeNum = parseInt(txtField)
    if (newRangeNum !== NaN) {
      setFinalData(newRangeNum)
      setSelectionNumber(newRangeNum)
    }
  };  
  const handleSliderChange = (changedPercent: number) => {
    if (changedPercent !== NaN) {
      let txtFieldNum = Math.round(minRange + ((maxRange-minRange) * changedPercent / 100))
      setSelectionNumber(txtFieldNum)
      setFinalData(txtFieldNum)
    }
  };

  return (
    <Position display='block' type='relative'>
      <SliderWithNumbersStyled>
        <Typography
          useStyle={false}
          font-size='11px'
          color='black'
          {...rest}
        >
          {minRange}
        </Typography>
        <ProgressBarDraggable
          completedPercent = {progressPercent}
          notifySliderChange={(newPercent: number) => handleSliderChange(newPercent)}
        />
        <Typography
          useStyle={false}
          font-size='11px'
          color='black'
          {...rest}
        >
          {maxRange}
        </Typography>
        <NumberInput
          id='someId'
          name='someName'
          className='someClassName'
          label={""}
          maxLength={10}
          initialValue={selectionNumber}
          required={false}
          fullWidth={false}
          onChange={(e) => handleTextChange(e)}
        />
        {children}
      </SliderWithNumbersStyled>
    </Position>
  )
}
export default SliderWithNumbers
