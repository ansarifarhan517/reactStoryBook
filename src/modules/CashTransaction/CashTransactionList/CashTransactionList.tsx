import React, {useState, Dispatch, useEffect} from 'react'
import { ColumnInstance } from 'react-table'
import {
    withPopup,
    withToastProvider, Box, BreadCrumb, IconButton, ButtonGroup, DateRangePicker, TextInput, IListViewColumn, useToast, 
    Grid, Card, ListView, Modal, ModalHeader, FilePreviewer, IFetchDataOptions
} from 'ui-library'
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom';
import { withThemeProvider } from '../../../utils/theme';
import withRedux from '../../../utils/redux/withRedux';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import moment from "moment";
import "./CashTransactionList.css"
import { CashTransactionListActions, ISetViewMode } from './CashTransactionList.actions';
import { useDispatch } from 'react-redux';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import AddCashTransaction from "./AddCashTransaction/AddCashTransaction";
import styled from "styled-components";
import FileSaver from 'file-saver';

const CardAmount = styled.div`
    height: 25px;
    font-size: 17px;
    font-weight: 500;
    color: #5698d3;`

const CardLabel = styled.div`
    color: #485465;
    font-size: 13px;`

const CashTransactionList = () => {


    /** General Hooks */   
    const currencySymbolKey  = localStorage.getItem('userAccessInfo') ? `cur_symbol_${JSON.parse(localStorage.getItem('userAccessInfo') || '{}')['baseCurrency']}` : '';

    const getDynamicLabelString = () => {
        const dynamicLabelsString = `${DYNAMIC_LABELS_MAPPING.paymentTransaction}, ${currencySymbolKey}`
        return dynamicLabelsString;
    }
    
    const dynamicLabels = useDynamicLabels(getDynamicLabelString())
    const toast = useToast()

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<CashTransactionListActions>>()
    const structure = useTypedSelector(state => state.cashTransaction.listView.structure)
    const cardStructure = useTypedSelector(state => state.cashTransaction.listView.cardStructure)
    const columnsSelector = useTypedSelector(state => state.cashTransaction.listView.structure.columns)
    const rowsSelector = useTypedSelector(state => state.cashTransaction.listView.data.results)
    const rowCount = useTypedSelector(state => state.cashTransaction.listView.data.totalCount)
    const proofs = useTypedSelector(state => state.cashTransaction.listView.transactionProof.CASHDEPOSIT)
    const cardTRData = useTypedSelector(state => state.cashTransaction.listView.cardTRData)
    const cardDADCData = useTypedSelector(state => state.cashTransaction.listView.cardDADCData)
    // const deliveryAssociateList = useTypedSelector(state => state.cashTransaction.listView.deliveryAssociateList);
    const lessDepositReasons = useTypedSelector(state => state.cashTransaction.listView.lessDepositReasons);

    // const actionBarButtons = useTypedSelector(state => state.cashTransaction.listView.structure.buttons)
    const viewMode = useTypedSelector(state => state.cashTransaction.listView.viewMode)
    const loading = useTypedSelector(state => state.cashTransaction.listView.loading.listView)

    /** State */
    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [daColumns, setDaColumns] = useState<IListViewColumn[]>([])
    const [dcColumns, setDcColumns] = useState<IListViewColumn[]>([])
    const [selectedTab, setSelectedTab] = useState<string>('');
    const [transactionProof, setTransactionProof] = useState<any[]>([]);
    const [imageIndex,setImageIndex]=useState(0);
    const [isAddTransactionModalVisible, setAddTransactionVisible] = useState<boolean>(false); 
    const [searchFilterParams, setSearchFliterParams] = useState<Record<string, string>>({})
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
    // const [showUploadPopup, setShowUploadPopup] = useState<boolean>(false)

    const pageLabels = useTypedSelector(state => state.pageLabels.paymentTransaction) 

    const [showImagePopup, setShowImagePopup] = useState<boolean>(false)

    const ButtonGroupData = React.useMemo(() =>
    pageLabels?.viewOptions ?
      Object.keys(pageLabels?.viewOptions).map((key: string) => ({
        id: key,
        label: pageLabels?.viewOptions[key].toUpperCase(),
        selected: key === viewMode.id,
        icon: key === 'transaction' ? 'transfer' : (key === 'distributionCenter' ? 'distribution-center' : 'da-icon'),
      }))
      : []
    , [pageLabels, viewMode, dynamicLabels])

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'Payments', label: dynamicLabels.Payments, disabled: true },
        { id: 'deliveryAssociate', label: dynamicLabels.deliveryboy_s, disabled: true },
        { id: 'paymentTransactions', label: dynamicLabels.paymentTransactions, disabled: true },
      ], [pageLabels, dynamicLabels])
    
    const [selectedDate, setSelectedDates] = useState<any>({
        startDate: moment.utc(moment(Date()).startOf('day')).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment.utc(moment(Date())).format('YYYY-MM-DD HH:mm:ss'),
    });

    /** Watchers */
    useEffect(() => {
        if (viewMode.id == 'transaction' ) {

            // selectedDate.startDate = selectedDate.startDate + ' 00:00:00'
            dispatch({ type: '@@cashTransactionList/FETCH_STRUCTURE' })
            dispatch({ type: '@@cashTransactionList/FETCH_TRCARD_STRUCTURE' })
        } else if (viewMode.id == 'distributionCenter' ) {

            dispatch({ type: '@@cashTransactionList/FETCH_DC_STRUCTURE' })
            dispatch({ type: '@@cashTransactionList/FETCH_DCCARD_STRUCTURE' })
        } else if (viewMode.id == 'deliveryAssociate') {

            dispatch({ type: '@@cashTransactionList/FETCH_DA_STRUCTURE' })
            dispatch({ type: '@@cashTransactionList/FETCH_DACARD_STRUCTURE' })
        }
    }, [viewMode, selectedDate])

    const handleImagePopup = (referenceId: string) => {
        dispatch({ type: '@@cashTransactionList/FETCH_TRANSACTIONPROOF_DATA', payload: {referenceId:  referenceId}})
        setShowImagePopup(true);
    }

    useEffect(() => {
        if (proofs && proofs.length) {
            const newProofData = proofs?.map((proofData ) => {
                proofData['id'] = proofData?.mediaId;
                proofData['url'] = proofData?.finalUrl;
                proofData['filename'] = proofData?.fileName;
                return proofData;
            })
            setTransactionProof(newProofData);
        }
    }, [proofs])

    const redirectToTransactionFromDriver = (empId: string) => {

        let startDate = moment.utc(moment(Date()).startOf('day')).format('YYYY-MM-DD HH:mm:ss')
        let endDate = moment.utc(moment(Date())).format('YYYY-MM-DD HH:mm:ss')
        setSelectedDates({ startDate: startDate, endDate: endDate });   
        
        setSearchFliterParams({deliveryAssociateName : empId})

        dispatch({ type: '@@cashTransactionList/SET_VIEW_MODE', payload: {id: 'transaction', flag: true} } as ISetViewMode) 
        setSelectedTab('deliveryAssociate')
        
    }

    const redirectToTransactionFromBranch = (empId: string) => {
        let startDate = moment.utc(moment(Date()).startOf('day')).format('YYYY-MM-DD HH:mm:ss')
        let endDate = moment.utc(moment(Date())).format('YYYY-MM-DD HH:mm:ss')
        setSelectedDates({ startDate: startDate, endDate: endDate });

        setSearchFliterParams({branch : empId})

        dispatch({ type: '@@cashTransactionList/SET_VIEW_MODE', payload: {id: 'transaction', flag: true} } as ISetViewMode) 
        setSelectedTab('distributionCenter')
    }


    const cellCallbackMapping = {
        referenceId: handleImagePopup,
        deliveryAssociateName: redirectToTransactionFromDriver,
        branch: redirectToTransactionFromBranch
    };

    useEffect(() => {
        const mongoStructure = columnsSelector;    
        if (Object.keys(mongoStructure).length) {
            //to set search parameter on redirection
            
            if (mongoStructure['deliveryAssociateName'] &&  mongoStructure['deliveryAssociateName']['searchParamValue']) {
                delete mongoStructure['deliveryAssociateName']['searchParamValue']
            }
            if (mongoStructure['branch'] && mongoStructure['branch']['searchParamValue']) {
                delete mongoStructure['branch']['searchParamValue']
            }

            if (viewMode.id == 'transaction' && selectedTab === 'deliveryAssociate') {
                mongoStructure['deliveryAssociateName']['searchParamValue'] = searchFilterParams?.['deliveryAssociateName']
                if (mongoStructure['branch'] && mongoStructure['branch']['searchParamValue']) {
                    delete mongoStructure['branch']['searchParamValue']
                }
            } else if (viewMode.id == 'transaction' && selectedTab === 'distributionCenter') {
                mongoStructure['branch']['searchParamValue'] = searchFilterParams?.['branch']
                if (mongoStructure['deliveryAssociateName'] &&  mongoStructure['deliveryAssociateName']['searchParamValue']) {
                    delete mongoStructure['deliveryAssociateName']['searchParamValue']
                }
            }

            const newColumns = transformMongoListViewToColumns(
                mongoStructure,
                'cashTransaction',
                cellCallbackMapping
            );
            
            if (viewMode.id == 'transaction') {
                setColumns(newColumns);
            } else if (viewMode.id == 'deliveryAssociate') {
                setDaColumns(newColumns)
            } else if (viewMode.id == 'distributionCenter'){
                setDcColumns(newColumns)
            }
        }
      }, [columnsSelector]);

    const getFormattedDate = (date: Date) => {
        const todayTime = date
        const month = todayTime.getMonth() + 1
        const day = todayTime.getDate()
        const year = todayTime.getFullYear()
        const hours = todayTime.getHours()
        const minutes = todayTime.getMinutes()
        return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes
    }

    const handleChange = (date: Date | null | [Date, Date]) => {
        if (date && Object.keys(date).length !== 0) {
            let startDate = moment.utc(moment(date[0]).startOf('day')).format('YYYY-MM-DD HH:mm:ss')
            let endDate = moment.utc(moment(date[1])).format('YYYY-MM-DD HH:mm:ss')
            setSelectedDates({ startDate: startDate, endDate: endDate });
        }
    };    

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }) => {
        dispatch({
          type: '@@cashTransactionList/SET_LOADING',
          payload: { listView: true }
        })

        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions })
        if (viewMode.id == 'transaction' && viewMode.flag) {
            dispatch({
                type: '@@cashTransactionList/FETCH_TR_DATA',
                payload: {
                    startDateFilter: selectedDate.startDate,
                    endDateFilter: selectedDate.endDate,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder
                }
            })
            dispatch({ type: '@@cashTransactionList/FETCH_TRCARD_DATA', payload: {
                startDateFilter: selectedDate.startDate,
                endDateFilter: selectedDate.endDate,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText
            }})
        } else if (viewMode.id == 'deliveryAssociate') {

            console.log('selected tab', selectedTab)
            delete searchFilterParams[Object.keys(searchFilterParams)[0]]
            console.log('filterParam', searchFilterParams)
            dispatch({
                type: '@@cashTransactionList/FETCH_DA_DATA',
                payload: {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder
                }
            })
            dispatch({ type: '@@cashTransactionList/FETCH_DACARD_DATA'})
        } else if (viewMode.id == 'distributionCenter') {

            dispatch({
                type: '@@cashTransactionList/FETCH_DC_DATA',
                payload: {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    searchBy: filterOptions?.searchBy,
                    searchText: filterOptions?.searchText,
                    sortBy: sortOptions?.sortBy,
                    sortOrder: sortOptions?.sortOrder
                }
            })
            dispatch({ type: '@@cashTransactionList/FETCH_DCCARD_DATA'})
        }
      }, [viewMode, selectedDate])

    const onSortChange = React.useCallback(() => { }, [])

    const downloadSelectedImage = async (imgIndex: number) => {
        try {
            const { data } = await axios.get(`${apiMappings.cashTransaction.listView.downloadTransactionProof}${transactionProof[imgIndex].filename}`, {
              responseType: 'arraybuffer'
            })
            FileSaver.saveAs(new Blob([data], { type: "image/*" }), transactionProof[imgIndex].filename)
          } catch {
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
          }
    }

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })
    
        const payload = {
          ...structure,
          columns
        }
    
        try {
          const { data: { message } } = await axios.put(apiMappings.cashTransaction.listView.structure.transactions, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
          console.log(error, error?.response)
        }
    
    
      }, [columnsSelector])


      const handleAddTransaction = () => {
        // dispatch({type: '@@cashTransactionList/FETCH_DELIVERY_ASSOCIATE_LIST', payload: {searchValue: 'par'}})
        dispatch({type: '@@cashTransactionList/FETCH_LESS_DEPOSIT_REASONS'})        
        setAddTransactionVisible(true)
      }

    const formatDisplayDate = (date: Array<Date>) => {
        let displayDate = '';
        date.forEach((ele, index) => {
            displayDate += getFormattedDate(ele) + (index != date.length -1 ? ' - ' : '');
        });
        return displayDate;
    }

    const handleDownloadReport = async () => {

        const viewModeTypeMapping = {
            'transaction' : 'downloadTransactionListReport',
            'deliveryAssociate' : 'downloadDAListReport',
            'distributionCenter' : 'downloadDCListReport'
        }
        
        const fileNameMap = {
            'transaction' : 'paymentTransactions',
            'deliveryAssociate' : 'deliveryAssociateName',
            'distributionCenter' : 'branches'
        }
    
        const payload = {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions.filterOptions?.searchBy,
            searchText: fetchOptions.filterOptions?.searchText,
            sortBy: fetchOptions.sortOptions?.sortBy,
            sortOrder: fetchOptions.sortOptions?.sortOrder
        }

        if (viewMode.id === 'transaction') {
            payload['startDateFilter'] = selectedDate.startDate;
            payload['endDateFilter'] = selectedDate.endDate;
        }

        try {
          const { data } = await axios.get(apiMappings.cashTransaction.listView[viewModeTypeMapping[viewMode.id]], {
            params: payload,
            responseType: 'arraybuffer'
          })
    
          FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels[fileNameMap[viewMode.id]]}.xlsx`)
        } catch {
          toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    return (
        <>
            <div id='toast-inject-here'></div>
            <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
                {/* Header */}
                <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '60px'  }}>
                    {/* <div title='breadcrumbs' className='cursor'>Bread crumbs come here</div> */}
                    <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />

                    {/* Page Action Buttons */}
                    <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px' style={{margin: '18px 0'}}>
                        
                    {pageLabels?.buttons.add &&
                        <>
                            <IconButton
                            id="payment_transaction--actionbar--add"
                            intent='page'
                            data-tip
                            data-for='tt_AddDriver'
                            iconVariant='icomoon-add'
                            onClick={() => handleAddTransaction()}>
                            {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
                            </IconButton>
                            <ReactTooltip id='tt_AddDriver' type='info' effect='solid' place='bottom'>
                            {`${dynamicLabels.add} ${dynamicLabels.paymentTransactions}`}
                            </ReactTooltip>
                        </>}


                        <ButtonGroup
                            data={ ButtonGroupData }
                            onChange={(id: string) => {setSelectedTab(''); setSearchFliterParams({}); dispatch({ type: '@@cashTransactionList/SET_VIEW_MODE', payload: {id: id, flag: true} } as ISetViewMode)}}
                        />
                        {viewMode.id === 'transaction' && 
                            <DateRangePicker
                                onFromChange={handleChange}
                                onToChange={handleChange}
                                onApply={handleChange}
                                label={'Date Range'}
                                variant='daterange'
                                timeFormat={24}
                                style={{
                                    position: 'absolute',
                                    right : '10px'
                                }}
                                startDate={new Date()}
                                endDate={new Date()}
                                fromDateFormatter={getFormattedDate}
                                toDateFormatter={getFormattedDate}
                            >
                                {({ value, open, setOpen }: any) => (
                                    <div>
                                        <div onClick={() => setOpen(!open)}>
                                            <TextInput
                                            id='cashTransactionDates'
                                            name={name}
                                            style={{
                                                margin: '0',
                                                fontSize: '14px',
                                                minHeight: '30px',
                                                boxShadow: '0 2px 11px -5px #000'
                                            }}
                                            className='someClassname'
                                            variant='withIcon'
                                            iconVariant='calendar'
                                            iconSize='xs'
                                            iconStyle={{ padding: '7px 7px 7px 7px' }}
                                            labelColor='grey.250'
                                            color="primary.main"
                                            border={false}
                                            placeholder='Please Click Here'
                                            title='Choose a date range to display Payment Transactions during that time'
                                            fullWidth
                                            value={formatDisplayDate(value)}
                                            onChange={() => 'On change clicked'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </DateRangePicker>
                        }
                    </Box>
                </Box>

                {/* CARDS CONTAINER */}
                <Grid container spacing={10} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000' , margin: '10px'}}>
                    <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                        <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', padding: '10px 15px 0px 15px' }}>
                            <Grid container spacing={5}>
                                <Grid style={{ display: 'flex', overflow: 'hidden' }}>
                                    <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', padding: '10px 15px 0px 15px' }}>
                                        <div style={{ borderRight: 'solid 1px #dddddd', paddingRight: '20px'}}>
                                            <Grid container spacing={5}>
                                                {/* <Grid item md={2}>
                                                    {viewMode.id === 'transaction' ?
                                                        <img src="./images/product.svg"/>
                                                    :
                                                        (viewMode.id === 'deliveryAssociate' ?
                                                            <img src="./images/bitmap.jpg"/>
                                                        :
                                                            <img src="./images/data-warehouse.svg"/>
                                                        )
                                                    }
                                                </Grid>
                                                <Grid item md={10}>
                                                    {viewMode.id === 'transaction' ?
                                                        <div>
                                                            <CardAmount>{dynamicLabels?.[currencySymbolKey]} {cardTRData?.orderValue?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.orderValue?.label}</CardLabel>
                                                        </div>
                                                    :
                                                        <div>
                                                            <CardAmount>{cardDADCData?.outstandingAmountDAsOrDcsCount}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.outstandingAmountDAsOrDcsCount?.label}</CardLabel>
                                                        </div>
                                                    }
                                                </Grid> */}
                                                <span>
                                                    {viewMode.id === 'transaction' ?
                                                        <img src="./images/product.svg"/>
                                                    :
                                                        (viewMode.id === 'deliveryAssociate' ?
                                                            <img src="./images/bitmap.jpg"/>
                                                        :
                                                            <img src="./images/data-warehouse.svg"/>
                                                        )
                                                    }
                                                </span>
                                                <span style={{ paddingLeft: '25px'}}>
                                                    {viewMode.id === 'transaction' ?
                                                        <div>
                                                            <CardAmount>{dynamicLabels?.[currencySymbolKey]} {cardTRData?.orderValue?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.orderValue?.label}</CardLabel>
                                                        </div>
                                                    :
                                                        <div>
                                                            <CardAmount>{cardDADCData?.outstandingAmountDAsOrDcsCount}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.outstandingAmountDAsOrDcsCount?.label}</CardLabel>
                                                        </div>
                                                    }
                                                </span>
                                            </Grid> 
                                            
                                        </div>
                                    </Card>
                                </Grid>
                                <Grid style={{ display: 'flex', overflow: 'hidden' }}>
                                    <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', padding: '10px 15px 30px 15px', height: 'auto' }}>
                                        <div>
                                            <Grid container spacing={5}>
                                                {/* <Grid item md={3}>
                                                    {viewMode.id === 'transaction' ?
                                                        <img src="./images/money-1.svg"/>
                                                    : 
                                                        <img src="./images/money.svg"/>
                                                    }
                                                </Grid>
                                                <Grid item md={9}>
                                                    {viewMode.id === 'transaction' ? 
                                                        <div>
                                                            <CardAmount>{dynamicLabels?.[currencySymbolKey]} {cardTRData?.depositedAmount?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.depositedAmount?.label}</CardLabel>
                                                        </div>
                                                    :
                                                        <div>
                                                            <CardAmount >{dynamicLabels?.[currencySymbolKey]} {cardDADCData?.outstandingAmount?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.outstandingAmount?.label}</CardLabel>
                                                        </div>
                                                    }
                                                </Grid> */}
                                                <span>
                                                    {viewMode.id === 'transaction' ?
                                                        <img src="./images/money-1.svg"/>
                                                    : 
                                                        <img src="./images/money.svg"/>
                                                    }
                                                </span>
                                                <span style={{ paddingLeft: '25px'}}>
                                                    {viewMode.id === 'transaction' ? 
                                                        <div>
                                                            <CardAmount>{dynamicLabels?.[currencySymbolKey]} {cardTRData?.depositedAmount?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.depositedAmount?.label}</CardLabel>
                                                        </div>
                                                    :
                                                        <div>
                                                            <CardAmount >{dynamicLabels?.[currencySymbolKey]} {cardDADCData?.outstandingAmount?.toFixed(2)}</CardAmount>
                                                            <CardLabel>{cardStructure?.columns?.outstandingAmount?.label}</CardLabel>
                                                        </div>
                                                    }
                                                </span>
                                            </Grid> 
                                        </div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
                    {/* LIST VIEW CONTAINER */}
                    <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000'}}>
                        <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                {columns.length && viewMode.id === 'transaction' ? (                                    
                                    <ListView
                                        rowIdentifier='transactionId'
                                        columns={columns}
                                        data={rowsSelector}
                                        totalRows={rowCount}
                                        filters={searchFilterParams}
                                        onRowEditClick={() => {}}
                                        onFetchData={handleFetchData}
                                        onRowSelect={() => {}}
                                        onSortChange={onSortChange}
                                        loading={loading}
                                        hideRefresh={loading}
                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                        style={{ height: '90vh' }}
                                    >
                                    {{
                                        IconBar:
                                        <Box>
                                            {/* <Tooltip message={`${dynamicLabels.download} ${pageLabels?.viewOptions[viewMode.id]} ${dynamicLabels.report}`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end"> */}
                                                <IconButton iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />
                                            {/* </Tooltip> */}
                                        </Box>
                                    }}
                                    </ListView>
                                ) :  <></>}
                                
                                {dcColumns.length && viewMode.id === 'distributionCenter' ? (
                                    <ListView
                                        rowIdentifier='id'
                                        columns={dcColumns}
                                        data={rowsSelector}
                                        totalRows={rowCount}
                                        onRowEditClick={() => {}}
                                        onFetchData={handleFetchData}
                                        onRowSelect={() => {}}
                                        onSortChange={onSortChange}
                                        loading={loading}
                                        hideRefresh={loading}
                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                        style={{ height: '90vh' }}
                                    >
                                    {{
                                        IconBar:
                                        <Box>
                                            {/* <Tooltip message={`${dynamicLabels.download} ${pageLabels?.viewOptions[viewMode.id]} ${dynamicLabels.report}`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end"> */}
                                                <IconButton iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />
                                            {/* </Tooltip> */}
                                        </Box>
                                    }}
                                    </ListView>
                                ) : <></>}
                                {daColumns.length && viewMode.id === 'deliveryAssociate' ? (
                                    <ListView
                                        rowIdentifier='deliveryMediumMasterId'
                                        columns={daColumns}
                                        data={rowsSelector}
                                        totalRows={rowCount}
                                        onRowEditClick={() => {}}
                                        onFetchData={handleFetchData}
                                        onRowSelect={() => {}}
                                        onSortChange={onSortChange}
                                        loading={loading}
                                        hideRefresh={loading}
                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                        style={{ height: '90vh' }}
                                    >
                                    {{
                                        IconBar:
                                        <Box>
                                            {/* <Tooltip message={`${dynamicLabels.download} ${pageLabels?.viewOptions[viewMode.id]} ${dynamicLabels.report}`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">*/}
                                                <IconButton iconVariant='icomoon-download' iconSize={16} onlyIcon style={{ color: 'inherit' }} onClick={handleDownloadReport} />
                                            {/* </Tooltip>  */}
                                        </Box>
                                    }}
                                    
                                    </ListView>
                                ) : <></>}
                            </Card>
                        </Grid>
                    </Grid>
            
                    <Modal
                        onToggle={() => setShowImagePopup(false)}
                        open={showImagePopup}
                        width="960px"
                        children={{
                            header: (
                            <ModalHeader
                                headerTitle={dynamicLabels.transactionProof}
                                width="960px"
                                handleClose={() => setShowImagePopup(false)}
                                imageVariant="icomoon-close"
                                headerStyle={{ fontSize: "15px" }}
                            />
                        ),
                        content: (
                            <Box p='1em'>
                                { transactionProof.length && 
                                    <FilePreviewer
                                        pageIndex={imageIndex}
                                        onPageChange={(index:number)=>setImageIndex(index)}
                                        files={transactionProof}
                                    />
                                }
                            </Box>
                        ),
                        footer: (
                            <Box
                                horizontalSpacing="10px"
                                display="flex"
                                justifyContent="flex-end"
                                p="15px"
                            >
                                <IconButton
                                iconVariant="download"
                                primary={true}
                                iconSize={11}
                                onClick={() => downloadSelectedImage(imageIndex)}
                                >
                                    {dynamicLabels.download}
                                </IconButton>
                                <IconButton
                                iconVariant="icomoon-close"
                                iconSize={11}
                                onClick={() => setShowImagePopup(false)}
                                >
                                    {dynamicLabels.cancel}
                                </IconButton>
                            </Box>

                        )
                    }}
                    />

            </Box>      

            {isAddTransactionModalVisible && <AddCashTransaction handleFetchData={handleFetchData} setSelectedDates={setSelectedDates} isAddTransactionModalVisible={isAddTransactionModalVisible} setAddTransactionVisible={setAddTransactionVisible} lessDepositReasons={lessDepositReasons} /> }         
                
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(CashTransactionList)), 'toast-inject-here'))