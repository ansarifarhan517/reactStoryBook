'use client'

import { useState } from 'react'

import { bemClass } from '@/utils'

import Button from '../button'
import Modal from '../modal'
import Text from '../text'
import JoinPrListPopupForm from '../join-pr-list-popup-form'

import './style.scss'

const blk = 'download-media-kit'

type downloadMediaKitProps = {
  dataAutoId?: string
}

const DownloadMediaKit = ({ dataAutoId }: downloadMediaKitProps) => {
  const [show, setShow] = useState(false)

  const toggleHandler = () => {
    setShow(!show)
  }

  const successCallback = () => {
    toggleHandler()
    window.open('/logiNext-media-kit-2018.zip')
  }

  return (
    <>
      <Button
        clickHandler={toggleHandler}
        className={bemClass([blk, 'button'])}
        dataAutoId={dataAutoId}
      >
        Download media kit
      </Button>
      {show && (
        <Modal
          isClosable
          isCenter
          closeHandler={toggleHandler}
          className={bemClass([blk, 'modal'])}
          dataAutoId={`${dataAutoId}_modal`}
        >
          <div className={bemClass([blk, 'container'])}>
            <Text
              tag="div"
              typography="xl"
              fontWeight="semi-bold"
              className={bemClass([blk, 'title'])}
              dataAutoId={`${dataAutoId}_modal_title`}
            >
              SUBSCRIBE TO OUR PR LIST
            </Text>
            <JoinPrListPopupForm successCallback={successCallback} dataAutoId={`${dataAutoId}_form`} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default DownloadMediaKit
