import React from 'react'
import { NavLink } from 'react-router-dom'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'breadcrumb'

type IBreadcrumbProps = {
  data: Array<{
    label: string
    routeUrl?: string
  }>
}

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ data }) => (
  <ul className={blk}>
    {data.map((dataItem, index) => {
      const { label, routeUrl } = dataItem
      if (routeUrl) {
        const key = `${routeUrl}_${index}`
        return (
          <li key={key} className={bemClass([blk, 'list-item'])}>
            <NavLink to={routeUrl} className={bemClass([blk, 'link'])}>
              {label}
            </NavLink>
            <span className={bemClass([blk, 'separator'])}>
              &gt;
            </span>
          </li>
        )
      }
      const key = `list_item_${index}`
      return (
        <li key={key} className={bemClass([blk, 'list-item'])}>
          {label}
        </li>
      )
    })}
  </ul>
)

export default Breadcrumb
