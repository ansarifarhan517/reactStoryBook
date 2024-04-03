import dynamic from 'next/dynamic'

import { bemClass } from '@/utils'

import Text from '../text'
import InViewSlide from '../in-view-slide'

import './style.scss'

type dataType = {
  id: string;
  icon: string;
  label: string;
}

type featureLabelListProps = {
  data: dataType[];
  className?: string;
  dataAutoId?: string
  category?: 'primary' | 'secondary'
}

const Icon = dynamic(() => import('../icon'), {
  ssr: false
})

const blk = 'feature-label-list'

const FeatureLabelList = ({ data, className, dataAutoId,category }: featureLabelListProps) => (
  <InViewSlide className={bemClass([blk, {}, className])}>
    {data.map(({
      id, icon, label
    },index) => (
      <div key={id} className={bemClass([blk, 'item'])}>
        <Icon name={icon} color="gray-dark" className={bemClass([blk, 'icon'])} dataAutoId={`${dataAutoId}_item_${index}_icon`} />
        <Text tag="p" typography="s" color={category == 'primary' ? 'gray-dark' : 'white'} dataAutoId={`${dataAutoId}_item_${index}_text`}>{label}</Text>
      </div>
    ))}
  </InViewSlide>
)

export default FeatureLabelList
