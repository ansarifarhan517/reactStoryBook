import React, { Dispatch, useEffect, useState } from 'react';
import { withThemeProvider } from '../../utils/theme';
import {
    withPopup,
    withToastProvider,
    ListView, 
    useToast,
    IFilterOptions,
    IListViewColumn,
    Grid,
    Box,
    BreadCrumb,
    IconButton,
    Tooltip
} from "ui-library";
// import { SortingRule } from 'react-table'
import { useDispatch } from 'react-redux';
import withRedux from '../../utils/redux/withRedux';
import { useTypedSelector } from '../../utils/redux/rootReducer';
import { transformMongoListViewToColumns } from '../../utils/mongo/ListView';
import { ColumnInstance } from 'react-table';
import axios from '../../utils/axios';
import apiMappings from '../../utils/apiMapping';
import { getQueryParams, hybridRouteTo } from '../../utils/hybridRouting';
import FileSaver from 'file-saver';
import WhiteCard from '../../utils/layouts/WhiteCard';
import { breachPortalListViewActions } from './breachportalListview.action';
import ReactTooltip from 'react-tooltip';
import DownloadMessage from '../../utils/components/DownloadMessage';

import { IBreachFetchDataOptions } from './breachportalModel';
import DaterangeFilterbreachportal from './DaterangeFilterbreachportal';
import moment from 'moment';
import { IStateService } from 'angular-ui-router';


export interface IRowData {
    createdBy?: string,
    createdOn?: string,
    id?: number,
    status?: string,
    subject?: string,
    tracker?: string,
    updatedOn?: string
}

interface IBreachPortalViewProps {
    ngStateRouter: IStateService
  }
