import React, { Fragment } from 'react'
export interface IPopupWrapper {
  header: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
}

const PopupWrapper = ({ header, content, footer }: IPopupWrapper) => {
  return (
    <Fragment>
      {header || null}
      {content || null}
      {footer || null}
    </Fragment>
  )
}

export default PopupWrapper
