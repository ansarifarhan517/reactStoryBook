import React, { Dispatch } from 'react'
import { Box, IconButton, Tooltip } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { useDispatch } from 'react-redux'
import { tShipperListViewAcions } from '../ShipperListView.actions'
import { sendGA } from '../../../../utils/ga'


const PageActionButtons = () => {
  /** Redux */
  const dispatch = useDispatch<Dispatch<tShipperListViewAcions>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const pageLabels = useTypedSelector(state => state.pageLabels.shipper)
  const userAccessInfo = localStorage.getItem('userAccessInfo')
  const isShipper = JSON.parse(userAccessInfo || '{}').isSuperClient == false
  {/* Page Action Buttons */ }
  return <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
    {pageLabels?.buttons.add && !isShipper &&(
      <Tooltip message={`${dynamicLabels?.clickHereToAdd} ${dynamicLabels?.shipper_s}.`} hover={true}>
        <IconButton
          intent='page'
          id="shipper--actionbar--add"
          iconVariant='icomoon-add'
          onClick={() => {
            dispatch({ type: '@@shipperListView/SET_SELECTED_ROWS', payload: {} });
            hybridRouteTo('shipper/settings/profile')
          }}
        >
          {dynamicLabels?.[pageLabels?.buttons.add] || dynamicLabels.add}
        </IconButton>
      </Tooltip>)}
    {pageLabels?.buttons.upload && !isShipper &&(
      <Tooltip
        message={`${dynamicLabels.clickHereToUploadNew} ${dynamicLabels.shipper_s}.`}
        hover={true}
        arrowPlacement='center'
        messagePlacement='end'
      >
        <IconButton  id="shipper--actionbar--upload" intent='page' style={{ marginRight: 0 }} iconVariant='icomoon-upload' onClick={() => {
          sendGA('Event New','Shipper List View - Upload Clicked')
          dispatch({ type: '@@shipperListView/SET_UPLOAD_MODAL', payload: true })

        }}>
          {dynamicLabels?.[pageLabels?.buttons.upload] || dynamicLabels?.Upload}
        </IconButton>
      </Tooltip>
    )}
  </Box>


}

export default PageActionButtons