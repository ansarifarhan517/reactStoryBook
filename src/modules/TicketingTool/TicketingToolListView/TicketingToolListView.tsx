import React, { Dispatch, useEffect, useState } from 'react';
import { withThemeProvider } from '../../../utils/theme';
import {
  withPopup,
  withToastProvider,
  ListView, IFetchDataOptions,
  useToast,
  IFilterOptions,
  IListViewColumn,
  Grid,
  Box,
  BreadCrumb,
  ButtonGroup,
  IconButton,
  Tooltip,
  ISortOptions
} from "ui-library";
import { SortingRule } from 'react-table'
import { useDispatch } from 'react-redux';
import withRedux from '../../../utils/redux/withRedux';
import { TicketingToolListViewActions } from './TicketingToolListView.actions';

import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import { ColumnInstance } from 'react-table';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import WhiteCard from '../../../utils/layouts/WhiteCard';
import { getQueryParams, hybridRouteTo } from '../../../utils/hybridRouting';
import { ReactTooltipCustom as ReactTooltip } from "../../../utils/layouts/ReactTooltipCustom";
import FileSaver from 'file-saver';
import AddTicketModal from '../TicketingToolAddModal/AddTicketModal';
import DownloadMessage from '../../../utils/components/DownloadMessage';

export interface IRowData {
  createdBy?:string,
  createdOn?: string, 
  id?: number,
  status?:string, 
subject?: string,
tracker?: string,
updatedOn?:string
}
const TicketingToolListView = (props: any) => {
  const { ngStateRouter } = props
  const viewMode = useTypedSelector(state=>state.ticketingTool.viewMode);
  const toast = useToast();
  const dispatch = useDispatch<Dispatch<TicketingToolListViewActions>>();
  const columnsSelector = useTypedSelector(state => state.ticketingTool.structure.columns);
  const rowsSelector = useTypedSelector(state => state.ticketingTool.data?.data?.results);
  const totalRows = useTypedSelector(state => state.ticketingTool.data?.data?.totalCount);
  const columnsLoading = useTypedSelector(state => state.ticketingTool.loading.columns);
  const dataLoading = useTypedSelector(state => state.ticketingTool.loading.listView);
  const structure = useTypedSelector((state) => state.ticketingTool.structure);
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [isAddTicketModal,setIsAddTicketModal] = useState(false);
  const [showDownloadSuccess,setShowDownloadSuccess] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>()
  const [sort, setSort] = useState<SortingRule<object>[]>()
  const clientData = useTypedSelector(state=>state.ticketingTool.clientData);
  const peers = useTypedSelector(state=>state.ticketingTool.peers);
  const ticketStatus = useTypedSelector(state => state.ticketingTool.ticketStatus);
  const selectedStatus = useTypedSelector(state=>state.ticketingTool.selectedStatus);
  const goToDetails= (row: IRowData) => {
    hybridRouteTo(`ticketingDetails?issueId=${row.id}&status=${row.status}&fromPage=${selectedStatus}`);
  };
  const cellCallbackMapping = {
    id: goToDetails
  };
  const ngStateRouterOptions = { notify: false, reload: false, inherit: false, location: true }
  useEffect(() => {
    handleQueryParams()
    dispatch({
      type: '@@ticketingToolListView/FETCH_STRUCTURE'
    })
    
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector;
    if (mongoStructure && Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(
        mongoStructure,
        "ticketingTool",
        cellCallbackMapping
      );
      setColumns(newColumns);
    }
  }, [columnsSelector]);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    if(filterOptions?.searchBy?.includes("subject")){
      filterOptions.searchText = filterOptions.searchText?.replaceAll(" ", "_");
    }
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    dispatch({
      type: '@@ticketingToolListView/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
      }
    })
  }, [])
  const handleFilterChange = (combinedFilters: IFilterOptions) => {

    let existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!combinedFilters.searchBy && !existingParams.searchBy) || (combinedFilters.searchBy === existingParams.searchBy && combinedFilters.searchText === existingParams.searchText)) {
      return
    }
    const newParams = {
      page: existingParams.page || "ALL",
      ...(existingParams.sortBy ? { sortBy: existingParams.sortBy, sortOrder: existingParams.sortOrder } : {}),
      ...(combinedFilters.searchBy ? { searchBy: combinedFilters.searchBy, searchText: combinedFilters.searchText } : {})
    }
    
      setTimeout(() => {
        ngStateRouter.go('ticketingTool', newParams, { notify: false, reload: false, inherit: false, location: true })
      }, 100)
    
  }

    // HANDLE QUERY PARAMS FOR HISTORY RENTENTION
    const handleQueryParams = () => {
      const filterData: Record<string, string> = getQueryParams();
  
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
  
      // let breadcrumb: tBreadcrumbState = filterData?.page as tBreadcrumbState
  
      // dispatch({
      //   type: '@@vehicleListView/SET_BREADCRUMB_STATE',
      //   payload: breadcrumb || 'All',
      // });
    }

  const onSortChange = (sortOptions: ISortOptions) => {
    const existingParams = getQueryParams()

    /** Do not push to history when there is no change. */
    if ((!sortOptions.sortBy && !existingParams.sortBy) || (sortOptions.sortBy === existingParams.sortBy && sortOptions.sortOrder === existingParams.sortOrder)) {
      return
    }

    /** Construct new set of Query Params */
    const newParams = {
      // page: breadcrumbState,
      ...(sortOptions.sortBy ? { sortBy: sortOptions.sortBy, sortOrder: sortOptions.sortOrder } : {}),
      ...(existingParams.searchBy ? { searchBy: existingParams.searchBy, searchText: existingParams.searchText } : {})
    }

    setTimeout(() => {
      ngStateRouter.go('ticketingTool', newParams, ngStateRouterOptions)
    }, 2000)
  }
  /** Cell Callbacks */
  const onSaveColumnPreferences = React.useCallback(
    async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
      let existingParams = getQueryParams()
      const columns = { ...columnsSelector };
      Object.keys(columns).forEach((columnKey) => {
        columns[columnKey].permission = !!visibleColumns[columnKey];
      });
      const pageName = viewMode == "FEATURE" ? "FEATURE" : existingParams.page?existingParams.page:'ALL';
      const params = {modelName:'TICKETING_TOOL',
                      pageName:'TICKETING_TOOL',
                      sectionName:`${pageName}_TICKETING_TOOL_LIST_VIEW`
      }
      const payload = {
        ...structure,
        columns,
      };
      try {
        const {
          data: { message },
        } = await axios.put(apiMappings.ticktingTool.listview.structure, payload,{params});
        message && toast.add(message, "check-round", false);
      } catch (error) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );


  const breadCrumbList = [
    { id: "HOME", label: "Tickets", disabled: true },
    { id: `${Object.keys(ticketStatus).length? ticketStatus[selectedStatus].id: "ALL"}`, label: `${Object.keys(ticketStatus).length? ticketStatus[selectedStatus].label + ' Tickets' : "All Tickets"}`, disabled: false }
  ];


  const handleDownloadReport = async () => {

    setShowDownloadSuccess(true)
    // setDownloadReportDisabled(true);
    // let payload = breadcrumbOptions[breadcrumbState]
    let filterOptions = fetchOptions.filterOptions
    let temp = {
      ...fetchOptions,
      searchBy: filterOptions?.searchBy,
      searchText: filterOptions?.searchText
    }
    delete temp.filterOptions

    let filter = {
      ...fetchOptions,
      searchBy: filterOptions?.searchBy,
      searchText: filterOptions?.searchText
    }
    delete temp.filterOptions
    const peerAuthorIds =  peers.map((value:any)=>{
      return value.id;
    })
    try {
      let projectData = {
        "projectId": clientData.project.id,
        "authorId": clientData.userId,
        "tracker": viewMode,
        "peerAuthorIds": peerAuthorIds,
        "sowProjectId": clientData.sowProject.id
      }
      const { data } = await axios.post(apiMappings.ticktingTool.listview.downloadReport, projectData, {
        params: filter,
        responseType: 'arraybuffer',
      });
      FileSaver.saveAs(new Blob([data], { type: 'application/vnd.ms-excel xlsx' }), `Ticket Status Report - ${viewMode}.xlsx`);
      // setDownloadReportDisabled(false);
    } catch {
      toast.add('dynamicLabels.somethingWendWrong', 'warning', false);
    }
  };
  const breadCrumbListOptionList = [
    { "value": "ALL", "label": "All Tickets", "id": "ALL" },
    { "value": "OPEN", "label": "Open Tickets", "id": "OPEN" },
    { "value": "NEW", "label": "New Tickets", "id": "NEW" },
    { "value": "VALIDATED", "label": "Validated Tickets", "id": "VALIDATED" },
    { "value": "IN_PROGRESS", "label": "In Progress Tickets", "id": "INPROGRESS" },
    { "value": "REQUEST_FOR_INFORMATION", "label": "Request For Information Tickets", "id": "REQUESTFORINFORMATION" },
    { "value": "RESOLVED", "label": "Resolved, Awaiting Confirmation Tickets", "id": "RESOLVED" },
    { "value": "CLOSED", "label": "Closed Tickets", "id": "CLOSED" }
];
  const handleBreadCrumbChange = (id: any) => {
    
    // fetchOptions.filterOptions ={
    //   searchBy: 'status',
    //   searchText: ticketStatus[id].value,
    // } 
    dispatch({
      type: "@@ticketingToolListView/SET_SELECTED_STATUS",
      payload:id
    })
    dispatch({
      type: "@@ticketingToolListView/FETCH_STRUCTURE",
      payload:id
    })

    //handleFetchData(fetchOptions)
    hybridRouteTo(
      `ticketing?page=${id}`
  );
  }

  return (
    <>
      <Box display="flex" flexDirection='column' style={{ width: '100%', marginTop: '50px' }} px='15px' pb='15px'>
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ width: "100%" }}
          py="15px"
          px='15px' 
          pb='15px'
          pt="25px"
          className="header"
        >
          <div>
            <BreadCrumb options={breadCrumbList} optionList={breadCrumbListOptionList} onClick={(id: string) => {
              handleBreadCrumbChange(id);

            }}></BreadCrumb>
            <ReactTooltip
              id="tt_AddOrder"
              type="info"
              effect="solid"
              place="bottom"
            >
              Click here to add a ticket.
                    </ReactTooltip>


          </div>
          <Box display="flex">
            <>
              <IconButton
                intent="page"
                id="ticketing--actionbar--add"
                data-tip="Close Ticket"
                data-for="tt_AddOrder"
                iconVariant="icomoon-add"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setIsAddTicketModal(true);
                }}
              >

                Add
              </IconButton>
                {/* <ReactTooltip
                  id="tt_AddOrder"
                  type="info"
                  effect="solid"
                  place="bottom"
                >
                  Click here to add a ticket.
                </ReactTooltip> */}
            </>
            <ButtonGroup
              data={[
                { id: "SUPPORT", label: "SUPPORT", selected: viewMode == "SUPPORT", tooltipText: "Shows list of support tickets" },
                { id: "FEATURE", label: "FEATURE", selected: viewMode == "FEATURE", tooltipText: "Shows list of feature tickets" },
              ]}
              onChange={(id) => {      
                dispatch({
                  type: "@@ticketingToolListView/SET_VIEW_MODE",
                  payload: id
                })
                dispatch({
                  type: '@@ticketingToolListView/FETCH_STRUCTURE'
                })       
                hybridRouteTo(
                  `ticketing`
              );
                handleFetchData(fetchOptions);
              }
              }
            />
          </Box>
        </Box>

        <Box id="clientDetailsTable" display="flex" flexDirection='column' style={{ width: '100%', }} px='15px' pb='15px'>
          <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000", position: "relative" }}>
            <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: "flex", overflow: "hidden" }}>

              <WhiteCard style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, height: "calc(100vh - 150px)" }}>
                {columns.length > 0 &&
                  <ListView
                    rowIdentifier="ticketId"
                    style={{ display: "flex", height: "100%" }}
                    columns={columns}
                    data={rowsSelector}
                    onFetchData={handleFetchData}
                    onFilterChange={handleFilterChange}
                    onSortChange={onSortChange}
                    onSaveColumnPreferences={onSaveColumnPreferences}
                    totalRows={totalRows || 0}
                    loading={dataLoading || false}
                    isColumnLoading={columnsLoading?true:false}
                    hasSelectAllRows={true}
                    onRowEditClick={()=>{}}
                    isEditMode={true}
                    filters={filters}
                    sorts={sort}
                  >

                    {{
                      IconBar:
                        <Tooltip messagePlacement="end" tooltipDirection="bottom" message={`Download ${viewMode == "SUPPORT"? "Support" :"Feature"} Report `} hover>
                          <IconButton
                            iconVariant="icomoon-download"
                            iconSize={16}
                            onlyIcon
                            style={{ color: "inherit",margin: '5px 0px'}}
                            onClick={handleDownloadReport}
                            id='download'
                          
                          />
                        </Tooltip>
                      ,
                      ActionBar: <></>
                    }}
                  </ListView>
                }
              </WhiteCard>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <AddTicketModal isAddTicketModal={isAddTicketModal} setIsAddTicketModal={setIsAddTicketModal} handleFetchData={handleFetchData} fetchOptions={fetchOptions}></AddTicketModal>
     {showDownloadSuccess && <DownloadMessage
        showInfoModal={showDownloadSuccess}
        onToggle={setShowDownloadSuccess}
      ></DownloadMessage>}
    </>
  )
}

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(TicketingToolListView)), "toast-inject-here")
);