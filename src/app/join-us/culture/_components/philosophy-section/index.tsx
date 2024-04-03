import Image from 'next/image'

import Container from '@/components/container'
import LoadWhenInView from '@/components/load-when-in-view'
import { bemClass } from '@/utils'

import { philosophy } from './_data'
import ImageContentGrid from './image-content-grid'
import OwnershipPic from '/public/join-us/company-culture/ownership.webp'
import ClockContainer from '../clock-container'

import './style.scss'

const blk = 'philosophy-section'

type philosophySectionProps = {
  dataAutoId?: string
}

const PhilosophySection = ({ dataAutoId }: philosophySectionProps) => (
  <Container fluid className={blk}>
    <>
      <div className={bemClass([blk, 'speed-ownership-bash-container'])}>
        <div className={bemClass([blk, 'speed-bash'])}>
          {philosophy['speedBashOwnership']?.map(item => (
            <ImageContentGrid
              key={item?.id}
              item={item}
              className={bemClass([blk, 'speed-ownership-grid'])}
              dataAutoId={`${dataAutoId}_${item.id}`}
            />
          ))}
        </div>
        <div className={bemClass([blk, 'ownership'])}>
          <Image
            src={OwnershipPic}
            alt="ownership-image"
            className={bemClass([blk, 'ownership-image'])}
            data-auto-id={`${dataAutoId}_ownership_image`}
          />
        </div>
      </div>
      <div className={bemClass([blk, 'impact-bash-container'])}>
        {philosophy['impact']?.map(item => (
          <ImageContentGrid
            key={item?.id}
            item={item}
            className={bemClass([blk, 'impact-grid', [item.id]])}
            dataAutoId={`${dataAutoId}_${item.id}`}
          />
        ))}
      </div>
      <div className={bemClass([blk, 'atac-container'])}>
        {philosophy[
          'accomplishments_transparency_approachable_consistency'
        ]?.map(item => (
          <ImageContentGrid
            key={item?.id}
            item={item}
            className={bemClass([blk, 'atac-grid', [item.id]])}
            dataAutoId={`${dataAutoId}_${item.id}`}
          />
        ))}
        <div className={bemClass([blk, 'clock-grid'])}>
          <LoadWhenInView>
            <ClockContainer dataAutoId={`${dataAutoId}_clock`} />
          </LoadWhenInView>
        </div>
      </div>
    </>
  </Container>
)

export default PhilosophySection
