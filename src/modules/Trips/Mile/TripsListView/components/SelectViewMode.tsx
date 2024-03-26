import React, { Dispatch } from 'react'
import { ButtonGroup, IButtonGroupOption } from 'ui-library'
import { useTypedSelector } from '../../../../../utils/redux/rootReducer'
import { tTripsListMileActions } from '../TripsListView.actions'
import { useDispatch } from 'react-redux'
import { getQueryParams, createURLParams, hybridRouteTo, routeContains } from '../../../../../utils/hybridRouting'
import { tTripsListMileModes } from '../TripsListView.model'

const SelectViewMode = () => {
  /** Redux */
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const pageLabels = useTypedSelector(state => state.pageLabels)
  const viewMode = useTypedSelector(state => state.trips.listView.mile.viewMode)
  const breadCrumbFilter = useTypedSelector(state => state.trips.listView.mile.breadcrumbFilter);
  const dispatch = useDispatch<Dispatch<tTripsListMileActions>>()

  /** Internal State */
  /** 
   * Use internal state to reflect changes instead of Redux State. 
   * This is because lot of updates happen on UI on change of redux viewMode. 
   * ButtonGroup state should take precedence.
   */
  const [_viewMode, _setViewMode] = React.useState<tTripsListMileModes>(viewMode)

  React.useEffect(() => {
    const { view } = getQueryParams()

    dispatch({ type: '@@tripsListViewMile/SET_VIEW_MODE', payload: view || 'listview' })
    _setViewMode(view || 'listview')
  }, [])

  const data: IButtonGroupOption[] = React.useMemo(() => {
    return [
      { id: 'listview', label: pageLabels.trips?.viewOptions?.listview?.toUpperCase(), icon: 'list-view', selected: _viewMode === 'listview', tooltipText: `${dynamicLabels.showsTheListViewOfAllThe} ${dynamicLabels.trips}` },
      { id: 'mapview', label: pageLabels.trips?.viewOptions?.mapview?.toUpperCase(), icon: 'map-view', selected: _viewMode === 'mapview', tooltipText: `${dynamicLabels.showsTheCurrentLocationOfThe} ${dynamicLabels.trips} on a ${pageLabels.trips?.viewOptions?.mapview}` }
    ]
  }, [_viewMode, dynamicLabels, pageLabels])

  const handleChange = React.useCallback((id) => {
    _setViewMode(id)
    // upsertUrlParam('view', id)
    dispatch({ type: '@@tripsListViewMile/SET_VIEW_MODE', payload: id })
    const routeTo = routeContains('page=') ? 'trips/' + createURLParams('view', id) : 'trips/' + createURLParams('view', id) + '&page=' + breadCrumbFilter;
    hybridRouteTo(routeTo);

  }, [])

  return <ButtonGroup data={data} onChange={handleChange} />
}

export default SelectViewMode