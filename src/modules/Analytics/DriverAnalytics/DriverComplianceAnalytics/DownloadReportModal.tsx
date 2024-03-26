import React, { useState } from "react";
import { Box, DropDown, IconButton } from "ui-library";
import styled from 'styled-components';

export const DownloadModalHeader = styled.div`
  height:38px;
  background-color: rgb(86, 152, 211);
  color: rgb(255, 255, 255);
  font-size: 15px;
  padding: 0px 0.6em;
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  button {
    background-color: rgb(86, 152, 211);
    font-size: 18px;
  }
`;

const DownloadReportModal = (props: { title?: any; handleClose?: Function; handleComplianceReportDownload?: Function; handleTrackingReportDownload?: Function; selectedKPIs?: any[]; complianceReport?: boolean; trackingReport?: boolean; complianceReportButtonTitle?: string; trackingReportButtonTitle?: string; position?: { right: string | number, top: string | number }; dynamicLabels?: any; style?: any, params?: any }) => {
  const [reportType, setReportType] = useState<string>("xls");
  const { title, handleClose, handleComplianceReportDownload, handleTrackingReportDownload, selectedKPIs, complianceReport, trackingReport, complianceReportButtonTitle, trackingReportButtonTitle, position, dynamicLabels } = props;
  const options = [
    {
      value: 'csv',
      label: '.csv'
    },
    {
      value: 'xls',
      label: '.xlsx'
    },
  ]
  return (
    <Box pb="20px" style={{ backgroundColor: "#FFF", width: "600px", position: "absolute", right: position?.right, top: position?.top, zIndex: 1000, boxShadow: "0 2px 20px -10px #000" }}>
      <DownloadModalHeader>
        {title}
        <button color="white" onClick={() => handleClose?.(false)}><i className="icon ui-library-icons icon-icomoon-close"></i></button>
      </DownloadModalHeader>
      <Box display="flex" px="20px" py="20px" bgColor="#fff" style={{ fontSize: 15 }}>
        <span>{(complianceReport && trackingReport) ? dynamicLabels.ClickOnTheButtonsBelowToDownloadReportsIn : dynamicLabels.ClickOnTheButtonBelowToDownloadReportIn}</span>
        <span className="reportTypeDropDown">
          <DropDown
            variant="list-view"
            optionList={options}
            onChange={(e: string) => {
              setReportType(e)
            }}
            value={reportType}
            width="56px"
          />
        </span>
        <span>{dynamicLabels.format}.</span>
      </Box>
      <Box display="flex" justifyContent="flex-end" px="20px" style={{ gap: "15px" }}>
        {complianceReport &&
          <IconButton
            primary={true}
            iconVariant="download"
            iconSize="sm"
            onClick={() => {
              handleComplianceReportDownload?.(reportType, selectedKPIs);
              handleClose?.(false);
            }}
            children={complianceReportButtonTitle}
          />
        }
        {trackingReport &&
          <IconButton
            primary={true}
            iconVariant="download"
            iconSize="sm"
            onClick={() => {
              handleTrackingReportDownload?.(reportType, selectedKPIs);
              handleClose?.(false);
            }}
            children={trackingReportButtonTitle}
          />
        }
      </Box>
    </Box>
  );
};

export default DownloadReportModal;
