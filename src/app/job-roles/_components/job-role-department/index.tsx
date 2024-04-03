'use client'
import { useState } from 'react'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import JobRole from '../job-role'

import './style.scss'

type roleType = {
  id: string
  title: string
  description: string
  location: string
  link: string
}

type jobRoleDepartmentProps = {
  id: string
  department: string,
  noOfPositions: number,
  roles: roleType[]
}

const blk = 'job-role-department'

const JobRoleDepartment = ({
  id,
  department,
  noOfPositions,
  roles,
}: jobRoleDepartmentProps) => {
  const [show, setShow] = useState(false)

  const toggleHandler = () => {
    setShow(!show)
  }

  return (
    <div className={blk}>
      <button
        className={bemClass([blk, 'header'])}
        onClick={toggleHandler}
        data-auto-id={id}
      >
        <Text
          tag="div"
          fontWeight="bold"
          className={bemClass([blk, 'title'])}
        >
          {department}
        </Text>
        <Text
          tag="div"
          className={bemClass([blk, 'count', { active: show }])}
        >
          {`${noOfPositions} Open Roles`}
        </Text>
      </button>
      <div className={bemClass([blk, 'content', { active: show }])}>
        {roles.map(({ id, title, description, location, link }) => (
          <JobRole
            key={id}
            id={id}
            title={title}
            description={description}
            location={location}
            url={link}
          />
        ))}
      </div>
    </div>
  )
}

export default JobRoleDepartment
