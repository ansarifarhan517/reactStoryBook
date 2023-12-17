import React from 'react'
import { PageHeader } from '@components'

const Search: React.FC = () => (
  <PageHeader title="Job category" btnLabel="Add category" redirectUrl="/job-category/create" />
)

export default Search