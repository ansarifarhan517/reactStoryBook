import { ReactElement } from 'react'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import Text from '@/components/text'
import BouncingArrow from '@/components/bouncing-arrow'
import Container from '@/components/container'
import ResourceTab from '../resource-tab'
import RelatedResources from '../related-resources'

import { bemClass } from '@/utils'

import resourceBg from '/public/resources-bg.webp'

import ResourceSubscribeForm from '../resource-subscribe-form'

import './style.scss'

type resourceCoverSectionProps = {
  resource: 'case study' | 'white paper' | 'infographic';
  children: ReactElement | string | number | null | undefined;
  dataAutoId?: string
}

const blk = 'resource-cover-section'

const ResourceCoverSection = ({ resource, children, dataAutoId }: resourceCoverSectionProps) => (
  <>
    <PageCoverSection
      image={resourceBg}
      imageAlt={resource}
      className={blk}
      contentClassName={bemClass([blk, 'cover-container'])}
      dataAutoId={`${dataAutoId}_section_1`}
    >
      <>
        <PageCoverSectionContent
          title="Resources"
          description={`Case Studies and White Papers about how industry stalwarts optimized
          last mile deliveries, field workforce management, line haul express shipments, and
          on-demand deliveries.`}
          className={bemClass([blk, 'section-content'])}
          dataAutoId={`${dataAutoId}_section_1_header`}
        >
          <ResourceSubscribeForm dataAutoId="resources_section_1_form" />
          <BouncingArrow id="resources" dataAutoId={`${dataAutoId}_section_1_bouncing_arrow`} />
        </PageCoverSectionContent>
        <div className={bemClass([blk, 'cover-bg'])} />
      </>
    </PageCoverSection>
    <Container className={bemClass([blk, 'tag-line'])} id="resources">
      <Text
        tag="h2"
        typography="xxl"
        fontWeight="thin"
        dataAutoId={`${dataAutoId}_section_2_title`}
      >
          Thought Leadership Begins Here
      </Text>
      <Text
        tag="p"
        typography="l"
        color="gray-dark"
        fontWeight="thin"
        dataAutoId={`${dataAutoId}_section_2_desc`}
      >
          Learn From Our Most Successful Enterprise Case Studies And White Papers.
      </Text>
    </Container>
    <ResourceTab dataAutoId={`${dataAutoId}_section_3`} />
    {children}
    <RelatedResources dataAutoId={`${dataAutoId}_section_4`} />
  </>
)

export default ResourceCoverSection
