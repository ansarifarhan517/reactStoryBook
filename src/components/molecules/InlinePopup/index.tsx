import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { IInlinePopupProps } from './interfaces'
import { InlinePopStyled, InlinePopupWrapper } from './styled'
// import Draggable from '../../organisms/AdvancedFilter/components/Draggable'

const InlinePopup = ({
  isOpen,
  title,
  onClose,
  width,
  height,
  style,
  children,
  content,
  id,
  className
}: IInlinePopupProps) => {
  const node = React.useRef(null)
  const triggerElementRef = React.createRef<HTMLDivElement>()
  const [open, setOpen] = useState(isOpen)
  const [right, setRight] = useState<number | 'auto' | 'unset'>(0)
  const [left, setLeft] = useState<number | 'auto' | 'unset'>(0)
  const [top, setTop] = useState<number | 'unset'>('unset')
  const [bottom, setBottom] = useState<number | 'unset'>('unset')

  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    setOpen(false)
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleOpen = () => {
    setOpen(!open)
    const popUpWidth =
      typeof width === 'string' ? parseInt(width.replace('px', '')) : width
    const popUpHeight =
      typeof height === 'string' ? parseInt(height.replace('px', '')) : height

    const clientRect = triggerElementRef.current?.getClientRects()
    setTop(clientRect?.[0]?.height || 0)

    if (clientRect && clientRect[0].right >= popUpWidth) {
      setRight(0)
      setLeft('auto')
    } else {
      setLeft('auto')
      setRight('unset')
    }

    if (
      clientRect &&
      popUpHeight &&
      window.screen.height - (clientRect[0].top + clientRect[0].height) >
        popUpHeight
    ) {
      setTop(clientRect?.[0]?.height || 0)
      setBottom('unset')
    } else {
      setTop('unset')
      setBottom(clientRect?.[0].height || 0)
      // setTop(
      //   (clientRect &&
      //     clientRect?.[0]?.height - (popUpHeight + clientRect?.[0]?.height)) ||
      //     0
      // )
    }
  }

  const handleClose = () => {
    setOpen(false)
    onClose && onClose()
  }

  return (
    <InlinePopupWrapper id={id} ref={node}>
      <div ref={triggerElementRef} onClick={handleOpen}>
        {children}
      </div>
      {open && (
        <InlinePopStyled
          style={{
            position: 'absolute',
            right,
            left,
            top,
            bottom,
            zIndex: 1,
            ...style
          }}
          width={
            typeof width === 'string'
              ? parseInt(width.replace('px', ''))
              : width
          }
          height={
            typeof height === 'string'
              ? parseInt(height.replace('px', ''))
              : height
          }
          className={`InlinePopUpContainer ${className}`}
          id={id}
        >
          <Header closeButton handleClose={handleClose}>
            {title}
          </Header>
          <div>{content} </div>
        </InlinePopStyled>
      )}
    </InlinePopupWrapper>
  )
}

export default InlinePopup
