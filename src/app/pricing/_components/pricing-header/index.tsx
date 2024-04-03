import { bemClass } from '@/utils'

import Text from '@/components/text'
import Container from '@/components/container'

import './style.scss'

type pricingHeaderProps = {
  title: string
  subTitle: string
  dataAutoId?: string
}

const blk = 'pricing-header'

const PricingHeader = ({ title, subTitle, dataAutoId }: pricingHeaderProps) => (
  <Container className={blk}>
    <>
      <Text
        tag="h1"
        typography="xxl"
        color="white"
        fontWeight="bold"
        className={bemClass([blk, 'heading', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_title`}
      >
        {title}
      </Text>
      <Text
        tag="p"
        typography="m"
        color="white"
        className="slide-fade-in-delay-1"
        dataAutoId={`${dataAutoId}_sub_title`}
      >
        {subTitle}
      </Text>
    </>
  </Container>
)

export default PricingHeader
