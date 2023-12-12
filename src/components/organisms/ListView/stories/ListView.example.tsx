import React, { useState, useCallback } from 'react'
import { path } from '../..'
import ListView from '..'
import ThemeWrapper from '../../../../utilities/components/ThemeWrapper'
import { action } from '@storybook/addon-actions'
import { Cell } from 'react-table'
import {
  IFilterProps,
  IFetchDataOptions,
  ISelectedRows,
  ISortOptions
} from '../interfaces'
import styled, { ThemeProvider } from 'styled-components'
import IconButtonComponent from '../../../atoms/IconButton'
import Card from '../../../atoms/Card'
import TextInput from '../../../molecules/TextInput'
import DropDown from '../../../molecules/DropDown'
import { getDefaultTheme } from '../../../../utilities/theme'

export default {
  title: `${path}/ListView`,
  component: ListView
}

const columns = [
  {
    Header: 'First Name',
    accessor: 'firstName',
    isSortable: true,
    isFilterable: true,
    isEditable: true,
    Cell: ({ value }: Cell) => <strong>{value}</strong>,
    EditableCell: ({ value }: Cell) => (
      <TextInput variant='inline-edit' defaultValue={value} />
    )
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    isSortable: true,
    isFilterable: true,
    isEditable: true,
    EditableCell: ({ value }: Cell) => (
      <TextInput variant='inline-edit' defaultValue={value} />
    )
  },
  {
    Header: 'Age',
    accessor: 'age'
  },
  {
    Header: 'Visits',
    accessor: 'visits'
  },
  {
    Header: 'Status',
    accessor: 'status',
    isFilterable: true,
    Filter: ({ selectFieldProps }: IFilterProps) => (
      <DropDown
        variant='list-view'
        optionList={[
          { value: '1', label: 'Hello' },
          { value: '2', label: 'World' }
        ]}
        width='100%'
        {...selectFieldProps}
      />
    )
  },
  {
    Header: 'Profile Progress',
    accessor: 'progress'
  },
  {
    Header: 'Custom Column 1',
    accessor: 'c1',
    isVisible: true
  },
  {
    Header: 'Custom Column 2',
    accessor: 'c2',
    isVisible: true
  },
  {
    Header: 'Custom Column 3',
    accessor: 'c3',
    isVisible: true
  },
  {
    Header: 'Custom Column 4',
    accessor: 'c4',
    isVisible: true
  },
  {
    Header: 'Custom Column 5',
    accessor: 'c5',
    isVisible: true
  }
]

const data = [
  {
    rowId: 'uniqid',
    // hasSelectionDisabled: true,
    firstName: 'Ajay',
    lastName: 'Khona',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Arvind',
    rowIdentifier: 'Arvind',
    firstName: 'Arvind',
    lastName: 'Ugale',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Dewansh',
    rowIdentifier: 'Dewansh',
    firstName: 'Dewansh',
    lastName: 'Parashar',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Ajay',
    rowIdentifier: 'Ajay',
    firstName: 'Ajay',
    lastName: 'Khona',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Arvind',
    rowIdentifier: 'Arvind',
    firstName: 'Arvind',
    lastName: 'Ugale',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Dewansh',
    rowIdentifier: 'Dewansh',
    firstName: 'Dewansh',
    lastName: 'Parashar',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Ajay',
    rowIdentifier: 'Ajay',
    firstName: 'Ajay Khona',
    lastName: 'Khona',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Arvind',
    rowIdentifier: 'Arvind',
    firstName: 'Arvind',
    lastName: 'Ugale',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Dewansh',
    rowIdentifier: 'Dewansh',
    firstName: 'Dewansh',
    lastName: 'Parashar',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Ajay',
    rowIdentifier: 'Ajay',
    firstName: 'Ajay',
    lastName: 'Khona',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Arvind',
    rowIdentifier: 'Arvind',
    firstName: 'Arvind',
    lastName: 'Ugale',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Dewansh',
    rowIdentifier: 'Dewansh',
    firstName: 'Dewansh',
    lastName: 'Parashar',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Ajay',
    rowIdentifier: 'Ajay',
    firstName: 'Ajay',
    lastName: 'Khona',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Arvind',
    rowIdentifier: 'Arvind',
    firstName: 'Arvind',
    lastName: 'Ugale',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  },
  {
    rowId: 'Dewansh',
    rowIdentifier: 'Dewansh',
    firstName: 'Dewansh',
    lastName: 'Parashar',
    age: 90,
    visits: 10,
    status: 'hello',
    progress: 20
  }
]

