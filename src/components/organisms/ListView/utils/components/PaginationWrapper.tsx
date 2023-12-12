import React, { PropsWithChildren, useCallback } from 'react'
import { TableInstance } from 'react-table'
import PaginationBar from '../../../../molecules/PaginationBar'
import { IListViewRow } from '../../interfaces'
import Box from '../../../../atoms/Box'
// const pageSizeList = [25, 50, 100, 200]

interface IPaginationProps {
  instance: TableInstance<IListViewRow>
  totalRows: number
  isTotalCountLoading:boolean,
  disableNext?: boolean,
  moreResultsExists:boolean,
  onPageChange?: (pageNumber: number, pageSize: number) => void,
  loading?:boolean
}

const defaultCallback = (_: number) => {}
const PaginationWrapper = ({
  instance,
  totalRows = 0,
  isTotalCountLoading=false,
  moreResultsExists= false,
  disableNext = false,
  onPageChange = defaultCallback,
  loading = false
}: PropsWithChildren<IPaginationProps>) => {
  const {
    state: { pageIndex, pageSize },
    // rows,
    // pageCount,
    // canPreviousPage,
    // canNextPage,
    gotoPage,
    setPageSize
  } = instance

  const handleChangePage = useCallback(
    (newPage: number) => {
      gotoPage(newPage)
      setTimeout(() => {
        onPageChange(newPage + 1, pageSize)
      }, 0)
      // if (newPage === pageIndex + 1) {
      //   console.log('next')
      //   nextPage()
      // } else if (newPage === pageIndex - 1) {
      //   previousPage()
      // } else {
      //   gotoPage(newPage)
      // }
    },
    [gotoPage]
  )

  const handleChangeRowsPerPage = useCallback(
    (value) => {
      setPageSize(value)
      gotoPage(0)
      setTimeout(() => {
        onPageChange(1, value)
      }, 0)
    },
    [setPageSize]
  )

  return (
    <Box mr='7px'>
      <PaginationBar
        pageSize={pageSize}
        pageNumber={pageIndex + 1}
        isTotalCountLoading={isTotalCountLoading}
        totalRows={totalRows}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        moreResultsExists ={moreResultsExists}
        disableNext={disableNext}
        loading={loading}
      />
    </Box>
  )
}

export default PaginationWrapper
