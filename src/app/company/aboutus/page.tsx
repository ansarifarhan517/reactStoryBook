import { Metadata } from 'next'
import Image from 'next/image'

import Awards from '@/components/awards'
import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import Parallax from '@/components/parallax'
import Container from '@/components/container'
import Text from '@/components/text'
import CeoSection from '@/components/ceo-section'

import { bemClass } from '@/utils'

import aboutUsBg from '/public/company-about-us-bg.webp'
import investorLogos from '/public/investor-logos.webp'
import aboutUsBuildings from '/public/about-us-buildings.webp'
import aboutUsCustomerLogos from '/public/about-us-customer-logos.webp'

import './style.scss'

const blk = 'about-us'

const AboutUs = () => (
  <>
    <PageCoverSection
      image={aboutUsBg}
      imageAlt="About company"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="about_company_section_1"
      imageClassName={bemClass([blk, 'cover-section-image'])}
    />
    <PageCoverSubSection
      title="Vision and Values of LogiNext Solutions"
      description={`LogiNext is a global technology firm that offers a SaaS based Delivery
      Automation Platform. The software helps brands across Food & Beverage, Courier,
      Express and Parcel, eCommerce & Retail and Transportation (3PLs, 4PLs, etc.)
      to digitize, optimize and automate deliveries across the supply chain.`}
      isCenter
      dataAutoId="about_company_section_2"
    />
    <Container className={bemClass([blk, 'about-section'])}>
      <Parallax>
        <Image
          src={investorLogos}
          alt="Investor logos"
          data-auto-id="about_company_section_3_image"
        />
      </Parallax>
      <Text tag="p" typography="m" dataAutoId="about_company_section_3_desc">
        <>
          Growing at an average rate of 120% YoY, <strong>LogiNext has 200+ enterprise clients in 50+
          countries</strong> with headquarters in New Jersey, USA and regional offices in Mumbai,
          Jakarta, Delhi and Dubai. We&apos;re backed with $49.5 million across three rounds of
          private equity investments by Tiger Global Management, Steadview Capital and Alibaba
          Group of companies.
        </>
      </Text>
    </Container>
    <Container className={bemClass([blk, 'about-section', ['left']])}>
      <Parallax>
        <Image
          src={aboutUsBuildings}
          alt="Investor logos"
          data-auto-id="about_company_section_4_image"
        />
      </Parallax>
      <Text tag="p" typography="m" dataAutoId="about_company_section_4_desc">
        <>
        The majority of our workforce is in Mumbai and we&apos;re a bunch of people interested in
        technology and working at the forefront of innovation in the logistics automation
        industry. With smaller teams distributed across the globe, the entire team gets
        together during our annual workation. <strong>The vision of building a global enterprise
        company and going IPO is what drives us to achieve more, every day!</strong>
        </>
      </Text>
    </Container>
    <Container className={bemClass([blk, 'about-section'])}>
      <Parallax>
        <Image
          src={aboutUsCustomerLogos}
          alt="Investor logos"
          data-auto-id="about_company_section_5_image"
        />
      </Parallax>
      <Text tag="p" typography="m" dataAutoId="about_company_section_5_desc">
        <>
          We&apos;re incredibly excited about the SaaS ecosystem as well and proud to be one of
          the frontrunners when it comes to building a SaaS platform for the logistics industry.
          With some of the biggest brands like KFC, Starbucks, McDonald&apos;s, SingaporePost and
          Decathlon as our clients, the <strong>LogiNext platform has matured tremendously and powers
          millions of shipments across the globe every day.</strong>
        </>
      </Text>
    </Container>
    <CeoSection dataAutoId="about_company_section_6" />
    <Awards dataAutoId="about_company_section_7" />
  </>
)

const title = 'About Us | LogiNext | Logistics Transportation Automation'
const description = 'LogiNext is a global tech firm offering a SaaS-based delivery automation platform. We automate & optimize for CEP, F&B, Retail, eCommerce, Transportation, & CPG.'
const url = 'https://www.loginextsolutions.com/company/aboutus'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  AboutUs as default,
  metadata
}
