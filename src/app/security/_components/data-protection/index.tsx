import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'data-protection'

const DataProtection = () => (
  <div className={blk}>
    <Container className={bemClass([blk, 'container'])}>
      <ProductInformativeContent
        title="Complete and total customer data protection"
        description={`In this highly connected world, complete data protection is a necessity. Secure all customer data with utmost 
                    confidence of complete privacy for all stakeholders.`}
        features={[
          {
            id: 'encrypted-and-safe-data-transactions',
            title: 'Encrypted and safe data transactions',
            description: `All sensitive information like addresses and details are deeply encrypted as they move in the system. It’s completely hidden from us and any third-party vendor. 
                        Only the client and the customer can view this data.`,
          },
          {
            id: 'anonymized-and-compartmentalized-information',
            title: 'Anonymized and compartmentalized information',
            description: `Any data used in delivery route planning is totally anonymized, wherein the details don’t refer to any specific customer. The data is also compartmentalized so that one 
                        client or branch can never see the data of another.`,
          },
        ]}
        className={bemClass([blk, 'information'])}
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary">
          Learn More
        </ModalTriggerButton>
      </ProductInformativeContent>
      <AnimatedCoverPage
        className={bemClass([blk, 'protection-animation'])}
        animationPath="/animation-data/security-thumb.json"
      />
    </Container>
  </div>
)

export default DataProtection
