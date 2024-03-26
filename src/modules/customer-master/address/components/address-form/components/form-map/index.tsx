import React, { useState, useEffect } from "react";
import ErrorBoundary from "../../../../../../../utils/components/Form/ErrorBoundary";

import DefaultMap from "../../../../../../../utils/components/Map/MapDefault";
import { getGoogleAPIKey } from "../../../../../../../utils/components/Map/MapHelper";

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

const FormMap = ({ nodeAddress, setValue, addressString, currentPage }) => {
  const userAccessInfo = JSON.parse(
    localStorage.getItem("userAccessInfo") || "{}"
  );
  const _center =
    userAccessInfo?.["countryLatLng"]?.split(",") || FALLBACK_CENTER;
  const googleApiKey = getGoogleAPIKey();

  // Map States
  const [position, setPosition] = useState<Array<number>>([
    _center[0],
    _center[1],
  ]);
  const [searchText, setSearchText] = useState<string>(addressString);

  useEffect(() => {
    if (nodeAddress && Object.keys(nodeAddress)?.length > 0) {
      const lat = nodeAddress?.latitude || -200;
      const lng = nodeAddress?.longitude || -200;
      setPosition([lat, lng]);
      nodeAddress?.address && setSearchText(nodeAddress?.address);
    }
  }, []);

  useEffect(() => {
    setValue("latitude", position[0]);
    setValue("longitude", position[1]);
  }, [position]);

  const resetPositionCoordinates = (data: any) => {
    data && Object.keys(data)?.length && setPosition(data?.position)
  }

  return (
    <ErrorBoundary>
      <DefaultMap
        type="all_addresses"
        settingAPIParam="updateCustomerLocationMap"
        geocoding
        getPositions={setPosition}
        position={position}
        searchTextData={searchText}
        googleApiKey={googleApiKey}
        legendConfig={{ rulerControl: false }}
        isVisibleSetting
        shouldReverseGeocode
        sendLocationOutside={resetPositionCoordinates}
        currentPage={currentPage}
      />
    </ErrorBoundary>
  );
};

export default FormMap;
