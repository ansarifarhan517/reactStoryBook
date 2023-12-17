import React from 'react'
import { Button, Column } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'add-update'

type IAddDeleteRowInterface = {
  data: Array<{
    name: string
    designation: string
    imagePath: string
    imageAlt: string
  }>
  children: React.ReactElement
  addHandler: () => void
  deleteHandler: (index: number) => void
}

const AddDeleteRow: React.FC<IAddDeleteRowInterface> = ({
  data,
  children,
  addHandler,
  deleteHandler,
}) => (
  <div>
    {
      data.length > 0 && data.map((item, index) => {
        const temp = `panel-${index}`
        const childrenWithProps = React.cloneElement(children, {
          index,
          data: item,
        })
        return (
          <div key={temp} className={bemClass([blk])}>
            <div className={bemClass([blk, 'children'])}>
              {childrenWithProps}
            </div>
            <div className={bemClass([blk, 'buttons'])}>
              <Column col={3}>
                <Button type="button" clickHandler={addHandler}>+</Button>
                  &nbsp;&nbsp;
                {data.length > 1 && (
                  <Button
                    type="button"
                    id={index}
                    clickHandler={() => { deleteHandler(index) }}>
                    -
                  </Button>
                )}
              </Column>
            </div>
          </div>
        )
      })
    }
  </div>
)

export default AddDeleteRow
