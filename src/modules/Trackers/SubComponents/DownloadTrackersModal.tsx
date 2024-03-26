
import FileSaver from "file-saver";
import React, { useState } from "react";
import {IconButton ,Tooltip ,IFetchDataOptions,useToast} from 'ui-library'
import apiMappings from "../../../utils/apiMapping";
import axios from "../../../utils/axios";
import DownloadMessage from "../../../utils/components/DownloadMessage";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";


 
export interface IDownloadModal{
    fetchOptions: IFetchDataOptions
}

const DownloadTrackersModal =({fetchOptions})=>{
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.trackers)
    const fetchListPayload = useTypedSelector(state=>state.advanceFilter.filterListPayload)
    const toast = useToast()
    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false)
    const [isDownloadReportDisabled,setDownloadReportDisabled]= useState<boolean>(false)
    const handleDownloadReport=  async ()=>{
        
        setShowDownloadModal(true)
        setDownloadReportDisabled(true)
        const payload ={
            pageNumber: fetchOptions?.pageNumber,
            pageSize :fetchOptions?.pageSize,
            searchBy: fetchOptions?.filterOptions?.searchBy,
            searchText: fetchOptions?.filterOptions?.searchText,
            sortBy: fetchOptions?.sortOptions?.sortBy,
            sortOrder: fetchOptions?.sortOptions?.sortOrder,
        }

      try {
        const {data } = await axios.post(apiMappings.tracker.trackers.listView.trackersDownloadExcel,fetchListPayload,
           {params: payload,
            responseType: 'arraybuffer'}
            )
            FileSaver.saveAs(new Blob([data],{type:'application/vnd.ms-excel xlsx'}),`TrackerReport.xlsx`)
            setDownloadReportDisabled(false)
        
      } catch (error:any) {
            console.log(error,'error')
            toast.add(error , 'warning', false)
        
      }
    }

    return(
        <>
        <Tooltip
            message ={`Download ${dynamicLabels?.tracker_s} Report`}
            arrowPlacement ='center'
            messagePlacement= "end"
            hover={true}
   
        >
        <IconButton 
            key={'tt_DownloadTrackers'}
            iconVariant="icomoon-download"
            id='TrackersDownload-Modal-button-Download'
            disabled={isDownloadReportDisabled}
            iconSize={16}
            onlyIcon
            style={{color:'inherit'}}
            onClick={()=> {handleDownloadReport()}}
        />
        </Tooltip>
        <DownloadMessage
            showInfoModal={showDownloadModal}
            onToggle={setShowDownloadModal}
        />
        </>
    )

}

export default DownloadTrackersModal