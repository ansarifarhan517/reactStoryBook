import Modal from '@/components/modal'
import HubSpotForm from '@/components/hub-spot-form'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type resourceDownloadProps = {
  hubSpotFormId: string
  title: string
  closeHandler: () => void
  dataAutoId?: string
}

const blk = 'resource-download'

const ResourceDownload = ({
  hubSpotFormId,
  title,
  closeHandler,
  dataAutoId
}: resourceDownloadProps) => {

  if (!hubSpotFormId) {
    return null
  }

  return (
    <Modal
      isClosable
      isCenter
      closeHandler={closeHandler}
      className={blk}
      dataAutoId={`${dataAutoId}_modal`}
    >
      <div className={bemClass([blk, 'content'])}>
        <Text
          tag="div"
          typography="xl"
          color="black"
          className={bemClass([blk, 'head'])}
          dataAutoId={`${dataAutoId}_form_title`}
        >
          Download form
        </Text>
        <Text
          tag="p"
          typography="l"
          className={bemClass([blk, 'title'])}
          dataAutoId={`${dataAutoId}_form_desc`}
        >
          {title}
        </Text>
        <HubSpotForm
          formId={hubSpotFormId}
        />
      </div>
    </Modal>
  )
}

export default ResourceDownload
