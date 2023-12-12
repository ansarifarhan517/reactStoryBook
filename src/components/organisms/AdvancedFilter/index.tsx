import React, { useEffect, useState, useRef } from 'react'
import { AdvancedFilterWrapperStyled, AdvancedFilterStyled } from './styled'
import {
  IAdvancedFilter,
  IFilter,
  // IFilterData,
  // IFilterData,
  // IExposeFilters,
  IRawExposedData
} from './interfaces'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'
// import Position from '../../molecules/Position'
import PrepColumnsData from './DataCleansing/PrepColumnsData'
import PrepOperationsTypeArray from './DataCleansing/PrepOperationsTypeArray'
import PrepFilterData from './DataCleansing/PrepFilterData'
import Draggable from './components/Draggable'
import {
  PrepareFilterData,
  validateFilterData,
  // validateFiltersData,
  validateFilterConditions,
  validateFullSortCriteria,
  validateHalfSortCriteria
} from './components/Utils'
import { useToast } from '../../molecules/Toast'

// handle FavouriteSections

const addList = (favouriteSections: string[]) => {
  if (favouriteSections && favouriteSections?.length !== 0) {
    if (favouriteSections?.find((e) => e === 'live')) {
      return ['list', 'live']
    }
  }
  return ['list']
}

const removeList = (favouriteSections: string[]) => {
  if (favouriteSections?.length !== 0) {
    if (favouriteSections.find((e) => e === 'live')) {
      return ['live']
    } else {
      return []
    }
  } else {
    return []
  }
}

