import Link from 'next/link'
import Image from 'next/image'

import { bemClass } from '@/utils'

import companyCulture from '/public/join-us/company-culture.svg'
import interviewProcess from '/public/join-us/interview-process.svg'
import jobRoles from '/public/join-us/job-roles.svg'

import './style.scss'

type menuType = {
  label: string;
  href: string;
  id: string;
}

type joinUsNavigationProps = {
  menu: menuType[]
}

const imageMap: any = {
  join_us_company_culture: companyCulture,
  join_us_interview_process: interviewProcess,
  join_us_job_role: jobRoles
}

const blk = 'join-us-navigation'

const JoinUsNavigation = ({ menu }: joinUsNavigationProps) => (
  <div className={blk}>
    {menu.map(({ id, label, href }) => (
      <Link
        key={id}
        href={href}
        data-auto-id={id}
        className={bemClass([blk, 'link'])}
      >
        <Image
          src={imageMap[id]}
          alt=""
          className={bemClass([blk, 'image'])}
        />
        <span
          className={bemClass([blk, 'label'])}
        >
          {label}
        </span>
      </Link>
    ))}
  </div>
)

export default JoinUsNavigation
