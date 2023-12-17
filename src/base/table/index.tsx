import React from 'react'
import TableHeaderCell from './components/table-header-cell'
import TableDataCell from './components/table-data-cell'

import './style.scss'

type TableColumn = {
  label: string
  custom?: (dataItem: object) => React.ReactNode;
  className?: string
  map?: string
};

type TableRow = {
  name: string
};

type TableProps = {
  columns: TableColumn[]
  data: TableRow[]
}

const Table: React.FC<TableProps> = ({ columns, data }) => (
  <table className="table">
    <thead>
      <tr>
        {columns.map((column, index) => {
          const { label, className } = column
          const key = `${label}_column_${index}`
          return <TableHeaderCell key={key} label={label} className={className} />
        })}
      </tr>
    </thead>
    <tbody>
      {data.map((dataItem, index) => {
        const { name } = dataItem
        const key = `${name}_data_row_${index}`
        return (
          <tr key={key}>
            {columns.map((column, index) => {
              const { label } = column
              const key = `${label}_column_data_${index}`
              return (
                <TableDataCell key={key} column={column} dataItem={dataItem} />
              )
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)

export default Table