const ButtonStyled = styled(IconButtonComponent)`
  margin-right: 10px;
`
export const withBasic = () => {
  const [totalRows, setTotalRows] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [isActionBarDisabled, setActionBarDisabled] = useState<boolean>(true)
  const [isUpdateMode, setUpdateMode] = useState<boolean>(false)

  const handleUpdate = useCallback(() => {
    setUpdateMode(true)
  }, [])

  const handleFetchData = useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions
    }: IFetchDataOptions) => {
      action(
        'Fetch Data from Backend using: [pageNumber, pageSize, sortOptions, filterOptions]'
      )({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions
      })

      setLoading(true)

      setTimeout(() => {
        /** Fetch Data */
        const tTotalRows: number = 1900
        setTotalRows(tTotalRows)
        setLoading(false)
      }, 0)
    },
    []
  )

  const onSortChange = useCallback((sortBy: ISortOptions) => {
    action('Sort Changed: ')(sortBy)
  }, [])

  const onRowSelect = useCallback(
    // (selectedRowIds: Record<string, boolean>, selectedFlatRows: object[]) => {
    (selectedRows: ISelectedRows) => {
      action('Row Selected: ')(selectedRows)
      setActionBarDisabled(Object.keys(selectedRows).length === 0)
    },
    []
  )

  const defaultActionBar = React.useMemo(
    () => (
      <React.Fragment>
        <ButtonStyled
          iconVariant='delete-thin'
          intent='table'
          disabled={isActionBarDisabled}
          children='Delete'
          iconSize={10}
        />
        <ButtonStyled
          onClick={handleUpdate}
          iconVariant='edit-button'
          intent='table'
          disabled={isActionBarDisabled}
          children='Update'
          iconSize={10}
        />
      </React.Fragment>
    ),
    [setUpdateMode, isActionBarDisabled, handleUpdate]
  )

  const updateModeActionBar = React.useMemo(
    () => (
      <React.Fragment>
        <ButtonStyled
          iconVariant='close'
          intent='table'
          iconSize={10}
          onClick={() => setUpdateMode(false)}
        >
          Cancel
        </ButtonStyled>
        <ButtonStyled intent='table' iconVariant='check-tick' iconSize={10}>
          Save
        </ButtonStyled>
      </React.Fragment>
    ),
    [setUpdateMode]
  )

  return (
    <ThemeWrapper>
      <Card>
        <ListView
          columns={columns}
          data={data}
          totalRows={totalRows}
          loading={loading}
          isEditMode={isUpdateMode}
          hasRowSelectionWithEdit
          onRowSelect={onRowSelect}
          onRowEditClick={action('Row Edit Clicked')}
          onSortChange={onSortChange}
          onFetchData={handleFetchData}
          rowIdentifier='rowId'
          style={{ height: '90vh' }}
        >
          {{
            ActionBar: isUpdateMode ? updateModeActionBar : defaultActionBar
          }}
        </ListView>
      </Card>
    </ThemeWrapper>
  )
}

const columns1 = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ value }: Cell) => <strong>{value}</strong>,
    EditableCell: ({ value }: Cell) => (
      <TextInput variant='inline-edit' defaultValue={value} />
    )
  },
  {
    Header: 'Email',
    accessor: 'email'
  }
]

const rows1 = [
  {
    rowId: 'ajay',
    rowIdentifier: 'ajay',
    name: 'Ajay',
    email: 'ajay.k@loginextsolutions.com'
  }
]

export const DriverListView = () => {
  const handleFetchData = React.useCallback(() => {
    console.log('Fetching Data...')
  }, [])

  const onRowSelect = React.useCallback(() => {}, [])
  const onSortChange = React.useCallback(() => {}, [])

  return (
    <ThemeProvider theme={getDefaultTheme()}>
      <Card>
        <ListView
          columns={columns1}
          data={rows1}
          onFetchData={handleFetchData}
          onRowSelect={onRowSelect}
          onSortChange={onSortChange}
          totalRows={1000}
          loading={false}
        />
      </Card>
    </ThemeProvider>
  )
}
