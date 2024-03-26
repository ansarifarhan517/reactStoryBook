import React, { useState } from "react";
import { Box, BreadCrumb } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { withReactOptimized } from "../../../../utils/components/withReact";
import ConsentStatusReportForm from "./ConsentStatusReportForm/ConsentStatusReportForm";
import DownloadMessage from "../../../../utils/components/DownloadMessage";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import ErrorBoundary from "../../../../utils/components/Form/ErrorBoundary";

export const basename = "";

const ConsentStatusReport = ({ pageName }) => {
  /**Redux Hooks */
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);

  /**General Hooks */
  // const [showListView, setShowListView] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const consentDynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.consentReports)


  const breadCrumbOptions = React.useMemo(
    () => [
      { id: "reports", label: "Reports", disabled: true },
      { id: "consentReports", label: consentDynamicLabels?.CONSENT_REPORTS ? consentDynamicLabels?.CONSENT_REPORTS : "Consent Reports", disabled: true },
      {
        id: "Consent Status Report",
        label:
          pageName == "consentDetailedReport"
            ?  consentDynamicLabels?.consentDetailedReport ? consentDynamicLabels?.consentDetailedReport : "Consent Detailed Report"
            :  consentDynamicLabels?.consentStatusReport ? consentDynamicLabels?.consentStatusReport : "Consent Status Report",
        disabled: true,
      },
    ],
    [dynamicLabels]
  );

  return (
    <ErrorBoundary>
    <Box
      display="flex"
      flexDirection="column"
      style={{
        width: "100%",
        height: "100vh",
        paddingTop: "64px",
        gap: "20px",
      }}
      px="15px"
      pb="15px"
    >
      <Box
        py="15px"
        display="flex"
        justifyContent="space-between"
        style={{ width: "100%" }}
      >
        <BreadCrumb options={breadCrumbOptions} />
      </Box>
      <Box style={{ width: "100%" }}>
        <ConsentStatusReportForm
          setShowDownloadSuccess={setShowDownloadSuccess}
          pageName={pageName}
        />
      </Box>
      {showDownloadSuccess && (
        <DownloadMessage
          showInfoModal={showDownloadSuccess}
          onToggle={setShowDownloadSuccess}
        />
      )}
    </Box>
    </ErrorBoundary>
  );
};

export default withReactOptimized(ConsentStatusReport);
