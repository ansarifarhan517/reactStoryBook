import Link from 'next/link'

import { bemClass } from '@/utils'

import './style.scss'

type FooterMenuProps = {
  id: string;
  label: string;
  menu: any;
  href?: string;
};

const blk = 'footer-menu'

const FooterMenu = ({ id, label, menu, href = '/' }: FooterMenuProps) => (
  <ul className={bemClass([blk])} id={id}>
    <li className={bemClass([blk, 'item'])}>
      <Link
        href={href}
        className={bemClass([
          blk,
          'link',
          {
            heading: true,
            disabled: (menu.length > 0 && href !== '/products')
          }
        ])}
        data-auto-id={`footer_${id}`}
      >
        {label}
      </Link>
    </li>
    {menu?.map((item: any) => (
      <li key={item.label} className={bemClass([blk, 'item'])}>
        <Link href={item.href} className={bemClass([blk, 'link'])} data-auto-id={`footer_${item.id}`}>
          {item?.label}
          {id === 'platform' && (
            <sup className={bemClass([blk, 'super-script'])}>TM</sup>
          )}
        </Link>
      </li>
    ))}
  </ul>
)

export default FooterMenu
