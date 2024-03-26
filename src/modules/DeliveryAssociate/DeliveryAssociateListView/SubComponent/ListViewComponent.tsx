import React, { useEffect } from 'react';
import { ColumnInstance, SortingRule } from 'react-table';
import {
    Box,
    ListView,
    IListViewColumn,
    IFetchDataOptions,
    IconButton,
    ISelectedRows,
    Tooltip,
    IFilterOptions
} from 'ui-library';
import { sendGA } from '../../../../utils/ga';
import { hybridRouteTo } from '../../../../utils/hybridRouting';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import withRedux from '../../../../utils/redux/withRedux';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { IDropdown, IRowData } from '../DeliveryAssociate.models';
import LabelMapping from '../LabelMapping';
import CreateActionBarButton from '../../../common/ActionBar/CreateActionBarButton'
import AdvancedFilterComponent from '../../../common/AdvancedFilterComponent'

interface IListView {
    columns: IListViewColumn[]
    onRowSelect: (s: ISelectedRows) => void
    onSortChange: () => void
    onSaveColumnPreferences: (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => void
    isEditMode: boolean
    setIsPrint: React.Dispatch<React.SetStateAction<boolean>>
    showDownload: boolean
    setShowDownload: React.Dispatch<React.SetStateAction<boolean>>
    fetchOptions: IFetchDataOptions
    selectedRows: ISelectedRows
    handleSaveRows: () => void
    handleActionBarButtonClick: (action: string) => void
    handleCancelRowsChange: () => void
    MoreButtonOptionList: IDropdown[]
    handleMoreOptions: (id: string) => void
    handleFetchData: (fetchOptions: IFetchDataOptions) => void
    handleFetchFilters : () => void
    handleRemoveFilter : () => void
    openAdvFilter?: boolean
    appliedFilterId?: string | undefined
    onHandleApply?: (selectedColumns: Record<string, boolean>) => void
    showColumnShimmer?: boolean
    setShowColumnShimmer: (value: boolean) => void
    isSaveClicked?: boolean
    sort: SortingRule<object>[] | undefined
    filter: Record<string, string> | undefined
    handleFilterChange: (combinedFilters: IFilterOptions) => void
    pageName?:string
}


const ListViewComponent = ({ columns,
    pageName,
    handleFetchData,
    onRowSelect,
    onSortChange,
    onSaveColumnPreferences,
    isEditMode,
    setIsPrint,
    showDownload,
    setShowDownload,
    selectedRows,//
    handleSaveRows,
    handleFetchFilters,
    handleRemoveFilter,
    handleActionBarButtonClick,
    handleCancelRowsChange,
    onHandleApply,
    showColumnShimmer,
    setShowColumnShimmer,
    handleMoreOptions,
    isSaveClicked,
    sort, filter, handleFilterChange
}: IListView) => {
    /** Redux Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    const columnSelector = useTypedSelector(state => state.deliveryMedium.listView.structure.columns);
    const actionBarButtons = useTypedSelector(state => state.deliveryMedium.listView.structure.buttons);
    const viewMode = useTypedSelector(state => state.deliveryMedium.listView.viewMode);
    const rowsSelector = useTypedSelector(state => state.deliveryMedium.listView.data.results);
    const loading = useTypedSelector(state => state.deliveryMedium.listView.loading.listView);
    const totalRowsSelector = useTypedSelector(state => state.deliveryMedium.listView.data.totalCount);
    const clientMetric = useTypedSelector(state => state.deliveryMedium.listView.clientMetric);
    const initailFetchDone = useTypedSelector(state => state.deliveryMedium.listView.initailFetchDone)
    const AdvanceFilterData = { 
        sectionName : 'deliveryMedium' 
    }

    // const isTotalCountLoading = useTypedSelector(state => state.deliveryMedium.listView.loading.isTotalCountLoading)


    // const buttonList = React.useMemo(() => {
    //     const buttonArray: any = []
    //     actionBarButtons && Object.keys?.(actionBarButtons)?.forEach(buttonKey => {
    //         if (actionBarButtons?.[buttonKey]?.permission) {
    //             buttonArray.push(buttonKey)
    //         }
    //     })
    //     return buttonArray

    // }, [actionBarButtons])


    useEffect(() => {
        const firstEntry: any = Object.values(columnSelector)?.[0]
        // we have created dummy data for shimmer there not providing label,in actual data label will be there so show shimmer if dummy data

        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 100)
        }
    }, [columnSelector])
    handleFetchFilters();
    const buttonToolTipTextList = {
        delete: `${LabelMapping.clickheretoDeleteTheSelected} ${dynamicLabels?.deliveryboy_p}.`,
        update: `${LabelMapping.clickheretoUpdateTheSelected} ${dynamicLabels?.deliveryboy_p}.`,
        more: `${LabelMapping.clickheretoUpdateStatusOfTheSelected} ${dynamicLabels?.deliveryboy_p}.`,
        bulkUpdate: `${LabelMapping.clickheretoperformBulkUpdate} ${dynamicLabels?.deliveryboy_p}.`,
        changePwd: `${LabelMapping.clickheretoChangePassword} ${dynamicLabels?.deliveryboy_p}.`,
        notify: `${LabelMapping.clickheretoSendNotifyMsg} ${dynamicLabels?.deliveryboy_p}.`,
    };
    // show only notify case
    const selectedRowsIntransitIncluded = !!Object.values(selectedRows).find((row: any) => row.statusCd === 'Intransit');
    //disable notify case
    const selectedRowsInactiveIncluded = !!Object.values(selectedRows).find((row: any) => row.statusCd === 'Inactive');
    const selectedRowsAvailableIncluded = !!Object.values(selectedRows).find((row: any) => row.statusCd === 'Available');

    // if no data in row or columns not loaded yet,show row shimmer (!firstRowEntry?.deliveryMediumMasterName- checking api entry for row)
    const showShimmer = (showColumnShimmer || loading)
    // console.log(showShimmer,'showShimmershowShimmershowShimmer')

    return <ListView
        id='delivery-associate'
        rowIdentifier='deliveryMediumMasterId'
        style={{ height: '100%', overflow: 'visible', boxShadow: '0px 2px 20px -10px #000 !important' }}
        columns={columns}
        data={rowsSelector}
        hideRefresh={!!showShimmer}
        onFetchData={clientMetric.length != 0 || initailFetchDone ? handleFetchData : undefined}
        onRowSelect={onRowSelect}
        onSortChange={onSortChange}
        onSaveColumnPreferences={onSaveColumnPreferences}
        totalRows={totalRowsSelector}
        loading={!!showShimmer}
        // isTotalCountLoading={isTotalCountLoading}
        isEditMode={isEditMode}
        onRowEditClick={(row: IRowData) => {
            hybridRouteTo(`deliverymedium/updatedeliverymedium/?deliverymediumid=${row.deliveryMediumMasterId}`);
        }}
        permanentColumns={{
            deliveryMediumMasterName: true,
            branchName: true,
            phoneNumber: true,
        }}
        paginationPageSize={50}
        isColumnLoading={showColumnShimmer}
        onApply={onHandleApply}
        hasRowSelection={viewMode !== 'mapview' && !actionBarButtons?.['InlineEdit']?.permission}
        hasRowSelectionWithEdit={viewMode !== 'mapview' && actionBarButtons?.['InlineEdit']?.permission}
        sorts={sort}
        filters={filter}
        onFilterChange={handleFilterChange}

    >
        {{
            IconBar: (
                <Box display='flex' style={{ position: 'relative' }}>
                    <Tooltip message={`${dynamicLabels?.print}`} hover>
                        <IconButton
                            iconVariant='print'
                            iconSize={16}
                            onlyIcon
                            style={{ color: 'inherit' }}
                            onClick={() => {
                                sendGA('ListView Action Bar','Delivery Associate Button Click - Print')
                                setIsPrint(true)
                            }}
                            id='Print'
                        />
                    </Tooltip>
                    <div>
                        <Tooltip
                            message={`Download ${dynamicLabels?.deliveryBoy} Report`}
                            arrowPlacement='center'
                            messagePlacement='end'
                            hover
                            hide={showDownload}
                        >
                            <IconButton
                                id='Download'
                                iconVariant='icomoon-download'
                                iconSize={16}
                                onlyIcon
                                style={{ color: 'inherit' }}
                                onClick={() => setShowDownload(true)}
                            />
                        </Tooltip>
                    </div>
                    <AdvancedFilterComponent
                                pageName={pageName}
                                handleFetchFilters={handleFetchFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                handleFetchData={handleFetchData}
                                data={AdvanceFilterData}
                                needsFetchDataCall={false}
                    />
                </Box>
            ),
            ActionBar: (
                <Box display='flex' horizontalSpacing='10px'>
                    {isEditMode ? (
                        <>
                            <Tooltip message={`${dynamicLabels?.save}`} hover>
                                <IconButton
                                    intent='table'
                                    id='listView-actionBar-save'
                                    iconVariant='icomoon-save'
                                    onClick={handleSaveRows}
                                    disabled={!Object.keys(selectedRows).length || isSaveClicked} // to restrict user to click on save and cancel
                                >
                                    {dynamicLabels?.save}
                                </IconButton>
                            </Tooltip>
                            <Tooltip message={`${dynamicLabels?.cancel}`} hover>
                                <IconButton
                                    intent='table'
                                    id='listView-actionBar-cancel'
                                    iconVariant='icomoon-close'
                                    onClick={() => {
                                        sendGA('Event New','Delivery Associate Button Click - Inline update cancel')
                                        handleCancelRowsChange()
                                    }}
                                    disabled={!Object.keys(selectedRows).length || isSaveClicked} // to restrict user to click on save and cancel
                                >
                                    {dynamicLabels?.cancel}
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                            // if save button is disable false that means just updated entry then show these btns.(at loading even if there is no data show these btns changes)-other changes needs to be done from library
                            !isSaveClicked && actionBarButtons &&

                            Object.keys(actionBarButtons).map(
                                (buttonKey, index) => {
                                    switch (buttonKey) {
                                        case 'InlineEdit': {
                                            return null;
                                        }
                                        case 'more': {
                                            return <CreateActionBarButton
                                                pageName={pageName}
                                                buttonKey={buttonKey}
                                                buttonIndex={index}
                                                actionBarButton={actionBarButtons[buttonKey]}
                                                buttonToolTipTextList={buttonToolTipTextList[buttonKey]}
                                                selectedRows={selectedRows}
                                                handleActionBarButtonClick={handleMoreOptions}
                                                isButtonDisabled={selectedRowsIntransitIncluded && actionBarButtons[buttonKey].permission} />
                                        }
                                        case 'notify': {
                                            return <CreateActionBarButton
                                                buttonKey={buttonKey}
                                                buttonIndex={index}
                                                actionBarButton={actionBarButtons[buttonKey]}
                                                buttonToolTipTextList={buttonToolTipTextList[buttonKey]}
                                                selectedRows={selectedRows}
                                                handleActionBarButtonClick={handleActionBarButtonClick}
                                                isButtonDisabled={selectedRowsInactiveIncluded || (!selectedRowsAvailableIncluded && !selectedRowsIntransitIncluded)} />
                                        }
                                        default: {
                                            return <CreateActionBarButton
                                                buttonKey={buttonKey}
                                                buttonIndex={index}
                                                actionBarButton={actionBarButtons[buttonKey]}
                                                buttonToolTipTextList={buttonToolTipTextList[buttonKey]}
                                                selectedRows={selectedRows}
                                                handleActionBarButtonClick={handleActionBarButtonClick}
                                                isButtonDisabled={selectedRowsIntransitIncluded && actionBarButtons[buttonKey].permission} />
                                        }
                                    }

                                }
                            )
                        )}
                </Box>
            ),
        }}
    </ListView>
}

export default withRedux(ListViewComponent);
