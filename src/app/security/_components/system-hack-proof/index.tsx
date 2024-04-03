import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'security-hack-proof'

const SecurityHackProof = () => (
  <div className={blk}>
    <Container className={bemClass([blk, 'container'])}>
      <AnimatedCoverPage
        className={bemClass([blk, 'world-animation'])}
        animationPath="/animation-data/logistics-world.json"
      />
      <ProductInformativeContent
        title="Make your entire logistics system hack-proof"
        description={`Be perfectly safe in any direct or indirect hacking activity from within or outside your system. Our platforms are designed to 
                    protect itself from any such attack.`}
        features={[
          {
            id: 'nobody-but-you-can-access-your-data',
            title: 'Nobody but you can access your data',
            description: `Multi-level authentication checks direct you to control what each person accessing your system can view. 
                        Multi-level authentication gives access to you and you alone. Any attempts by anyone else to log-in is dealt with immediate protective protocols.`,
          },
          {
            id: 'nobody-outside-can-ever-breach-the-system',
            title: 'Nobody outside can ever breach the system',
            description: `Our system is built to outsmart the highest-grade and most-complex hack attacks, no matter if it’s a Denial of Service, a Man-in-the-middle, IP spoofing, Port scanning, etc. 
                        The system continuously monitors itself and preemptively eliminates any possible threa`,
          },
        ]}
        className={bemClass([blk, 'information'])}
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary">
          Learn More
        </ModalTriggerButton>
      </ProductInformativeContent>
    </Container>
  </div>
)

export default SecurityHackProof
