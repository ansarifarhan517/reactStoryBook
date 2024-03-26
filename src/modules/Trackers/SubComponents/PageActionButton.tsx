import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Tooltip, IconButton, IFetchDataOptions } from 'ui-library'
import { sendGA } from '../../../utils/ga'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { StyledButtonGroup } from '../TrackersListView/TrackersListViewStyledComponents'
import { TrackersListViewActions, ISetViewMode } from '../TrackersListView/TrackersListView.actions'
import { IFilters } from '../../common/AdvancedSearch/interface';
import { IStateService } from 'angular-ui-router'
import { AdvancedFilterComponentActions } from "../../common/AdvancedFilterComponent/AdvancedFilterComponent.actions";

export interface IActionProps {
    fetchOptions: IFetchDataOptions,
    appliedAdvancedFilterData?: IFilters[] | [],
     ngStateRouter: IStateService

}

const PageActionButtons = ({fetchOptions ,ngStateRouter}: IActionProps) => {

    const pageLabels = useTypedSelector(state => state.pageLabels.allTrackers) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.trackers)
    const dispatch = useDispatch<Dispatch<TrackersListViewActions>>()
    const advanceFilterdispatch = useDispatch<Dispatch<AdvancedFilterComponentActions>>();
    const viewMode = useTypedSelector(state => state.tracker.trackers.listView.viewMode)

    const buttonTooltip = {
        mapview: `${dynamicLabels.clickHereToViewThe} ${dynamicLabels.tracker_p} ${dynamicLabels.onAMap}`,
        listview: `${dynamicLabels.clickheretoViewListof} ${dynamicLabels.tracker_p}`,
    };

    const ButtonGroupData = React.useMemo(() =>
    pageLabels?.viewOptions ?
      Object.keys(pageLabels?.viewOptions).map((key: string) => ({
        id: key,
        label: pageLabels?.viewOptions[key].toUpperCase(),
        selected: key === viewMode,
        icon: key === 'mapview' ? 'location-marker' : iconsMapping[key],
        tooltipText: buttonTooltip[key]
      }))
      : []
    , [pageLabels, viewMode, dynamicLabels])
    const buttonGroupClick = (id: string) => {
    dispatch({ type: '@@trackersListView/SET_VIEW_MODE', payload: id} as ISetViewMode)
        dispatch({ type: '@@trackersListView/FETCH_TRACKER_LISTVIEW_STRUCTURE' })
        if(id === 'mapview'){
            sendGA('ListView ActionBar','Tracker List - Button Click - Map View')
        }
        dispatch({type: '@@trackersListView/FETCH_TRACKERS_LIST',
            payload: {
                    pageNumber: fetchOptions.pageNumber,
                    pageSize: id === 'mapview' ? 1000 : fetchOptions.pageSize,
                    searchBy: fetchOptions?.filterOptions?.searchBy,
                    searchText: fetchOptions?.filterOptions?.searchText,
                    sortBy: fetchOptions?.sortOptions?.sortBy,
                    sortOrder: fetchOptions?.sortOptions?.sortOrder
                }
        })
    }
    
    return (
        <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {pageLabels?.buttons.add && (
                <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels?.tracker_s}.`} hover={true}>
                    <IconButton
                    id='TrackersListView-actionBar-add'
                    intent='page'
                    iconVariant='icomoon-add'
                    onClick={() => {
                        
                        hybridRouteTo('trackerForm')
                        ngStateRouter.go('trackerForm')
                        
                    }}
                    >
                    {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                    </IconButton>
                </Tooltip>
            )}
            {pageLabels?.buttons.upload && (
                <Tooltip message={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels?.tracker_p}.`} hover={true}>
                    <IconButton
                    id='TrackersListView-actionBar-upload'

                    intent='page'
                    iconVariant='icomoon-upload'
                    onClick={() => {
                        sendGA('Excel Upload','Tracker List View Button Click - Upload')
                        dispatch({type:'@@trackerListView/SET_UPLOAD_MODAL', payload : true})
                    }}
                    >
                    {dynamicLabels?.[pageLabels?.buttons.upload] || dynamicLabels.upload}
                    </IconButton>
                </Tooltip>
            )}

            {ButtonGroupData.length > 0 && (
                <StyledButtonGroup
                    data={ButtonGroupData}
                    onChange={(id: string) => {
                        advanceFilterdispatch({ type: '@@advanceFilter/SET_OPEN_ADV_FILTER', payload: false})
                        return buttonGroupClick(id)
                    }}
                />
            )}
        </Box>
    )
}

export default PageActionButtons