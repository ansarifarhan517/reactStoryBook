import React, { useState, useEffect, Dispatch } from "react";
import { useDispatch } from "react-redux";

import { IconButton, useToast } from "ui-library";

import MapDefault from "../../../../../../../utils/components/Map/MapDefault";
import { getGoogleAPIKey } from "../../../../../../../utils/components/Map/MapHelper";
import { tGlobalPopupAction } from "../../../../../../common/GlobalPopup/GlobalPopup.reducer";
import { tGlobalToastActions } from "../../../../../../common/GlobalToasts/globalToast.reducer";
import OutlineBlockErrorSvg from "../../../../../../../../images/outline-block-error.svg";
import ErrorBoundary from "../../../../../../../utils/components/Form/ErrorBoundary";

import { fetchOrderCount, putUpdatedAddress } from "../../api";
import { AssignedOrdersModal } from "../../..";
import { isArrayEqual } from "../../../../../../OnboardingWrapper/BranchConfiguration/utils";

const FALLBACK_CENTER = [37.09024, -95.71289100000001];

type tAllAddressesMapProps = {
  dynamicLabels: any;
  selectedRows: { [key: string | number]: any };
  modalColumns: any;
  currentPage: string
};

const AllAddressesMap = ({
  dynamicLabels,
  selectedRows,
  modalColumns,
  currentPage
}: tAllAddressesMapProps) => {
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();
  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>();
  const toast = useToast();

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
  const [selectedRowId, setSelectedRowId] = useState(-200);
  const [nodeAddress, setNodeAddress] = useState<any>({});
  const [showAssingedOrderModal, setShowAssignedOrderModal] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalCoordinates, setModalCoordinates] = useState([]);

  useEffect(() => {
    if (Object.keys(selectedRows)?.length > 0) {
      const rowData: any = Object.values(selectedRows)?.[0];
      setNodeAddress(rowData?.nodeAddress);
      setSelectedRowId(rowData?.clientNodeId);
      const lat = rowData?.latitude || -200;
      const lng = rowData?.longitude || -200;
      setPosition([lat, lng]);

      if (isArrayEqual([lat, lng], [-200, -200])) {
        rowData?.address && setSearchText(rowData?.address);
      }
    }
  }, [selectedRows]);

  const showIntransitOrdersNote = (intransitOrderCount) => {
    globalPopupDispatch({
      type: "@@globalPopup/SET_PROPS",
      payload: {
        isOpen: true,
        title:
          dynamicLabels.addressChangeConfirmation ||
          "Update Address Confirmation",
        content: (
          <div className="all-addresses____update-form__modal-content">
            <img
              src={OutlineBlockErrorSvg}
              className="all-addresses____update-form__modal-content-image"
            />
            {`${
              dynamicLabels.thisAddressCanNotBeUpdatedAsItIsUsedFor ||
              "This address can not be updated as it is used for"
            } ${intransitOrderCount} ${
              dynamicLabels.addressIntransitOrders || "Intransit Order(s)"
            } ${
              dynamicLabels.pleaseCompleteTheseOrdersAndTryAgain ||
              "Please complete these Order(s) and try again"
            }`}
          </div>
        ),
        footer: (
          <>
            <IconButton
              iconVariant="icomoon-tick-circled"
              primary
              onClick={() =>
                globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" })
              }
            >
              {dynamicLabels.ok || "Ok"}
            </IconButton>
          </>
        ),
      },
    });
  };

  const updateNewCoordinates = async (coordiantes) => {
    setModalCoordinates(coordiantes);

    const clientNodeId =
      typeof selectedRowId === "string"
        ? parseInt(selectedRowId)
        : selectedRowId;
    const {
      hasError: fetchOrderCountHasError,
      intransitOrderCount,
      assignedOrderCount,
      message: fetchOrderCountMessage,
    } = await fetchOrderCount(clientNodeId);

    if (fetchOrderCountHasError) {
      toast.add(
        fetchOrderCountMessage || dynamicLabels.somethingWendWrong,
        "warning",
        false
      );
      return;
    }

    if (intransitOrderCount) {
      showIntransitOrdersNote(intransitOrderCount);
      return;
    }

    if (assignedOrderCount) {
      setShowAssignedOrderModal(true);
      return;
    }

    await updateLocation(clientNodeId, coordiantes);
  };

  const updateLocation = async (clientNodeId, modalCoordinates) => {

    const payload = {
      nodeAddress: {
        ...nodeAddress,
        latitude: modalCoordinates[0],
        longitude: modalCoordinates[1],
      },
      clientNodeId: clientNodeId,
    };
    const { hasError, message } = await putUpdatedAddress(payload);

    if (!hasError) {
      toastDispatch({
        type: "@@globalToast/add",
        payload: { message: message, icon: "check-round" },
      });
      return;
    } else {
      toast.add(message || dynamicLabels.somethingWendWrong, "warning", false);
      return;
    }
  };

  return (
    <>
      <ErrorBoundary>
        <MapDefault
          type="all_addresses"
          settingAPIParam="updateCustomerLocationMap"
          geocoding
          getPositions={setPosition}
          position={position}
          searchTextData={searchText}
          googleApiKey={googleApiKey}
          isEditMode
          legendConfig={{ rulerControl: false }}
          isVisibleSetting
          shouldUpdateGeocode
          onGeocodingSave={(e: any) => {
            if (selectedRowId == -200) {
              return;
            }
            updateNewCoordinates(e.position);
          }}
          shouldReverseGeocode
          currentPage={currentPage}
        />
      </ErrorBoundary>
      <AssignedOrdersModal
        isModalOpen={showAssingedOrderModal}
        setIsModalOpen={setShowAssignedOrderModal}
        dynamicLabels={dynamicLabels}
        columns={modalColumns}
        clickedRow={selectedRowId}
        onModalAction={() =>
          updateLocation(
            typeof selectedRowId === "string"
              ? parseInt(selectedRowId)
              : selectedRowId,
            modalCoordinates
          )
        }
      />
    </>
  );
};

export default AllAddressesMap;
