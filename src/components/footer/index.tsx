'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { bemClass } from '@/utils'

import footerNavigation from '@/config/footer-navigation'
import socialNavigation from '@/config/social-navigation'

import LoadWhenInView from '../load-when-in-view'
import AppStoreButton from '../app-store-button'

import FooterMenu from './components/footer-menu'
import CopyRight from './components/footer-terms-conditions'
import FooterActions from './components/footer-actions'

import './style.scss'

type footerNavigation = {
  id: string;
  label: string;
  menu?: Array<object>;
  href?: string;
};

const blk = 'footer'

const Footer = () => {
  const pathName = usePathname()
  // Do not render the header for /customernps page
  const isCustomerNps = pathName === '/customernps'
  return (
    <footer>
      {!isCustomerNps && (
        <>
          <section className={bemClass([blk])}>
            <div className={bemClass([blk, 'container'])}>
              {footerNavigation.map(
                ({ id, label, menu = [], href }: footerNavigation) => {
                  if (menu.length) {
                    return (
                      <FooterMenu
                        key={id}
                        id={id}
                        label={label}
                        menu={menu}
                        href={href}
                      />
                    )
                  }
                }
              )}
              <ul className={bemClass([blk, 'social-accounts'])}>
                <li className={bemClass([blk, 'social-header'])}>Follow Us</li>
                <LoadWhenInView tag="li" className={bemClass([blk, 'social'])}>
                  <>
                    {socialNavigation?.map(({ id, label, href }) => (
                      <Link
                        key={id}
                        href={href}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label={label}
                        data-auto-id={id}
                        className={bemClass([blk, 'social-link', [id]])}
                      />
                    ))}
                  </>
                </LoadWhenInView>
                <li className={bemClass([blk, 'social-items'])}>
                  <AppStoreButton />
                </li>
              </ul>
            </div>
            <FooterActions />
          </section>
          <CopyRight />
        </>
      )}
    </footer>
  )
}

export default Footer
