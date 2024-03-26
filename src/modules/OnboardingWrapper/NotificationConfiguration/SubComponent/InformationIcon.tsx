import { Tooltip } from 'ui-library';
import React from 'react';

export default function InformationIcon({ isError = false, dimension, direction, message }) {
  return (
    <Tooltip
      isWordWrap
      tooltipDirection={direction}
      messagePlacement="center"
      hover
      message={message}
    >
      <img src={isError ? "https://loginext-media-bucket-demo.s3.ap-southeast-1.amazonaws.com/images/loginext-images/error-info.svg" : "https://loginext-media-bucket-demo.s3.ap-southeast-1.amazonaws.com/images/loginext-images/info.svg"} style={{ width: dimension, height: dimension }} />
    </Tooltip>
  );
}
