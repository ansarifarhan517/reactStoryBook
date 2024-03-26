import React, { useState } from 'react'
import { DownloadModalHeader } from '../../OverallSummary.styles';
import {
    Box,
    IconButton,
} from 'ui-library'
import DynamicLabelsReducer from '../../../../common/DynamicLabels/dynamicLabels.reducer';
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping';

const OverallDownloadModal = ( props: {handleClose?: Function, handleReportDownload?: Function, handleEsignReportDownload?: Function }) => {
  const { handleClose, handleReportDownload, handleEsignReportDownload } = props;

  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.overallSummary + ',Resources');
  return (
    <Box pb="20px" style={{ backgroundColor: "#FFF", width: "600px", position: "absolute", left: '55%', top:'10%', zIndex: 1000, boxShadow: "0 2px 20px -10px #000" }}>
    <DownloadModalHeader>
      {dynamicLabels.downloadReport}
      <button color="white" onClick={() => handleClose?.(false)}><i className="icon ui-library-icons icon-icomoon-close"></i></button>
    </DownloadModalHeader>
    <Box display="flex" px="20px" py="20px" bgColor="#fff" style={{ fontSize: 12, fontWeight: 'lighter'}}>
      <span>{dynamicLabels.overallDownloadMessage}</span>
    </Box>
    <Box display="flex" justifyContent="flex-end" px="20px" style={{ gap: "15px" }}>

        <IconButton
          id='TripSummary-Modal-button-Download'
          primary={true}
          iconVariant="download"
          iconSize="xs"
          onClick={() => {
            handleReportDownload?.();
            handleClose?.(false);
          }}
          children={dynamicLabels.downloadReport}
        />
      
        <IconButton
           id='TripSummary-Modal-button-DownloadEsign'
          primary={true}
          iconVariant="download"
          iconSize="xs"
          onClick={() => {
            handleEsignReportDownload?.();
            handleClose?.(false);
          }}
          children={dynamicLabels.overallDownloadEsign}
        />
      
    </Box>
  </Box>
  )
}

export default OverallDownloadModal;