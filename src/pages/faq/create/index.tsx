import React from 'react'
import { PageHeader } from '@components'

const Create: React.FC = () => (
  <PageHeader
    title="FAQ"
    showBreadCrumb
    breadCrumbData={[
      {
        routeUrl: '/faq',
        label: 'Faq ',
      }, {
        label: 'Create ',

      }]}
  />
)

export default Create
