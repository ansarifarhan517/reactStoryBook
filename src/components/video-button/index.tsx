'use client'

import { useContext } from 'react'

import AppContext from '@/context'
import { bemClass } from '@/utils'

import './style.scss'

type videoButtonProps = {
  videoUrl: string
  videoTrackingId: string
  videoTitle: string
  className?: string
  dataAutoId?: string
}

const blk = 'video-button'

const VideoButton = ({
  videoUrl,
  videoTrackingId,
  videoTitle,
  className,
  dataAutoId
}: videoButtonProps) => {
  const { setVideoData } = useContext(AppContext)

  const clickHandler = () => {
    setVideoData({
      url: videoUrl,
      trackingId: videoTrackingId,
      title: videoTitle
    })
  }

  return (
    <button
      type="button"
      title="play"
      onClick={clickHandler}
      className={bemClass([blk, {}, className])}
      data-auto-id={dataAutoId}
    />
  )
}

export default VideoButton
