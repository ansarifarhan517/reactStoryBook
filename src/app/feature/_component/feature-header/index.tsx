import Container from '@/components/container'
import Text from '@/components/text'
import ModalTriggerButton from '@/components/modal-trigger-button'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'feature-header'

const FeatureHeader = () => (
  <Container fluid className={blk}>
    <Text
      tag="h1"
      typography="xxxl"
      color="white"
      fontWeight="bold"
      className="slide-fade-in-delay-1"
    >
      Features
    </Text>
    <Text
      tag="h2"
      typography="m"
      color="white"
      className={bemClass([blk, 'description', {}, 'slide-fade-in-delay-1'])}
    >
      Everything you want to know about planning, optimizing, tracking,
      and analyzing all your logistics and field workforce movement.
    </Text>
    <ModalTriggerButton
      modalType="sign-up"
      category="primary"
      size="large"
    >
      Sign up
    </ModalTriggerButton>
  </Container>
)

export default FeatureHeader
