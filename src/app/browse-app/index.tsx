import React from 'react'
import { Header, Navigation } from '@components'
import PageContainer from '../../page-container'
import './style.scss'
const BrowseApp: React.FC = () => (
  <>
    <Header />
    <div className="wrapper">
      <Navigation />
      <PageContainer />
    </div>
  </>
)

export default BrowseApp
