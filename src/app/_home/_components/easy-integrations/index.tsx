import Image from 'next/image'
import Link from 'next/link'

import Container from '@/components/container'
import Text from '@/components/text'
import Button from '@/components/button'
import SectionTitle from '@/components/section-title'

import easyIntegrationLogo from '/public/easy-integration-logo.webp'

import { easyIntegration } from '../../data/easy-integration'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'easy-integrations'

type easyIntegrationsProps = {
  dataAutoId?: string
}

const EasyIntegrations = ({ dataAutoId }: easyIntegrationsProps) => (
  <div className={blk}>
    <Container className={bemClass([blk, 'container'])}>
      <div className={bemClass([blk, 'content'])}>
        <SectionTitle category="dual" className={bemClass([blk, 'title'])} dataAutoId={`${dataAutoId}_title`}>
          Easy Integrations
        </SectionTitle>
        <Text tag="p" typography="l" color="gray-dark" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_desc`}>
          Seamless and almost-instant integration with all enterprise resource planning suites
          across the board such as warehousing, order planning, transport management, payments,
          mapping, and more.
        </Text>
        <Button
          category="primary"
          size="large"
          asLink
          href="/integration"
          dataAutoId={`${dataAutoId}_check-it-out`}
        >
          Check it out
        </Button>
      </div>
      <div className={bemClass([blk, 'circle-1'])} />
      <div className={bemClass([blk, 'circle-2'])} />
      <div className={bemClass([blk, 'data'])}>
        <div className={bemClass([blk, 'card', ['logo']])}>
          <Image
            loading="eager"
            src={easyIntegrationLogo}
            height={50}
            width={50}
            alt="LogiNext solutions"
            data-auto-id={`${dataAutoId}_loginext_logo`}
          />
        </div>
        {easyIntegration.map(({ title, cssClass, integration }) => (
          <Link
            key={title}
            href="/integration"
            className={bemClass([blk, 'card', ['module', cssClass]])}
            data-auto-id={`${dataAutoId}_link_${title}`}
          >
            {title}
            <div className={bemClass([blk, 'integration'])}>
              {integration.map(({ id, name, href, img }) => (
                <Link
                  key={id}
                  href={href}
                  className={bemClass([blk, 'integration-box', [id]])}
                  data-auto-id={`${dataAutoId}_link_${id}`}
                >
                  <Image
                    loading="eager"
                    src={img}
                    alt={name}
                    fill
                    className={bemClass([blk, 'integration-image'])}
                    data-auto-id={`${dataAutoId}_link_${name}`}
                  />
                </Link>
              ))}
            </div>
          </Link>
        )
        )}
      </div>
    </Container>
  </div>
)

export default EasyIntegrations
