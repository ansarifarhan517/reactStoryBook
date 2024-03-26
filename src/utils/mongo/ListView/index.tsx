import React, { useState, useEffect, ReactNode } from 'react';
import { IMongoField, IBlurFilter } from '../interfaces';
import { IListViewColumn, IFilterProps, DropDown, TextFilter, DateRangePicker, DatePicker } from 'ui-library';
import CELL_MAPPING from './cell.mapping';
import DROPDOWN_FILTER_OPTIONS_MAPPING, { IDropdownOptionType } from './dropdownFilterOptions.mapping'
import EDITABLE_CELL_MAPPING from './EditableCell.mapping';
import { useTypedSelector } from '../../redux/rootReducer';
import { ICustomField } from '../../../modules/Driver/DriverListView/DriverListView.models';
import { IClientProperty } from '../../../modules/common/ClientProperties/interfaces';
import moment from 'moment-timezone'
import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties';
import { CfFile } from './CfFile';


const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
const endDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)


const getFilterComponent = (moduleKey: string, fieldKey: string, fieldType: string = '', mongoField: IMongoField, blurFilterObj: IBlurFilter) => {
  let filterComponent = undefined

  if (mongoField.customField) {

    switch (fieldType) {
      
      case 'number':
        filterComponent = ({ textFieldProps, setFilters, filters }: IFilterProps) =>
          <TextFilter {...textFieldProps}
            type='number'
            onClear={() => {
              setFilters((f) => {
                const newFilter = { ...f }
                delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                return smartMergeWithBlur(newFilter, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
              })
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.currentTarget.value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value
                if (value) {
                  setFilters((f) => {
                    const nFilt = ({ ...f, [`${fieldType}_CUSTOM_${fieldKey}`]: value })
                    return smartMergeWithBlur(nFilt, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                  })
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                    return smartMergeWithBlur(newFilter, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                  })
                }
              } else {
                blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.currentTarget.value)
              }
            }}
            onBlur={(e: any) => {
              blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.target.value)
            }}
            value={filters[`${fieldType}_CUSTOM_${fieldKey}`]}
          />
        break
      case 'text':
        filterComponent = ({ textFieldProps, setFilters, filters }: IFilterProps) =>
          <TextFilter {...textFieldProps}
            value={filters[`${fieldType}_CUSTOM_${fieldKey}`]}
            onClear={() => {
              setFilters((f) => {
                const newFilter = { ...f }
                delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                return smartMergeWithBlur(newFilter, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
              })
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.currentTarget.value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value
                if (value) {
                  setFilters((f) => {
                    const nFilt = ({ ...f, [`${fieldType}_CUSTOM_${fieldKey}`]: value })
                    return smartMergeWithBlur(nFilt, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                  })
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                    return smartMergeWithBlur(newFilter, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                  })
                }
              } else {
                blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.currentTarget.value)
              }
            }}
            onBlur={(e: any) => {
              blurFilterObj.newKeyVal(`${fieldType}_CUSTOM_${fieldKey}`, e.target.value)
            }}
          />
        break

      case 'checkbox':
      case 'radio':
      case 'select':
      case 'multiSelect':
      case 'dropdown':
      case 'skillsetfield':
        filterComponent = ({ selectFieldProps, setFilters, filters }: IFilterProps) => {
          return <DropDown
            id={selectFieldProps?.id}
            value={filters[`${fieldType}_CUSTOM_${fieldKey}`]}
            onChange={(value: string | undefined = '') => {
              // selectFieldProps?.onChange && selectFieldProps?.onChange(`${fieldType}_CUSTOM_${value}`)}
              if (value) {
                setFilters((f) => {
                  const nFilt = ({ ...f, [`${fieldType}_CUSTOM_${fieldKey}`]: value })
                  return smartMergeWithBlur(nFilt, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                })
              } else {
                setFilters((f) => {
                  const newFilter = { ...f }
                  delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                  return smartMergeWithBlur(newFilter, blurFilterObj, `${fieldType}_CUSTOM_${fieldKey}`)
                })
              }
            }}
            variant='list-view'
            optionList={Object.keys(mongoField?.dropdownValues || {}).map(optionKey => ({ label: mongoField.dropdownValues?.[optionKey], value: optionKey }))}
            width='100%'
          />
        }
        break

      case 'date':
        filterComponent = ({ filters, setFilters }: IFilterProps) => {
          const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
          const [filterText, setFilterText] = useState<string>('')
          const textFilterRef = React.createRef<HTMLDivElement>()
          const [right, setRight] = useState<number | 'auto' | 'unset'>(0)
          const [left, setLeft] = useState<number | 'auto' | 'unset'>(0)
          const [top, setTop] = useState<number | undefined>()
          const dateFormatter = React.useCallback((date: Date) => {
            return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
          }, [clientProperties])

          const stringToDate = React.useCallback((str: string) => {
            return moment(str, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`).toDate()
          }, [clientProperties])

          /** On Reload, Persist Filter and display filter text */
          useEffect(() => {
            if (!filters[`${fieldType}_CUSTOM_${fieldKey}`]) {
              setFilterText('')
              return
            }

            const filtersRange = filters[`${fieldType}_CUSTOM_${fieldKey}`].split('$@$')
            if (filtersRange.length === 2) {
              const from = filtersRange[0]
              const to = filtersRange[1]

              const fromDisplay = moment(new Date(Number(from))).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
              const toDisplay = moment(new Date(Number(to))).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
              setFilterText(`${fromDisplay} - ${toDisplay}`)
            }
          }, [])

          

          return <div style={{ position: 'relative' }}>
            <DateRangePicker
              variant='daterange'
              style={{ position: 'absolute', right, left, top, zIndex: 1 }}
              startDate={new Date()}
              endDate={new Date()}
              showTime={false}
              timeFormat={24}
              fromDateFormatter={dateFormatter}
              toDateFormatter={dateFormatter}
              stringToDate={stringToDate}
              onApply={(range) => {
                if (range) {
                  const from = range[0]
                  const to = range[1]

                  from.setHours(0)
                  from.setMinutes(0)
                  from.setSeconds(0)
                  to.setHours(0)
                  to.setMinutes(0)
                  to.setSeconds(0)

                  setFilterText(`${moment(range[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(range[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`)
                  setFilters((f) => {
                    const newFilter = {...f,[`${fieldType}_CUSTOM_${fieldKey}`]: `${from.getTime()}$@$${to.getTime()}`};
                    return smartMergeWithBlur(newFilter,blurFilterObj,fieldKey);
                  });
                }
              }}
            >
              {({ setOpen }) => {
                return <div ref={textFilterRef}><TextFilter
                  readOnly
                  onClick={() => {
                    setOpen(o => !o)
                    const daterangepickerWidth = 708.94
                    const clientRect = textFilterRef.current?.getClientRects()
                    setTop(clientRect?.[0]?.height || 0)

                    let listViewLeft = 0
                    document.querySelectorAll("[class^=listview-container]").forEach((element) => {
                      if (element.contains(textFilterRef.current) && !listViewLeft) {
                        listViewLeft = element.getBoundingClientRect().left
                      }
                    })

                    if (clientRect && (clientRect[0].right - listViewLeft) >= daterangepickerWidth) {
                      setRight(0)
                      setLeft('unset')
                    } else {
                      setLeft(0)
                      setRight('unset')
                    }
                  }}
                  onClear={() => {
                    setOpen(false)
                    setFilterText('')
                    setFilters(f => {
                      const newFilter = { ...f }
                      delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                      return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                    })
                  }}
                  value={filterText}
                /></div>
              }}
            </DateRangePicker>
          </div>
        }
        break
      case 'time':
      case 'datetime':
      case 'calendar':
        filterComponent = ({ filters, setFilters }: IFilterProps) => {
          const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
          const [filterText, setFilterText] = useState<string>('')
          const textFilterRef = React.createRef<HTMLDivElement>()
          const [right, setRight] = useState<number | 'auto' | 'unset'>(0)
          const [left, setLeft] = useState<number | 'auto' | 'unset'>(0)
          const [top, setTop] = useState<number | undefined>()

          const dateFormatter = React.useCallback((date: Date) => {
            return moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
          }, [clientProperties])

          const stringToDate = React.useCallback((str: string) => {
            return moment(str, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`).toDate()
          }, [clientProperties])

          /** On Reload, Persist Filter and display filter text */
          useEffect(() => {
            if (!filters[`${fieldType}_CUSTOM_${fieldKey}`]) {
              setFilterText('')
              return
            }


            const filtersRange = filters[`${fieldType}_CUSTOM_${fieldKey}`].split('$@$')
            if (filtersRange.length === 2) {
              const fromUtc = filtersRange[0]
              const toUtc = filtersRange[1]
              const fromDisplay = moment.utc(fromUtc, 'x').tz(clientProperties?.TIMEZONE.propertyValue).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`)
              const toDisplay = moment.utc(toUtc, 'x').tz(clientProperties?.TIMEZONE.propertyValue).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`)
              setFilterText(`${fromDisplay} - ${toDisplay}`)
            }
          }, [])
          const dateToString = (date: Date) => {
            return date.toString()
          }

          return (<div style={{ position: 'relative' }}>
            <DateRangePicker
              variant='daterange'
              style={{ position: 'absolute', right, left, top, zIndex: 1 }}

              startDate={new Date()}
              endDate={new Date()}
              showTime
              fromDateFormatter={dateFormatter}
              toDateFormatter={dateFormatter}
              stringToDate={stringToDate}
              dateToString={dateToString}
              onApply={(range) => {
                if (range) {
                  const from = range[0]
                  const to = range[1]

                  from.setHours(0)
                  from.setMinutes(0)
                  from.setSeconds(0)
                  to.setHours(0)
                  to.setMinutes(0)
                  to.setSeconds(0)

                  setFilterText(`${moment(range[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(range[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`)
                  setFilters(f => {
                    const newFilter = { ...f, [`${fieldType}_CUSTOM_${fieldKey}`]: `${from.getTime()}$@$${to.getTime()}` };
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                  })
                }
              }}
            >
              {({ setOpen }) => {
                return <div ref={textFilterRef}>
                  <TextFilter
                    id=''
                    readOnly
                    onClick={() => {
                      setOpen(o => !o)
                      const daterangepickerWidth = 708.94
                      const clientRect = textFilterRef.current?.getClientRects()
                      setTop(clientRect?.[0]?.height || 0)

                      let listViewLeft = 0
                      document.querySelectorAll("[class^=listview-container]").forEach((element) => {
                        if (element.contains(textFilterRef.current) && !listViewLeft) {
                          listViewLeft = element.getBoundingClientRect().left
                        }
                      })

                      if (clientRect && (clientRect[0].right - listViewLeft) >= daterangepickerWidth) {
                        setRight(0)
                        setLeft('unset')
                      } else {
                        setLeft(0)
                        setRight('unset')
                      }
                    }}
                    onClear={() => {
                      setOpen(false)
                      setFilterText('')
                      setFilters(f => {
                        const newFilter = { ...f }
                        delete newFilter[`${fieldType}_CUSTOM_${fieldKey}`]
                        return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                      })
                    }}
                    value={filterText}
                  />
                </div>
                // <div onClick={() => setOpen(!open)}>{value[0] + ' - ' + value[1]}</div>
              }}

            </DateRangePicker>
          </div>)
        }
        break
    }
  } else {
    switch (fieldType) {
      case 'link':
      case 'text':
        filterComponent = ({ textFieldProps, setFilters, filters }: IFilterProps) => {

          return <TextFilter {...textFieldProps}
            value={filters[fieldKey]}
            onClear={() => {
              setFilters((f) => {
                const newFilter = { ...f }
                delete newFilter[fieldKey]
                return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
              })
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              blurFilterObj.newKeyVal(fieldKey, e.currentTarget.value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value
                if (value) {
                  setFilters((f) => {
                    const nFilt = ({ ...f, [fieldKey]: value })
                    return smartMergeWithBlur(nFilt, blurFilterObj, fieldKey)
                  })
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[fieldKey]
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                  })
                }
              } else {
                blurFilterObj.newKeyVal(fieldKey, e.currentTarget.value)
              }
            }}
            onBlur={(e: any) => {
              blurFilterObj.newKeyVal(fieldKey, e.target.value)
            }}
          />
        }
        break
      case 'select':
      case 'multiSelect':
      case 'dropdown':
      case 'skillsetfield':
        filterComponent = ({ selectFieldProps, filters, setFilters }: IFilterProps) => {
          const [optionList, setOptionList] = useState<IDropdownOptionType[] | undefined>([])
          const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
          const fetchOptions = async () => {
            const getter = DROPDOWN_FILTER_OPTIONS_MAPPING?.[moduleKey]?.[fieldKey]
            if (!getter || typeof getter !== 'function') {
              setOptionList([])
              return;
            }
            const options = await getter(dynamicLabels)
            setOptionList(options)
          }
          useEffect(() => {
            fetchOptions()
          }, [dynamicLabels])
          return <DropDown
            value={filters[fieldKey]}
            {...selectFieldProps}
            onChange={(value: string | undefined = '') => {
              if (value) {
                setFilters((f) => {
                  const nFilt = ({ ...f, [fieldKey]: value })
                  return smartMergeWithBlur(nFilt, blurFilterObj, fieldKey)
                })
              } else {
                setFilters((f) => {
                  const newFilter = { ...f }
                  delete newFilter[fieldKey]
                  return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                })
              }
            }}
            variant='list-view'
            optionList={optionList || []}
            width='100%'
          />
        }
        break;


      case 'date':
        filterComponent = ({ filters, setFilters }: IFilterProps) => {

          /***  mongoField?.dateFormat-(send manually this field to the structure of date property and pass the dateFormat as 'YYYY-MM-DD HH:mm:ss'
          ***  backend support above format while search sort filter)
          */
          const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
          const [filterText, setFilterText] = useState<string>('')
          const textFilterRef = React.createRef<HTMLDivElement>()
          const [right, setRight] = useState<number | 'auto' | 'unset'>(0)
          const [left, setLeft] = useState<number | 'auto' | 'unset'>(0)
          const [top, setTop] = useState<number | undefined>()

          const dateFormatter = React.useCallback((date: Date) => {
            return mongoField?.dateFormat ? moment(date).format(mongoField?.dateFormat)
              : moment(date).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())
          }, [clientProperties, mongoField])

          const stringToDate = React.useCallback((str: string) => {
            return moment(str, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`).toDate()
          }, [clientProperties])

          /** On Reload, Persist Filter and display filter text */
          useEffect(() => {
            if (!filters[fieldKey]) {
              setFilterText('')
              return
            }

            const filtersRange = filters[fieldKey].split('$@$')
            if (filtersRange.length === 2) {
              const from = filtersRange[0]
              const to = filtersRange[1]

              const fromDisplay = moment(new Date(Number(from))).format(`${mongoField?.dateFormat ? mongoField?.dateFormat : ''}`)
              const toDisplay = moment(new Date(Number(to))).format(`${mongoField?.dateFormat ? mongoField?.dateFormat : ''}`)
              setFilterText(`${fromDisplay} - ${toDisplay}`)
            }
          }, [])
          const formatDisplayDate = (date: string) => {
            return date.replace('$@$', ' - ')
          }

          // const startDate = React.useRef(new Date())
          return <div style={{ position: 'relative' }}>
            <DateRangePicker
              variant='daterange'
              style={{ position: 'absolute', right, left, top, zIndex: 999 }}

              startDate={new Date()}
              endDate={new Date()}
              showTime={!!mongoField?.showTime}
              timeFormat={12}
              fromDateFormatter={dateFormatter}
              toDateFormatter={dateFormatter}
              stringToDate={stringToDate}
              onApply={(range) => {
                if (range) {
                  const from = range[0]
                  const to = range[1]
                  setFilterText(mongoField?.dateFormat ?
                    `${moment(range[0]).format(mongoField?.dateFormat)} - ${moment(range[1]).format(mongoField?.dateFormat)}`
                    : `${moment(range[0]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())} - ${moment(range[1]).format(clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase())}`
                  )
                  setFilters(f => {
                    if (mongoField?.dateFormat) {
                      const fromTime = moment(from).format(mongoField?.dateFormat)
                      const toTime = moment(to).format(mongoField?.dateFormat)
                      const newFilter = { ...f, [`${fieldKey}`]: `${fromTime}$@$${toTime}` };
                      return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                    }
                    return (smartMergeWithBlur({ ...f, [`${fieldKey}`]: `${from.getTime()}$@$${to.getTime()}`}, blurFilterObj, fieldKey))
                  })
                }
              }}
            >
              {({ setOpen }) => {
                return <div ref={textFilterRef}><TextFilter
                  readOnly
                  onClick={() => {
                    setOpen(o => !o)
                    const daterangepickerWidth = 708.94
                    const clientRect = textFilterRef.current?.getClientRects()
                    setTop(clientRect?.[0]?.height || 0)

                    let listViewLeft = 0
                    document.querySelectorAll("[class^=listview-container]").forEach((element) => {
                      if (element.contains(textFilterRef.current) && !listViewLeft) {
                        listViewLeft = element.getBoundingClientRect().left
                      }
                    })

                    if (clientRect && (clientRect[0].right - listViewLeft) >= daterangepickerWidth) {
                      setRight(0)
                      setLeft('unset')
                    } else {
                      setLeft(0)
                      setRight('unset')
                    }
                  }}
                  onClear={() => {
                    setOpen(false)
                    setFilterText('')
                    setFilters(f => {
                      const newFilter = { ...f }
                      delete newFilter[`${fieldKey}`]
                      return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                    })
                  }}
                  value={formatDisplayDate(filters[fieldKey] || filterText)}
                //value={filterText}
                /></div>
                // <div onClick={() => setOpen(!open)}>{value[0] + ' - ' + value[1]}</div>
              }}

            </DateRangePicker>
          </div>
        }
        break

      case 'datetime':
      case 'calendar':
        filterComponent = ({ filters, setFilters }: IFilterProps) => {
          const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
          const [filterText, setFilterText] = useState<string>('')
          const textFilterRef = React.createRef<HTMLDivElement>()
          const [right, setRight] = useState<number | 'auto' | 'unset'>(0)
          const [left, setLeft] = useState<number | 'auto' | 'unset'>(0)
          const [top, setTop] = useState<number | undefined>()
          // const [inputDate, setInputDate] = useState<Date[]>([
          //   todaysDate, todaysDate
          // ])
          const fStringDate = localStorage.getItem(`${fieldKey}fDate`)
          const fDate = fStringDate ? moment(fStringDate, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`).toDate() : startDate
          
          const tStringDate = localStorage.getItem(`${fieldKey}tDate`)
          const tDate = tStringDate ? moment(tStringDate, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`).toDate() : endDate

          

          const dateFormatter = (date: Date) => {
            return moment(date).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`)
          }

          const stringToDate =(str: string) => {
            return moment(str, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`).toDate()
          }

          
          /** On Reload, Persist Filter and display filter text */
          useEffect(() => {
            if (!filters[fieldKey]) {
              setFilterText('')
            
              
              localStorage.setItem(`${fieldKey}fDate`, '');
              localStorage.setItem(`${fieldKey}tDate`, '');
              
              return
            }
            const filtersRange = filters[fieldKey].split('$@$')
            if (filtersRange.length === 2) {
              const fromUtc = filtersRange[0]
              const toUtc = filtersRange[1]
              let timezone = JSON.parse(localStorage.getItem('userAccessInfo') || "")['timezone'] || "";
              const fromDisplay = moment.utc(fromUtc).tz(timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} HH:mm:ss`);
              const toDisplay = moment.utc(toUtc).tz(timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()} HH:mm:ss`);

              localStorage.setItem(`${fieldKey}fDate`, fromDisplay);
              localStorage.setItem(`${fieldKey}tDate`, toDisplay);

              setFilterText(`${fromDisplay} - ${toDisplay}`)
            }
          }, [])

          return (<div style={{ position: 'relative' }}>
            <DateRangePicker
              variant='daterange'
              style={{ position: 'absolute', right, left, top, zIndex: 1 }}

              startDate={fDate}
              endDate={tDate}
              showTime
              fromDateFormatter={dateFormatter}
              toDateFormatter={dateFormatter}
              stringToDate={stringToDate}
              timeFormat={24}
              onApply={(range) => {
                if (range) {
                  let formattedStartDate = moment(range[0]).format("YYYY-MM-DD HH:mm:ss");
                  let formattedEndDate = moment(range[1]).format("YYYY-MM-DD HH:mm:ss");
                  let timezone = JSON.parse(localStorage.getItem('userAccessInfo') || "")['timezone'] || "";
                  setFilterText(`${moment.tz(range[0], timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`)} - ${moment.tz(range[1], timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm:ss`)}`)
                  setFilters(f => {
                    const newFilter = { ...f, [`${fieldKey}`]: `${moment.tz(formattedStartDate, "YYYY-MM-DD HH:mm:ss", timezone).utc().format('YYYY-MM-DD HH:mm:ss')}$@$${moment.tz(formattedEndDate, "YYYY-MM-DD HH:mm:ss", timezone).utc().format('YYYY-MM-DD HH:mm:ss')}` }; 
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)})
                  }
              }}
            >
              {({ setOpen }) => {
                return <div ref={textFilterRef}>
                  <TextFilter
                    id=''
                    readOnly
                    onClick={() => {
                      setOpen(o => !o)
                      const daterangepickerWidth = 708.94
                      const clientRect = textFilterRef.current?.getClientRects()
                      setTop(clientRect?.[0]?.height || 0)

                      let listViewLeft = 0
                      document.querySelectorAll("[class^=listview-container]").forEach((element) => {
                        if (element.contains(textFilterRef.current) && !listViewLeft) {
                          listViewLeft = element.getBoundingClientRect().left
                        }
                      })

                      if (clientRect && (clientRect[0].right - listViewLeft) >= daterangepickerWidth) {
                        setRight(0)
                        setLeft('unset')
                      } else {
                        setLeft(0)
                        setRight('unset')
                      }
                    }}
                    onClear={() => {
                      setOpen(false)
                      setFilterText('')
                      setFilters(f => {
                        const newFilter = { ...f }
                        delete newFilter[`${fieldKey}`]
                        return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                      })
                    }}
                    value={filterText}
                  />
                </div>
                // <div onClick={() => setOpen(!open)}>{value[0] + ' - ' + value[1]}</div>
              }}

            </DateRangePicker>
          </div>)
        }
        break
      case 'number':
        filterComponent = ({ textFieldProps, setFilters, filters }: IFilterProps) =>
          <TextFilter {...textFieldProps}
            type='number'
            value={filters[fieldKey]}
            onClear={() => {
              setFilters((f) => {
                const newFilter = { ...f }
                delete newFilter[fieldKey]
                return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
              })
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              blurFilterObj.newKeyVal(fieldKey, e.currentTarget.value)
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value
                if (value) {
                  setFilters((f) => {
                    const nFilt = ({ ...f, [fieldKey]: value })
                    return smartMergeWithBlur(nFilt, blurFilterObj, fieldKey)
                  })
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[fieldKey]
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                  })
                }
              } else {
                blurFilterObj.newKeyVal(fieldKey, e.currentTarget.value)
              }
            }}
            onBlur={(e: any) => {
              blurFilterObj.newKeyVal(fieldKey, e.target.value)
            }}
          />
        break
      case 'customfieldnodecount':
        filterComponent = ({ textFieldProps, setFilters, filters }: IFilterProps) =>
          <TextFilter {...textFieldProps}
            type='number'
            value={filters[fieldKey]}
            onClear={() => {
              setFilters((f) => {
                const newFilter = { ...f }
                delete newFilter[`${fieldKey}`]
                return newFilter
              })
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                const value = e.currentTarget.value
                if (value) {
                  setFilters((f) => ({ ...f, [`${fieldKey}`]: value }))
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[`${fieldKey}`]
                    return newFilter
                  })
                }
              }
            }}
          />
        break
      case 'time':
        filterComponent = ({ filters, setFilters }: IFilterProps) => {
          return (<div style={{ position: 'relative' }}>
            <DatePicker
              variant='time'
              style={{ position: 'absolute', right: 'auto', left: 'auto', top: 'auto', zIndex: 1 }}
              timeInterval={30}
              timeFormat={24}
              onChange={(value: any) => {
                if (value) {
                  setFilters((f) => {
                    const newFilter = { ...f, [fieldKey]: moment(value).format('HH:mm') };
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey);
                  })
                } else {
                  setFilters((f) => {
                    const newFilter = { ...f }
                    delete newFilter[fieldKey]
                    return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                  })
                }
              }}
            >
              {({ open, setOpen }) => {
                return <TextFilter
                  id=''
                  readOnly
                  onClick={() => {
                    setOpen(() => !open)
                  }}
                  onClear={() => {
                    setOpen(false)
                    setFilters(f => {
                      const newFilter = { ...f }
                      delete newFilter[`${fieldKey}`]
                      return smartMergeWithBlur(newFilter, blurFilterObj, fieldKey)
                    })
                  }}
                  value={filters[fieldKey]}
                />

              }}
            </DatePicker>

          </div>)
        }
        break
    }
  }
  
  function smartMergeWithBlur(filterObj: object, blurObjFilt: IBlurFilter, curKey: string) {
    let filterObjLocal = {...filterObj}
    let blurObjLocal = {...blurObjFilt.value}
    const filtKeys = Object.keys(filterObjLocal)
    const blurKeys = Object.keys(blurObjLocal)
    let retFilter = {}
    if (curKey) {
      if(filtKeys.indexOf(curKey)===-1) {
        if(blurKeys.indexOf(curKey)!==-1) {
          delete blurObjLocal[curKey]
        }
      } else {
         blurObjLocal[curKey] = filterObjLocal[curKey]
      }
    }
    Object.assign(retFilter, filterObjLocal)
    Object.assign(retFilter, blurObjLocal)
    // console.log("retFilter-!", retFilter)
    blurObjFilt.setBlurFilters(retFilter)
    return retFilter
  }
  return filterComponent
}

export const transformMongoListViewToColumns = (
  mColumns: Record<string, IMongoField>,
  moduleKey: string,
  cellCallbackMapping: Record<string, Function> = {},
  rowIdentifier?: string
): IListViewColumn[] => {
  var blurFiltersObject: IBlurFilter = {
    value: {},
    setBlurFilters: function (value: object) {
        this.value = value;
        // console.log("observer setBlurFilters called!", this.value)
    },
    newKeyVal: function(fieldKey: string, newVal: object) {
      let valCopy = {...this.value}
      valCopy[fieldKey] = ''
      if (newVal) {
        valCopy[fieldKey] = newVal
      }
      this.setBlurFilters(valCopy)
    }
  }
  const BlurActivatedTMLVTC = () => {
    return (
      Object.keys(mColumns).map((fieldKey) => {
        const { label, permission, searchable, sortable, editable, fieldType, customField, tooltipLabel } = mColumns[fieldKey]
        const transformedColumn: IListViewColumn = {
          accessor: fieldKey,
          Header: label,
          infoTip: tooltipLabel || label,
          isVisible: permission,
          isFilterable: searchable,
          isSortable: sortable,
          isEditable: editable,
          minWidth :150
        }
        if (fieldType === 'date') {
          transformedColumn.width = 200
        }
    
        if (fieldType === 'datetime') {
          transformedColumn.width = 250
        }
    
        if (editable && (EDITABLE_CELL_MAPPING?.[moduleKey]?.default || EDITABLE_CELL_MAPPING?.[moduleKey]?.[fieldKey])) {
    
          transformedColumn.EditableCell = EDITABLE_CELL_MAPPING?.[moduleKey]?.[fieldKey] || EDITABLE_CELL_MAPPING?.[moduleKey]?.default
          if (customField && fieldType === "dropdown") {
            transformedColumn.EditableCell = EDITABLE_CELL_MAPPING?.[moduleKey]?.customDropdown
          }
    
        }
    
        if (cellCallbackMapping[fieldKey]) {
            transformedColumn.cellCallback = cellCallbackMapping[fieldKey]
        }
    
    
        if (CELL_MAPPING?.[moduleKey]?.[fieldKey]) {
          transformedColumn.Cell = CELL_MAPPING[moduleKey][fieldKey]
        } else if (customField) {
          if (fieldType === 'multiselect' || fieldType === 'multiSelect') {
            transformedColumn.Cell = ({ value }) => <div
              style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              title={value}>{value}</div>
          } else if (fieldType === 'file') {
            transformedColumn.Cell = React.memo(({ value, row }) => {
              const [url, setUrl] = React.useState<string>()
    
              return <CfFile
                value={value && String(value)}
                id={row.original[rowIdentifier || 'id']}
                moduleKey={moduleKey}
                field={fieldKey}
                url={url}
                onFetchUrl={(u) => setUrl(u)}
              />
            }, (p, n) => p.value === n.value)
          } else {
            transformedColumn.Cell = CELL_MAPPING[moduleKey].default
          }
        } else if (CELL_MAPPING?.[moduleKey]?.default) {
          transformedColumn.Cell = CELL_MAPPING[moduleKey].default
        }
        const filterComponent = getFilterComponent(moduleKey, fieldKey, fieldType, mColumns[fieldKey], blurFiltersObject)
        if (filterComponent) {
          if (customField) {
            transformedColumn.isFilterable = true
          }
          transformedColumn.Filter = filterComponent as React.FC<IFilterProps>
        }
        return transformedColumn
      })    
    );
  }
 
  return BlurActivatedTMLVTC()
}


export const renderCustomFields = (
  { type, value }: ICustomField,
  structure: IMongoField,
  clientProperties: Record<string, IClientProperty>): string | undefined | ReactNode | JSX.Element => {

  switch (type) {
    case 'datetime':
      const timezone = clientProperties?.TIMEZONE?.propertyValue
      const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
      return timezone && format ? moment.utc(value).tz(timezone).format(format + ' h:mm A') : value

    case 'date':
      return clientProperties?.DATEFORMAT ? moment(value).format(clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()) : ''

    case 'time':
      return moment(value).format('hh:mm A')
      // return value
    case 'checkbox':
    case 'radio':
      return  structure?.dropdownValues?  structure?.dropdownValues?.[value || '']: value
    default:
      return value
  }
}

export const renderCustomFormFields = (
  { type, value }: ICustomField,
  structure: IMongoField,
  clientProperties: Record<string, IClientProperty>): string | undefined | ReactNode | JSX.Element => {

  switch (type) {
    case 'datetime':
      const timezone = clientProperties?.TIMEZONE?.propertyValue
      const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
      return timezone && format ? moment.utc(Number(value)).tz(timezone).format(format + ' h:mm A') : value

    case 'date':
      return clientProperties?.DATEFORMAT ? moment(Number(value)).format(clientProperties?.DATEFORMAT?.propertyValue.toUpperCase()) : ''

    case 'time':
      // return moment(value).format('hh:mm A')
      return value
    case 'checkbox':
    case 'radio':
      return  structure?.dropdownValues?  structure?.dropdownValues?.[value || '']: value
    default:
      return value
  }
}

