import React from 'react'
import Pagination from '.'
import Box from '../../atoms/Box'
import { path } from '..'

import { boolean, number } from '@storybook/addon-knobs'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { action } from '@storybook/addon-actions'

export default {
  title: `${path}/Pagination`,
  component: Pagination
}

export const PaginationComponent = () => (
  <ThemeWrapper>
    <Box p='1em'>
      <Pagination
        pageSize={number('pageSize', 50)}
        totalRows={number('totalRows', 200)}
        disableNext = {boolean('disableNext',false)}
        pageNumber={number('pageNumber', 1)}
        onPageChange={action('Page Changed')}
        onPageSizeChange={action('Page Size Changed')}
        isTotalCountLoading={false}
        moreResultsExists={false}
        loading={false}
      />
    </Box>
  </ThemeWrapper>
)
