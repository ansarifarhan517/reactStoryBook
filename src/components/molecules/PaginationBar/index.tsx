import React, { useState, useEffect, useCallback } from 'react'
import {
  StyledPagination,
  PageRange,
  IconButtonStyled
} from './StyledPagination'
// import IconButtonComponent from '../../atoms/IconButton'
// import DropDown from '../DropDown'
import Box from '../../atoms/Box'
import IconDropdown from '../IconDropdown'
import { OptionType } from '../DropDown/interface'
import Loader from '../../atoms/Loader'
import { StyledLoader } from './StyledLoader'

export interface IPaginationProps {
  pageNumber: number
  pageSize: number
  totalRows: number
  disableNext?: boolean
  pageSizeOptionList?: OptionType[]
  hidePageSizeOption?: boolean
  onPageChange: (pageNumber: number) => void
  onPageSizeChange: (pageSize: number) => void
  isTotalCountLoading: boolean
  moreResultsExists: boolean
  loading?:boolean
}

const calculateRange = (
  pageNumber: number,
  pageSize: number
): [number, number] => {
  pageNumber = !pageNumber || pageNumber <= 0 ? 1 : pageNumber

  const startIndex = (pageNumber - 1) * pageSize + 1
  const endIndex = startIndex + pageSize - 1

  return [startIndex, endIndex]
}

const PaginationBar = ({
  pageSize = 0,
  totalRows = 0,
  disableNext = false,
  pageNumber = 1,
  pageSizeOptionList = [
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '200', label: '200 per page' }
  ],
  hidePageSizeOption,
  isTotalCountLoading = false,
  moreResultsExists = false,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  loading = false
}: IPaginationProps) => {
  const [startIndex, setStartIndex] = useState<number>(1)
  const [endIndex, setEndIndex] = useState<number>(totalRows)
  const [_pageNumber, _setPageNumber] = useState<number>(pageNumber)
  const [_pageSize, _setPageSize] = useState<number>(pageSize)
  const [_pageSizeOptionList] = useState<OptionType[]>(pageSizeOptionList)
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(
    (pageNumber >= Math.ceil(totalRows / pageSize) && !moreResultsExists)  || totalRows <= _pageSize
  )
 
  const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(
    pageNumber === 1
  )
//
  useEffect(() => {
    _setPageNumber(pageNumber)
  }, [pageNumber])

  // in case the page size changes externally, re-calculate the internal state too
  // like in LIVE
  useEffect(() => {
    // handlePageSizeChange(Number(pageSize))
    _setPageSize(pageSize)
  }, [pageSize])

  useEffect(() => {
    const [newStartIndex, newEndIndex] = calculateRange(_pageNumber, _pageSize)
    setStartIndex(newStartIndex)
    setEndIndex(newEndIndex)
    setIsPreviousDisabled(_pageNumber === 1)
    setIsNextDisabled(
    
      (_pageNumber >= Math.ceil(totalRows / _pageSize) && !moreResultsExists) ||
        totalRows <= _pageSize
    )
  }, [totalRows, _pageSize, _pageNumber])

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      _setPageSize(newPageSize)
      _setPageNumber(1)
      onPageSizeChange(newPageSize)
    },
    [_setPageSize, _setPageNumber, onPageSizeChange]
  )

  const handlePageChange = useCallback(
    (newPageNumber: number) => {
      _setPageNumber(newPageNumber)
      onPageChange(newPageNumber - 1)
    },
    [_setPageNumber, onPageChange]
  )

  return (
    <StyledPagination>
      <IconButtonStyled
        iconVariant='angle-left'
        color='grey.A1000'
        iconSize='xs'
        onlyIcon
        circle
        onClick={() => handlePageChange(_pageNumber - 1)}
        disabled={isPreviousDisabled || loading}
      />
      {!isTotalCountLoading ? (
        <PageRange>{`${startIndex} - ${
          totalRows <= endIndex && totalRows >= startIndex
            ? totalRows
            : endIndex
        } of ${
          moreResultsExists
            ? totalRows <= endIndex
              ? endIndex === 1000
                ? 1000
                : `${endIndex}+`
              : endIndex >= 1000
              ? disableNext
              ? `${endIndex}`
              : `${endIndex}+`
              : '1000+'
            : totalRows
        }`}</PageRange>
      ) : (
        <PageRange>
          {`${startIndex} - ${
            totalRows <= endIndex && totalRows >= startIndex
              ? totalRows
              : endIndex
          } of `}
          <StyledLoader>
            <Loader center />
          </StyledLoader>
        </PageRange>
      )}
      <IconButtonStyled
        iconVariant='angle-right'
        color='grey.A1000'
        iconSize='xs'
        onlyIcon
        circle
        onClick={() => handlePageChange(_pageNumber + 1)}
        disabled={disableNext || isNextDisabled || loading}
      />

      {!hidePageSizeOption && (
        <Box mt='-5px'>
          <IconDropdown
            variant='pagination-size'
            width='100px'
            optionList={_pageSizeOptionList}
            onChange={(newPageSize) =>
              handlePageSizeChange(Number(newPageSize))
            }
            value={String(_pageSize)}
          />
        </Box>
      )}
    </StyledPagination>
  )
}

export default PaginationBar
