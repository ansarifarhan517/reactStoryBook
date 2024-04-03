import Container from '@/components/container'
import SectionTitle from '@/components/section-title'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import { RecruitmentProcessData } from '../../_data/information'

import './style.scss'

const blk = 'recruitment-process'

type recruitmentProcessProps = {
  dataAutoId?: string
}

const RecruitmentProcess = ({ dataAutoId }: recruitmentProcessProps) => (
  <Container className={bemClass([blk])}>
    <SectionTitle
      category="secondary"
      borderPosition="center"
      fontWeight="thin"
      dataAutoId={`${dataAutoId}_title`}
    >
      Our recruitment process
    </SectionTitle>
    <div className={bemClass([blk, 'card-group'])}>
      <ConfigurationSection
        iconSize="xxxlg"
        iconDivider
        hoverEffect
        data={RecruitmentProcessData}
        dataAutoId={`${dataAutoId}_configuration`}
      />
    </div>
  </Container>
)

export default RecruitmentProcess
