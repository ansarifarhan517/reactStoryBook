import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/security/security-bg.svg'

import './style.scss'

const blk = 'security-header'

const SecurityHeader = () => (
  <PageCoverSection
    image={pageCoverBg}
    imageAlt="Absolute security and privacy across platforms"
    className={blk}
  >
    <>
      <Container fluid>
        <PageCoverSectionContent
          title="Absolute security and privacy across platforms"
          description="High-tech innovations come with even greater responsibilities for security. We stand by the highest security and privacy standards around the world.TRY OUT FREE"
        >
          <ModalTriggerButton
            modalType="talk-to-us"
            category="primary"
            size="large"
          >
            Request a demo
          </ModalTriggerButton>
        </PageCoverSectionContent>
      </Container>
      <AnimatedCoverPage
        animationPath="/animation-data/cover-loop.json"
        delay={6000}
        className={bemClass([blk, 'cover-animated-svg'])}
      />
    </>
  </PageCoverSection>
)

export default SecurityHeader
