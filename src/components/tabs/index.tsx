import { bemClass } from '@/utils'

import { carouselItem } from '../carousel/carousal-props-type'
import TabButton from '../tab-button'

import './style.scss'

const blk = 'tabs'

type tabProps = {
  active: {
    selectedTabIndex: number
    direction: 'next' | 'prev'
  }
  buttons: carouselItem[]
  className?: string | undefined
  buttonClassName?: string
  timer?: NodeJS.Timeout
  handleClick: Function
  dataAutoId?: string
}

const Tabs = ({
  active,
  buttons,
  className,
  buttonClassName,
  handleClick,
  dataAutoId
}: tabProps) => (
  <section className={bemClass([blk, [className]])}>
    {buttons?.map((item, index) => (
      <TabButton
        key={item?.id}
        handleClick={() => {
          handleClick(index)
        }}
        buttonClassName={buttonClassName}
        active={active.selectedTabIndex == index}
        dataAutoId={`${dataAutoId}_${item?.id}`}
      >
        {item?.title}
      </TabButton>
    ))}
  </section>
)

export default Tabs
