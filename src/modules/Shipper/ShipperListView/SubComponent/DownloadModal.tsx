
import FileSaver from 'file-saver'
import React, { useState } from 'react'

import { Tooltip, IconButton, useToast } from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { sendGA } from '../../../../utils/ga'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { breadcrumbState } from '../ShipperListViewData';
import DownloadMessage from '../../../../utils/components/DownloadMessage'
const DownloadModal = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
    const fetchOptions = useTypedSelector(state => state.shipper.listView.fetchOptions)
    const breadcrumbFilter = useTypedSelector(state => state.shipper.listView.breadcrumbFilter)

    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
    const toast = useToast();

    const handleDownloadReport = async () => {
        let temp = {
            ...fetchOptions,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText
          }
          delete temp.filterOptions
       let actionPayload = {...fetchOptions}
        let filter = {
          ...fetchOptions,
          searchBy: fetchOptions.filterOptions?.searchBy,
          searchText: fetchOptions?.filterOptions?.searchText
        }
        delete temp.filterOptions
      
        if (breadcrumbFilter && breadcrumbFilter !== 'ALL') {
          if (actionPayload?.filterOptions?.searchBy && actionPayload?.filterOptions?.searchText) { 
            filter = {
              ...filter,
              searchBy: breadcrumbState[breadcrumbFilter]?.searchBy+'#@#'+actionPayload?.filterOptions.searchBy,
              searchText: breadcrumbState[breadcrumbFilter].searchText+'#@#'+actionPayload?.filterOptions.searchText,
            }
          } else {
            filter = {
              ...filter,
              searchBy: breadcrumbState[breadcrumbFilter]?.searchBy,
              searchText: breadcrumbState[breadcrumbFilter]?.searchText,
            }
          }
        }
        setShowDownloadSuccess(true)

        try {
            const { data, status } = await axios.get(apiMappings.shipper.listView.download,{
                params:filter,
                responseType: 'arraybuffer',
              })
            if (status === 200) {
                FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `LogiNext_${dynamicLabels.shipper_s} List.xlsx`)
                setShowDownloadSuccess(false)
                return
            }
        } catch (errorMessage) {
            setShowDownloadSuccess(false)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }

    }

    return <>
        <Tooltip
            message={`Download ${dynamicLabels?.shipper_s} Report.`}
            arrowPlacement='center'
            messagePlacement='end'
            hover={true}
            hide={showDownloadSuccess}
        >
            <IconButton
                iconVariant='icomoon-download'
                id="shipper--actionbar--download"
                iconSize={16}
                onlyIcon
                style={{ color: 'inherit' }}
                onClick={() => {
                    handleDownloadReport()
                    sendGA('Event New','Shipper List View - Download Report Clicked')
                }}
            />
        </Tooltip>
        {showDownloadSuccess && <DownloadMessage
            showInfoModal={showDownloadSuccess}
            onToggle={setShowDownloadSuccess}
        />}
    </>

}
export default DownloadModal
