import './style.scss'

type popOvermenuOption = {
  option: {
    key: string
    value: string
  },
  selectHandler: (valueObj: Record<string, string>) => void
}

const blk = 'pop-over-menu-option'

const PopOvermenuOption = ({
  option,
  selectHandler,
}: popOvermenuOption) => {

  const clickHandler = () => {
    selectHandler(option)
  }

  const { value } = option

  return (
    <button
      onClick={clickHandler}
      className={blk}
    >
      {value}
    </button>
  )
}

export default PopOvermenuOption
