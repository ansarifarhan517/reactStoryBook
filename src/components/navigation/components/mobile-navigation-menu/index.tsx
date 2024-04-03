import { FormEvent } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'

import { bemClass } from '@/utils'

import navigation from '@/config/navigation'

import GoToSignUpPage from '@/components/go-to-sign-up-page'

import MobileTopLevelMenu from './components/mobile-top-level-menu'

import './style.scss'

type mobileNavigationMenuProps = {
  toggleSigUpModal: (e: FormEvent) => void;
  toggleScheduleDemoModal: (e: FormEvent) => void;
  isIndia: boolean;
}

const blk = 'mobile-navigation-menu'

const variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.1,
    },
  },
}

const menuVariant = {
  hidden: {
    opacity: 0,
    x: -400,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
}


const MobileNavigationMenu = ({
  toggleSigUpModal,
  toggleScheduleDemoModal,
  isIndia,
}: mobileNavigationMenuProps) => (
  <LazyMotion features={domAnimation}>
    <m.ul
      className={blk}
      variants={variants}
      initial="hidden"
      animate="show"
    >
      {navigation.map(({ id, label, href, menu }) => {
        const hidePricingLink = isIndia && href === '/pricing'
        if (hidePricingLink) {
          return null
        }
        return (
          <MobileTopLevelMenu
            key={id}
            id={id}
            label={label}
            href={href}
            menu={menu}
            menuVariant={menuVariant}
          />
        )
      })}
      <m.li variants={menuVariant}>
        <a
          href="https://products.loginextsolutions.com/product/#/login"
          target="_blank"
          title="Login"
          className={bemClass([blk, 'label'])}
          rel="noreferrer"
          data-auto-id="login"
        >
            Login
        </a>
      </m.li>
      <GoToSignUpPage>
        <m.li variants={menuVariant}>
          <a
            href="#"
            title="Sign up"
            className={bemClass([blk, 'label'])}
            onClick={toggleSigUpModal}
            data-auto-id="sign-up"
          >
            Sign Up
          </a>
        </m.li>
      </GoToSignUpPage>
      <GoToSignUpPage>
        <m.li variants={menuVariant}>
          <a
            href="#"
            title="Schedule a Demo"
            className={bemClass([blk, 'label'])}
            onClick={toggleScheduleDemoModal}
            data-auto-id="schedule-a-demo"
          >
            Schedule a Demo
          </a>
        </m.li>
      </GoToSignUpPage>
    </m.ul>
  </LazyMotion>
)

export default MobileNavigationMenu
