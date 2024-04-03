import { bemClass } from '@/utils'

import Container from '@/components/container'
import Text from '@/components/text'
import HubSpotForm from '@/components/hub-spot-form'

import ContactUsCard from '../contact-us-card'

import contactUsCardInformation from '../../_data/information'

import './style.scss'

const blk = 'contact-page-data'

type contactPageDataProps = {
  dataAutoId?: string
}

const ContactPageData = ({ dataAutoId }: contactPageDataProps) => (
  <Container fluid className={blk}>
    <div className={bemClass([blk, 'cards'])}>
      {contactUsCardInformation.map(({ image, label, contact, id }) => (
        <ContactUsCard
          key={id}
          image={image}
          contact={contact}
          label={label}
          dataAutoId={`${dataAutoId}_card_${id}`}
        />
      ))}
    </div>
    <div className={bemClass([blk, 'form'])}>
      <div className={bemClass([blk, 'form-header'])}>
        <Text tag="h3" typography="xxl" fontWeight="thin" dataAutoId={`${dataAutoId}_form_title`} >
          Contact Us
        </Text>
        <Text tag="p" typography="l" className={bemClass([blk, 'form-title'])} dataAutoId={`${dataAutoId}_form_desc`} >
          Please provide the following information.
        </Text>
      </div>
      <HubSpotForm
        formId="3fab426f-b333-4073-a009-84feef71cab9"
      />
    </div>
  </Container>
)

export default ContactPageData
