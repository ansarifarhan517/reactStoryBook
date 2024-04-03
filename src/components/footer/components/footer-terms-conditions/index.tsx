import Link from 'next/link'
import { bemClass } from '@/utils'

import './style.scss'

const blk = 'terms-conditions'

const CopyRight = () => (
  <section className={bemClass([blk])}>
    <div data-auto-id="copyright">
      © 2013 - {new Date().getFullYear()}
      <span className={bemClass([blk, 'content'])}>LogiNext Solutions</span>
      <span className={bemClass([blk, 'vertical-rule'])}>|</span>
    </div>
    <div data-auto-id="terms-and-conditions">
      <span className={bemClass([blk, 'content'])}>
        <Link
          href={'/terms-and-conditions'}
          className={bemClass([blk, 'links'])}
          target="_blank"
        >
          Terms & Conditions
        </Link>
      </span>
      <span className={bemClass([blk, 'vertical-rule'])}>|</span>
    </div>
    <div data-auto-id="privacy-policy">
      <span className={bemClass([blk, 'content'])}>
        <Link
          href={'/privacy-policy'}
          className={bemClass([blk, 'links'])}
          target="_blank"
        >
          Privacy Policy
        </Link>
      </span>
    </div>
  </section>
)

export default CopyRight
