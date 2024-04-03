import { useCallback, FormEvent } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { bemClass } from '@/utils'
import navigation from '@/config/navigation'

import GoToSignUpPage from '@/components/go-to-sign-up-page'

import NavigationSection from '../navigation-section'

import './style.scss'

const blk = 'navigation-menu'

type navigationMenuProps = {
  isOpaque?: boolean;
  isIndia: boolean;
  toggleSigUpModal: (e: FormEvent) => void;
  toggleScheduleDemoModal: (e: FormEvent) => void;
}

const NavigationMenu = ({
  isOpaque,
  isIndia,
  toggleSigUpModal,
  toggleScheduleDemoModal
}: navigationMenuProps) => {
  const pathname = usePathname()

  const isLinkAactive = useCallback((path: string) => pathname.indexOf(path) !== -1, [pathname])

  const linkClass = bemClass([
    blk,
    'link',
    {
      'is-opaque': !!isOpaque,
    }
  ])
  const rightLinkClass = bemClass([
    blk,
    'right-link-wrapper',
    {
      'is-opaque': !!isOpaque,
    }
  ])

  return (
    <nav className={blk}>
      <ul className={bemClass([blk, 'nav-list'])}>
        {navigation.map(({ id, displayName, menu = [], label, href = '' }) => {
          const isActive = isLinkAactive(id)
          // const isProductsRootActive = isLinkAactive(id) && pathname === '/products'
          const hidePricingLink = isIndia && href === '/pricing'
          if (hidePricingLink) {
            return null
          }
          return (
            <li
              className={bemClass([
                blk,
                'link-wrapper',
                {
                  arrow: menu.length > 0,
                  active: isActive,
                  // 'products-root-active': isProductsRootActive,
                }
              ])}
              key={id}
            >
              <Link
                href={href}
                data-auto-id={id}
                className={bemClass([
                  blk,
                  'link',
                  {
                    'is-opaque': !!isOpaque,
                    active: isActive,
                    'arrow': menu.length > 0,
                    disabled: (menu.length > 0 && href !== '/products')
                  }
                ])}
              >
                {label}
              </Link>
              {!!menu.length && (
                <NavigationSection
                  parentId={id}
                  displayName={displayName}
                  menu={menu}
                  isLinkAactive={isLinkAactive}
                />
              )}
            </li>
          )
        })}
      </ul>
      <ul className={bemClass([blk, 'nav-list'])}>
        <li className={rightLinkClass}>
          <a
            href="https://products.loginextsolutions.com/product/#/login"
            target="_blank"
            title="Login"
            className={linkClass}
            rel="noreferrer"
            data-auto-id="login"
          >
            Login
          </a>
        </li>
        <GoToSignUpPage>
          <li className={rightLinkClass}>
            <a
              href="#"
              title="Sign up"
              className={linkClass}
              onClick={toggleSigUpModal}
              data-auto-id="sign-up"
            >
              Sign up
            </a>
          </li>
        </GoToSignUpPage>
        <GoToSignUpPage>
          <li className={rightLinkClass}>
            <a
              href="#"
              title="Schedule a Demo"
              className={linkClass}
              onClick={toggleScheduleDemoModal}
              data-auto-id="schedule-a-demo"
            >
              Schedule a demo
            </a>
          </li>
        </GoToSignUpPage>
      </ul>
    </nav>
  )
}

export default NavigationMenu
