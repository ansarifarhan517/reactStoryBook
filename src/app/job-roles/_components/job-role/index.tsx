import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type jobRoleProps = {
  id: string
  title: string
  description: string
  location: string
  url: string
}

const blk = 'job-role'

const JobRole = ({
  id,
  title,
  description,
  location,
  url
}: jobRoleProps) => (
  <a target="_blank" href={url} className={blk} data-auto-id={id}>
    <div className={bemClass([blk, 'content'])}>
      <Text tag="div" typography="xl" fontWeight="semi-bold">
        {title}
      </Text>
      <Text tag="p" typography="s">
        {description}
      </Text>
    </div>
    <Text tag="div" className={bemClass([blk, 'location'])}>
      {location}
    </Text>
  </a>
)

export default JobRole
