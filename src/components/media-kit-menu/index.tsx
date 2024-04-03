import Link from 'next/link'

import Text from '../text'

import { bemClass } from '@/utils'

import DownloadMediaKit from '../download-media-kit'

import './style.scss'

const blk = 'media-kit-menu'

type mediaKitMenuProps = {
  dataAutoId?: string
}

const MediaKitMenu = ({ dataAutoId }: mediaKitMenuProps) => (
  <div className={blk}>
    <Text
      tag="div"
      typography="l"
      color="gray-dark"
      className={bemClass([blk, 'title'])}
      dataAutoId={`${dataAutoId}_media_kit`}
    >
      Media Kit
    </Text>
    <Link
      href="/company/aboutus"
      data-auto-id={`${dataAutoId}_about_company`}
      className={bemClass([blk, 'link'])}
    >
      About company
    </Link>
    <Link
      href="/company/newsmedia/founders-bio"
      className={bemClass([blk, 'link'])}
      data-auto-id={`${dataAutoId}_founders_bio`}
    >
      Founders Bio
    </Link>
    <DownloadMediaKit dataAutoId={`${dataAutoId}_download_media_kit`} />
  </div>
)

export default MediaKitMenu
