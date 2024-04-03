import Link from 'next/link'

import { bemClass } from '@/utils'
import Text from '../text'

import './style.scss'

type cardGridLayoutLinkProps = {
  label?: string;
  href: string;
  className?: string;
}

const blk = 'card-grid-layout-link'

const CardGridLayoutLink = ({ label = 'View Details', href, className }: cardGridLayoutLinkProps) => (
  <Link href={href} className={bemClass([blk, {}, className])}>
    <Text
      tag="span"
      typography="xs"
      fontWeight="bold"
      color="primary"
      className={bemClass([blk, 'label'])}
    >
      {label}
    </Text>
    <Text
      tag="span"
      className={bemClass([blk, 'arrow'])}
    >
      &rarr;
    </Text>
  </Link>
)

export default CardGridLayoutLink

