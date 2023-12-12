import React, { useState, useEffect } from 'react'
import { Row } from 'react-table'
import { IListViewRow, ISelectedRows } from '../../interfaces'
import Position from '../../../../molecules/Position'
import IconButton from '../../../../atoms/IconButton'
import Checkbox from '../../../../atoms/Checkbox'
import ReactTooltipCustom from '../../../../../utilities/components/ReactTooltip'
import Radio from '../../../../atoms/Radio'

export interface IRowSelectCellProps {
  rowCount: number
  row: Row<IListViewRow>
  selectedRows: ISelectedRows
  setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
  hasRowSelectionWithEdit: boolean
  loading: boolean
  isEditMode: boolean
  rowIdentifier: string
  onRowSelect: (selectedRows: ISelectedRows) => void
  onRowEditClick: (row: IListViewRow) => void
  hasRadioSelection: boolean
}

const RowSelectCell = ({
  rowCount,
  row,
  selectedRows,
  setSelectedRows,
  hasRowSelectionWithEdit,
  loading,
  isEditMode,
  rowIdentifier,
  onRowSelect,
  onRowEditClick,
  hasRadioSelection
}: IRowSelectCellProps) => {
  const [checked, setChecked] = useState<boolean>(
    !!selectedRows[row.original[rowIdentifier]]
  )

  useEffect(() => {
    setChecked(!!selectedRows[row.original[rowIdentifier]])
  }, [selectedRows])

  return (
    <Position
      display='flex'
      justifyContent='flex-end'
      type='absolute'
      right='5px'
      top={`calc(50% - ${
        hasRowSelectionWithEdit && !loading ? '12px' : '9px'
      })`}
    >
      {hasRowSelectionWithEdit && !loading && (
        <IconButton
          iconVariant='icomoon-edit-empty'
          iconSize='sm'
          onlyIcon
          hoverFeedback={false}
          className='editIcon'
          color='primary.main'
          style={{ paddingRight: '5px', paddingBottom: '2px' }}
          title='Update'
          onClick={() => onRowEditClick(row.original)}
          {...(row.original.editIconButtonProps || {})}
        />
      )}
      <div
        // title={row.original.checkboxTooltipText || undefined}
        data-tip
        data-for={`tt_checkbox-${row.original[rowIdentifier]}`}
      >
        {hasRadioSelection ? (
          <Radio
            id={`${row.original[rowIdentifier]}-selectAll`}
            radioSize='md'
            name='ListViewradio'
            disabled={
              row.original.hasSelectionDisabled || loading || isEditMode
            }
            // {...row.getToggleRowSelectedProps()}
            checked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = e.target.checked
              setChecked(isChecked)
              setTimeout(
                () => {
                  setSelectedRows((_s) => {
                    // setSelectedRows((s) => {
                    const newSelection = {
                      [row.original[rowIdentifier]]: row.original
                    }
                    if (!isChecked) {
                      delete newSelection[row.original[rowIdentifier]]
                    }

                    setTimeout(() => {
                      onRowSelect(newSelection)
                    }, 100)
                    return newSelection
                  })
                },
                rowCount >= 100 ? 20 : 0
              )
            }}
            {...(row.original.hasSelectionDisabled ? { checked: false } : {})}
          />
        ) : (
          <Checkbox
            id={`${row.original[rowIdentifier]}-selectAll`}
            checkboxSize='md'
            disabled={
              row.original.hasSelectionDisabled || loading || isEditMode
            }
            // {...row.getToggleRowSelectedProps()}
            checked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = e.target.checked
              setChecked(isChecked)
              setTimeout(
                () => {
                  setSelectedRows((s) => {
                    const newSelection = {
                      ...s,
                      [row.original[rowIdentifier]]: row.original
                    }
                    if (!isChecked) {
                      delete newSelection[row.original[rowIdentifier]]
                    }

                    setTimeout(() => {
                      onRowSelect(newSelection)
                    }, 100)
                    return newSelection
                  })
                },
                rowCount >= 100 ? 20 : 0
              )
            }}
            {...(row.original.hasSelectionDisabled ? { checked: false } : {})}
          />
        )}
      </div>
      {row.original.checkboxTooltipText && (
        <ReactTooltipCustom
          id={`tt_checkbox-${row.original[rowIdentifier]}`}
          // type='info'
          effect='float'
          arrowColor='transparent'
          place='bottom'
        >
          {row.original.checkboxTooltipText || undefined}
        </ReactTooltipCustom>
      )}
    </Position>
  )
}

export default React.memo(RowSelectCell)
