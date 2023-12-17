import React from 'react'
import { Text } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'badge'

type IBadgeProps = {
  children: string
  className?: string
  isCloseable?: boolean
  closeHandler?: (e: React.MouseEvent) => void
}
const Badges: React.FC<IBadgeProps> = ({
  children,
  className,
  isCloseable,
  closeHandler,
}) => (
  <div className={bemClass([blk, '', className])}>
    <Text
      tag="label"
      color="gray-darker"
      align="left"
      typography="xs"
    >
      {children}
    </Text>
    {
      isCloseable && (
        <button
          type="button"
          className={bemClass([blk, 'closeButton'])}
          onClick={closeHandler}
        >
          &times;
        </button>
      )
    }

  </div>
)

export default Badges
