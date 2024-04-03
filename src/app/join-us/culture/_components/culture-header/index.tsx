import Image from 'next/image'

import Container from '@/components/container'
import Text from '@/components/text'
import Button from '@/components/button'

import { bemClass } from '@/utils'
import careerCompanyCulture from '/public/join-us/company-culture/career-company-culture.webp'

import './style.scss'

const blk = 'culture-header'

type cultureHeaderProps = {
  dataAutoId?: string
}

const CultureHeader = ({ dataAutoId }: cultureHeaderProps) => (
  <Container fluid className={blk}>
    <div className={bemClass([blk, 'content'])}>
      <Text
        tag="h1"
        typography="xxxl"
        color="white"
        fontWeight="bold"
        className="slide-fade-in-delay-1"
        dataAutoId={`${dataAutoId}_title`}
      >
        Think Big
      </Text>
      <Text
        tag="p"
        typography="m"
        color="white"
        className={bemClass([blk, 'text', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_desc_1`}
      >
        At LogiNext, we work towards a common goal to disrupt one of the most
        unorganized industries.
      </Text>
      <Text
        tag="p"
        typography="m"
        color="white"
        className={bemClass([blk, 'text', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_desc_2`}
      >
        Be a part of this awesome journey.
      </Text>
      <Text
        tag="p"
        typography="m"
        color="white"
        className={bemClass([blk, 'text', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_desc_3`}
      >
        There is so much left to build.
      </Text>
      <Button
        category="primary"
        size="large"
        asLink
        target="_blank"
        href="https://loginext.hire.trakstar.com/"
        className={bemClass([blk, 'button', {}, 'slide-fade-in-delay-1'])}
        dataAutoId={`${dataAutoId}_find_jobs`}
      >
        Find Jobs
      </Button>
    </div>
    <div className={bemClass([blk, 'image-cover'])}>
      <Image
        src={careerCompanyCulture}
        alt="career-company-culture"
        className={bemClass([blk, 'image'])}
        loading="eager"
        data-auto-id={`${dataAutoId}_image`}
      />
    </div>
  </Container>
)

export default CultureHeader
