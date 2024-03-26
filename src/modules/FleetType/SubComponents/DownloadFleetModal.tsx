
import FileSaver from 'file-saver'
import React, { useState } from 'react'

import { Tooltip, IconButton, useToast } from 'ui-library'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { sendGA } from '../../../utils/ga'
import DownloadMessage from '../../../utils/components/DownloadMessage'
import { breadcrumbState } from '../FleetTypeListView.effect'
import moment from 'moment'


const DownloadFleetModal = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.fleet)
    const fetchOptions = useTypedSelector(state => state.fleet.listView.fetchOptions)
    const breadcrumbFilter = useTypedSelector(state => state.fleet.listView.breadcrumbFilter)

    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
    const toast = useToast();

    const handleDownloadReport = async () => {
        let filterOptions = fetchOptions.filterOptions
        let temp = {
            ...fetchOptions,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText
        }
        delete temp.filterOptions


        // new logic


        const breadCrumbValue = breadcrumbFilter;
        let actionPayload = { ...fetchOptions }
        let filter = {
            ...fetchOptions,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            status: breadcrumbFilter
        }
        delete temp.filterOptions

        if (breadCrumbValue && breadCrumbValue !== 'ALL') {
            if (actionPayload?.filterOptions?.searchBy && actionPayload?.filterOptions?.searchText) {
                filter = {
                    ...filter,
                    searchBy: breadcrumbState[breadCrumbValue]?.searchBy + '#@#' + actionPayload?.filterOptions.searchBy,
                    searchText: breadcrumbState[breadCrumbValue].searchText + '#@#' + actionPayload?.filterOptions.searchText,
                }
            } else {
                filter = {
                    ...filter,
                    searchBy: breadcrumbState[breadCrumbValue]?.searchBy,
                    searchText: breadcrumbState[breadCrumbValue]?.searchText,
                }
            }
        }
        setShowDownloadSuccess(true)
        console.log('Download FleetType  Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
        try {
            const { data, status } = await axios.get(apiMappings.fleet.listView.download, {
                params: filter,
                responseType: 'arraybuffer',
            })
            if (status === 200) {
            console.log('Download FleetType  Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `LogiNext_${dynamicLabels.fleet_s} List.xlsx`)
                //setShowDownloadSuccess(false) 
                return
            }
        } catch (errorMessage) {
            setShowDownloadSuccess(false)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }

    }

    return <>
        <Tooltip
            message={`Download ${dynamicLabels?.fleet_s} Report.`}
            arrowPlacement='center'
            messagePlacement='end'
            hover={true}
            hide={showDownloadSuccess}
        >
            <IconButton
                id='fleetType-DownloadModal-button-download'
                iconVariant='icomoon-download'
                iconSize={16}
                onlyIcon
                style={{ color: 'inherit' }}
                onClick={() => {
                    handleDownloadReport()
                    sendGA('Event New' ,'Fleet type ListView Button Click - Download Clicked')
                }}
            />
        </Tooltip>
        {showDownloadSuccess && <DownloadMessage
            showInfoModal={showDownloadSuccess}
            onToggle={setShowDownloadSuccess}
        />}
    </>

}
export default DownloadFleetModal
