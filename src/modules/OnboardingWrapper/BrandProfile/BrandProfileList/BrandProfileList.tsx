import React, { Dispatch, useEffect, useState } from 'react'
import withRedux from '../../../../utils/redux/withRedux'
import { withThemeProvider } from '../../../../utils/theme'
import { withToastProvider, withPopup, IListViewColumn, ISelectedRows, useToast, Box, BreadCrumb, IconButton, Grid, Card, ListView, 
    IListViewRow, IFetchDataOptions, ModalHeader, Modal, Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { ColumnInstance } from 'react-table'
import { BrandProfileListActions } from './BrandProfileList.actions'
import { useDispatch } from 'react-redux'
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView'
import { sendGA } from '../../../../utils/ga'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { AddBrandProfileButtonWrapper, StyledGrid, ListGridWrapper, BrandProfilePageHeader, SubHeader } from './BrandProfileListStyledComponents'
import BrandProfileForm from './BrandProfileForm'
import { IRowData } from './BrandProfileList.models'
import { tGlobalToastActions } from '../../../common/GlobalToasts/globalToast.reducer'

interface IBrandProfileListProps {
    stateParams: any
}


const BrandProfileList = ({ stateParams }: IBrandProfileListProps) => {

    const dispatch = useDispatch<Dispatch<BrandProfileListActions>>()
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const pageLabels = useTypedSelector(state => state.pageLabels.brandingProfiles) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.brandProfile)
    const structure = useTypedSelector(state => state.brandProfile.listView.structure)
    const columnsSelector = useTypedSelector(state => state.brandProfile.listView.structure.columns)
    const rowCount = useTypedSelector(state => state.brandProfile.listView.data.totalCount)
    const rowsSelector = useTypedSelector(state => state.brandProfile.listView.data.results)
    const loading = useTypedSelector(state => state.brandProfile.listView.loading.listView)
    const columnsLoading = useTypedSelector(state => state.brandProfile.listView.loading.columns);
    const toastObject = useTypedSelector(state => state.globalToast);

    const [columns, setColumns] = useState<IListViewColumn[]>([])
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
    const [pageType, setPageType] = useState<string>('list');
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [brandProfileActivationRequest, setBrandProfileActivationRequest] = useState<
    | { activeRequest: boolean; brandProfileIds: Record<number, boolean>; failureCallback?: React.Dispatch<React.SetStateAction<boolean>> }
    | undefined
  >();
    const [isShipperConfig, setIsShipperConfig] = useState<boolean>(false);
    const subClientID =  stateParams?.shipperDetails && stateParams?.shipperDetails.subClientId ? stateParams.shipperDetails.subClientId : undefined
    const isShipperPage= window.location.href.indexOf("shipper/settings") > -1
    const toast = useToast()

    const breadCrumbOptions = React.useMemo(() => [
        { id: 'brandProfiles', label: dynamicLabels.brandProfiles }
    ], [dynamicLabels])

    useEffect(() => {
        if (window.location.href.includes('shipper')) {
            setIsShipperConfig(true);
        } else {
            setIsShipperConfig(false);
        }
        dispatch({
          type: '@@brandProfileList/SET_COLUMNS_LOADING',
          payload: { columns: true }
        })
        dispatch({ type: '@@brandProfileList/FETCH_STRUCTURE'})
        dispatch({ type: '@@brandProfileList/INITIALISE_FORM' });
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }
    }, [])

    useEffect(() => {
        const mongoStructure = columnsSelector;    
        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'brandProfile', cellCallbackMapping);  
            setColumns(newColumns);
        }
    }, [columnsSelector]);

    useEffect(() => {
        if (toastObject?.message) {
            toast.add(toastObject?.message, toastObject?.icon || '', toastObject?.remove || false);
        }
        toastDispatch({
            type: '@@globalToast/clear'
        })
        window.scrollTo(0, 0);
        if (pageType === 'list') {
            handleFetchData({});
        }
    }, [pageType])


    const onCancel = () => {
        setPageType('list')
    }

    const handleBrandProfileActivation = async () => {
        if (!brandProfileActivationRequest) {
          return;
        }
        setBrandProfileActivationRequest(undefined);
    
        if (Object.keys(brandProfileActivationRequest.brandProfileIds).length === 1) {
          const brandProfileId = Number(Object.keys(brandProfileActivationRequest.brandProfileIds)[0]);
          dispatch({
            type: '@@brandProfileList/CHANGE_STATUS',
            payload: {
                brandProfileId,
                isActiveFl: brandProfileActivationRequest.activeRequest
            },
          });
        }

        try {
          const {
            data: { message, status },
          } = await axios.put(apiMappings.brandProfile.listView.activationRequest + `?brandProfileId=${Number(Object.keys(brandProfileActivationRequest.brandProfileIds)[0])}&isActive=${brandProfileActivationRequest.activeRequest}` +
            `${subClientID ? `&subClientId=${subClientID}` : ''}` );
          if (status === 200) {
            toast.add(message, 'check-round', false);
            handleFetchData(fetchOptions);
            setSelectedRows({});
            fetchOptions.apis?.resetSelection();
            return;
          }
          throw message;
        } catch (errorMessage) {
          brandProfileActivationRequest.failureCallback && brandProfileActivationRequest.failureCallback(!brandProfileActivationRequest.activeRequest);
          toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false);
        }
    };

    const handleActiveFlChange = (
        isChecked: boolean,
        { brandProfileId }: IRowData,
        failureCallback: React.Dispatch<React.SetStateAction<boolean>>,
      ) => {
        const brandProfileIds = {
          [brandProfileId]: true,
        };
        setBrandProfileActivationRequest({ activeRequest: isChecked, brandProfileIds, failureCallback });
    };

    const cellCallbackMapping = {
        isActiveFl: handleActiveFlChange
    };

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s);
        console.log(selectedRows);
    }, [])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        
        sendGA('Column Preference Action','Brand Profile ListView - Brand Profile - Save & Apply column')
        
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey]
        })    
        const payload = {
          ...structure,
          columns
        }   
        try {
          const { data: { message } } = await axios.put(apiMappings.brandProfile.listView.structure, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
          console.log(error, error?.response)
        }    
    
    }, [columnsSelector])

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }) => {
        dispatch({
          type: '@@brandProfileList/SET_LOADING',
          payload: { listView: true }
        })

        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis });

        dispatch({
          type: '@@brandProfileList/FETCH_DATA',
          payload: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder,
            subClientId: subClientID
          }
        })
    }, [])

    const handleAddBrandProfile = () => {
        sendGA('Navigation','Brand Profile ListView - Brand Profile - Add button')
        setPageType('form')
    }

    const onRowEditClick = React.useCallback((row: IListViewRow) => {
        dispatch({
            type: '@@brandProfileList/SET_DATA', payload: {
                key: 'isEditBrandProfile',
                value: row
            }
        })
        setPageType('form');
    }, []);



    return (
        <>
            <div id='toast-inject-here'></div>
            {
                pageType === 'list' ?
                    (

                        <Box display='flex' flexDirection='column' style={{ width: '100%', height: '100%' }} px='15px' pb='15px'>
                            {/* Header */}
                            <Box display='flex' alignItems="flex-start" justifyContent='space-between' style={{ width: '100%', margin: "18px 0" }}>
                                <BrandProfilePageHeader>
                                    <BreadCrumb options={breadCrumbOptions} />
                                    {isShipperPage && <SubHeader>{dynamicLabels['shipperBrandProfileNote']}</SubHeader>}
                                </BrandProfilePageHeader>
                                {/* Page Action Buttons */}
                                    {pageLabels?.buttons.add && !isShipperConfig && 
                                        <AddBrandProfileButtonWrapper >
                                            <Tooltip message={`${dynamicLabels?.clickHereToAdd} ${dynamicLabels?.brandProfile}`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                                                <IconButton
                                                intent='page'
                                                data-tip
                                                data-for='add_vehicle_cm'
                                                iconVariant='icomoon-add'
                                                id='brandingProfile--actionbar--add'
                                                onClick={handleAddBrandProfile}>
                                                {dynamicLabels.add}
                                                </IconButton>
                                            </Tooltip>
                                        </AddBrandProfileButtonWrapper>
                                    }

                                    {pageLabels?.buttons.add && isShipperConfig &&
                                        <>
                                            <Tooltip message={`${dynamicLabels?.clickHereToAdd} ${dynamicLabels?.brandProfile}`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                                                <IconButton
                                                intent='page'
                                                data-tip
                                                data-for='add_vehicle_cm'
                                                iconVariant='icomoon-add'
                                                onClick={handleAddBrandProfile}>
                                                {dynamicLabels.add}
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                            </Box>
                            
                            {/* LIST VIEW CONTAINER */}
                            <ListGridWrapper className="list-grid-wrapper" container spacing={5}>
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
                                                        rowIdentifier='brandProfileId'
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
                                                    />
                                                }
                                            </Card>
                                        </Grid>
                                    </StyledGrid>
                                </Grid>
                            </ListGridWrapper>
                        </Box>
                    ) : <BrandProfileForm  onFormCancel={onCancel} stateParams={stateParams}/>
            }

            {/* ACTIVATION CONFIRMATION MODAL */}
            <Modal open={!!brandProfileActivationRequest} onToggle={() => { }} size='md'>
                {{
                header: (
                    <ModalHeader
                    headerTitle={dynamicLabels?.statusConfirmation}
                    imageVariant='icomoon-close'
                    handleClose={() => {
                        brandProfileActivationRequest?.failureCallback &&
                        brandProfileActivationRequest?.failureCallback(!brandProfileActivationRequest.activeRequest);
                        setBrandProfileActivationRequest(undefined);
                    }}
                    />
                ),

                content: (
                    <>
                    <div style={{ fontSize: '14px' }}>
                        {brandProfileActivationRequest?.activeRequest
                        ? dynamicLabels.areYouSureYouWantToMarkAsAcitve
                        : dynamicLabels.areYouSureYouWantToMarkAsInactive}
                    </div>
                    </>
                ),
                footer: (
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton id={`${brandProfileActivationRequest?.activeRequest
                        ? 'Active-Modal'
                        : 'Inactive-Modal'}--actionBar--Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleBrandProfileActivation}>
                        {dynamicLabels.ok}
                    </IconButton>
                    <IconButton
                         id={`${brandProfileActivationRequest?.activeRequest
                            ? 'Active-Modal'
                            : 'InActive-Modal'}--actionBar--Cancel`}
                        iconVariant='icomoon-close'
                        iconSize={11}
                        onClick={() => {
                            brandProfileActivationRequest?.failureCallback &&
                            brandProfileActivationRequest?.failureCallback(!brandProfileActivationRequest.activeRequest);
                            setBrandProfileActivationRequest(undefined);
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

export default withThemeProvider(withToastProvider(withRedux(withPopup(BrandProfileList)), 'toast-inject-here'))