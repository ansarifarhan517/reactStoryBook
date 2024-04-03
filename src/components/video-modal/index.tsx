'use client'

import { useContext } from 'react'

import AppContext from '@/context'
import { bemClass } from '@/utils'

import './style.scss'

type videoModalProps = {
  className?: string;
}

const blk = 'video-modal'

const VideoModal = ({ className }: videoModalProps) => {
  const { videoData, setVideoData } = useContext(AppContext) || {}

  if (!videoData.url) {
    return null
  }

  const closeHandler = () => {
    setVideoData({
      url: '',
      trackingId: '',
      title: ''
    })
  }

  const { url, trackingId, title } = videoData

  return (
    <div className={bemClass([blk, {}, className])}>
      <button
        type="button"
        title="Close"
        data-auto-id="close"
        className={bemClass([blk, 'close'])}
        onClick={closeHandler}
      >
        &times;
      </button>
      <div className={bemClass([blk, 'container'])}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          allow="autoplay; encrypted-media"
          allowFullScreen
          data-gtm-yt-inspected-6="true"
          id={trackingId}
          title={title}
        />
      </div>
    </div>
  )
}

export default VideoModal
