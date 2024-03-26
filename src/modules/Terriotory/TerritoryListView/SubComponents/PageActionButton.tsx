import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Tooltip, IconButton, IFetchDataOptions } from 'ui-library'
import { sendGA } from '../../../../utils/ga'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import iconsMapping from '../../../../utils/mongo/ListView/actionBarIcons.mapping'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { StyledButtonGroup } from '../StyledTerritoryList'
import { ISetViewMode, tTerritoryListActions } from '../TerritoryList.actions'
import { IFilters } from '../../../common/AdvancedSearch/interface';

export interface IActionProps {
    fetchOptions: IFetchDataOptions,
    appliedAdvancedFilterData?: IFilters[] | []
}

const PageActionButtons = ({fetchOptions}: IActionProps) => {

    const pageLabels = useTypedSelector(state => state.pageLabels.geofenceMaster) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence)
    const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
    
    const viewMode = useTypedSelector(state => state.territory.listView.viewMode)

    const buttonTooltip = {
        mapview: `${dynamicLabels.clickHereToViewThe} ${dynamicLabels.geofence_p} ${dynamicLabels.onAMap}`,
        listview: `${dynamicLabels.clickheretoViewListof} ${dynamicLabels.geofence_p}`,
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
        dispatch({ type: '@@territoryList/SET_VIEW_MODE', payload: id} as ISetViewMode)
        dispatch({ type: '@@territoryList/FETCH_STRUCTURE' })
        if(id === 'mapview'){
            sendGA('ListView ActionBar','Territory List - Button Click - Map View')
        }
        dispatch({type: '@@territoryList/FETCH_DATA',
            payload: {
                params: {
                    pageNumber: fetchOptions.pageNumber,
                    pageSize: id === 'mapview' ? 1000 : fetchOptions.pageSize,
                    searchBy: fetchOptions?.filterOptions?.searchBy,
                    searchText: fetchOptions?.filterOptions?.searchText,
                    sortBy: fetchOptions?.sortOptions?.sortBy,
                    sortOrder: fetchOptions?.sortOptions?.sortOrder
                }
            }
        })
    }
    
    return (
        <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {pageLabels?.buttons.add && (
                <Tooltip message={`${dynamicLabels.clickHereToAdd} ${dynamicLabels?.geofence}.`} hover={true}>
                    <IconButton
                    id="territory--actionbar--add"
                    intent='page'
                    iconVariant='icomoon-add'
                    onClick={() => {
                        sendGA('Navigation','Button Click - Button Click - Add Geofence Master')
                        hybridRouteTo('addgeofence');
                    }}

                    >
                    {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
                    </IconButton>
                </Tooltip>
            )}

            {ButtonGroupData.length > 0 && (

                <StyledButtonGroup
                    data={ButtonGroupData}
                    onChange={(id: string) => {
                        dispatch({ type: '@@territoryList/SET_SHOW_ADVANCE_FILTER', payload: false})
                        return buttonGroupClick(id)
                    }}
                />
            )}
        </Box>
    )
}

export default PageActionButtons