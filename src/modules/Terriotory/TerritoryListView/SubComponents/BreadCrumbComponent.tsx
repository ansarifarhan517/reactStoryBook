import React, { Dispatch } from 'react'
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import { IBreadcrumbOptionsProps } from '../TerritoryList.models';
import { BreadCrumb } from 'ui-library';
import { useDispatch } from 'react-redux';
import { tTerritoryListActions } from '../TerritoryList.actions';
import { BreadCrumbTagWrapper, } from '../StyledTerritoryList';

const BreadCrumbComponent = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence)
    const dispatch = useDispatch<Dispatch<tTerritoryListActions>>()
    
    const breadcrumbState = useTypedSelector(state => state.territory.listView.breadcrumbState);
    const breadcrumbData = useTypedSelector(state => state.territory.listView.breadcrumbData);

    const breadCrumbOptions = React.useMemo(() => { 
        const selectedData = breadcrumbData.filter((obj) => obj.id == Number(breadcrumbState))
        const breadcrumbLabel = selectedData && selectedData.length ? selectedData[0].profileName : 'Default'
        return[
            { id: 'Trip Planning', label: dynamicLabels['Trip Planning'] },
            { id: 'allTerritories', label: `${dynamicLabels.all} ${dynamicLabels.geofence_p}` },
            { id: breadcrumbState, label: breadcrumbLabel, disabled: false },
        ]
    }, [breadcrumbData, dynamicLabels, breadcrumbState])

    const changeListView = (selectedOption: string) => {
        console.log('selected option===========', selectedOption)
        dispatch({ type: '@@territoryList/SET_BREADCRUMB_STATE', payload: selectedOption})
        dispatch({ type: '@@territoryList/FETCH_STRUCTURE' })
        // dispatch({
        //     type: '@@territoryList/FETCH_DATA',
        //     payload: {
        //         params: {
        //             pageNumber: 1,
        //             pageSize: 50
        //         }
        //     }
        // })
    }

    const setFavouriteGeofence = (selectedOption: string) => {
        dispatch({ type: '@@territoryList/FETCH_GEOFENCEBYID', payload: selectedOption})
    }

    return (
        <BreadCrumbTagWrapper>
            <BreadCrumb
            options={(breadCrumbOptions as unknown) as IBreadcrumbOptionsProps[]}
            optionList={ breadcrumbData }
            onClick={changeListView}
            width='260px'
            onSetAsFavourite={(option) => setFavouriteGeofence(option.id)}
        />
          </BreadCrumbTagWrapper>
    )
}

export default BreadCrumbComponent