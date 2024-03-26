import React, { useEffect, useState } from "react";
import { Box, Modal, ModalHeader, IconButton } from "ui-library";
import { fetchContactDetails } from "../../api";
import DetailsAccordian from "../details-accordian";

const AdditionalContactsModal = ({
  clientNodeId,
  structure,
  modalVisibility,
  setModalVisibility,
  dynamicLabels,
}) => {
  const [modalData, setModalData] = useState([]);
  const [expandedId, setExpandedId] = useState(0);

  useEffect(() => {
    (async () => {
      const params = {
        clientNodeId: clientNodeId,
      };
      const response = await fetchContactDetails(params);
      setModalData(response);
    })();
  }, []);

  const handleAccordionToggle = React.useCallback(
    (id: number, isExpanded?: boolean) => {
      setExpandedId(isExpanded ? id : -1);
    },
    [setExpandedId]
  );

  return (
    <Modal
      open={modalVisibility}
      onToggle={() => setModalVisibility(false)}
      width="810px"
    >
      {{
        header: (
          <ModalHeader
            headerTitle={
              dynamicLabels?.alternateContactDetails ||
              "Additional Contact Details"
            }
            imageVariant="icomoon-close"
            width="810px"
            handleClose={() => setModalVisibility(false)}
          />
        ),
        content: modalData?.length > 0 &&
          Object.keys(structure?.columns)?.length > 0 && (
            <div className="additional-contact-modal">
              {modalData.map((eachDetail, id) => (
                <DetailsAccordian
                  customerDetails={eachDetail}
                  key={id}
                  structure={structure}
                  onToggle={handleAccordionToggle}
                  expandedId={expandedId}
                  accordianId={id}
                />
              ))}
            </div>
          ),
        footer: (
          <Box
            horizontalSpacing="10px"
            display="flex"
            justifyContent="flex-end"
            p="15px"
          >
            <IconButton
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => setModalVisibility(false)}
            >
              {dynamicLabels?.cancel || "Cancel"}
            </IconButton>
          </Box>
        ),
      }}
    </Modal>
  );
};

export default AdditionalContactsModal;
