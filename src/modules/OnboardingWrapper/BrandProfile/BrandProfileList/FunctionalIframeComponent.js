import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export const FunctionalIFrameComponent = ({
  children,
  title,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode =
    contentRef?.contentWindow?.document?.body

  return (
    <iframe {...props} ref={setContentRef} width="100%" height="100%">
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}