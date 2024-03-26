import React, { Dispatch, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Modal, ModalFooter, ModalHeader, DropDown, Loader } from 'ui-library'
import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface'
import { sendGA } from '../../../utils/ga'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import store from '../../../utils/redux/store'
import { OrderListViewActions } from '../OrderListView/OrderListView.actions'
import { IOrderPrintAWBTemplateData } from './PrintAWB.models'
import useAWBPrinting from './useAWBPrinting'

interface IPrintAwbProps {
  orderIds: string[]
}

const PrintAWBModal = ({ orderIds }: IPrintAwbProps) => {
  const isModalOpen = useTypedSelector(state => state.order.listView.printAWB.isModalOpen)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const templates = useTypedSelector(state => state.order.listView.printAWB.templates)
  const awbOrderDetails = useTypedSelector(state => state.order.listView.printAWB.orderDetails)

  const { handlePrinting } = useAWBPrinting()
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)

  const optionList = useMemo(() => {
    return templates.map(o => ({ label: o.name, value: o.id }))
  }, [templates])

  const optionsMap: Record<string, IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>> = useMemo(() => {
    return templates.reduce((accumulator, current) => ({ ...accumulator, [current.id]: current }), {})
  }, [templates])

  useEffect(() => {
    if (!value) {
      setValue(templates.find(o => o.isFavouriteFl)?.id)
    }
  }, [templates])

  const dispatch = useDispatch<Dispatch<OrderListViewActions>>()

  const [value, setValue] = React.useState<string | undefined>()

  const handleDataModification = () => {
    // LN-1492: For TRANSGUARD, shipper address was Branch Address which is being replaced with Rows originAddress
    const orderSelectedRows = store.getState().order.listView.selectedRows;
    //IMP :- Do Not change the ID of the templates 
    if(optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML.includes('TRANSGUARD') && Object.keys(orderSelectedRows).length > 0 && awbOrderDetails.length > 0){
      awbOrderDetails.map((eachAwbData : any) => {
        Object.values(orderSelectedRows).map((eachSelectedRow: any) => {
          if (((eachSelectedRow.isP2POrder && eachSelectedRow.isP2POrder == true) || eachSelectedRow.orderType == 'PICKUP')  && eachAwbData.shipmentId == eachSelectedRow.shipmentId) {
            if (eachAwbData.clientNodeDTOs) {
              if (eachAwbData?.clientNodeDTOs) {
                if(eachAwbData.clientNodeDTOs.length > 0){
                    eachAwbData.clientNodeDTOs[0].address = eachSelectedRow.originAddress;
                    eachAwbData.clientNodeDTOs[0].name = eachSelectedRow.pickupAccountName;
                    eachAwbData.clientNodeDTOs[0].clientNodePhone = eachSelectedRow.originClientNodePhone;
                }
                if(eachAwbData.clientNodeDTOs.length > 2){
                    eachAwbData.clientNodeDTOs[2].address = eachSelectedRow.originAddress;
                    eachAwbData.clientNodeDTOs[2].name = eachSelectedRow.pickupAccountName;
                    eachAwbData.clientNodeDTOs[2].clientNodePhone = eachSelectedRow.originClientNodePhone;
                }
              }
  
            }
        }
        })
      })
    }
    if(optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML){
      optionsMap[value || ''].htmlData.orderHTML = optionsMap[value || ''].htmlData.orderHTML.replaceAll('#$@$#ORDER','')
    }

    handlePrinting(optionsMap[value || ''])
  }


  React.useEffect(() => {
    dispatch({ type: '@@orderListView/FETCH_AWB_HTML_TEMPLATES' })
   
  }, [])

  React.useEffect(() => {
    if (isModalOpen && orderIds.length) {
      sendGA('ListView ActionBar',`Order/Milestone List View Print Awb`)
      const apiLoadBalanceThreshold = 200
      if (orderIds.length > apiLoadBalanceThreshold) {
        Array(Math.ceil(orderIds.length / apiLoadBalanceThreshold)).fill(0).map((_, index) => {
          dispatch({
            type: '@@orderListView/FETCH_AWB_ORDER_DETAILS',
            payload: orderIds.slice(index * apiLoadBalanceThreshold, (index + 1) * apiLoadBalanceThreshold)
          })
        })
      } else {
        dispatch({ type: '@@orderListView/FETCH_AWB_ORDER_DETAILS', payload: orderIds })
      }
    } else {
      if (!isModalOpen) {
        // dispatch({ type: '@@MMO/PrintAwb/RESET_DATA' })
      }
    }
  }, [isModalOpen])

  const onClose = React.useCallback(() => {
    dispatch({ type: '@@orderListView/SET_AWB_MODAL_OPEN', payload: false })
  }, [])

  return (<Modal open={isModalOpen} width='600px' onToggle={() => { }}>
    {{
      header: <ModalHeader headerTitle={dynamicLabels.printAwb} handleClose={onClose} />,
      content: <div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
        {awbOrderDetails.length === 0 && <Loader center fadeBackground />}
        <DropDown
          label={dynamicLabels.awbLabelTemplate}
          placeholder={dynamicLabels.awbLabelTemplate}
          variant='form-select'
          optionList={optionList}
          onChange={setValue}
          value={value}
          isMenuOpen={isMenuOpen}
        // onMenuOpen={() => setIsMenuOpen(true)}
        // onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>,
      footer: <ModalFooter>
        <IconButton id='printAWB-Modal-button-OK' iconVariant='icomoon-tick-circled' primary
          disabled={!(value) || awbOrderDetails.length === 0}
          onClick={() => {
            handleDataModification()
          }}
        >{dynamicLabels.ok}</IconButton>
        <IconButton id='printAWB-Modal-button-close' iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
          {dynamicLabels.cancel}
        </IconButton>
      </ModalFooter>
    }}
  </Modal>)
}

export default PrintAWBModal