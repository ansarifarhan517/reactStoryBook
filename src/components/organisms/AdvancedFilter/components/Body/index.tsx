import React, { useState, useEffect } from 'react'
import { useToast } from '../../../../molecules/Toast'
import SectionHeader from '../../../../molecules/SectionHeader'
import AdvancedFilterCardHeader from '../CardHeader'
import AdvancedFilterMasterCondition from '../MasterCondition'
import Dropdown from '../AdvFiterDropdown'
// Modal
import Modal from '../../../../molecules/Modal'
import Header from '../../../../molecules/ModalHeader'

import {
  IFilter,
  IAdvancedFilterBodyProps,
  // tFieldTypeObject,
  // tTypeObject,
  IFilterConditions,
  tDropDownOptions,
  IThirdElementValue
} from '../../interfaces'
import {
  AdvancedFilterWrapper,
  FilterCardWrapper,
  AdvancedFilterInnerCardWrapper,
  IconButtonStyled,
  ChipsWrapper,
  ConditionWrapper,
  AddConditionWrapper,
  SortButtonStyled,
  SortStyled,
  TransparentButton,
  NoFilterBlock
} from './styled'
import IconButton from '../../../../atoms/IconButton'
import FontIcon from '../../../../atoms/FontIcon'
import Typography from '../../../../atoms/Typography'
import Position from '../../../../molecules/Position'

import {
  generateUEID,
  getObject,
  createNewArray,
  arrayEquals,
  removeObjectFromArray,
  isElementPresent,
  createSavedFiterDropdown,
  getString,
  validateSort
} from '../Utils/index'

