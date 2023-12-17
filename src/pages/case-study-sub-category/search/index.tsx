import React from 'react'
import { PageHeader } from '@components'

const Search: React.FC = () => (
  <PageHeader
    title="Case study sub category"
    btnLabel="Add sub category"
    redirectUrl="/case-study-sub-category/create"
  />
)

export default Search
