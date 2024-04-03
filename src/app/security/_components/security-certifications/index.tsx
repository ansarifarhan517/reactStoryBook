import Image from 'next/image'

import Text from '@/components/text'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import securityCertifications from '/public/security/security-web-services-certifications.svg'
import securityISOCertification from '/public/security/security-iso.svg'

import './style.scss'

const blk = 'security-cerifications'

const SecurityCertifications = () => (
  <div className={blk}>
    <MidContentSection
      title="Backed by highest AWS and ISO security standards"
      description={`Globally certified by AWS and ISO for information security and
      processing following high internal tech and privacy benchmarks.`}
    />
    <Container className={bemClass([blk, 'card-holder'])}>
      <div className={bemClass([blk, 'card'])}>
        <Image
          src={securityCertifications}
          alt="Multiple Amazon web services certifications"
          height={60}
          width={60}
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])}>
           Multiple Amazon web services certifications
          </Text>
          <Text tag="p" typography="s">
            Top cloud companies like AWS work alongside us with robust security guidelines.
          </Text>
        </div>
      </div>
      <div className={bemClass([blk, 'card'])}>
        <Image
          src={securityISOCertification}
          alt="International organization for standardization"
          height={60}
          width={60}
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])}>
            International organization for standardization
          </Text>
          <Text tag="p" typography="s">
            ISO 27001:2018 certified for maintaining and upholding the best privacy standards.
          </Text>
        </div>
      </div>
    </Container>
    <ModalTriggerButton
      modalType="talk-to-us"
      category="primary"
      outline
    >
      Learn More
    </ModalTriggerButton>
  </div>
)

export default SecurityCertifications
