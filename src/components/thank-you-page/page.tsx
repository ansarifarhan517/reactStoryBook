import Image from 'next/image'

import { bemClass } from '@/utils'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import Button from '@/components/button'

import Container from '@/components/container'

import pageCoverBg from '/public/thank-you-bg.webp'

import thankYouCoverImage from '/public/thank-you.webp'
import formSubmitCoverImage from '/public/thank-you-form-submit.webp'
import contactUsCoverImage from '/public/thank-you-contact-us.webp'

import './style.scss'

type thankYouPageProps = {
  type: 'thank-you' | 'form-submit' | 'contact'
}

const blk = 'thank-you-page'

const imageMap = {
  'thank-you': thankYouCoverImage,
  'form-submit': formSubmitCoverImage,
  contact: contactUsCoverImage
}

const ThankYouPage = ({ type }: thankYouPageProps) => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Track your field agent's live movement"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="THANK YOU"
          description="Our solutions experts will get back to you shortly. In the meantime, you can view"
          className={bemClass([blk, 'content'])}
        >
          <ButtonGroup>
            <Button
              asLink
              href="/blog"
              className={bemClass([blk, 'button'])}
            >
              Blog
            </Button>
            <Button
              asLink
              href="/resource/casestudy"
              className={bemClass([blk, 'button'])}
            >
              Case Study
            </Button>
            <Button
              asLink
              href="/company/newsmedia"
              className={bemClass([blk, 'button'])}
            >
              News and Media
            </Button>
          </ButtonGroup>
        </PageCoverSectionContent>
        <div className={bemClass([blk, 'image-holder'])}>
          <Image
            src={imageMap[type]}
            alt="Thank you for contacting us"
            fill
            className={bemClass([blk, 'image'])}
          />
        </div>
      </Container>
    </PageCoverSection>
  </>
)

export default ThankYouPage
