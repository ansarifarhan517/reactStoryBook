import React from 'react'
import { Table, Panel } from '@base'
import { PageHeader, GridActionButton } from '@components'

const Search: React.FC = () => {
  const columns = [
    { label: 'name', map: 'name' },
    { label: 'action', className: 'grid-action', custom: () => <GridActionButton editRoute="/tag-manager/update" deleteHandler={() => {}} /> },
  ]
  return (
    <>
      <PageHeader title="Tag Manager" btnLabel="Add Tag" redirectUrl="/tag-manager/create" />
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
