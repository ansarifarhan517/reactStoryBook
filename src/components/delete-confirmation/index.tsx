import React, { useState, memo } from 'react'
import { Button } from '@base'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'delete-confirmation'

type IDeleteConfirmationProps = {
  closeModal: () => void
  idToBeDeleted: number
  deleteAction: (idToBeDeleted: number) => Promise<boolean>
  deleteSuccess: () => void
}

const DeleteConfirmation: React.FC<IDeleteConfirmationProps> = ({
  closeModal,
  idToBeDeleted,
  deleteAction,
  deleteSuccess,
}) => {
  const [isLoading, setLoading] = useState(false)
  const deleteHandler = () => {
    setLoading(true)
    deleteAction(idToBeDeleted).then(() => {
      setLoading(false)
      closeModal()
      deleteSuccess()
    })
  }

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'icon'])}>!</div>
      <h4 className={bemClass([blk, 'title'])}>Are you sure?</h4>
      <p className={bemClass([blk, 'message'])}>
        This action cannot be undone and will delete the record.
      </p>
      <div className={bemClass([blk, 'footer'])}>
        <Button
          category="secondary"
          className={bemClass([blk, 'btn'])}
          clickHandler={closeModal}
        >
          Cancel
        </Button>
        <Button
          category="error"
          className={bemClass([blk, 'btn'])}
          clickHandler={deleteHandler}
          loading={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default memo(DeleteConfirmation)
