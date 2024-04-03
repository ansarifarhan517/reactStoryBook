import Link from 'next/link'
import { bemClass } from '@/utils'

import MenuTitle from '../menu-title'
import NavigationSubSection from '../navigation-sub-section'

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

type menuListType = {
  isLinkAactive: (path: string) => boolean
  parentId: string;
  displayName?: string;
  menu?: menuType[];
}

const blk = 'menu-list'

const MenuList = ({
  parentId,
  displayName,
  menu,
  isLinkAactive,
}: menuListType) => (
  <>
    <MenuTitle title={displayName} />
    <ul className={blk}>
      {menu?.map(({ id, label, href, displayName: subMenuDisplayName, menu: subMenu }) => {
        const isActive = isLinkAactive(href)
        const isSitemap = (parentId === 'company' && id === 'site_map')
        const isGlossary = (parentId === 'resource' && id === 'glossary')

        if (isSitemap || isGlossary) {
          return null
        }

        return (
          <li
            key={id}
            className={bemClass([blk, 'link-wrapper', { active: isActive }])}
          >
            <Link
              href={href}
              className={bemClass([blk, 'link', { active: isActive }])}
              data-auto-id={id}
            >
              {label}
              {parentId === 'products' && (<sup className={bemClass([blk, 'sup'])}>TM</sup>)}
            </Link>
            <div className={bemClass([blk, 'sub-section'])}>
              <NavigationSubSection
                parentId={id}
                mainMenuId={parentId}
                menu={subMenu}
                subMenuDisplayName={subMenuDisplayName}
                isLinkAactive={isLinkAactive}
              />
            </div>
          </li>
        )
      })}
    </ul>
  </>
)

export default MenuList
