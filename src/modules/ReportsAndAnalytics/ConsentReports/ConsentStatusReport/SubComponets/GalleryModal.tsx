import React from "react";
import { Box, IconButton, Modal, ModalHeader } from "ui-library";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import ImagePreviewContent from "./ImagePreviewContent";

const GalleryModal = (props) => {
  const {
    isShowGalleryModal,
    setIsShowGalleryModal,
    selectedRow,
    selectedField,
  } = props;
  const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
  return (
    <Modal
      open={isShowGalleryModal}
      onToggle={(value: boolean) => {
        setIsShowGalleryModal(value);
      }}
      width="1200px"
      children={{
        header: (
          <ModalHeader
            headerTitle="Delivery Proof"
            handleClose={() => setIsShowGalleryModal(false)}
            imageVariant="icomoon-close"
            headerStyle={{ fontSize: "15px" }}
            width="100%"
          />
        ),
        content: (
          <ImagePreviewContent
            selectedRow={selectedRow}
            selectedField={selectedField}
          />
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
              onClick={() => setIsShowGalleryModal(false)}
            >
              {dynamicLabels.cancel}
            </IconButton>
          </Box>
        ),
      }}
    />
  );
};

export default GalleryModal;
