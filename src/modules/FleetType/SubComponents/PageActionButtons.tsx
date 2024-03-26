import React, { Dispatch } from 'react'
import { Box, IconButton, Tooltip } from 'ui-library'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import { sendGA } from '../../../utils/ga'
import { IStateService } from 'angular-ui-router'

interface IPageActionButton {
  ngStateRouter: IStateService
}

const PageActionButtons = ({ ngStateRouter }: IPageActionButton) => {
  /** Redux */
  const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const pageLabels = useTypedSelector(state => state.pageLabels.fleetType)
  {/* Page Action Buttons */ }
  return <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
    {pageLabels?.buttons.add && (
      <Tooltip message={`Click here to ${dynamicLabels?.add} ${dynamicLabels?.fleet_s}.`} hover={true} messagePlacement={'end'}>
        <IconButton
          intent='page'
          iconVariant='icomoon-add'
          onClick={() => {
            hybridRouteTo('fleetTypeForm')
            ngStateRouter.go('fleetTypeForm')
            
          }}
        >
          {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
        </IconButton>
      </Tooltip>)}
    {pageLabels?.buttons.upload && (
      <Tooltip
        message={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.fleet_s}.`}
        hover={true}
        arrowPlacement='center'
        messagePlacement='end'
      >
        <IconButton intent='page' style={{ marginRight: 0 }} iconVariant='icomoon-upload' onClick={() => {
          sendGA('Event New' ,`Fleet type ListView -  Upload button Clicked`)
          dispatch({ type: '@@fleetTypeListView/SET_UPLOAD_MODAL', payload: true })

        }}>
          {dynamicLabels?.[pageLabels?.buttons.upload] || dynamicLabels?.Upload}
        </IconButton>
      </Tooltip>
    )}
  </Box>


}

export default PageActionButtons