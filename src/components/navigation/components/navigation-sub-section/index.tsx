
import { bemClass } from '@/utils'

import SubMenuList from '../sub-menu-list'
import MenuRepresentation from '../menu-representation'

import './style.scss'

type menuType = {
  label: string;
  href: string;
}

type navigationSubSectionProps = {
  parentId?: string;
  mainMenuId?: string;
  isLinkAactive: (path: string) => boolean;
  subMenuDisplayName?: string;
  menu?: menuType[];
}

const blk = 'navigation-sub-section'

const NavigationSubSection = ({
  subMenuDisplayName,
  menu = [],
  parentId,
  mainMenuId,
  isLinkAactive
}: navigationSubSectionProps) => (
  <>
    <div className={blk}>
      {menu?.length > 0 && (
        <div className={bemClass([blk, 'menu'])}>
          <SubMenuList
            displayName={subMenuDisplayName}
            menu={menu}
            isLinkAactive={isLinkAactive}
            parentId={parentId}
          />
        </div>
      )}
      <div className={bemClass([blk, 'content'])}>
        <MenuRepresentation
          mainMenuId={mainMenuId}
          id={parentId}
        />
      </div>
    </div>
  </>
)

export default NavigationSubSection
