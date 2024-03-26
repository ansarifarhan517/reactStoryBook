import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ColumnInstance } from 'react-table'
import {
  Card, Box, ListView, IListViewColumn, IFetchDataOptions,
  withPopup, IconButton, Tooltip,
  withToastProvider, useToast, ISelectedRows, Grid, IListViewRow, ISortOptions
} from 'ui-library'

import { WebHookListViewActions } from './WebHookListView.actions'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import withRedux from '../../../utils/redux/withRedux'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { withThemeProvider } from '../../../utils/theme'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import moment from 'moment-timezone'
import FilterSection from './Components/FilterSection'
import { sendGA } from '../../../utils/ga'
import { IModuleTypes, IEventTypes, IFilterSection } from './WebHookListView.models'
import WebHookHistoryPage from './Components/WebHookHistoryPage'
import useClientProperties from '../../common/ClientProperties/useClientProperties'
import { StyledGrid } from './WebHookListView.styled'
import { getQueryParams } from '../../../utils/hybridRouting';
import { IStateService } from 'angular-ui-router';
import { SortingRule } from 'react-table'


interface IWebHookListViewProps {
  ngStateRouter: IStateService
}

/** By default: Dont Reload, Or notify change or Inherit existing Parameters from URL */
const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }

const WebHookListView = ({ ngStateRouter }: IWebHookListViewProps) => {
  /** General Hooks */

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.webhook_search)
  const toast = useToast()

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<WebHookListViewActions>>()
  const structure = useTypedSelector(state => state.settings_webhookHistory.listView.structure)
  const columnsSelector = useTypedSelector(state => state.settings_webhookHistory.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.settings_webhookHistory.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.settings_webhookHistory.listView.data.totalCount)
  const actionBarButtons = useTypedSelector(state => state.settings_webhookHistory.listView.structure.buttons)
  const loading = useTypedSelector(state => state.settings_webhookHistory.listView.loading.listView)
  const moduleType = useTypedSelector(state => state.settings_webhookHistory.listView.modulesTypes)
  const eventTypes = useTypedSelector(state => state.settings_webhookHistory.listView.eventTypes)
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT'])
  const statusType = useTypedSelector(state=> state.settings_webhookHistory.listView.status)
  const moreResultExists = useTypedSelector(state => state.settings_webhookHistory.listView.paginationFl.moreResultExists)
  const disableNext = useTypedSelector(state => state.settings_webhookHistory.listView.paginationFl.disableNext)
  const dataType =useTypedSelector(state => state.settings_webhookHistory.listView.paginationFl.dataType)
  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
  const [isDependencyLoaded, setIsDependencyLoaded] = useState<boolean>(false)
  const [isWebhookValid, setWebhookValid] = useState<boolean>(false)

  const [filterSectionPayload, setFilterSectionPayload] = useState({
    startDateFilter: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 0, 0, 0),
    endDateFilter: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 0),
    module: undefined,
    eventType: undefined
  })

  const [showHistoryPage, setShowHistoryPage] = useState(false)
  const [historyPageData, setHistoryPageDate] = useState({
    attempts: undefined,
    history: undefined
  })

  // const [module, setModule] = useState('ALL')

  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()

  const [filterSection, setFilterSection] = React.useState<IFilterSection>({
    moduleOptions: moduleType,
    eventOptions: eventTypes['ALL'],
    moduleValue: undefined,
    eventValue: undefined,
    eventDate: [new Date(), new Date()],
  })

  /** Watchers */
  useEffect(() => {
    setShowColumnShimmer(true)
    dispatch({ type: '@@webhooklistview/FETCH_STRUCTURE' })
    dispatch({
      type: '@@webhooklistview/SET_CURRENT_MODULE',
      payload: 'ALL'
    })
  }, [])

  useEffect(() => {

    const mongoStructure = columnsSelector

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'settings_webhookHistory', cellCallbackMapping)
      setColumns(newColumns)
    }

    const firstEntry: any = Object.values(columnsSelector)?.[0]

    if (firstEntry?.id) {
      setTimeout(() => {
        setShowColumnShimmer(false)
      }, 0)
    }

  }, [columnsSelector])



  const cellCallbackMapping = {
    triggerEvents: () => { }
  }

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    // if(isDependencyLoaded) {
      setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
  
      const { module, eventType: eventTypeName, startDateFilter, endDateFilter } = filterSectionPayload
      const sDate = new Date(startDateFilter)
      const eDate = new Date(endDateFilter)
      let moduleName:any = module === 'ALL' ? undefined : module;
  
      sDate.setDate(sDate.getDate() - 1)
  
      sDate.setHours(23)
      sDate.setMinutes(59)
      eDate.setHours(24)
      eDate.setMinutes(0)
  
      const startDate = moment.tz(sDate, clientProperties?.TIMEZONE?.propertyValue).utc().format("YYYY-MM-DD+HH:mm:ss");
      const endDate = moment.tz(eDate, clientProperties?.TIMEZONE?.propertyValue).utc().format("YYYY-MM-DD+HH:mm:ss");
      const diff = moment(eDate).diff(moment(sDate), 'days') > 30
      // logic for splitting notificationType value and module
      let searchBy = filterOptions?.searchBy?.split('#');
      let searchTextArray = filterOptions?.searchText?.split('#');
      let getModuleType: any
      let searchTextName:string = ''
      const eventTypeArray = eventTypes?.ALL
  
      if(searchBy && searchTextArray) {
        
        let notificationType: number = searchBy?.indexOf('notificationType')
        
        if((notificationType !== -1) && searchTextArray && searchTextArray[notificationType]) {
          getModuleType = eventTypeArray?.find((m:any) => searchTextArray && m.clientRefMasterCd+'_'+m.clientRefMasterType === searchTextArray[notificationType] )
        }
          searchTextArray[notificationType] = getModuleType?.clientRefMasterCd
          searchTextName= searchTextArray?.join('#')
          moduleName = getModuleType?.clientRefMasterType.replace('EVENT_TYPE_','')  
      } 
      if (!diff){

        dispatch({
          type: '@@webhooklistview/SET_LOADING',
          payload: { listView: true }
        })
      dispatch({
        type: '@@webhooklistview/FETCH_DATA',
        payload: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          searchBy: filterOptions?.searchBy,
          searchText: searchTextName ? searchTextName : filterOptions?.searchText,
          sortBy: sortOptions?.sortBy,
          sortOrder: sortOptions?.sortOrder,
          isLoading: true,
          endDateFilter: endDate,
          startDateFilter: startDate,
          module: moduleName ? moduleName.toLowerCase() : undefined,
          eventType: eventTypeName
    
        }
      })
     }else{
      toast.add(dynamicLabels.dateRange31DayValidationMsgforwebhook ? dynamicLabels.dateRange31DayValidationMsgforwebhook :"Selected date range should cover less than or equal to 31 days to view webhook history." , 'warning', false);
     }
    

  }, [filterSectionPayload])



  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])


  const pushQueryParams = (row: IListViewRow) => {

    // This function pushes data in our url, but as we have changed our logic to avoid re-writing of same code,
    // I have converted into common code that can be used anywhere 

    let existingParams = getQueryParams()
        let urlParamsPayload = {
          module: 'webhooks',
          webhook: row.id,
          moduleType: existingParams?.moduleType,
          eventType: existingParams?.eventType,
          startDate: existingParams?.startDate,
          endDate: existingParams?.endDate,
          ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
          ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {}),
         
        }
        setTimeout(() => {
          ngStateRouter.go('admin', urlParamsPayload, ngStateRouterOptions)
        }, 2000)
  }
  


  const handleWebHookHistory = async (row: IListViewRow) => {
     

    sendGA('ListView ActionBar','WebhookActivity - Update Webhook')

  // If data Type is receives as S3 don't fetch data from MongoDB, We'll Fetch by S3.
   if(dataType == 'S3'){
    setShowHistoryPage(true)
    setWebhookValid(false)
    setHistoryPageDate({
      history: row,
      attempts: row,
    })

    pushQueryParams(row);
  }else{
    try {
      const { data: data, status } = await axios.get(apiMappings.webHookListView.listView.webHookDetail, { params: { mongoId: row.id } })

      if (status === 200) {
        const { data: attempsData } = await axios.get(apiMappings.webHookListView.listView.attemptsDetails, { params: { mongoId: row.id } })
        setShowHistoryPage(true)

        setWebhookValid(true);
        setHistoryPageDate({
          history: data.data,
          attempts: attempsData.data,
        })

        // push in url
        pushQueryParams(row);

        
      }

    } catch (e) {
      console.log(e)
    }
  }

  }



  const getWebHookHistory = async (rowId: string) => {
    try {
      const { data: data, status } = await axios.get(apiMappings.webHookListView.listView.webHookDetail, { params: { mongoId: rowId } })

      if (status === 200) {
        const { data: attempsData } = await axios.get(apiMappings.webHookListView.listView.attemptsDetails, { params: { mongoId: rowId} })
        setShowHistoryPage(true)
        setHistoryPageDate({
          history: data.data,
          attempts: attempsData.data,
        })
        
      }

    } catch (e) {
      console.log(e)
    }

  }

  const handleActionBarButtonClick = (id: string) => {
    switch (id) {
      case 'retry':
        handleRetry()
        break
    }
  }

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {

    sendGA('Column Preference Action','WebhookActivity - Apply & Save column preferences')

    const columns = { ...columnsSelector }

    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columns
    }

    try {
      const { data: { message } } = await axios.put(apiMappings.webHookListView.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }


  }, [columnsSelector])

  const handleSearch = (moduleType: IModuleTypes | undefined, eventType: IEventTypes | undefined, eventDate: [Date, Date]) => {

    sendGA('ListView ActionBar','WebhookActivity - Search')


    dispatch({
      type: '@@webhooklistview/SET_CURRENT_MODULE',
      payload: moduleType ? moduleType?.clientRefMasterCd?.toUpperCase() : 'ALL'
    })
   
    const startDate = eventDate?.[0]
    const endDate = eventDate?.[1]
    let moduleName = undefined

    if(!!eventType && !moduleType && eventType.clientRefMasterCd === 'DELIVEREDNOTIFICATION') {
      moduleName = eventType?.clientRefMasterType.replace('EVENT_TYPE_','').toLowerCase()
    }

    let temp:any = {
      startDateFilter: startDate,
      endDateFilter: endDate,
    }
    temp = !!moduleType ? {
      ...temp,
      module: moduleType?.clientRefMasterCd
    } : {
      module: moduleName,
      ...temp
    }

    temp = !!eventType ? {
      ...temp,
      eventType: eventType?.clientRefMasterCd
    }: {
      ...temp
    }

    setFilterSectionPayload({
      ...temp
    })

    let existingParams = getQueryParams()

    const urlParamsPayload = {
      module: 'webhooks',
      moduleType: !!moduleType && moduleType.clientRefMasterCd,
      eventType: !!eventType && eventType.clientRefMasterCd,
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
      webhook: existingParams.webhook,
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }
    setTimeout(() => {
      ngStateRouter.go('admin', urlParamsPayload, ngStateRouterOptions)
    }, 2000)

    

  }

  useEffect(() => {
    if(!isDependencyLoaded) {
      setFilterSection({
        ...filterSection,
        moduleOptions: moduleType,
        eventOptions: eventTypes['ALL'],
        eventDate: [new Date(), new Date()],
      })
      handleQueryParams()
      setIsDependencyLoaded(Object.keys(eventTypes).length !== 0 && statusType.length !== 0)
    }
  }, [moduleType, eventTypes, statusType])

  useEffect(() => {
    // filter sections
    handleFetchData(fetchOptions)

  }, [filterSectionPayload])

  const handleModuleChange = (value: string | undefined) => {

    const moduleName = moduleType.find((m) => m.clientRefMasterCd.toLowerCase() === value)
    moduleName ? setFilterSection({
      ...filterSection,
      moduleValue: moduleName && moduleName?.clientRefMasterCd,
      eventOptions: eventTypes[moduleName.clientRefMasterCd.toUpperCase()],
      eventValue: undefined,
    }) : setFilterSection({
      ...filterSection,
      eventValue: undefined,
      eventOptions: eventTypes['ALL'],
    })

    // moduleName ? setModule(moduleName.clientRefMasterCd.toUpperCase()) : setModule('ALL')
  }



  const onCancel = (toastFlag?: boolean) => {
    toastFlag && toast.add('Success', 'check-round', false)
   
    let existingParams = getQueryParams()

    let urlParamsPayload = {
      module: 'webhooks',
      moduleType: existingParams?.moduleType,
      eventType: existingParams?.eventType,
      startDate: existingParams?.startDate,
      endDate: existingParams?.endDate,
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {}),
      
    }

    setTimeout(() => {
      ngStateRouter.go('admin', urlParamsPayload, ngStateRouterOptions)
    }, 2000)

    handleQueryParams(urlParamsPayload)
    setShowHistoryPage(false)
    // history.back()
  }

  const handleRetry = async () => {

    sendGA('ListView ActionBar','WebhookActivity - Retry-record')

    const payload = Object.values(selectedRows)?.map((obj) => {
      if (obj?.mongoId) {
        return obj
      } else {
        return {
          ...obj,
          mongoId: obj.id,
          noOfAttempts: obj.retryAttempts
        }
      }
    })

    try {
      const { data: data } = await axios.post(apiMappings.webHookListView.listView.retry, [...payload])
      if (data.status === 200) {
        toast.add('Success', 'check-round', false)
        handleFetchData(fetchOptions)
      }
    } catch (errorMessage) {
      console.log('Failed to try webhook ', errorMessage)
    }
  }

  // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
  const handleQueryParams = (params?: Record<string, string> ) => {
  
    const filterData: Record<string, string> = !params ? getQueryParams() : params;

  
    let flag = true;

    Object.keys(filterData).forEach((m) => {
      if(filterData[m] === '') {
        flag = false
      }
    })
    if(flag) {
        /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split('#@#')
    let sortOrder = filterData?.sortOrder?.split('#@#')

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === 'DESC'
      }
      sort.push(temp)
    });
    sort && setSort(sort)

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })

    setFilters(temp)

    let moduleName = filterData?.moduleType !== 'false' ? filterData?.moduleType?.toUpperCase() : 'ALL'

    moduleName && dispatch({
      type: '@@webhooklistview/SET_CURRENT_MODULE',
      payload: moduleName
    })

    let eventName = filterData?.eventType !== 'false' ? filterData?.eventType : undefined;

    let startDate = filterData?.startDate ? new Date(parseInt(filterData?.startDate)) : undefined;
    let endDate = filterData?.endDate ? new Date(parseInt(filterData?.endDate)) : undefined;

    setFilterSection({
      moduleOptions: moduleType,
      eventOptions: moduleName ? eventTypes[moduleName?.toUpperCase()] : eventTypes['ALL'],
      moduleValue: moduleName || undefined,
      eventValue: eventName || undefined,
      eventDate: (startDate && endDate) ? [startDate, endDate] : [new Date(), new Date()],
    })

    let temp2:any = {
      startDateFilter: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 0, 0, 0),
      endDateFilter: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 0),
    }
    
    temp2 = moduleName !== 'false' ? {
      ...temp2,
      module : moduleName
    } : {
      ...temp2
    }

    temp2 = eventName !== 'false' ? {
      eventType: eventName,
      ...temp2
    } : {
      ...temp2
    }

    temp2 = (startDate && endDate) ? {
      ...temp2,
      startDateFilter: startDate,
      endDateFilter: endDate
    } : {
      ...temp2
    } 

    setFilterSectionPayload({
      ...temp2
    })
    
    let webhookId = filterData?.webhook;
    webhookId && getWebHookHistory(webhookId)
    }
    
  }


  /********  FILTER CHANGE **************/
  // const handleFilterChange = (combinedFilters: IFilterOptions) => {

  //   let existingParams = getQueryParams()

  //   /** Do not push to history when there is no change. */
  //   if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
  //     return
  //   }

  //   const newParams = {
  //     module: 'webhooks',
  //     ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
  //     ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {}),
  //     moduleType: existingParams?.moduleType || undefined,
  //     eventType: existingParams?.eventType || undefined,
  //     webhook: existingParams.webhook,
  //     startDate: existingParams.startDate ? existingParams.startDate: new Date().getTime(),
  //     endDate: existingParams.endDate ? existingParams.endDate: new Date().getTime(),
  //   }

  //   setTimeout(() => {
  //     ngStateRouter.go('admin', newParams, ngStateRouterOptions)
  //   }, 2000)
  // }


  /********  SORT  CHANGE **************/
  const handleSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      module: 'webhooks',
      moduleType: existingParams.moduleType,
      eventType: existingParams.eventType,
      startDate: existingParams.startDate,
      endDate: existingParams.endDate,
      webhook: existingParams.webhook,
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('admin', newParams, ngStateRouterOptions)
    }, 2000)
  }

  const buttonKeys = React.useMemo(() => Object.keys(actionBarButtons),[actionBarButtons])

  return (
    <div>
      <div id='toast-inject-here' style={{ textAlign: 'center' }}></div>
      <>
        {!showHistoryPage ?
          <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh', marginRight: '2px' }}>
            {isDependencyLoaded && <FilterSection onSearch={handleSearch} onModuleChange={handleModuleChange} {...filterSection} loading={loading}/>}
            {/* LIST VIEW CONTAINER */}
            <StyledGrid
              container
              spacing={5}
              style={{ boxShadow: '0 2px 20px -10px #00    0' }}
            >
              <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                <Card id='WebHookListViewCard' style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, padding:0 }}>
                  {isDependencyLoaded && <ListView
                      rowIdentifier='id'
                      style={{ height: '100%', overflow: 'hidden' }}
                      columns={columns}
                      data={rowsSelector}
                      onFetchData={handleFetchData}
                      hasRowSelectionWithEdit={'listview' === 'listview'}
                      onRowSelect={onRowSelect}
                      onSaveColumnPreferences={onSaveColumnPreferences}
                      totalRows={totalRowsSelector}
                      loading={showColumnShimmer || loading}
                      hideRefresh={showColumnShimmer || loading}
                      isColumnLoading={showColumnShimmer}
                      hideColumnSettings={false}
                      moreResultsExists={moreResultExists}
                      BEDependentPagination={true}
                      disableNext={disableNext}
                      onRowEditClick={(row) => {
                        handleWebHookHistory(row);
                      }}
                      permanentColumns={{
                        notificationType: true,
                        status: true,
                        responseMessage: true
                      }}
                      onPageChange={() => {
                        sendGA('ListView ActionBar','WebhookActivity - Select Records Per Page')
                      }}
                      onShowMoreColumns={() => {
                        sendGA('ListView ActionBar','WebhookActivity - Show More Column')
                      }}
                      onApply={() => {
                        sendGA('ListView ActionBar','WebhookActivity - Apply column preferences')
                      }}
                      //onFilterChange={handleFilterChange} 
                      onSortChange={handleSortChange}
                      filters={filters}
                      sorts={sort}
                    >
                      {{
                        ActionBar:
                          <Box display='flex' horizontalSpacing='10px' p='15px'>

                            {buttonKeys.map(buttonKey => actionBarButtons[buttonKey].permission &&
                              (
                                <Tooltip message={buttonKey === 'retry' ? dynamicLabels.webhook_retry : `${actionBarButtons[buttonKey].label}`}
                                  hover
                                  messagePlacement={'start'}
                                >
                                  <div>
                                    <IconButton
                                      key={buttonKey}
                                      disabled={!Object.keys(selectedRows).length}
                                      intent='table'
                                      iconVariant={buttonKey === 'retry' ? 'reload' : iconsMapping[buttonKey]}
                                      id={`listView-actionBar-${buttonKey}`}
                                      onClick={() => {
                                        handleActionBarButtonClick(buttonKey)
                                      }}
                                    >
                                      {actionBarButtons[buttonKey].label}
                                    </IconButton>
                                  </div></Tooltip>)
                              )
                            }
                          </Box>
                      }
                      }
                    </ListView>}

                </Card>
              </Grid>
            </StyledGrid>
          </Box>
          :
          <div>
            {historyPageData.history && historyPageData.attempts && <WebHookHistoryPage data={historyPageData} handleCancel={onCancel} isWebhookValid = {isWebhookValid}/>}
          </div>
        }

      </>
    </div>
  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(WebHookListView)), 'toast-inject-here'))
