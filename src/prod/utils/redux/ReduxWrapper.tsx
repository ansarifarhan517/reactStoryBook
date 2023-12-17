import React, { useEffect, Dispatch } from 'react'

import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import store from './store'
import { useToast, withToastProvider } from 'ui-library'
import useDynamicLabels from '../../modules/common/DynamicLabels/useDynamicLabels'
import { IPageLabelsAction } from '../../modules/common/PageLabelStructure/pageLabels.actions'
import { AdvancedSearchActions } from '../../modules/common/AdvancedSearch/AdvancedSearch.actions';
import DYNAMIC_LABELS_MAPPING from '../../modules/common/DynamicLabels/dynamicLabels.mapping'
import useClientProperties from '../../modules/common/ClientProperties/useClientProperties'
import { withThemeProvider } from '../theme'
import { useTypedSelector } from './rootReducer'
import { useGlobalPopup } from '../../modules/common/GlobalPopup/useGlobalPopup'
import { fixTooltipIssue } from './fixTooltipIssue'
import useFeaturePanel from '../../modules/FeaturePanel/useFeaturePanel'
import useMetricsConversion from '../../modules/common/ClientProperties/useMetricsConversion'

const App = withThemeProvider(withToastProvider(() => {
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[0])
  useDynamicLabels(DYNAMIC_LABELS_MAPPING.common[1])
  useClientProperties(['DATEFORMAT', 'TIMEZONE', 'BASECURRENCY'])
  const globalToast = useTypedSelector(state => state.globalToast)
  const toast = useToast()
  const globalPopup = useGlobalPopup()
  const { fetchMetrics } = useMetricsConversion()

  const dispatch = useDispatch<Dispatch<IPageLabelsAction>>()
  const dispatchAdvancedSearch = useDispatch<Dispatch<AdvancedSearchActions>>()

  useFeaturePanel()

  useEffect(() => {
    dispatch({ type: '@@pageLabels/FETCH_DATA' })
    dispatchAdvancedSearch({ type: "@@advancedSearch/FETCH_DATA" })
    fixTooltipIssue()
    // dispatchAdvancedSearch({ type: "@@advancedSearch/FETCH_DATA" })
    fetchMetrics()
  }, [])

  useEffect(() => {
    if (globalToast.message) {
      toast.add(globalToast.message, globalToast.icon || '', globalToast.remove || false)
    }
  }, [globalToast])

  return (
    <div style={{ position: 'relative' }}>
      <div id='toast-inject-here'></div>
      {globalPopup}
      <div ui-view=""></div>
    </div>)
}, 'toast-inject-here'))

const ReduxWrapper: React.FC = () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
)
export default ReduxWrapper