
import FileSaver from 'file-saver'
import React, { useState } from 'react'

import { Tooltip, IconButton, useToast} from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import DownloadMessage from '../../../../utils/components/DownloadMessage'
import { sendGA } from '../../../../utils/ga'


const DownloadListBranchModal = () => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.branchConfiguration)
    const fetchOptions = useTypedSelector(state => state.branchConfiguration.fetchOptions)
    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
    const toast = useToast();

    const handleDownloadReport = async () => {
        let filterOptions = fetchOptions.filterOptions
        let filter = {
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText

        }
        setShowDownloadModal(true)
        try {
            const { data, status } = await axios.post(apiMappings.branchConfiguration.listView.branchListDownload, {}, {
                params: filter,
                responseType: 'arraybuffer',
            })
            if (status === 200) {
                FileSaver.saveAs(new Blob([data], { type: "application/vnd.ms-excel xlsx" }), `${dynamicLabels.branch_s} List.xlsx`)
                return
            }
        } catch (errorMessage) {
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
        }

    }

    return <>
        <Tooltip
            message={`${dynamicLabels?.download} ${dynamicLabels?.branch_s} ${dynamicLabels?.report}.`}
            arrowPlacement='center'
            messagePlacement='end'
            hover={true}
        >
            <IconButton
                id='BranchConfig-Modal-Download'
                iconVariant='icomoon-download'
                iconSize={16}
                onlyIcon
                style={{ color: 'inherit' }}
                onClick={() => {
                    handleDownloadReport()
                    sendGA('Event New' ,'CliantBranch Download Clicked')
                }}
            />
        </Tooltip>
        <DownloadMessage
            showInfoModal={showDownloadModal}
            onToggle={setShowDownloadModal}
        />
    </>

}
export default DownloadListBranchModal
