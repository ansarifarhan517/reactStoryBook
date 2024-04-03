'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import caseStudyIcon from '/public/case-study-icon.svg'
import whitePaperIcon from '/public/white-paper-icon.svg'

import './style.scss'

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'resource-tab'

type resourceTabProps = {
  dataAutoId?: string
}

const ResourceTab = ({ dataAutoId }: resourceTabProps) => {
  const pathname = usePathname()
  return (
    <ul className={blk}>
      <li className={bemClass([blk, 'tab'])}>
        <Link
          href="/resource/casestudy#resources"
          scroll={false}
          className={bemClass([
            blk,
            'link',
            { active: pathname === '/resource/casestudy' }
          ])}
          aria-label="case study"
          data-auto-id={`${dataAutoId}_case_study_tab`}
        >
          <span className={bemClass([blk, 'icon', { active: pathname === '/resource/casestudy' }])}>
            <Image src={caseStudyIcon} alt="Case study" data-auto-id={`${dataAutoId}_case_study_image`} />
          </span>
          <Text tag="span" typography="s" color="black" fontWeight="bold" dataAutoId={`${dataAutoId}_case_study_title`}>Case studies</Text>
        </Link>
      </li>
      <li className={bemClass([blk, 'tab'])}>
        <Link
          href="/resource/whitepaper#resources"
          scroll={false}
          className={bemClass([
            blk,
            'link',
            { active: pathname === '/resource/whitepaper' }
          ])}
          aria-label="white paper"
          data-auto-id={`${dataAutoId}_white_paper_tab`}
        >
          <span className={bemClass([blk, 'icon', { active: pathname === '/resource/whitepaper' }])}>
            <Image src={whitePaperIcon} alt="White paper" data-auto-id={`${dataAutoId}_white_paper_image`} />
          </span>
          <Text tag="span" typography="s" color="black" fontWeight="bold" dataAutoId={`${dataAutoId}_white_paper_title`}>White papers</Text>
        </Link>
      </li>
      <li className={bemClass([blk, 'tab'])}>
        <Link
          href="/resource/infographic#resources"
          scroll={false}
          className={bemClass([
            blk,
            'link',
            { active: pathname === '/resource/infographic' }
          ])}
          aria-label="infographic"
          data-auto-id={`${dataAutoId}_info_graphic_tab`}
        >
          <Icon
            name="analytics-dashboard"
            color="black"
            size="xlg"
            className={bemClass([blk, 'icon', { active: pathname === '/resource/infographic' }])}
            dataAutoId={`${dataAutoId}_info_graphic_image`}
          />
          <Text tag="span" typography="s" color="black" fontWeight="bold" dataAutoId={`${dataAutoId}_info_graphic_title`}>Infographic</Text>
        </Link>
      </li>
    </ul>
  )
}

export default ResourceTab
