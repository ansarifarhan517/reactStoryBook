import React, { memo } from 'react'
import { Button, Icon } from '@base'
import { bemClass } from '@utils'
import { IAlertProps, IIconCodes } from './alert.model'
import './style.scss'

const blk = 'alert'

const iconCodes: IIconCodes = {
  error: 'exclamation-circle',
  warning: 'exclamation-triangle',
  info: 'info-circle',
  success: 'check-circle',
}

const Alert: React.FC<IAlertProps> = ({
  title,
  message,
  category,
  className,
  isCloseable,
  onCloseHandler,
}) => (
  <div className={bemClass([blk, { [category]: category }, className])}>
    <Icon
      name={iconCodes[category]}
      size="small"
      className={bemClass([blk, 'icon', { [category]: category }])}
    />
    <div className={bemClass([blk, 'message-container', { [category]: category }])}>
      {title && <strong>{title}</strong>}
      <div>{message}</div>
    </div>
    {isCloseable && (
      <Button
        className={bemClass([blk, 'closeButton', { [category]: category }])}
        withIcon
        clickHandler={onCloseHandler}
      >
      </Button>
    )}
  </div>
)

export default memo(Alert)