const AdvancedFilter = ({
  children,
  chipsArray,
  dropDownOptions,
  onDelete,
  onApply,
  onRemove,
  onSave,
  onUpdate,
  onFavourite,
  backButton,
  backButtonCallback,
  ThirdElement,
  ThirdElementFormatter,
  fieldOperation,
  style,
  appliedFilterId,
  showOpen = false,
  onAddFilter,
  onAddCondition,
  id,
  ...rest
}: IAdvancedFilter) => {
  const node = useRef(null)
  const [chips, setChips] = useState(
    PrepFilterData(chipsArray, appliedFilterId)
  )
  const [open, setOpen] = useState(showOpen)
  const [showCard, setShowCard] = useState(false)
  const [clearCard, setClearCard] = useState<number | undefined>(undefined)
  const [currentCard, setCurrentCard] = useState<any>()
  const [showRemoveFilter, setShowRemoveFilter] = useState(false)
  const [operationTypes, setOperationTypes] = useState(
    PrepOperationsTypeArray(fieldOperation)
  )
  const [columnsData, setColumnsData] = useState({
    sortDropdown: [],
    columnStructure: [],
    HSetColumnStructure: {}
  })

  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    setOpen(false)
  }

  React.useEffect(() => {
    setOpen(showOpen)
  }, [showOpen])

  useEffect(() => {
    setShowRemoveFilter(!!appliedFilterId)
  }, [appliedFilterId])

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  /*********************************************************/
  // error messages toast
  /*********************************************************/
  const toast = useToast()
  const showToast = (message: string) => toast.add(message, 'warning', false)

  const handleAddFilter = () => {
    setShowCard(true)
    setClearCard(new Date().getTime())
    // setShowRemoveFilter(false)
    onAddFilter && onAddFilter()
  }

  const openCard = (IFilter: IFilter) => {
    const current = chipsArray.find((c) => IFilter.id === c.id)
    IFilter && setCurrentCard(current)
    // setShowRemoveFilter(!!IFilter?.filterApplied)
  }

  const updateData = (object: IRawExposedData) => {
    setCurrentCard({ ...object })
  }

  // handle apply
  const handleApply = () => {
    const filters = PrepareFilterData(
      currentCard.filterConditions,
      columnsData.HSetColumnStructure,
      'apply',
      chipsArray
    )

    const columnName =
      typeof currentCard?.filterData?.sortable?.columnName === 'object'
        ? currentCard?.filterData?.sortable?.columnName.id
        : currentCard?.filterData?.sortable?.columnName

    const temp: any = {
      id: currentCard.filterData.id,
      filterName: currentCard.filterData.filterName || ' ',
      filters: filters,
      isFavourite: currentCard.filterData.isFavourite,
      favouriteSections: currentCard.filterData.favouriteSections,
      operationLogic: currentCard?.filterData?.filterMasterCondition,
      sortCriteria: [
        {
          fieldId: columnName,
          fieldLabelKey: columnsData.HSetColumnStructure[columnName]?.label,
          operationLabelKey: currentCard?.filterData?.sortable?.sortOrder.value,
          operationSymbol: currentCard?.filterData?.sortable?.sortOrder.value
        }
      ]
    }

    const sortFlag = validateFullSortCriteria(temp?.sortCriteria[0])

    if (validateHalfSortCriteria(temp?.sortCriteria[0]) && !sortFlag) {
      showToast('Incomplete Information')
    } else {
      !sortFlag && delete temp?.sortCriteria

      const { flag, message } = { flag: true, message: '' }
      const { flag: Cflag, message: Cmessage } = validateFilterConditions(
        currentCard.filterConditions
      )

      flag && (sortFlag || Cflag) && setShowCard(false)

      const onApplyfilters = {
        id: temp?.id,
        filterName: temp?.filterName || ' ',
        filters: temp?.filters,
        operationLogic: temp?.operationLogic,
        sortCriteria: temp?.sortCriteria || []
      }

      return flag
        ? sortFlag || Cflag
          ? onApply && currentCard && onApply({ ...onApplyfilters })
          : showToast(Cmessage)
        : showToast(sortFlag || Cflag ? message : Cmessage)
    }
  }

  // handle Save
  const handleUpdateAndSave = (object: any) => {
    const filters = PrepareFilterData(
      object.filterConditions,
      columnsData.HSetColumnStructure,
      'save'
    )
    const AdvancedRefIds: string[] = []
    object.filterConditions?.forEach((fc: any) => {
      if (fc?.thirdElement?.type === 'savedFilter') {
        AdvancedRefIds.push(fc.thirdElement.value.id)
      }
    })

    const columnName =
      typeof object?.filterData?.sortable?.columnName === 'object'
        ? object?.filterData?.sortable?.columnName.id
        : object?.filterData?.sortable?.columnName

    const temp: any = {
      id: object.filterData.id,
      filterName: object.filterData.filterName || ' ',
      filters: filters,
      isFavourite: object.filterData.isFavourite,
      favouriteSections: object.filterData.favouriteSections,
      operationLogic: object?.filterData?.filterMasterCondition,
      sortCriteria: [
        {
          fieldId: columnName,
          fieldLabelKey: columnsData.HSetColumnStructure[columnName]?.label,
          operationLabelKey: object?.filterData?.sortable?.sortOrder.value,
          operationSymbol: object?.filterData?.sortable?.sortOrder.value
        }
      ],
      advanceFilterTagReferenceIds: [...AdvancedRefIds]
    }

    const sortFlag = validateFullSortCriteria(temp?.sortCriteria[0])

    if (validateHalfSortCriteria(temp?.sortCriteria[0]) && !sortFlag) {
      showToast('Incomplete Information')
    } else {
      !sortFlag && delete temp?.sortCriteria

      const { flag, message } = validateFilterData(
        chipsArray,
        object.filterData
      )

      const { flag: Cflag, message: Cmessage } = validateFilterConditions(
        object.filterConditions
      )

      flag && (sortFlag || Cflag) && setShowCard(false)

      return flag
        ? sortFlag || Cflag
          ? object.filterData.id && object.filterData.id !== 'draft'
            ? onUpdate &&
              onUpdate({
                ...temp
              })
            : onSave && onSave({ ...temp })
          : showToast(Cmessage)
        : showToast(sortFlag || Cflag ? message : Cmessage)
    }
  }

  // handle delete
  const handleDelete = (id: string) => {
    onDelete && onDelete(id)
    setShowCard(false)
  }

  // chips array
  useEffect(() => {
    setChips([...PrepFilterData(chipsArray, appliedFilterId)])
  }, [chipsArray])

  // field Operations
  useEffect(() => {
    setOperationTypes(PrepOperationsTypeArray(fieldOperation))
  }, [fieldOperation])

  // dropdown options
  useEffect(() => {
    const [
      sortDropdown,
      columnStructure,
      HSetColumnStructure
    ]: any = PrepColumnsData(dropDownOptions)
    setColumnsData({
      sortDropdown: sortDropdown,
      columnStructure: columnStructure,
      HSetColumnStructure: HSetColumnStructure
    })
  }, [dropDownOptions])

  // draggable
  Draggable('advancedFilterDraggable', 'advancedFilterHeader')

  // handle favourites
  const handleFavourites = (object: IRawExposedData) => {
    // handle prepping data and all

    const temp: any = chipsArray.find((c) => {
      return c.id === object?.filterData?.id
    })
    if (temp) {
      const finalObj = object?.filterData?.isFavourite
        ? {
            ...temp,
            isFavourite: false,
            favouriteSections: removeList(temp.favouriteSections)
          }
        : {
            ...temp,
            isFavourite: true,
            favouriteSections: temp.favouriteSections
              ? addList(temp.favouriteSections)
              : ['list']
          }
      onFavourite && onFavourite({ ...finalObj })
    } else {
      showToast('Something went wrong. Please refresh')
    }
  }

  return (
    <AdvancedFilterStyled ref={node}>
      {children({
        open,
        setOpen,
        chips,
      })}

      {open && (
        <AdvancedFilterWrapperStyled
          type='relative'
          display='inline-block'
          style={style}
          id='advancedFilterDraggable'
        >
          <Header
            closeAdvancedFilter={() => {
              setClearCard(new Date().getTime())
              setOpen(false)
              setShowCard(false)
            }}
            backButton={backButton}
            backButtonCallback={backButtonCallback}
          />
          <Body
            showCard={showCard}
            setShowCard={(status?: boolean) =>
              status !== undefined && setShowCard(status)
            }
            chipsArray={chips}
            showCardId={appliedFilterId}
            clearCard={clearCard}
            handleDelete={handleDelete}
            columnsData={columnsData.columnStructure}
            HSetColumnData={columnsData.HSetColumnStructure}
            onFavourite={onFavourite && handleFavourites}
            handleUpdateAndSave={handleUpdateAndSave}
            ThirdElement={ThirdElement}
            openCard={openCard}
            updateData={updateData}
            sortDropdown={columnsData.sortDropdown}
            fieldOperation={operationTypes}
            onAddCondition={onAddCondition}
            ThirdElementFormatter={ThirdElementFormatter}
            {...rest}
          />

          <Footer
            showApply={showCard}
            showRemove={showRemoveFilter}
            showAddFilter={!showCard}
            addFilter={handleAddFilter}
            removeFilter={() => {
              onRemove && currentCard && onRemove(currentCard?.filterData?.id)
            }}
            applyFilter={handleApply}
          />
        </AdvancedFilterWrapperStyled>
      )}
    </AdvancedFilterStyled>
  )
}

export default AdvancedFilter
