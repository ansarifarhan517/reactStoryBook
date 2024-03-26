import React from "react";
import { Box, FontIcon } from "ui-library";

const ImagePreviewContent = ({ selectedRow, selectedField }) => {
  const data = selectedField?.split("cf_");
  return (
    <Box>
      <div style={{ maxHeight: "350px", overflow: "auto", marginTop: "30px" }}>
        <div style={{ position: "relative" }}>
          <div
            className="imageName"
            style={{ background: "#5697d3", color: "#fff", padding: "10px" }}
          >
            {selectedRow?.original[selectedField]}
            <a
              href={selectedRow?.original?.imgNameUrlMap[data[1]]}
              style={{ marginLeft: "10px", color: "#fff" }}
              target="_blank"
            >
              <FontIcon color="white" variant="icomoon-download" size={20} />
            </a>
          </div>
          <img
            style={{ maxHeight: "200px", margin: "20px auto", display: "block" ,padding:'0px 0' }}
            src={selectedRow?.original?.imgNameUrlMap[data[1]]}
          />
        </div>
      </div>
    </Box>
  );
};

export default ImagePreviewContent;
