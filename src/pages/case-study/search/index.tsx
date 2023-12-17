import React from 'react'
import { Table, Panel } from '@base'
import { PageHeader, GridActionButton } from '@components'

const Search: React.FC = () => {
  const columns = [
    { label: 'name', map: 'name' },
    { label: 'name', map: 'name' },
    { label: 'name', map: 'name' },
    { label: 'action', className: 'grid-action', custom: () => <GridActionButton editRoute="/case-study/123" deleteHandler={() => {}} /> },
  ]
  return (
    <>
      <PageHeader title="Case study" btnLabel="Add case study" redirectUrl="/case-study/create" />
      <Panel>
        <Table
          data={[{ name: 'santosh' }, { name: 'Pratik' }]}
          columns={columns}
        />
      </Panel>
    </>
  )
}

export default Search
