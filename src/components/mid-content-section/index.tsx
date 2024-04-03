import { ReactElement } from 'react'
import { bemClass } from '@/utils'

import SectionTitle from '../section-title'
import Text from '../text'

import './style.scss'

type midContentSectionProps = {
  title: string;
  description: string;
  children?: ReactElement | string | number | null | undefined;
  className?: string;
  dataAutoId?: string
}

const blk = 'mid-content-section'

const MidContentSection = ({
  title,
  description,
  children,
  className,
  dataAutoId
}: midContentSectionProps) => (
  <div className={bemClass([blk, {}, className])} data-auto-id={dataAutoId}>
    <SectionTitle category="secondary" color="gray-dark" fontWeight="thin" dataAutoId={`${dataAutoId}_title`}>
      {title}
    </SectionTitle>
    <Text tag="p" typography="l" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_description`}>
      {description}
    </Text>
    {children}
  </div>
)

export default MidContentSection
