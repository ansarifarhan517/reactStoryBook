import { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import PageCoverSection from '../page-cover-section'
import Container from '../container'
import PageCoverSectionContent from '../page-cover-section-content'
import ButtonGroup from '../button-group'
import ModalTriggerButton from '../modal-trigger-button'
import HubSpotForm from '../hub-spot-form'

import './style.scss'

type pageCoverSectionWithHubspotform = {
  title: string
  description: string
  imageTitle?: string
  imageAlt: string
  imageDescription?: string
  image: StaticImageData
  dataAutoId?: string
}

const blk = 'cover-section-with-hubspot-form'

const PageCoverSectionWithHubspotForm = ({
  title,
  description,
  imageTitle,
  imageAlt,
  image,
  imageDescription,
  dataAutoId
}: pageCoverSectionWithHubspotform) => (
  <PageCoverSection
    imageTitle={imageTitle}
    image={image}
    imageAlt={imageAlt}
    imageDescription={imageDescription}
    className={bemClass([blk, 'cover-section'])}
    dataAutoId={dataAutoId}
  >
    <Container fluid className={bemClass([blk, 'container'])}>
      <PageCoverSectionContent
        title={title}
        description={description}
        withGartner
        dataAutoId={`${dataAutoId}_content`}
        isGartnerHorizontal
      >
        <ButtonGroup>
          <ModalTriggerButton
            modalType="talk-to-us"
            category="primary"
            size="large"
            dataAutoId={`${dataAutoId}_talk_to_us`}
          >
            Lets talk
          </ModalTriggerButton>
          <ModalTriggerButton
            modalType="sign-up"
            category="secondary"
            size="large"
            dataAutoId={`${dataAutoId}_sign_up`}
          >
            Sign up
          </ModalTriggerButton>
        </ButtonGroup>
      </PageCoverSectionContent>
      <div className={bemClass([blk, 'cover-form'])}>
        <HubSpotForm
          containerId="coverSectionHubspot"
          formId="3fab426f-b333-4073-a009-84feef71cab9"
          dataAutoId ={`${dataAutoId}_hubspot_form`}
          isOnPageLoad
        />
      </div>
    </Container>
  </PageCoverSection>
)

export default PageCoverSectionWithHubspotForm
