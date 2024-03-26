import React, { Dispatch, useEffect, useState } from 'react';
import withRedux from '../../../utils/redux/withRedux';
import { withThemeProvider } from '../../../utils/theme';
import { withToastProvider, withPopup, IListViewColumn, ISelectedRows, useToast, Box, BreadCrumb, IconButton, Grid, Card, ListView, 
    IListViewRow, IFetchDataOptions, ModalHeader, Modal, Tooltip } from 'ui-library';
import { AWBLabelConfigActions } from './AWBLabelConfiguration.actions';
import { useDispatch } from 'react-redux';
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import { IRowData } from './AWBLabelConfiguration.models';
import ga, { sendGA } from '../../../utils/ga';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { ColumnInstance } from 'react-table'
import { ListGridWrapper, StyledGrid, AddButtonWrapper } from './StyledAwbLabelConfiguration';
import CreateActionBarButton  from '../../common/ActionBar/CreateActionBarButton'
import AWBLabelConfigurationForm from './AWBLabelConfigurationForm'
export interface IAwbLabelConfigurationProp {
    navigateToList? : boolean
  }

const AwbLabelConfiguration = ({navigateToList}: IAwbLabelConfigurationProp) => {

    const dispatch = useDispatch<Dispatch<AWBLabelConfigActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const pageLabels = useTypedSelector(state => state.pageLabels.awbLabelConfiguration) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.awbLabelConfiguration)
    const structure = useTypedSelector(state => state.awbLabelConfiguration.structure)
    const columnsSelector = useTypedSelector(state => state.awbLabelConfiguration.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.awbLabelConfiguration.structure.buttons);
    const rowCount = useTypedSelector(state => state.awbLabelConfiguration.data.totalCount)
    const rowsSelector = useTypedSelector(state => state.awbLabelConfiguration.data.results)
    const loading = useTypedSelector(state => state.awbLabelConfiguration.loading.listView)
    const columnsLoading = useTypedSelector(state => state.awbLabelConfiguration.loading.columns);
    const toastObject = useTypedSelector(state => state.globalToast);

    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [pageType, setPageType] = useState<string>('list');
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [awbLabelActivationRequest, setAwbLabelActivationRequest] = useState<
    | { activeRequest: boolean; awbIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
    | undefined
  >();

    const toast = useToast()

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'awbLabelConfiguration', label: dynamicLabels.AWB_LABEL_CONFIGURATION }
    ], [dynamicLabels])

    useEffect(() => {
        dispatch({
            type: '@@awbLabelConfig/SET_COLUMNS_LOADING',
            payload: { columns: true }
        })
        dispatch({ type: '@@awbLabelConfig/FETCH_STRUCTURE'});
        dispatch({ type: '@@awbLabelConfig/INITIALISE_FORM' });
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }
    }, [])

    useEffect(() => {
        const mongoStructure = columnsSelector;    
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'awbLabelConfiguration', cellCallbackMapping);  
            setColumns(newColumns);
        }
    }, [columnsSelector]);

    useEffect(() => {
        toastDispatch({
            type: '@@globalToast/clear'
        })
        window.scrollTo(0, 0);
        if (pageType === 'list') {
            handleFetchData({});
        }
    }, [pageType])

    useEffect(() => {
        setPageType('list')
    },[navigateToList])


    const handleActiveFlChange = (
        isChecked: boolean,
        { awbTemplateId }: IRowData,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
      ) => {
        const awbIds = {
          [awbTemplateId]: true,
        };
        setAwbLabelActivationRequest({ activeRequest: isChecked, awbIds, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    };

    const onCancel = () => {
        setPageType('list')
    }

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
    }, [])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        
        sendGA('Column Preference Action', 'AWB Label Configuration - Save & Apply column');
        
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })    
        const payload = {
          ...structure,
          columns
        }   
        try {
          const { data: { message } } = await axios.put(apiMappings.awbLabelConfiguration.listView.structure, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
          console.log(error, error?.response)
        }    
    
    }, [columnsSelector])

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
        dispatch({
          type: '@@awbLabelConfig/SET_LOADING',
          payload: { listView: true }
        })

        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

        dispatch({
          type: '@@awbLabelConfig/FETCH_DATA',
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

    const handleAwbLabelConfigurationActivation = async () => {
        if (!awbLabelActivationRequest) {
          return;
        }
        setAwbLabelActivationRequest(undefined);
    
        if (Object.keys(awbLabelActivationRequest.awbIds).length === 1) {
          const awbTemplateId = Number(Object.keys(awbLabelActivationRequest.awbIds)[0]);
          dispatch({
            type: '@@awbLabelConfig/CHANGE_STATUS',
            payload: {
                awbTemplateId,
                isActiveFl: awbLabelActivationRequest.activeRequest
            },
          });
        }

        try {
          const {
            data: { message, status },
          } = await axios.put(apiMappings.awbLabelConfiguration.listView.activationRequest + `?awbTemplateId=${Number(Object.keys(awbLabelActivationRequest.awbIds)[0])}&isActive=${awbLabelActivationRequest.activeRequest}` );
          if (status === 200) {
            toast.add(message, 'check-round', false);
            handleFetchData(fetchOptions);
            setSelectedRows({});
            fetchOptions.apis?.resetSelection();
            return;
          }
          throw message;
        } catch (errorMessage) {
            awbLabelActivationRequest.failureCallback && awbLabelActivationRequest.failureCallback(!awbLabelActivationRequest.activeRequest);
          toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
        }
    };

    const handleAddAwbLabel = () => {
        ga.event({
            category: 'Navigation',
            action: 'AWB Label Configuration - Add button',
            label: 'AWB Label Configuration List View'
        })
        setPageType('form')
    }

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({
            type: '@@awbLabelConfig/SET_DATA', payload: {
                key: 'isEditAwbLabel',
                value: row
            }
        })
        setSelectedRows({})
        setPageType('form');
    }, []);

    const setAsFavourite = async (row: ISelectedRows) => {
        dispatch({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: true } })
        try {
            const isActiveFl = Object.values(row)?.map(row => Boolean(row.isActiveFl))?.[0]
            if(!isActiveFl) {
                toast.add(dynamicLabels?.markAsFavouriteInactiveMessage, 'warning', false);
                dispatch({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
                return;
            }
            const {
              data: { message, status },
            } = await axios.put(`${apiMappings.awbLabelConfiguration.listView.setFavourite}${(Object.keys(row).map((rowId: string) => Number(rowId)))[0]}`);
            if (status === 200) {
                toast.add(message, 'check-round', false);
              setSelectedRows && setSelectedRows({});
              dispatch({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
              fetchOptions.apis?.resetSelection();
              handleFetchData(fetchOptions)
              return;
            }
            throw message;
        } catch (errorMessage) {
            dispatch({ type: '@@awbLabelConfig/SET_LOADING', payload: { listView: false } })
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }
  
    }
    
    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (
                        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
                            {/* Header */}
                            <Box display='flex' justifyContent='space-between' style={{ width: '100%', marginTop: '20px' }}>
                                <BreadCrumb options={breadCrumbOptions} onClick={() => { }} />
                                {/* Page Action Buttons */}
                                    {pageLabels?.buttons.add && 
                                        <AddButtonWrapper className="add-button-wrapper">
                                            <Tooltip tooltipDirection= "bottom" arrowPlacement="center" messagePlacement="end" message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels?.awbLabelTemplate}.`} hover={true}>
                                                <IconButton id="AWBLabelConfig-actionBar-add" intent='page' iconVariant='icomoon-add' onClick={handleAddAwbLabel}>
                                                {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                                                </IconButton>
                                            </Tooltip>
                                        </AddButtonWrapper>
                    
                                    }
                            </Box>
                            
                            {/* LIST VIEW CONTAINER */}
                            <ListGridWrapper className="list-grid-wrapper" container spacing={5} style={{marginTop: '20px'}}>
                                <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
                                    <StyledGrid container spacing={15} style={{ boxShadow: '0 2px 20px -10px #000' }}>
                                        <Grid
                                            className='grid-customised-scroll-bar'
                                            item
                                            style={{ display: 'flex', overflow: 'hidden' }}
                                        >
                                            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
                                                {columns.length > 0 &&
                                                    <ListView
                                                        rowIdentifier='awbTemplateId'
                                                        hasRowSelectionWithEdit={true}
                                                        columns={columns}
                                                        data={rowsSelector}
                                                        totalRows={rowCount}
                                                        onFetchData={handleFetchData}
                                                        onRowSelect={onRowSelect}
                                                        loading={loading || false}
                                                        hideRefresh={loading}
                                                        isColumnLoading={columnsLoading}
                                                        onSaveColumnPreferences={onSaveColumnPreferences}
                                                        onRowEditClick={onRowEditClick}
                                                        style={{ height: '90vh' }}
                                                        // favouriteIcon='star-filled'
                                                        // isFavouriteSelection={true}
                                                        showFavouriteStar={true}

                                                    >
                                                        {{
                                                            ActionBar: (
                                                                <Box display='flex' horizontalSpacing='10px'>
                                                                    {actionBarButtons &&
                                                                        Object.keys(actionBarButtons).map((buttonKey, index) => {
                                                                            return <CreateActionBarButton
                                                                            buttonKey={buttonKey}
                                                                            buttonIndex={index}
                                                                            actionBarButton={actionBarButtons[buttonKey]}
                                                                            buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                                                            selectedRows={selectedRows}
                                                                            handleActionBarButtonClick={() => setAsFavourite(selectedRows)}
                                                                            isButtonDisabled={Object.keys(selectedRows).length !== 1 && actionBarButtons[buttonKey].permission || (Object.keys(selectedRows).length ? selectedRows[Object.keys(selectedRows)[0]].isFavourite : false)} />
                                                                        })
                                                                    }
                                                                </Box>
                                                            )
                                                        }}
                                                    </ListView>
                                                }
                                            </Card>
                                        </Grid>
                                    </StyledGrid>
                                </Grid>
                            </ListGridWrapper>
                        </Box>
                    ) : <AWBLabelConfigurationForm  onFormCancel={onCancel}/>
            }

            {/* ACTIVATION CONFIRMATION MODAL */}
            <Modal open={!!awbLabelActivationRequest} onToggle={() => { }} size='md'>
                {{
                header: (
                    <ModalHeader
                    headerTitle={dynamicLabels?.statusConfirmation}
                    imageVariant='icomoon-close'
                    handleClose={() => {
                        awbLabelActivationRequest?.failureCallback &&
                        awbLabelActivationRequest?.failureCallback(!awbLabelActivationRequest.activeRequest);
                        setAwbLabelActivationRequest(undefined);
                    }}
                    />
                ),
                content: (
                    <>
                    <div style={{ fontSize: '14px' }}>
                        {awbLabelActivationRequest?.activeRequest
                        ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                        : dynamicLabels.areYouSureYouWantToMarkAsInactive}
                    </div>
                    </>
                ),
                footer: (
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleAwbLabelConfigurationActivation}>
                        {dynamicLabels.ok}
                    </IconButton>
                    <IconButton
                        iconVariant='icomoon-close'
                        iconSize={11}
                        onClick={() => {
                            awbLabelActivationRequest?.failureCallback &&
                            awbLabelActivationRequest?.failureCallback(!awbLabelActivationRequest.activeRequest);
                            setAwbLabelActivationRequest(undefined);
                        }}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                    </Box>
                ),
                }}
            </Modal>

  
        </>
    )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(AwbLabelConfiguration)), 'toast-inject-here'))