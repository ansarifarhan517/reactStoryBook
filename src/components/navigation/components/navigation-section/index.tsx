import { bemClass } from '@/utils'

import MenuList from '../menu-list'

import JoinUsNavigation from '../join-us-navigation'

import './style.scss'

type menuType = {
  label: string;
  href: string;
  id: string;
  displayName?: string;
  menu?: {
    id: string;
    label: string;
    href: string;
  }[]
}

type navigationSectionProps = {
  parentId: string;
  displayName?: string;
  menu?: menuType[];
  isLinkAactive: (path: string) => boolean
}

const blk = 'navigation-section'

const NavigationSection = ({
  parentId,
  displayName,
  menu = [],
  isLinkAactive
}: navigationSectionProps) => {
  if (parentId === 'join-us') {
    return (
      <div className={bemClass([blk, ['join-us']])}>
        <JoinUsNavigation menu={menu} />
      </div>
    )
  }
  const eltClass = bemClass([
    blk,
    {
      'industries': parentId === 'industries',
      'company': parentId === 'company',
    }
  ])
  return (
    <div className={eltClass}>
      <div className={bemClass([blk, 'left'])}>
        <MenuList
          parentId={parentId}
          displayName={displayName}
          menu={menu}
          isLinkAactive={isLinkAactive}
        />
      </div>
    </div>
  )
}

export default NavigationSection
