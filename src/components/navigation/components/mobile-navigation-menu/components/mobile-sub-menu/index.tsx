import Link from 'next/link'
import { bemClass } from '@/utils'

import './style.scss'

type menuType = {
  displayName?: string;
  label: string;
  href: string;
  id?: string;
  menu?: {
    label: string;
    href: string;
  }[];
}

type mobileSubMenuProps = {
  parentId: string;
  subMenu?: menuType[];
}

const blk = 'mobile-sub-menu'

const MobileSubMenu = ({ parentId, subMenu }: mobileSubMenuProps) => (
  <ul>
    {subMenu?.map(({ id, label, href, menu: bottomLevelMenu }) => {
      const isSitemap = (parentId === 'company' && id === 'site_map')
      const isGlossary = (parentId === 'resource' && id === 'glossary')

      if (isSitemap || isGlossary) {
        return null
      }

      return (
        <li key={id}>
          <Link
            href={href}
            className={bemClass([blk, 'link', ['main']])}
            data-auto-id={id}
          >
            {label}
          </Link>
          <ul>
            {bottomLevelMenu?.map(({ label, href }, index) => {
              const mapKey = label.replaceAll(' ', '_').toLocaleLowerCase()
              return (
                <li key={mapKey}>
                  <Link href={href} className={bemClass([blk, 'link', ['sub']])} data-auto-id={mapKey}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </li>
      )
    })}
  </ul>
)

export default MobileSubMenu
