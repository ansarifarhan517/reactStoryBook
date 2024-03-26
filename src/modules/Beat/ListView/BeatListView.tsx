import React, { useEffect, useState } from 'react'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
// import { useTypedSelector } from '../../../utils/redux/rootReducer'
import {
  BreadCrumb, Box, ListView,
  IListViewColumn, IListViewRow,
  ISelectedRows,
  IFetchDataOptions,
  IconButton,
  IconDropdown
} from 'ui-library'
import { withReactOptimized } from '../../../utils/components/withReact'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import { StyledGrid } from '../../Checkpoints/CheckpointsListView/CheckpointsListViewStyledComponent'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'

export interface IBeatListData {
  results: IListViewRow[]
  totalCount: number
}
interface ILoadingObject {
  loading: boolean
  inputVal: boolean
}
const BeatListView = () => {
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [structure, setStructure] = useState<IMongoListViewStructure>({ columns: {}, buttons: {} })
  const [loadingObject, setLoading] = useState<ILoadingObject>({ loading: true, inputVal: false })
  const [isEditMode, setEditMode] = useState<boolean>(false)
  const [listData, setListData] = useState<IBeatListData>()
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [calendarData, setCalendarData] = useState({});
  const [calendarDataDetail, setCalendarDataDetail] = useState({});
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.beat)
  // const pageLabels = useTypedSelector(state => state.pageLabels.beatPlan)
  const columnsSelector = structure?.columns;
  const actionBarButtons = structure?.buttons;
  // const rowsSelector = listData?.results || dummyResult;
  // const totalRowsSelector = listData?.totalCount
  const inputVal = loadingObject.inputVal

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'Beats', label: dynamicLabels.beats || "Beats", disabled: true },
    { id: 'Beat Plans', label: dynamicLabels.beatPlans || "Beat Plans", disabled: true },
  ], [dynamicLabels])

  const fetchStructure = React.useCallback(async () => {
    try {
      const { data } = await axios.get(apiMappings.beat.listView.structure)
      setStructure(data)
      console.log(data, "structure")
      // dispatch({type: '@@driverListView/SET_STRUCTURE', payload: data})
    } catch (e) {
      console.log(e);
    }

  }, [])

  function createAssociativeArrayWithString(array1, array2) {
    const obj = {};
    for (let i = 0; i < array1.length; i++) {
      if (obj[array1[i]] && array2[i] !== undefined) {
        obj[array1[i]] = obj[array1[i]].toString() + ', ' + array2[i].toString();
      } else if (array2[i] !== undefined) {
        obj[array1[i]] = array2[i];
      }
    }
    return obj;
  }
  const getListData = React.useCallback(async (payload) => {
    try {
      const { data } = await axios.get(apiMappings.beat.listView.data, { params: payload })
      let listdata: { [key: string]: any }[] = [];
      if (data.results.length > 0) {

        const newCalendarData = {};
        const newCalendarDataDetail = {};

        data.results.forEach(value => {
          const beatData = {};
          beatData[value.beatId] = {};

          const beatData2 = {};
          beatData2[value.beatId] = {};

          const dayOfWeekArray = value.dayOfWeek?.toLowerCase().split(',');
          const customerIdsArray = value.customerIds?.split(',');
          const outletNameArray = value.outletName?.split(',');
          const visitIdArray = value.visitIds?.split(',');

          Object.assign(beatData[value.beatId], createAssociativeArrayWithString(dayOfWeekArray, outletNameArray));
          Object.assign(beatData2[value.beatId], createAssociativeArrayWithString(dayOfWeekArray, visitIdArray));

          Object.assign(newCalendarData, beatData);
          Object.assign(newCalendarDataDetail, beatData2);

          // Pushing merged object to listdata
          listdata.push({
            ...value, // Copy all properties from value
            ...newCalendarData[value.beatId] // Merge specific properties from newCalendarData
          });
          console.log(listdata, "listdata")
        });

        setCalendarData(newCalendarData);
        setCalendarDataDetail(newCalendarDataDetail);

        setListData({ results: listdata, totalCount: data?.totalCount, });
      }
      setLoading({ loading: false, inputVal: false })
    } catch (error) {
      console.log(error)
      setLoading({ loading: false, inputVal: false })

    }
  }, [])

  //---------------------------------->Watchers
  useEffect(() => {
    fetchStructure()

  }, [])


  useEffect(() => {
    const daysOfweek = columnsSelector?.['weeklyPlan']?.['childNodes']
    const mongoStructure = { ...columnsSelector, ...daysOfweek }
    if (mongoStructure['weeklyPlan']) {
      delete mongoStructure['weeklyPlan']
    }
    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        'beat',
        undefined,
        'beatid')
      console.log(newColumns, "columns")
      setColumns(newColumns)
    }

  }, [columnsSelector])
  //---------------------------------> Cell Callbacks 

  //---------------------------------> Inline Edit 
  const handleSaveRows = async () => {

    console.log("handleSaveRows")
  }

  const handleCancelRows = React.useCallback(() => {
    setEditMode(false)
    setSelectedRows({})
    console.log("handleCancelRows")
  }, [])


  //-------------------------------------> List View Callbacks 
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    if (!inputVal || sortOptions?.sortOrder) {
      // sortOptions = handleCustomColumnSort(sortOptions)
      // setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })

      const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
      }
      getListData(payload)
    }
  }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case 'delete':
        // setShowDeletionConfirmation(true)
        break

      case 'update':
        setEditMode(true)
        break

      case 'more':
        break

    }
  }, [])
  return (

    // <div className="mainWrapper logiGuide materialDesignUIrevamp_tablewrapper" ng-controller="beatHeaderCtrl">
    //   <div className="main-controller-wrapper main-controller-wrapper-beat">

    <div className="page-wrapper">
      <Box
        display="flex"
        mt="64px"
        flexDirection="column"
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
        px="15px"
        pb="15px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          py="15px"
        >
          {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
          <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />

        </Box>

        <StyledGrid
          container
          spacing={15}
          style={{ boxShadow: "0 2px 20px -10px #000" }}
        >
          {columns.length > 0 &&
            <ListView
              rowIdentifier='beatId'
              style={{ height: '100%', overflow: 'visible' }}
              columns={columns}
              data={listData?.results ?? []}
              onFetchData={handleFetchData}
              loading={loadingObject.loading}
              hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
              hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
              className="listView"
              totalRows={listData?.totalCount}
              onRowSelect={onRowSelect}
            // onSortChange={onSortChange}
            // onSaveColumnPreferences={onSaveColumnPreferences}

            // hideRefresh={}
            // isEditMode={isEditMode}
            // onRowEditClick={(row) => {
            //   sendGA('Navigation','Driver List View Button Click - Edit Driver')
            //   hybridRouteTo(`updatedriver/?driverid=${row.driverId}`)
            // }}
            // filters = {filters}
            // sorts = {sort}
            // onFilterChange={handleFilterChange}
            >
              {{
                ActionBar: (
                  <Box display='flex' horizontalSpacing='10px'>
                     {isEditMode ?
                          <>
                            <div title={dynamicLabels.save}>
                              <IconButton intent='table' id='listView-actionBar-save' iconVariant='icomoon-save' onClick={handleSaveRows} disabled={!Object.keys(selectedRows).length}>{dynamicLabels.save}</IconButton>
                            </div>
                            <div title={dynamicLabels.cancel}>
                              <IconButton intent='table' id='listView-actionBar-cancel' iconVariant='icomoon-close' onClick={handleCancelRows} disabled={!Object.keys(selectedRows).length}>{dynamicLabels.cancel}</IconButton>
                            </div>
                          </>
                          :
                           Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                              (buttonKey !== 'InlineEdit' && <div title={actionBarButtons[buttonKey].label}>
                                <IconButton
                                  key={buttonKey}
                                  disabled={!Object.keys(selectedRows).length}
                                  intent='table'
                                  iconVariant={iconsMapping[buttonKey]}
                                  id={`listView-actionBar-${buttonKey}`}
                                  onClick={() => {
                                    handleActionBarButtonClick(buttonKey)
                                  }}
                                // title={actionBarButtons[buttonKey].label}
                                >
                                  {actionBarButtons[buttonKey].label}
                                </IconButton>
                              </div>)
                          )
                     }
                  </Box>
                )
              }}

            </ListView>}

        </StyledGrid>
      </Box>

    </div>
    //   </div>
    // </div>

  )
}

export default withReactOptimized(BeatListView)