
import Container from '@/components/container'
import Text from '@/components/text'
import SectionTitle from '@/components/section-title'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'philosophy-header'

type philosophyHeaderProps = {
  dataAutoId?: string
}

const PhilosophyHeader = ({ dataAutoId }: philosophyHeaderProps) => (
  <Container fluid className={blk}>
    <SectionTitle
      category="secondary"
      color="black"
      fontWeight="thin"
      className="slide-fade-in-delay-1"
      dataAutoId={`${dataAutoId}_title`}
    >
      Philosophy
    </SectionTitle>
    <Text
      tag="h2"
      typography="l"
      color="gray-dark"
      className={bemClass([blk, 'description', {}, 'slide-fade-in-delay-1'])}
      dataAutoId={`${dataAutoId}_desc_1`}
    >
      We focus on innovation, be it technological or executional. We strongly
      believe that a company cannot innovate unless every individual innovates.
      And that `s why we constantly push everyone outside their comfort zone and
      guarantee the best learning experience ever!
    </Text>
    <Text
      tag="h2"
      typography="l"
      color="gray-dark"
      className={bemClass([blk, 'description', {}, 'slide-fade-in-delay-1'])}
      dataAutoId={`${dataAutoId}_desc_2`}
    >
     	Come join us in our endeavor to make it a better, efficient and reliable world.
    </Text>
  </Container>
)

export default PhilosophyHeader
