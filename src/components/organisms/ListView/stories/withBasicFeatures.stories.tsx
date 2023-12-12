import React from 'react'

import { path } from '../..'
import ListView from '..'

import Card from '../../../atoms/Card'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { action } from '@storybook/addon-actions'
import { generateRows, generateColumns } from '../utils/helpers'
import { object, number, boolean } from '@storybook/addon-knobs'
import { IListViewColumn, IListViewRow, IFilterProps } from '../interfaces'
import TextFilter from '../../../atoms/TextFilter'
import DropDown from '../../../molecules/DropDown'

export default {
  title: `${path}/ListView`,
  component: ListView
}

const generatedColumns: IListViewColumn[] = generateColumns(20)
const generatedRows: IListViewRow[] = generateRows({
  rowCount: 500,
  columnCount: 20,
  pageNumber: 1
})

generatedColumns[0].isFilterable = true
generatedColumns[0].isEditable = true
generatedColumns[0].isSortable = true
generatedColumns[0].Filter = ({ textFieldProps, filters }: IFilterProps) => (
  <TextFilter {...textFieldProps} value={filters.column1} />
)
generatedColumns[1].isFilterable = true
generatedColumns[1].Filter = ({ selectFieldProps }) => (
  <DropDown
    // value={filters[fieldKey]}
    {...selectFieldProps}
    // value='true'
    variant='list-view'
    optionList={[
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'absent', label: 'Absent' },
      { value: 'present', label: 'Present' }
    ]}
    width='100%'
  />
)
generatedRows[1].hasSelectionDisabled = true
generatedRows[1].checkboxTooltipText =
  'Tooltip Text Tooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip TextTooltip Text'

generatedRows[2].ignoreSelectAll = true

export const withBasicFeatures = () => {
  return (
    <ThemeWrapper>
      <Card>
        <ListView
          hasRadioSelection={boolean('show Radio', false)}
          rowIdentifier='id'
          hasRowSelection={boolean('hasRowSelection', false)}
          hasRowSelectionWithEdit={boolean('hasRowSelectionWithEdit', true)}
          loading={boolean('loading', false)}
          isColumnLoading={boolean('isColumnLoading', false)}
          isEditMode={boolean('isEditMode', false)}
          hideColumnSettings={boolean('hideColumnSettings', false)}
          hidePaginationBar={boolean('hidePaginationBar', false)}
          hideRefresh={boolean('hideRefresh', false)}
          disableScrollOverlay={boolean('disableScrollOverlay', false)}
          style={{ height: '90vh' }}
          filters={object('filters', { column1: 'my filter' })}
          sorts={object('sorts', [{ id: 'column1', desc: true }])}
          onFilterChange={action('onFilterChange')}
          columns={object('columns', generatedColumns)}
          data={object('rows', generatedRows)}
          totalRows={number('totalRows', 1000)}
          totalActualCount={number('totalActualCount', 1000)}
          onRowEditClick={action('On Row Edit Click')}
          onFetchData={action('On Fetch Data')}
          onRowSelect={action('On Row Select')}
          onSortChange={action('On Sort Change')}
          onShowMoreColumns={action('On Show More Columns: ')}
          onApply={action('On Apply')}
          onPageChange={action('On Page Change')}
          paginationPageSize={number('pageSize', 50)}
          hasSelectAllRows={boolean('hasSelectAllRows', false)}
          showFavouriteStar={boolean('showFavouriteStar', true)}
          moreResultsExists
        />
      </Card>
    </ThemeWrapper>
  )
}

// export {}
