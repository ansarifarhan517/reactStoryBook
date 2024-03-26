import React  from "react";
import WithUploadExcel from './withUploadExcel'
import { withPopup } from 'ui-library'
interface IUploadExcel {
  isOpen: boolean   // mandatory, to control view state of component
  featureName?: any
  onSuccess?: () => void
  onClose: () => void
}
const UploadExcel = (props: IUploadExcel) => {
  return (<WithUploadExcel 
          isOpen={props.isOpen}
          featureName={props.featureName}
          onSuccess={props.onSuccess}
          onClose={props.onClose}
      />)
  
}

export default withPopup(
  React.memo(
    UploadExcel,
    (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen
  )
);
