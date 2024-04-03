import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import Button from '@/components/button'

import joinUsInterview from '/public/join-us-interview-bg.svg'
import InterviewProcessImage from '/public/join-us/interview-process/side-image.webp'

import RecruitmentProcess from './_components/recruitment-process'
import RecruitmentFlow from './_components/recruitment-flow'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'interview-process'

const InteviewProcess = () => (
  <>
    <PageCoverSection image={joinUsInterview} imageAlt="join us interview" dataAutoId="interview_process">
      <section className={bemClass([blk, 'heading'])}>
        <PageCoverSectionContent
          title="Nurturing Growth Evangelists"
          description="At LogiNext, every distinct team has a single focus – how to build better,
          and achieve the ultimate in customer delight."
          className={bemClass([blk, 'header-data'])}
          dataAutoId="interview_process_section_1"
        >
          <Button
            category="primary"
            size="large"
            asLink
            href="https://loginext.hire.trakstar.com/"
            dataAutoId="interview_process_section_1_find_jobs"
            target = "_blank"
          >
            Find jobs
          </Button>
        </PageCoverSectionContent>
        <Image
          src={InterviewProcessImage}
          loading="eager" alt={'side-image'}
          className={bemClass([blk, 'side-image'])}
          data-auto-id="interview_process_section_1_image"
        />
      </section>
    </PageCoverSection>
    <RecruitmentProcess dataAutoId="interview_process_section_2" />
    <RecruitmentFlow dataAutoId="interview_process_section_3" />
  </>
)

const title = 'LogiNext | Interview Process | Talent Recruitment'
const description =
  'Get a glimpse of how LogiNext recruits talents and be prepared to face challenging yet interesting questions that can make for a stellar logistics universe!'
const url = 'https://www.loginextsolutions.com/join-us/interview-process'

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
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export { InteviewProcess as default, metadata }
