'use client'

import { ReactElement, useState } from 'react'

import { bemClass } from '@/utils'

import './style.scss'

type modalProps = {
  isClosable?: boolean;
  closeHandler?: () => void;
  children?: ReactElement;
  isCenter?: boolean;
  className?: string;
  dataAutoId?: string;
}

const blk = 'modal'

const Modal = ({
  children,
  isClosable,
  closeHandler = () => {},
  isCenter = false,
  className,
  dataAutoId
}: modalProps) => {
  const [hideModal, setHideModal] = useState<boolean>(false)

  const onCloseHandler = () => {
    setHideModal(true)
    setTimeout(() => {
      closeHandler()
      setHideModal(false)
    }, 300)
  }

  return (
    <div className={bemClass([blk, { center: isCenter }])} data-auto-id={dataAutoId}>
      <div className={bemClass([blk, 'content', { hide: hideModal }, className])}>
        {isClosable && (
          <div className={bemClass([blk, 'header'])}>
            <button
              data-auto-id={`${dataAutoId}_close`}
              className={bemClass([blk, 'close'])}
              onClick={onCloseHandler}
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
