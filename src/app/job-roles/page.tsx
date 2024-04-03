import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import Button from '@/components/button'
import Container from '@/components/container'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/final-mile-delivery-optimization-software.svg'

import jobRoles from './_data'

import JobRoleDepartment from './_components/job-role-department'

import './style.scss'

const blk = 'job-roles'

const JobRoles = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Build something you love"
      className={bemClass([blk, 'cover-section'])}
    >
      <PageCoverSectionContent
        fluid
        title="Build something you love"
        description={`At LogiNext, we endeavor to change the world through continuous innovation
        and optimization in the space of logistics and supply chain management. Join us as we
        create the next version of an impactful product which aims to revolutionize business
        processes and user behavior through unprecedented forms of disruption`}
        className={bemClass([blk, 'cover-content'])}
      >
        <Button
          category="primary"
          asLink
          href="https://loginext.hire.trakstar.com"
          size="large"
        >
          find jobs
        </Button>
      </PageCoverSectionContent>
    </PageCoverSection>
    <Container>
      <>
        {jobRoles.map(({ id, department, noOfPositions, roles }) => (
          <JobRoleDepartment
            key={id}
            id={id}
            department={department}
            noOfPositions={noOfPositions}
            roles={roles}
          />
        ))}
        <Button
          asLink
          target="_blank"
          href="http://jobs.loginextsolutions.com/"
          dataAutoId="apply"
          className={bemClass([blk, 'apply-btn'])}
        >
          Apply
        </Button>
      </>
    </Container>
  </>
)

const title = 'LogiNext | Join Our Team | Job Opportunities'
const description = 'LogiNext strives to innovate, optimize and introduce new process in the field of logistics and supply chain management. Join us and build something you love!'
const url = 'https://www.loginextsolutions.com/job-roles'

const metadata: Metadata = {
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
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  JobRoles as default,
  metadata
}
