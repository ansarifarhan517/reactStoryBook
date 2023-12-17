import React from 'react'
import { Table, Panel } from '@base'
import { PageHeader, GridActionButton } from '@components'

const Search: React.FC = () => {
  const columns = [
    { label: 'name', map: 'name' },
    { label: 'action', className: 'grid-action', custom: () => <GridActionButton editRoute="/new-category/update" deleteHandler={() => {}} /> },
  ]
  return (
    <>
      <PageHeader title="News Category" btnLabel="Add new category" redirectUrl="/news-category/create" />
      <Panel>
        <Table
          data={[{ name: 'Ashish' }, { name: 'Farahan' }]}
          columns={columns}
        />
      </Panel>
    </>
  )
}

export default Search
