import { useState, useCallback } from 'react'
import {
  IFilterOptions,
  ICustomFiltersInstance,
  ITextFieldProps,
  ISelectFieldProps
} from '../interfaces'
import { Column } from 'react-table'

export const useCustomFilters = (
  filtersObject: Record<string, string> = {}
): ICustomFiltersInstance => {
  const [filters, setFilters] = useState<Record<string, string>>(filtersObject)

  const combinedFilterOptions = useCallback((): IFilterOptions => {
    const entries = Object.entries(filters)
    if (!entries.length) {
      return {}
    }

    const reducedEntries = entries.reduce(
      (
        previousEntry: [string, string] = ['', ''],
        currentEntry: [string, string]
      ): [string, string] => {
        return [
          `${previousEntry[0]}#@#${currentEntry[0]}`,
          `${previousEntry[1]}#@#${currentEntry[1]}`
        ]
      }
    )

    return {
      searchBy: reducedEntries[0],
      searchText: reducedEntries[1]
    }
  }, [filters])

  const getTextFieldProps = (column: Column): ITextFieldProps => ({
    id: `${column.id}-filter`,
    type: 'text',
    // onChange: (e: React.FormEvent<HTMLInputElement>) => {
    // },
    onClear: () => {
      setFilters((f) => {
        const newFilter = { ...f }
        delete newFilter[column.id || '']
        return newFilter
      })
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const value = e.currentTarget.value
        if (value) {
          setFilters((f) => ({ ...f, [column.id || value]: value }))
        } else {
          setFilters((f) => {
            const newFilter = { ...f }
            delete newFilter[column.id || value]
            return newFilter
          })
        }
      }
    }
  })

  const getSelectFieldProps = (column: Column): ISelectFieldProps => ({
    id: `${column.id}-filter`,
    type: 'text',
    // onChange: (e: React.FormEvent<HTMLInputElement>) => {
    // },
    value: filters?.[column.id || ''] || '',
    // onChange: ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    onChange: (value: string | undefined = '') => {
      // const value = e.currentTarget.value
      if (value) {
        setFilters((f) => ({ ...f, [column.id || value]: value }))
      } else {
        setFilters((f) => {
          const newFilter = { ...f }
          delete newFilter[column.id || value]
          return newFilter
        })
      }
    }
  })

  const resetFilters = () => {
    setFilters({})
  }

  return {
    filters,
    setFilters,
    getTextFieldProps,
    getSelectFieldProps,
    combinedFilterOptions,
    resetFilters
  }
}
