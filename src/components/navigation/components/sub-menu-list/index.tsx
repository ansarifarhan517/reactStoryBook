import Link from 'next/link'
import { bemClass } from '@/utils'

import MenuTitle from '../menu-title'

import './style.scss'

type menuType = {
  label: string;
  href: string;
}

type subMenuListProps = {
  isLinkAactive: (path: string) => boolean
  displayName?: string;
  parentId?: string;
  menu?: menuType[];
}

const blk = 'sub-menu-list'

const SubMenuList = ({ displayName, menu, isLinkAactive, parentId }: subMenuListProps) => (
  <>
    <MenuTitle title={displayName} />
    <ul>
      {menu?.map(({ label, href }) => {
        const mapKey = label.replaceAll(' ', '_').toLocaleLowerCase()
        return (
          <li key={`${parentId}_${mapKey}`}>
            <Link
              href={href}
              className={bemClass([blk, 'link', { active: isLinkAactive(href) }])}
              data-auto-id={`${parentId}_${mapKey}`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  </>
)

export default SubMenuList
