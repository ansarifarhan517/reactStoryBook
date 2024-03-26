import React from 'react';
import { Box, ListView, Tooltip, IconButton, IconDropdown, IListViewColumn, IFetchDataOptions, ISelectedRows, IFilterOptions, ISortOptions } from 'ui-library';
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis';
import { hybridRouteTo } from '../../../../utils/hybridRouting';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { IRowData } from '../TerritoryList.models';
import { ColumnInstance } from 'react-table'
import { sendGA } from '../../../../utils/ga';
import iconsMapping from '../../../../utils/mongo/ListView/actionBarIcons.mapping';
import { SortingRule } from 'react-table';
import NoDataView from '../../../../utils/components/NoDataView';
import AdvancedFilterComponent from '../../../common/AdvancedFilterComponent';

interface IListView {
    columns: IListViewColumn[]
    handleFetchData: (fetchOptions: IFetchDataOptions) => void
    onRowSelect: (s: ISelectedRows) => void
    onSaveColumnPreferences: (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => void
    handleFetchFilters: () => void
    handleRemoveFilter: (obj: any) => void
    isEditMode: boolean
    handleSaveRows: () => void
    selectedRows: ISelectedRows
    handleCancelRowsChange: () => void
    handleMoreOptions: (id: string) => void
    handleActionClick: (id: string) => void
    filters:Record<string, string>
    handleFilterChange: (filterOptions: IFilterOptions) => void
    sort: SortingRule<object>[] | undefined
    handleSortChange: (sortOptions: ISortOptions) => void
    handleDownloadReport: () => void
}

const ListViewComponent = ({
    columns,
    handleFetchData,
    onRowSelect,
    onSaveColumnPreferences,
    handleRemoveFilter,
    handleFetchFilters,
    isEditMode,
    handleSaveRows,
    selectedRows,
    handleCancelRowsChange,
    handleMoreOptions,
    handleActionClick,
    filters,
    handleFilterChange,
    sort,
    handleSortChange,
    handleDownloadReport
}: IListView) => {
    
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence)

    const loading = useTypedSelector(state => state.territory.listView.loading.listView)
    const columnsLoading = useTypedSelector(state => state.territory.listView.loading.columns);
    const viewMode = useTypedSelector(state => state.territory.listView.viewMode)
    const rowsSelector = useTypedSelector(state => state.territory.listView.data.results)
    const rowCount = useTypedSelector(state => state.territory.listView.data.totalCount)
    const actionBarButtons = useTypedSelector(state => state.territory.listView.structure.buttons);
    const emptyData = useTypedSelector(state => state.territory.listView.emptyData)
    const isSaveClicked = useTypedSelector(state => state.territory.listView.isSaveClicked)

    const moreButtonLabelsMapping = {
        active: {
            label: dynamicLabels?.markAsActive,
            tooltipText: dynamicLabels?.markStatusAsActive
        },
        inActive: {
            label: dynamicLabels?.markAsInactive,
            tooltipText: dynamicLabels?.markStatusAsInactive
        }
    }
    const AdvanceFilterData = { 
        sectionName : 'territory' 
    }
    const buttonList= React.useMemo(()=>{
        const buttonArray:any=[]
        actionBarButtons && Object.keys?.(actionBarButtons)?.forEach(buttonKey => {
            if (actionBarButtons?.[buttonKey]?.permission) {
                buttonArray.push(buttonKey)
            }
        })
        return buttonArray
    },[actionBarButtons])

    const MoreButtonOptionList = React.useMemo(() => {
        const moreButtonsArray:any=[]
        actionBarButtons && actionBarButtons?.['more']?.['dropdownValues'] && Object.keys?.(actionBarButtons['more']['dropdownValues'])?.forEach(buttonKey => {
            moreButtonsArray.push({value: buttonKey, label: moreButtonLabelsMapping[buttonKey].label, tooltipText: moreButtonLabelsMapping[buttonKey].tooltipText})
        })
        return moreButtonsArray
    }, [dynamicLabels, actionBarButtons])

    const buttonToolTipTextList = {
        delete: `${dynamicLabels?.clickheretoDeleteTheSelected} ${dynamicLabels?.geofence_p}.`,
        update: `${dynamicLabels?.clickheretoUpdateTheSelected} ${dynamicLabels?.geofence_p}.`,
        more: `${dynamicLabels?.clickheretoUpdateStatusOfTheSelected} ${dynamicLabels?.geofence_p}.`,
    };

    const onApply = () => {
        sendGA('Column Preference Action','Territory List - Apply column preferences')
    }

