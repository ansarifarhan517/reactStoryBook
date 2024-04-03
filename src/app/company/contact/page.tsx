import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'

import contactUsBg from '/public/company-contact-bg.webp'

import ContactUsHeader from './_components/contact-us-header'
import ContactPageData from './_components/contact-page-data'
import ContactUsMap from './_components/contact-us-map'

import './style.scss'

const blk = 'contact-page'

const ContactUs = () => (
  <>
    <PageCoverSection image={contactUsBg} imageAlt="Contact Us" dataAutoId="contact_us_section_1" >
      <ContactUsHeader dataAutoId="contact_us_section_1_header" />
    </PageCoverSection>
    <ContactPageData dataAutoId="contact_us_section_2" />
    <ContactUsMap dataAutoId="contact_us_section_3"/>
  </>
)

const title = 'LogiNext | Contact Us | Speak to an Expert'
const description = 'Connect with a solutions expert and get your queries related to transportation automation software resolved and find the best match to meet your logistics needs.'
const url = 'https://www.loginextsolutions.com/company/contact'

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
  ContactUs as default,
  metadata
}
