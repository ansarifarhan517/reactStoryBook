import { ReactNode } from 'react'

import { bemClass } from '@/utils'

import Container from '@/components/container'

import PricingHeader from '../pricing-header'
import TrustedBrands from '../trusted-brands'

import './style.scss'

type pricingSignUpLayoutProps = {
  title: string
  subTitle?: string
  children: ReactNode
  className?: string
  dataAutoId?: string
}

const blk = 'pricing-sign-up-layout'

const PricingSignUpLayout = ({
  title,
  subTitle = '',
  children,
  className,
  dataAutoId
}: pricingSignUpLayoutProps) => (
  <div className={blk}>
    <PricingHeader
      title={title}
      subTitle={subTitle}
      dataAutoId={dataAutoId}
    />
    <Container fluid>
      <div className={bemClass([blk, 'content', {}, className])}>
        {children}
      </div>
    </Container>
    <TrustedBrands dataAutoId={dataAutoId} />
  </div>
)

export default PricingSignUpLayout
