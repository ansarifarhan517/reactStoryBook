import FileSaver from 'file-saver'
import React, { useState } from 'react'
import { Tooltip, IconButton, useToast, IFetchDataOptions} from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import DownloadMessage from '../../../../utils/components/DownloadMessage'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { exceptionStatusMapping } from '../ExceptionHandling.models'
import { IListViewRequestPayload } from '../../../../utils/common.interface'
import { sendGA } from '../../../../utils/ga'
import { isEmpty } from '../utils'
import moment from 'moment'

export interface IDownloadprops {
    fetchOptions: IFetchDataOptions
    downloadType: string
    selectedDate?: {
        startDate: string
        endDate: string
    }
}

const DownloadListModal = ({fetchOptions, downloadType, selectedDate} : IDownloadprops ) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.exceptionHandling)
    const exceptionStatus = useTypedSelector((state) => state.exceptionHandling.listview.raisedExceptions.breadcrumbState);

    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
    const toast = useToast();
    const handleDownloadReport = async () => {
        const date = new Date();
        const timeStamp = `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
        let payload:IListViewRequestPayload = {
            pageNumber: fetchOptions.pageNumber,
            pageSize: fetchOptions.pageSize,
            searchBy: fetchOptions.filterOptions?.searchBy,
            searchText: fetchOptions.filterOptions?.searchText,
            sortBy: fetchOptions.sortOptions?.sortBy,
            sortOrder: fetchOptions.sortOptions?.sortOrder,

        }
        switch(downloadType) {
            case 'allExceptions':
                payload = {
                    pageNumber: fetchOptions.pageNumber,
                    pageSize: fetchOptions.pageSize,
                    searchBy: fetchOptions.filterOptions?.searchBy,
                    searchText: fetchOptions.filterOptions?.searchText,
                    sortBy: fetchOptions.sortOptions?.sortBy,
                    sortOrder: fetchOptions.sortOptions?.sortOrder,
                }
            break;

            case 'orderExceptions':
                payload = {
                    module: "Orders",
                    startDateFilter: selectedDate?.startDate,
                    endDateFilter: selectedDate?.endDate,
                    exceptionStatus: exceptionStatusMapping[exceptionStatus],
                    pageNumber: fetchOptions?.pageNumber,
                    pageSize: fetchOptions?.pageSize,
                    searchBy: isEmpty(fetchOptions?.filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : 'exceptionStatus' : (exceptionStatusMapping[exceptionStatus] === "ALL") ? fetchOptions?.filterOptions?.searchBy : 'exceptionStatus' + "#@#" + fetchOptions?.filterOptions?.searchBy,
                    searchText: isEmpty(fetchOptions?.filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : exceptionStatusMapping[exceptionStatus] : (exceptionStatusMapping[exceptionStatus] === "ALL") ? fetchOptions?.filterOptions?.searchText : exceptionStatusMapping[exceptionStatus] + "#@#" + fetchOptions?.filterOptions?.searchText,
                    sortBy: fetchOptions?.sortOptions?.sortBy,
                    sortOrder: fetchOptions?.sortOptions?.sortOrder
                }
            break;

            case 'manifestsExceptions':
                payload = {
                    module: "Manifests",
                    startDateFilter: selectedDate?.startDate,
                    endDateFilter: selectedDate?.endDate,
                    exceptionStatus: exceptionStatusMapping[exceptionStatus],
                    pageNumber: fetchOptions?.pageNumber,
                    pageSize: fetchOptions?.pageSize,
                    searchBy: isEmpty(fetchOptions?.filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : 'exceptionStatus' : (exceptionStatusMapping[exceptionStatus] === "ALL") ? fetchOptions?.filterOptions?.searchBy : 'exceptionStatus' + "#@#" + fetchOptions?.filterOptions?.searchBy,
                    searchText: isEmpty(fetchOptions?.filterOptions!) ? exceptionStatusMapping[exceptionStatus] === "ALL" ? undefined : exceptionStatusMapping[exceptionStatus] : (exceptionStatusMapping[exceptionStatus] === "ALL") ? fetchOptions?.filterOptions?.searchText : exceptionStatusMapping[exceptionStatus] + "#@#" + fetchOptions?.filterOptions?.searchText,
                    sortBy: fetchOptions?.sortOptions?.sortBy,
                    sortOrder: fetchOptions?.sortOptions?.sortOrder
                }
            break;
        }

        setShowDownloadModal(true)
        try {
            const url = downloadType === 'allExceptions' ? apiMappings.exceptionHandling.listview.allExceptions.download: apiMappings.exceptionHandling.listview.raisedExceptions.download;
            let fileName = ""
            switch(downloadType) {
                case 'allExceptions':
                    fileName = dynamicLabels.exceptionReport
                break;
                case 'orderExceptions':
                    fileName = `${dynamicLabels.orderExceptionReport}_${timeStamp}`
                break;
                case 'manifestsExceptions':
                    fileName = `${dynamicLabels.mainfestExceptionReport}_${timeStamp}`
                break;
            }
            console.log('Download   Start', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
            const { data, status } = await axios.post(url,null,{params: payload, responseType: 'arraybuffer'})
            if (status === 200) {
                console.log('Download   Complete', moment(Date.now()).format('DD/MM/YYYY h:mm ss A'))
                FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${fileName}.xlsx`)
                return
            }
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }

    }

    return <>
        <Tooltip
            message={`${dynamicLabels?.download} ${downloadType === 'allExceptions' ? dynamicLabels?.allExceptions: ''} ${dynamicLabels?.report}.`}
            arrowPlacement='center'
            messagePlacement='end'
            hover={true}
        >
            <IconButton
                id="exceptions--actionbar--download"
                iconVariant='icomoon-download'
                iconSize={16}
                onlyIcon
                style={{ color: 'inherit' }}
                onClick={() => {
                    let category = '';
                    let action = ''
                    switch(downloadType) {
                        case "allExceptions":
                            category = "All Exceptions";
                            action = "Click - All Exceptions Report Download";
                        break;

                        case "orderExceptions":
                            category = "Raised Exceptions - Orders";
                            action = "Click - Order Report Download";
                        break;

                        case "manifestsExceptions":
                            category = "Raised Exceptions - Manifests";
                            action = "Click - Manifest Report Download";
                        break;
                    }

                    sendGA(category, action);
                    handleDownloadReport()
                }}
            />
        </Tooltip>
        <DownloadMessage
            showInfoModal={showDownloadModal}
            onToggle={setShowDownloadModal}
        />
    </>

}
export default DownloadListModal
