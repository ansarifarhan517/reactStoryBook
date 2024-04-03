import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'integration-cover-section'

const IntegrationCoverSection = () => (
  <div className={bemClass([blk])} >
    <AnimatedCoverPage
      animationPath="/animation-data/integration.json"
      delay={6000}
      hideOnMobile
      className={bemClass([blk, 'animation-container'])}
    />
    <div className={bemClass([blk, 'background'])} />
    <Container className={bemClass([blk, 'content'])}>
      <PageCoverSectionContent
        title="We work with the systems you already use"
        description="Save your time and money with our integration."
        className={bemClass([blk, 'content-wrapper'])}
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" size="large">
            Talk to us
        </ModalTriggerButton>
      </PageCoverSectionContent>
    </Container>
  </div>
)

export default IntegrationCoverSection
