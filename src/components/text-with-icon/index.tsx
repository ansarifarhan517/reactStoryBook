import dynamic from 'next/dynamic'

import { bemClass } from '@/utils'

import Text from '../text'

import './style.scss'

type textWithIconProps = {
  iconName: string
  title: string
  description?: string
  dataAutoId?: string
  iconWeight?: 'thin' | 'normal' | 'semi-bold' | 'semi-bolder'| 'bold';
}

const Icon = dynamic(() => import('../icon'), {
  ssr: false
})

const blk = 'text-with-icon'

const TextWithIcon = ({
  iconName,
  title,
  description,
  dataAutoId,
  iconWeight = 'normal'
}: textWithIconProps) => (
  <div className={blk}>
    <Icon
      color="primary"
      name={iconName}
      size="xxxlg"
      className={bemClass([blk, 'icon'])}
      data-auto-id={`${dataAutoId}_feature_icon_${iconName}`}
      weight={iconWeight}
    />
    <Text
      tag="div"
      className={bemClass([blk, 'title'])}
      typography="m"
      color="white"
      dataAutoId={`${dataAutoId}_feature_title_${iconName}`}
    >
      {title}
    </Text>
    <Text
      tag="p"
      typography="s"
      color="gray-light"
      fontWeight="normal"
      className={bemClass([blk, 'description'])}
      dataAutoId={`${dataAutoId}_feature_desc_${iconName}`}
    >
      {description}
    </Text>
  </div>
)

export default TextWithIcon
