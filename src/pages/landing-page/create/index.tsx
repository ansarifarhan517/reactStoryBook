import React from 'react'
import { PageHeader } from '@components'

const Create: React.FC = () => (
  <PageHeader
    title="Landing Page"
    showBreadCrumb
    breadCrumbData={[
      {
        routeUrl: '/landing-page',
        label: 'Landing Page ',
      }, {
        label: 'Create',
      }]}
  />
)

export default Create
