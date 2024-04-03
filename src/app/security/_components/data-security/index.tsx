import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'data-security'

const DataSecurity = () => (
  <Container className={blk}>
    <AnimatedCoverPage
      className={bemClass([blk,'security-animation'])}
      animationPath="/animation-data/code-security.json"
    />
    <ProductInformativeContent
      title="Complete data security in the clouds"
      description={`Secure all your cloud-data with the highest grade of physical and network security. 
                    Each byte of data would be perfectly safe within the systems.`}
      features={[
        {
          id: 'total-data-center-and-server-safety',
          title: 'Total data center and server safety',
          description: `Data centers and servers are built and managed on the industry-leading standards. 
                        Geographically spread out - minimizing natural disaster risk, using multiple power grids, supervised and monitored 24x7 around the year.`,
        },
        {
          id: 'high-network-security-for-all-your-data',
          title: 'High-network security for all your data',
          description: `All your information is spread out across data centers where even if one is compromised, all info is securely transferred to another 
                        center or server on the other side of the world. All data is completely secured along the network with continuous test and checks.`,
        },
      ]}
      className={bemClass([blk,'information'])}
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary">
        Learn More
      </ModalTriggerButton>
    </ProductInformativeContent>
  </Container>
)

export default DataSecurity
