'use client'

import { ReactNode, useContext, useEffect } from 'react'
import Script from 'next/script'

import { useRouter } from 'next/navigation'

import AppContext from '@/context'

import './layout-style.scss'

type pricingLayoutProps = {
  children: ReactNode
}

const PricingLayout = ({ children }: pricingLayoutProps) => {
  const router = useRouter()
  const { country } = useContext(AppContext)

  useEffect(() => {
    if (country === 'IN') {
      router.push('/')
    }
  }, [country, router])

  if (!country) {
    return (
      <div className="pricing-loader" />
    )
  }

  return (
    <>
      {children}
      <Script id="ga-pricing" strategy="lazyOnload">
        {`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-48215371-1', 'auto');
        ga('send', 'pageview');
        ga('send', {
          hitType: 'event',
          eventCategory: 'Event',
          eventAction: 'Pricing_Page_Visit',
          eventLabel: 'Mile_Pricing_Pages_Load_Event'
        })
      `}
      </Script>
    </>
  )
}

export default PricingLayout
