import { useCallback, useMemo } from 'react'
// import { IRowData } from '../ManifestList.models'
import { ISelectedRows } from 'ui-library'
import { ILogiAPIResponse } from '../../../../utils/api.interfaces'
import apiMappings from '../../../../utils/apiMapping'
import axios, { userAccessInfo } from '../../../../utils/axios'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { extractFieldsFromHTML, replaceFieldWithData } from '../../../OrderMiddleMile/PrintAwb/PrintAwb.constants'
import { IManifestListDataPayload } from '../ManifestList.models'
import moment from 'moment-timezone'
import useMetricsConversion from '../../../common/ClientProperties/useMetricsConversion'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'

const baseTemplate = `
  <!DOCTYPE html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
    </head>

    :dynamic-content
  </html>
`

const usePrintManifest = (selectedRows: ISelectedRows) => {
  const manifestHTMLTemplate = useTypedSelector(state => state.manifest.printManifestTemplate)
  const manifestLabelHTMLTemplate = useTypedSelector(state => state.manifest.printManifestLabelTemplate)
  const NALabel = useTypedSelector(state => state.dynamicLabels['NA.htmlTemplateField'] || '')
  const clientProperties = useTypedSelector(state => state.clientProperties)
  const { convertMetricsForDisplay } = useMetricsConversion()
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.statusLabels)
  
  const dateTimeFormat = useMemo(() => {
    return `${(clientProperties?.DATEFORMAT?.propertyValue || 'YYYY-MM-DD').toUpperCase()} hh:mm A`
  }, [clientProperties?.DATEFORMAT])

  const fetchPrintData = useCallback(async () => {
    const data = {
      manifestId: Object.values(selectedRows).map((obj => obj.manifestNo))
    }
    try {
      const { data: response } = await axios.post<ILogiAPIResponse<IManifestListDataPayload>>(apiMappings.manifest.listView.data, data)

      return response.data.results.map((manifestObj) => {
        return {
          ...manifestObj,
          clientLogo: userAccessInfo.clientLogo,
          manifestCreationDate: moment.utc(manifestObj.manifestCreationDate).tz(clientProperties?.TIMEZONE?.propertyValue || '').format(dateTimeFormat),
          totalWeight: convertMetricsForDisplay(manifestObj.totalWeight, 'weight'),
          totalVolume: convertMetricsForDisplay(manifestObj.totalVolume, 'volume'),
        }
      })
    } catch (error) {
      console.log('Failed to fetch print data: ', error, error?.response)
      return []
    }
  }, [selectedRows])

  const handlePrintManifest = useCallback(async () => {
    const selectedManifestDetails = await fetchPrintData()

    let mywindow = window.open('', '_blank');

    let combinedManifestPrintContent = ''
    const { manifestHTML, shipmentHTML } = manifestHTMLTemplate?.htmlData || {}

    if (manifestHTML === undefined || shipmentHTML === undefined) {
      return
    }

    const manifestTemplateFields = extractFieldsFromHTML(manifestHTML)
    const shipmentTemplateFields = extractFieldsFromHTML(shipmentHTML)

    selectedManifestDetails.forEach((manifestObj) => {
      const manifestDetail = { ...manifestObj }

      let printContent = `${manifestHTML}`
      manifestTemplateFields.forEach((field) => {
        printContent = replaceFieldWithData(printContent, field, manifestDetail[field] || NALabel)
      })

      if (printContent.includes('<Shipment />') && manifestDetail.shipmentsLst?.length) {
        let shipmentContent = ''

        manifestDetail.shipmentsLst.forEach((shipmentObj) => {
          shipmentContent += shipmentHTML

          const shipmentDetail = { ...manifestDetail, ...shipmentObj, packageStatusCd: dynamicLabels[shipmentObj.packageStatusCd] }

          shipmentTemplateFields.forEach((field) => {
            shipmentContent = replaceFieldWithData(shipmentContent, field, shipmentDetail[field] || NALabel)
          })
        })

        printContent = printContent.replace(/<Shipment \/>/g, shipmentContent)
      } else {
        printContent = printContent.replace(/<Shipment \/>/g, '')
      }

      combinedManifestPrintContent += printContent
    })

    let finalPrintContent = baseTemplate.replace(':dynamic-content', combinedManifestPrintContent)

    mywindow?.document.write(finalPrintContent)


    setTimeout(() => {
      mywindow?.document.close(); // necessary for IE >= 10
      mywindow?.focus(); // necessary for IE >= 10*/
      mywindow?.print();
      mywindow?.close();
    }, 500)

    return true;

  }, [selectedRows])

  const handlePrintManifestLabel = useCallback(async () => {
    const selectedManifestDetails = await fetchPrintData()

    let mywindow = window.open('', '_blank');

    let combinedManifestPrintContent = ''
    const { manifestHTML } = manifestLabelHTMLTemplate?.htmlData || {}

    if (manifestHTML === undefined) {
      return
    }

    const manifestTemplateFields = extractFieldsFromHTML(manifestHTML)

    selectedManifestDetails.forEach((manifestObj) => {
      const manifestDetail = { ...manifestObj }

      let printContent = `<div>${manifestHTML}</div>`
      manifestTemplateFields.forEach((field) => {
        printContent = replaceFieldWithData(printContent, field, manifestDetail[field] || NALabel)
      })

      combinedManifestPrintContent += printContent
    })

    let finalPrintContent = baseTemplate.replace(':dynamic-content', combinedManifestPrintContent)

    mywindow?.document.write(finalPrintContent)


    setTimeout(() => {
      mywindow?.document.close(); // necessary for IE >= 10
      mywindow?.focus(); // necessary for IE >= 10*/
      mywindow?.print();
      mywindow?.close();
    }, 500)

    return true;
  }, [selectedRows])

  return { handlePrintManifest, handlePrintManifestLabel }
}

export default usePrintManifest