const Body = ({
  chipsArray,
  showCard,
  handleUpdateAndSave,
  onFavourite,
  setShowCard,
  clearCard,
  handleDelete,
  columnsData,
  HSetColumnData,
  fieldOperation,
  ThirdElement,
  openCard,
  updateData,
  masterCondition = true,
  allowSort = true,
  allowFavourites = true,
  // allowMultipleFilters = true,
  sortDropdown,
  // tooltip,
  saveTooltip,
  duplicateTooltip,
  cancelTooltip,
  removeFavouriteTooltip,
  markAsfavouriteTooltip,
  onAddCondition,
  showCardId,
  ThirdElementFormatter
}: IAdvancedFilterBodyProps) => {
  const [dropdownOptions, setDropdownOptions] = useState<tDropDownOptions[]>([
    ...columnsData
  ])
  const todaysDate = new Date()

  const [showFirstDropdown, setShowFirstDropdown] = useState(false)

  const [filterData, setFilterData] = useState<IFilter>({
    id: '',
    multiFilter: undefined,
    filterName: '',
    filterMasterCondition: 'AND',
    filterSortable: false,
    sortable: {
      columnName: '',
      sortOrder: ''
    },
    allowSort: false,
    filterApplied: false,
    advanceFilterTagReferenceIds: []
  })

  const [filterConditions, setFilterConditions] = useState<IFilterConditions[]>(
    [
      {
        id: '',
        readMode: false,
        dropdownOptions: '',
        operationalOptions: { options: null, value: '' },
        fieldType: '',
        thirdElement: { type: undefined, value: '',label:''}
      }
    ]
  )

  const [SavedFilterDropdownOptions, setSavedFilterDropdownOptions] = useState<
    any[]
  >([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [columns, setColumns] = useState([''])
  const [
    filterNameInFilterCondition,
    setFilterNameInFilterCondition
  ] = useState([''])

  const [deleteChip, setDeleteChip] = useState({
    id: '',
    call: false
  })
  useEffect(() => {
    // handle Chip Array
    const chip = chipsArray?.find((c) => c.id === filterData.id)
    chip && handleChipClick(undefined, chip)
  }, [chipsArray])
  // close card when chipsArray Change
  useEffect(() => {
    updateData &&
      updateData({
        filterData: filterData,
        filterConditions: filterConditions
      })
  }, [filterData, filterConditions])

  // clear Card data
  useEffect(() => {
    if (clearCard) {
      clearCardData()
    }
  }, [clearCard])

  // Useeffect to track the dropdownOptions
  useEffect(() => {
    const a = createNewArray(
      filterConditions,
      'dropdownOptions',
      'savedFilters'
    )
    !arrayEquals(a, columns) && setColumns(a)
    // saveFilters
    const b = filterConditions.map((f) => {
      return typeof f.thirdElement.value === 'object'
        ? f.thirdElement.value?.value
        : f.thirdElement.value
    })

    !arrayEquals(b, filterNameInFilterCondition) &&
      setFilterNameInFilterCondition(b)
  }, [filterConditions])

  // remove the columns from 1st dropdown if they are already selected
  useEffect(() => {
    // column dropdown repeating issue
    let DropdownArray: tDropDownOptions[] = [...columnsData]
    columns.forEach((c) => {
      DropdownArray =
        c !== '' ? removeObjectFromArray(c, DropdownArray, 'id') : DropdownArray
    })
    setDropdownOptions([...DropdownArray])
    // saved Filters repeating issue

    let savedFiltersArray: any[] = chipsArray
      ? [...createSavedFiterDropdown(chipsArray)]
      : []
    filterNameInFilterCondition.forEach(
      (m) =>
        (savedFiltersArray =
          m !== ''
            ? removeObjectFromArray(m, savedFiltersArray, 'id')
            : savedFiltersArray)
    )
    setSavedFilterDropdownOptions([...savedFiltersArray])
  }, [columns, filterNameInFilterCondition])

  // deleteChips
  useEffect(() => {
    deleteChip.call && handleDelete && handleDelete(deleteChip.id)
  }, [deleteChip.call])

  useEffect(() => {
    const chip = chipsArray?.find((c) => c.id === showCardId)
    showCardId && chip && handleChipClick(undefined, chip)

    setShowCard && setShowCard(!!showCardId)
  }, [showCardId])

  // handle ADD condition
  const handleAddCondition = () => {
    if (showFirstDropdown) {
      const flag = filterConditions.every((m) =>
        m.dropdownOptions !== '' &&
        m?.operationalOptions.value !== '' &&
        m?.thirdElement.type !== '' &&
        m?.thirdElement.type === 'none'
          ? true
          : m?.thirdElement.value !== ''
      )

      flag
        ? setFilterConditions([
            ...filterConditions,
            {
              id: generateUEID().toString(),
              readMode: false,
              dropdownOptions: '',
              fieldType: '',
              operationalOptions: { options: null, value: '' },
              thirdElement: { type: undefined, value: '',label:'' }
            }
          ])
        : showToast('Complete existing filter details first')
    } else {
      setShowFirstDropdown(true)
      setFilterConditions([
        {
          id: generateUEID().toString(),
          readMode: false,
          dropdownOptions: '',
          fieldType: '',
          operationalOptions: { options: null, value: '' },
          thirdElement: { type: undefined, value: '',label:''}
        }
      ])
      onAddCondition && onAddCondition()
    }
  }

  /***********************************/
  /* Handle FAVOURITES  */
  /**********************************/

  const handleFavourites = () => {
    onFavourite &&
      onFavourite({
        filterData: filterData,
        filterConditions: filterConditions
      })
  }

  /***********************************/
  /* Handle Clicking on Filter Chip */
  /**********************************/

  const handleChipClick = (e: any, chip: any) => {
    setShowFirstDropdown(true)
    clearCardData()
    setDropdownOptions([...columnsData])
    populateNormalFilterData(chip)
    console.log(e)
  }

  /*********************************************************/
  /*         populate chips data in the card               */
  /*********************************************************/

  const populateNormalFilterData = (chip: any) => {
    const isFavourite = chip?.favouriteSections?.some(
      (m: string) => m === 'list'
    )

    setFilterData({
      id: chip.id,
      multiFilter: undefined,
      isFavourite: isFavourite && chip.isFavourite,
      favouriteSections: chip.favouriteSections,
      filterName: chip.label,
      filterMasterCondition: masterCondition ? chip.condition : 'AND',
      filterSortable: allowSort,
      filterApplied: chip?.filterApplied,
      sortable: {
        columnName: HSetColumnData[chip?.sortCriteria?.fieldId],
        sortOrder: {
          id: 'sorting',
          label: chip?.sortCriteria?.operationSymbol,
          value: chip?.sortCriteria?.operationLabelKey
        }
      },
      allowSort: !!chip?.sortCriteria?.fieldId || false,
      advanceFilterTagReferenceIds: chip?.advanceFilterTagReferenceIds
    })
    const tempArray: any[] = []
    const isMultiFiler = chip?.advanceFilterTagReferenceIds

    chip.dropdownData.map((c: any) => {
      let DropDownValue: any = {}
      let FT = ''
      let OperationalArray: any
      let operationalValue = {}

      if (c.columnId === 'savedFilters' && isMultiFiler.length > 0) {
        DropDownValue = {
          id: 'savedFilterIs',
          label: 'savedFilterIs',
          value: 'savedFilterIs',
          fieldType: 'savedFilter'
        }
        FT = 'savedFilterIs'
        OperationalArray = FT && fieldOperation[FT]
        operationalValue = fieldOperation[FT]
      } else {
        DropDownValue = HSetColumnData[c.columnId]
        FT = DropDownValue?.fieldType
        OperationalArray = FT && fieldOperation[FT]
        operationalValue =
          OperationalArray &&
          getObject(c.operationType, OperationalArray, 'labelKey')
      }

      const temp = {
        id: generateUEID().toString(),
        readMode: true,
        dropdownOptions: c.columnId,
        operationalOptions: {
          options: OperationalArray,
          value: operationalValue
        },
        fieldType: DropDownValue?.fieldType,
        thirdElement: {
          type:
            c.operationType === 'isnotempty' || c.operationType === 'isempty'
              ? 'none'
              : DropDownValue?.fieldType,
          value: c.value,
          label:c.label
        }
      }
      tempArray.push(temp)
    })
    setFilterConditions([...tempArray])
    openCard &&
      openCard({
        id: chip.id,
        filterApplied: chip.filterApplied,
        advanceFilterTagReferenceIds: []
      })
    setFilterConditions([...tempArray])
    setShowCard && setShowCard(true)
  }

  /*********************************************************/
  /*         Handle Closing of card                        */
  /*********************************************************/
  const handleCloseCard = () => {
    clearCardData()
    setShowCard && setShowCard(false)
  }

  /*********************************************************/
  /*         Handle Clearing Data from the card             */
  /*********************************************************/
  const clearCardData = () => {
    setFilterData({
      id: '',
      filterName: '',
      multiFilter: undefined,
      filterMasterCondition: 'AND',
      filterSortable: allowSort,
      sortable: {
        columnName: '',
        sortOrder: ''
      },
      advanceFilterTagReferenceIds: []
    })
    setFilterConditions([])
  }

  /*********************************************************/
  /*         // handle click of first dropdown             */
  /*********************************************************/
  const handleFirstDropdownChange = (id: string, e: any) => {
    const FT: any = e?.fieldType
    let newState: any[]
    if (FT === 'savedFilters') {
      newState = filterConditions.map((fl) => {
        return fl.id === id
          ? {
              ...fl,
              operationalOptions: {
                options: [
                  {
                    operation: 'is',
                    operationSymbol: '=',
                    label: '=',
                    value: 'savedFilterIs'
                  }
                ],
                value: {
                  operation: 'is',
                  operationSymbol: '=',
                  label: '=',
                  value: 'savedFilterIs'
                }
              },
              fieldType: 'savedFilter',
              dropdownOptions: e.id,
              thirdElement: { type: 'savedFilter', value: '', label:'' }
            }
          : fl
      })
    } else {
      newState = filterConditions.map((fl) => {
        return fl.id === id
          ? {
              ...fl,
              operationalOptions: {
                options: fieldOperation[FT],
                value: FT === 'calendar' ? fieldOperation[FT]?.[0] : ''
              },
              dropdownOptions: e.id,
              fieldType: FT,
              thirdElement: {
                type: FT,
                value: FT === 'calendar' ? [todaysDate, todaysDate] : '',
                label:''
              }
            }
          : fl
      })
    }
    setFilterConditions([...newState])
  }

  /*********************************************************/
  /*          // handle click of second dropdown         */
  /*********************************************************/
  const handleSecondDropdownChange = (id: string, e: any) => {
    const operationOptions = filterConditions?.find((f: any) => f.id === id)
      ?.operationalOptions?.options
    let obj =
      operationOptions && getObject(e.labelKey, operationOptions, 'labelKey')

    obj = obj || e

    let newState: any[] = []
    if (e.value === 'savedFilterIs') {
      newState = filterConditions.map((fl) =>
        fl.id === id
          ? {
              ...fl,
              thirdElement: { type: 'savedFilter', value: '', label:'' },
              operationalOptions: {
                options: fl.operationalOptions.options,
                value: e
              }
            }
          : fl
      )
    } else if (e.value === 'Between') {
      newState = filterConditions.map((fl) =>
        fl.id === id
          ? {
              ...fl,
              thirdElement: {
                type: fl.fieldType,
                value: [todaysDate, todaysDate],
                label: ''
              },
              operationalOptions: {
                options: fl.operationalOptions.options,
                value: e
              }
            }
          : fl
      )
    } else {
      newState = filterConditions.map((fl) =>
        fl.id === id
          ? {
              ...fl,
              thirdElement: {
                type:
                  e.labelKey === 'isnotempty' || e?.labelKey === 'isempty'
                    ? 'none'
                    : fl.fieldType,
                value: '',
                label:''
              },
              operationalOptions: {
                options: fl.operationalOptions.options,
                value: obj
              }
            }
          : fl
      )
    }

    setFilterConditions([...newState])
  }

  /*********************************************************/
  // handle click of remove condition
  /*********************************************************/
  const handleRemoveCondition = (id: any) => {
    const arr = removeObjectFromArray(id, filterConditions, 'id')
    setFilterConditions([...arr])
  }

  /*********************************************************/
  // handle filter Save
  /*********************************************************/
  const handleSave = () => {
    handleUpdateAndSave &&
      handleUpdateAndSave({
        filterData: {
          ...filterData
        },
        filterConditions: filterConditions
      })
  }

  /*********************************************************/
  // handle Duplicate
  /*********************************************************/

  const handleDuplicate = () => {
    setFilterData({
      ...filterData,
      id: '',
      filterName: ''
    })
    handleUpdateAndSave &&
      handleUpdateAndSave({
        filterData: {
          ...filterData,
          id: ''
        },
        filterConditions: filterConditions
      })
  }

  /*********************************************************/
  // handle sort open
  /*********************************************************/
  const handleSortOpen = () => {
    setFilterData({
      ...filterData,
      allowSort: !filterData?.allowSort
    })
  }

  /*********************************************************/
  // handle Sort Columns
  /*********************************************************/
  const handleSortColumn = (e: any, column: boolean) => {
    const value =
      sortDropdown && column && typeof e.value === 'string'
        ? getObject(e.value, sortDropdown, 'value')
        : e.value

    setFilterData({
      ...filterData,
      sortable: {
        columnName: column ? value : filterData?.sortable?.columnName,
        sortOrder: {
          id: column
            ? typeof filterData?.sortable?.sortOrder === 'string'
              ? filterData?.sortable?.sortOrder
              : filterData?.sortable?.sortOrder?.id
            : e.value,
          label: column
            ? typeof filterData?.sortable?.sortOrder === 'string'
              ? filterData?.sortable?.sortOrder
              : filterData?.sortable?.sortOrder?.label
            : e.label,
          value: column
            ? typeof filterData?.sortable?.sortOrder === 'string'
              ? filterData?.sortable?.sortOrder
              : filterData?.sortable?.sortOrder?.value
            : e.value
        }
      }
    })
  }

  /*********************************************************/
  // Handle removing of sort columns
  /*********************************************************/
  const handleRemoveSort = () => {
    setFilterData({
      ...filterData,
      sortable: {
        columnName: '',
        sortOrder: ''
      },
      allowSort: false
    })
  }

  /*********************************************************/
  // handle editing of Predefined conditions
  /*********************************************************/
  const activateEditMode = (id: string) => {
    setFilterConditions((fl) =>
      fl.map((c) =>
        c.id === id
          ? {
              ...c,
              readMode: false
            }
          : c
      )
    )
  }

  /*********************************************************/
  // handle ThirdElement SetValue
  /*********************************************************/
  const handleThirdElementSetValue = (id: string, value: any, _label:any) => {
    setFilterConditions((values) =>
      values.map((v) =>
        v.id === id
          ? {
              ...v,
              thirdElement: { type: v.thirdElement.type, value: value, label: typeof value === 'object'? value: value.label}
            }
          : v
      )
    )
  }

  /*********************************************************/
  // error messages toast
  /*********************************************************/
  const toast = useToast()
  const showToast = (message: string) => toast.add(message, 'warning', false)

  /*********************************************************/
  // Formate label value
  /*********************************************************/
  const labelFormatter = React.useCallback(
    (data: IThirdElementValue) => {
      if (ThirdElementFormatter) {
        return ThirdElementFormatter(data)
      } else {
        return data?.label || data?.value
      }
    },
    [ThirdElementFormatter]
  )

  // Component Structure
  return (
    <AdvancedFilterWrapper>
      <SectionHeader headerTitle='Saved Filters' />
      <ChipsWrapper>
        {chipsArray && chipsArray?.length > 0 ? (
          chipsArray?.map((chips: any, index: any) =>
            chips.id === 'draft' ? (
              chipsArray.length === 1 ? (
                <NoFilterBlock>No Saved Filter</NoFilterBlock>
              ) : (
                <div key={index} />
              )
            ) : (
              <IconButtonStyled
                title={chips.label}
                key={index}
                selected={
                  filterData.multiFilter
                    ? isElementPresent(chips.id, filterData.multiFilter)
                    : chips.id === filterData.id
                }
              >
                <TransparentButton onClick={(e) => handleChipClick(e, chips)}>
                  {allowFavourites &&
                    chips?.favouriteSections?.length > 0 &&
                    chips?.favouriteSections?.find(
                      (e: string) => e === 'list'
                    ) &&
                    chips?.isFavourite && (
                      <FontIcon
                        variant='star-filled'
                        color={
                          filterData.multiFilter
                            ? isElementPresent(
                                chips.id,
                                filterData.multiFilter
                              ) || chips.id === filterData.id
                              ? 'white'
                              : 'primary.main'
                            : 'primary.main'
                        }
                        size={14}
                      />
                    )}
                  {' ' + chips.label}
                </TransparentButton>
                {/* Delete Confirmation */}
                {/* delete button */}
                <IconButton
                  iconVariant='delete-thin'
                  iconSize={10}
                  color='error.main'
                  onClick={() => {
                    setDeleteChip({
                      call: false,
                      id: chips.id
                    })
                    setIsModalOpen(true)
                    handleCloseCard()
                  }}
                  intent='default'
                  onlyIcon
                />
              </IconButtonStyled>
            )
          )
        ) : (
          <NoFilterBlock>No Saved Filter</NoFilterBlock>
        )}
      </ChipsWrapper>
      {/* Filter Card */}
      {showCard && (
        <FilterCardWrapper>
          <AdvancedFilterCardHeader
            label={filterData.multiFilter ? 'MultiSelect View' : 'Filter Name'}
            name={filterData.filterName}
            duplicate={handleDuplicate}
            setName={(name) =>
              setFilterData({
                ...filterData,
                filterName: name
              })
            }
            save={handleSave}
            saveTooltip={saveTooltip}
            close={handleCloseCard}
            cancelTooltip={cancelTooltip}
            duplicateTooltip={duplicateTooltip}
            favourite={handleFavourites}
            isFavourite={filterData.isFavourite}
            id={filterData.id}
            allowFavourites={allowFavourites}
            favouriteTooltip={
              filterData.isFavourite
                ? removeFavouriteTooltip
                : markAsfavouriteTooltip
            }
          />
          <AdvancedFilterInnerCardWrapper>
            {masterCondition && (
              <AdvancedFilterMasterCondition
                condition={filterData.filterMasterCondition}
                handleChange={(e: any) => {
                  setFilterData({
                    ...filterData,
                    filterMasterCondition: e
                  })
                }}
              />
            )}

            <div>
              {filterConditions.map((fl: any) => (
                <ConditionWrapper key={fl.id}>
                  {fl.readMode ? (
                    <Position display='flex' justifyContent='space-between'>
                      <Typography fontSize='14px' color='black'>
                        {(HSetColumnData[fl.dropdownOptions]?.label ||
                          HSetColumnData[fl.dropdownOptions]?.value) +
                          ' ' +
                          (fl.operationalOptions?.value?.label ||
                            fl.operationalOptions?.value?.value) +
                          ''}

                        <span
                          title={getString(
                            fl.thirdElement?.label || fl.thirdElement?.value
                          )}
                        >
                          {' ' +
                            getString(
                              labelFormatter(fl.thirdElement)
                            )?.toString()}
                        </span>
                      </Typography>
                      <IconButton
                        onClick={() => activateEditMode(fl.id)}
                        onlyIcon
                        iconVariant='icomoon-edit-empty'
                        iconSize='md'
                        color='black'
                      />
                    </Position>
                  ) : (
                    <>
                      {showFirstDropdown && (
                        <Dropdown
                          value={HSetColumnData[fl.dropdownOptions]}
                          options={
                            // if its savedFilter then dont show as it would be already shown
                            fl.dropdownOptions === 'savedFilters'
                              ? dropdownOptions
                              : [
                                  ...dropdownOptions,
                                  { ...HSetColumnData[fl.dropdownOptions] }
                                ]
                          }
                          onChange={(e: any) => {
                            handleFirstDropdownChange(fl.id, e)
                          }}
                        />
                      )}

                      {fl.operationalOptions?.options !== null && (
                        <Dropdown
                          value={fl.operationalOptions.value}
                          options={fl.operationalOptions.options}
                          onChange={(e: any) =>
                            handleSecondDropdownChange(fl.id, e)
                          }
                        />
                      )}
                      {fl.thirdElement.type === 'none' ? (
                        ''
                      ) : (
                        <div>
                          <span>
                            {fl.thirdElement.type === 'savedFilter' ? (
                              <Dropdown
                                value={fl.thirdElement.value}
                                options={[
                                  ...SavedFilterDropdownOptions,
                                  chipsArray &&
                                  typeof fl.thirdElement.value === 'object'
                                    ? fl.thirdElement.value
                                    : chipsArray
                                    ? getObject(
                                        fl.thirdElement.value,
                                        createSavedFiterDropdown(chipsArray),
                                        'id'
                                      )
                                    : []
                                ]}
                                onChange={(value: any, label: any) => {
                                  handleThirdElementSetValue(fl.id, value, label)
                                }}
                              />
                            ) : (
                              <ThirdElement
                                key={fl.id}
                                columnName={fl.dropdownOptions}
                                operationType={fl.operationalOptions.value}
                                fieldType={
                                  fl.dropdownOptions &&
                                  HSetColumnData[fl.dropdownOptions]?.fieldType
                                }
                                value={fl.thirdElement.value}
                                setValue={(value: any, label: any) =>
                                  handleThirdElementSetValue(fl.id, value, label)
                                }
                              />
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {filterConditions.length > 1 ||
                  validateSort(filterData?.sortable) ? (
                    <>
                      <IconButton
                        onClick={() => handleRemoveCondition(fl.id)}
                        onlyIcon
                        iconVariant='delete-tab'
                        iconSize={18}
                        color='error.lighterMain'
                        style={{ padding: '0px 5px' }}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </ConditionWrapper>
              ))}

              <AddConditionWrapper onClick={handleAddCondition}>
                <FontIcon variant='add' color='primary.main' size={10} />
                {'  '}Add Condition
              </AddConditionWrapper>

              {allowSort && filterData.filterSortable && (
                <>
                  <SortStyled onClick={handleSortOpen}>
                    <SortButtonStyled
                      onlyIcon
                      iconVariant={
                        filterData.allowSort ? 'icomoon-minus' : 'icomoon-add'
                      }
                      iconSize='xs'
                      color='primary.main'
                    />
                    {'   '}
                    <Typography
                      fontSize='13px'
                      primary
                      underline
                      style={{ display: 'inline-block' }}
                    >
                      Sort
                    </Typography>
                  </SortStyled>

                  {filterData.allowSort && (
                    <>
                      <ConditionWrapper>
                        <Dropdown
                          value={filterData?.sortable?.columnName}
                          options={sortDropdown && sortDropdown}
                          onChange={(e: any) => handleSortColumn(e, true)}
                        />
                        <Dropdown
                          value={filterData?.sortable?.sortOrder}
                          options={[
                            { label: 'Ascending', value: 'ASC' },
                            { label: 'Descending', value: 'DESC' }
                          ]}
                          onChange={(e: any) => handleSortColumn(e, false)}
                        />
                        {filterConditions.length >= 1 && (
                          <IconButton
                            onClick={handleRemoveSort}
                            onlyIcon
                            iconVariant='delete-tab'
                            iconSize='sm'
                            color='error.main'
                          />
                        )}
                      </ConditionWrapper>
                    </>
                  )}
                </>
              )}
            </div>
          </AdvancedFilterInnerCardWrapper>
        </FilterCardWrapper>
      )}
      {/* Delete Confirmation Modal */}
      <Modal
        open={isModalOpen}
        onToggle={(value: boolean) => {
          setIsModalOpen(value)
        }}
        children={{
          content: (
            <Typography color='black'>
              <div>Are you sure you want to delete this filter?</div>
            </Typography>
          ),
          footer: (
            <Position type='relative' display='flex' justifyContent='flex-end'>
              <IconButton
                onClick={() => {
                  setDeleteChip({
                    ...deleteChip,
                    call: true
                  })
                  setIsModalOpen(false)
                }}
                primary
                intent='default'
                iconVariant='delete-thin'
                children='Delete'
                style={{ margin: '10px' }}
              />
              <IconButton
                onClick={() => setIsModalOpen(false)}
                intent='default'
                iconVariant='close'
                children='Cancel'
                style={{ margin: '10px' }}
              />
            </Position>
          ),
          // triggerComponent: (

          // ),
          header: (
            <Header
              headerTitle='Delete Confirmation'
              handleClose={() => setIsModalOpen(false)}
              imageVariant='close'
            />
          )
        }}
        width='600px'
      />
    </AdvancedFilterWrapper>
  )
}
export default Body