    return (<>
        { emptyData ? <NoDataView
            image='images/territories.png'
            message={`No ${dynamicLabels?.geofence} added yet. Click on the below button to add ${dynamicLabels?.geofence}.`}
            buttonList={[{
                name: `Add ${dynamicLabels?.geofence}`,
                icon: 'icomoon-add',
                href: 'addgeofence'
            }
            ]}
        /> :
        (<ListView

            rowIdentifier='geofenceId'
            columns={columns}
            data={rowsSelector}
            totalRows={rowCount}
            onRowEditClick={(row: IRowData) => {
                hybridRouteTo(`addgeofence?gid=${row.geofenceId}`);
            }}
            onFetchData={handleFetchData}
            onRowSelect={onRowSelect}
            loading={loading}
            isColumnLoading={columnsLoading}
            onSaveColumnPreferences={onSaveColumnPreferences}
            style={{ height: '90vh' }}
            hasRowSelection={viewMode === 'mapview' || (viewMode === 'listview' && !actionBarButtons?.['update']?.permission)}
            hasRowSelectionWithEdit={viewMode !== 'mapview'  && actionBarButtons?.['update']?.permission}
            isEditMode={isEditMode}
            filters={filters}
            onFilterChange={handleFilterChange}
            sorts={sort}
            onSortChange={handleSortChange}
            onApply={onApply}
        >
            {{
                IconBar:
                <>
                    <Tooltip message={`${dynamicLabels.download} ${dynamicLabels?.geofence} ${dynamicLabels.report}.`} hover={true} tooltipDirection="bottom" arrowPlacement="center" messagePlacement="end">
                        <IconButton
                            intent="page"
                            onlyIcon
                            primary={false}
                            iconVariant="icomoon-download"
                            onClick={handleDownloadReport}
                            iconSize={16}
                            style={{ color: 'inherit' }}
                            className="territoryReportDownload"
                        />
                    </Tooltip>
                    {(viewMode === 'listview') &&  
                            <AdvancedFilterComponent
                                handleFetchFilters={handleFetchFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                handleFetchData={handleFetchData}
                                data={AdvanceFilterData}
                                needsFetchDataCall={false}
                    />}
                </>,
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
                                            sendGA('Event New','Territory List - Inline update cancel')
                                            handleCancelRowsChange()
                                        }}
                                        disabled={!Object.keys(selectedRows).length || isSaveClicked} // to restrict user to click on save and cancel
                                    >
                                        {dynamicLabels?.cancel}
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : (
                                !isSaveClicked && actionBarButtons && 
                                Object.keys(actionBarButtons).map((buttonKey) => {
                                    return actionBarButtons[buttonKey]?.permission &&
                                    ( buttonKey === 'more' ? (
                                        <IconDropdown
                                            key={buttonKey}
                                            intent='table'
                                            id={`territory--actionBar--${buttonKey}`}
                                            variant={'button-dropdown'}
                                            optionList={MoreButtonOptionList}
                                            width='120px'
                                            tooltipMessage={`${buttonToolTipTextList[buttonKey]
                                                    ? buttonToolTipTextList[buttonKey]
                                                    : buttonKey
                                                }`}
                                            iconButtonDetails={[
                                                'icomoon-funnel-options',
                                                actionBarButtons[buttonKey].labelKey,
                                                'icomoon-angle-bottom',
                                            ]}
                                            // if no selection or in selected rows  intransit status there then only disable
                                            disabled={
                                                (Object.keys(selectedRows).length === 0)
                                            }
                                            onChange={handleMoreOptions}
                                            isSingleClickOption
                                        />

                                    ) : buttonKey !== 'advancedSearch' ? (
                                        <Tooltip
                                            messagePlacement={(((buttonList[0] === buttonKey)) || buttonKey === 'update') ? 'start' : 'center'}
                                            hover
                                            message={`${buttonToolTipTextList[buttonKey]
                                                    ? buttonToolTipTextList[buttonKey]
                                                    : buttonKey
                                                }`}
                                            key={buttonKey}
                                        >
                                            <IconButton
                                                key={buttonKey}
                                                // if no selection or in selected rows intransit there then only disable
                                                disabled={(Object.keys(selectedRows).length === 0)}
                                                intent='table'
                                                iconVariant={iconsMapping[buttonKey]}
                                                id={`listView-actionBar-${buttonKey}`}
                                                onClick={() => handleActionClick(buttonKey)}
                                            >
                                                <TextOverflowEllipsis>{actionBarButtons[buttonKey].label}</TextOverflowEllipsis>
                                            </IconButton>
                                        </Tooltip>
                                    ) : null)
                                })
                        )}
                    </Box>
                )
            }}
        </ListView>)
        }
        </>
    )
}

export default ListViewComponent