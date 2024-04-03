import { metaData } from '@/config/api-integration'

import { bemClass } from '@/utils'
import AnimatedCoverPage from '@/components/animated-cover-page'

import IntergrationInformation from '../_components/integration-information'

import './style.scss'

const blk = 'integration-detail'

type IntegrationDetailsProps = {
  params: Record<string, string>
}

const IntegrationDetails = ({ params: { integrationName } }: IntegrationDetailsProps) => (
  <>
    <AnimatedCoverPage
      animationPath="/animation-data/integration.json"
      name={integrationName}
      className={bemClass([blk, 'cover-section'])}
    />
    <IntergrationInformation integrationName={integrationName} />
  </>
)

const generateMetadata = async ({
  params: { integrationName },
}: IntegrationDetailsProps) => {
  const { title: metaTitle, description } = metaData[integrationName]
  const title = `LogiNext Integrations | ${metaTitle}`

  const url = `https://www.loginextsolutions.com/integrationdetail/${integrationName}`

  return {
    title,
    description,
    openGraph: {
      locale: 'en_US',
      type: 'website',
      title,
      description,
      url,
      siteName: 'loginextsolutions',
    },
    twitter: {
      title,
      description,
      card: 'summary',
    },
    metadataBase: new URL('https://www.loginextsolutions.com'),
  }
}

export {
  IntegrationDetails as default,
  generateMetadata
}