const BreachPortalToolListView = ({ngStateRouter}: IBreachPortalViewProps) => {
    const viewMode = useTypedSelector(state => state.breachportal.viewMode);
    const toast = useToast();
    const clientProperties = useTypedSelector((state) => state.clientProperties);
    const dispatch = useDispatch<Dispatch<breachPortalListViewActions>>();
    const {loading, results, totalRows, structure, to:endDate, from:startDate,setDisableNext} = useTypedSelector((state) => state.breachportal);
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [showDownloadSuccess,setShowDownloadSuccess] = useState(false); 
    const [fetchOptions, setFetchOptions] = useState<IBreachFetchDataOptions>({});
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
   
    const goToDetails = () => {
        hybridRouteTo('breachPortal');
    };
    const cellCallbackMapping = {
        id: goToDetails
    };
    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({
            type: '@@breachPortalListView/FETCH_STRUCTURE'
        })

    }, [])

    useEffect(() => {
        const mongoStructure = structure.columns;
        if (mongoStructure && Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(
                mongoStructure,
                "breachportal",
                cellCallbackMapping
            );
            setColumns(newColumns);
        }
        const firstEntry: any = Object.values(structure.columns)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }
    }, [structure.columns]);

    
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis,endDateFilter,startDateFilter }: IBreachFetchDataOptions) => {
        console.log("startDateFilter ", startDateFilter, "endDateFilter ", endDateFilter)
        const timezone = clientProperties?.TIMEZONE?.propertyValue ? clientProperties?.TIMEZONE?.propertyValue?.toUpperCase() : "";
        let a = moment.tz(startDate, timezone).utc().format("YYYY-MM-DD HH:mm:ss")
        let b = moment.tz(endDate, timezone).utc().format("YYYY-MM-DD HH:mm:ss")

        dispatch({
            type: '@@breachPortalListView/SET_LOADING',
            payload: {
              key: 'loading',
              value: {
                listView: true,
                columns: false
              }
            }
          })

        const payload = {
            params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder,
            startDateFilter:a,
            endDateFilter:b
            }
        }
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis, startDateFilter, endDateFilter})
        dispatch({
            type: '@@breachPortalListView/FETCH_DATA',
            payload
        })
    }, [startDate, endDate])


  


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

    const onSortChange = React.useCallback(() => { }, [])
    // /** Cell Callbacks */
    const onSaveColumnPreferences = React.useCallback(
        async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
          //  let existingParams = getQueryParams()
            const columns = { ...structure.columns };
            Object.keys(columns).forEach((columnKey) => {
                columns[columnKey].permission = !!visibleColumns[columnKey];
            });
            
            const params = {
                modelName: 'TICKETING_TOOL',
                pageName: 'TICKETING_TOOL',
                sectionName: 'BREACHPORTAL_LIST_VIEW'
            }
            const payload = {
                ...structure,
                columns,
            };
            try {
                const {
                    data: { message },
                } = await axios.put(apiMappings.ticktingTool.listview.structure, payload, { params });
                message && toast.add(message, "check-round", false);
            } catch (error) {
                console.log(error, "someting went wrong");
            }
        },
        [structure.columns]
    );


    const breadCrumbList = [
        { id: "HOME", label: "TicketingTool", disabled: true },
        { id: "HOME2", label: "Breachportal", disabled: true }
    ];


    const handleDownloadReport = async () => {

        setShowDownloadSuccess(true)
        let filterOptions = fetchOptions.filterOptions
        let temp = {
            ...fetchOptions,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText
        }
        delete temp.filterOptions

        let filter = {
            ...fetchOptions,   //need to check
            endDateFilter:moment.utc(endDate).format('YYYY-MM-DD HH:mm:ss'),
            startDateFilter:moment.utc(startDate).format('YYYY-MM-DD HH:mm:ss'),
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText
        }
        delete temp.filterOptions
        try {
        
            const { data } = await axios.post(apiMappings.Breachportal.listview.downloadReport,null, {
                params: filter,
                responseType: 'arraybuffer',
            });
            FileSaver.saveAs(new Blob([data], { type: 'application/vnd.ms-excel xlsx' }), `Breach Status Report - ${viewMode}.xlsx`);
        } catch {
            toast.add("something went wrong", 'warning', false);
        }
    };


  

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
                        <BreadCrumb options={breadCrumbList} ></BreadCrumb>
                        <ReactTooltip
                            id="tt_AddOrder"
                            type="info"
                            effect="solid"
                            place="bottom"
                        >
                            Click here to add a ticket.
                        </ReactTooltip>


                    </div>

                    <Box ml="5px">
                        {clientProperties?.DATEFORMAT && <DaterangeFilterbreachportal />}
                    </Box>
                    
                </Box>

                <Box id="clientDetailsTable" display="flex" flexDirection='column' style={{ width: '100%', }} px='15px' pb='15px'>
                    <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000", position: "relative" }}>
                        <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: "flex", overflow: "hidden" }}>

                            <WhiteCard style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, height: "calc(100vh - 150px)" }}>
                                {columns.length > 0 &&
                                    <ListView
                                        rowIdentifier="issueId"
                                        style={{ display: "flex", height: "100%" }}
                                        columns={columns}
                                        data={results}
                                        onFetchData={handleFetchData}
                                        onFilterChange={handleFilterChange}
                                        onSortChange={onSortChange}
                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                        totalRows={totalRows}
                                        loading={showColumnShimmer || loading.listView}
                                        isColumnLoading={showColumnShimmer || loading.columns}
                                        hasSelectAllRows={true}
                                        onRowEditClick={() => { }}
                                        isEditMode={true}
                                        disableNext={setDisableNext}
                                    >

                                        {{
                                            IconBar:
                                                <Tooltip messagePlacement="end" tooltipDirection="bottom" message={'Download Report'} hover>
                                                    <IconButton
                                                        iconVariant="icomoon-download"
                                                        iconSize={16}
                                                        onlyIcon
                                                        style={{ color: "inherit", margin: '5px 0px' }}
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



            {showDownloadSuccess && <DownloadMessage
                showInfoModal={showDownloadSuccess}
                onToggle={setShowDownloadSuccess}
            ></DownloadMessage>}
        </>
    )
}

export default withThemeProvider(
    withToastProvider(withRedux(withPopup(BreachPortalToolListView)), "toast-inject-here")
);
