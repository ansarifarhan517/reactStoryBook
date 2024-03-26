import React, { useState } from "react";

import { AddressForm, AddressMap } from "../../components";

const AddressMapView = ({
  dynamicLabels,
  ngStateRouter,
  isUpdateForm,
  setIsUpdateForm,
  currentPage
}) => {
  const [updateRowData, setUpdateRowData] = useState({});

  if (isUpdateForm) {
    return (
      <AddressForm
        dynamicLabels={dynamicLabels}
        setIsUpdateForm={setIsUpdateForm}
        updateRowData={updateRowData}
        currentPage={currentPage}
      />
    );
  }

  return (
    <AddressMap
      dynamicLabels={dynamicLabels}
      ngStateRouter={ngStateRouter}
      setIsUpdateForm={setIsUpdateForm}
      setUpdateRowData={setUpdateRowData}
      currentPage={currentPage}
    />
  );
};

export default AddressMapView;
