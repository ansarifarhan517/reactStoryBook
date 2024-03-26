import React, { Dispatch,useEffect,useMemo} from 'react'
import { Modal, ModalHeader, ModalFooter, IconButton, Loader, DropDown } from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { useDispatch } from 'react-redux';
import { ManifestListActions } from '../ManifestList.actions';
import { IMongoDynamicHTMLTemplate } from '../../../../utils/common.interface';
import { IOrderPrintManifestTemplateData } from './PrintManifest.models';
import usePrintingManifest from './UsePrintingManifest';

interface IPrintManifestProps {
    orderIds: string[]
}
const PrintManifestModal = ({ orderIds }: IPrintManifestProps) => {
    const dispatch = useDispatch<Dispatch<ManifestListActions>>()
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const { templates, orderDetails, isModalOpen } = useTypedSelector(state => state.manifest.printManifest)
    const [value, setValue] = React.useState<string | undefined>()
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false)
    const { handlePrinting } = usePrintingManifest()

    const optionList = useMemo(() => {
        return templates && templates.map(o => ({ label: o.name, value: o.id }))
    }, [templates])

    const optionsMap: Record<string, IMongoDynamicHTMLTemplate<IOrderPrintManifestTemplateData>> = useMemo(() => {
        return templates && templates?.reduce((accumulator, current) => ({ ...accumulator, [current.id]: current }), {})
    }, [templates])
    
    useEffect(() => {
        if (!value) {
            setTimeout(() => {
              templates && setValue(templates.find(o => o.isFavouriteFl)?.id)
            }, 300)
        }
    }, [templates])

    useEffect(() => {
        dispatch({ type: '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES' })
    }, [])

    useEffect(() => {
        if (isModalOpen && orderIds.length) {
            const apiLoadBalanceThreshold = 200
            if (orderIds.length > apiLoadBalanceThreshold) {
            Array(Math.ceil(orderIds.length / apiLoadBalanceThreshold)).fill(0).map((_, index) => {
                dispatch({
                    type: '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS',
                    payload: orderIds.slice(index * apiLoadBalanceThreshold, (index + 1) * apiLoadBalanceThreshold)
                })
            })
            } else {
                dispatch({ type: '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS', payload: orderIds })
            }
        } else {
            if (!isModalOpen) {
            // dispatch({ type: '@@MMO/PrintAwb/RESET_DATA' })
            }
        }
    }, [isModalOpen])

    const handleDataModification = () => {
      //IMP :- Do Not change the ID of the templates
      
      if(optionsMap[value || ''] && optionsMap[value || ''].htmlData.orderHTML){
          optionsMap[value || ''].htmlData.orderHTML = optionsMap[value || ''].htmlData.orderHTML.replaceAll('#$@$#ORDER','')
      }

      handlePrinting(optionsMap[value || ''])
  }

    const onClose = React.useCallback(() => {
        dispatch({ type: '@@manifestList/SET_PRINT_MANIFEST_MODAL_OPEN', payload: false })
    }, []
    )
    return (
      <Modal open={isModalOpen} width='600px' onToggle={() => { }}>
      {{
        header: <ModalHeader headerTitle={dynamicLabels.printManifestTemp || 'Print Manifest'} handleClose={onClose} />,
        content: <div onClick={() => setIsMenuOpen(o => !o)} style={{ position: 'relative' }}>
          {orderDetails?.length === 0 && <Loader center fadeBackground />}
          <DropDown
            label={dynamicLabels.manifestTemplate}
            placeholder={dynamicLabels.manifestTemplate}
            variant='form-select'
            optionList={optionList}
            onChange={setValue}
            value={value}
            isMenuOpen={isMenuOpen}
          />
        </div>,
        footer: <ModalFooter>
          <IconButton id="printManifest-Modal-OK" iconVariant='icomoon-tick-circled' primary
            disabled={!(value) || orderDetails?.length === 0}
            onClick={() => {
              handleDataModification()
            }}
          >{dynamicLabels.ok || 'Ok'}</IconButton>
          <IconButton id="printManifest-Modal-cancel" iconVariant='icomoon-close' onClick={onClose} iconSize={11}>
            {dynamicLabels.cancel}
          </IconButton>
        </ModalFooter>
      }}
    </Modal>
  )
}

export default PrintManifestModal