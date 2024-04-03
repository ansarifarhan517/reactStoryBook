import { bemClass } from '@/utils'

import './style.scss'

type hamburgerProps = {
  active?: boolean;
  clickHandler: () => void;
}

const blk = 'hamburger'

const Hamburger = ({ active = true, clickHandler }: hamburgerProps) => (
  <button type="button" className={blk} onClick={clickHandler} aria-label="Open the menu">
    <span className={bemClass([blk, 'line', { first: true,
      active }])} />
    <span className={bemClass([blk, 'line', { middle: true,
      active }])} />
    <span className={bemClass([blk, 'line', { last: true,
      active }])} />
  </button>
)

export default Hamburger
