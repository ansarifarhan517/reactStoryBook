
import FileSaver from 'file-saver'
import React, { useState } from 'react'

import { Tooltip, IconButton, useToast } from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import { sendGA } from '../../../../utils/ga'
import DownloadMessage from '../../../../utils/components/DownloadMessage'
import { breadcrumbState } from '../OrderRequestListView.effect'


const DownloadOrderRequestModal = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.orderRequest)
    const fetchOptions = useTypedSelector(state => state.orderRequest.listView.fetchOptions)
    const breadcrumbFilter = useTypedSelector(state => state.orderRequest.listView.breadcrumbFilter)
    const filterListPayload = useTypedSelector(state => state.advanceFilter.filterListPayload);

    const minDate = useTypedSelector(state => state.orderRequest.listView.minDate);
    const maxDate = useTypedSelector(state => state.orderRequest.listView.maxDate);

    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
    const toast = useToast();

    const handleDownloadReport = async () => {
        let filterOptions = fetchOptions.filterOptions
        const payload = filterListPayload || undefined
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
            status: breadcrumbFilter,
            pageName: 'BOOKING',
            sectionName: `${breadcrumbFilter}_BOOKING_LIST_VIEW`,
            endDateFilter: maxDate,
            startDateFilter: minDate,

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
        delete filter.sortOptions
        delete filter.filterOptions
        delete filter.apis
        setShowDownloadSuccess(true)

        try {
            const { data, status } = await axios.post(apiMappings.orderRequest.listView.download, payload, {
                params: filter,
                responseType: 'arraybuffer',
            })
            if (status === 200) {
                FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.booking_s} List.xlsx`)
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
            message={`${dynamicLabels?.download} ${dynamicLabels?.booking_s} ${dynamicLabels?.report}.`}
            arrowPlacement='center'
            messagePlacement='end'
            hover={true}
            hide={showDownloadSuccess}
        >
            <IconButton
                id='bookings--actionbar--download'
                iconVariant='icomoon-download'
                iconSize={16}
                onlyIcon
                style={{ color: 'inherit' }}
                onClick={() => {
                    handleDownloadReport()
                    sendGA('Event New','Order Request - Download Report Clicked')
                }}
            />
        </Tooltip>
        {showDownloadSuccess && <DownloadMessage
            showInfoModal={showDownloadSuccess}
            onToggle={setShowDownloadSuccess}
        />}
    </>

}
export default DownloadOrderRequestModal
