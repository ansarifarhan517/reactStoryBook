import React from 'react'
import { Button } from '@base'
import { bemClass } from '@utils'
import { Breadcrumb } from '@components'
import './style.scss'

const blk = 'page-header'

type IPageHeader = {
  title: string
  btnLabel?: string
  redirectUrl?: string
  showBreadCrumb?: boolean
  breadCrumbData?: Array<{
    label: string
    routeUrl?: string
  }>

}

const PageHeader: React.FC<IPageHeader> = ({
  title,
  btnLabel,
  redirectUrl,
  showBreadCrumb,
  breadCrumbData = [],
}) => (
  <div className={blk}>
    <h3 className={bemClass([blk, 'title'])}>{title}</h3>
    {(!showBreadCrumb && btnLabel) && (
      <Button asLink href={redirectUrl}>{btnLabel}</Button>
    )}
    {showBreadCrumb && (
      <Breadcrumb data={breadCrumbData} />
    )}
  </div>
)

export default PageHeader
