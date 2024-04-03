import Link from 'next/link'
import { bemClass } from '@/utils'

import InViewSlide from '../in-view-slide'
import Container from '../container'

import './style.scss'

const blk = 'awards'

type awardsProps = {
  dataAutoId?: string
}

const awardsList = [
  {
    id: 'deloitte',
    url: 'https://www.loginextsolutions.com/blog/deloitte-inc-forbes-financial-times-statista-freightwaves-name-loginext-fastest-growing-tech-company/',
  },
  {
    id: 'inc',
    url: 'https://www.prlog.org/12727274-inc-5000-lists-loginext-in-top-50-global-logistics-and-transportation-companies.html',
  },
  {
    id: 'forbes',
    url: 'https://www.forbesindia.com/article/30-under-30-2017/dhruvil-sanghvi-is-working-to-make-loginext-the-google-of-supplychain-logistics/45877/1',
  },
  {
    id: 'gartner',
  },
  {
    id: 'ibm',
  },
  {
    id: 'ft',
    url: 'https://www.ft.com/content/200d394e-5c67-11ea-ac5e-df00963c20e6',
  },
]

const Awards = ({ dataAutoId }: awardsProps) => (
  <InViewSlide className={blk}>
    <Container className={bemClass([blk, 'container'])} dataAutoId={dataAutoId}>
      <>
        {awardsList.map(({ id, url = '' }) => {
          if (id !== 'gartner' && id !== 'ibm') {
            return (
              <div key={id} className={bemClass([blk,'reference'])}>
                <Link
                  aria-label={id}
                  href={url}
                  target="_blank"
                  rel="nofollow"
                  className={bemClass([blk,'reference-item', [id]])}
                  data-auto-id={`${dataAutoId}_${id}`}
                />
              </div>
            )
          }
          return (
            <div key={id} className={bemClass([blk,'reference'])}>
              <span className={bemClass([blk,'reference-item', [id]])} />
            </div>
          )
        })}
      </>
    </Container>
  </InViewSlide>
)

export default Awards
