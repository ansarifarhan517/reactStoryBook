import localFont from 'next/font/local'
import { bemClass } from '@/utils'

import './style.scss'

const loginextIcons = localFont({
  src: [
    {
      path: './icon-fonts/loginext-icons.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './icon-fonts/loginext-icons.woff',
      weight: '400',
      style: 'normal',
    },
  ],
})

type iconProps = {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg' | 'xxxlg' | 'xxxxlg';
  color?: 'black' | 'gray-darker' | 'gray-dark' | 'gray' | 'white' | 'primary' | 'secondary' | 'warning';
  className?: string;
  weight?: 'thin' | 'normal' | 'semi-bold' | 'semi-bolder'| 'bold';
  dataAutoId?: string
}

const blk = 'icon'

const Icon = ({
  name,
  color = 'gray-dark',
  size = 'md',
  className = '',
  weight = 'normal',
  dataAutoId
}: iconProps) => {
  const eltClass = bemClass([blk, {
    [name]: !!name,
    [color]: !!color,
    [size]: !!size,
    [weight] : !!weight
  }, className])

  const iconClass = `${loginextIcons.className} ${eltClass}`

  return (
    <span className={iconClass} data-auto-id ={dataAutoId} />
  )
}

export default Icon
