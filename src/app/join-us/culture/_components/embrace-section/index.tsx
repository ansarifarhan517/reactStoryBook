import SectionTitle from '@/components/section-title'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import './style.scss'

import { data } from './_data'

const blk = 'embrace-section'

type embraceSectionProps = {
  dataAutoId?: string
}

const EmbraceSection = ({ dataAutoId }: embraceSectionProps) => (
  <>
    <SectionTitle
      category="secondary"
      fontWeight="thin"
      className={bemClass([blk, 'section-title'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      Embrace yourself!
    </SectionTitle>
    <ConfigurationSection hoverEffect data={data} dataAutoId={`${dataAutoId}_configuration`} />
  </>
)

export default EmbraceSection
