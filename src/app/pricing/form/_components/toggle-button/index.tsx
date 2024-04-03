
import { bemClass } from '@/utils'

import './style.scss'

type buttonTypes = {
  id: string,
  label: string,
}

type toggleButtonProps = {
  buttonList: buttonTypes[]
  selected: string
  changeHandler: (id: string) => void
  dataAutoId?: string
}

const blk = 'toggle-button'

const ToggleButton = ({ buttonList, selected, changeHandler, dataAutoId }: toggleButtonProps) => (
  <div className={blk}>
    {buttonList.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        className={bemClass([
          blk,
          'button',
          { active: selected === id }
        ])}
        onClick={() => {
          changeHandler(id)
        }}
        data-auto-id={`${dataAutoId}_${id}`}
      >
        {label}
      </button>
    ))}
  </div>
)

export default ToggleButton
