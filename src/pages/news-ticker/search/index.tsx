import React from 'react'
import { PageHeader } from '@components'

const Search: React.FC = () => (
  <PageHeader title="News ticker" btnLabel="Add ticker" redirectUrl="/news-ticker/create" />
)

export default Search
