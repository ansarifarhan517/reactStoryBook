import React from 'react'
import { Button, Icon } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'grid-action-button'

type IGridActionButtonProps = {
  editRoute: string
  deleteHandler: () => void
}

const GridActionButton: React.FC<IGridActionButtonProps> = ({ editRoute, deleteHandler }) => (
  <div className={blk}>
    <Button asLink withIcon href={editRoute}>
      <Icon name="pencil" color="white" size="small" />
    </Button>
    <Button category="error" withIcon clickHandler={deleteHandler}
      className={bemClass([blk, 'delete-button'])}>
      <Icon name="trash" color="white" size="small" />
    </Button>
  </div>
)

export default GridActionButton
