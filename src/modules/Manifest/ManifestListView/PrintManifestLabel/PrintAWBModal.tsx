import React, { Dispatch, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton, Modal, ModalFooter, ModalHeader, DropDown, Loader } from 'ui-library'
import { IMongoDynamicHTMLTemplate } from '../../../../utils/common.interface'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { ManifestListActions } from '../ManifestList.actions'
import { IOrderPrintAWBTemplateData } from './PrintAWB.models'
import useAWBPrinting from './useAWBPrinting'

interface IPrintAwbProps {
  orderIds: string[]
}

const PrintAWBModal = ({ orderIds }: IPrintAwbProps) => {
  const isModalOpen = useTypedSelector(state => state.manifest.printAWB.isModalOpen)
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const templates = useTypedSelector(state => state.manifest.printAWB.templates)
  const awbOrderDetails = useTypedSelector(state => state.manifest.printAWB)

  const { handlePrinting } = useAWBPrinting()
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)

  const optionList = useMemo(() => {
    return templates && templates.map(o => ({ label: o.name, value: o.id }))
  }, [templates])

  const optionsMap: Record<string, IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>> = useMemo(() => {
    return templates && templates?.reduce((accumulator, current) => ({ ...accumulator, [current.id]: current }), {})
  }, [templates])

  useEffect(() => {
    if (!value) {
      templates && setValue(templates.find(o => o.isFavouriteFl)?.id)
    }
  }, [templates])

  const dispatch = useDispatch<Dispatch<ManifestListActions>>()

  const [value, setValue] = React.useState<string | undefined>()

  const handleDataModification = () => {
    //IMP :- Do Not change the ID of the templates 
    
    if(optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML){
      optionsMap[value || ''].htmlData.orderHTML = optionsMap[value || ''].htmlData.orderHTML.replaceAll('#$@$#ORDER','')
    }

    handlePrinting(optionsMap[value || ''])
  }


  React.useEffect(() => {
    dispatch({ type: '@@manifestList/FETCH_AWB_HTML_TEMPLATES' })
  }, [])

  React.useEffect(() => {
    if (isModalOpen && orderIds.length) {
      // sendGA('ListView ActionBar',`Order/Milestone List View Print Awb`)
      const apiLoadBalanceThreshold = 200
      if (orderIds.length > apiLoadBalanceThreshold) {
        Array(Math.ceil(orderIds.length / apiLoadBalanceThreshold)).fill(0).map((_, index) => {
          dispatch({
            type: '@@manifestList/FETCH_AWB_ORDER_DETAILS',
            payload: orderIds.slice(index * apiLoadBalanceThreshold, (index + 1) * apiLoadBalanceThreshold)
          })
        })
      } else {
        dispatch({ type: '@@manifestList/FETCH_AWB_ORDER_DETAILS', payload: orderIds })
      }
    } else {
      if (!isModalOpen) {
        // dispatch({ type: '@@MMO/PrintAwb/RESET_DATA' })
      }
    }
  }, [isModalOpen])

  const onClose = React.useCallback(() => {
    dispatch({ type: '@@manifestList/SET_AWB_MODAL_OPEN', payload: false })
  }, [])

  return (<Modal open={isModalOpen} width='600px' onToggle={() => { }}>
    {{
      header: <ModalHeader headerTitle={dynamicLabels.printManifestLabel || 'Print Manifest Label'} handleClose={onClose} />,
      content: <div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
        {awbOrderDetails?.length === 0 && <Loader center fadeBackground />}
        <DropDown
          label={dynamicLabels.manifestLabelTemplate}
          placeholder={dynamicLabels.manifestLabelTemplate}
          variant='form-select'
          optionList={optionList}
          onChange={setValue}
          value={value}
          isMenuOpen={isMenuOpen}
        />
      </div>,
      footer: <ModalFooter>
        <IconButton id='ManifestLabel-Modal-button-Offboard' iconVariant='icomoon-tick-circled' primary
          disabled={!(value) || awbOrderDetails?.length === 0}
          onClick={() => {
            handleDataModification()
          }}
        >{dynamicLabels.ok || 'Ok'}</IconButton>
        <IconButton id='ManifestLabel-Modal-button-Cancel' iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
          {dynamicLabels.cancel}
        </IconButton>
      </ModalFooter>
    }}
  </Modal>)
}

export default PrintAWBModal