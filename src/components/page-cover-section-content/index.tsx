import { ReactElement } from 'react'

import { bemClass } from '@/utils'

import Text from '../text'
import GartnerInsight from '../gartner-insight'

import './style.scss'

type pageCoverSectionContentProps = {
  title: string;
  description: string;
  fluid?: boolean;
  withTrademark?: boolean;
  withGartner?: boolean;
  children?: ReactElement | ReactElement[];
  className?: string;
  withResoucesCaseStudy?: boolean
  dataAutoId?: string
  isGartnerHorizontal?: boolean
}

const blk = 'page-cover-section-content'

const PageCoverSectionContent = ({
  title,
  description,
  fluid = false,
  withTrademark = false,
  withGartner = false,
  children,
  className,
  dataAutoId,
  isGartnerHorizontal = false
}: pageCoverSectionContentProps) => (
  <div className={bemClass([blk, { fluid: !!fluid }, className])} data-auto-id={dataAutoId}>
    <Text
      tag="h1"
      typography="xxxl"
      color="white"
      fontWeight="bold"
      className="slide-fade-in-delay-1"
      dataAutoId={`${dataAutoId}_title`}
    >
      <>
        {title}
        {withTrademark && (
          <Text
            tag="sup"
            typography="xl"
            color="white"
            fontWeight="bold"
            dataAutoId={`${dataAutoId}_trademark`}
          >
            TM
          </Text>
        )}
      </>
    </Text>
    <Text
      tag="p"
      typography="m"
      color="white"
      className={bemClass([
        blk,
        'description',
        {},
        'slide-fade-in-delay-1'
      ])}
      dataAutoId={`${dataAutoId}_description`}
    >
      {description}
    </Text>
    <div className="slide-fade-in-delay-1" data-auto-id={`${dataAutoId}_children`}>
      {children}
    </div>
    {withGartner && (
      <GartnerInsight dataAutoId={`${dataAutoId}_gartner`} isGartnerHorizontal={isGartnerHorizontal} />
    )}
  </div>
)

export default PageCoverSectionContent
