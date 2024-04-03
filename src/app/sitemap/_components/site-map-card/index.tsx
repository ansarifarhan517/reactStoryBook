import Link from 'next/link'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import CardGridLayoutItem from '@/components/card-grid-layout-item'

type menuType = {
  label: string;
  href: string;
}

type siteMapCardProps = {
  title: string;
  menu: menuType[];
  href: string
}

import './style.scss'

const blk = 'site-map-card'

const SiteMapCard = ({ title, menu ,href }: siteMapCardProps) => (
  <CardGridLayoutItem className={blk}>
    <Link
      href={href ? href : '/'}
      className={
        bemClass([blk,'title-link',
          { disabled: (menu.length > 0 && href !== '/products') }
        ],)}
    >
      <Text
        tag="strong"
        typography="m"
        fontWeight="bold"
        color="black"
        className={bemClass([blk, 'title'])}
      >
        {title}
      </Text>
    </Link>
    <ul>
      {menu.map(({ label, href }, index) => {
        const key = `sitemap_menu_${index}`
        return (
          <li key={key}>
            <Link href={href} className={bemClass([blk, 'link'])}>
              {label}
              {title === 'platform' && (
                <sup className={bemClass([blk, 'sup'])}>TM</sup>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  </CardGridLayoutItem>
)

export default SiteMapCard
