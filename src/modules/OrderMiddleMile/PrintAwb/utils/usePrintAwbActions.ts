import { useCallback } from 'react'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { baseTemplate, extractFieldsFromHTML, replaceFieldWithData } from '../PrintAwb.constants'
import {IPrintAwbTemplateResponse } from './../PrintAwb.models'

const usePrintAwbActions = () => {
  const optionsMap = useTypedSelector(state => state.middleMileOrder.listView.printAwb.templateOptionsMap)
  const selectedOrderDetails = useTypedSelector(state => state.middleMileOrder.listView.printAwb.selectedOrderDetails)
  const NALabel = useTypedSelector(state => state.dynamicLabels['NA.htmlTemplateField'] || '')
  
  const handleOk = useCallback((value: string | undefined,template: IPrintAwbTemplateResponse, callback: () => void = () => {} ) => {
    let mywindow = window.open('', '_blank');

    if (!value) return

    let combinedOrderPrintContent = ''
    const { orderHTML, crateHTML, itemHTML } = template.htmlData

    /** Extract Dynamic Fields from orderHTML template */
    const orderTemplateFields = extractFieldsFromHTML(orderHTML)
    const crateTemplateFields = extractFieldsFromHTML(crateHTML)
    const itemTemplateFields = extractFieldsFromHTML(itemHTML)
    selectedOrderDetails.forEach((orderObj) => {
      const customFields: Record<string, string> = {}
      orderObj.customFieldsList?.forEach(({field, value}) => {
        customFields[field] = value || ''
      })
      
      const orderDetail = { ...orderObj, ...customFields }
      /** Insert Page Break after template for every orderId */
      let printContent = `<div style='page-break-after: always;'>${orderHTML}</div>`

      /** Replace Order Fields with relevant data */
      orderTemplateFields.forEach((field) => {
        printContent = replaceFieldWithData(printContent, field, orderDetail[field] || NALabel)
      })


      /** Find if <Crate /> exist & replace it with Crate Templates (x) times - x: Number of Crates for the order */
      if (printContent.includes('<Crate />') && orderDetail.crates?.length) {
        let crateContent = ''

        orderDetail.crates && orderDetail.crates.forEach((crateObj) => {
          crateContent += crateHTML
          const crateDetail = { ...orderDetail, ...crateObj }

          crateTemplateFields.forEach((field) => {
            crateContent = replaceFieldWithData(crateContent, field, crateDetail[field] || NALabel)
          })

          /** Find if <Item /> exist & replace it with Item Templates (x) times - x: Number of Items for the Crate */
          if (crateContent.includes('<Item />') && crateDetail.shipmentlineitems.length) {
            let itemContent = ''

            crateDetail.shipmentlineitems.forEach((itemObj) => {
              itemContent += itemHTML
              const itemDetail = { ...crateDetail, ...itemObj }

              itemTemplateFields.forEach((field) => {
                itemContent = replaceFieldWithData(itemContent, field, itemDetail[field] as string || NALabel)
              })
            })
            crateContent = crateContent.replace(/<Item \/>/g, itemContent)
          } else {
            crateContent = crateContent.replace(/<Item \/>/g, '')
          }
        })

        /** If yes, Render Crates HTML template in place of <crates /> */
        printContent = printContent.replace(/<Crate \/>/g, crateContent)
      } else {
        printContent = printContent.replace(/<Crate \/>/g, '')
      }

      combinedOrderPrintContent += printContent
    })

    let finalPrintContent: string = baseTemplate.replace(':dynamic-content', combinedOrderPrintContent)

    mywindow?.document.write(finalPrintContent)

    const timeout = selectedOrderDetails.length > 100 ? 4000 : 3000 
    setTimeout(() => {
      mywindow?.document.close(); // necessary for IE >= 10
      mywindow?.focus(); // necessary for IE >= 10*/
      mywindow?.print();
      mywindow?.close();
      callback();
    }, timeout)

    return true;
  }, [optionsMap, selectedOrderDetails, NALabel])

  return { handleOk }
}

export default usePrintAwbActions