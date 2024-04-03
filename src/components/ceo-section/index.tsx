import Image from 'next/image'

import Text from '@/components/text'
import SectionTitle from '@/components/section-title'
import Container from '@/components/container'

import Dhruvil from '/public/join-us/company-culture/dhruvil-sanghvi.webp'
import LinkedIn from '/public/join-us/company-culture/linked-in.webp'
import Twitter from '/public/join-us/company-culture/twitter.webp'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'ceo-section'

type ceoSectionProps = {
  dataAutoId?: string
}

const CeoSection = ({ dataAutoId }: ceoSectionProps) => (
  <Container fluid className={blk}>
    <div className={bemClass([blk, 'information'])}>
      <SectionTitle color="black" dataAutoId={`${dataAutoId}_title`}>Dhruvil Sanghvi</SectionTitle>
      <Text
        tag="h1"
        typography="l"
        color="black"
        fontWeight="bold"
        className={bemClass([blk,'title' ,{}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_designation`}
      >
        Chief Executive Officer, LogiNext
      </Text>
      <Text
        tag="h2"
        typography="m"
        color="black"
        className={bemClass([blk, 'description', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_desc`}
      >
        Recognized as one of the youngest and fastest growing startup CEOs in
        India, Dhruvil Sanghvi is an alumnus of Carnegie Mellon University.
        After acquiring a deep experience in logistics and Big Data space in the
        US market while working with Deloitte Consulting and Ernst & Young
        Technology Advisory, Dhruvil started LogiNext towards the beginning of
        2014, which is backed by IAN and Paytm. He was on the core team of
        advising the largest logistics company in the US as a part of their last
        mile route optimization program. Dhruvil strongly supports the idea of
        sustainable startup ecosystem and has incubated and mentored a gamut of
        startups in logistics, Big Data and analytics space.
      </Text>
      <ul className={bemClass([blk,'social-links',{},'slide-fade-in-delay-1'])}>
        <li>
          <a
            rel="nofollow noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/dhruvilsanghvi"
            className={bemClass([blk,'social-media-handlers'])}
          >
            <Image
              src={LinkedIn}
              alt="linked-in"
              width="30"
              height="30"
              data-auto-id={`${dataAutoId}_ceo_linkedin_image`}
            />
            <span data-auto-id={`${dataAutoId}_ceo_linkedin_name`}>/dhruvilsanghvi</span>
          </a>
        </li>
        <li>
          <a
            rel="nofollow noopener noreferrer"
            href="https://twitter.com/dhruvilsanghvi"
            target="_blank"
            className={bemClass([blk,'social-media-handlers'])}
          >
            <Image
              src={Twitter}
              alt="linked-in"
              width="30"
              height="30"
              data-auto-id={`${dataAutoId}_ceo_twitter_image`}
            />
            <span data-auto-id={`${dataAutoId}_ceo_twitter_name`}>@dhruvilsanghvi</span>
          </a>
        </li>
      </ul>
    </div>
    <div className={bemClass([blk, 'ceo-image'])}>
      <Image
        src={Dhruvil}
        alt="dhruvil-sanghiv"
        className={bemClass([blk,'ceo-image'])}
        data-auto-id={`${dataAutoId}_ceo_image`}
      />
    </div>
  </Container>
)

export default CeoSection
