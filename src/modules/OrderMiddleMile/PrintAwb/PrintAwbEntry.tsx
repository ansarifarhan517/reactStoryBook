import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Modal, ModalFooter, ModalHeader, DropDown, Loader } from 'ui-library'
import { withReactOptimized } from '../../../utils/components/withReact'
import { sendGA } from '../../../utils/ga'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { tMMOPrintAwbAction } from './PrintAwb.actions'
import usePrintAwbActions from './utils/usePrintAwbActions'
interface IPrintAwbProps {
  isOpen: boolean
  orderIds: number[]
  onClose: () => void
}

const PrintAwbEntry = ({ isOpen, orderIds, onClose }: IPrintAwbProps) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.middleMileOrderListView)
  const optionList = useTypedSelector(state => state.middleMileOrder.listView.printAwb.templateOptions)
  const optionsMap = useTypedSelector(state => state.middleMileOrder.listView.printAwb.templateOptionsMap)
  const dispatch = useDispatch<Dispatch<tMMOPrintAwbAction>>()
  const isOrderDetailsBeingFetched = useTypedSelector(state => state.middleMileOrder.listView.printAwb.loading.has('orderDetails'))

  const [value, setValue] = React.useState<string | undefined>()

  console.log("AWB entry File")
  React.useEffect(() => {
    setValue(optionList.find(o => optionsMap[o.value].isFavouriteFl === true)?.value)
  }, [optionList])

  const { handleOk } = usePrintAwbActions()

  React.useEffect(() => {
    // console.log('Mounting Print AWB')
    dispatch({ type: '@@MMO/PrintAwb/FETCH_TEMPLATE_OPTIONS' })
  }, [])

  React.useEffect(() => {
    if (isOpen && orderIds.length) {
      sendGA('List View Action Button click',`Midde Mile Order - Print Awb`)
      const apiLoadBalanceThreshold = 200
      if (orderIds.length > apiLoadBalanceThreshold) {
        Array(Math.ceil(orderIds.length / apiLoadBalanceThreshold)).fill(0).map((_, index) => {
          dispatch({
            type: '@@MMO/PrintAwb/FETCH_SELECTED_ORDERS_DETAILS',
            payload: orderIds.slice(index * apiLoadBalanceThreshold, (index + 1) * apiLoadBalanceThreshold)
          })
        })
      } else {
        dispatch({ type: '@@MMO/PrintAwb/FETCH_SELECTED_ORDERS_DETAILS', payload: orderIds })
      }
    } else {
      if (!isOpen) {
        dispatch({ type: '@@MMO/PrintAwb/RESET_DATA' })
      }
    }
  }, [isOpen])

  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)

  const handleHTMLModification = (value: string | undefined) => {
    if (!value) return
    if(optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML){
      optionsMap[value || ''].htmlData.orderHTML  = optionsMap[value || ''].htmlData.orderHTML = optionsMap[value || ''].htmlData.orderHTML.replaceAll('#$@$#ORDER_MM','')
    }
    handleOk(value, optionsMap[value || ''])
  }
  return (<Modal open={isOpen} width='600px' onToggle={() => { }}>
    {{
      header: <ModalHeader headerTitle={dynamicLabels.printAwb} handleClose={onClose} />,
      content: <div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
        {isOrderDetailsBeingFetched && <Loader center fadeBackground />}
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
        <IconButton iconVariant='icomoon-tick-circled' primary
          disabled={!(value) || isOrderDetailsBeingFetched}
          onClick={() => {
            handleHTMLModification(value)
          }}
        >{dynamicLabels.ok}</IconButton>
        <IconButton iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
          {dynamicLabels.cancel}
        </IconButton>
      </ModalFooter>
    }}
  </Modal>)
}

export default withReactOptimized(PrintAwbEntry)